namespace Anytime.Phone.Setup
{
	public class HostingHelpers
	{
		private const string APPLICATION_NAME = "mailbox.renter";
		private readonly IWebHostEnvironment _webHostEnvironment;

		public HostingHelpers(IWebHostEnvironment webHostEnvironment)
		{
			_webHostEnvironment = webHostEnvironment;
		}

		public string IncludeJsFiles()
		{
#if DEBUG
			return IncludeJsFiles("debug");
#else
			return IncludeJsFiles("release");
#endif
		}

		public string IncludeJsFiles(string config)
		{
			if (config == "release")
				return $"<script type=\"text/javascript\" src=\"/assets/bundles/anytime.mailbox.renter.portal.min.js\" asp-append-version=\"true\"></script>";

			var root = _webHostEnvironment.WebRootPath;

			var files = Directory.GetFiles($"{root}\\assets\\js", "*.js", SearchOption.AllDirectories);

			string html = "";

			foreach (var file in files)
			{
				var filename = file.Replace(root, "").Replace("\\", "/");
				html = html + $@"<script type='text/javascript' src='{filename}'></script>";
			}

			return html;
		}

		public string IncludeCssFiles()
		{
#if DEBUG
			return IncludeCssFiles("debug");
#else
			return IncludeCssFiles("release");
#endif
		}

		public string IncludeCssFiles(string config)
		{
			if (config == "release")
				return $"<link rel=\"stylesheet\" href=\"/assets/bundles/anytime.mailbox.renter.portal.min.css\" asp-append-version=\"true\" />";

			var root = _webHostEnvironment.WebRootPath;

			var files = Directory.GetFiles($"{root}\\assets\\css", "*.css", SearchOption.AllDirectories);

			string html = "";

			foreach (var file in files)
			{
				var filename = file.Replace(root, "").Replace("\\", "/");
				html = html + $@"<link rel='stylesheet' href='{filename}' />";
			}

			return html;
		}

		//		public string IncludeLibFiles()
		//		{
		//#if DEBUG
		//			return IncludeLibFiles("debug");
		//#else
		//			return IncludeLibFiles("release");
		//#endif
		//		}

		//		public string IncludeLibFiles(string config)
		//		{
		//			var html = $@"
		//					<link href=""{KungFuiResourceVersion.CDN_HOST}/kungfui/kendo/styles/bootstrap-main.css?v=1"" rel=""stylesheet"" />
		//					<link href=""{KungFuiResourceVersion.CDN_HOST}/kungfui/fa/css/all.min.css?v=1"" rel=""stylesheet"" />
		//					<link href=""{KungFuiResourceVersion.CDN_HOST}/kungfui/fa/css/kungfui-fonts.css?v=1"" rel=""stylesheet"" />
		//					<script src=""{KungFuiResourceVersion.CDN_HOST}/kungfui/js/jquery-3.7.1.min.js?v=1"" ></script>
		//					<script src=""https://cdnjs.cloudflare.com/ajax/libs/jszip/2.4.0/jszip.js?v=1""></script>
		//					<script src=""{KungFuiResourceVersion.CDN_HOST}/kungfui/kendo/{KungFuiResourceVersion.KendoVersion}/kendo.all.min.js?v=1"" ></script>
		//					<script src=""{KungFuiResourceVersion.CDN_HOST}/kungfui/kendo/{KungFuiResourceVersion.KendoVersion}/kendo.aspnetmvc.min.js?v=1"" ></script>
		//				";

		//			if (config == "release")
		//				html += $@"
		//					<script src=""{KungFuiResourceVersion.CDN_HOST}/kungfui/js/kungfui.min.js?v={KungFuiResourceVersion.ScriptVersion}"" ></script>
		//					<link href=""{KungFuiResourceVersion.CDN_HOST}/kungfui/css/kungfui-{APPLICATION_NAME}.min.css?v={KungFuiResourceVersion.StyleSheetVersion}"" rel=""stylesheet"" />
		//				";
		//			else
		//				html += $@"
		//						<script src=""/assets/_debug/kungfui.js"" ></script>
		//						<link href=""/assets/_debug/kungfui-mailbox.renter.css"" rel=""stylesheet"" />
		//					";

		//			return html;
		//		}
	}
}
