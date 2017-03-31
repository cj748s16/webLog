using AutoMapper;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using WebLogBase.Infrastructure;

namespace WebLogApp.Controllers
{
    public abstract class BaseApiController<T> : ApiController
        where T : BaseApiController<T>
    {
        protected IMapper Mapper { get; }
        protected ILogger<T> Logger { get; }
        protected IStringLocalizer<T> Localizer { get; }

        public BaseApiController(IMapper mapper, ILogger<T> logger, IStringLocalizer<T> localizer)
        {
            this.Mapper = mapper;
            this.Logger = logger;
            this.Localizer = localizer;
        }
    }
}
