$(function () {
    $('.sidebar').on('click', '.nav-item, .nav-item *', function (e) {
        var $item = $(this).closest('.nav-item');
        var menuName = $item.data('menu');
        var $submenu = $('#menu-' + menuName);

        if (!$submenu.length) {
            $('.submenu-panel').removeClass('open');
            $('.submenu').removeClass('active');
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        $('.submenu-panel').addClass('open');
        $('.submenu').removeClass('active');
        $submenu.addClass('active');
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.sidebar, .submenu-panel').length) {
            $('.submenu-panel').removeClass('open');
            $('.submenu').removeClass('active');
        }
    });
});

function loadNavigationBar(target, model) {

    if ($(target) === 0) {
        console.error('target not found');
        return;
    }

    let navHtml = `
    <div class="container-fluid bg-white border-bottom">
        <nav class="main-header navbar-light bg-white">
            <div class="navbar container-fluid p-0">
                <div>
                    <div class="header-logo">
    `;

    //Logo
    if (model.logo) {
        const logoHref = model.logo.href || '#';
        const logoSrc = model.logo.src || '';
        const logoText = model.logo.text || '';

        navHtml += `
            <a class="navbar-brand" href="${logoHref}">
                <img src="${logoSrc}" alt="${logoText}" class="header-logo me-2">
            </a>
        </div>
        `;
    }

    navHtml += `
    <div class="header-nav">
        <button class="btn btn-link p-0 me-2 d-lg-none" type="button" data-bs-toggle="offcanvas"
        data-bs-target="#mobileMenu" aria-controls="mobileMenu">
            <i class="bi bi-list fs-3"></i>
        </button>

        <div class="offcanvas offcanvas-top" tabindex="-1" id="mobileMenu" aria-labelledby="mobileMenuLabel">
        <div class="offcanvas-header">
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>

        <div class="offcanvas-body p-0">
            <div class="accordion accordion-flush" id="mobileAccordion">
    `;

    //Hamburger
    if (model.menuItems && model.menuItems.length > 0) {

        model.menuItems.forEach((item, index) => {

            if (item.subMenuItems && item.subMenuItems.length > 0) {
                navHtml += `
                <div class="accordion-item">
                    <h2 class="accordion-header" >
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                        ${item.text}
                    </button>
                    </h2>
                    <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}"
                        data-bs-parent="#mobileAccordion">
                        <div class="accordion-body p-0">
                `;
                item.subMenuItems.forEach(subItem => {
                    navHtml += `
                    <a href="${subItem.href}" class="submenu-link">${subItem.text}</a>
                    `;
                });

                navHtml += `
                        </div>
                    </div>
                </div>
                `;

            } else {
                navHtml += `
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <a href=${item.href} class="accordion-link">${item.text}</a>
                    </h2>
                </div>
                `;
            }
        });

        navHtml += `
                    </div>
                </div>
              </div>
            </div>
          </div>
        `;
    }

    //Dropdown
    if (model.dropdownItems && model.dropdownItems.length > 0) {
        const firstItemText = model.dropdownItems[0].text;

        navHtml += `
        <div class="">
            <div class="d-flex justify-content-end">
              <div class="header-selector">
                <div class="dropdown">
                  <button class="btn dropdown-toggle btn-sm border" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ${firstItemText}
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
        `;

        model.dropdownItems.forEach(item => {
            const itemhref = item.href || '#';
            const itemtext = item.text || '';
            navHtml += `<li><a class="dropdown-item" href="${itemhref}">${itemtext}</a></li>`;
        });

        navHtml += `
                </ul>
            </div>
        </div>
        `;
    }

    navHtml += `
    <div class="header-controls">
        <div class="d-flex align-items-center gap-3 justify-content-end">
        <div class="d-flex align-items-center gap-3">
    `;

    //Notification
    if (model.notifications?.list?.length > 0) {
        navHtml += `
        <div class="dropdown">
            <button class="btn btn-link p-0 position-relative" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-bell fs-5"></i>
            <span
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span>
            </button>
            <div class="dropdown-menu dropdown-menu-end notification-dropdown">
        `;

        model.notifications.list.forEach(item => {
            const notifHref = item.href || '#';
            navHtml += `<a href="${notifHref}" class="dropdown-item">${item.text}</a>`;
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
            <button class="btn btn-link p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-grid-3x3-gap fs-5"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-end app-dropdown">
                <div class="d-flex justify-content-around">
        `;


        model.applications.list.forEach(item => {
            navHtml += `
            <a href="${item.href}" class="app-item text-decoration-none text-dark">
                <img src="${item.src}" alt="${item.text}">
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
            <div class="profile-circle dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                ${model.profile.userInitial}
            </div>
            <ul class="dropdown-menu dropdown-menu-end">
        `;

        model.profile.menuItems.forEach(item => {
            navHtml += `<li><a class="dropdown-item" href="${item.href}">${item.text}</a></li>`;
        });

        navHtml += `
            </ul>
        </div>
        `;
    }


    //End Header
    navHtml += `
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    `;

    //Start Side Menu
    if (model.menuItems && model.menuItems.length > 0) {

        let subMenuPanel = '';

        navHtml += `
        <div class="sidebar-container d-flex">
            <nav class="sidebar d-none d-md-block">
                <ul class="nav flex-column text-center">
        `;

        model.menuItems.forEach((item, index) => {
            if (item.subMenuItems && item.subMenuItems.length > 0) {
                if (subMenuPanel.length === 0) {
                    subMenuPanel += `<div class="submenu-panel d-none d-md-block">`
                }

                subMenuPanel += `<div class="submenu" id="menu-item-${index}">`;

                item.subMenuItems.forEach(subItem => {
                    subMenuPanel += ` <a href="${subItem.href}">${subItem.text}</a>`
                });

                subMenuPanel += `</div>`;

                navHtml += `
                <li class="nav-item" data-menu="item-${index}">
                    <a class="nav-link"><i class="${item.iconClass}"></i></a>
                </li>
                `;

            } else {
                navHtml += `
                <li class="nav-item">
                    <a href="${item.href}" class="nav-link"><i class="${item.iconClass}"></i></a>
                </li>
                `;
            }
        });


        navHtml += `
            </ul>
        </nav>
        `;

        if (subMenuPanel.length !== 0) {
            navHtml += `
            ${subMenuPanel}
            </div>
            `;
        } else {
            navHtml += `</div>`
        }
    };





















    navHtml += `
             </nav>
        </div>
        `;


    $(target).html(navHtml);
}