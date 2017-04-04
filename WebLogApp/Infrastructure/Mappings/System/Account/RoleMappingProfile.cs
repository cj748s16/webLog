using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebLogApp.ViewModels.System.Account;
using WebLogBase.Entities.System.Account;

namespace WebLogApp.Infrastructure.Mappings.System.Account
{
    public class RoleMappingProfile : Profile
    {
        public RoleMappingProfile()
        {
            CreateMap<Role, RoleViewModel>()
                .ForMember(vm => vm.Rolename, map => map.MapFrom(r => r.Name));
        }
    }
}
