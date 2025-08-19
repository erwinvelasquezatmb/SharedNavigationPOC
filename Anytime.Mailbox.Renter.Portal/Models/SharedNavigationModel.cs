namespace Anytime.Mailbox.Renter.Portal.Models
{
	public class SharedNavigationModel
	{
		public Header? Header { get; set; }
		public List<ListItem>? SideNavigation { get; set; }
	}

	public class Header
	{
		public ListItem? Logo { get; set; }
		public Notification? Notification { get; set; }
		public List<ListItem>? SubContext { get; set; }
		public AppDrawer? AppDrawer { get; set; }
		public Profile? Profile { get; set; }
	}

	public class Notification
	{
		public string? SourceUri { get; set; }
		public int Frequency { get; set; } = 1000;
	}

	public class AppDrawer
	{
		public ListItem? ActionButton { get; set; }
		public List<ListItem>? AppItems { get; set; }
	}

	public class Profile
	{
		public string FirstName { get; set; } = string.Empty;
		public string LastName { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public List<ListItem>? ActionLinks { get; set; }
	}

	public class ListItem
	{
		public string? ImageUri { get; set; }
		public string? TargetUri { get; set; }
		public string? Label { get; set; }
		public string? IconClass { get; set; }
		public string? ToolTip { get; set; }
		public bool? Selected { get; set; }
		public List<ListItem>? SubMenuItems { get; set; }
	}
}