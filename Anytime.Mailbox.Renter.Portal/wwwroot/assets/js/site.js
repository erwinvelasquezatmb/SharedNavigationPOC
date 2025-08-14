// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

async function signOut() {
	console.log('logout');
	/*window.location.href = '/MicrosoftIdentity/Account/SignOut';*/
	window.location.href = '/Account/Signout?redirectUrlafterSignOut=/Account/SignedOut';
}