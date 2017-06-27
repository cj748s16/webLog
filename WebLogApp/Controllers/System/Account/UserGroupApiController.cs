using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Localization;
using WebLogBase.Repositories.System.Account;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebLogBase.Entities.System.Account;
using WebLogApp.ViewModels.System.Account;
using WebLogApp.Infrastructure.Core;
using NLog;

namespace WebLogApp.Controllers.System.Account
{
    public class UserGroupApiController : BaseApiController<UserGroupApiController>
    {
        private readonly IUserGroupRepository userGroupRepository;
        private readonly IUserRepository userRepository;
        private readonly IGroupRepository groupRepository;

        public UserGroupApiController(
            IUserGroupRepository userGroupRepository,
            IUserRepository userRepository,
            IGroupRepository groupRepository,
            IMapper mapper,
            ILogger logger,
            IStringLocalizer<UserGroupApiController> localizer) : base(mapper, logger, localizer)
        {
            this.userGroupRepository = userGroupRepository;
            this.userRepository = userRepository;
            this.groupRepository = groupRepository;
        }

        [HttpGet("availablebyuser/{userId:int}")]
        public async Task<IActionResult> AvailableByUserAsync(int? userId)
        {
            IEnumerable<GroupViewModel> groupsVM = null;

            var groups = await userGroupRepository.AvailableByUserAsync(ug => ug.Userid == userId);

            groupsVM = Mapper.Map<IEnumerable<Group>, IEnumerable<GroupViewModel>>(groups);

            return new ObjectResult(groupsVM);
        }

        [HttpGet("assignedbyuser/{userId:int}")]
        public async Task<IActionResult> AssignedByUserAsync(int? userId)
        {
            IEnumerable<GroupViewModel> groupsVM = null;

            var groups = await userGroupRepository.AssignedByUserAsync(ug => ug.Userid == userId);

            groupsVM = Mapper.Map<IEnumerable<Group>, IEnumerable<GroupViewModel>>(groups);

            return new ObjectResult(groupsVM);
        }

        private GenericResult GetKeys(IDictionary<string, string> keys, out int? userId, out int? groupId)
        {
            groupId = null;
            var result = GetValue(keys, "userId", out userId);
            if (!userId.HasValue)
            {
                return result ?? new GenericResult
                {
                    Succeeded = false,
                    Message = Localizer["User not found (key: userId)"]
                };
            }
            result = GetValue(keys, "groupId", out groupId);
            if (!groupId.HasValue)
            {
                return result ?? new GenericResult
                {
                    Succeeded = false,
                    Message = Localizer["Group not found (key: groupId)"]
                };
            }
            return result;
        }

        [HttpPost]
        public async Task<IActionResult> AssignAsync([FromBody] IDictionary<string, string> keys)
        {
            GenericResult result = null;

            try
            {
                if (keys != null)
                {
                    result = GetKeys(keys, out int? userId, out int? groupId);

                    if (result == null)
                    {
                        Group group = null;
                        var user = await userRepository.GetSingleByIdAsync(userId);
                        if (user == null)
                        {
                            result = new GenericResult
                            {
                                Succeeded = false,
                                Message = Localizer["User not found (Id: {0})", userId]
                            };
                        }
                        else
                        {
                            group = await groupRepository.GetSingleByIdAsync(groupId);
                            if (group == null)
                            {
                                result = new GenericResult
                                {
                                    Succeeded = false,
                                    Message = Localizer["Group not found (Id: {0})", groupId]
                                };
                            }
                        }

                        if (group != null)
                        {
                            var userGroup = await userGroupRepository.GetSingleAsync(ug => ug.Userid == userId && ug.Groupid == groupId);
                            if (userGroup == null)
                            {
                                userGroup = new UserGroup
                                {
                                    User = user,
                                    Group = group,
                                    Adddate = DateTime.Now
                                };
                                userGroupRepository.Add(userGroup);
                                await userGroupRepository.CommitAsync();

                                result = new GenericResult
                                {
                                    Succeeded = true,
                                    Message = Localizer["User add to group ({0} -> {1})", user.Name, group.Name]
                                };
                            }
                            else
                            {
                                result = new GenericResult
                                {
                                    Succeeded = false,
                                    Message = Localizer["User already added to group ({0} -> {1})", user.Name, group.Name]
                                };
                            }
                        }
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

        [HttpDelete]
        public async Task<IActionResult> UnassignAsync([FromQuery] IDictionary<string, string> keys)
        {
            GenericResult result = null;

            try
            {
                if (keys != null)
                {
                    result = GetKeys(keys, out int? userId, out int? groupId);

                    if (result == null)
                    {
                        Group group = null;
                        var user = await userRepository.GetSingleByIdAsync(userId);
                        if (user == null)
                        {
                            result = new GenericResult
                            {
                                Succeeded = false,
                                Message = Localizer["User not found (Id: {0})", userId]
                            };
                        }
                        else
                        {
                            group = await groupRepository.GetSingleByIdAsync(groupId);
                            if (group == null)
                            {
                                result = new GenericResult
                                {
                                    Succeeded = false,
                                    Message = Localizer["Group not found (Id: {0})", groupId]
                                };
                            }
                        }

                        if (group != null)
                        {
                            var userGroup = await userGroupRepository.GetSingleAsync(ug => ug.Userid == userId && ug.Groupid == groupId);
                            if (userGroup != null)
                            {
                                userGroupRepository.Delete(userGroup);
                                await userGroupRepository.CommitAsync();

                                result = new GenericResult
                                {
                                    Succeeded = true,
                                    Message = Localizer["User removed from group ({0} <- {1})", user.Name, group.Name]
                                };
                            }
                            else
                            {
                                result = new GenericResult
                                {
                                    Succeeded = false,
                                    Message = Localizer["{0} is not member of {1}", user.Name, group.Name]
                                };
                            }
                        }
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
