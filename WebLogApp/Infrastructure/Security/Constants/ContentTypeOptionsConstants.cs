using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogApp.Infrastructure.Security.Constants
{
    /// <summary>
    /// X-Content-Type-Options-related constants
    /// </summary>
    public class ContentTypeOptionsConstants
    {
        /// <summary>
        /// The header value for X-Content-Type-Options
        /// </summary>
        public static readonly string Header = "X-Content-Type-Options";

        /// <summary>
        /// Disables content sniffing
        /// </summary>
        public static readonly string NoSniff = "nosniff";
    }
}
