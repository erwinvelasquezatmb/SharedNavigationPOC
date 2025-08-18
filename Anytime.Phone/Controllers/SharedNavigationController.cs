using Anytime.Phone.Models;
using Microsoft.AspNetCore.Mvc;

namespace Anytime.Phone.Controllers
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
						ImageUri = "https://atp-stage-cdn.s3.ap-southeast-1.amazonaws.com/DEMOOnly/images/logo_anytimephone_transparent.png",
						TargetUri = "https://localhost:7250",
						Label = "Anytime Phone",
						ToolTip = "Logo tooltip"
					},
					AppDrawer = new AppDrawer()
					{
						Button = new ListItem()
						{
							TargetUri = "/",
							Label = "My Account",
							ToolTip = "Button tooltip"
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
								TargetUri = "https://localhost:7225",
								ImageUri = "https://atp-stage-cdn.s3.ap-southeast-1.amazonaws.com/DEMOOnly/images/logo-atmb-bacc.png",
								Label = "Anytime Central",
								ToolTip = "AC tooltip"
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
								Label = "My Profile",
								ToolTip = "My profile tooltip"
							},
							new ListItem()
							{
								TargetUri = "/",
								Label = "Settings",
								ToolTip = "Settings tooltip"
							},
							new ListItem()
							{
								TargetUri = "/",
								Label = "Logout",
								ToolTip = "Logout tooltip"
							}
						}
					}
				},
				SideNavigation = new List<ListItem>()
				{
					new ListItem()
					{
						TargetUri = "/Home/Inbox",
						Label = "Inbox",
						IconClass = "bi bi-envelope",
						Selected = true,
						ToolTip = "Inbox tooltip"
					},
					new ListItem()
					{
						TargetUri = "/Home/Archive",
						Label = "Archive",
						IconClass = "bi bi-archive",
						Selected = false,
						ToolTip = "Archive tooltip"
					},
					new ListItem()
					{
						TargetUri = "/",
						Label = "Settings",
						IconClass = "bi bi-gear",
						Selected = false,
						ToolTip = "Settings tooltip",
						ListItems = new List<ListItem>()
						{
							new ListItem()
							{
								TargetUri = "/",
								Label = "General",
								Selected = false,
								ToolTip = "General tooltip"
							},
							new ListItem()
							{
								TargetUri = "/",
								Label = "Security",
								Selected = false,
								ToolTip = "Security tooltip"
							},
							new ListItem()
							{
								TargetUri = "/",
								Label = "Notifications",
								Selected = false,
								ToolTip = "Notifications tooltip"
							}
						}
					},
					new ListItem()
					{
						TargetUri = "/",
						Label = "Help",
						IconClass = "bi bi-question-circle",
						Selected = false,
						ToolTip = "Help tooltip",
						ListItems = new List<ListItem>()
						{
							new ListItem()
							{
								TargetUri = "/",
								Label = "FAQ",
								Selected = false,
								ToolTip = "FAQ tooltip"
							},
							new ListItem()
							{
								TargetUri = "/",
								Label = "Contact Support",
								Selected = false,
								ToolTip = "Contact Support tooltip"
							}
						}
					}
				}
			};


			return await Task.FromResult(Json(model));
		}
	}
}
