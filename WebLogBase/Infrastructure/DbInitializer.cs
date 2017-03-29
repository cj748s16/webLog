using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebLogBase.Infrastructure
{
    //public static class DbInitializer
    //{
    //    //private static SimpleInjector.Container container;
    //    private static WebLogContext context;

    //    public static void Initialize(/*SimpleInjector.Container container*/)
    //    {
    //        //DbInitializer.container = container;
    //        //context = container.GetInstance<WebLogContext>();

    //        InitializeUser();
    //    }

    //    private static void InitializeUser()
    //    {
    //        if (!context.Users.Any())
    //        {
    //            var devUser = context.Users.Add(new Entities.Account.User
    //            {
    //                Userid = "dev",
    //                Name = "Developer",
    //                Salt = Convert.FromBase64String("+yhIgwWdxCLMxWaWpgNsWA=="),
    //                Password = Convert.FromBase64String("KldYcCB2ar+InCQjQaHy5XPCS+hdLRcVsQHmhvcrsTM="),
    //                Passwdexpr = new DateTime(2199, 12, 31),
    //                Adduserid = "dev",
    //                Adddate = DateTime.Now,
    //                Delstat = 0
    //            }).Entity;

    //            var devGroup = context.Groups.Add(new Entities.Account.Group
    //            {
    //                Name = "Developer",
    //                Adduser = devUser,
    //                Adddate = DateTime.Now,
    //                Delstat = 0
    //            }).Entity;

    //            context.UserGroups.Add(new Entities.Account.UserGroup
    //            {
    //                User = devUser,
    //                Group = devGroup,
    //                Adduser = devUser,
    //                Adddate = DateTime.Now
    //            });

    //            context.SaveChanges();
    //        }
    //    }
    //}
}
