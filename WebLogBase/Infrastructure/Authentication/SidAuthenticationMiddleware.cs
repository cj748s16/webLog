using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace WebLogBase.Infrastructure.Authentication
{
    public class SidAuthenticationMiddleware : AuthenticationMiddleware<SidAuthenticationOptions>
    {
        public SidAuthenticationMiddleware(
            RequestDelegate next,
            IDataProtectionProvider dataProtectionProvider,
            ILoggerFactory loggerFactory,
            UrlEncoder urlEncoder,
            IOptions<SidAuthenticationOptions> options) : base(next, options, loggerFactory, urlEncoder)
        {
            if (dataProtectionProvider == null)
            {
                throw new ArgumentNullException(nameof(dataProtectionProvider));
            }

            if (Options.Events == null)
            {
                Options.Events = new SidAuthenticationEvents();
            }

            if (string.IsNullOrWhiteSpace(Options.CookieName))
            {
                Options.CookieName = SidAuthenticationDefaults.CookiePrefix + Options.AuthenticationScheme;
            }

            if (Options.TicketDataFormat == null)
            {
                var provider = Options.DataProtectionProvider ?? dataProtectionProvider;
                var dataProtector = provider.CreateProtector(typeof(SidAuthenticationMiddleware).FullName, Options.AuthenticationScheme, "v1");
                Options.TicketDataFormat = new TicketDataFormat(dataProtector);
            }

            if (Options.CookieManager == null)
            {
                Options.CookieManager = new ChunkingCookieManager();
            }
        }

        protected override AuthenticationHandler<SidAuthenticationOptions> CreateHandler()
        {
            return new SidAuthenticationHandler();
        }
    }
}
