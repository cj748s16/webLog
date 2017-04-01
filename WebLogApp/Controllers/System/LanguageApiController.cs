using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using WebLogApp.Infrastructure.Localization;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Collections.Concurrent;
using Newtonsoft.Json;
using System.Text;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;
using NLog;

namespace WebLogApp.Controllers.System
{
    public class LanguageApiController : BaseApiController<LanguageApiController>
    {
        private static CultureInfo[] supportedCultures = new CultureInfo[]
        {
            new CultureInfo("en"),
            new CultureInfo("en-US"),
            new CultureInfo("hu"),
            new CultureInfo("hu-HU")
        };

        private readonly string resourceRelativePath;
        private readonly List<string> _pathWatcher = new List<string>();
        private readonly ConcurrentDictionary<string, IDictionary<string, object>> _resourceObjectCache = new ConcurrentDictionary<string, IDictionary<string, object>>();

        public LanguageApiController(
            IMapper mapper,
            ILogger logger,
            IStringLocalizer<LanguageApiController> localizer,
            IStringLocalizerFactory locFactory) : base(mapper, logger, localizer)
        {
            if (locFactory == null)
            {
                throw new ArgumentNullException(nameof(locFactory));
            }

            if (locFactory is JsonStringLocalizerFactory)
            {
                var jsonLocFactory = (JsonStringLocalizerFactory)locFactory;
                resourceRelativePath = jsonLocFactory.ResourceRelativePath;
            }
        }

        public static IList<CultureInfo> SupportedCultures
        {
            get { return supportedCultures; }
        }

        [HttpGet]
        public IActionResult Index()
        {
            return new ObjectResult(supportedCultures.Where(c => c.IsNeutralCulture).Select(c => new { Id = c.TwoLetterISOLanguageName, c.DisplayName }).Distinct());
        }

        private IDictionary<string, object> LoadCultureTranslates(CultureInfo culture)
        {
            if (string.IsNullOrWhiteSpace(resourceRelativePath))
            {
                throw new InvalidOperationException($"ResourcesPath not defined for {nameof(IStringLocalizerFactory)}");
            }

            var currentCulture = culture;
            var cultureSuffix = $".{currentCulture.Name}.json";

            IDictionary<string, object> result;
            if (_resourceObjectCache.TryGetValue(cultureSuffix, out result))
            {
                return result;
            }

            var resourcePathParts = resourceRelativePath.Split(new[] { Path.DirectorySeparatorChar }, StringSplitOptions.RemoveEmptyEntries).ToList();
            result = new ConcurrentDictionary<string, object>();
            var files = Directory.GetFiles(resourceRelativePath, $"*{cultureSuffix}", SearchOption.AllDirectories);
            var ignoreViews = new Regex(@"\\Views\\", RegexOptions.IgnoreCase);
            foreach (var f in files)
            {
                if (ignoreViews.IsMatch(f))
                {
                    continue;
                }

                var currentResult = CreateHierarchy(resourcePathParts, cultureSuffix, (ConcurrentDictionary<string, object>)result, f);
                var resource = LoadResource(f);
                if (resource != null)
                {
                    ProcessResource(currentResult, resource);
                }
            }

            return _resourceObjectCache.GetOrAdd(cultureSuffix, result);
        }

        private JObject LoadResource(string file)
        {
            JObject resource = null;
            using (var resourceFileStream = new FileStream(file, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, FileOptions.Asynchronous | FileOptions.SequentialScan))
            using (var resourceReader = new JsonTextReader(new StreamReader(resourceFileStream, Encoding.UTF8, detectEncodingFromByteOrderMarks: true)))
            {
                resource = JObject.Load(resourceReader);
            }

            return resource;
        }

        private ConcurrentDictionary<string, object> CreateHierarchy(IEnumerable<string> resourcePathParts, string cultureSuffix, ConcurrentDictionary<string, object> result, string file)
        {
            var fileParts = file.Split(new[] { Path.DirectorySeparatorChar }, StringSplitOptions.RemoveEmptyEntries);
            var currentResult = result;
            foreach (var part in fileParts)
            {
                if (resourcePathParts.Contains(part, StringComparer.OrdinalIgnoreCase) ||
                    string.Equals(part, "Controllers", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                var p = part;
                if (p.EndsWith(cultureSuffix, StringComparison.OrdinalIgnoreCase))
                {
                    p = p.Substring(0, p.Length - cultureSuffix.Length);
                }

                if (p.EndsWith("Controller", StringComparison.OrdinalIgnoreCase))
                {
                    p = p.Substring(0, p.Length - "Controller".Length);
                    if (p.EndsWith("Api", StringComparison.OrdinalIgnoreCase))
                    {
                        p = p.Substring(0, p.Length - "Api".Length);
                    }
                }

                if (string.Equals(p, "root", StringComparison.OrdinalIgnoreCase))
                {
                    // finding *.en.json files so the en.json file ignored. That's why the trick to placing the 'root' in the current place.
                    continue;
                }

                if (string.IsNullOrWhiteSpace(p))
                {
                    continue;
                }

                AddWatcher(file);
                currentResult = (ConcurrentDictionary<string, object>)currentResult.GetOrAdd(p.ToLowerInvariant(), new ConcurrentDictionary<string, object>());
            }

            return currentResult;
        }

        private void ProcessResource(ConcurrentDictionary<string, object> result, JObject resource)
        {
            foreach (var r in resource)
            {
                if (r.Value is JObject)
                {
                    var subResult = (ConcurrentDictionary<string, object>)result.GetOrAdd(r.Key, new ConcurrentDictionary<string, object>());
                    ProcessResource(subResult, (JObject)r.Value);
                }
                else if (r.Value is JValue)
                {
                    result.GetOrAdd(r.Key, r.Value.ToString());
                }
                else if (r.Value is JArray)
                {
                    Logger.Error($"Unsupported JSON type: {r.Value.Type}");
                }
                else
                {
                    throw new NotImplementedException($"Unknown resource type: {r.Value.GetType()}");
                }
            }
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
                Logger.Trace($"{Path.GetFileName(e.OldName)} was renamed, removed from cache");
            };
            watcher.Deleted += (sender, e) =>
            {
                RemoveCachedResourceObject(e.Name);
                Logger.Trace($"{e.Name} file was deleted, removed from cache");
            };
            watcher.Changed += (sender, e) =>
            {
                RemoveCachedResourceObject(e.Name);
                Logger.Trace($"{e.Name} file was changed, removed from cache");
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
                        IDictionary<string, object> dict;
                        if (!_resourceObjectCache.TryRemove(cultureSuffix, out dict))
                        {
                            Logger.Error($"Failed to remove cached object for culture {cultureSuffix.Substring(1)}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error($"Error occurred attempting to delete cached object for culture {cultureSuffix.Substring(1)}: {ex}");
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

        [HttpGet("assets/{langId}")]
        public IActionResult GetCulture(string langId)
        {
            Logger.Trace($"GetCulture invoked: ({nameof(langId)}: '{langId}')");

            if (langId == null)
            {
                throw new ArgumentNullException(nameof(langId));
            }

            var culture = supportedCultures.Where(c => string.Equals(c.Name, langId, StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
            return new ObjectResult(LoadCultureTranslates(culture));
        }
    }
}
