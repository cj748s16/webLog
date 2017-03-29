using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebLogApp.ViewModels.System.Account;
using WebLogBase.Entities.System.Account;

namespace WebLogApp.Infrastructure.Mappings.System.Account
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            CreateMap<User, UserViewModel>()
                .ForMember(vm => vm.Username, map => map.MapFrom(u => u.Name))
                .ForMember(vm => vm.Addusername, map => map.MapFrom(u => u.Adduser.Name));

            CreateMap<UserEditViewModel, User>()
                .ForMember(d => d.Name, map => map.MapFrom(u => u.Username))
                .ForMember(d => d.Passwdexpr, map => map.Ignore())
                .ForMember(d => d.Adddate, map => map.Ignore())
                .ForMember(d => d.Adduser, map => map.Ignore())
                .ForMember(d => d.Adduserid, map => map.Ignore())
                .ForMember(d => d.Delstat, map => map.Ignore())
                .ForMember(d => d.PasswordStr, map => map.MapFrom(u => u.Password))
                .ForMember(d => d.Password, map => map.Ignore())
                .ForMember(d => d.Salt, map => map.Ignore());
        }
    }
}
