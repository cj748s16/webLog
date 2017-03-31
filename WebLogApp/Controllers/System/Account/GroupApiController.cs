using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using WebLogBase.Repositories.System.Account;
using Microsoft.AspNetCore.Mvc;
using WebLogApp.ViewModels.System.Account;
using Microsoft.EntityFrameworkCore;
using WebLogBase.Entities.System.Account;
using WebLogApp.Infrastructure.Core;

namespace WebLogApp.Controllers.System.Account
{
    public class GroupApiController : BaseApiController<GroupApiController>
    {
        private readonly IGroupRepository groupRepository;

        public GroupApiController(
            IGroupRepository groupRepository,
            IMapper mapper,
            ILogger<GroupApiController> logger,
            IStringLocalizer<GroupApiController> localizer) : base(mapper, logger, localizer)
        {
            this.groupRepository = groupRepository;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            IEnumerable<GroupViewModel> groupsVM = null;

            var groups = await groupRepository
                .AsQueryable(g => g.Adduser)
                .OrderBy(g => g.Name)
                .ToListAsync();

            groupsVM = Mapper.Map<IEnumerable<Group>, IEnumerable<GroupViewModel>>(groups);

            return new ObjectResult(groupsVM);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int? id)
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

        [HttpPost]
        public async Task<IActionResult> New([FromBody] GroupEditViewModel groupVM)
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

                Logger.LogError(2000, ex, ex.Message);
            }

            return new ObjectResult(result);
        }

        [HttpPut]
        public async Task<IActionResult> Modify([FromBody] GroupEditViewModel groupVM)
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

                Logger.LogError(2001, ex, ex.Message);
            }

            return new ObjectResult(result);
        }
    }
}
