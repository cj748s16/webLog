using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebLogApp.ViewModels.System.Account;
using WebLogBase.Entities.System.Account;

namespace WebLogApp.Infrastructure.Mappings.System.Account
{
    public class GroupMappingProfile : Profile
    {
        public GroupMappingProfile()
        {
            CreateMap<Group, GroupViewModel>()
                .ForMember(vm => vm.Groupname, map => map.MapFrom(g => g.Name))
                .ForMember(vm => vm.Addusername, map => map.MapFrom(g => g.Adduser.Name))
                .ForMember(vm => vm.Rolename, map => map.MapFrom(g => g.Role.Name));

            CreateMap<GroupEditViewModel, Group>()
                .ForMember(d => d.Name, map => map.MapFrom(vm => vm.Groupname))
                .ForMember(d => d.Adddate, map => map.Ignore())
                .ForMember(d => d.Adduser, map => map.Ignore())
                .ForMember(d => d.Adduserid, map => map.Ignore())
                .ForMember(d => d.Delstat, map => map.Ignore())
                .ForMember(d => d.Users, map => map.Ignore())
                .ForMember(d => d.Role, map => map.Ignore());
        }
    }
}
