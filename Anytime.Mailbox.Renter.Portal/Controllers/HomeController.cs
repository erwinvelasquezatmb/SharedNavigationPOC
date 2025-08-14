using Anytime.Mailbox.Renter.Portal.Models;
using Anytime.Mailbox.Renter.Portal.ViewModels;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Anytime.Mailbox.Renter.Portal.Controllers
{
	public class HomeController : Controller
	{
		public async Task<IActionResult> Index()
		{
			return View();
		}

		//[Authorize(Roles = "HRManager,Finance")]
		public IActionResult Privacy()
		{
			// though the session is authenticated, this should fail since the user is not authorized for this page
			return View();
		}

		[AllowAnonymous]
		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}

		public async Task<IActionResult> Inbox()
		{
			return View();
		}

		public async Task<IActionResult> Archive()
		{
			return View();
		}
	}
}
