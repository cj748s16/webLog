using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing.Constraints;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Serialization;
using NLog.Web;
using NLog.Extensions.Logging;
using WebLogApp.Infrastructure;
using WebLogApp.Infrastructure.Localization;
using WebLogApp.Infrastructure.Mappings;
using SimpleInjector;
using SimpleInjector.Integration.AspNetCore.Mvc;
using System.Reflection;
using WebLogBase.Infrastructure.Core;
using NLog;
using WebLogApp.Infrastructure.Logging;

namespace WebLogApp
{
    public class Startup
    {
        // App Configuration (appsettings.json + appsettings.?.json)
        private IConfigurationRoot Configuration { get; }

        // Hosting Environment for singleton DI
        private IHostingEnvironment Environment { get; }

        // DI container (SimpleInjector)
        private Container Container { get; } = new Container();

        public Startup(IHostingEnvironment env)
        {
            // creating configurationRoot
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();

            // Add NLog config
            env.ConfigureNLog("NLog.config");

            Environment = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            // SimpleInjector
            var controllerActivator = new SimpleInjectorControllerActivator(Container);
            services.AddSingleton<Microsoft.AspNetCore.Mvc.Controllers.IControllerActivator>(controllerActivator);
            var viewComponentActivator = new SimpleInjectorViewComponentActivator(Container);
            services.AddSingleton<Microsoft.AspNetCore.Mvc.ViewComponents.IViewComponentActivator>(viewComponentActivator);

            Container.RegisterSingleton(Environment);
            Container.RegisterSingleton(Container);

            // Add ConfigurationRoot to SimpleInjector
            Container.RegisterSingleton(Configuration);

            // Add Logging
            Container.RegisterConditional(typeof(ILogger), context => typeof(NLogProxy<>).MakeGenericType(context.Consumer.ImplementationType), Lifestyle.Singleton, context => true);

            // Add NLog to service processing
            Container.RegisterSingleton<IHttpContextAccessor, HttpContextAccessor>();

            // Add mapper
            var mapperInstance = AutoMapperConfiguration.Configure();
            Container.RegisterSingleton(mapperInstance);

            // Initialize external DLL's
            services.AddExternalDLLs(Configuration, Container);

            // Add localization resources
            ConfigureLocalization(services);

            services.AddAuthentication();

            // Add MVC services to the services container.
            services
                .AddMvc(opts =>
                {
                    // Add localized routes
                    opts.Conventions.Insert(0, new ApiPrefixConvention());
                })
                .AddJsonOptions(opt =>
                {
                    var resolver = opt.SerializerSettings.ContractResolver;
                    if (resolver != null)
                    {
                        var res = resolver as DefaultContractResolver;
                        res.NamingStrategy = null;
                    }
                })
                .AddViewLocalization(Microsoft.AspNetCore.Mvc.Razor.LanguageViewLocationExpanderFormat.Suffix)
                .AddDataAnnotationsLocalization();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, Microsoft.Extensions.Logging.ILoggerFactory loggerFactory)
        {
            // Add Localization options to the container
            var jsonLocOptions = app.ApplicationServices.GetService<IOptions<JsonLocalizationOptions>>();
            Container.RegisterSingleton(jsonLocOptions);
            // Verifing the SimpleInjector container
            Container.Verify();

            // Add NLog logging
            loggerFactory.AddNLog();
            app.AddNLogWeb();
            //if (Environment.IsDevelopment())
            //{
            //    loggerFactory.AddDebug();
            //}

            // this will serve up wwwroot
            ConfigureStaticFiles(app);

            // configure Localization
            var locOptions = app.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>();
            app.UseRequestLocalization(locOptions.Value);

            //var mapperInstance = AutoMapperConfiguration.Configure();

            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true
            });

            if (Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // Add MVC to the request pipeline.
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "cultureRoute",
                    template: "{culture}/{controller}/{action}/{id?}",
                    defaults: new { controller = "Home", action = "Index" },
                    constraints: new
                    {
                        culture = new RegexRouteConstraint("^[a-z]{2}(?:-[A-Z]{2})?$")
                    });

                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapWebApiRoute(
                    name: "defaultApi",
                    template: "api/{controller}/{id?}");
            });
        }

        // static files providers configuration
        private void ConfigureStaticFiles(IApplicationBuilder app)
        {
            app.UseStaticFiles();

            // provides static file access for .less files
            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".less"] = "text/css";
            //provider.Mappings[".css"] = "text/css";
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), @"wwwroot", "css")),
                RequestPath = new PathString("/css"),
                ContentTypeProvider = provider
            });
        }

        // Localization configuration
        private void ConfigureLocalization(IServiceCollection services)
        {
            //services.AddLocalization(options => options.ResourcesPath = "Resources");
            services.AddJsonLocalization(Container, Options => Options.ResourcesPath = "Resources");
            services.Configure<RequestLocalizationOptions>(options =>
            {
                options.DefaultRequestCulture = new Microsoft.AspNetCore.Localization.RequestCulture("en-US", "en-US");
                options.SupportedCultures = Controllers.System.LanguageApiController.SupportedCultures;
                options.SupportedUICultures = Controllers.System.LanguageApiController.SupportedCultures;
                options.RequestCultureProviders.Insert(0, new UrlRequestCultureProvider());
            });
        }

        // Entry point for the application.
        public static void Main(string[] args)
        {
            var host = new WebHostBuilder()
                .UseKestrel()
                .UseContentRoot(System.IO.Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>()
                .UseApplicationInsights()
                .Build();

            host.Run();
        }
    }
}
