using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;

namespace WebLogBase.Infrastructure.Authentication
{
    public class MembershipContext
    {
        public int? Id { get; }
        public string Userid { get; }
        public IEnumerable<string> Roles { get; }
        public ClaimsIdentity Identity { get; }
        public ClaimsPrincipal Principal { get; }

        public MembershipContext(int? id, string userId, IEnumerable<string> roles, ClaimsIdentity identity, ClaimsPrincipal principal)
        {
            Id = id;
            Userid = userId;
            Roles = roles;
            Identity = identity;
            Principal = principal;
        }
    }
}
