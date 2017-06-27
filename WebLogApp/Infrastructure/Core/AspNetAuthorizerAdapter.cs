using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebLogBase.Infrastructure.Core;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;

namespace WebLogApp.Infrastructure.Core
{
    public sealed class AspNetAuthorizerAdapter : IAspNetAuthorizerAdapter
    {
        public Func<IAuthorizationService> Provider { get; }
        private static readonly IDictionary<string, IEnumerable<Type>> types = new Dictionary<string, IEnumerable<Type>>();

        public AspNetAuthorizerAdapter(Func<IAuthorizationService> provider)
        {
            Provider = provider;
        }

        public IEnumerable<Type> GetControllers<T>(params string[] methodNames)
        {
            var key = string.Join(";", methodNames);
            if (types.TryGetValue(key, out IEnumerable<Type> ts))
            {
                return ts;
            }

            var asm = Assembly.GetEntryAssembly();
            ts = asm.GetTypes().Where(t => IsAssignableFrom<T>(t, methodNames).Count() > 0).ToArray();
            types[key] = ts;

            return ts;
        }

        private IEnumerable<MethodInfo> IsAssignableFrom<T>(Type type, params string[] methodNames)
        {
            var typeInfo = type.GetTypeInfo();
            var result = type.IsAssignableFrom(typeof(T)) && !typeInfo.IsAbstract;
            var methods = type.GetMethods().Where(m => methodNames.Contains(m.Name) && m.IsPublic && !m.IsStatic).ToArray();
            if (!result || methods.Length <= 0)
            {
                if (typeInfo.BaseType != null && typeInfo.BaseType != typeof(Object))
                {
                    var submethods = IsAssignableFrom<T>(typeInfo.BaseType, methodNames);
                    result |= submethods != null;
                    if (result && submethods != null)
                    {
                        methods = methods.Concat(submethods).ToArray();
                    }
                }
            }
            return result ? methods : new MethodInfo[] { };
        }
    }
}
