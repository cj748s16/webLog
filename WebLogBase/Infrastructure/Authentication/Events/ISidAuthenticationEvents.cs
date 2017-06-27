using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogBase.Infrastructure.Authentication
{
    /// <summary>
    /// Specifies callback methods which the <see cref="SidAuthenticationMiddleware"></see> invokes to enable developer control over the authentication process. />
    /// </summary>
    public interface ISidAuthenticationEvents
    {
        /// <summary>
        /// Called each time a request principal has been validated by the middleware. By implementing this method the
        /// application may alter or reject the principal which has arrived with the request.
        /// </summary>
        /// <param name="context">Contains information about the login session as well as the user <see cref="System.Security.Claims.ClaimsIdentity"/>.</param>
        /// <returns>A <see cref="Task"/> representing the completed operation.</returns>
        Task ValidatePrincipal(SidValidatePrincipalContext context);

        /// <summary>
        /// Called when an endpoint has provided sign in information before it is converted into a cookie. By
        /// implementing this method the claims and extra information that go into the ticket may be altered.
        /// </summary>
        /// <param name="context">Contains information about the login session as well as the user <see cref="System.Security.Claims.ClaimsIdentity"/>.</param>
        Task SigningIn(SidSigningInContext context);

        /// <summary>
        /// Called when an endpoint has provided sign in information after it is converted into a cookie.
        /// </summary>
        /// <param name="context">Contains information about the login session as well as the user <see cref="System.Security.Claims.ClaimsIdentity"/>.</param>
        Task SignedIn(SidSignedInContext context);

        /// <summary>
        /// Called during the sign-out flow to augment the cookie cleanup process.
        /// </summary>
        /// <param name="context">Contains information about the login session as well as information about the authentication cookie.</param>
        Task SigningOut(SidSigningOutContext context);

        /// <summary>
        /// Called during the handle authenticate process.
        /// </summary>
        /// <param name="context">Contains information about the login session as well as information about the authentication method.</param>
        Task SetCurrent(SidSetCurrentContext context);
    }
}
