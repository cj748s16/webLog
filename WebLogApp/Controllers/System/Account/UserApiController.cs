using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebLogApp.Infrastructure.Core;
using WebLogApp.ViewModels.System.Account;
using WebLogBase.Entities.System.Account;
using WebLogBase.Infrastructure;
using WebLogBase.Repositories.System.Account;

namespace WebLogApp.Controllers.System.Account
{
    //[Route("api/{language:regex(^[[a-z]]{{2}}(?:-[[A-Z]]{{2}})?$)}/system/account/[controller]")]
    //[Route("api/system/account/[controller]")]
    public class UserApiController : BaseApiController<UserApiController>
    {
        private readonly IUserRepository userRepository;

        public UserApiController(
            IUserRepository userRepository,
            IMapper mapper,
            ILogger logger,
            IStringLocalizer<UserApiController> localizer) : base(mapper, logger, localizer)
        {
            this.userRepository = userRepository;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            IEnumerable<UserViewModel> usersVM = null;

            var users = await userRepository
                .AsQueryable(u => u.Adduser)
                .OrderBy(u => u.Userid)
                .ToListAsync();

            usersVM = Mapper.Map<IEnumerable<User>, IEnumerable<UserViewModel>>(users);

            return new ObjectResult(usersVM);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int? id)
        {
            GenericResult result = null;

            var user = await userRepository.GetSingleByIdAsync(id);
            if (user != null)
            {
                var userVM = Mapper.Map<User, UserViewModel>(user);
                result = new GenericResult
                {
                    Succeeded = true,
                    CustomData = userVM
                };
            }
            else
            {
                result = new GenericResult
                {
                    Succeeded = false,
                    Message = Localizer["User not found (Id: {0})", id]
                };
            }

            return new ObjectResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> New([FromBody] UserEditViewModel userVM)
        {
            GenericResult result = null;

            try
            {
                if (ModelState.IsValid)
                {
                    //var loggedInUserId = await GetLoggedInUserId();

                    var user = Mapper.Map<UserEditViewModel, User>(userVM);

                    userRepository.Add(user);
                    await userRepository.CommitAsync();

                    result = new GenericResult
                    {
                        Succeeded = true,
                        Message = Localizer["User created"]
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

        [HttpPut]
        public async Task<IActionResult> Modify([FromBody] UserEditViewModel userVM)
        {
            GenericResult result = null;

            try
            {
                if (ModelState.IsValid)
                {
                    var user = await userRepository.GetSingleByIdAsync(userVM.Id);

                    if (user != null)
                    {
                        user.Name = userVM.Username;
                        user.PasswordStr = userVM.Password;

                        userRepository.Modify(user);
                        await userRepository.CommitAsync();

                        result = new GenericResult
                        {
                            Succeeded = true,
                            Message = Localizer["User modified"]
                        };
                    }
                    else
                    {
                        result = new GenericResult
                        {
                            Succeeded = false,
                            Message = Localizer["User not found (Id: {0})", userVM.Id]
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
