using Anytime.Customer.Api.Middleware;
using Anytime.Mailbox.Renter.Portal.Models;
using Anytime.Mailbox.Renter.Portal.Setup;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.UI;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

var configBuilder = new ConfigurationBuilder()
	.AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
	.AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json", true)
	.AddJsonFile($"appsettings.{Environment.MachineName}.json", true);

var config = configBuilder.Build();
builder.Services.Configure<AppSettings>(config.GetSection(nameof(AppSettings)));
var settings = config.GetSection(nameof(AppSettings)).Get<AppSettings>();



// MINIMUM, defaults all endpoints to have ALLOWANONYMOUS, explicit set to AUTHORIZE
//builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
//	.AddMicrosoftIdentityWebApp(builder.Configuration);

//builder.Services.AddControllersWithViews()
//	.AddMicrosoftIdentityUI();

//builder.Services.AddRazorPages()
//	.AddMicrosoftIdentityUI();
// --

builder.Services.AddLocalization();

// ALWAYS, defaults all endpoints to have AUTHORIZE, explicit set to ALLOWANONYMOUS
builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
	.AddMicrosoftIdentityWebApp(builder.Configuration);

builder.Services.AddControllersWithViews(options =>
{
	var policy = new AuthorizationPolicyBuilder()
		.RequireAuthenticatedUser()
		.Build();
	options.Filters.Add(new AuthorizeFilter(policy));
}).AddMicrosoftIdentityUI();

builder.Services.AddRazorPages()
	.AddMvcOptions(options =>
	{
		var policy = new AuthorizationPolicyBuilder()
			.RequireAuthenticatedUser()
			.Build();
		options.Filters.Add(new AuthorizeFilter(policy));
	})
	.AddMicrosoftIdentityUI();
// --


builder.Services.Configure<CookieAuthenticationOptions>(
	CookieAuthenticationDefaults.AuthenticationScheme, options =>
	{
		options.AccessDeniedPath = "/Account/AccessDenied"; // Adjust path as needed
	});

builder.Services.AddRazorPages();

builder.Services.ConfigureApplicationCookie(config =>
{
	config.ExpireTimeSpan = TimeSpan.FromHours(1);
	config.SlidingExpiration = true;
});

builder.Services.AddSingleton<HostingHelpers>();

var app = builder.Build();

app.UseRequestLocalization(new RequestLocalizationOptions
{
	// Default: use whatever the browser sends
	DefaultRequestCulture = new RequestCulture(CultureInfo.CurrentCulture.Name),

	// Set the provider to Accept-Language only (browser)
	RequestCultureProviders = new[] { new AcceptLanguageHeaderRequestCultureProvider() }
});


// Configure the HTTP request pipeline.
//app.UseMiddleware<ExceptionHandlingMiddleware>();

if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Home/Error");
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

//app.UseStatusCodePages(async context =>
//{
//	var response = context.HttpContext.Response;

//	if (response.StatusCode == 403 || response.StatusCode == 401)
//	{
//		response.Redirect("/Account/AccessDenied");
//	}
//	await Task.CompletedTask;
//});


app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
	name: "default",
	pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
