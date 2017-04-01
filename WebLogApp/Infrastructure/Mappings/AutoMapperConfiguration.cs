using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebLogApp.Infrastructure.Mappings.System.Account;

namespace WebLogApp.Infrastructure.Mappings
{
    public class AutoMapperConfiguration
    {
        public static IMapper Configure()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<UserMappingProfile>();
                cfg.AddProfile<GroupMappingProfile>();
                cfg.AddProfile<UserGroupMappingProfile>();
            });

            config.AssertConfigurationIsValid();
            config.CompileMappings();

            return config.CreateMapper();
        }
    }
}
