using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogApp.Infrastructure.Security
{
    /// <summary>
    /// An ASP.NET middleware for adding security headers
    /// </summary>
    public class SecurityHeadersMiddleware
    {
        private readonly RequestDelegate next;
        private readonly SecurityHeadersPolicy policy;

        /// <summary>
        /// Instantiates a new <see cref="SecurityHeadersMiddleware"/>
        /// </summary>
        /// <param name="next">The next middleware in the pipeline</param>
        /// <param name="policy">An instance of the <see cref="SecurityHeadersPolicy"/> which can be applied</param>
        public SecurityHeadersMiddleware(
            RequestDelegate next,
            SecurityHeadersPolicy policy)
        {
            this.next = next ?? throw new ArgumentNullException(nameof(next));
            this.policy = policy ?? throw new ArgumentNullException(nameof(next));
        }

        public async Task Invoke(HttpContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            var response = context.Response;
            if (response == null)
            {
                throw new ArgumentNullException(nameof(response));
            }

            var headers = context.Response.Headers;

            foreach (var headerValuePair in policy.SetHeaders)
            {
                headers[headerValuePair.Key] = headerValuePair.Value;
            }

            foreach (var header in policy.RemoveHeaders)
            {
                headers.Remove(header);
            }

            await next(context);
        }
    }
}
