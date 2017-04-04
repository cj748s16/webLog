using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Localization;
using NLog;
using WebLogBase.Entities.System.Account;
using WebLogBase.Repositories.System.Account;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebLogApp.ViewModels.System.Account;

namespace WebLogApp.Controllers.System.Account
{
    public class RoleApiController : BaseApiController<RoleApiController>
    {
        private readonly IRoleRepository roleRepository;

        public RoleApiController(
            IRoleRepository roleRepository,
            IMapper mapper, 
            ILogger logger, 
            IStringLocalizer<RoleApiController> localizer) : base(mapper, logger, localizer)
        {
            this.roleRepository = roleRepository;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            IEnumerable<RoleViewModel> rolesVM = null;

            var roles = await roleRepository
                .AsQueryable()
                .OrderBy(r => r.Id)
                .ToListAsync();

            rolesVM = Mapper.Map<IEnumerable<Role>, IEnumerable<RoleViewModel>>(roles);

            return new ObjectResult(rolesVM);
        }
    }
}
