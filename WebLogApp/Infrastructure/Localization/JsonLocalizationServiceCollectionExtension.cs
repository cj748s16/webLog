using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Localization;

namespace Microsoft.Extensions.DependencyInjection
{
    using global::WebLogApp.Infrastructure.Localization;
    using Microsoft.Extensions.Logging;
    using SimpleInjector;
    using System.Linq.Expressions;
    using System.Reflection;

    public static class JsonLocalizationServiceCollectionExtension
    {
        public static IServiceCollection AddJsonLocalization(this IServiceCollection services, Container container)
        {
            return AddJsonLocalization(services, container, setupAction: null);
        }

        public static IServiceCollection AddJsonLocalization(this IServiceCollection services, Container container, Action<JsonLocalizationOptions> setupAction)
        {
            container.RegisterSingleton<IStringLocalizerFactory, JsonStringLocalizerFactory>();
            //container.RegisterSingleton<IStringLocalizer, JsonStringLocalizer>();

            container.ResolveUnregisteredType += (sender, args) =>
            {
                var type = args.UnregisteredServiceType;
                var typeInfo = type.GetTypeInfo();
                if (typeInfo.IsInterface && typeInfo.IsGenericType && type.GetGenericTypeDefinition() == typeof(IStringLocalizer<>))
                {
                    // using JsonStringLocalizerFactory to resolve JsonStringLocalizer instance (IStringLocalizerFactory => IStringLocalizer<>)
                    var typeArgs = type.GetGenericArguments().FirstOrDefault();
                    if (typeArgs != null)
                    {
                        var factory = container.GetInstance<IStringLocalizerFactory>();
                        args.Register(Expression.Constant(factory.Create(typeArgs), type));
                    }
                }
            };

            if (setupAction != null)
            {
                services.Configure(setupAction);
            }

            return services;
        }
    }
}
