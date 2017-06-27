using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebLogApp.ViewModels.System.Account;
using WebLogBase.Entities.System.Account;

namespace WebLogApp.Infrastructure.Mappings.System.Account
{
    public class GroupRightsMappingProfile : Profile
    {
        public GroupRightsMappingProfile()
        {
            CreateMap<GroupRights, GroupRightsViewModel>()
                .ForMember(gr => gr.Title, map => map.Ignore());

            CreateMap<GroupRightsViewModel, GroupRights>()
                .ForMember(d => d.Group, map => map.Ignore())
                .ForMember(d => d.AddUser, map => map.Ignore())
                .ForMember(d => d.Adduserid, map => map.Ignore())
                .ForMember(d => d.Adddate, map => map.Ignore());
        }
    }
}
