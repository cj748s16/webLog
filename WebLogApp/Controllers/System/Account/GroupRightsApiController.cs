using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Localization;
using NLog;
using WebLogBase.Infrastructure.Core;
using WebLogBase.Repositories.System.Account;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using WebLogBase.Entities.System.Account;
using WebLogApp.ViewModels.System.Account;
using WebLogBase.Infrastructure.Menu;
using WebLogApp.Infrastructure.Core;

namespace WebLogApp.Controllers.System.Account
{
    [Menu(Path = "system/account/groupr/rights", Title = "Menu.GroupsRights", Icon = "fa fa-group fa-fw", Order = 200)]
    public class GroupRightsApiController : BaseApiController<GroupRightsApiController>
    {
        private readonly IGroupRightsRepository groupRightsRepository;
        private readonly IGroupRepository groupRepository;
        private readonly IMembershipService membershipService;

        public GroupRightsApiController(
            IGroupRightsRepository groupRightsRepository,
            IGroupRepository groupRepository,
            IMembershipService membershipService,
            IMapper mapper,
            ILogger logger,
            IStringLocalizer<GroupRightsApiController> localizer) : base(mapper, logger, localizer)
        {
            this.groupRightsRepository = groupRightsRepository;
            this.groupRepository = groupRepository;
            this.membershipService = membershipService;
        }

        [Authorize("AdminOnly")]
        [HttpGet("groups")]
        public async Task<IActionResult> GroupsAsync()
        {
            IEnumerable<GroupViewModel> groupsVM = null;

            var groups = await groupRepository
                .AsQueryable()
                .OrderBy(g => g.Name)
                .ToListAsync();

            groupsVM = Mapper.Map<IEnumerable<Group>, IEnumerable<GroupViewModel>>(groups);

            return new ObjectResult(groupsVM);
        }

        [Authorize("AdminOnly")]
        [HttpGet("{groupId:int}")]
        public async Task<IActionResult> IndexAsync(int? groupId)
        {
            GenericResult result = null;

            var group = await groupRepository.GetSingleByIdAsync(groupId);
            if (group == null)
            {
                return NotFound();
            }

            try
            {
                var groupRights = await groupRightsRepository
                    .AsQueryable()
                    .Where(gr => gr.Groupid == groupId)
                    .OrderBy(gr => gr.Key)
                    .ToListAsync();

                var groupRightsVM = await GetMenuAsync(groupId, groupRights);
                if (groupRightsVM == null)
                {
                    return NotFound();
                }

                result = new GenericResult
                {
                    Succeeded = true,
                    CustomData = groupRightsVM
                };
            }
            catch (Exception ex)
            {
                result = new GenericResult
                {
                    Succeeded = false,
                    Message = ex.Message
                };

                Logger.Error(ex, ex.Message);
            }

            return new ObjectResult(result);
        }

        private async Task<IEnumerable<GroupRightsViewModel>> GetMenuAsync(int? groupId, IEnumerable<GroupRights> groupRights)
        {
            if (!groupId.HasValue)
            {
                return null;
            }

            var rootMenu = await membershipService.GetMenuAsync(HttpContext, groupId);

            return ProcessMenuParts(groupId, groupRights, rootMenu);
        }

        private IEnumerable<GroupRightsViewModel> ProcessMenuParts(int? groupId, IEnumerable<GroupRights> groupRights, MenuList menu, string pathPrefix = null)
        {
            var result = new List<GroupRightsViewModel>();

            if (string.IsNullOrWhiteSpace(pathPrefix))
            {
                pathPrefix = "";
            }
            else if (!pathPrefix.EndsWith("/", StringComparison.OrdinalIgnoreCase))
            {
                pathPrefix += "/";
            }

            var convertToBool = new Func<short?, bool?>((i) =>
            {
                if (i.HasValue)
                {
                    return Convert.ToBoolean(i.Value);
                }
                return null;
            });

            foreach (var m in menu.OrderBy(x => x.data.menu.order))
            {
                var gr = groupRights.Where(g => g.Groupid == groupId && string.Equals(g.Key, pathPrefix + m.path, StringComparison.OrdinalIgnoreCase)).FirstOrDefault();

                result.Add(new GroupRightsViewModel { Id = gr?.Id, Key = pathPrefix + m.path, Title = m.data.menu.title, Groupid = groupId, Allowed = convertToBool(gr?.Allowed), Forbidden = convertToBool(gr?.Forbidden) });

                result.AddRange(ProcessMenuParts(groupId, groupRights.Where(g => g.Groupid == groupId && (g.Key?.StartsWith(pathPrefix + m.path, StringComparison.OrdinalIgnoreCase)).GetValueOrDefault(false)), m.children, pathPrefix + m.path));
            }

            return result;
        }

        [Authorize("AdminOnly")]
        [HttpPost]
        public async Task<IActionResult> Save([FromBody] GroupRightsDataViewModel groupRightsDataVM)
        {
            GenericResult result = null;

            if (groupRightsDataVM == null)
            {
                return NotFound();
            }

            try
            {
                if (ModelState.IsValid)
                {
                    var group = await groupRepository.GetSingleByIdAsync(groupRightsDataVM.GroupId);
                    if (group == null)
                    {
                        return NotFound();
                    }

                    var groupRights = await groupRightsRepository
                        .AsQueryable()
                        .Where(gr => gr.Groupid == group.Id)
                        .ToListAsync();

                    var convertToShort = new Func<bool?, short?>((b) =>
                    {
                        if (b.HasValue)
                        {
                            return Convert.ToInt16(b.Value);
                        }
                        return null;
                    });

                    foreach (var gr in groupRightsDataVM.List)
                    {
                        var entity = groupRights.Where(x => x.Id == gr.Id).FirstOrDefault()
                            ?? groupRights.Where(x => x.Key == gr.Key).FirstOrDefault()
                            ?? new GroupRights();

                        if (gr.Allowed.GetValueOrDefault() || gr.Forbidden.GetValueOrDefault())
                        {
                            entity.Key = gr.Key;
                            entity.Group = group;
                            entity.Allowed = convertToShort(gr.Allowed).GetValueOrDefault(0);
                            entity.Forbidden = convertToShort(gr.Forbidden).GetValueOrDefault(0);

                            //WebLogBase.Infrastructure.Authentication.SessionStore.Current;

                            if (!entity.Id.HasValue)
                            {
                                groupRightsRepository.Add(entity);
                            }
                            else
                            {
                                groupRightsRepository.Modify(entity);
                            }
                        }
                        else if (entity.Id.HasValue)
                        {
                            groupRightsRepository.Delete(entity);
                        }
                    }

                    await groupRightsRepository.CommitAsync();

                    result = new GenericResult
                    {
                        Succeeded = true,
                        Message = Localizer["Group rights saved"]
                    };
                }
                else
                {
                    result = new GenericResult
                    {
                        Succeeded = false,
                        Message = Localizer["Invalid fields"]
                    };
                }
            }
            catch (Exception ex)
            {
                result = new GenericResult
                {
                    Succeeded = false,
                    Message = ex.Message
                };

                Logger.Error(ex, ex.Message);
            }

            return new ObjectResult(result);
        }
    }
}
