using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Localization;

namespace Microsoft.Extensions.DependencyInjection
{
    using global::WebLogApp.Infrastructure.Localization;

    public static class JsonLocalizationServiceCollectionExtension
    {
        public static IServiceCollection AddJsonLocalization(this IServiceCollection services)
        {
            return AddJsonLocalization(services, setupAction: null);
        }

        public static IServiceCollection AddJsonLocalization(this IServiceCollection services, Action<JsonLocalizationOptions> setupAction)
        {
            services.TryAdd(new ServiceDescriptor(typeof(IStringLocalizerFactory), typeof(JsonStringLocalizerFactory), ServiceLifetime.Singleton));
            services.TryAdd(new ServiceDescriptor(typeof(IStringLocalizer), typeof(JsonStringLocalizer), ServiceLifetime.Singleton));

            if (setupAction != null)
            {
                services.Configure(setupAction);
            }

            return services;
        }
    }
}
