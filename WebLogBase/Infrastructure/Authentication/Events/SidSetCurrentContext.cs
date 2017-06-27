using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

namespace WebLogBase.Infrastructure.Authentication
{
    /// <summary>
    /// Context object passed to the <see cref="ISidAuthenticationEvents"/> method SetCurrent.
    /// </summary>
    public class SidSetCurrentContext : BaseSidContext
    {
        /// <summary>
        /// Creates a new instance of the context object.
        /// </summary>
        /// <param name="context">The HTTP request context</param>
        /// <param name="options">The middleware options</param>
        /// <param name="authenticationScheme">Initializes AuthenticationScheme property</param>
        public SidSetCurrentContext(
            HttpContext context,
            SidAuthenticationOptions options,
            string authenticationScheme,
            ClaimsPrincipal principal) : base(context, options)
        {
            AuthenticationScheme = authenticationScheme;
            Principal = principal;
        }

        /// <summary>
        /// The name of the AuthenticationScheme creating a cookie
        /// </summary>
        public string AuthenticationScheme { get; }

        /// <summary>
        /// Contains the claims that were converted into the outgoing cookie.
        /// </summary>
        public ClaimsPrincipal Principal { get; }
    }
}
