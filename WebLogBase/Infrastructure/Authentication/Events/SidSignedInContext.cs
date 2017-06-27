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
    /// Context object passed to the <see cref="ISidAuthenticationEvents"/> method SignedIn.
    /// </summary>    
    public class SidSignedInContext : BaseSidContext
    {
        /// <summary>
        /// Creates a new instance of the context object.
        /// </summary>
        /// <param name="context">The HTTP request context</param>
        /// <param name="options">The middleware options</param>
        /// <param name="authenticationScheme">Initializes AuthenticationScheme property</param>
        /// <param name="principal">Initializes Principal property</param>
        /// <param name="properties">Initializes Properties property</param>
        /// <param name="sid">Initializes Sid property</param>
        public SidSignedInContext(
            HttpContext context, 
            SidAuthenticationOptions options,
            string authenticationScheme,
            ClaimsPrincipal principal,
            AuthenticationProperties properties,
            string sid) : base(context, options)
        {
            AuthenticationScheme = authenticationScheme;
            Principal = principal;
            Properties = properties;
            Sid = sid;
            Success = true;
        }

        /// <summary>
        /// The name of the AuthenticationScheme creating a cookie
        /// </summary>
        public string AuthenticationScheme { get; }

        /// <summary>
        /// Contains the claims that were converted into the outgoing cookie.
        /// </summary>
        public ClaimsPrincipal Principal { get; }

        /// <summary>
        /// Contains the extra data that was contained in the outgoing cookie.
        /// </summary>
        public AuthenticationProperties Properties { get; }

        /// <summary>
        /// Contains the claims session identifier.
        /// </summary>
        public string Sid { get; }

        /// <summary>
        /// Allowes to revert login at the post process
        /// </summary>
        public bool Success { get; set; }
    }
}
