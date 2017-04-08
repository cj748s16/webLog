using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebLogApp.Infrastructure.Security.Constants;

namespace WebLogApp.Infrastructure.Security
{
    /// <summary>
    /// Exposes methods to build a policy
    /// </summary>
    public class SecurityHeadersBuilder
    {
        private readonly SecurityHeadersPolicy policy = new SecurityHeadersPolicy();

        /// <summary>
        /// The number of seconds in one year
        /// </summary>
        public const int OneYearInSeconds = 60 * 60 * 24 * 365;

        /// <summary>
        /// Add default headers in accordance with most secure approach
        /// </summary>
        /// <returns></returns>
        public SecurityHeadersBuilder AddDefaultSecurityPolicy()
        {
            AddFrameOptionsDeny();
            AddXssProtectionBlock();
            AddStrictTransportSecurityMaxAge();
            AddContentTypeOptionsNoSniff();
            RemoveServerHeader();

            return this;
        }



        /// <summary>
        /// Add X-Frame-Options DENY to all requests.
        /// The page cannot be displayed in a frame, regardless of the site attempting to do so
        /// </summary>
        public SecurityHeadersBuilder AddFrameOptionsDeny()
        {
            policy.SetHeaders[FrameOptionsConstants.Header] = FrameOptionsConstants.Deny;
            return this;
        }

        /// <summary>
        /// Add X-Frame-Options SAMEORIGIN to all requests.
        /// The page can only be displayed in a frame on the same origin as the page itself.
        /// </summary>
        public SecurityHeadersBuilder AddFrameOptionsSameOrigin()
        {
            policy.SetHeaders[FrameOptionsConstants.Header] = FrameOptionsConstants.SameOrigin;
            return this;
        }

        /// <summary>
        /// Add X-Frame-Options ALLOW-FROM {uri} to all requests, where the url is provided.
        /// The page can only be displayed in a frame on the specified origin.
        /// </summary>
        /// <param name="uri">The uri of the origin in which the page may be displayed in a frame</param>
        public SecurityHeadersBuilder AddFrameOptionsSameOrigin(string uri)
        {
            policy.SetHeaders[FrameOptionsConstants.Header] = string.Format(FrameOptionsConstants.AllowFromUri, uri);
            return this;
        }



        /// <summary>
        /// Add X-XSS-Protection 1 to all requests.
        /// Enables the XSS Protection
        /// </summary>
        public SecurityHeadersBuilder AddXssProtectionEnabled()
        {
            policy.SetHeaders[XssProtectionConstants.Header] = XssProtectionConstants.Enabled;
            return this;
        }

        /// <summary>
        /// Add X-XSS-Protection 0 to all requests.
        /// Disables the XSS Protection offered by the user-agent
        /// </summary>
        public SecurityHeadersBuilder AddXssProtectionDisabled()
        {
            policy.SetHeaders[XssProtectionConstants.Header] = XssProtectionConstants.Disabled;
            return this;
        }

        /// <summary>
        /// Add X-XSS-Protection 1; mode=block to all requests.
        /// Enables XSS Protection and instructs the user-agent to block the response in the event that script was been inserted from user input, instead of sanitizing
        /// </summary>
        public SecurityHeadersBuilder AddXssProtectionBlock()
        {
            policy.SetHeaders[XssProtectionConstants.Header] = XssProtectionConstants.Block;
            return this;
        }

        /// <summary>
        /// Add X-XSS-Protection 1; report=http://site.com/report to all requests.
        /// A partially supported directive that tells the user-agent to report potential XSS attacks to a single URL. Data will be POST'd to the report URL in JSON format.
        /// </summary>
        public SecurityHeadersBuilder AddXssProtectionReport(string reportUrl)
        {
            policy.SetHeaders[XssProtectionConstants.Header] = string.Format(XssProtectionConstants.Report, reportUrl);
            return this;
        }



        /// <summary>
        /// Add Strict-Transport-Security max-age=<see cref="maxAge"/> to all requests.
        /// Tells the user-agent to cache the domain in the STS list for the number of seconds provided
        /// </summary>
        public SecurityHeadersBuilder AddStrictTransportSecurityMaxAge(int maxAge = OneYearInSeconds)
        {
            policy.SetHeaders[StrictTransportSecurityConstants.Header] = string.Format(StrictTransportSecurityConstants.MaxAge, maxAge);
            return this;
        }

        /// <summary>
        /// Add Strict-Transport-Security max-age=<see cref="maxAge"/>; includeSubDomains to all requests.
        /// Tells the user-agent to cache the domain in the STS list for the number of seconds provided and include any sub-domains
        /// </summary>
        public SecurityHeadersBuilder AddStrictTransportSecurityMaxAgeIncludeSubDomains(int maxAge = OneYearInSeconds)
        {
            policy.SetHeaders[StrictTransportSecurityConstants.Header] = string.Format(StrictTransportSecurityConstants.MaxAgeIncludeSubDomains, maxAge);
            return this;
        }

        /// <summary>
        /// Add Strict-Transport-Security max-age=0 to all requests.
        /// Tells the user-agent to remove, or not cache the host in the STS cache
        /// </summary>
        /// <returns></returns>
        public SecurityHeadersBuilder AddStrictTransportSecurityNoCache()
        {
            policy.SetHeaders[StrictTransportSecurityConstants.Header] = StrictTransportSecurityConstants.NoCache;
            return this;
        }



        /// <summary>
        /// Add X-Content-Type-Options nosniff to all requests.
        /// Can be set to protect against MIME type confusion attacks
        /// </summary>
        public SecurityHeadersBuilder AddContentTypeOptionsNoSniff()
        {
            policy.SetHeaders[ContentTypeOptionsConstants.Header] = ContentTypeOptionsConstants.NoSniff;
            return this;
        }

        /// <summary>
        /// Removes the Server header from all responses.
        /// </summary>
        public SecurityHeadersBuilder RemoveServerHeader()
        {
            policy.RemoveHeaders.Add(ServerConstants.Header);
            return this;
        }



        /// <summary>
        /// Adds a custom header to all requests.
        /// </summary>
        /// <param name="header">The header name</param>
        /// <param name="value">The value for the header</param>
        public SecurityHeadersBuilder AddCustomHeader(string header, string value)
        {
            if (string.IsNullOrWhiteSpace(header))
            {
                throw new ArgumentNullException(nameof(header));
            }

            policy.SetHeaders[header] = value;
            return this;
        }

        /// <summary>
        /// Remove a header from all requests.
        /// </summary>
        /// <param name="header">The to remove</param>
        public SecurityHeadersBuilder RemoveHeader(string header)
        {
            if (string.IsNullOrWhiteSpace(header))
            {
                throw new ArgumentNullException(nameof(header));
            }

            policy.RemoveHeaders.Add(header);
            return this;
        }



        /// <summary>
        /// Builds a new <see cref="SecurityHeadersPolicy"/> using the entries added.
        /// </summary>
        /// <returns>The constructed <see cref="SecurityHeadersPolicy"/>.</returns>
        public SecurityHeadersPolicy Build()
        {
            return policy;
        }
    }
}
