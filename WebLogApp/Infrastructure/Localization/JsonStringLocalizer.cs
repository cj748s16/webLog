using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NLog;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace WebLogApp.Infrastructure.Localization
{
    public class JsonStringLocalizer : IStringLocalizer
    {
        private readonly ConcurrentDictionary<string, Lazy<JObject>> _resourceObjectCache = new ConcurrentDictionary<string, Lazy<JObject>>();

        protected readonly string _baseName;
        protected readonly string _applicationName;
        protected readonly ILogger _logger;
        protected readonly IStringLocalizerFactory _factory;
        private readonly IEnumerable<string> _resourceFileLocations;
        private readonly List<string> _pathWatcher = new List<string>();

        public JsonStringLocalizer(string baseName, string applicationName, ILogger logger, IStringLocalizerFactory factory)
        {
            _baseName = baseName ?? throw new ArgumentNullException(nameof(baseName));
            _applicationName = applicationName ?? throw new ArgumentNullException(nameof(applicationName));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _factory = factory ?? throw new ArgumentNullException(nameof(factory));

            logger.Trace($"Created {GetType().Name} with:{Environment.NewLine}" +
                $"  (base name: {baseName}){Environment.NewLine}" +
                $"  (application name: {applicationName}){Environment.NewLine}");

            _resourceFileLocations = LocalizerUtil.ExpandPaths(baseName, applicationName).ToList();
            foreach (var resFileLocation in _resourceFileLocations)
            {
                logger.Trace($"Resource file location base path: {resFileLocation}");
            }
        }

        public LocalizedString this[string name, params object[] arguments]
        {
            get
            {
                if (name == null)
                {
                    throw new ArgumentNullException(nameof(name));
                }

                var format = GetLocalizedString(name, CultureInfo.CurrentUICulture);
                string value;
                if (format == null)
                {
                    value = TryParent(name, out format, arguments);
                }
                else
                {
                    value = string.Format(format ?? name, arguments);
                }
                return new LocalizedString(name, value, resourceNotFound: format == null);
            }
        }

        protected virtual string TryParent(string name, out string format, params object[] arguments)
        {
            format = null;
            return null;
        }

        public LocalizedString this[string name]
        {
            get
            {
                if (name == null)
                {
                    throw new ArgumentNullException(nameof(name));
                }

                var value = GetLocalizedString(name, CultureInfo.CurrentUICulture);
                value = value ?? TryParent(name);
                return new LocalizedString(name, value ?? name, resourceNotFound: value == null);
            }
        }

        protected virtual string TryParent(string name)
        {
            return null;
        }

        protected string GetLocalizedString(string name, CultureInfo culture)
        {
            if (name == null)
            {
                throw new ArgumentNullException(nameof(name));
            }

            //var currentCulture = CultureInfo.CurrentCulture;
            var currentCulture = culture;
            CultureInfo previousCulture = null;
            while (previousCulture != currentCulture)
            {
                var resourceObject = GetResourceObject(currentCulture);
                if (resourceObject == null)
                {
                    _logger.Info($"No resource file found or error occurred for base name {_baseName}, culture {currentCulture} and key '{name}'");
                }
                else
                {
                    JToken value;
                    if (resourceObject.TryGetValue(name, out value))
                    {
                        return value.ToString();
                    }
                }

                // Consult parent culture
                previousCulture = currentCulture;
                currentCulture = currentCulture.Parent;
                _logger.Trace($"Switching to parent culture {currentCulture} for key '{name}'.");
            }

            _logger.Info($"Could not find key '{name}' in resource file for base name {_baseName} and culture {CultureInfo.CurrentCulture}");
            return null;
        }

        private JObject GetResourceObject(CultureInfo currentCulture)
        {
            if (currentCulture == null)
            {
                throw new ArgumentNullException(nameof(currentCulture));
            }

            _logger.Trace($"Attempt to get resource object for culture {currentCulture}");
            var cultureSuffix = "." + currentCulture.Name;
            cultureSuffix = cultureSuffix == "." ? "" : cultureSuffix;

            Lazy<JObject> lazyJObjectGetter;
            if (_resourceObjectCache.TryGetValue(cultureSuffix, out lazyJObjectGetter))
            {
                // Using cache
                return lazyJObjectGetter.Value;
            }

            lazyJObjectGetter = new Lazy<JObject>(() =>
            {
                // First attempt to find a resource file location that exists
                string resourcePath = null;
                foreach (var resourceFileLocation in _resourceFileLocations)
                {
                    resourcePath = resourceFileLocation + cultureSuffix + ".json";
                    if (File.Exists(resourcePath))
                    {
                        _logger.Info($"Resource file location {resourcePath} found");
                        break;
                    }
                    else
                    {
                        _logger.Trace($"Resource file location {resourcePath} does not exist");
                        resourcePath = null;
                    }
                }
                if (resourcePath == null)
                {
                    _logger.Trace($"No resource fiel foudn for suffix {cultureSuffix}");
                    return null;
                }

                // Found a resource file path: attempt to parse it into a JObject
                try
                {
                    AddWatcher(resourcePath);

                    using (var resourceFileStream = new FileStream(resourcePath, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, FileOptions.Asynchronous | FileOptions.SequentialScan))
                    using (var resourceReader = new JsonTextReader(new StreamReader(resourceFileStream, Encoding.UTF8, detectEncodingFromByteOrderMarks: true)))
                    {
                        return JObject.Load(resourceReader);
                    }
                }
                catch (Exception ex)
                {
                    _logger.Error($"Error occurred attempting to read JSON resource file {resourcePath}: {ex}");
                    return null;
                }
            }, LazyThreadSafetyMode.ExecutionAndPublication);

            var value = lazyJObjectGetter.Value;
            if (value != null)
            {
                _resourceObjectCache.GetOrAdd(cultureSuffix, lazyJObjectGetter);
            }
            return value;
        }

        private void AddWatcher(string resourcePath)
        {
            var fullPath = Path.GetFullPath(Path.GetDirectoryName(resourcePath));
            if (_pathWatcher.Contains(fullPath))
            {
                return;
            }

            _pathWatcher.Add(fullPath);
            var watcher = new FileSystemWatcher(fullPath, "*" + Path.GetExtension(resourcePath))
            {
                NotifyFilter = NotifyFilters.FileName | NotifyFilters.LastWrite | NotifyFilters.DirectoryName
            };
            watcher.Renamed += (sender, e) =>
            {
                RemoveCachedResourceObject(e.OldName);
                _logger.Trace($"{Path.GetFileName(e.OldName)} was renamed, removed from cache");
            };
            watcher.Deleted += (sender, e) =>
            {
                RemoveCachedResourceObject(e.Name);
                _logger.Trace($"{e.Name} file was deleted, removed from cache");
            };
            watcher.Changed += (sender, e) =>
            {
                RemoveCachedResourceObject(e.Name);
                _logger.Trace($"{e.Name} file was changed, removed from cache");
            };
            watcher.EnableRaisingEvents = true;
        }

        private void RemoveCachedResourceObject(string name)
        {
            var cultureSuffix = GetCultureSuffixFromFileName(name);
            if (!string.IsNullOrWhiteSpace(cultureSuffix))
            {
                try
                {
                    if (_resourceObjectCache.ContainsKey(cultureSuffix))
                    {
                        Lazy<JObject> lazyJObject;
                        if (!_resourceObjectCache.TryRemove(cultureSuffix, out lazyJObject))
                        {
                            _logger.Error($"Failed to remove cached object for culture {cultureSuffix.Substring(1)}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.Error($"Error occurred attempting to delete cached object for culture {cultureSuffix.Substring(1)}: {ex}");
                }
            }
        }

        private string GetCultureSuffixFromFileName(string filename)
        {
            filename = Path.GetFileNameWithoutExtension(filename);
            var cultureSuffix = "." + filename.Split(new[] { '.' }, StringSplitOptions.RemoveEmptyEntries).LastOrDefault();
            cultureSuffix = cultureSuffix == "." ? "" : cultureSuffix;
            return cultureSuffix;
        }

        public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures) => GetAllStrings(includeParentCultures, CultureInfo.CurrentUICulture);

        protected IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures, CultureInfo culture)
        {
            if (culture == null)
            {
                throw new ArgumentNullException(nameof(culture));
            }

            throw new NotImplementedException();
        }

        public virtual IStringLocalizer WithCulture(CultureInfo culture)
        {
            if (culture == null)
            {
                return new JsonStringLocalizer(_baseName, _applicationName, _logger, _factory);
            }

            throw new NotImplementedException();
        }
    }

    public class JsonStringLocalizer<T> : JsonStringLocalizer, IStringLocalizer<T>
    {
        public JsonStringLocalizer(string baseName, string applicationName, ILogger logger, IStringLocalizerFactory factory) : base(baseName, applicationName, logger, factory)
        {
        }

        protected override string TryParent(string name)
        {
            var type = typeof(T);
            var typeInfo = type.GetTypeInfo();
            var baseType = typeInfo.BaseType;
            var baseTypeInfo = baseType.GetTypeInfo();
            if (!baseTypeInfo.IsAbstract)
            {
                var localizerType = typeof(IStringLocalizer<>).MakeGenericType(baseType);
                var localizer = ((JsonStringLocalizerFactory)_factory).Container.GetInstance(localizerType);

                if (localizer != null)
                {
                    var jsonStringLocalizerType = typeof(JsonStringLocalizer<>).MakeGenericType(baseType);
                    var method = jsonStringLocalizerType.GetMethod("GetLocalizedString", BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.Instance | BindingFlags.InvokeMethod);
                    if (method != null)
                    {
                        return (string)method.Invoke(localizer, new object[] { name, CultureInfo.CurrentUICulture });
                    }
                }
            }

            return null;
        }

        protected override string TryParent(string name, out string format, params object[] arguments)
        {
            format = TryParent(name);
            return string.Format(format ?? name, arguments);
        }

        public override IStringLocalizer WithCulture(CultureInfo culture)
        {
            if (culture == null)
            {
                return new JsonStringLocalizer<T>(_baseName, _applicationName, _logger, _factory);
            }

            throw new NotImplementedException();
        }
    }
}
