using Microsoft.AspNetCore.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace WebLogBase.Infrastructure.Authentication
{
    public class BaseSidContext : BaseContext
    {
        public BaseSidContext(
            HttpContext context,
            SidAuthenticationOptions options) : base(context)
        {
            Options = options ?? throw new ArgumentNullException(nameof(options));
        }

        public SidAuthenticationOptions Options { get; }
    }
}
