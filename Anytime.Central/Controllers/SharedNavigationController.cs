using Anytime.Central.Models;
using Microsoft.AspNetCore.Mvc;

namespace Anytime.Central.Controllers
{
	public class SharedNavigationController : Controller
	{
		public IActionResult Index()
		{
			return View();
		}

		public async Task<IActionResult> GetSharedNavigationModel()
		{
			var model = new SharedNavigationModel()
			{
				Header = new Header()
				{
					Logo = new ListItem()
					{
						ImageUri = "https://atp-stage-cdn.s3.ap-southeast-1.amazonaws.com/DEMOOnly/images/logo_AC_transparent.png",
						TargetUri = "https://localhost:7225",
						Label = "Anytime Central"
					},
					AppDrawer = new AppDrawer()
					{
						Button = new ListItem()
						{
							TargetUri = "/",
							Label = "My Account"
						},
						ListItems = new List<ListItem>()
						{
							new ListItem()
							{
								TargetUri = "https://localhost:7231",
								ImageUri = "https://atp-stage-cdn.s3.ap-southeast-1.amazonaws.com/DEMOOnly/images/logo-atmb-mailbox.png",
								Label = "Anytime Mailbox Renter",
								ToolTip = "AMR tooltip"
							},
							new ListItem()
							{
								TargetUri = "https://localhost:7250",
								ImageUri = "https://atp-stage-cdn.s3.ap-southeast-1.amazonaws.com/DEMOOnly/images/logo-atmb-phones.png",
								Label = "Anytime Phone",
								ToolTip = "AP tooltip"
							}
						}
					},
					Profile = new Profile()
					{
						FirstName = "John",
						LastName = "Doe",
						Email = "john.doe@somewhere.com",
						ListItems = new List<ListItem>()
						{

							new ListItem()
							{
								TargetUri = "/",
								Label = "My Profile"
							},
							new ListItem()
							{
								TargetUri = "/",
								Label = "Settings"
							},
							new ListItem()
							{
								TargetUri = "/",
								Label = "Logout"
							}
						}
					}
				}
			};


			return await Task.FromResult(Json(model));
		}
	}
}
