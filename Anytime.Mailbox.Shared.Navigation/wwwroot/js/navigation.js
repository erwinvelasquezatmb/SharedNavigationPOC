function loadNavigationBar(target, model) {

    if ($(target) === 0) {
        console.error('target not found');
        return;
    }

    let navHtml = `
        <nav class="navbar navbar-light bg-white border-bottom px-3">
            <div class="container-fluid">
    `;

    //Logo
    if (model.logo) {
        const logoHref = model.logo.href || '#';
        const logoSrc = model.logo.src || '';
        const logoText = model.logo.text || '';

        navHtml += `
        <a class="navbar-brand d-flex align-items-center" href="${logoHref}">
            <img src="${logoSrc}" alt="${logoText}" class="header-logo me-2">
        </a>
        `;
    }

    navHtml += `<div class="d-flex align-items-center gap-3">`

    //Dropdown
    if (model.dropdownItems && model.dropdownItems.length > 0) {
        const firstItemText = model.dropdownItems[0].text;

        navHtml += `
        <div class="dropdown">
            <button class="btn btn-outline-secondary dropdown-toggle btn-sm" type="button" id="mailboxDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                ${firstItemText}
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="mailboxDropdown">
        `;

        model.dropdownItems.forEach(item => {
            const itemHref = item.href || '#';
            const itemText = item.text || '';
            navHtml += `<li><a class="dropdown-item" href="${itemHref}">${itemText}</a></li>`;
        });

        navHtml += `
            </ul>
        </div>
        `;
    }

    //Notifications
    if (model.notifications?.list?.length > 0) {
        navHtml += `
        <div class="dropdown">
            <button class="btn btn-link p-0 position-relative" type="button" id="notificationDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-bell fs-5"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">${model.notifications.count}</span>
            </button>
            <div class="dropdown-menu dropdown-menu-end notification-dropdown" aria-labelledby="notificationDropdown">
        `;

        model.notifications.list.forEach(item => {
            navHtml += `<div class="notification-item">${item}</div>`;
        });

        navHtml += ` 
            </div>
        </div>
        `;
    }

    //App Grid
    if (model.applications?.list?.length > 0) {
        navHtml += `
        <div class="dropdown">
            <button class="btn btn-link p-0" type="button" id="appGridDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-grid-3x3-gap fs-5"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-end app-dropdown" aria-labelledby="appGridDropdown">
                <div class="d-flex justify-content-around">
        `;


        model.applications.list.forEach(item => {
            navHtml += `
            <a href="${item.href}" class="app-item text-decoration-none text-dark">
                <img src="${item.src}" alt="Anytime Mailbox">
                <span>${item.text}</span>
            </a>
            `;
        });


        navHtml += `
          </div>
            <button class="my-account-btn mt-2">${model.applications.buttonText}</button>
          </div>
        </div>
        `;
    }


    //Profile
    if (model.profile?.menuItems?.length > 0) {
        navHtml += `
        <div class="dropdown">
            <div class="profile-circle dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                ${model.profile.userInitial}
            </div>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
        `;

        model.profile.menuItems.forEach(item => {
            navHtml += `<li><a class="dropdown-item" href="${item.href}">${item.text}</a></li>`;
        });

        navHtml += `
            </ul>
        </div>
        `;
    }


    navHtml += `
            </div>
        </div>
    </nav>
    `;


    $(target).html(navHtml);
}