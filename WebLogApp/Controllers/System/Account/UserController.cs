using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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
    [Route("api/system/account/[controller]")]
    public class UserController : BaseController<UserController>
    {
        private readonly IUserRepository userRepository;

        public UserController(
            IUserRepository userRepository,
            IMapper mapper,
            ILogger<UserController> logger) : base(mapper, logger)
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
            UserViewModel userVM = null;

            var user = await userRepository.GetSingleByIdAsync(id);

            if (user != null)
            {
                userVM = Mapper.Map<User, UserViewModel>(user);
            }

            return new ObjectResult(userVM);
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
                        Message = "User created"
                    };
                }
                else
                {
                    result = new GenericResult
                    {
                        Succeeded = false,
                        Message = "Invalid fields"
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

                Logger.LogError(1000, ex, ex.Message);
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
                            Message = "User modified"
                        };
                    }
                    else
                    {
                        result = new GenericResult
                        {
                            Succeeded = false,
                            Message = $"User not found (Id: {userVM.Id})"
                        };
                    }
                }
                else
                {
                    result = new GenericResult
                    {
                        Succeeded = false,
                        Message = "Invalid fields"
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

                Logger.LogError(1001, ex, ex.Message);
            }

            return new ObjectResult(result);
        }
    }
}
