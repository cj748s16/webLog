using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogBase.Infrastructure.Authentication
{
    /// <summary>
    /// Default values related to cookie-based authentication middleware
    /// </summary>
    public class SidAuthenticationDefaults
    {
        /// <summary>
        /// The default value used for SidAuthenticationOptions.AuthenticationScheme
        /// </summary>
        public const string AuthenticationScheme = "Sid";

        /// <summary>
        /// The prefix used to provide a default SidAuthenticationOptions.CookieName
        /// </summary>
        public static readonly string CookiePrefix = ".webLog.";

        /// <summary>
        /// The value used for storing session identifier
        /// </summary>
        public const string SessionId = "SessionId";
    }
}
