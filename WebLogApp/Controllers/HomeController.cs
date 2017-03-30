using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
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

        public HomeController(IHostingEnvironment env)
        {
            this.env = env;
        }

        // GET: /<controller>/
        public IActionResult Index()
        {
            ViewBag.isDevelopment = env.IsDevelopment();
            // localizer: Microsoft.Extensions.Localization.StringLocalizer
            // localizerFactory: Microsoft.Extensions.Localization.ResourceManagerStringLocalizerFactory
            return View();
        }
    }
}
