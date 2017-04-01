using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using NLog;
using SimpleInjector;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace WebLogApp.Infrastructure.Localization
{
    public class JsonStringLocalizerFactory : IStringLocalizerFactory
    {
        private readonly IHostingEnvironment _applicationEnvironment;
        private readonly ILogger _logger;
        public string ResourceRelativePath { get; private set; }
        public Container Container { get; private set; }

        private readonly ConcurrentDictionary<string, JsonStringLocalizer> _localizerCache = new ConcurrentDictionary<string, JsonStringLocalizer>();
        private static readonly string[] knownViewExtensions = new[] { ".cshtml" };

        public JsonStringLocalizerFactory(
            IHostingEnvironment applicationEnvironment,
            IOptions<JsonLocalizationOptions> localizationOptions,
            ILogger logger,
            Container container)
        {
            if (localizationOptions == null)
            {
                throw new ArgumentNullException(nameof(localizationOptions));
            }

            _applicationEnvironment = applicationEnvironment ?? throw new ArgumentNullException(nameof(applicationEnvironment));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            Container = container ?? throw new ArgumentNullException(nameof(container));

            ResourceRelativePath = localizationOptions.Value.ResourcesPath ?? string.Empty;
            if (!string.IsNullOrWhiteSpace(ResourceRelativePath))
            {
                ResourceRelativePath = ResourceRelativePath
                    .Replace(Path.AltDirectorySeparatorChar, '.')
                    .Replace(Path.DirectorySeparatorChar, '.');
            }

            logger.Trace($"Created {nameof(JsonStringLocalizerFactory)} with:{Environment.NewLine}" +
                $"  (application name: {applicationEnvironment.ApplicationName}){Environment.NewLine}" +
                $"  (resources relateive path: {ResourceRelativePath})");
        }

        public IStringLocalizer Create(Type resourceSource)
        {
            if (resourceSource == null)
            {
                throw new ArgumentNullException(nameof(resourceSource));
            }

            _logger.Trace($"Getting localizer for type {resourceSource}");

            var typeInfo = resourceSource.GetTypeInfo();
            var assembly = typeInfo.Assembly;

            var typeName = typeInfo.Name;
            if (typeName.IndexOf('`')> 0)
            {
                typeName = typeName.Substring(0, typeName.IndexOf('`'));
            }
            typeName = $"{typeInfo.Namespace}.{typeName}";

            var resourceBaseName = string.IsNullOrWhiteSpace(ResourceRelativePath)
                ? typeInfo.FullName
                : _applicationEnvironment.ApplicationName + "." + ResourceRelativePath + "."
                + LocalizerUtil.TrimPrefix(typeName, _applicationEnvironment.ApplicationName + ".");
            _logger.Trace($"Localizer basename: {resourceBaseName}");

            // making generic type to creating instance using resourceSource as generic argument (IStringLocalizer<...>: JsonStringLocalizer<...>)
            var type = typeof(JsonStringLocalizer<>).MakeGenericType(resourceSource);
            var ctor = type.GetConstructor(new[] { typeof(string), typeof(string), typeof(ILogger), typeof(IStringLocalizerFactory) });
            var invokeArgs = new object[] { resourceBaseName, _applicationEnvironment.ApplicationName, _logger, this };

            // if cached instance not found, calling the ctor and passing the calculated arguments
            return _localizerCache.GetOrAdd(resourceBaseName, (JsonStringLocalizer)ctor.Invoke(invokeArgs));
        }

        public IStringLocalizer Create(string baseName, string location)
        {
            if (baseName == null)
            {
                throw new ArgumentNullException(nameof(baseName));
            }

            _logger.Trace($"Getting localizer for baseName {baseName} and location {location}");

            location = location ?? _applicationEnvironment.ApplicationName;

            var resourceBaseName = location + "." + ResourceRelativePath + LocalizerUtil.TrimPrefix(baseName, location + ".");

            var viewExtension = knownViewExtensions.FirstOrDefault(extension => resourceBaseName.EndsWith(extension, StringComparison.OrdinalIgnoreCase));
            if (viewExtension != null)
            {
                resourceBaseName = resourceBaseName.Substring(0, resourceBaseName.Length - viewExtension.Length);
            }

            _logger.Trace($"Localizer basename: {resourceBaseName}");

            return _localizerCache.GetOrAdd(resourceBaseName, new JsonStringLocalizer(resourceBaseName, _applicationEnvironment.ApplicationName, _logger, this));
        }
    }
}
