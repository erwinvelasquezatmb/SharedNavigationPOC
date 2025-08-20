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

let htmlTemplate = `
<div class="container-fluid bg-white border-bottom">
    <nav class="main-header navbar-light bg-white">
        <div class="navbar container-fluid p-0">
            <div>
                <div class="header-logo {{LOGO_VISIBILITY}}">
                    {{LOGO}}
                </div>

                <div class="header-nav {{HAMBURGER_MENU_VISIBILITY}}">
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
                                {{HAMBURGER_MENU}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="">
                <div class="d-flex justify-content-end">
                    <div class="header-selector">
                        <div class="dropdown dropdown-selector {{SUBCONTEXT_VISIBILITY}}">
                            <button class="btn dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {{SELECTED_SUBCONTEXT_ITEM}}
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                {{SUBCONTEXT_ITEMS}}
                            </ul>
                        </div>
                    </div>


                    <div class="header-controls">
                        <div class="d-flex align-items-center gap-3 justify-content-end">
                            <div class="d-flex align-items-center gap-3">

                                <div class="dropdown {{NOTIFICATION_VISIBILITY}}">
                                    <button class="btn btn-link p-0 position-relative" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="bi bi-bell fs-5"></i>
                                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span>
                                    </button>
                                    <div class="dropdown-menu dropdown-menu-end notification-dropdown">
                                        {{NOTIFICATION_ITEMS}}
                                    </div>
                                </div>

                                <div class="dropdown {{APP_DRAWER_VISIBILITY}}">
                                    <button class="btn btn-link p-0" type="button" data-bs-toggle="dropdown"
                                            aria-expanded="false">
                                        <i class="bi bi-grid-3x3-gap fs-5"></i>
                                    </button>
                                    <div class="dropdown-menu dropdown-menu-end app-dropdown">
                                        <div class="d-flex justify-content-around">
                                            {{APP_DRAWER_ITEMS}}
                                        </div>
                                        {{APP_DRAWER_BUTTON}}
                                    </div>
                                </div>

                                <div class="dropdown {{PROFILE_VISIBILITY}}">
                                    <div class="profile-circle dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                        {{PROFILE_INITIALS}}
                                    </div>
                                    <ul class="dropdown-menu dropdown-menu-end">
                                        {{PROFILE_ITEMS}}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="sidebar-container d-flex {{SIDEBAR_VISIBILITY}}">
            <nav class="sidebar d-none d-md-block"  >
                <ul class="nav flex-column text-center">
                    {{SIDEBAR_ITEMS}}
                </ul>
            </nav>
            <div class="submenu-panel d-none d-md-block">
                {{SIDEBAR_SUB_MENU_ITEMS}}
            </div>
        </div>
    </nav>
</div>
`;

function renderNavigationFromModel(target, model) {
    var defaultTarget = $("body header").first();

    var targetContainer = defaultTarget;

    // override container if target is provided
    if (target && $.trim(target) !== "") {
        //if override target can't be located, fallback to default
        if ($('#' + target).length !== 0) {
            targetContainer = $('#' + target);
        }
        // if final target still can't be found, then throw error
        if (targetContainer.length === 0) {
            console.error('target container could not be found');
            return;
        }
    }

    let navigationHtml = replaceTemplateVariables(model);

    targetContainer.html(navigationHtml);
}

function replaceTemplateVariables(model) {
    //LOGO
    let logoVisibility = "hidden";
    if (model.header?.logo) {
        logoVisibility = "";
        const modelLogo = `
            <a class="navbar-brand" href="${model.header.logo.targetUri}">
                <img src="${model.header.logo.imageUri}" alt="${model.header.logo.tooltip}" class="header-logo me-2">
            </a>
        `;

        htmlTemplate = htmlTemplate.replaceAll("{{LOGO}}", modelLogo);
    }
    htmlTemplate = htmlTemplate.replaceAll("{{LOGO_VISIBILITY}}", logoVisibility);

    //HAMBURGER MENU
    let hamburgerMenuVisibility = "hidden";
    if (model.sideNavigation && model.sideNavigation.length > 0) {
        hamburgerMenuVisibility = '';
        let hamburgerMenuHtml = '';

        model.sideNavigation.forEach((item, index) => {

            if (item.subMenuItems && item.subMenuItems.length > 0) {
                hamburgerMenuHtml += `
                <div class="accordion-item">
                    <h2 class="accordion-header" >
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                        ${item.label}
                    </button>
                    </h2>
                    <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#mobileAccordion">
                        <div class="accordion-body p-0">
                `;
                item.subMenuItems.forEach(subItem => {
                    hamburgerMenuHtml += `
                        <a href="${subItem.targetUri}" class="submenu-link" title="${subItem.tooltip}">${subItem.label}</a>
                    `;
                });

                hamburgerMenuHtml += `
                        </div>
                    </div>
                </div>
                `;

            } else {
                hamburgerMenuHtml += `
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <a href=${item.targetUri} class="accordion-link">${item.label}</a>
                    </h2>
                </div>
                `;
            }
        });

        htmlTemplate = htmlTemplate.replaceAll("{{HAMBURGER_MENU}}", hamburgerMenuHtml);
    }
    htmlTemplate = htmlTemplate.replaceAll("{{HAMBURGER_MENU_VISIBILITY}}", hamburgerMenuVisibility);

    // SUBCONTEXT
    let subContextVisibility = "hidden";
    if (model.header?.subcontext && model.header?.subcontext.length > 0) {
        subContextVisibility = "";

        const items = model.header.subcontext;

        //FIND THE FIRST ITEM THAT HAS SELECTED = TRUE
        let firstSelected = items.find(item => item.selected === true);

        //IF NO ITEM IS SELECTED, USE THE FIRST ITEM IN THE LIST
        if (!firstSelected && items.length > 0) {
            firstSelected = items[0];
        }
        htmlTemplate = htmlTemplate.replaceAll("{{SELECTED_SUBCONTEXT_ITEM}}", firstSelected.label);

        let subContextItems = '';
        model.header.subcontext.forEach((item) => {
            const isSelected = item === firstSelected ? "selected" : "";
            subContextItems += `<li><a class="dropdown-item ${isSelected}" href="${item.targetUri}" title="${item.tooltip}">${item.label}</a></li>`;
        });

        htmlTemplate = htmlTemplate.replaceAll("{{SUBCONTEXT_ITEMS}}", subContextItems);
    }
    htmlTemplate = htmlTemplate.replaceAll("{{SUBCONTEXT_VISIBILITY}}", subContextVisibility);

    //NOTIFICATIONS
    let notificationVisibility = "hidden";
    if (model.header?.notifications) {
        notificationVisibility = "";
        //TODO
    }
    htmlTemplate = htmlTemplate.replaceAll("{{NOTIFICATION_VISIBILITY}}", notificationVisibility);
    
    //APP DRAWER
    let appDrawerVisibility = "hidden";
    if (model.header?.appDrawer) {
        appDrawerVisibility = "";

        //CREATE APP DRAWER BUTTON
        if (model.header?.appDrawer?.actionbutton) {
            let appDrawerButton = `
                <button class="my-account-btn mt-2" onclick="${model.header.appDrawer.actionbutton.targetUri}" title="${model.header.appDrawer.actionbutton.tooltip}">
                    ${model.header.appDrawer.actionbutton.label}
                </button>
            `
            htmlTemplate = htmlTemplate.replaceAll("{{APP_DRAWER_BUTTON}}", appDrawerButton);
        }

        //CREATE APP DRAWER ITEMS
        let appDrawerItems = '';
        model.header.appDrawer.appItems.forEach((item) => {
            appDrawerItems += `
                <a href="${item.targetUri}" class="app-item text-decoration-none text-dark">
                    <img src="${item.imageUri}" alt="${item.label}" title="${item.tooltip}">
                    <span>${item.label}</span>
                </a>
            `;
        });
        htmlTemplate = htmlTemplate.replaceAll(" {{APP_DRAWER_ITEMS}}", appDrawerItems);
    }
    htmlTemplate = htmlTemplate.replaceAll("{{APP_DRAWER_VISIBILITY}}", appDrawerVisibility);
   
    //PROFILE
    let profileVisibility = "hidden";
    if (model.header?.profile) {
        profileVisibility = "";

        //CREATE AVATAR
        initials = model.header.profile.firstName[0].toUpperCase() + model.header.profile.lastName[0].toUpperCase();
        htmlTemplate = htmlTemplate.replaceAll("{{PROFILE_INITIALS}}", initials)


        //CREATE PROFILE ITEMS
        let profileItems = ''
        model.header.profile.actionLinks.forEach((item) => {
            profileItems += `
                <li><a class="dropdown-item" href="${item.targetUri}" title="${item.tooltip}">${item.label}</a></li>
            `;
        });
        htmlTemplate = htmlTemplate.replaceAll("{{PROFILE_ITEMS}}", profileItems)
    }
    htmlTemplate = htmlTemplate.replaceAll("{{PROFILE_VISIBILITY}}", profileVisibility);
    
    //SIDE NAVIGATION
    let sidebarVisibility = "hidden";
    if (model.sideNavigation && model.sideNavigation.length > 0) {
        sidebarVisibility = "";

        //FIND THE FIRST ITEM THAT HAS SELECTED = TRUE
        let firstSelected = model.sideNavigation.find(item => item.selected === true);

        //IF NO ITEM IS SELECTED, USE THE FIRST ITEM IN THE LIST
        if (!firstSelected && model.sideNavigation.length > 0) {
            firstSelected = items[0];
        }

        let sideBarItems = "";
        let sideBarSubMenuItems = "";

        model.sideNavigation.forEach((item, index) => {
            let hasSubMenus = false;

            if (item.subMenuItems && item.subMenuItems.length > 0) {
                hasSubMenus = true;

                sideBarSubMenuItems += `<div class="submenu" id="menu-item-${index}">`;

                item.subMenuItems.forEach(subItem => {
                    sideBarSubMenuItems += ` <a href="${subItem.targetUri}" title=${subItem.tooltip}>${subItem.label}</a>`
                });

                sideBarSubMenuItems += `</div>`;
            }

            const isSelected = item === firstSelected ? "selected" : "";

            if (hasSubMenus) {
                sideBarItems += `
                    <li class="nav-item" data-menu="item-${index}">
                        <a class="nav-link ${isSelected}"><i class="${item.iconClass}"></i></a>
                    </li>
                `;
            }
            else {
                sideBarItems += `
                    <li class="nav-item">
                        <a href="${item.targetUri}" class="nav-link ${isSelected}" title="${item.tooltip}"><i class="${item.iconClass}"></i></a>
                    </li>
                `;
            }
        });

        htmlTemplate = htmlTemplate.replaceAll("{{SIDEBAR_ITEMS}}", sideBarItems);
        htmlTemplate = htmlTemplate.replaceAll("{{SIDEBAR_SUB_MENU_ITEMS}}", sideBarSubMenuItems);
    }
    htmlTemplate = htmlTemplate.replaceAll("{{SIDEBAR_VISIBILITY}}", sidebarVisibility)

    return htmlTemplate;
}

