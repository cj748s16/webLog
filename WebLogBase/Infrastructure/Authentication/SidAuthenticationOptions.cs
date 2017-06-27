using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebLogBase.Infrastructure.Core;

namespace WebLogBase.Infrastructure.Authentication
{
    /// <summary>
    /// Configuration options for <see cref="SidAuthenticationMiddleware"/>.
    /// </summary>
    public class SidAuthenticationOptions : AuthenticationOptions, IOptions<SidAuthenticationOptions>
    {
        private string _cookieName;

        public SidAuthenticationOptions()
        {
            AuthenticationScheme = SidAuthenticationDefaults.AuthenticationScheme;
            AutomaticAuthenticate = true;
            ExpireTimeSpan = TimeSpan.FromDays(14);
            SlidingExpiration = true;
            CookieHttpOnly = true;
            CookieSecure = CookieSecurePolicy.SameAsRequest;
            SystemClock = new SystemClock();
            Events = new SidAuthenticationEvents();
            SessionStore = new SessionStore();

            ((SidAuthenticationEvents)Events).OnSetCurrent = context => Authentication.SessionStore.SetCurrentAsync(context.Principal);
            ((SidAuthenticationEvents)Events).OnSigningOut = context => Authentication.SessionStore.RemoveCurrentAsync();
        }

        /// <summary>
        /// Determines the cookie name used to persist the identity. The default value is ".AspNetCore.Cookies".
        /// This value should be changed if you change the name of the AuthenticationScheme, especially if your
        /// system uses the cookie authentication middleware multiple times.
        /// </summary>
        public string CookieName
        {
            get { return _cookieName; }
            set
            {
                _cookieName = value ?? throw new ArgumentNullException(nameof(value));
            }
        }

        /// <summary>
        /// Determines the domain used to create the cookie. Is not provided by default.
        /// </summary>
        public string CookieDomain { get; set; }

        /// <summary>
        /// Determines the path used to create the cookie. The default value is "/" for highest browser compatibility.
        /// </summary>
        public string CookiePath { get; set; }

        /// <summary>
        /// Determines if the browser should allow the cookie to be accessed by client-side javascript. The
        /// default is true, which means the cookie will only be passed to http requests and is not made available
        /// to script on the page.
        /// </summary>
        public bool CookieHttpOnly { get; set; }

        /// <summary>
        /// Determines if the cookie should only be transmitted on HTTPS request. The default is to limit the cookie
        /// to HTTPS requests if the page which is doing the SignIn is also HTTPS. If you have an HTTPS sign in page
        /// and portions of your site are HTTP you may need to change this value.
        /// </summary>
        public CookieSecurePolicy CookieSecure { get; set; }

        /// <summary>
        /// If set this will be used by the CookieAuthenticationMiddleware for data protection.
        /// </summary>
        public IDataProtectionProvider DataProtectionProvider { get; set; }

        /// <summary>
        /// Controls how much time the cookie will remain valid from the point it is created. The expiration
        /// information is in the protected cookie ticket. Because of that an expired cookie will be ignored 
        /// even if it is passed to the server after the browser should have purged it 
        /// </summary>
        public TimeSpan ExpireTimeSpan { get; set; }

        /// <summary>
        /// The SlidingExpiration is set to true to instruct the middleware to re-issue a new cookie with a new
        /// expiration time any time it processes a request which is more than halfway through the expiration window.
        /// </summary>
        public bool SlidingExpiration { get; set; }

        /// <summary>
        /// The Provider may be assigned to an instance of an object created by the application at startup time. The middleware
        /// calls methods on the provider which give the application control at certain points where processing is occurring. 
        /// If it is not provided a default instance is supplied which does nothing when the methods are called.
        /// </summary>
        public ISidAuthenticationEvents Events { get; set; }

        /// <summary>
        /// The TicketDataFormat is used to protect and unprotect the identity and other properties which are stored in the
        /// cookie value. If it is not provided a default data handler is created using the data protection service contained
        /// in the IApplicationBuilder.Properties. The default data protection service is based on machine key when running on ASP.NET, 
        /// and on DPAPI when running in a different process.
        /// </summary>
        public ISecureDataFormat<AuthenticationTicket> TicketDataFormat { get; set; }

        /// <summary>
        /// The component used to get cookies from the request or set them on the response.
        ///
        /// ChunkingCookieManager will be used by default.
        /// </summary>
        public ICookieManager CookieManager { get; set; }

        /// <summary>
        /// An optional container in which to store the identity across requests. When used, only a session identifier is sent
        /// to the client. This can be used to mitigate potential problems with very large identities.
        /// </summary>
        public ITicketStore SessionStore { get; set; }

        public SidAuthenticationOptions Value => this;
    }
}
