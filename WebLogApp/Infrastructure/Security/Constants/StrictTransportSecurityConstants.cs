using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogApp.Infrastructure.Security.Constants
{
    /// <summary>
    /// Strict-Transport-Security-related constants
    /// </summary>
    public class StrictTransportSecurityConstants
    {
        /// <summary>
        /// The header value for Strict-Transport-Security
        /// </summary>
        public static readonly string Header = "Strict-Transport-Security";

        /// <summary>
        /// Tells the user-agent to cache the domain in the STS list for the provided number of seconds {0}
        /// </summary>
        public static readonly string MaxAge = "max-age={0}";

        /// <summary>
        /// Tells the user-agent to cache the domain in the STS list for the provided number of seconds {0} and include any sub-domains
        /// </summary>
        public static readonly string MaxAgeIncludeSubDomains = "max-age={0}; includeSubDomains";

        /// <summary>
        /// Tells the user-agent to remove, or not cache the host in the STS cache
        /// </summary>
        public static readonly string NoCache = "max-age=0";
    }
}
