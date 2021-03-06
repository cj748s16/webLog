﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SimpleInjector;
using System;
using System.Collections.Generic;
using System.Text;
using WebLogBase.Infrastructure;
using WebLogBase.Infrastructure.Core;

namespace WebLogBase
{
    public class Startup : IStartup
    {
        // App Configuration (appsettings.json + appsettings.?.json)
        private IConfigurationRoot Configuration { get; set; }

        // DI container (SimpleInjector)
        private Container Container { get; set; }

        public void Configure(IConfigurationRoot configuration, Container container)
        {
            Configuration = configuration;
            Container = container;

            RegisterWebLogContext();
            RegisterRepositories();
            RegisterServices();
        }

        private void RegisterRepositories()
        {
            // Add repositories
            Container.Register<Repositories.System.Account.IUserRepository, Repositories.System.Account.UserRepository>();
            Container.Register<Repositories.System.Account.IRoleRepository, Repositories.System.Account.RoleRepository>();
            Container.Register<Repositories.System.Account.IGroupRepository, Repositories.System.Account.GroupRepository>();
            Container.Register<Repositories.System.Account.IGroupRightsRepository, Repositories.System.Account.GroupRightsRepository>();
            Container.Register<Repositories.System.Account.IUserGroupRepository, Repositories.System.Account.UserGroupRepository>();
        }

        private void RegisterServices()
        {
            // add services
            Container.Register<IMembershipService, MembershipService>();
        }

        private void RegisterWebLogContext()
        {
            // Add WebLogContext
            var sqlConnectionString = Configuration["ConnectionStrings:WebLogContext"];
            if (string.IsNullOrWhiteSpace(sqlConnectionString))
            {
                throw new Exception("Database ConnectionString for WebLogContext was not found");
            }

            var optionsBuilder = new DbContextOptionsBuilder();
            optionsBuilder.UseSqlServer(sqlConnectionString);
            Container.RegisterSingleton(() => new WebLogContext(optionsBuilder.Options));
        }

        public void InitializeDatabase(Container container)
        {
            DbInitializer.Initialize(container);
        }
    }
}
