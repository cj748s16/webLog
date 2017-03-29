using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebLogBase.Infrastructure;

namespace WebLogApp.Controllers
{
    public abstract class BaseController<T> : Controller
        where T : BaseController<T>
    {
        protected IMapper Mapper { get; }
        protected ILogger<T> Logger { get; }

        public BaseController(IMapper mapper, ILogger<T> logger)
        {
            this.Mapper = mapper;
            this.Logger = logger;
        }
    }
}
