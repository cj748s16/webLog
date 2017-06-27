using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Localization;
using WebLogBase.Repositories.System.Account;
using Microsoft.AspNetCore.Mvc;
using WebLogApp.ViewModels.System.Account;
using Microsoft.EntityFrameworkCore;
using WebLogBase.Entities.System.Account;
using WebLogApp.Infrastructure.Core;
using NLog;
using Microsoft.AspNetCore.Authorization;
using WebLogBase.Infrastructure.Core;
using WebLogBase.Infrastructure.Menu;

namespace WebLogApp.Controllers.System.Account
{
    [Menu(Path = "system/account/group/list", Title = "Menu.Groups", Icon = "fa fa-group fa-fw", Order = 100)]
    public class GroupApiController : BaseApiController<GroupApiController>
    {
        private readonly IGroupRepository groupRepository;

        public GroupApiController(
            IGroupRepository groupRepository,
            IMapper mapper,
            ILogger logger,
            IStringLocalizer<GroupApiController> localizer) : base(mapper, logger, localizer)
        {
            this.groupRepository = groupRepository;
        }

        [Authorize("AdminOnly")]
        [HttpGet]
        public async Task<IActionResult> IndexAsync()
        {
            IEnumerable<GroupViewModel> groupsVM = null;

            var groups = await groupRepository
                .AsQueryable(g => g.Adduser)
                .OrderBy(g => g.Name)
                .ToListAsync();

            groupsVM = Mapper.Map<IEnumerable<Group>, IEnumerable<GroupViewModel>>(groups);

            return new ObjectResult(groupsVM);
        }

        [Authorize("AdminOnly")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetAsync(int? id)
        {
            GenericResult result = null;

            var group = await groupRepository.GetSingleByIdAsync(id);
            if (group != null)
            {
                var groupVM = Mapper.Map<Group, GroupViewModel>(group);
                result = new GenericResult
                {
                    Succeeded = true,
                    CustomData = groupVM
                };
            }
            else
            {
                result = new GenericResult
                {
                    Succeeded = false,
                    Message = Localizer["Group not found (Id: {0})", id]
                };
            }

            return new ObjectResult(result);
        }

        [Authorize("AdminOnly")]
        [HttpPost]
        public async Task<IActionResult> NewAsync([FromBody] GroupEditViewModel groupVM)
        {
            GenericResult result = null;

            try
            {
                if (ModelState.IsValid)
                {
                    var group = Mapper.Map<GroupEditViewModel, Group>(groupVM);

                    groupRepository.Add(group);
                    await groupRepository.CommitAsync();

                    result = new GenericResult
                    {
                        Succeeded = true,
                        Message = Localizer["Group created"]
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

        [Authorize("AdminOnly")]
        [HttpPut]
        public async Task<IActionResult> ModifyAsync([FromBody] GroupEditViewModel groupVM)
        {
            GenericResult result = null;

            try
            {
                if (ModelState.IsValid)
                {
                    var group = await groupRepository.GetSingleByIdAsync(groupVM.Id);

                    if (group != null)
                    {
                        group.Name = groupVM.Groupname;

                        groupRepository.Modify(group);
                        await groupRepository.CommitAsync();

                        result = new GenericResult
                        {
                            Succeeded = true,
                            Message = Localizer["Group modified"]
                        };
                    }
                    else
                    {
                        result = new GenericResult
                        {
                            Succeeded = false,
                            Message = Localizer["Group not found (Id: {0})", groupVM.Id]
                        };
                    }
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
