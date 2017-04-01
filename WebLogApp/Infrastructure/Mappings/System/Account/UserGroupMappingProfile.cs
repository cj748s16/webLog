using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebLogApp.ViewModels.System.Account;
using WebLogBase.Entities.System.Account;

namespace WebLogApp.Infrastructure.Mappings.System.Account
{
    public class UserGroupMappingProfile : Profile
    {
        public UserGroupMappingProfile()
        {
            CreateMap<UserGroup, UserGroupViewModel>()
                .ForMember(vm => vm.Username, map => map.MapFrom(ug => ug.User.Name))
                .ForMember(vm => vm.Groupname, map => map.MapFrom(ug => ug.Group.Name))
                .ForMember(vm => vm.Addusername, map => map.MapFrom(ug => ug.Adduser.Name));
        }
    }
}
