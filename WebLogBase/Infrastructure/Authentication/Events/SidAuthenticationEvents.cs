using Microsoft.AspNetCore.Mvc.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogBase.Infrastructure.Authentication
{
    /// <summary>
    /// This default implementation of the <see cref="ISidAuthenticationEvents"/> may be used if the 
    /// application only needs to override a few of the interface methods. This may be used as a base class
    /// or may be instantiated directly.
    /// </summary>
    public class SidAuthenticationEvents : ISidAuthenticationEvents
    {
        /// <summary>
        /// A delegate assigned to this property will be invoked when the related method is called.
        /// </summary>
        public Func<SidValidatePrincipalContext, Task> OnValidatePrincipal { get; set; } = context => TaskCache.CompletedTask;

        /// <summary>
        /// A delegate assigned to this property will be invoked when the related method is called.
        /// </summary>
        public Func<SidSigningInContext, Task> OnSigningIn { get; set; } = context => TaskCache.CompletedTask;

        /// <summary>
        /// A delegate assigned to this property will be invoked when the related method is called.
        /// </summary>
        public Func<SidSignedInContext, Task> OnSignedIn { get; set; } = context => TaskCache.CompletedTask;

        /// <summary>
        /// A delegate assigned to this property will be invoked when the related method is called.
        /// </summary>
        public Func<SidSigningOutContext, Task> OnSigningOut { get; set; } = context => TaskCache.CompletedTask;

        /// <summary>
        /// A delegate assigned to this property will be invoked when the related method is called.
        /// </summary>
        public Func<SidSetCurrentContext, Task> OnSetCurrent { get; set; } = context => TaskCache.CompletedTask;

        /// <summary>
        /// Implements the interface method by invoking the related delegate method.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public virtual Task ValidatePrincipal(SidValidatePrincipalContext context) => OnValidatePrincipal(context);

        /// <summary>
        /// Implements the interface method by invoking the related delegate method.
        /// </summary>
        /// <param name="context"></param>
        public virtual Task SigningIn(SidSigningInContext context) => OnSigningIn(context);

        /// <summary>
        /// Implements the interface method by invoking the related delegate method.
        /// </summary>
        /// <param name="context"></param>
        public virtual Task SignedIn(SidSignedInContext context) => OnSignedIn(context);

        /// <summary>
        /// Implements the interface method by invoking the related delegate method.
        /// </summary>
        /// <param name="context"></param>
        public virtual Task SigningOut(SidSigningOutContext context) => OnSigningOut(context);

        /// <summary>
        /// Implements the interface method by invoking the related delegate method.
        /// </summary>
        /// <param name="context"></param>
        public virtual Task SetCurrent(SidSetCurrentContext context) => OnSetCurrent(context);
    }
}
