using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebLogBase.Entities.System.Account;
using WebLogBase.Infrastructure.Authentication;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc.Internal;
using Microsoft.AspNetCore.Http.Authentication;
using WebLogBase.Infrastructure.Core;

namespace WebLogBase.Infrastructure.Authentication
{
    internal class SessionStore : ITicketStore
    {
        private static ConcurrentDictionary<string, SessionData> sessionInfos = new ConcurrentDictionary<string, SessionData>();
        private static ISystemClock SystemClock = new SystemClock();

        public static SessionData GetSession(HttpContext context, string sid = null)
        {
            if (string.IsNullOrWhiteSpace(sid))
            {
                sid = Guid.NewGuid().ToString();
            }

            var obj = new SessionData(
                ipa: context.Connection.RemoteIpAddress.GetAddressBytes(),
                cn: context.Request.Headers["User-Agent"].ToString(),
                prime: CryptoService.prime,
                timestamp: DateTime.Now.Ticks,
                sid: sid
            );

            obj = sessionInfos.GetOrAdd(sid, obj);

            return obj;
        }

        internal static bool UserLoggedIn(string sid, MembershipContext membershipContext)
        {
            if (!sessionInfos.TryGetValue(sid, out SessionData sessionData))
            {
                return false;
            }

            if (sessionData.Ticket == null)
            {
                return false;
            }

            var currentUtc = SystemClock.UtcNow;
            var expiresUtc = sessionData.Ticket.Properties.ExpiresUtc;
            if (expiresUtc.HasValue && expiresUtc.Value < currentUtc)
            {
                return false;
            }

            sessionData.Context = membershipContext;

            return true;
        }

        internal static bool UserLoggedOut(string sid)
        {
            if (!sessionInfos.TryGetValue(sid, out SessionData sessionData))
            {
                return true;
            }

            if (sessionData.Ticket == null)
            {
                return true;
            }

            sessionData.Ticket = null;
            sessionData.Context = null;
            currentSid = null;

            return true;
        }

        public Task RemoveAsync(string key)
        {
            if (sessionInfos.TryGetValue(key, out SessionData sessionData))
            {
                sessionData.Ticket = null;
            }

            return TaskCache.CompletedTask;
        }

        public Task RenewAsync(string key, AuthenticationTicket ticket)
        {
            if (sessionInfos.TryGetValue(key, out SessionData sessionData))
            {
                sessionData.Ticket = ticket;
            }

            return TaskCache.CompletedTask;
        }

        public Task<AuthenticationTicket> RetrieveAsync(string key)
        {
            if (sessionInfos.TryGetValue(key, out SessionData sessionData))
            {
                return Task.FromResult(sessionData.Ticket);
            }

            return Task.FromResult((AuthenticationTicket)null);
        }

        public Task<string> StoreAsync(AuthenticationTicket ticket)
        {
            string key = null;
            if (ticket.Principal.Claims.Any(c => c.Type == ClaimTypes.PrimarySid))
            {
                var claim = ticket.Principal.Claims.FirstOrDefault(c => c.Type.Equals(ClaimTypes.PrimarySid));
                if (claim != null)
                {
                    key = claim.Value;
                }
            }

            if (!string.IsNullOrWhiteSpace(key) && sessionInfos.TryGetValue(key, out SessionData sessionData))
            {
                sessionData.Ticket = ticket;

                currentSid = key;

                return Task.FromResult(key);
            }

            currentSid = null;

            return Task.FromResult((string)null);
        }

        internal static Task SetCurrentAsync(ClaimsPrincipal principal)
        {
            string key = null;

            if ((principal?.Claims?.Any(c => c.Type == ClaimTypes.PrimarySid)).GetValueOrDefault())
            {
                var claim = principal.Claims.FirstOrDefault(c => c.Type.Equals(ClaimTypes.PrimarySid));
                if (claim != null)
                {
                    key = claim.Value;
                }
            }

            currentSid = key;

            return TaskCache.CompletedTask;
        }

        internal static Task RemoveCurrentAsync()
        {
            currentSid = null;

            return TaskCache.CompletedTask;
        }

        [ThreadStatic]
        private static string currentSid;

        public static MembershipContext Current
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(currentSid))
                {
                    SessionData data = null;
                    if (sessionInfos.TryGetValue(currentSid, out data))
                    {
                        return data.Context;
                    }
                }
                return null;
            }
        }
    }
}
