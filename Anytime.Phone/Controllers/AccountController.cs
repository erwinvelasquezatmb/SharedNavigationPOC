using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Anytime.Phone.Controllers
{
	public class AccountController : Controller
	{
		[AllowAnonymous]
		public IActionResult Signout(string redirectUrlafterSignOut)
		{
			return SignOut(
				new AuthenticationProperties
				{
					RedirectUri = redirectUrlafterSignOut
				},
				CookieAuthenticationDefaults.AuthenticationScheme,   // Local sign-out
				OpenIdConnectDefaults.AuthenticationScheme           // Azure Entra sign-out
			);
		}

		[AllowAnonymous]
		public IActionResult SignedOut()
		{
			return View();
		}

		[AllowAnonymous]
		[HttpGet]
		public IActionResult AccessDenied()
		{
			return View();
		}
	}
}
