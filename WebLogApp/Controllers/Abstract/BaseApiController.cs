using AutoMapper;
using Microsoft.Extensions.Localization;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using WebLogApp.Infrastructure.Core;
using WebLogBase.Infrastructure;

namespace WebLogApp.Controllers
{
    public abstract class BaseApiController<T> : ApiController
        where T : BaseApiController<T>
    {
        protected IMapper Mapper { get; }
        protected ILogger Logger { get; }
        protected IStringLocalizer<T> Localizer { get; }

        public BaseApiController(IMapper mapper, ILogger logger, IStringLocalizer<T> localizer)
        {
            this.Mapper = mapper;
            this.Logger = logger;
            this.Localizer = localizer;
        }

        protected GenericResult GetValue<TValue>(IDictionary<string, string> keys, string key, out TValue? value)
            where TValue : struct
        {
            if (keys != null && keys.ContainsKey(key))
            {
                var val = keys[key];
                if (val == null)
                {
                    value = null;
                }
                else
                {
                    try
                    {
                        value = (TValue?)Convert.ChangeType(val, typeof(TValue));
                    }
                    catch (Exception ex)
                    {
                        value = null;
                        return new GenericResult
                        {
                            Succeeded = false,
                            Message = ex.Message
                        };
                    }
                }
                return null;
            }
            else
            {
                value = null;
                return new GenericResult
                {
                    Succeeded = false,
                    Message = Localizer["Key not found (key: {0})", key]
                };
            }
        }
    }
}
