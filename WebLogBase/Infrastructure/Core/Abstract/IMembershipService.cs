using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using WebLogBase.Infrastructure.Authentication;
using WebLogBase.Infrastructure.Menu;

namespace WebLogBase.Infrastructure.Core
{
    public interface IMembershipService
    {
        Task<SessionData> GetSessionAsync(HttpContext httpContext, string sid = null);
        Task<bool> LoginAsync(HttpContext context, string sid, string userId, string password);
        Task<bool> LogoutAsync(HttpContext context);
#if DEBUG
        /// <summary>
        /// Only for Development!!!
        /// </summary>
        Task<bool> LoginDebugAsync(HttpContext context, string userId);
#endif

        Task<MenuList> GetMenuAsync(HttpContext context);
        Task<MenuList> GetMenuAsync(HttpContext context, int? groupId);
    }
}
