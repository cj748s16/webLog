using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.Authentication;

namespace WebLogBase.Infrastructure.Authentication
{
    /// <summary>
    /// Context object passed to the <see cref="ISidAuthenticationEvents"/> method SigningIn.
    /// </summary>    
    public class SidSigningInContext : BaseSidContext
    {
        public SidSigningInContext(
            HttpContext context, 
            SidAuthenticationOptions options,
            string authenticationScheme,
            ClaimsPrincipal principal,
            AuthenticationProperties properties,
            CookieOptions cookieOptions) : base(context, options)
        {
            AuthenticationScheme = authenticationScheme;
            Principal = principal;
            Properties = properties;
            CookieOptions = cookieOptions;
        }

        /// <summary>
        /// The name of the AuthenticationScheme creating a cookie
        /// </summary>
        public string AuthenticationScheme { get; }

        /// <summary>
        /// Contains the claims about to be converted into the outgoing cookie.
        /// May be replaced or altered during the SigningIn call.
        /// </summary>
        public ClaimsPrincipal Principal { get; set; }

        /// <summary>
        /// Contains the extra data about to be contained in the outgoing cookie.
        /// May be replaced or altered during the SigningIn call.
        /// </summary>
        public AuthenticationProperties Properties { get; set; }

        /// <summary>
        /// The options for creating the outgoing cookie.
        /// May be replace or altered during the SigningIn call.
        /// </summary>
        public CookieOptions CookieOptions { get; set; }
    }
}
