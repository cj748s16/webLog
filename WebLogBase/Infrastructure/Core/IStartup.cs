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
    public interface IStartup
    {
        void Configure(IConfigurationRoot configuration, Container container);
    }

    public static class SetupServiceCollectionExtensions
    {
        // Searching and processing IStartup interface and it's implementations
        public static IServiceCollection AddExternalDLLs(this IServiceCollection services, IConfigurationRoot configuration, Container container)
        {
            RegisterExternalDLLs(configuration, container);

            return services;
        }

        private static void RegisterExternalDLLs(IConfigurationRoot configuration, Container container)
        {
            var iStartupType = typeof(IStartup);
            IStartup startup;

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
                        startup.Configure(configuration, container);
                    }
                }
            }
        }
    }
}
