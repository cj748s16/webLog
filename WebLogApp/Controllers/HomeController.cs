﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogApp.Controllers
{
    public class HomeController : Controller
    {
        // GET: /<controller/
        public IActionResult Index()
        {
            return View();
        }
    }
}
