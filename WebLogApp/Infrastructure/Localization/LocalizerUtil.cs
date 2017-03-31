using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebLogApp.Infrastructure.Localization
{
    public static class LocalizerUtil
    {
        public static string TrimPrefix(string name, string prefix)
        {
            if (name == null) throw new ArgumentNullException(nameof(name));
            if (prefix == null) throw new ArgumentNullException(nameof(prefix));

            if (name.StartsWith(prefix, StringComparison.Ordinal))
            {
                return name.Substring(prefix.Length);
            }

            return name;
        }

        public static IEnumerable<string> ExpandPaths(string name, string baseName)
        {
            if (name == null) throw new ArgumentNullException(nameof(name));
            if (baseName == null) throw new ArgumentNullException(nameof(baseName));

            return ExpandPathIterator(name, baseName);
        }

        private static IEnumerable<string> ExpandPathIterator(string name, string baseName)
        {
            // Start replacing periods, starting at the beginning
            var components = name.Split(new[] { '.' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var expansion in ExpandPathComponents(components))
            {
                yield return expansion;
            }

            // Do the same with the name where baseName prefix is removed
            var nameWithoutPrefix = TrimPrefix(name, baseName);
            if (!string.IsNullOrWhiteSpace(nameWithoutPrefix) && !string.Equals(nameWithoutPrefix, name, StringComparison.OrdinalIgnoreCase))
            {
                nameWithoutPrefix = nameWithoutPrefix.Substring(1);
                var componentsWithoutPrefix = nameWithoutPrefix.Split(new[] { '.' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var expansion in ExpandPathComponents(componentsWithoutPrefix))
                {
                    yield return expansion;
                }
            }
        }

        private static IEnumerable<string> ExpandPathComponents(string[] components)
        {
            var expansion = new StringBuilder();

            for (var i = 0; i < components.Length; i++)
            {
                for (var j = 0; j < components.Length; j++)
                {
                    expansion.Append(components[j]).Append(j < i ? Path.DirectorySeparatorChar : '.');
                }

                // Remove trailing period
                yield return expansion.Remove(expansion.Length - 1, 1).ToString();
                expansion.Clear();
            }
        }
    }
}
