using Microsoft.AspNetCore.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Features.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Net.Http.Headers;

namespace WebLogBase.Infrastructure.Authentication
{
    public class SidAuthenticationHandler : AuthenticationHandler<SidAuthenticationOptions>
    {
        private const string HeaderValueNoCache = "no-cache";
        private const string HeaderValueMinusOne = "-1";
        private const string SessionIdClaim = "webLog-SessionId";

        private bool shouldRefresh;
        private DateTimeOffset? refreshIssuedUtc;
        private DateTimeOffset? refreshExpiresUtc;
        private string sessionKey;
        private Task<AuthenticateResult> readCookieTask;

        private Task<AuthenticateResult> EnsureCookieTicket()
        {
            // We only need to read the ticket once
            if (readCookieTask == null)
            {
                readCookieTask = ReadCookieTicket();
            }
            return readCookieTask;
        }

        private void CheckForRefresh(AuthenticationTicket ticket)
        {
            var currentUtc = Options.SystemClock.UtcNow;
            var issuedUtc = ticket.Properties.IssuedUtc;
            var expiresUtc = ticket.Properties.ExpiresUtc;
            var allowRefresh = ticket.Properties.AllowRefresh ?? true;
            if (issuedUtc != null && expiresUtc != null && Options.SlidingExpiration && allowRefresh)
            {
                var timeElapsed = currentUtc.Subtract(issuedUtc.Value);
                var timeRemaining = expiresUtc.Value.Subtract(currentUtc);
                if (timeRemaining < timeElapsed)
                {
                    RequestRefresh(ticket);
                }
            }
        }

        private void RequestRefresh(AuthenticationTicket ticket)
        {
            var issuedUtc = ticket.Properties.IssuedUtc;
            var expiresUtc = ticket.Properties.ExpiresUtc;

            if (issuedUtc != null && expiresUtc != null)
            {
                shouldRefresh = true;
                var currentUtc = Options.SystemClock.UtcNow;
                refreshIssuedUtc = currentUtc;
                var timeSpan = expiresUtc.Value.Subtract(issuedUtc.Value);
                refreshExpiresUtc = currentUtc.Add(timeSpan);
            }
        }

        private async Task<AuthenticateResult> ReadCookieTicket()
        {
            var cookie = Options.CookieManager.GetRequestCookie(Context, Options.CookieName);
            if (string.IsNullOrWhiteSpace(cookie))
            {
                return AuthenticateResult.Skip();
            }

            var ticket = Options.TicketDataFormat.Unprotect(cookie, GetTlsTokenBinding());
            if (ticket == null)
            {
                return AuthenticateResult.Fail("Unprotect ticket failed");
            }

            if (Options.SessionStore != null)
            {
                var claim = ticket.Principal.Claims.FirstOrDefault(c => c.Type.Equals(SessionIdClaim));
                if (claim == null)
                {
                    return AuthenticateResult.Fail("SessionId missing");
                }
                sessionKey = claim.Value;
                ticket = await Options.SessionStore.RetrieveAsync(sessionKey);
                if (ticket == null)
                {
                    return AuthenticateResult.Fail("Identity missing in session store");
                }
            }

            var currentUtc = Options.SystemClock.UtcNow;
            var issuedUtc = ticket.Properties.IssuedUtc;
            var expiresUts = ticket.Properties.ExpiresUtc;

            if (expiresUts != null && expiresUts.Value < currentUtc)
            {
                if (Options.SessionStore != null)
                {
                    await Options.SessionStore.RemoveAsync(sessionKey);
                }
                return AuthenticateResult.Fail("Ticket expired");
            }

            CheckForRefresh(ticket);

            // Finally we have a valid ticket
            return AuthenticateResult.Success(ticket);
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var result = await EnsureCookieTicket();
            if (!result.Succeeded)
            {
                return result;
            }

            var context = new SidValidatePrincipalContext(Context, result.Ticket, Options);
            await Options.Events.ValidatePrincipal(context);

            if (context.Principal == null)
            {
                return AuthenticateResult.Fail("No principal.");
            }

            if (context.ShouldRenew)
            {
                RequestRefresh(result.Ticket);
            }

            var setCurrentContext = new SidSetCurrentContext(Context, Options, Options.AuthenticationScheme, context.Principal);
            await Options.Events.SetCurrent(setCurrentContext);

            return AuthenticateResult.Success(new AuthenticationTicket(context.Principal, context.Properties, Options.AuthenticationScheme));
        }

        private CookieOptions BuildCookieOptions()
        {
            var cookieOptions = new CookieOptions
            {
                Domain = Options.CookieDomain,
                HttpOnly = Options.CookieHttpOnly,
                Path = Options.CookiePath ?? (OriginalPathBase.HasValue ? OriginalPathBase.ToString() : "/")
            };

            if (Options.CookieSecure == CookieSecurePolicy.SameAsRequest)
            {
                cookieOptions.Secure = Request.IsHttps;
            }
            else
            {
                cookieOptions.Secure = Options.CookieSecure == CookieSecurePolicy.Always;
            }

            return cookieOptions;
        }

        protected override async Task FinishResponseAsync()
        {
            if (!shouldRefresh || SignInAccepted || SignOutAccepted)
            {
                return;
            }

            var ticket = (await HandleAuthenticateOnceSafeAsync())?.Ticket;
            if (ticket != null)
            {
                var properties = ticket.Properties;

                if (refreshIssuedUtc.HasValue)
                {
                    properties.IssuedUtc = refreshIssuedUtc;
                }

                if (refreshExpiresUtc.HasValue)
                {
                    properties.ExpiresUtc = refreshExpiresUtc;
                }

                if (Options.SessionStore != null && sessionKey != null)
                {
                    await Options.SessionStore.RenewAsync(sessionKey, ticket);
                    var principal = new ClaimsPrincipal(
                        new ClaimsIdentity(new[] { new Claim(SessionIdClaim, sessionKey, ClaimValueTypes.String, Options.ClaimsIssuer) },
                        Options.AuthenticationScheme));
                    ticket = new AuthenticationTicket(principal, null, Options.AuthenticationScheme);
                }

                var cookieValue = Options.TicketDataFormat.Protect(ticket, GetTlsTokenBinding());

                var cookieOptions = BuildCookieOptions();
                if (properties.IsPersistent && refreshExpiresUtc.HasValue)
                {
                    cookieOptions.Expires = refreshExpiresUtc.Value.ToUniversalTime();
                }

                Options.CookieManager.AppendResponseCookie(
                    Context,
                    Options.CookieName,
                    cookieValue,
                    cookieOptions);

                ApplyHeaders(properties);
            }
        }

        protected override async Task HandleSignInAsync(SignInContext signin)
        {
            var result = await EnsureCookieTicket();
            var cookieOptions = BuildCookieOptions();

            var signInContext = new SidSigningInContext(Context, Options, Options.AuthenticationScheme, signin.Principal, new AuthenticationProperties(signin.Properties), cookieOptions);

            DateTimeOffset issuedUtc;
            if (signInContext.Properties.IssuedUtc.HasValue)
            {
                issuedUtc = signInContext.Properties.IssuedUtc.Value;
            }
            else
            {
                issuedUtc = Options.SystemClock.UtcNow;
                signInContext.Properties.IssuedUtc = issuedUtc;
            }

            if (!signInContext.Properties.ExpiresUtc.HasValue)
            {
                signInContext.Properties.ExpiresUtc = issuedUtc.Add(Options.ExpireTimeSpan);
            }

            await Options.Events.SigningIn(signInContext);

            if (signInContext.Properties.IsPersistent)
            {
                var expiresUtc = signInContext.Properties.ExpiresUtc ?? issuedUtc.Add(Options.ExpireTimeSpan);
                signInContext.CookieOptions.Expires = expiresUtc.ToUniversalTime();
            }

            var ticket = new AuthenticationTicket(signInContext.Principal, signInContext.Properties, signInContext.AuthenticationScheme);
            if (Options.SessionStore != null)
            {
                if (sessionKey != null)
                {
                    await Options.SessionStore.RemoveAsync(sessionKey);
                }
                sessionKey = await Options.SessionStore.StoreAsync(ticket);
                if (string.IsNullOrWhiteSpace(sessionKey))
                {
                    throw new ArgumentNullException(nameof(sessionKey));
                }
                var principal = new ClaimsPrincipal(
                    new ClaimsIdentity(new[] { new Claim(SessionIdClaim, sessionKey, ClaimValueTypes.String, Options.ClaimsIssuer) },
                    Options.ClaimsIssuer));
                ticket = new AuthenticationTicket(principal, null, Options.AuthenticationScheme);
            }

            var cookieValue = Options.TicketDataFormat.Protect(ticket, GetTlsTokenBinding());

            Options.CookieManager.AppendResponseCookie(Context, Options.CookieName, cookieValue, signInContext.CookieOptions);

            var signedInContext = new SidSignedInContext(Context, Options, Options.AuthenticationScheme, signInContext.Principal, signInContext.Properties, null);

            await Options.Events.SignedIn(signedInContext);

            ApplyHeaders(signedInContext.Properties);
        }

        protected override async Task HandleSignOutAsync(SignOutContext signOutContext)
        {
            // Process the request cookie to initialize members like sessionKey.
            var ticket = await EnsureCookieTicket();
            var cookieOptions = BuildCookieOptions();
            if (Options.SessionStore != null && sessionKey!= null)
            {
                await Options.SessionStore.RemoveAsync(sessionKey);
            }

            var context = new SidSigningOutContext(
                Context,
                Options,
                new AuthenticationProperties(signOutContext.Properties),
                cookieOptions);

            await Options.Events.SigningOut(context);

            Options.CookieManager.DeleteCookie(
                Context,
                Options.CookieName,
                context.CookieOptions);

            ApplyHeaders(context.Properties);
        }

        private void ApplyHeaders(AuthenticationProperties properties)
        {
            Response.Headers[HeaderNames.CacheControl] = HeaderValueNoCache;
            Response.Headers[HeaderNames.Pragma] = HeaderValueNoCache;
            Response.Headers[HeaderNames.Expires] = HeaderValueMinusOne;
        }

        protected override Task<bool> HandleForbiddenAsync(ChallengeContext context)
        {
            return base.HandleForbiddenAsync(context);
        }

        protected override Task<bool> HandleUnauthorizedAsync(ChallengeContext context)
        {
            return base.HandleUnauthorizedAsync(context);
        }

        private string GetTlsTokenBinding()
        {
            var binding = Context.Features.Get<ITlsTokenBindingFeature>()?.GetProvidedTokenBindingId();
            return binding == null ? null : Convert.ToBase64String(binding);
        }
    }
}
