namespace Anytime.Mailbox.Renter.Portal.Models
{
	public class AppSettings
	{
		private string mainConnectionString = string.Empty;

		public string MainConnectionString { get => mainConnectionString; set { mainConnectionString = value; } }
	}
}
