using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Localization;
using NLog;
using Microsoft.AspNetCore.Mvc;
using WebLogApp.ViewModels.System;
using WebLogApp.Infrastructure.Core;
using System.Security.Cryptography;
using System.IO;
using System.Text;
using WebLogBase.Infrastructure.Core;
using WebLogBase.Infrastructure.Authentication;
using Microsoft.AspNetCore.Authorization;

namespace WebLogApp.Controllers.System
{
    public class AuthenticationApiController : BaseApiController<AuthenticationApiController>
    {
        private readonly IMembershipService membershipService;

        class LowercaseContractResolver : Newtonsoft.Json.Serialization.DefaultContractResolver
        {
            protected override string ResolvePropertyName(string propertyName)
            {
                return propertyName.ToLower();
            }
        }

        public AuthenticationApiController(
            IMembershipService membershipService,
            IMapper mapper,
            ILogger logger,
            IStringLocalizer<AuthenticationApiController> localizer) : base(mapper, logger, localizer)
        {
            this.membershipService = membershipService;
        }

        [HttpGet]
        public async Task<IActionResult> GetClientInfoAsync()
        {
            var session = await membershipService.GetSessionAsync(HttpContext);

            return new JsonResult(session, new Newtonsoft.Json.JsonSerializerSettings { ContractResolver = new LowercaseContractResolver() });
        }

        [HttpPost]
        public async Task<IActionResult> LoginAsync([FromBody] LoginViewModel loginData)
        {
            GenericResult result = null;

            try
            {
                var success = await membershipService.LoginAsync(HttpContext, loginData.Sid, loginData.Userid, loginData.Password);
                if (!success)
                {
                    result = new GenericResult
                    {
                        Succeeded = false,
                        Message = Localizer["Invalid User ID or Password"]
                    };
                }
                else
                {
                    var session = await membershipService.GetSessionAsync(HttpContext, loginData.Sid);
                    var str = Newtonsoft.Json.JsonConvert.SerializeObject(session, new Newtonsoft.Json.JsonSerializerSettings { ContractResolver = new LowercaseContractResolver() });
                    var dict = Newtonsoft.Json.JsonConvert.DeserializeObject(str);
                    result = new GenericResult
                    {
                        Succeeded = true,
                        CustomData = dict
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

#if DEBUG
        /// <summary>
        /// Only for Development!!!
        /// </summary>
        [HttpPost("logindebug")]
        public async Task<IActionResult> LoginDebugAsync([FromBody] LoginViewModel loginData)
        {
            GenericResult result = null;

            try
            {
                var success = await membershipService.LoginDebugAsync(HttpContext, loginData.Userid);
                if (!success)
                {
                    result = new GenericResult
                    {
                        Succeeded = false,
                        Message = Localizer["Invalid User ID or Password"]
                    };
                }
                else
                {
                    result = new GenericResult
                    {
                        Succeeded = true
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
#endif

        [Authorize]
        [HttpGet("getmenu")]
        public async Task<IActionResult> GetMenuAsync()
        {
            GenericResult result = null;

            try
            {
                var rootMenu = await membershipService.GetMenuAsync(HttpContext);
                if (rootMenu != null)
                {
                    result = new GenericResult
                    {
                        Succeeded = true,
                        CustomData = rootMenu
                    };
                }
                else
                {
                    return Unauthorized();
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

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> LogoutAsync()
        {
            GenericResult result = null;

            try
            {
                if (await membershipService.LogoutAsync(HttpContext))
                {
                    result = new GenericResult
                    {
                        Succeeded = true
                    };
                }
                else
                {
                    result = new GenericResult
                    {
                        Succeeded = false
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
