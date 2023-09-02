using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public BasicAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock) : base(options, logger, encoder, clock)
    {
        //
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var authHeader = Request.Headers["Authorization"].ToString();
        if (authHeader != null && authHeader.StartsWith("basic", StringComparison.OrdinalIgnoreCase))
        {

            var token = authHeader.Substring("Basic ".Length).Trim();
            var credentialstring = Encoding.UTF8.GetString(Convert.FromBase64String(token));
            var credentials = credentialstring.Split(':');

            //in reality, we would have a list of usernames with passwords, but the only user for now is root, with password root
            if (credentials[0] == "root" && credentials[1] == "root")
            {
                var claims = new[] { new Claim("name", credentials[0]), new Claim(ClaimTypes.Role, "Admin") };
                var identity = new ClaimsIdentity(claims, "Basic");
                var claimsPrincipal = new ClaimsPrincipal(identity);
                return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(claimsPrincipal, Scheme.Name)));
            }
            else
            {
                Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.FromResult(AuthenticateResult.Fail("Invalid Authorization Header; invalid credentials"));
            }
        }
        else
        {
            Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.FromResult(AuthenticateResult.Fail("Invalid Authorization Header; either missing or wrongly specified"));
        }
    }
}