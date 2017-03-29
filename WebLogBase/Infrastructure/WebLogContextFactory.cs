using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace WebLogBase.Infrastructure
{
    class WebLogContextFactory : IDbContextFactory<WebLogContext>
    {
        public WebLogContext Create(DbContextFactoryOptions options)
        {
            var path = System.IO.Path.GetFullPath(@"..\..\..\..\WebLogApp");
            var builder = new ConfigurationBuilder()
                .SetBasePath(path)
                .AddJsonFile("appsettings.json", optional: true)
                .AddJsonFile("appsettings.development.json", optional: true)
                .AddEnvironmentVariables();
            var configuration = builder.Build();

            var sqlConnectionString = configuration.GetConnectionString("WebLogContext");
            var optionsBuilder = new DbContextOptionsBuilder();
            optionsBuilder.UseSqlServer(sqlConnectionString);
            return new WebLogContext(optionsBuilder.Options);
        }
    }
}
