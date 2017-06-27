using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Authentication;

namespace WebLogBase.Infrastructure.Authentication
{
    /// <summary>
    /// Context object passed to the <see cref="ISidAuthenticationEvents" /> method SigningOut    
    /// </summary>
    public class SidSigningOutContext : BaseSidContext
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        /// <param name="options"></param>
        /// <param name="properties"></param>
        /// <param name="cookieOptions"></param>
        public SidSigningOutContext(
            HttpContext context, 
            SidAuthenticationOptions options,
            AuthenticationProperties properties,
            CookieOptions cookieOptions) : base(context, options)
        {
            CookieOptions = cookieOptions;
            Properties = properties;
        }

        /// <summary>
        /// The options for creating the outgoing cookie.
        /// May be replace or altered during the SigningOut call.
        /// </summary>
        public CookieOptions CookieOptions { get; set; }

        public AuthenticationProperties Properties { get; set; }
    }
}
