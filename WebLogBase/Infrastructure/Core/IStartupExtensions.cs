using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SimpleInjector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace WebLogBase.Infrastructure.Core
{
    public static class IStartupExtensions
    {
        // Load all IStartup implementation from all referenced assemblies
        private static IEnumerable<IStartup> GetStartups()
        {
            var iStartupType = typeof(IStartup);
            IStartup startup;
            var list = new List<IStartup>();

            var referencedAssemblies = Assembly.GetEntryAssembly().GetReferencedAssemblies();
            foreach (var asmName in referencedAssemblies)
            {
                var asm = Assembly.Load(asmName);
                foreach (var type in asm.GetTypes().Where(t => t.GetInterfaces().Any(i => i == iStartupType)))
                {
                    startup = null;
                    var ctor = type.GetConstructor(new Type[] { });
                    if (ctor != null)
                    {
                        startup = (IStartup)ctor.Invoke(new object[] { });
                    }
                    if (startup != null)
                    {
                        list.Add(startup);
                    }
                }
            }

            return list;
        }

        // Searching and processing IStartup interface and it's implementations
        public static IServiceCollection AddExternalDLLs(this IServiceCollection services, IConfigurationRoot configuration, Container container)
        {
            RegisterExternalDLLs(configuration, container);

            return services;
        }

        // Calling IStartup.Configure() method of loaded IStartup instances
        private static void RegisterExternalDLLs(IConfigurationRoot configuration, Container container)
        {
            var startups = GetStartups();

            foreach (var startup in startups)
            {
                startup.Configure(configuration, container);
            }
        }

        // Calling IStartup.InitializeDatabase() method of loaded IStartup instances
        public static IApplicationBuilder InitializeDatabase(this IApplicationBuilder app, Container container)
        {
            var startups = GetStartups();

            foreach (var startup in startups)
            {
                startup.InitializeDatabase(container);
            }

            return app;
        }
    }
}
