using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebLogBase.Infrastructure
{
    public static class DbInitializer
    {
        private static SimpleInjector.Container container;
        private static WebLogContext context;

        public static void Initialize(SimpleInjector.Container container)
        {
            DbInitializer.container = container;
            context = container.GetInstance<WebLogContext>();

            InitializeUser();
        }

        private static void InitializeUser()
        {
            if (!context.Users.Any())
            {
                using (var trans = context.Database.BeginTransaction())
                {
                    context.Database.ExecuteSqlCommand("set identity_insert [dbo].[User] on");

                    var devUser = context.Users.Add(new Entities.System.Account.User
                    {
                        Id = 1,
                        Userid = "dev",
                        Name = "Developer",
                        Salt = Convert.FromBase64String("yvMXmQEHj2A3IS+ATdgPEw=="),
                        Password = Convert.FromBase64String("I2chcDySqd87EzU44WKZEQ=="),
                        Passwdexpr = new DateTime(2199, 12, 31),
                        Adduserid = 1,
                        Adddate = DateTime.Now,
                        Delstat = 0
                    }).Entity;
                    context.SaveChanges();

                    context.Database.ExecuteSqlCommand("set identity_insert [dbo].[User] off");

                    var devRole = context.Roles.Add(new Entities.System.Account.Role { Name = "Developer", Code = Entities.System.Account.Role.DeveloperClaimName, Adduser = devUser, Adddate = DateTime.Now, Delstat = 0 }).Entity;
                    context.Roles.Add(new Entities.System.Account.Role { Name = "Administrator", Code = Entities.System.Account.Role.AdministratorClaimName, Adduser = devUser, Adddate = DateTime.Now, Delstat = 0 });
                    context.Roles.Add(new Entities.System.Account.Role { Name = "User", Code = Entities.System.Account.Role.UserClaimName, Adduser = devUser, Adddate = DateTime.Now, Delstat = 0 });

                    var devGroup = context.Groups.Add(new Entities.System.Account.Group
                    {
                        Name = "Developer",
                        Role = devRole,
                        Adduser = devUser,
                        Adddate = DateTime.Now,
                        Delstat = 0
                    }).Entity;

                    context.UserGroups.Add(new Entities.System.Account.UserGroup
                    {
                        User = devUser,
                        Group = devGroup,
                        Adduser = devUser,
                        Adddate = DateTime.Now
                    });

                    context.SaveChanges();

                    trans.Commit();
                }
            }
        }
    }
}
