using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.Authentication;

namespace WebLogBase.Infrastructure.Authentication
{
    /// <summary>
    /// Context object passed to the <see cref="ISidAuthenticationProvider"/> method ValidatePrincipal.
    /// </summary>
    public class SidValidatePrincipalContext : BaseSidContext
    {
        /// <summary>
        /// Creates a new instance of the context object.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="ticket">Contains the initial values for identity and extra data</param>
        /// <param name="options"></param>
        public SidValidatePrincipalContext(
            HttpContext context, 
            AuthenticationTicket ticket,
            SidAuthenticationOptions options) : base(context, options)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            if (ticket == null)
            {
                throw new ArgumentNullException(nameof(ticket));
            }

            if (options == null)
            {
                throw new ArgumentNullException(nameof(options));
            }

            Principal = ticket.Principal;
            Properties = ticket.Properties;
        }

        /// <summary>
        /// Contains the claims principal arriving with the request. May be altered to change the 
        /// details of the authenticated user.
        /// </summary>
        public ClaimsPrincipal Principal { get; private set; }

        /// <summary>
        /// Contains the extra meta-data arriving with the request ticket. May be altered.
        /// </summary>
        public AuthenticationProperties Properties { get; private set; }

        /// <summary>
        /// If true, the cookie will be renewed
        /// </summary>
        public bool ShouldRenew { get; set; }

        /// <summary>
        /// Called to replace the claims principal. The supplied principal will replace the value of the 
        /// Principal property, which determines the identity of the authenticated request.
        /// </summary>
        /// <param name="principal">The <see cref="ClaimsPrincipal"/> used as the replacement</param>
        public void ReplacePrincipal(ClaimsPrincipal principal)
        {
            Principal = principal;
        }

        /// <summary>
        /// Called to reject the incoming principal. This may be done if the application has determined the
        /// account is no longer active, and the request should be treated as if it was anonymous.
        /// </summary>
        public void RejectPrincipal()
        {
            Principal = null;
        }
    }
}
