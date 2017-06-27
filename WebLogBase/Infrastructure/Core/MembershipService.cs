using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebLogBase.Repositories.System.Account;
using WebLogBase.Entities.System.Account;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;
using System.Security.Claims;
using WebLogBase.Infrastructure.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using WebLogBase.Infrastructure.Menu;
using WebLogBase.Entities.System;

namespace WebLogBase.Infrastructure.Core
{
    public class MembershipService : IMembershipService
    {
        private readonly IUserRepository userRepository;
        private readonly IGroupRepository groupRepository;
        private readonly IGroupRightsRepository groupRightsRepository;
        private readonly IAspNetAuthorizerAdapter authorizerAdapter;

        public MembershipService(
            IUserRepository userRepository,
            IGroupRepository groupRepository,
            IGroupRightsRepository groupRightsRepository,
            IAspNetAuthorizerAdapter authorizerAdapter)
        {
            this.userRepository = userRepository;
            this.groupRepository = groupRepository;
            this.groupRightsRepository = groupRightsRepository;
            this.authorizerAdapter = authorizerAdapter;
        }

        public async Task<SessionData> GetSessionAsync(HttpContext context, string sid = null)
        {
            if (string.IsNullOrWhiteSpace(sid))
            {
                sid = await GetSidFromContextAsync(context);
            }

            return SessionStore.GetSession(context, sid);
        }

        public async Task<bool> LoginAsync(HttpContext context, string sid, string userId, string password)
        {
            var salt = await GetSaltAsync(context, sid);

            var cipherBytes = Convert.FromBase64String(password);
            var passwd = await CryptoService.DecryptAsync(cipherBytes);
            passwd = passwd.Replace(salt, "");

            var passwdParts = passwd.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
            if (passwdParts.Length != 4)
            {
                return false;
            }

            if (!string.Equals(passwdParts[0], "webLog", StringComparison.Ordinal) ||
                !string.Equals(passwdParts[2], "2017", StringComparison.Ordinal))
            {
                return false;
            }

            if (!string.Equals(userId, passwdParts[1], StringComparison.Ordinal))
            {
                return false;
            }

            var user = await userRepository.GetSingleAsync(u => string.Equals(u.Userid, userId, StringComparison.OrdinalIgnoreCase));
            if (user == null)
            {
                return false;
            }

            if (user.Delstat != 0)
            {
                return false;
            }

            if (user.Passwdexpr < DateTime.Now)
            {
                return false;
            }

            var encrypted = await UserRepository.CreatePasswordAsync(user.Userid, user.Salt, passwdParts[3]);
            if (!encrypted.SequenceEqual(user.Password))
            {
                return false;
            }

            if (!await ProcessLoginAsync(context, sid, user))
            {
                return false;
            }

            return true;
        }

        public async Task<bool> LogoutAsync(HttpContext context)
        {
            var key = await GetSidFromContextAsync(context);

            return await ProcessLogoutAsync(context, key);
        }

#if DEBUG
        /// <summary>
        /// Only for development!!
        /// </summary>
        public async Task<bool> LoginDebugAsync(HttpContext context, string userId)
        {
            var user = await userRepository.GetSingleAsync(u => string.Equals(u.Userid, userId, StringComparison.OrdinalIgnoreCase));
            if (user == null)
            {
                return false;
            }

            if (user.Delstat != 0)
            {
                return false;
            }

            if (user.Passwdexpr < DateTime.Now)
            {
                return false;
            }

            var sessionData = SessionStore.GetSession(context);
            if (!await ProcessLoginAsync(context, sessionData.Sid, user))
            {
                return false;
            }

            return true;
        }
#endif

        private async Task<bool> ProcessLoginAsync(HttpContext context, string sid, User user)
        {
            var groups = await groupRepository.AsQueryable(g => g.Role).Where(g => g.Role.Delstat == 0 && g.Delstat == 0 && g.Users.Any(u => u.Userid == user.Id)).ToListAsync();
            var roles = groups.Select(g => g.Role.Code).Distinct().ToList();
            if (roles.Count <= 0)
            {
                return false;
            }

            var claims = roles.Select(roleCode => new Claim(ClaimTypes.Role, roleCode, ClaimValueTypes.String, user.Userid)).ToList();
            claims.Add(new Claim(ClaimTypes.Name, user.Userid, ClaimValueTypes.String, user.Userid));
            claims.Add(new Claim(ClaimTypes.PrimarySid, sid));
            var identity = new ClaimsIdentity(claims, SidAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            var membershipContext = new MembershipContext
            (
                id: user.Id,
                userId: user.Userid,
                roles: roles,
                identity: identity,
                principal: principal
            );

            await context.Authentication.SignInAsync(SidAuthenticationDefaults.AuthenticationScheme, principal);

            if (!SessionStore.UserLoggedIn(sid, membershipContext))
            {
                return false;
            }

            return true;
        }

        private async Task<bool> ProcessLogoutAsync(HttpContext context, string sid)
        {
            await context.Authentication.SignOutAsync(SidAuthenticationDefaults.AuthenticationScheme);

            if (!SessionStore.UserLoggedOut(sid))
            {
                return false;
            }

            return true;
        }

        private async Task<string> GetSaltAsync(HttpContext context, string sid)
        {
            var sessionData = SessionStore.GetSession(context, sid);
            var plain = ToHex(Encoding.UTF8.GetBytes(Convert.ToBase64String(sessionData.Ipa))) + sessionData.Timestamp.ToString();
            var saltBytes = Encoding.UTF8.GetBytes(Convert.ToBase64String(await CryptoService.EncryptAsync(plain)));
            saltBytes = CryptoService.ComputeSHA512Hash(saltBytes);
            var salt = ToHex(saltBytes);
            return salt;
        }

        private string ToHex(byte[] buffer)
        {
            return string.Join("", buffer.Select(b => b.ToString("x2")));
        }

        /// <summary>
        /// Creates menu for the logged in principal
        /// </summary>
        public async Task<MenuList> GetMenuAsync(HttpContext context)
        {
            var key = await GetSidFromContextAsync(context);

            var rootMenu = new MenuList();

            if (ValidateContext(context, key, out MembershipContext membershipContext, out IAuthorizationService authorizer))
            {
                await GetAllowedListAsync(membershipContext, authorizer, rootMenu);
            }

            return rootMenu;
        }

        private async Task<string> GetSidFromContextAsync(HttpContext context)
        {
            var authInfo = await context.Authentication.GetAuthenticateInfoAsync(SidAuthenticationDefaults.AuthenticationScheme);

            string key = null;
            var claim = authInfo?.Principal?.Claims?.FirstOrDefault(c => c.Type.Equals(ClaimTypes.PrimarySid));
            if (claim != null)
            {
                key = claim.Value;
            }

            return key;
        }

        /// <summary>
        /// Creates menu for the given groupId
        /// </summary>
        public async Task<MenuList> GetMenuAsync(HttpContext context, int? groupId)
        {
            var authInfo = await context.Authentication.GetAuthenticateInfoAsync(SidAuthenticationDefaults.AuthenticationScheme);

            string key = null;
            if (authInfo.Principal.Claims.Any(c => c.Type == ClaimTypes.PrimarySid))
            {
                var claim = authInfo.Principal.Claims.FirstOrDefault(c => c.Type.Equals(ClaimTypes.PrimarySid));
                if (claim != null)
                {
                    key = claim.Value;
                }
            }

            var rootMenu = new MenuList();

            MembershipContext membershipContext;
            IAuthorizationService authorizer;
            if (ValidateContext(context, key, out membershipContext, out authorizer))
            {
                await GetAllowedListAsync(membershipContext, authorizer, rootMenu, groupId);
            }

            return rootMenu;
        }

        private bool ValidateContext(HttpContext context, string key, out MembershipContext membershipContext, out IAuthorizationService authorizer)
        {
            membershipContext = null;
            authorizer = null;

            if (string.IsNullOrWhiteSpace(key))
            {
                return false;
            }

            var sessionData = SessionStore.GetSession(context, key);
            if (sessionData == null)
            {
                return false;
            }

            membershipContext = sessionData.Context;
            if (membershipContext == null)
            {
                return false;
            }

            authorizer = authorizerAdapter.Provider();
            if (authorizer == null)
            {
                return false;
            }

            return true;
        }

        private static readonly IDictionary<string, MenuItem> BasicMenus = new Dictionary<string, MenuItem>()
        {
            { "home", new MenuItem { ForceAdd = true, path = "home", data = new MenuData { menu = new Menu.Menu { title = "Home", icon = "fa fa-home fa-fw", order = 0 } } } },
            { "system", new MenuItem { path = "system", data = new MenuData { menu = new Menu.Menu { title = "Menu.System", icon = "fa fa-wrench fa-fw", order = 100 } } } },
            { "system/account", new MenuItem { path = "account", data = new MenuData { menu = new Menu.Menu { title = "Menu.Account", icon = "fa fa-user fa-fw", order = 0 } } } },
            //{ "system/login", new MenuItem { ForceAdd = true, path = "login", data = new MenuData { menu = new Menu.Menu { title = "Menu.Login", icon = "fa fa-user fa-fw", order = 999 } } } }
        };

        private Menu.MenuItem GetSubMenu(MenuList parent, string[] paths)
        {
            if (paths != null && paths.Length > 0)
            {
                var subMenu = parent.Where(m => string.Equals(m.path, paths[0], StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
                if (subMenu == null)
                {
                    subMenu = new Menu.MenuItem { path = paths[0] };
                    parent.Add(subMenu);
                }
                if (paths.Length > 2 /*&& !string.Equals(paths[1], "list", StringComparison.OrdinalIgnoreCase)*/)
                {
                    return GetSubMenu(subMenu.children, paths.Skip(1).ToArray());
                }
                else
                {
                    if (paths.Length > 1)
                    {
                        subMenu.path = string.Join("/", paths);
                    }
                    return subMenu;
                }
            }
            return null;
        }

        private void MergeBasicMenus(MenuList menu, string pathPrefix = null)
        {
            if (string.IsNullOrWhiteSpace(pathPrefix))
            {
                pathPrefix = "";
            }
            else if (!pathPrefix.EndsWith("/", StringComparison.OrdinalIgnoreCase))
            {
                pathPrefix += "/";
            }

            foreach (var m in menu)
            {
                if (BasicMenus.TryGetValue(pathPrefix + m.path, out MenuItem bm))
                {
                    m.data.menu.title = bm.data.menu.title;
                    m.data.menu.icon = bm.data.menu.icon;
                    m.data.menu.order = bm.data.menu.order;
                }

                if (!m.ForceAdd)
                {
                    // Adding menu items, which don't have Controller
                    var list = BasicMenus.Where(b => b.Key.StartsWith(pathPrefix + m.path) && b.Value.ForceAdd).Select(b => b.Value).ToList();
                    if (list.Count > 0)
                    {
                        m.children.AddRange(list);
                    }
                }

                MergeBasicMenus(m.children, pathPrefix + m.path);

                m.children = new MenuList(m.children.OrderBy(c => c.data.menu.order).ToArray());
            }

            if (string.IsNullOrWhiteSpace(pathPrefix))
            {
                // Adding root menu items, which don't have Controller
                var list = BasicMenus.Where(b => !menu.Any(m => b.Key.StartsWith(m.path))).Select(b => b.Value).ToList();
                if (list.Count > 0)
                {
                    menu.AddRange(list);
                    menu.Sort((mi1, mi2) =>
                    {
                        if (mi1?.data?.menu?.order == null && mi2?.data?.menu?.order == null) return 0;
                        else if (mi1?.data?.menu?.order == null) return -1;
                        else if (mi2?.data?.menu?.order == null) return 1;
                        else return mi1.data.menu.order.GetValueOrDefault().CompareTo(mi2.data.menu.order.GetValueOrDefault());
                    });
                }
            }
        }

        /// <summary>
        /// Creates menu for the logged in principal
        /// </summary>
        private async Task<bool> GetAllowedListAsync(MembershipContext membershipContext, IAuthorizationService authorizer, MenuList rootMenu)
        {
            var allowedList = await GetListOfControllersAsync(membershipContext, authorizer);

            if (allowedList == null || allowedList.Count() <= 0)
            {
                return false;
            }

            var groupRightsList = await GetGroupRightsListAsync(membershipContext.Userid);

            foreach (var type in allowedList)
            {
                var menuAttr = type.GetCustomAttribute<MenuAttribute>(true);
                if (menuAttr != null && !string.IsNullOrWhiteSpace(menuAttr.Path))
                {
                    var forbidden = groupRightsList.Where(gr => menuAttr.Path.StartsWith(gr.Key, StringComparison.Ordinal)).Any(gr => gr.Forbidden != 0);
                    if (!forbidden)
                    {
                        var paths = menuAttr.Path.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
                        var menu = GetSubMenu(rootMenu, paths);
                        if (menu != null)
                        {
                            menu.data.menu.title = menuAttr.Title;
                            menu.data.menu.icon = menuAttr.Icon;
                            menu.data.menu.order = menuAttr.Order;
                        }
                    }
                }
            }

            MergeBasicMenus(rootMenu);

            return true;
        }

        /// <summary>
        /// Creates menu for the given groupId
        /// </summary>
        private async Task<bool> GetAllowedListAsync(MembershipContext membershipContext, IAuthorizationService authorizer, MenuList rootMenu, int? groupId)
        {
            var allowedList = await GetListOfControllersAsync(membershipContext, authorizer, groupId);

            if (allowedList == null || allowedList.Count() <= 0)
            {
                return false;
            }

            foreach (var type in allowedList)
            {
                var menuAttr = type.GetCustomAttribute<MenuAttribute>(true);
                if (menuAttr != null && !string.IsNullOrWhiteSpace(menuAttr.Path))
                {
                    var paths = menuAttr.Path.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
                    var menu = GetSubMenu(rootMenu, paths);
                    if (menu != null)
                    {
                        menu.data.menu.title = menuAttr.Title;
                        menu.data.menu.icon = menuAttr.Icon;
                        menu.data.menu.order = menuAttr.Order;
                    }
                }
            }

            MergeBasicMenus(rootMenu);

            return true;
        }

        private async Task<IEnumerable<TypeInfo>> GetListOfControllersAsync(MembershipContext membershipContext, IAuthorizationService authorizer, int? groupId = null)
        {
            ClaimsPrincipal principal = membershipContext.Principal;
            if (groupId.HasValue)
            {
                // If groupId is present, then uses that's roles for authorize, otherwise using real principal's roles
                principal = await CreateFakePrincipal(membershipContext, groupId);
                if (principal == null)
                {
                    throw new ArgumentOutOfRangeException(nameof(principal));
                }
            }

            var allowedList = new List<TypeInfo>();
            var controllersList = authorizerAdapter.GetControllers<Controller>("Index", "IndexAsync");
            foreach (var type in controllersList)
            {
                var method = type.GetMethod("Index", BindingFlags.Public | BindingFlags.Instance)
                    ?? type.GetMethod("IndexAsync", BindingFlags.Public | BindingFlags.Instance);
                if (method != null)
                {
                    var authorizeAttribute = method.GetCustomAttribute<AuthorizeAttribute>(true);
                    if (authorizeAttribute != null)
                    {
                        if (string.IsNullOrWhiteSpace(authorizeAttribute.ActiveAuthenticationSchemes) || string.Equals(authorizeAttribute.ActiveAuthenticationSchemes, membershipContext.Identity.AuthenticationType))
                        {
                            var allow = await authorizer.AuthorizeAsync(principal, authorizeAttribute.Policy);
                            if (allow)
                            {
                                allowedList.Add(type.GetTypeInfo());
                            }
                        }
                    }
                    else
                    {
                        allowedList.Add(type.GetTypeInfo());
                    }
                }
            }
            return allowedList;
        }

        private async Task<ClaimsPrincipal> CreateFakePrincipal(MembershipContext membershipContext, int? groupId)
        {
            if (!groupId.HasValue)
            {
                throw new ArgumentNullException(nameof(groupId));
            }

            var group = await groupRepository.AsQueryable(g => g.Role).Where(g => g.Role.Delstat == 0 && g.Delstat == 0 && g.Id == groupId).ToListAsync();
            var roles = group.Select(g => g.Role.Code).Distinct().ToList();
            if (roles.Count <= 0)
            {
                return null;
            }

            var claims = roles.Select(roleCode => new Claim(ClaimTypes.Role, roleCode, ClaimValueTypes.String, membershipContext.Userid)).ToList();
            var identity = new ClaimsIdentity(claims, SidAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            return principal;
        }

        private async Task<IEnumerable<GroupRightsView>> GetGroupRightsListAsync(string userId)
        {
            return await groupRightsRepository.GroupRightsViewAsync(grv => string.Equals(grv.Userid, userId, StringComparison.OrdinalIgnoreCase));
        }
    }
}
