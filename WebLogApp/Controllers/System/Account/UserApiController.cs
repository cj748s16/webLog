using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
using WebLogBase.Infrastructure.Core;
using WebLogBase.Infrastructure.Menu;
using WebLogBase.Repositories.System.Account;

namespace WebLogApp.Controllers.System.Account
{
    //[Route("api/{language:regex(^[[a-z]]{{2}}(?:-[[A-Z]]{{2}})?$)}/system/account/[controller]")]
    //[Route("api/system/account/[controller]")]
    [Menu(Path = "system/account/user/list", Title = "Menu.Users", Icon = "fa fa-user fa-fw", Order = 0)]
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

        [Authorize("UserOnly")]
        [HttpGet]
        public async Task<IActionResult> IndexAsync()
        {
            IEnumerable<UserViewModel> usersVM = null;

            var users = await userRepository
                .AsQueryable(u => u.Adduser)
                .OrderBy(u => u.Userid)
                .ToListAsync();

            usersVM = Mapper.Map<IEnumerable<User>, IEnumerable<UserViewModel>>(users);

            return new ObjectResult(usersVM);
        }

        [Authorize("UserOnly")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetAsync(int? id)
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

        [Authorize("UserOnly")]
        [HttpPost]
        public async Task<IActionResult> NewAsync([FromBody] UserEditViewModel userVM)
        {
            GenericResult result = null;

            try
            {
                if (ModelState.IsValid)
                {
                    //var loggedInUserId = await GetLoggedInUserId();
                    result = await CheckPasswordConfirm(userVM);
                    if (result.Succeeded)
                    {
                        var user = Mapper.Map<UserEditViewModel, User>(userVM);
                        user.PasswordStr = (string)result.CustomData;

                        await userRepository.AddAsync(user);
                        await userRepository.CommitAsync();

                        result = new GenericResult
                        {
                            Succeeded = true,
                            Message = Localizer["User created"]
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

        [Authorize("UserOnly")]
        [HttpPut]
        public async Task<IActionResult> ModifyAsync([FromBody] UserEditViewModel userVM)
        {
            GenericResult result = null;

            try
            {
                if (ModelState.IsValid)
                {
                    result = await CheckPasswordConfirm(userVM);
                    if (result.Succeeded)
                    {
                        var password = (string)result.CustomData;
                        var user = await userRepository.GetSingleByIdAsync(userVM.Id);
                        if (user != null)
                        {
                            user.Name = userVM.Username;
                            user.PasswordStr = password;

                            await userRepository.ModifyAsync(user);
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

        private async Task<GenericResult> CheckPasswordConfirm(UserEditViewModel userVM)
        {
            var cipherBytes = Convert.FromBase64String(userVM.Password);
            var password = await WebLogBase.Infrastructure.Core.CryptoService.DecryptAsync(cipherBytes);
            cipherBytes = Convert.FromBase64String(userVM.ConfirmPassword);
            var confirmPassword = await WebLogBase.Infrastructure.Core.CryptoService.DecryptAsync(cipherBytes);

            if (!string.Equals(password, confirmPassword))
            {
                return new GenericResult
                {
                    Succeeded = false,
                    Message = Localizer["validators.confirmMismatch"]
                };
            }
            else
            {
                return new GenericResult
                {
                    Succeeded = true,
                    CustomData = password
                };
            }
        }
    }
}
