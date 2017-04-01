using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly IHostingEnvironment env;
        private readonly IConfigurationRoot configuration;

        public HomeController(IHostingEnvironment env, IConfigurationRoot configuration)
        {
            this.env = env;
            this.configuration = configuration;
        }

        // GET: /<controller>/
        public IActionResult Index()
        {
            ViewBag.isDevelopment = env.IsDevelopment();
            var watchLess = configuration["Client:watchLess"];
            ViewBag.isWatchLess = !string.IsNullOrWhiteSpace(watchLess) && bool.Parse(watchLess);
            // localizer: Microsoft.Extensions.Localization.StringLocalizer
            // localizerFactory: Microsoft.Extensions.Localization.ResourceManagerStringLocalizerFactory
            return View();
        }
    }
}
