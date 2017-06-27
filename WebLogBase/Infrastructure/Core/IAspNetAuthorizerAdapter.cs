using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace WebLogBase.Infrastructure.Core
{
    public interface IAspNetAuthorizerAdapter
    {
        Func<IAuthorizationService> Provider { get; }

        IEnumerable<Type> GetControllers<T>(params string[] methodNames);
    }
}
