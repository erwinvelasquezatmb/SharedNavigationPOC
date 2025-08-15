// This is the HTML Template
var htmlTemplate = `
    <div class="container-fluid bg-white border-bottom">
        <nav class="main-header navbar-light bg-white">
            <div class="navbar container-fluid p-0">
                <div>
                    <div class="header-logo">
                        {{LOGO}}
                    </div>
                    <div class="header-nav">
                        <button class="btn btn-link p-0 me-2 d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu" aria-controls="mobileMenu">
                            <i class="bi bi-list fs-3"></i>
                        </button>

                        <div class="offcanvas offcanvas-top" tabindex="-1" id="mobileMenu" aria-labelledby="mobileMenuLabel">
                            <div class="offcanvas-header">
                                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>

                            <div class="offcanvas-body p-0">
                                <div class="accordion accordion-flush" id="mobileAccordion">

                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <a href="/Home/Inbox" class="accordion-link">Inbox</a>
                                        </h2>
                                    </div>

                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <a href="/Home/Archive" class="accordion-link">Archive</a>
                                        </h2>
                                    </div>

                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                                                Settings
                                            </button>
                                        </h2>
                                        <div id="collapse2" class="accordion-collapse collapse" aria-labelledby="heading2" data-bs-parent="#mobileAccordion">
                                            <div class="accordion-body p-0">

                                                <a href="/" class="submenu-link">General</a>

                                                <a href="/" class="submenu-link">Security</a>

                                                <a href="/" class="submenu-link">Notifications</a>

                                            </div>
                                        </div>
                                    </div>

                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
                                                Help
                                            </button>
                                        </h2>
                                        <div id="collapse3" class="accordion-collapse collapse" aria-labelledby="heading3" data-bs-parent="#mobileAccordion">
                                            <div class="accordion-body p-0">

                                                <a href="/" class="submenu-link">FAQ</a>

                                                <a href="/" class="submenu-link">Contact Support</a>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="">
                    <div class="d-flex justify-content-end">
                        <div class="header-selector">
                            <div class="dropdown {{DROPDOWN_VISIBILITY}}">
                                {{SELECTED_DROPDOWN_ITEM}}
                                <ul class="dropdown-menu dropdown-menu-end" data-bs-popper="static">
                                    {{DROPDOWN_ITEMS}}      
                                </ul>
                            </div>
                        </div>

                        <div class="header-controls">
                            <div class="d-flex align-items-center gap-3 justify-content-end">
                                <div class="d-flex align-items-center gap-3">

                                    <div class="dropdown {{APP_SWITCHER_VISIBILITY}}">
                                        <button class="btn btn-link p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="bi bi-grid-3x3-gap fs-5"></i>
                                        </button>
                                        <div class="dropdown-menu dropdown-menu-end app-dropdown">
                                            <div class="d-flex justify-content-around">
                                                {{APP_ITEMS}}
                                            </div>
                                            <button class="my-account-btn mt-2">My Account</button>
                                        </div>
                                    </div>

                                    <div class="dropdown">
                                        <div class="profile-circle dropdown-toggle  {{PROFILE_ICON_VISIBILITY}}" data-bs-toggle="dropdown" aria-expanded="false">
                                            {{PROFILE_INITIALS}}
                                        </div>
                                        <ul class="dropdown-menu dropdown-menu-end">
                                            {{PROFILE_MENU_ITEMS}}
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="sidebar-container d-flex">
                <nav class="sidebar d-none d-md-block {{SIDEBAR_VISIBILITY}}">
                    <ul class="nav flex-column text-center">
                        {{SIDEBAR_ITEMS}}
                    </ul>
                </nav>

                <div class="submenu-panel d-none d-md-block {{SIDEBAR_VISIBILITY}}">
                    {{SIDEBAR_SUB_MENU_ITEMS}}
                </div>

            </div></nav>
        </div >
`;

// This is the default model
var defaultModel = {
    logo: {
        src: "https://atp-stage-cdn.s3.ap-southeast-1.amazonaws.com/DEMOOnly/images/logo.png",
        href: "/",
        text: "Anytime Renter Portal"
    }
}


function RenderNavigation(model, target) {
    // FIND THE TARGET CONTAINER
    // set header element as the default container 
    var targetContainer = $("body header").first();

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


    // LOAD THE DATA MODEL
    // load default model if no override is provided
    if (!$.trim(model)) {
        model = defaultModel;
    }

    // LET'S REPLACE THE TEMPLATE VARIABLE
    var finaHeaderHtml = ReplaceVariables(model, htmlTemplate);
    

    // INSERT THE FINAL HTML TO THE TARGET CONTAINER
    targetContainer.html(finaHeaderHtml);
}


function ReplaceVariables(model, template) {
    // {{LOGO}}
    if (model.logo) {
        var logoHref = model.logo.href || '#';
        var logoSrc = model.logo.src || '';
        var logoText = model.logo.text || '';

        var modelLogo = `
            <a class="navbar-brand" href="${logoHref}">
                <img src="${logoSrc}" alt="${logoText}" class="header-logo me-2">
            </a>
        `;

        template = template.replaceAll("{{LOGO}}", modelLogo);
    }

    // {{SIDEBAR_VISIBILITY}} by default sidebar is hidden
    var sidebarVisibility = "hidden";
    if (model.menuItems && model.menuItems.length > 0) {
        // remove "hidden"" if there are sidebar menu items on the model
        sidebarVisibility = "";

        // {{SIDEBAR_ITEMS}}
        var modelSidebarItems = "";
        var modelSidebarSubMenuItems = "";
        if (model.menuItems && model.menuItems.length > 0) {
            model.menuItems.forEach((item, index) => {
                    
                var hasSubMenus = false;
                if (item.subMenuItems && item.subMenuItems.length > 0) {
                    hasSubMenus = true;
                    modelSidebarSubMenuItems += `<div class="submenu" id="menu-item-${index}">`;

                    item.subMenuItems.forEach(subItem => {
                        modelSidebarSubMenuItems += ` <a href="${subItem.href}">${subItem.text}</a>`
                    });

                    modelSidebarSubMenuItems += `</div>`;
                }

                if (hasSubMenus) {
                    modelSidebarItems += `
                        <li class="nav-item" data-menu="item-${index}">
                            <a class="nav-link"><i class="${item.iconClass}"></i></a>
                        </li>
                    `;
                }
                else {
                    modelSidebarItems += `
                        <li class="nav-item">
                            <a href="${item.href}" class="nav-link"><i class="${item.iconClass}"></i></a>
                        </li>
                    `;
                }
                    
            });
        }
        template = template.replaceAll("{{SIDEBAR_ITEMS}}", modelSidebarItems);
        template = template.replaceAll("{{SIDEBAR_SUB_MENU_ITEMS}}", modelSidebarSubMenuItems);
    }
    template = template.replaceAll("{{SIDEBAR_VISIBILITY}}", sidebarVisibility);



    // {{DROPDOWN_VISIBILITY}} by default dropdown is hidden
    var dropdownVisibility = "hidden";

    if (model.dropdownItems && model.dropdownItems.length > 0) {
        // remove "hidden"" for the dropdown if there are dropdown items on the model
        dropdownVisibility = "";

        var firstItemText = model.dropdownItems[0].text;

        // {{SELECTED_DROPDOWN_ITEM}}
        var selectedDropdownItem = `
            <button class="btn dropdown-toggle btn-sm border" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            ${firstItemText}
            </button>
        `;
        template = template.replaceAll("{{SELECTED_DROPDOWN_ITEM}}", selectedDropdownItem);

        // {{DROPDOWN_ITEMS}}
        var modelDropdownItems = '';
        model.dropdownItems.forEach(item => {
            var itemhref = item.href || '#';
            var itemtext = item.text || '';
            modelDropdownItems += `<li><a class="dropdown-item" href="${itemhref}">${itemtext}</a></li>`;
        });

        template = template.replaceAll("{{DROPDOWN_ITEMS}}", modelDropdownItems);
    }
    template = template.replaceAll("{{DROPDOWN_VISIBILITY}}", dropdownVisibility);


    // {{APP_SWITCHER_VISIBILITY}} by default app switcher is hidden
    var appSwitcherVisibility = "hidden";

    if (model.applications?.list?.length > 0) {
        // remove "hidden" for the app switcher if there are app items on the model
        appSwitcherVisibility = ""

        // {{APP_ITEMS}}
        var modelAppItems = "";
        model.applications.list.forEach(item => {
            modelAppItems += `
            <a href="${item.href}" class="app-item text-decoration-none text-dark">
                <img src="${item.src}" alt="${item.text}">
                <span>${item.text}</span>
            </a>
            `;
        });

        template = template.replaceAll("{{APP_ITEMS}}", modelAppItems);
    }
    template = template.replaceAll("{{APP_SWITCHER_VISIBILITY}}", appSwitcherVisibility);


    // {{PROFILE_ICON_VISIBILITY}} by default it is hidden
    var profileIconVisibility = "hidden";
        if (model.profile?.menuItems?.length > 0) {
        // remove "hidden" for the app switcher if there are app items on the model
            profileIconVisibility = ""

        // {{PROFILE_INITIALS}}
        template = template.replaceAll("{{PROFILE_INITIALS}}", model.profile.userInitial);

        // {{PROFILE_MENU_ITEMS}}
        var modelProfileMenuItems = "";
        model.profile.menuItems.forEach(item => {
            modelProfileMenuItems += `<li><a class="dropdown-item" href="${item.href}">${item.text}</a></li>`;
        });

        template = template.replaceAll("{{PROFILE_MENU_ITEMS}}", modelProfileMenuItems);
    }
    template = template.replaceAll("{{PROFILE_ICON_VISIBILITY}}", profileIconVisibility);


    return template;
}


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
