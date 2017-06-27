using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace WebLogBase.Infrastructure.Authentication
{
    /// <summary>
    /// Extension methods to add sid authentication capabilities to an HTTP application pipeline.
    /// </summary>
    public static class SidAppBuilderExtensions
    {
        /// <summary>
        /// Adds the <see cref="SidAuthenticationMiddleware"/> middleware to the specified <see cref="IApplicationBuilder"/>, which enables sid authentication capabilities.
        /// </summary>
        /// <param name="app">The <see cref="IApplicationBuilder"/> to add the middleware to.</param>
        /// <returns>A reference to this instance after the operation has completed.</returns>
        public static IApplicationBuilder UseSidAuthentication(this IApplicationBuilder app)
        {
            if (app == null)
            {
                throw new ArgumentNullException(nameof(app));
            }

            return app.UseMiddleware<SidAuthenticationMiddleware>();
        }

        /// <summary>
        /// Adds the <see cref="SidAuthenticationMiddleware"/> middleware to the specified <see cref="IApplicationBuilder"/>, which enables sid authentication capabilities.
        /// </summary>
        /// <param name="app">The <see cref="IApplicationBuilder"/> to add the middleware to.</param>
        /// <param name="options">A <see cref="SidAuthenticationOptions"/> that specifies options for the middleware.</param>
        /// <returns>A reference to this instance after the operation has completed.</returns>
        public static IApplicationBuilder UseSidAuthentication(this IApplicationBuilder app, SidAuthenticationOptions options)
        {
            if (app == null)
            {
                throw new ArgumentNullException(nameof(app));
            }

            if (options == null)
            {
                throw new ArgumentNullException(nameof(app));
            }

            return app.UseMiddleware<SidAuthenticationMiddleware>(Options.Create(options));
        }
    }
}
