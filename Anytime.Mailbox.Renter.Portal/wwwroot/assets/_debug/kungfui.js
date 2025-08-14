var kungfui = kungfui || {};
(function () {
	function createCookie(name, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + value + expires + "; path=/";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			while (cookie.charAt(0) == ' ') {
				cookie = cookie.substring(1, cookie.length);
			}
			if (cookie.indexOf(nameEQ) === 0) {
				return cookie.substring(nameEQ.length, cookie.length);
			}
		}
		return null;
	}

	function getCountries(callback) {
		let countries = [];

		$.ajax({
			url: 'https://flagcdn.com/en/codes.json',
			type: 'GET',
			dataType: 'json',
			success: callback,
			error: function (error) {
				console.error('Error making GET request:', error);
			}
		});

		return countries;
	};

	function isEmail(email) {
		var regex = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
		return regex.test(email);
	}

	function toDateTimeFormat(dateTime, format) {

		if (dateTime)
			return kendo.toString(kendo.parseDate(dateTime), format);
		else
			return '';
	}

	function isNullOrWhitespace(input) {
		return input == undefined || !input || !input.trim();
	}

	function isPercentage(input) {
		if (isNullOrWhitespace(input)) {
			return false;
		}

		input = input.replace('%', '').trimEnd();

		if (isNaN(parseFloat(input))) {
			return false;
		}

		return true;
	}

	function convertToBoolean(input) {
		return input === 'True';
	}

	kungfui.convertToBoolean = convertToBoolean;
	kungfui.isPercentage = isPercentage;
	kungfui.isNullOrWhitespace = isNullOrWhitespace;
	kungfui.toDateTimeFormat = toDateTimeFormat;
	kungfui.isEmail = isEmail;
	kungfui.getCountries = getCountries;
	kungfui.readCookie = readCookie;
	kungfui.createCookie = createCookie;

})();
(function () {
    function showAlertBox(id, title, message, theme, buttontext, actions, width, alertIcon, buttonClickMethod) {
        if (id && id.length > 0 && document.getElementById(id) !== null) {
            let alertElement = $(`#${id}`);
            let existingWindow = alertElement.find('.k-window');

            if (existingWindow.length > 0) {
                existingWindow.remove();
            }
            // set values if comes from parameter
            width = width ?? alertElement.data('kf-alertbox-width');
            message = message ?? alertElement.data('kf-alertbox-content');
            theme = theme ?? alertElement.data('kf-alertbox-theme');
            title = title ?? alertElement.data('kf-alertbox-title');
            buttontext = buttontext ?? alertElement.data('kf-alertbox-button');
            alertIcon = alertIcon ?? (alertElement.data('kf-alertbox-alerticon') !== undefined ? alertElement.data('kf-alertbox-alerticon') : "");
            actions = actions ?? (alertElement.data('kf-alertbox-actions') !== undefined ? alertElement.data('kf-alertbox-actions') : "");
            buttonClickMethod = buttonClickMethod ?? (alertElement.data('kf-alertbox-buttonclickmethod') !== undefined ? alertElement.data('kf-alertbox-buttonclickmethod') : "");

            const alertElementClass = alertElement.closest('.kf-alertbox');
            let iconClass, alertClass;
            switch (theme.toLowerCase()) {
                case "info":
                    iconClass = alertIcon.toString().toLowerCase().includes('true') ? "fa-light fa-circle-info" : "";
                    alertClass = "k-notification-info";
                    break;
                case "success":
                    iconClass = alertIcon.toString().toLowerCase().includes('true') ? "fa-light fa-circle-check" : "";
                    alertClass = "k-notification-success";
                    break;
                case "error":
                    iconClass = alertIcon.toString().toLowerCase().includes('true') ? "fa-light fa-circle-x" : "";
                    alertClass = "k-notification-error";
                    break;
                case "warning":
                    iconClass = alertIcon.toString().toLowerCase().includes('true') ? "fa-light fa-triangle-exclamation" : "";
                    alertClass = "k-notification-warning";
                    break;
            }

            const alert = $('<div>').kendoAlert({
                title: title ?? null,
                width: width,
                content: message,
                type: theme,
                messages: {
                    okText: buttontext ?? null
                },
                close: function (e) {
                    if (buttonClickMethod) {
                        e.preventDefault();
                        handleClickOnButton(buttonClickMethod);
                    }
                }
            }).data("kendoAlert");

            if (!buttontext) {
                alert.wrapper.find('.k-dialog-actions').remove();
            }

            alert.wrapper.addClass(alertClass);
            if (width) {
                alert.wrapper.addClass('max-width');
            }

            const actionsArray = actions.split(',').map(action => action.trim().toLowerCase());
            let button;
            let buttonContainer;
            if (actionsArray && actionsArray.filter(action => action.trim() !== '').length > 0) {
                buttonContainer = $('<div>');

                actionsArray.forEach(action => {
                    if (action === 'close') {
                        button = $('<button>').addClass('k-button k-button-icon k-button-md k-rounded-md k-button-solid k-button-solid-base')
                            .attr('aria-label', 'Close')
                            .append($('<span>').addClass('fa-light fa-x'))
                            .on('click', function () {
                                alertElement.find('.k-window').remove();
                            });
                    }
                    buttonContainer.append(button);
                });
            }

            if (!title) {
                alert.wrapper.find('.k-window-titlebar').remove();
                if (buttonContainer) {
                    alert.wrapper.find('.k-window-content').append(buttonContainer);
                }
            } else {
                const titleBarActions = alert.wrapper.find('.k-window-titlebar-actions');
                if (titleBarActions.length > 0) {
                    titleBarActions.append(buttonContainer);
                } else {
                    const titleBar = alert.wrapper.find('.k-window-titlebar');
                    if (titleBar.length > 0) {
                        titleBar.append($('<div>').addClass('k-window-titlebar-actions').append(buttonContainer));
                    }
                }
            }

            if (!title && message) {
                const messageBody = alert.wrapper.find('.k-window-content');
                if (messageBody.length > 0) {
                    messageBody.addClass('content-box');
                }
            }

            if (alert.wrapper.find('.k-dialog-actions').length > 0) {
                alert.wrapper.find('.k-dialog-actions button').addClass(alertClass);
            }

            if (iconClass && alertIcon) {
                const iconElement = $("<i>").addClass("fa " + iconClass);
                if (alert.wrapper.find('.k-window-titlebar').length > 0) {
                    alert.wrapper.find('.k-window-titlebar .k-dialog-title').prepend(iconElement);
                }
            }

            alert.open();
            if (alert.wrapper) {
                alert.wrapper.appendTo(alertElementClass);
            }

            $('.k-overlay').remove();
        }
    }

    //Hide Alert box
    function hideAlertBox(alertId) {
        let targetAlertElement = $(`#${alertId}`);
        if (alertId && alertId.length > 0) {
            targetAlertElement.find('.k-window').remove();
        }
    }

    function handleClickOnButton(buttonClickMethod) {
        const eventHandlerName = buttonClickMethod;
        if (eventHandlerName && typeof window[eventHandlerName] === 'function') {
            window[eventHandlerName]();
        } else {
            console.log('No valid event handler specified.');
        }
        $('.k-overlay').remove();
    }

    $(document).on('click', function () {
        $('.k-overlay').remove();
    });
    $(function () {
        if ($('.kf-alertbox').length > 0) {
            kendo.setDefaults("iconType", "font");

            $('.kf-alertbox').each(function (index, element) {

                let id = $(element).attr('id');
                if (!id)
                    return;
                let showOnInit = $(element).data('kf-alertbox-show-on-init');
                if (showOnInit)
                    showAlertBox(id);
            });
        }
    });

    kungfui.showAlertBox = showAlertBox;
    kungfui.hideAlertBox = hideAlertBox;

})();


(function () {
    kendo.setDefaults("iconType", "font");

    function initializeAvatar() {
        const elements = $('.kf-avatar').not('.kf-initialized');

        if (elements.length > 0) {
            elements.each(async function () {
                let avatar = $(this);
                let text = avatar.data('kf-avatar-text');
                let image = avatar.data('kf-avatar-image');
                let icon = avatar.data('kf-avatar-icon');
                let onclick = avatar.data('kf-avatar-onclick');

                await createAvatar(avatar, text, image, icon, onclick);
                avatar.addClass('kf-initialized');
            });
        }
    }

    async function createAvatar(avatar, text = '', image = '', icon = '', onclick = '') {
        if (!icon) icon = 'fa fa-user';

        let type = 'icon';
        if (text) type = 'text';
        if (image) type = 'image';

        avatar.kendoAvatar({
            type: type,
            image: image,
            text: text,
            icon: icon
        });

        if (onclick) {
            avatar.on('click', function () { eval(onclick); });
        }
    }

    $(function () {

        // Initial check on document ready
        initializeAvatar();

        // Use MutationObserver to detect dynamically added elements
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-avatar').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeAvatar();
                        }
                    }
                });
            });
        });

        // Start observing the document body for added elements
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
(function () {
    kendo.setDefaults("iconType", "font");

    var badgeArrayForTarget = [];
    async function initializeBadges() {
        const elements = $('.kf-badge').not('.kf-initialized');
        if (elements.length > 0) {
            elements.each(async function () {
                let badge = $(this);
                let posData = badge.data('kf-position');
                let style = badge.data('kf-badge-style');
                let maxNum = badge.data('kf-max-num');
                let icon = badge.data('kf-icon');
                let size = badge.data('kf-size');
                let targetSibling = badge.data('kf-target-sibling');
                let showWhenNull = badge.data('kf-show-when-null');
                let handler = badge.data('kf-handler');
                let id = badge.data('kf-badge-id');

                await createBadge(badge, posData, targetSibling, style, maxNum, icon, size, '', showWhenNull, handler, id);
                badge.addClass('kf-initialized');
            });
        }
    }

    async function createBadge(node, posData, targetSibling, style, maxNum, icon, size, text = '', showWhenNull, handler, id) {
        let pos = {};
        let containerClass = 'kf-badge-container';
        let parentElement;

        switch (posData) {
            case 'inlineAdjacent':
                containerClass += ' kf-badge-inline-adjacent';
                pos = { position: 'inline', align: null };
                parentElement = $(node).parent();
                if (parentElement[0].classList.length === 0) {
                    parentElement[0].classList.add("kf-badge-container");
                    parentElement[0].classList.add("kf-badge-inline-adjacent");
                }
                break;
            case 'inlineEdge':
                containerClass += ' kf-badge-inline-edge';
                pos = { position: 'inline', align: null };
                break;
            case 'topStart':
                pos = { position: 'edge', align: 'top start' };
                break;
            case 'topEnd':
                pos = { position: 'edge', align: 'top end' };
                break;
            case 'bottomStart':
                pos = { position: 'edge', align: 'bottom start' };
                break;
            case 'bottomEnd':
                pos = { position: 'edge', align: 'bottom end' };
                break;
            default:
                break;
        }

        if (targetSibling) {
            createBadgeContainer(node, targetSibling, containerClass);
        }

        let kendoBadge = node.kendoBadge({
            rounded: 'full',
            position: pos.position,
            align: pos.align,
            themeColor: 'inherit',
            size: size,
            icon: icon,
            max: maxNum,
            text: text
        }).data('kendoBadge');

        kendoBadge.show();
        $(kendoBadge.element).addClass(`kf-badge-${style}`);

        if (handler) {
            let response = await eval(`${handler}()`);
            $(kendoBadge.element).html(response);
            kendoBadge.text = response.length;
        }

        if (!kungfui.isNullOrWhitespace(id)) {
            badgeArrayForTarget.push({
                id: id,
                target: kendoBadge
            });
        }
    }

    function createBadgeContainer(node, targetSibling, containerClass) {
        if ($(node).parent().hasClass('kf-badge-container')) return;

        let sibling;
        let badgeSiblings;

        if (targetSibling == 'left') {
            sibling = $(node).prev(':not(.kf-badge)');
            badgeSiblings = $(node).nextUntil(':not(.kf-badge)', '.kf-badge');
            $(node).add(sibling).add(badgeSiblings).wrapAll(`<div class="${containerClass}"></div>`);
        } else if (targetSibling == 'right') {
            sibling = $(node).next(':not(.kf-badge)');
            badgeSiblings = $(node).prevUntil(':not(.kf-badge)', '.kf-badge');
            $(node).add(sibling).add(badgeSiblings).wrapAll(`<div class="${containerClass}"></div>`);
        }
    }

    function setBadgeValue(id, value) {
        var badge = badgeArrayForTarget.find(x => x.id === id);
        badge.target.text(value);
    }

    function hideBadge(id) {
        var badge = badgeArrayForTarget.find(x => x.id === id);
        badge.target.hide();
    }

    function showBadge(id) {
        var badge = badgeArrayForTarget.find(x => x.id === id);
        badge.target.element[0].classList.remove("k-hidden");
    }

    $(function () {
        initializeBadges();

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-badge').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeBadges();
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });

    kungfui.setBadgeValue = setBadgeValue;
    kungfui.hideBadge = hideBadge;
    kungfui.showBadge = showBadge;

})();


(function () {
    function initializeBreadcrumbElements() {
        const elements = $('.kf-breadcrumb').not('.kf-initialized');
        if (elements.length > 0) {
            kendo.setDefaults("iconType", "font");
            elements.each(function () {
                initializeBreadcrumb($(this));
                $(this).addClass('kf-initialized');
            });
        }
    }

    // Function to initialize breadcrumb
    function initializeBreadcrumb(breadcrumb) {
        // Find the breadcrumb items within the current breadcrumb element
        const breadcrumbItem = breadcrumb.find('.kf-breadcrumb-item');
        // Extract data attributes
        let siteMap = breadcrumbItem.data('kf-breadcrumb-site-map');

        // Initialize fetchedData as an empty array
        let fetchedData = [];

        // If siteMap exists, evaluate it and set fetchedData accordingly
        if (siteMap) {
            siteMap = `${siteMap}()`;
            const dataSource = new kendo.data.DataSource({ data: eval(siteMap) });
            fetchedData = dataSource.options.data ? extractSiteNodes(dataSource.options.data) || [] : [];
        }

        // Process fetched data if available
        if (fetchedData && fetchedData.length > 0) {
            // Extract the title of the root item
            const rootTitle = fetchedData[0].title;

            //Modify fetchedData URLs
            fetchedData.forEach(data => {
                data.url = data.url.replace(/~/g, rootTitle);
                if (data.url === `${rootTitle}/index`) {
                    data.url = rootTitle;
                }
            });

            // Extract the subdomain from the window location
            const redirectUri = window.location.href;
            let redirectSubdomain = redirectUri.replace(/^(?:\/\/|[^/]+)*\//, '');
            redirectSubdomain = redirectSubdomain ? rootTitle + "/" + redirectSubdomain : rootTitle;

            // Find the URL that matches the redirectSubdomain, if any
            const matchedData = fetchedData.find(data => data.url === redirectSubdomain);
            let url = matchedData && matchedData.title === rootTitle ? rootTitle : matchedData ? `${rootTitle}/${matchedData.title}` : redirectSubdomain;

            if (matchedData) {
                let parentNodeOfMatchedData = [];

                fetchedData.forEach(rootNode => {
                    parentNodeOfMatchedData.push(...findParentsOfUrl(rootNode, matchedData.url));
                });

                // Remove duplicate parent nodes
                const distinctParents = [...new Set(parentNodeOfMatchedData.map(parent => JSON.stringify(parent)))].map(str => JSON.parse(str));

                // Update the URL based on distinct parent nodes
                if (distinctParents.length !== 0) {
                    url = distinctParents.map(node => node.title).join("/");
                }
            }

            // Create a new .kf-breadcrumb-item element
            const breadcrumbElement = $('<div>').addClass('kf-breadcrumb-item').appendTo(breadcrumb);

            // Initialize Kendo Breadcrumb for the new breadcrumb item
            breadcrumbElement.kendoBreadcrumb({
                value: url
            });

            // Modify breadcrumb appearance if url is 'Home'
            if (url === rootTitle) {
                $('a.k-breadcrumb-root-link.k-breadcrumb-icon-link').removeAttr('href').css({
                    'cursor': 'default',
                    'pointer-events': 'none'
                });
            }

            // Remove home icon from the new breadcrumb item
            breadcrumbElement.find(".k-icon.k-font-icon.k-i-home").remove();

            // Add "Parent page" text to root link of the new breadcrumb item
            const newItem = $('<span>').addClass('k-breadcrumb-item-text kf-transition').text(rootTitle);
            const rootLink = breadcrumbElement.find('.k-breadcrumb-root-link');
            rootLink.append(newItem);

            // Add transition class to breadcrumb items of the new breadcrumb item
            breadcrumbElement.find(".k-breadcrumb-item-text").addClass('kf-transition');

            // Handle click events on the new breadcrumb item
            breadcrumbElement.on('click', 'li', function (e) {
                e.preventDefault();
                breadcrumbElement.find(".k-icon.k-font-icon.k-i-home").remove();

                // Add "Home" text if not last item
                if (!$(this).hasClass('k-breadcrumb-last-item')) {
                    const newItem = $('<span>').addClass('k-breadcrumb-item-text kf-transition').text(rootTitle);
                    breadcrumbElement.find('li.k-breadcrumb-item:first a').append(newItem);
                }

                // Modify breadcrumb appearance if only one item
                if (breadcrumbElement.find('li.k-breadcrumb-item').length === 1) {
                    $('a.k-breadcrumb-root-link.k-breadcrumb-icon-link').removeAttr('href').css({
                        'cursor': 'default',
                        'pointer-events': 'none'
                    });
                }

                // Get the titles and construct the URL
                const titles = breadcrumbElement.find('.k-breadcrumb-item a').map(function () {
                    return $(this).attr('title');
                }).get().join("/");
                const lastTitle = titles.substring(titles.lastIndexOf("/") + 1);

                // Find the matched title in the fetched data
                const matchedTitle = fetchedData.find(data => data.title === lastTitle);

                // Trim the URL by removing the first segment
                const trimmedUrl = matchedTitle.url.split('/').slice(1).join('/');

                if (trimmedUrl) {
                    // Redirect to the trimmed URL
                    window.location.href = '/' + trimmedUrl;
                }
            });

            // Redirect to default path when clicking on root title
            rootLink.on('click', function () {
                window.location.href = `/`;
            });
        } else {
            // Initialize Kendo Breadcrumb
            breadcrumbItem.kendoBreadcrumb({
                navigational: true, // Enable navigation
                bindToLocation: true // Bind to browser location
            });

            // Remove home icon
            breadcrumbItem.find(".k-icon.k-font-icon.k-i-home").remove();

            // Add "Parent page" text to root link
            const newItem = $('<span>').addClass('k-breadcrumb-item-text kf-transition').text("Home");
            breadcrumbItem.find('.k-breadcrumb-root-link').append(newItem);

            // Add transition class to breadcrumb items
            breadcrumbItem.find(".k-breadcrumb-item-text").addClass('kf-transition');

            // Modify breadcrumb appearance if only one item
            if (breadcrumbItem.find('li.k-breadcrumb-item').length === 1) {
                $('a.k-breadcrumb-root-link.k-breadcrumb-icon-link').removeAttr('href').css({
                    'cursor': 'default',
                    'pointer-events': 'none'
                });
            }

            // Handle click events on the breadcrumb item
            breadcrumbItem.on('click', 'li', function () {
                breadcrumbItem.find(".k-icon.k-font-icon.k-i-home").remove();

                // Add "Home" text if not last item
                if (!$(this).hasClass('k-breadcrumb-last-item')) {
                    const newItem = $('<span>').addClass('k-breadcrumb-item-text kf-transition').text("Home");
                    breadcrumbItem.find('li.k-breadcrumb-item:first a').append(newItem);
                }

                // Modify breadcrumb appearance if only one item
                if (breadcrumbItem.find('li.k-breadcrumb-item').length === 1) {
                    $('a.k-breadcrumb-root-link.k-breadcrumb-icon-link').removeAttr('href').css({
                        'cursor': 'default',
                        'pointer-events': 'none'
                    });
                }
            });
        }
    }

    // Function to extract site nodes recursively
    function extractSiteNodes(node) {
        let allSiteNodes = [];
        if (Array.isArray(node)) {
            node.forEach(subNode => {
                allSiteNodes.push(subNode);
                if (subNode.siteNode) {
                    allSiteNodes = allSiteNodes.concat(extractSiteNodes(subNode.siteNode));
                }
            });
        }
        return allSiteNodes;
    }

    // Function to find parent nodes of a URL
    function findParentsOfUrl(node, url, parents = []) {
        if (node.url === url) {
            return [...parents, node];
        }

        if (node.siteNode) {
            for (const childNode of node.siteNode) {
                const result = findParentsOfUrl(childNode, url, [...parents, node]);
                if (result.length > 0) {
                    return result;
                }
            }
        }

        return [];
    }

    $(function () {

        initializeBreadcrumbElements();
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-breadcrumb').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeBreadcrumbElements();
                        }
                    }
                });
            });
        });

        // Start observing the document body for added elements
        observer.observe(document.body, { childList: true, subtree: true });
    });

})();
(function () {
    // Function to initialize Kendo buttons
    function initializeButtons() {
        const elements = $('.buttonUnit').not('.kf-initialized');
        if (elements.length > 0) {
            kendo.setDefaults("iconType", "font");

            elements.each(function (index, element) {
                let button = $(element);

                let enabled = !button.hasClass('kf-disabled');
                let label = button.data('kf-button-label');
                let width = button.data('kf-button-width');
                let onButtonClick = button.data('kf-button-onclick');
                let type = button.data('kf-button-type');
                let kendoIcon = button.data('kf-button-kendo-icon');

                // Initialize the Kendo Button without options
                button.kendoButton({
                    enable: enabled,
                    click: !(type) ? function (e) {
                        if (onButtonClick) eval(onButtonClick)(e);
                    } : undefined
                });

                // Clear existing content inside the button
                button.empty();

                // Add left icon if specified
                if (kendoIcon && kendoIcon.trim() !== "") {
                    button.append('<span class="k-icon k-button-icon ' + kendoIcon + '"></span>');
                }

                // Add text if specified
                if (label && label.trim() !== "") {
                    button.append('<span class="k-button-text">' + label + '</span>');
                }

                // Set the button width if specified
                if (width && width.trim() !== "") {
                    button.css("width", width);
                }
                button.addClass('kf-initialized');
            });
        }
    }

    function enableButton(id) {
        if (id && id.length > 0) {
            $(`#${id}`).data("kendoButton").enable(true);
        }
    }
    function disableButton(id) {
        if (id && id.length > 0) {
            $(`#${id}`).data("kendoButton").enable(false);
        }
    }

    $(function () {

        // Initial check on document ready
        initializeButtons();

        // Use MutationObserver to detect dynamically added elements
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1 && $(node).hasClass('buttonUnit')) {
                        initializeButtons();
                    } else if (node.nodeType === 1) {
                        const addedElements = $(node).find('.buttonUnit').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeButtons();
                        }
                    }
                });
            });
        });

        // Start observing the document body for added elements
        observer.observe(document.body, { childList: true, subtree: true });
    });

    kungfui.enableButton = enableButton;
    kungfui.disableButton = disableButton;

})();
(function () {
    $(function () {
        if ($('.kf-card').length > 0) {
            kendo.setDefaults("iconType", "font");

            $('.kf-card').each(function (index, element) {

            });
        }
    });

})();


(function () {
    function initializeCheckBox() {
        const elements = $('.kf-checkbox').not('.kf-initialized');

        if (elements.length > 0) {
            kendo.setDefaults("iconType", "font");

            elements.each(function (index, element) {
                const checkBoxElement = $(this);
                const id = $(checkBoxElement).data('kf-id');
                const checkBoxLabel = $(checkBoxElement).data('kf-checkbox-label');
                const checkBoxDisabled = $(checkBoxElement).data('kf-checkbox-disabled');
                const checkBoxValue = $(checkBoxElement).data('kf-checkbox-value');
                const checkBoxOnChange = $(checkBoxElement).data('kf-checkbox-onchange');
                const name = $(checkBoxElement).data('kf-checkbox-name');
                const required = $(checkBoxElement).data('kf-checkbox-required');

                const checkbox = $("<input>").attr({
                    type: "checkbox",
                    checked: checkBoxValue,
                    "data-kf-name": name || ''
                });

                $(checkBoxElement).append(checkbox);

                $(checkbox).kendoCheckBox({
                    label: checkBoxLabel,
                    enabled: !checkBoxDisabled,
                    change: function (e) {
                        const indeterminate = $(checkbox);
                        if (indeterminate.hasClass('kf-indeterminate')) {
                            indeterminate.removeClass('kf-indeterminate')
                        }
                        if (checkBoxOnChange) {
                            window[checkBoxOnChange](id, e.checked);
                        }
                    }
                });

                if (checkBoxValue === null)
                    $(checkbox).addClass('kf-indeterminate');

                if (required)
                    $(checkbox).attr('required', required);
                $('.k-checkbox.k-checkbox-md.k-rounded-md').addClass('kf-transition');
                checkBoxElement.addClass('kf-initialized');
            });
        }

    }

    function getCheckBoxValue(id) {
        if (id && id.length > 0) {
            const inputElement = $(`#${id} input[type="checkbox"]`);
            if (inputElement.length > 0) {
                if (inputElement.hasClass('kf-indeterminate')) {
                    return undefined;
                }
                else if (inputElement.prop("checked")) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    }

    function setCheckBoxValue(id, value) {
        const inputElement = $(`#${id} input[type="checkbox"]`);

        if (inputElement.length > 0) {
            if (value !== undefined) {
                inputElement.prop("checked", value);
                if (inputElement.hasClass('kf-indeterminate'))
                    inputElement.removeClass('kf-indeterminate');
            } else {
                inputElement.addClass('kf-indeterminate');
            }
        }
    }

    function enableCheckBox(id) {
        if (id && id.length > 0) {
            const inputElement = $(`#${id} input[type="checkbox"]`);
            if (inputElement.length > 0) {
                inputElement.prop("disabled", false);
            }
        }
    }

    function disableCheckBox(id) {
        if (id && id.length > 0) {
            const inputElement = $(`#${id} input[type="checkbox"]`);
            if (inputElement.length > 0) {
                inputElement.prop("disabled", true);
            }
        }
    }

    $(function () {

        initializeCheckBox();
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-checkbox').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeCheckBox();
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });

    kungfui.disableCheckBox = disableCheckBox;
    kungfui.enableCheckBox = enableCheckBox;
    kungfui.setCheckBoxValue = setCheckBoxValue;
    kungfui.getCheckBoxValue = getCheckBoxValue;

})();
(function () {
    let setSubItemDisable = false;
    function initializeContextMenu() {
        const elements = $('.kf-contextmenu').not('.kf-initialized');

        if (elements.length > 0) {
            kendo.setDefaults("iconType", "font");

            elements.each(function (index, element) {
                let menuElement = $(element);
                const targetId = menuElement.data('kf-contextmenu-targetid');
                const menuHeader = menuElement.data('kf-menuheader');
                let menuItems = menuElement.data('kf-menuitems');
                let menuWidth = menuElement.data('kf-contextmenu-width');

                if (typeof menuItems === 'string') {
                    menuItems = JSON.parse(menuItems);
                }
                menuElement.addClass('kf-initialized');
                var menuSourceData = convertToKendoDataSource(menuHeader, menuItems);
                const targetSelector = `#${targetId}`;
                $(targetSelector).addClass('contextmenu-target-hover');

                $(menuElement).kendoContextMenu({
                    target: targetSelector,
                    dataSource: menuSourceData,
                    animation: { open: { effects: "fadeIn" } },
                    showOn: "click",
                    open: function (e) {
                        const animationContainer = $('.k-popup').not('.k-menu-popup');
                        const menuDiv = menuElement;

                        if (animationContainer.length > 0) {
                            if (menuWidth && /^\d+(\.\d+)?%$/.test(menuWidth)) {
                                menuWidth = parseFloat(menuWidth) + 'vw';
                            }
                            animationContainer.css('width', menuWidth);
                            menuDiv.css('width', menuWidth);
                        }
                    },
                    select: function (e) {
                        const clickedId = $(e.item).data('id') || $(e.item).data('subitem-id');
                        const onClickValue = $(e.item).data('onclick') || $(e.item).data('subitem-onclick');
                        if (onClickValue) {
                            window[onClickValue]();
                        }
                    }
                });

                function setAttributesForMenuItems(items, isSubItem = false) {
                    if (!Array.isArray(items)) {
                        items = [items];
                    }

                    items.forEach((item, index) => {
                        const liElement = menuElement.find(`li.k-item.k-menu-item.kf-hover-effect.kf-contextmenu-item-${index}`);

                        if (liElement.length > 0) {
                            liElement.attr('data-id', item.id);
                            liElement.attr('data-onclick', item.onclick);
                            if (item.disable) liElement.addClass('k-disabled');
                            if (isSubItem && item.subItems) {
                                liElement.find(`.k-item.k-menu-item.kf-contextmenu-subitem`).each((subIndex, subItem) => {
                                    const subItemData = item.subItems[subIndex] || {};
                                    if (subItemData.disable && !setSubItemDisable) {
                                        $(subItem).addClass('k-disabled');
                                    }
                                    $(subItem).attr({
                                        'data-subitemparent-id': item.id,
                                        'data-subitem-id': subItemData.id || `subitem-${subIndex}`,
                                        'data-subitem-onclick': subItemData.onclick || null
                                    });
                                });
                            }
                        }

                        liElement.find('span.k-sprite').removeClass('k-sprite');
                    });
                }

                setAttributesForMenuItems(menuItems, false);
                menuElement.on('mouseenter', 'li.k-item.k-menu-item', function (e) {
                    const liElement = $(this);
                    const menuPopup = liElement.find('div.k-menu-popup');

                    if (menuPopup.length > 0) {
                        const ulElement = menuPopup.find('ul');
                        if (ulElement.length > 0) {
                            const subMenuItems = ulElement.find('li');
                            if (subMenuItems.length > 0) {
                                setAttributesForMenuItems(menuItems, true);
                            }
                        }
                    }
                });

                $(targetSelector).on('click', function () {
                    $(this).addClass('contextmenu-target-hover');
                });
            });
        }
    }

    const convertToKendoDataSource = (headerData, menuItems) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(headerData, 'text/html');
        let ulElement = doc.querySelector('ul');

        if (!ulElement) {
            ulElement = doc.createElement('ul');
            ulElement.classList.add('kf-contextmenu-header-noul');
            ulElement.innerHTML = headerData;
            doc.body.appendChild(ulElement);
        } else {
            ulElement.classList.add('kf-contextmenu-header');
        }

        const avatarSpans = ulElement.querySelectorAll('[id]');
        avatarSpans.forEach((avatarSpan) => {
            const parentLi = avatarSpan.closest('li');
            if (parentLi) {
                parentLi.classList.add('hasavatar');
            }
        });

        const liElements = ulElement.querySelectorAll('li');
        let hasAvatar = false;

        liElements.forEach((li) => {
            if (li.querySelector('span.kf-avatar')) {
                li.classList.add('hasavatar');
                hasAvatar = true;
            }
        });

        if (hasAvatar && liElements.length > 1) {
            liElements[1].classList.add('username');
        } else if (liElements.length > 0) {
            liElements[0].classList.add('username');
        }

        const modifiedHeaderData = ulElement.outerHTML;

        const convertedMenuItems = menuItems.map((item, index) => ({
            text: item.text,
            spriteCssClass: item.icon,
            items: item.subItems ? convertSubItems(item.subItems) : null,
            onclick: item.onclick || null,
            cssClass: `kf-hover-effect kf-contextmenu-item-${index}`,
        }));

        return [modifiedHeaderData, ...convertedMenuItems];
    };

    const convertSubItems = (subItems) => {
        return subItems.map((subItem, subIndex) => ({
            text: subItem.text,
            spriteCssClass: subItem.icon,
            items: subItem.subItems ? convertSubItems(subItem.subItems) : null,
            onclick: subItem.onclick || null,
            disable: subItem.disable ? 'k-disabled' : '',
            cssClass: `kf-contextmenu-subitem`,
        }));
    };

    function disableContextMenu(id) {
        const itemsElement = $(`li[data-id="${id}"]`);
        const subitemsElement = $(`li[data-subitem-id="${id}"]`);
        if (itemsElement.length > 0) itemsElement.addClass('k-disabled');
        if (subitemsElement.length > 0) subitemsElement.addClass('k-disabled');
    }

    function enableContextMenu(id) {
        const itemsElement = $(`li[data-id="${id}"]`);
        const subitemsElement = $(`li[data-subitem-id="${id}"]`);
        if (itemsElement.length > 0 && itemsElement.hasClass('k-disabled')) itemsElement.removeClass('k-disabled');
        if (subitemsElement.length > 0 && subitemsElement.hasClass('k-disabled')) {
            setSubItemDisable = true;
            subitemsElement.removeClass('k-disabled');
        }
    }

    $(function () {

        initializeContextMenu();
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-contextmenu').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeContextMenu();
                        }
                    }
                });
            });
        });

        // Start observing the document body for added elements
        observer.observe(document.body, { childList: true, subtree: true });

    });

    kungfui.disableContextMenu = disableContextMenu;
    kungfui.enableContextMenu = enableContextMenu;

})();
(function () {
    function initializeDatePickers() {
        const element = $('.kf-datepicker').not('.kf-initialized');
        if (element.length > 0) {
            kendo.setDefaults("iconType", "font");

            element.each(function (index, element) {
                const datePickerElement = $(this);
                const disableDatesSourceName = datePickerElement.data('kf-datepicker-disabledates');
                let disableDatesArray = [];

                if (disableDatesSourceName) {
                    if (disableDatesSourceName.indexOf('/') !== -1) {
                        $.getJSON(disableDatesSourceName, function (data) {
                            disableDatesArray = data.map(date => new Date(date));
                            initializeDatePicker(datePickerElement, disableDatesArray);
                        });
                    } else {
                        const dateString = disableDatesSourceName.replace(/\[|\]/g, '');
                        disableDatesArray = dateString.split(',').map(date => new Date(date.trim()));
                        initializeDatePicker(datePickerElement, disableDatesArray);
                    }
                } else {
                    initializeDatePicker(datePickerElement, disableDatesArray);
                }
                datePickerElement.on('click', function () {
                    $(this).find('input[data-role="datepicker"]').data('kendoDatePicker').open();
                });

                datePickerElement.on('focus', function () {
                    $(this).find('input[data-role="datepicker"]').data('kendoDatePicker').open();
                });
                datePickerElement.on('keyup', 'input[data-role="datepicker"]', function (e) {
                    if (e.keyCode === 9) { // Check if tab key is pressed
                        e.preventDefault(); // Prevent default tab behavior
                        $(this).data('kendoDatePicker').open();
                    }
                });
            });
        }

        function initializeDatePicker(datePickerElement, disableDatesArray) {
            const id = datePickerElement.data('kf-datepicker-id');
            const datePickerLabel = datePickerElement.data('kf-datepicker-label');
            const datePickerfloatingLabel = datePickerElement.data('kf-datepicker-floatinglabel');
            const isDisabled = datePickerElement.data('kf-datepicker-disabled');
            const datePickeronChange = datePickerElement.data('kf-datepicker-onchange');
            const datePickerwidth = datePickerElement.data('kf-datepicker-width');
            const datePickerValue = datePickerElement.data('kf-datepicker-value');
            const subTitle = datePickerElement.data('kf-datepicker-subtitle');
            const required = datePickerElement.data('kf-datepicker-required');
            const name = datePickerElement.data('kf-datepicker-name');
            const datepickerFormat = datePickerElement.data('kf-datepicker-format');

            const inputElement = $("<input>").attr({
                "id": id,
                "value": datePickerValue,
                "data-kf-name": name || ''
            }).appendTo(datePickerElement);

            datePickerElement.addClass('kf-initialized');
            const datePicker = inputElement.kendoDatePicker({
                label: datePickerfloatingLabel ? "" : datePickerLabel,
                value: datePickerValue ? new Date(datePickerValue) : null,
                disabled: isDisabled,
                format: datepickerFormat || "yyyy/MM/dd",
                disableDates: disableDatesArray,
                change: function (e) {
                    const selectedDate = this.value();
                    if (selectedDate) {
                        const formattedDate = kendo.toString(selectedDate, "yyyy/MM/dd");
                        $(datePickerElement).val(formattedDate);
                        if (datePickeronChange)
                            window[datePickeronChange](formattedDate);
                    }
                },
                open: function (e) {
                    let calendar = this.dateView.calendar;
                    calendar.bind("navigate", function (e) {
                        const selectedDate = e.sender._current;
                        const currentDate = new Date();

                        const selectedMonth = e.sender._current.getMonth();
                        const selectedYear = e.sender._current.getFullYear();

                        const currentMonth = currentDate.getMonth() - 1;
                        const currentYear = currentDate.getFullYear();

                        let datePickerInput = $(`#${id} input[data-role="datepicker"]`);
                        if (datePickerInput.length > 0) {
                            let datePickerWidget = datePickerInput.data("kendoDatePicker");
                            if (datePickerWidget) {
                                let calendarItem = datePickerWidget.dateView.calendar;
                                calendarItem.element.find(".k-calendar-td").each(function () {
                                    let cell = $(this);
                                    let dataValue = cell.find("a").attr("data-value");
                                    let parts, month;
                                    if (dataValue) {
                                        parts = dataValue.split("/");
                                        month = parseInt(parts[1]);

                                        if (selectedMonth !== currentMonth && selectedYear === currentYear) {
                                            cell.removeClass("k-selected");
                                            if (month == selectedMonth) {
                                                if (cell.closest('.k-calendar-view.k-calendar-yearview').length != 0) {
                                                    cell.addClass("k-selected");
                                                }
                                            }
                                            cell.addClass("kf-current-year");
                                        }

                                        if (selectedMonth !== currentMonth && selectedYear !== currentYear) {
                                            cell.removeClass("k-selected");
                                            if (month == selectedMonth) {
                                                if (cell.closest('.k-calendar-view.k-calendar-yearview').length != 0) {
                                                    cell.addClass("k-selected");
                                                }
                                            }

                                        }
                                    }
                                });
                            }
                        }
                    });
                },
                close: function (e) {
                    const datePicker = this;

                    if (datePicker.value() === null || isNaN(datePicker.value().getTime())) {
                        datePickerElement.find('.k-label.k-input-label').addClass('floating-label-empty');
                    } else {
                        datePicker.element.removeClass('floating-label-empty');
                    }

                    if (datePicker.value() === null) {
                        datePicker.value(null);
                        datePicker.dateView.calendar.navigate(new Date(), "month");
                    } else {
                        const selectedDate = datePicker.value();
                        const selectedMonth = selectedDate.getMonth();
                        const selectedYear = selectedDate.getFullYear();

                        datePicker.dateView.calendar.navigate(new Date(selectedYear, selectedMonth, 1), "month");
                    }
                }
            }).data("kendoDatePicker");

            if (datePickerfloatingLabel) {
                datePicker.setOptions({
                    label: {
                        content: datePickerLabel,
                        floating: datePickerfloatingLabel
                    }
                });
            }

            if (datePickerwidth) {
                datePicker.wrapper.css('width', datePickerwidth);
            }
            if (required) {
                datePicker.wrapper.find('input.k-input-inner').attr('required', required);
            }

            if (isDisabled) {
                datePickerElement.addClass('k-disabled');
            }

            let spanElement = datePickerElement.find('span.k-datepicker');
            if (spanElement.length > 0) {
                spanElement.addClass('kf-transition');
            }

            const label = datePickerElement.find("label.k-label.k-input-label");
            const spanContainer = datePicker.wrapper.closest('span.k-floating-label-container');
            const labelAboveSpan = label.index() < spanContainer.index();

            if (!labelAboveSpan) {
                label.filter((index, elem) => $(elem).closest('span.k-floating-label-container').index() === spanContainer.index())
                    .css('display', 'block')
                    .addClass('kf-nonfloating-label');
            }

            if (!datePickerValue && datePickerfloatingLabel) {
                datePickerElement.find('.k-label.k-input-label').addClass('floating-label-empty');
            }

            datePickerElement.find('input').on('input', function () {
                const datePicker = datePickerElement.find('input');
                if (datePicker.val().trim() === '') {
                    datePickerElement.find('.k-label.k-input-label').addClass('floating-label-empty');
                } else {
                    datePickerElement.find('.k-label.k-input-label').removeClass('floating-label-empty');
                }
            });

            if (subTitle) {
                $(`<div class='k-form-hint'>${subTitle}</div>`).appendTo(datePickerElement);
            }
        }
    }

    function getDatePickerValue(id) {
        let datePickerInput = $(`#${id} input[data-role="datepicker"]`);
        if (datePickerInput.length > 0) {
            return datePickerInput.val();
        }
    }

    function setDatePickerValue(id, value) {
        let datePickerInput = $(`#${id} input[data-role="datepicker"]`);
        if (datePickerInput.length > 0) {
            let dateObject = kendo.parseDate(value);
            datePickerInput.data("kendoDatePicker").value(dateObject);
        }
    }

    function disableDatePicker(id) {
        let datePickerElement = $(`#${id}`);
        if (datePickerElement.hasClass('kf-datepicker'))
            datePickerElement.addClass('k-disabled')
    }

    function enableDatePicker(id) {
        let datePickerElement = $(`#${id}`);
        if (datePickerElement.hasClass('kf-datepicker'))
            datePickerElement.removeClass('k-disabled');
    }

    function openDatePicker(id) {
        if (id && id.length > 0) {
            let datePickerInput = $(`#${id} input[data-role="datepicker"]`);
            if (datePickerInput.length > 0 && !datePickerInput.closest('.kf-datepicker').hasClass('k-disabled')) {
                let datePickerWidget = datePickerInput.data("kendoDatePicker");
                if (datePickerWidget) {
                    datePickerWidget.open();
                    datePickerInput.focus();
                }
            }
        }
    }

    function closeDatePicker(id) {
        if (id && id.length > 0) {
            let datePickerInput = $(`#${id} input[data-role="datepicker"]`);
            if (datePickerInput.length > 0) {
                let datePickerWidget = datePickerInput.data("kendoDatePicker");
                if (datePickerWidget) {
                    datePickerWidget.close();
                }
            }
        }
    }

    $(function () {

        initializeDatePickers();
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-datepicker').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeDatePickers();
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });

    kungfui.closeDatePicker = closeDatePicker;
    kungfui.openDatePicker = openDatePicker;
    kungfui.enableDatePicker = enableDatePicker;
    kungfui.disableDatePicker = disableDatePicker;
    kungfui.setDatePickerValue = setDatePickerValue;
    kungfui.getDatePickerValue = getDatePickerValue;

})();

(function () {
    function initializeDialogs() {
        const elements = $('.kf-dialog').not('.kf-initialized');
        if (elements.length > 0) {
            kendo.setDefaults("iconType", "font");

            elements.each(function () {
                const dialog = $(this);
                const title = dialog.data('kf-dialog-title');
                const actionsRaw = dialog.data('kf-dialog-actions'); // Raw value
                let actions = actionsRaw ? actionsRaw.trim().split(',') : null;
                const width = dialog.data('kf-dialog-width');
                const height = dialog.data('kf-dialog-height');
                const topPos = dialog.data('kf-dialog-top');
                const leftPos = dialog.data('kf-dialog-left');

                // Check if "none" is present and set actions to null if found
                if (actions && actions.includes('none')) {
                    actions = null;
                } else if (actions) {
                    // Remove empty values and extra commas
                    actions = actions.filter(action => action.trim() !== '');
                }

                let position = null;
                if (topPos && leftPos) {
                    position = { top: topPos, left: leftPos };
                } else if (topPos) {
                    position = { top: topPos };
                } else if (leftPos) {
                    position = { left: leftPos };
                }

                const windowOptions = {
                    title: title,
                    visible: false,
                    modal: true,
                    width: width,
                    height: height,
                    actions: actions,
                    draggable: false,
                    resizable: false,
                    close: onCloseDialog,
                };

                if (position) {
                    dialog.attr("data-kf-dialog-centered", false);
                    windowOptions.position = position;
                } else {
                    dialog.attr("data-kf-dialog-centered", true);
                }

                dialog.kendoWindow(windowOptions);

                // Remove title bar if no title or actions are specified
                if (!title && !actions) {
                    // Ensure the title bar is removed after the Kendo Window is fully initialized
                    setTimeout(() => {
                        dialog.closest('.k-window').find('.k-window-titlebar').remove();
                    }, 0);
                }

                dialog.addClass('kf-initialized');
            });
        }
    }

    function onCloseDialog() {
        $('#kf-dialog-backdrop').remove(); // Remove the backdrop element
        $('html').removeClass('dialog-open'); // Re-enable scrolling
    }

    function openDialog(id) {
        if (id && id.length > 0) {
            const dialogElem = $(`#${id}`);
            const dialogWin = dialogElem.data("kendoWindow");
            let backdrop = $('#kf-dialog-backdrop');

            if (!backdrop.length)
                $('html').addClass('dialog-open'); // Disable scrolling

            let previousZIndex = parseInt($('.k-window:not([style*="display: none"])').css('z-index')) || 0;
            $('body').append(`<div id="kf-dialog-backdrop" class="kf-backdrop fade in" style="z-index: ${++previousZIndex}"></div>`);

            setTimeout(() => {
                if (dialogElem.data('kf-dialog-centered')) {
                    dialogWin.center().open();
                } else {
                    dialogWin.open();
                }

                // Adjust position
                const topPos = dialogElem.data('kf-dialog-top');
                const leftPos = dialogElem.data('kf-dialog-left');
                const position = {};
                if (topPos) position.top = topPos;
                if (leftPos) position.left = leftPos;

                if (Object.keys(position).length) {
                    dialogWin.wrapper.css(position);
                }

                // Remove previous overlay
                dialogWin.wrapper.prev('.k-overlay').remove();
            }, 100);
        }
    }

    function closeDialog(id) {
        if (id && id.length > 0) {
            const dialogWin = $(`#${id}.kf-dialog`).data("kendoWindow");
            if (dialogWin && dialogWin.options.visible) {
                dialogWin.close();
            }
        }
    }

    $(function () {
        initializeDialogs();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                Array.from(mutation.addedNodes).forEach((node) => {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-dialog').not('.kf-initialized');
                        if (addedElements.length) {
                            initializeDialogs();
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });

    kungfui.closeDialog = closeDialog;
    kungfui.openDialog = openDialog;
})();
(function () {

    function initializeDropdownlist() {
        const elements = $('.kf-dropdownlist').not('.kf-initialized');
        if (elements.length > 0) {
            kendo.setDefaults("iconType", "font");

            elements.each(function (index, element) {
                let dropDownElement = $(element);
                const dropDownDataSourceName = dropDownElement.data('kf-dropdown-source');
                let dropDownDataSource;
                if (dropDownDataSourceName !== '' && dropDownDataSourceName !== undefined) {
                    if (dropDownDataSourceName.indexOf('/') !== -1) {
                        $.getJSON(dropDownDataSourceName, function (data) {
                            dropDownDataSource = {
                                data: data ?? null,
                                dataTextField: "Text" ?? null,
                                dataValueField: "Value" ?? null
                            };
                            initializeDropDown(dropDownElement, dropDownDataSource);
                        });
                    } else {
                        dropDownDataSource = window[dropDownDataSourceName]();
                        initializeDropDown(dropDownElement, dropDownDataSource);
                    }
                } else {
                    initializeDropDown(dropDownElement, dropDownDataSource);
                }
                dropDownElement.addClass('kf-initialized');
            });
        }
        function initializeDropDown(dropDownElement, dropDownDataSource) {
            const id = dropDownElement.data('kf-dropdown-id');
            const name = dropDownElement.data('kf-dropdown-name');
            const dropDownLabel = dropDownElement.data('kf-dropdown-label');
            const isFilterable = dropDownElement.data('kf-dropdown-isfilterable');
            const selectedValue = dropDownElement.data('kf-dropdown-selectedvalue');
            const floatingLabel = dropDownElement.data('kf-dropdown-floatinglabel');
            const isDisabled = dropDownElement.data('kf-dropdown-disabled');
            const subTitle = dropDownElement.data('kf-dropdown-subtitle');
            const onChange = dropDownElement.data('kf-dropdown-onchange');
            const width = dropDownElement.data('kf-dropdown-width');
            const onClickEventDropdown = dropDownElement.data('kf-dropdown-onclick');
            const required = dropDownElement.data('kf-dropdown-required');
            const openOnTop = dropDownElement.data('kf-dropdown-openontop');

            let dropdownParam = {};
            let valueExists;
            if (selectedValue !== undefined && selectedValue !== null)
                valueExists = dropDownDataSource.data.some(item => item[dropDownDataSource.dataValueField] == selectedValue);

            let inputElement = $("<input>").attr({
                "id": id,
                "value": valueExists ? selectedValue : "",
                "data-kf-name": name ? name : "",
            }).appendTo(dropDownElement);

            const dropDownList = inputElement.kendoDropDownList({
                index: -1,
                filter: isFilterable === true ? "contains" : null,
                label: floatingLabel ? "" : dropDownLabel,
                dataTextField: dropDownDataSource ? dropDownDataSource.dataTextField : null,
                dataValueField: dropDownDataSource ? dropDownDataSource.dataValueField : null,
                dataSource: dropDownDataSource ? dropDownDataSource.data : null,
                autoBind: false,
                popup: {
                    appendTo: document.body,
                    origin: openOnTop ? "top center" : "bottom center", // Set origin based on variable.
                    position: openOnTop ? "bottom center" : "top center" // Set position based on variable.
                },open: function (e) {
                    const dropdown = this;
                    setTimeout(() => {
                        const animationContainer = dropdown.popup.wrapper;
                        if (animationContainer) {
                            animationContainer.removeClass('dropdown-margin-adjust dropdown-margin-adjust-upperside');
                            animationContainer.addClass('dropdown-margin-custom');
                            if (openOnTop) {
                                animationContainer.addClass('dropdown-margin-adjust-upperside');
                            } else {
                                animationContainer.addClass('dropdown-margin-adjust');
                            }
                        }
                    }, 0);
                }
            }).data("kendoDropDownList");


            const spanElement = inputElement.closest('.k-dropdownlist');

            spanElement.attr('id', id);
            spanElement.addClass('kf-dropdown-item');
            spanElement.addClass('kf-transition');

            if (!kungfui.isNullOrWhitespace(onChange)) {
                dropdownParam["change"] = function (e) {
                    if (!kungfui.isNullOrWhitespace(e.sender.text())) {
                        if (e.sender.value() != null && e.sender.value() !== undefined) {
                            window[onChange](e);
                        }
                    }
                };
            }

            if (floatingLabel) {
                dropDownList.setOptions({
                    label: {
                        content: dropDownLabel,
                        floating: floatingLabel
                    },
                });
            }

            if (!kungfui.isNullOrWhitespace(onClickEventDropdown)) {
                dropDownList.setOptions({
                    open: function (e) {
                        e.preventDefault();
                        eval(onClickEventDropdown)(e);
                    }
                });
            }

            if (required === true) {
                spanElement.attr('required', 'required');
            }

            dropDownList.setOptions(dropdownParam);

            const label = $("label.k-label.k-input-label");
            const spanContainer = inputElement.closest('span.k-floating-label-container');
            const labelAboveSpan = label.index() < spanContainer.index();
            let subTitleElement;
            if (subTitle !== '' && subTitle !== undefined) {
                subTitleElement = $('<div>').addClass("k-form-hint").text(subTitle);
                subTitleElement.insertAfter(spanElement);
            }
            if (!labelAboveSpan) {
                label.each(function () {
                    let $label = $(this);
                    let $container = $label.closest('.kf-dropdownlist');
                    if ($container.find('.k-floating-label-container').length === 0) {
                        $label.addClass('kf-nonfloating-label');
                        $label.css('display', 'block');
                    } else {
                        $label.removeClass('kf-nonfloating-label');
                    }
                });

                if (subTitle !== '' && subTitle !== undefined) {
                    subTitleElement.addClass('kf-nonfloating-title');
                }
            }

            if (isDisabled) {
                dropDownElement.addClass('k-disabled');
            }

            if (!kungfui.isNullOrWhitespace(width)) {
                spanElement.css('width', `${width}`);
            }

            if (valueExists) {
                dropDownList.value(selectedValue);
            }

            if (!selectedValue && floatingLabel) {
                inputElement.closest('.k-floating-label-container').find('.k-label.k-input-label').addClass('floating-label-empty');
            }
            $('.kf-dropdownlist').on('focus', function () {
                $(this).closest('.k-floating-label-container').find('.k-label.k-input-label').removeClass('floating-label-empty');
            });
            $('.kf-dropdownlist').on('blur', function () {
                $(this).closest('.k-floating-label-container').find('.k-label.k-input-label').addClass('floating-label-empty');
            });

            dropDownList.wrapper.on('focusout', function () {
                $(this).closest('.k-dropdownlist').removeClass('k-focus');
            });

            $('.k-list-optionlabel').hide();
        }

    }

    function enableDropDownList(id) {
        // Select the element based on the ID
        let dropDownListElement = $(`#${id}`).closest('.kf-dropdownlist');

        // Check if the element was found
        if (dropDownListElement.length) {
            dropDownListElement.removeClass('k-disabled');
        } else {
            console.error(`Dropdown list with ID ${id} not found.`);
        }
    }


    function disableDropDownList(id) {
        // Select the element based on the ID
        let dropDownListElement = $(`#${id}`).closest('.kf-dropdownlist');

        // Check if the element was found
        if (dropDownListElement.length) {
            dropDownListElement.addClass('k-disabled');
        } else {
            console.error(`Dropdown list with ID ${id} not found.`);
        }
    }


    function getDropdownListValue(id) {
        let dropDownListInput = $(`#${id} input[data-role="dropdownlist"]`);
        if (dropDownListInput.length > 0) {
            const val = dropDownListInput.val();
            if (val) {
                return val;
            } else {
                return '';
            }
        }
    }
    function getDropdownListText(id) {
        // Get the span element that contains the selected text value
        let selectedTextElement = $(`#${id} .k-input-value-text`);
        if (selectedTextElement.length > 0) {
            // Return the text content of the selected option
            return selectedTextElement.text();
        } else {
            return '';
        }
    }

    function setDropdownListValue(id, value) {
        let dropDownListInput = $(`#${id} input[data-role="dropdownlist"]`);
        if (dropDownListInput.length > 0) {
            dropDownListInput.data("kendoDropDownList").value(value);
        }
    }

    $(function () {

        initializeDropdownlist();
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-dropdownlist').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeDropdownlist();
                        }
                    }
                });
            });
        });

        // Start observing the document body for added elements
        observer.observe(document.body, { childList: true, subtree: true });
    });

    kungfui.setDropdownListValue = setDropdownListValue;
    kungfui.getDropdownListText = getDropdownListText;
    kungfui.getDropdownListValue = getDropdownListValue;
    kungfui.disableDropDownList = disableDropDownList;
    kungfui.enableDropDownList = enableDropDownList;

})();
(function () {

    // Global variable to store Kendo form instance data-kf-form-id
    let kendoFormInstance;

    let elementsWithCustomValidations = [];
    let buttonAction = '';
    const formInstances = {};

    function initializeForms() {
        const elements = $('.kf-form').not('.kf-initialized');

        if (elements.length > 0) {
            kendo.setDefaults("iconType", "font");

            elements.each(function (index, element) {
                initializeForm($(element));
            });
        }
    }

    // Function to initialize each form
    function initializeForm(formElement) {
        // Find the form items within the current form element
        const formId = formElement.find('.kf-form-item').data('kf-form-id');

        if (!formId) {
            console.error("Form element missing 'data-kf-form-id' attribute.");
            return;
        }

        const formItem = formElement.find('.kf-form-item');
        formElement.addClass('kf-initialized');
        // Initialize Kendo form for each form item
        formInstances[formId] = formItem.kendoForm({
            validatable: {
                validateOnBlur: false,
                validationSummary: false,
                errorTemplate: ""
            },
        });

        // Remove buttons from the form
        formItem.find('.k-form-buttons').empty();

        // Move buttons into the form buttons container
        const buttons = formItem.find('.buttonUnit');
        buttons.each(function () {
            // get the value of data-kf-button-type attribute
            const buttontype = $(this).data('kf-button-type');
            if (buttontype === "validatedsubmit") {
                $(this).on('click', function () {
                    // Call validateAndSubmitForm() function
                    buttonAction = $(this).data('kf-button-action');
                    validateAndSubmitForm(formId);
                    $(this).removeAttr('data-kf-button-onclick');
                });
            }
            if (buttontype === "nonvalidatedsubmit") {
                $(this).on('click', function () {
                    // Call validateAndSubmitForm() function
                    buttonAction = $(this).data('kf-button-action');
                    submitNonValidatedForm(formId);
                    $(this).removeAttr('data-kf-button-onclick');
                });
            }
            // output the button type to console (you can do anything you want with the button type)
        });
    }

    function getFieldValue(element) {
        let value = '';
        if ($(element).hasClass('kf-dropdownlist')) {
            value = $(element).find('input[data-role="dropdownlist"]').val();
        } else if ($(element).hasClass('kf-textbox')) {
            value = $(element).find('input').val().trim();
        } else if ($(element).hasClass('kf-textarea')) {
            value = $(element).find('textarea').val().trim();
        } else if ($(element).hasClass('kf-switch')) {
            value = $(element).find('.k-switch').attr('aria-checked') === 'true';
        } else if ($(element).hasClass('kf-radiogroup')) {
            value = $(element).find('input[type="radio"]:checked').val();
        } else if ($(element).hasClass('kf-numeric-textbox')) {
            value = $(element).find('input[data-role="numerictextbox"]').val();
        } else if ($(element).hasClass('kf-datepicker')) {
            const dateInput = $(element).find('input[data-role="datepicker"]').val();
            if (dateInput) {
                const dateValue = new Date(dateInput);
                if (!isNaN(dateValue)) {
                    dateValue.setMinutes(dateValue.getMinutes() - dateValue.getTimezoneOffset());
                    value = dateValue.toISOString().split('T')[0]; // Only use the date part
                }
            }
        } else if ($(element).hasClass('kf-checkbox')) {
            value = $(element).find('input[data-role="checkbox"]').prop('checked');
        }
        else {
            value = $(element).val().trim();
        }
        return value;
    }


    // Collected Form Data
    function collectFormData(formElement) {
        let formData = {};
        formElement.find('.kf-dropdownlist, .kf-textbox, .kf-textarea, .kf-switch, .kf-radiogroup, .kf-numeric-textbox,.kf-datepicker,.kf-checkbox').each(function () {
            let label = getLabelText(this);
            let value = getFieldValue(this);
            if (value != '')
                formData[label] = value;
        });
        return formData;
    }

    // Form Validation Trigger
    function validateForm(formId) {
        // Remove previous error messages
        removePreviousError(formId);
        // Validate the form using Kendo Validator instance
        let validator = formInstances[formId].data('kendoValidator');
        if (validator) {
            // Retrieve showSummary and handle empty fields
            const showSummary = formInstances[formId][0].dataset.kfFormShowSummary;
            const emptyFields = [];

            handleEmptyRequiredFields(formId, showSummary, emptyFields);

            // If there are empty required fields, abort form submission
            if (emptyFields.length > 0) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    function validateAndSubmitForm(formId) {
        // Remove previous error messages
        removePreviousError(formId);

        // Use the validateForm function to check if the form is valid
        const isValid = kungfui.validateForm(formId);

        if (isValid) {
            // Select form element and log for debugging
            const formElement = $(`[data-kf-form-id="${formId}"]`);
            // Retrieve method and action attributes
            const method = formInstances[formId][0].dataset.kfFormMethod;
            const action = buttonAction ? buttonAction : formInstances[formId][0].dataset.kfFormAction;

            // Create hiddenForm to collect form data
            const hiddenForm = $('<form>', {
                action: action,
                method: method,
                style: 'display: none;'
            });

            // Collect form data using the common method
            const formData = collectFormData(formElement);
            for (let label in formData) {
                $('<input>', {
                    type: 'hidden',
                    name: label,
                    value: formData[label]
                }).appendTo(hiddenForm);
            }

            // Append hiddenForm to body and submit
            $('body').append(hiddenForm);
            hiddenForm.submit();
        }
    }

    // Function to handle empty required fields and display error messages
    function handleEmptyRequiredFields(formId, showSummary, emptyFields) {
        const formElement = $(`[data-kf-form-id="${formId}"]`);
        const requiredFields = formElement.find(
            '.kf-textarea[data-kf-textarea-required="True"], .kf-numeric-textbox[data-kf-numeric-textbox-required="true"], .kf-textbox[data-kf-textbox-required="True"], .kf-dropdownlist[data-kf-dropdown-required="true"], .kf-radiogroup[data-kf-radiogroup-required="true"], .kf-switch[data-kf-switch-required="True"], .kf-datepicker[data-kf-datepicker-required="True"], .kf-checkbox[data-kf-checkbox-required="true"]'
        );

        requiredFields.each(function () {
            const field = $(this);

            // Common validation function
            const validateField = (value, label, errorClass, customValidateFn) => {
                if (!value) {
                    label.addClass('k-text-error');
                    field.find('.k-input, .k-dropdownlist, .k-datepicker, .k-checkbox').addClass(errorClass);
                    emptyFields.push(`${label.text().trim()} is required`);
                } else if (customValidateFn) {
                    const validationResult = customValidateFn(value);
                    if (!validationResult.success) {
                        label.addClass('k-text-error');
                        field.find('.k-input, .k-dropdownlist, .k-datepicker, .k-checkbox').addClass(errorClass);
                        field.find('.k-form-error').remove();
                        emptyFields.push(validationResult.message);
                        if (validationResult.message) {
                            $('<div>', {
                                class: 'k-form-error',
                                text: validationResult.message
                            }).insertBefore(field.find('.k-form-hint').length ? field.find('.k-form-hint') : null);
                        }
                    }
                }
            };

            if (field.hasClass('kf-textarea')) {
                const textarea = field.find('textarea');
                const label = field.find('.k-input-label');
                validateField(textarea.val().trim(), label, 'k-invalid', window[field.data('kf-validateinput')]);
            }

            if (field.hasClass('kf-numeric-textbox')) {
                const numericInput = field.find('input[data-role="numerictextbox"]');
                const label = field.find('.k-input-label');
                validateField(numericInput.val().trim(), label, 'k-invalid kf-invalid', window[field.data('kf-validateinput')]);
            }

            if (field.hasClass('kf-textbox')) {
                const textboxInput = field.find('input[data-role="textbox"]');
                const label = field.find('.k-input-label');
                validateField(textboxInput.val().trim(), label, 'k-invalid', window[field.data('kf-validateinput')]);
            }

            if (field.hasClass('kf-dropdownlist')) {
                const dropdownValue = field.find('.k-input-value-text').text().trim();
                const label = field.find('label.k-label');
                validateField(dropdownValue, label, 'k-invalid', window[field.data('kf-validateinput')]);
            }

            if (field.hasClass('kf-radiogroup')) {
                const isChecked = field.find('input[type="radio"]').is(':checked');
                if (!isChecked) {
                    emptyFields.push("Required field");
                    $('<div>', {
                        class: 'k-form-error k-radio-error',
                        text: "Required field"
                    }).insertAfter(field);
                } else {
                    field.removeClass('k-radio-error').find('.k-form-error.k-radio-error').remove();
                }
            }

            if (field.hasClass('kf-switch')) {
                const switchSpan = field.find('.k-switch');
                const switchValue = switchSpan.attr('aria-checked') === 'true';
                const label = field.find('.kf-switch-label');
                if (!switchValue) {
                    field.addClass('k-switch-error').find('.k-form-error.k-switch-error').remove();
                    emptyFields.push(`${label.text().trim()} is required`);
                    $('<div>', {
                        class: 'k-form-error k-switch-error',
                        text: `${label.text().trim()} is required`
                    }).insertAfter(switchSpan);
                } else {
                    field.removeClass('k-switch-error').find('.k-form-error.k-switch-error').remove();
                }
            }

            if (field.hasClass('kf-datepicker')) {
                const datePickerInput = field.find('input[data-role="datepicker"]');
                const label = field.find('label.k-label');
                validateField(datePickerInput.val().trim(), label, 'k-invalid kf-invalid', window[field.data('kf-validateinput')]);
            }

            if (field.hasClass('kf-checkbox')) {
                const checkboxInput = field.find('input[data-role="checkbox"]');
                const label = field.find('label.k-checkbox-label');
                validateField(checkboxInput.prop('checked'), label, 'k-invalid kf-invalid', window[field.data('kf-validateinput')]);
            }
        });

        if (showSummary === "True" && emptyFields.length > 0) {
            formElement.find('.k-form-error').remove();
            const alertMessage = emptyFields.join("<br>");
            const alertBox = formElement.find('.kf-alertbox');
            kungfui.hideAlertBox(alertBox.attr('id'));
            kungfui.showAlertBox(alertBox.attr('id'), '', alertMessage, 'error', '', alertBox.data('kf-alertbox-actions'), alertBox.data('kf-alertbox-width'));
        } else if (emptyFields.length > 0) {
            formElement.find('.kf-textbox[data-kf-textbox-required="True"], .kf-dropdownlist[data-kf-dropdown-required="true"], .kf-textarea[data-kf-textarea-required="True"], .kf-numeric-textbox[data-kf-numeric-textbox-required="true"], .kf-radiogroup[data-kf-radiogroup-required="true"], .kf-switch[data-kf-switch-required="True"], .kf-datepicker[data-kf-datepicker-required="True"], .kf-checkbox[data-kf-checkbox-required="true"]').each(function () {
                const field = $(this);
                let label = null;
                let isEmpty = false;

                if (field.hasClass('kf-textbox')) {
                    isEmpty = !field.find('input[data-role="textbox"]').val().trim();
                    label = field.find('.k-input-label');
                } else if (field.hasClass('kf-dropdownlist')) {
                    isEmpty = !field.find('.k-input-value-text').text().trim();
                    label = field.find('label[data-role="label"]');
                } else if (field.hasClass('kf-textarea')) {
                    isEmpty = !field.find('textarea').val().trim();
                    label = field.find('.k-input-label');
                } else if (field.hasClass('kf-numeric-textbox')) {
                    isEmpty = !field.find('input[data-role="numerictextbox"]').val().trim();
                    label = field.find('.k-input-label');
                    if (isEmpty) field.find('.k-numerictextbox').addClass('kf-invalid');
                } else if (field.hasClass('kf-radiogroup')) {
                    const isChecked = field.find('input[type="radio"]').is(':checked');
                    if (!isChecked) {
                        isEmpty = true;
                        label = field.find('.k-input-label');
                    }
                } else if (field.hasClass('kf-switch')) {
                    const switchValue = field.find('.k-switch').attr('aria-checked') === 'true';
                    if (!switchValue) {
                        isEmpty = true;
                        label = field.find('.k-input-label');
                    }
                } else if (field.hasClass('kf-datepicker')) {
                    isEmpty = !field.find('input[data-role="datepicker"]').val().trim();
                    label = field.find('.k-input-label');
                } else if (field.hasClass('kf-checkbox')) {
                    isEmpty = !field.find('input[data-role="checkbox"]').prop('checked');
                    label = field.find('.k-checkbox-label');
                }

                if (isEmpty && label && label.length > 0) {
                    label.addClass('k-text-error');
                    if (field.hasClass('kf-checkbox'))
                        label.after(`<div class='k-form-error'>${label.text().trim()} is required.</div>`);
                    else
                        label.next('span').addClass('k-invalid').after(`<div class='k-form-error'>${label.text().trim()} is required.</div>`);
                }
            });
        }
    }

    // Function to remove previous errors
    function removePreviousError(formId) {
        const formElement = $(`[data-kf-form-id="${formId}"]`);

        formElement.find('.k-form-error').remove();
        formElement.find('label').removeClass('k-text-error');
        formElement.find('span').removeClass('k-invalid');
        formElement.find('span').removeClass('kf-invalid');

        const alertId = formElement.find('.kf-alertbox').attr('id');
        kungfui.hideAlertBox(alertId);
        $('#validation-success').remove();
    }

    //Handel non validated submit
    function submitNonValidatedForm(formId) {
        removePreviousError(formId);

        // Select form element and log for debugging
        const formElement = $(`[data-kf-form-id="${formId}"]`);
        
        // Retrieve method and action attributes
        const method = formInstances[formId][0].dataset.kfFormMethod;
        const action = buttonAction ? buttonAction : formInstances[formId][0].dataset.kfFormAction;

        // Create hiddenForm to collect form data
        const hiddenForm = $('<form>', {
            action: action,
            method: method,
            style: 'display: none;'
        });

        // Collect form data using the common method
        const formData = collectFormData(formElement);
        for (let label in formData) {
            $('<input>', {
                type: 'hidden',
                name: label,
                value: formData[label]
            }).appendTo(hiddenForm);
        }

        // Append hiddenForm to body and submit
        $('body').append(hiddenForm);
        hiddenForm.submit();
    }

    function customSubmitForm(formId) {
        return new Promise((resolve, reject) => {
            removePreviousError(formId);

            // Select form element and log for debugging
            const formElement = $(`[data-kf-form-id="${formId}"]`);
            
            const buttonAction = formElement.find('.buttonUnit.k-focus').data("kf-button-action");

            // Retrieve method and action attributes
            const method = formInstances[formId][0].dataset.kfFormMethod || 'POST';
            let action = buttonAction ? buttonAction : formInstances[formId][0].dataset.kfFormAction;

            var formData = collectFormData(formElement);
            let serializedData = JSON.stringify(formData);
            
            // Ensure method is POST
            if (method.toUpperCase() !== 'POST') {
                console.error("Method is not POST");
                reject("Method is not POST");
                return;
            }

            // Make the Ajax request
            $.ajax({
                url: action,
                type: method,
                contentType: 'application/json',
                data: serializedData, // Serialize formData to JSON
                success: function (response) {
                    // Handle the JSON response
                    resolve(response); // Resolve the promise with response data
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('AJAX error:', textStatus, errorThrown);
                    console.error('Response text:', jqXHR.responseText);
                    reject(errorThrown); // Reject the promise with error
                }
            });
        });
    }

    // submitForm using Id
    function submitForm(formId) {
        let formElement = $(`#${formId}`);
        // Directly use formElement since it has the kf-form-item class
        const method = formElement.data('kf-form-method') || 'POST';
        const action = formElement.data('kf-form-action');

        // Set the form's action and method
        formElement.attr('action', action);
        formElement.attr('method', method);

        // Retrieve kf-button-action attribute value of the button with k-focus class
        const buttonAction = formElement.find('.buttonUnit.k-focus').data("kf-button-action");
        // Update form action with buttonAction if it's defined
        if (buttonAction) {
            formElement.attr('action', buttonAction);
        }

        // Collect form data using the common method
        const formData = collectFormData(formElement);
        for (let label in formData) {
            $('<input>', {
                type: 'hidden',
                name: label,
                value: formData[label]
            }).appendTo(formElement);
        }

        // Submit the form traditionally
        formElement.submit();
    }

    // Function to get the label text
    function getLabelText(element) {
        let label = '';
        if ($(element).hasClass('kf-dropdownlist') || $(element).hasClass('kf-textbox') || $(element).hasClass('kf-textarea') || $(element).hasClass('kf-radiogroup') || $(element).hasClass('kf-datepicker') || $(element).hasClass('kf-checkbox')) {
            label = $(element).find('[data-kf-name]').attr('data-kf-name');
        } else if ($(element).hasClass('kf-switch')) {
            label = $(element).data('kf-switch-name');
        } else if ($(element).hasClass('kf-numeric-textbox')) {
            label = $(element).find('input.k-input-inner[data-role="numerictextbox"]').attr('data-kf-name');
        } else {
            const inputElement = $(element).find('input[data-kf-name], select[data-kf-name], .kf-dropdownlist input[data-kf-name]');
            label = inputElement.attr('data-kf-name');
        }
        return label || '';
    }

    $(function () {
        initializeForms();
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-form').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeForms();
                        }
                    }
                });
            });
        });

        // Start observing the document body for added elements
        observer.observe(document.body, { childList: true, subtree: true });
    });

    kungfui.submitForm = submitForm;
    kungfui.customSubmitForm = customSubmitForm;
    kungfui.validateForm = validateForm;

})();
(function () {
    function initializeGrids() {
        const elements = $('.gridUnit').not('.kf-initialized');
        if (elements.length > 0) {

            $('.gridUnit').each(function (index, element) {
                // Initialize grid
                let grid = element;
                let gridBody = $(grid).find('.kf-grid-body');
                let inputCurrentPage = $(grid).find('input.kf-grid-current-page');
                let pagination = $(grid).find('.kf-grid-pagination');
                let toolbar = $(grid).find('.kf-grid-toolbar');
                let exportFilename = $(grid).data('kf-export-filename');
                let enableExportToExcel = $(grid).data('kf-enable-export-to-excel');
                let searchable = $(grid).data('kf-searchable');
                let disableToolbar = $(grid).data('kf-disable-toolbar');
                let gridHeight = $(grid).data('kf-height');
                let responsiveBehavior = $(grid).data('kf-responsive-behavior');
                let noRecordText = $(grid).data('kf-no-record-text');
                let exportFormatterFn = $(grid).data('kf-export-formatter');
                let blankPlaceholder = $(this).data('kf-blank-placeholder');

                inputCurrentPage.kendoNumericTextBox({
                    selectOnFocus: true,
                    spinners: false,
                    decimals: 0,
                    restrictDecimals: true,
                    change: function () {
                        $(gridBody).data("kendoGrid").dataSource.page(this.value());
                    }
                });

                let dsOptions;
                if ($(grid).data('kf-source').includes("/")) {
                    dsOptions = {
                        type: "aspnetmvc-ajax",
                        transport: {
                            read: {
                                url: $(grid).data('kf-source'),
                                dataType: "json"
                            }
                        },
                        schema: {
                            data: "Data",
                            total: "Total",
                        },
                        serverFiltering: true,
                        serverSorting: true,
                        serverPaging: true,
                        pageSize: ($(grid).data('kf-page-sizes')).split(',')[0],
                        allowUnsort: true,
                        change: function (e) {
                            let currentPage = $(gridBody).data("kendoGrid").dataSource.page();
                            let totalPages = $(gridBody).data("kendoGrid").dataSource.totalPages().toString().replace(new RegExp("0", "g"), "\\0");
                            let numText = $(inputCurrentPage).data("kendoNumericTextBox");
                            numText.setOptions({
                                format: "Page # out of " + totalPages,
                                value: currentPage
                            });
                        }
                    };
                } else {
                    dsOptions = {
                        data: eval($(grid).data('kf-source')),
                        serverFiltering: false,
                        serverSorting: false,
                        serverPaging: false,
                        pageSize: ($(grid).data('kf-page-sizes')).split(',')[0],
                        allowUnsort: true,
                        change: function (e) {
                            let currentPage = $(gridBody).data("kendoGrid").dataSource.page();
                            let totalPages = $(gridBody).data("kendoGrid").dataSource.totalPages().toString().replace(new RegExp("0", "g"), "\\0");
                            let numText = $(inputCurrentPage).data("kendoNumericTextBox");
                            numText.setOptions({
                                format: "Page # out of " + totalPages,
                                value: currentPage
                            });
                        }
                    };
                }

                let sortFn = $(grid).data('kf-default-sort');
                if (sortFn) dsOptions['sort'] = eval(`${sortFn}()`);

                // data source parameters
                let sourceParametersFn = $(grid).data('kf-source-parameters')
                if (sourceParametersFn) dsOptions['transport']['read']['data'] = eval(`${sourceParametersFn}()`);

                let ds = new kendo.data.DataSource(dsOptions);

                let cols = [];
                $(gridBody).find('.kf-column-hidden').each(function () {
                    let field = $(this).data('kf-name');
                    let title = $(this).data('kf-title') || field;
                    let type = $(this).data('kf-type');
                    let textAlign = $(this).data('kf-text-align');
                    let headerAlign = $(this).data('kf-header-align');

                    if (type == 'number' || type == 'currency') {
                        textAlign = textAlign || 'right';
                        headerAlign = headerAlign || 'right';
                    }

                    let alignHeaders = `!k-justify-content-${(headerAlign || 'left')}`;
                    let alignCells = `grid-content-align-${(textAlign || 'left')}`;
                    let format = $(this).data('kf-format');

                    if (type == 'currency') {
                        format = format || '{0:n2}';
                    }
                    
                    let col = {
                        field: field,
                        title: title,
                        headerAttributes: { class: alignHeaders },
                        attributes: { class: alignCells },
                        template: $(this).data('kf-template') || function (data) {
                            if (data[field] == null || `${data[field]}`.trim() == '')
                                return blankPlaceholder || null;

                            if (format)
                                return kendo.format(format, data[field]);

                            return data[field];
                        },
                        type: type
                    };

                    if (format)
                        col['format'] = format;

                    cols.push(col);
                    $(this).remove();
                });
                    
                let gbOptions = {
                    columns: cols,
                    dataSource: ds,
                    dataBound: function (e) {
                        let grid = this;

                        //let tooltipInitialized = false;
                        //if (!tooltipInitialized) {
                        //    initializeTooltips(grid);
                        //    tooltipInitialized = true;
                        //}

                        if (this.dataSource.view().length <= 0) {
                            $(pagination).css("display", "none");
                        } else {
                            $(pagination).css("display", "flex");
                        }
                    },
                    height: gridHeight,
                    sortable: true,
                    pageable: false,
                    filterable: false,
                    loaderType: "skeleton",
                    noRecords: true,
                    messages: {
                        noRecords: noRecordText || "No items to display"
                    }
                };

                if (enableExportToExcel.toLowerCase() == 'true') {
                    gbOptions['excel'] = {
                        allPages: true,
                        fileName: exportFilename
                    };

                    gbOptions['excelExport'] = eval(exportFormatterFn)
                };

                $(gridBody).kendoGrid(gbOptions);

                // set grid responsive behavior
                if (responsiveBehavior == 'scroll') {
                    $(grid).find('.k-grid .k-grid-container .k-grid-content').attr('style', 'overflow-y:auto !important;');
                    $(gridBody).css('max-height', 'calc(50vh - 12px)');
                }

                let enableAutoWidth = true;
                let scrollW = 0;
                $(gridBody).data('kendoGrid').bind('sort', function (e) {
                    scrollW = $(gridBody).find('.k-grid-content')[0].scrollLeft;
                    enableAutoWidth = false;
                });

                $(gridBody).data('kendoGrid').bind('dataBound', function (e) {
                    // resize columns to fit and distribute evenly
                    if (enableAutoWidth) {
                        $(gridBody).data('kendoGrid').autoFitColumns();
                    }

                    // custom styling to smooth bottom corners of grid body when no data is retrieved
                    // need this because pagination is not rendered on no data
                    if ($(gridBody).data('kendoGrid').dataSource.data().length == 0)
                        $(grid).find('.kf-grid-body.k-grid.k-grid-md, .k-grid-container').css('border-radius', '0 0 8px 8px');
                    else
                        $(grid).find('.kf-grid-body.k-grid.k-grid-md, .k-grid-container').css('border-radius', '0');

                    enableAutoWidth = true;

                    // programatically reset grid scroll on specific loaderTypes
                    if (scrollW && gbOptions['loaderType'] == 'skeleton') {
                        $(gridBody).find('.k-grid-content')[0].scrollLeft = scrollW;
                        scrollW = 0;
                    }
                })

                $(pagination).kendoPager({
                    dataSource: ds,
                    pageSizes: ($(grid).data('kf-page-sizes')).split(','),
                    messages: {
                        of: "",
                        page: "",
                        itemsPerPage: "",
                        display: "{2:##,#} records",
                    },
                    numeric: false,
                    input: false,
                    info: true
                });

                if (disableToolbar && disableToolbar.toLowerCase() == "false") {
                    let toolbarItems = [];
                    toolbarItems.push({
                        template: `<label class="grid-title">${$(this).data('kf-title')}</label>`,
                        overflow: 'never'
                    });

                    if (searchable.toLowerCase() == "true") {
                        toolbarItems.push({
                            template: "<div class='filter-text'><span class='k-searchbox k-input k-input-md k-rounded-md k-input-solid'><span class='k-input-icon'><span class='k-icon fa-light fa-magnifying-glass'></span></span><input autocomplete='off' placeholder='Search' title='Search' aria-label='Search' class='k-input-inner'></span></div>",
                        });
                    }

                    $(toolbar).find('.kf-filter-hidden').each(function () {
                        toolbarItems.push({
                            template: `<input id="${$(this).attr('id')}" class='kf-filter custom-filter' style='width: ${$(this).data('kf-width')}' data-kf-name="${$(this).data('kf-name')}" data-kf-title="${$(this).data('kf-title')}" data-kf-source="${$(this).data('kf-source')}" data-kf-custom-filter-expression="${$(this).data('kf-custom-filter-expression')}" data-kf-default-value="${$(this).data('kf-default-value')}"/>`
                        });
                        $(this).remove();
                    });

                    let actionButtonsDiv = $(grid).find('.kf-action-buttons');
                    if (actionButtonsDiv.find('.buttonUnit').length > 0) {
                        actionButtonsDiv.find('.buttonUnit').each(function () {
                            let buttonUnit = $(this); // Get the button unit element
                            let buttonHtml = buttonUnit[0].outerHTML;
                            toolbarItems.push({
                                template: buttonHtml,
                            });
                        });
                        actionButtonsDiv.remove();
                    }

                    $(grid).on('click', '.buttonUnit', function (e) {
                        let buttonOnClick = $(this).data('kf-button-onclick');
                        if (buttonOnClick) {
                            window[buttonOnClick](e);
                        }
                    });
                    toolbarItems.push({
                        type: "button",
                        icon: "arrow-rotate-cw",
                        fillMode: "flat",
                        overflow: "auto",
                        click: function (e) {
                            ds.read();
                        }
                    });

                    let hiddenOptions = 0;
                    if (enableExportToExcel.toLowerCase() == 'true') {
                        hiddenOptions++;
                        toolbarItems.push({
                            type: "button",
                            text: "Export to Excel",
                            overflow: "always",
                            click: function () {
                                $(gridBody).data("kendoGrid").saveAsExcel();
                            }
                        });
                    }

                    $(gridBody).find('.kf-menuoption-hidden').each(function () {
                        hiddenOptions++;
                        let menuId = $(this).data('kf-menuoption-id');
                        let menuText = $(this).data('kf-menuoption-text');
                        let menuOnClick = $(this).data('kf-menuoption-onclick');
                        toolbarItems.push({
                            type: "button",
                            text: menuText,
                            overflow: "always",
                            click: function () {
                                if (menuOnClick) {
                                    window[menuOnClick](this);
                                }
                            }
                        });
                    });

                    let kendoToolbar = $(toolbar).kendoToolBar({ items: toolbarItems, resizable: hiddenOptions > 0 });
                    let filterDefaultValues = false;
                    $(kendoToolbar).find('.kf-filter').each(function () {
                        let filterSource;
                        if ($(this).data('kf-source').includes("/")) {
                            filterSource = {
                                type: "aspnetmvc-ajax",
                                transport: {
                                    read: {
                                        dataType: "json",
                                        url: $(this).data('kf-source'),
                                    }
                                }
                            };
                        } else {
                            filterSource = eval($(this).data('kf-source'));
                        }

                        let ddOptions = {
                            dataTextField: 'Text',
                            dataValueField: 'Value',
                            dataSource: filterSource,
                            change: function (e) {
                                let id = $(e.sender.element).closest('.gridUnit').data('kf-id');
                                let val = $(e.sender.element).closest('.gridUnit').find('.k-searchbox .k-input-inner').val();
                                filterGrid(id, val);
                            }
                        }

                        let ddTitle = $(this).data('kf-title')
                        if (ddTitle)
                            ddOptions['optionLabel'] = {
                                Text: ddTitle,
                                Value: null
                            }

                        let ddDefaultValue = $(this).data('kf-default-value');
                        if (ddDefaultValue) {
                            filterDefaultValues = true;
                            ddOptions['value'] = ddDefaultValue;
                        }
                            
                        $(this).kendoDropDownList(ddOptions);
                    });

                    if (filterDefaultValues) {
                        let id = $(this).closest('.gridUnit').data('kf-id');
                        filterGrid(id, '');
                    }

                    $(grid).find(".k-searchbox .k-input-inner").on("change", function (e) {
                        let id = $(e.target).closest('.gridUnit').data('kf-id');
                        filterGrid(id, e.target.value);
                    });
                }
                else {
                    // smooth out the borders of the grid
                    $(element).find('.k-grid').css('border-top-right-radius', '8px');
                    $(element).find('.k-grid').css('border-top-left-radius', '8px');

                    $(element).find('.k-grid-header').css('border-top-right-radius', '8px');
                    $(element).find('.k-grid-header').css('border-top-left-radius', '8px');

                    $(element).find('.k-grid-header .k-grid-header-wrap').css('border-top-right-radius', '8px');
                    $(element).find('.k-grid-header .k-grid-header-wrap').css('border-top-left-radius', '8px');
                }

                let pagerContainer = $(grid).find('.k-pager-numbers-wrap');
                let pagerButton = $(grid).find('.k-pager-numbers-wrap button:eq(2)');
                $(grid).find('.k-numerictextbox').insertBefore($(pagerButton));
                $(grid).find('.k-pager-info').css('display', 'block').insertBefore($(pagerContainer));
                dropdownPager = $(grid).find('.k-pager-sizes');
                dropdownPager.find('.k-dropdownlist').css('display', 'flex');
                $(grid).addClass('kf-initialized');
            });
            $('.k-pager-sizes').on('click', function () {
                let str = $(this).children('.k-dropdownlist').attr('aria-controls');
                let id = str.substring(0, str.indexOf('_listbox'));
                let target = $(this).find('span');
                let leftPosition = target.offset().left;
                let animationContainer = $(`#${id}-list`).closest(".k-animation-container");
                animationContainer.css("left", leftPosition + "px");
                animationContainer.css("min-width", 75);
                animationContainer.css("width", 75);
                animationContainer.find(".k-child-animation-container, .k-popup, .k-list").css("width", 'auto');
                animationContainer.find(".k-child-animation-container, .k-popup, .k-list").css("min-width", 75);
            });
            $('.k-toolbar-item').on('click', function () {
                if ($(this).find('.k-dropdownlist').length > 0) {
                    let str = $(this).children('.k-dropdownlist').attr('aria-controls');
                    let id = str.substring(0, str.indexOf('_listbox'));
                    let animationContainer = $(`#${id}-list`).closest(".k-animation-container");
                    animationContainer.addClass('min-200');
                    animationContainer.find(".k-child-animation-container, .k-popup, .k-list").addClass('min-200');
                }
            });
        }
    }

    function filterGrid(id, query = '') {

        let grid = $(`[data-kf-id="${id}"]`);

        if (!grid.length)
            return;

        let gridData = $(grid).find('.kf-grid-body').data('kendoGrid');
        let gridCols = gridData.columns;
        var orFilter = { logic: "or", filters: [] };
        var customFilters = buildCustomFilters(grid, id);

        if (query) {
            // searchBox filter will use OR logical operator
            let searchableTypes = ['number', 'text', 'date', 'boolean'];
            $.each(gridCols, function (index, val) {
                if (!searchableTypes.includes(val.type))
                    return;
                var fltr =
                {
                    field: val.field,
                    operator: "contains",
                    value: query
                };
                orFilter.filters.push(fltr);
            });
        };
        if (orFilter.filters.length > 0) {
            customFilters.filters.push(orFilter);
        };
        if (customFilters && customFilters.filters && customFilters.filters.length > 0) {
            gridData.dataSource.filter(customFilters);
        }
        else
            gridData.dataSource.filter({});
    };
    function buildCustomFilters(grid, gridId) {
        // customFilters will use AND logical operator
        let andFilter = { logic: "and", filters: [] };
        $(grid)
            .find('.k-toolbar-item span.kf-filter')
            .add(`[data-kf-bound-to="${gridId}"]`)
            .each(function () {
                // get attr from parent
                let name = $(this).data('kf-name'); 
                let customExpr = $(this).data('kf-custom-filter-expression'); 
                $(this).find('input').each(function () {
                    // if no attr from parent, get attr from input itself
                    if (!name) name = $(this).data('kf-name'); 
                    if (!customExpr) customExpr = $(this).data('kf-custom-filter-expression');

                    if (customExpr) {
                        andFilter.filters.push(eval(`${customExpr}()`));
                    }
                    else if (name && $(this).val()) {
                        let gridFilter = { field: name, operator: "eq", value: $(this).val() }
                        andFilter.filters.push(gridFilter);
                    };
                });
            });
        return andFilter;
    };

    function refreshGrid(gridId, requestObj = null) {
        let grid = $(`[data-kf-id="${gridId}"] > .kf-grid-body`);
        grid.data('kendoGrid').dataSource.read(requestObj);
        grid.data('kendoGrid').refresh();
    }

    function exportDataAsCsv(gridId) {
        let gridElement = $(`[data-kf-id="${gridId}"]`);
        let grid = gridElement.find(".kf-grid-body").data("kendoGrid");

        if (!grid) {
            return;
        }

        let dataSource = grid.dataSource;
        let url = dataSource.transport.options ? dataSource.transport.options.read.url : '';

        if (url) {
            // Handle remote data source
            fetchAllRemoteData(grid.dataSource, url).then(data => {
                if (data.length > 0) {
                    let columns = grid.columns.filter(col => col.field); // Exclude columns without a field
                    let csv = convertToCsv(data, columns); // Convert to CSV
                    downloadCsv(csv, gridElement); // Trigger download
                }
            }).catch(error => {
                console.error("Failed to fetch data for export", error);
            });
        } else {
            // Handle local data source
            let data = dataSource.view().toJSON(); // Get currently displayed data
            if (data.length > 0) {
                let columns = grid.columns.filter(col => col.field); // Exclude columns without a field
                let csv = convertToCsv(data, columns); // Convert to CSV
                downloadCsv(csv, gridElement); // Trigger download
            }
        }
    }
    function fetchAllRemoteData(dataSource, url) {
        let allData = [];
        var page = 1;
        let totalRecords = dataSource.total();

        var ajaxtransport = new kendo.data.transports["aspnetmvc-ajax"]({ prefix: "" });

        return new Promise((resolve, reject) => {
            function fetchPage() {
                var params = ajaxtransport.parameterMap({
                    page: page,
                    pageSize: totalRecords,
                    sort: dataSource.sort(),
                    filter: dataSource.filter(),
                    group: dataSource.group()
                });
                $.ajax({
                    url: url,
                    type: "POST",
                    data: params,
                    success: function (response) {
                        if (response && response.Data) {
                            allData = allData.concat(response.Data); // Collect all data
                            if (response.Total == allData.length) {
                                resolve(allData); // All data fetched
                            } else {
                                page++;
                                fetchPage(); // Fetch next page
                            }
                        } else {
                            resolve(allData);
                        }
                    },
                    error: function (xhr, status, error) {
                        reject(error);
                    }
                });
            }

            fetchPage();
        });
    }
    function convertToCsv(data, columns) {
        if (!data.length) return '';
        let headers = columns.map(col => col.title || col.field);
        let csvRows = [];
        csvRows.push(headers.join(','));
        data.forEach(item => {
            let row = columns.map(col => {
                let value = item[col.field];
                return `"${value ? value.toString().replace(/"/g, '""') : ''}"`;
            });
            csvRows.push(row.join(','));
        });
        return csvRows.join('\n');
    }

    function downloadCsv(csv, gridElement) {
        let csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        let csvUrl = URL.createObjectURL(csvData);
        let a = document.createElement('a');
        let baseFileName = gridElement.attr('data-kf-export-filename') || 'data';
        let fileName = `${baseFileName}.csv`;
        a.href = csvUrl;
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    function initializeTooltips(grid) {
        grid.element.find(".k-grid-header").kendoTooltip({
            filter: "thead th",
            showOn: "mouseenter",
            hideOn: "mouseleave",
            content: function (e) {
                let element = $(e.target);
                let text = element.text().trim();
                if (!element || !element.length) {
                    return null;
                }
                let tempElem = $('<div>').css({
                    position: 'absolute',
                    visibility: 'hidden',
                    whiteSpace: 'nowrap',
                    fontSize: element.css('font-size'),
                    fontFamily: element.css('font-family'),
                    fontWeight: element.css('font-weight'),
                    fontStyle: element.css('font-style'),
                    letterSpacing: element.css('letter-spacing'),
                    padding: element.css('padding'),
                    border: element.css('border')
                }).text(text).appendTo('body');

                let offsetWidth = element[0].offsetWidth;
                let scrollWidth = tempElem[0].scrollWidth;

                tempElem.remove();
                if (scrollWidth > offsetWidth) {
                    $('[role="tooltip"]').css("visibility", "visible");
                    return text;
                } else {
                    $('[role="tooltip"]').css("visibility", "hidden");
                    return null;
                }
            }, show: function () {
                if (this.content.text() != "") {
                    $('[role="tooltip"]').css("visibility", "visible");
                }
            },
        });
    }


    $(function () {
        kendo.setDefaults("iconType", "font");

        // Call initializeGrids on document ready
        initializeGrids();

        // Use MutationObserver to watch for added nodes
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1 && $(node).hasClass('gridUnit')) {
                        initializeGrids();
                    } else if (node.nodeType === 1) {
                        const addedElements = $(node).find('.gridUnit').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeGrids();
                        }
                    }
                });
            });
        });

        // Start observing the document body for added elements
        observer.observe(document.body, { childList: true, subtree: true });

    });

    kungfui.refreshGrid = refreshGrid;
    kungfui.exportDataAsCsv = exportDataAsCsv;
    kungfui.filterGrid = filterGrid;

})();
(function () {
    function initializeImageScroll() {
        const elements = $('.kf-imagescroll').not('.kf-initialized');
        if (elements.length > 0) {
            kendo.setDefaults("iconType", "font");

            elements.each(function (index, element) {
                const imagescroll = $(element);
                // Extract data attributes
                const id = imagescroll.data('kf-imagescroll-id');
                const width = imagescroll.data('kf-imagescroll-width');
                const height = imagescroll.data('kf-imagescroll-height');
                const images = imagescroll.data('kf-imagescroll-source');
                const clickMethod = imagescroll.data("kf-imagescroll-handle-click");

                // Create image scroll item and container
                const imageScrollItem = $("<div>").addClass("kf-imagescroll-item").attr("id", id).data("id", id);
                const imageScrollContainerDiv = $("<div>").addClass("imageScrollContainer");
                const imageScrollSectionDiv = $("<div>").addClass("imageScrollSection");
                imagescroll.addClass('kf-initialized');
                let fetchedData = [];

                // Function to create image div
                function createImageDiv(item) {
                    // Create img element
                    const imgDiv = $("<div>").addClass("imageDiv").attr("data-role", "page");
                    const img = $("<img>").attr({ "src": item.ImageUrl });
                    const imgWrapperDiv = $("<div>").addClass("imageWrapperDiv");

                    // Click event handler
                    img.click(function () {
                        // Handle click method if provided
                        if (clickMethod) {
                            window[clickMethod](item.Id);
                        }
                    });

                    // Append img to imgWrapperDiv
                    img.appendTo(imgWrapperDiv);
                    imgWrapperDiv.appendTo(imgDiv);
                    return imgDiv;
                }

                // Function to create pager
                function createPager(totalImages) {
                    // Create pager element
                    $("<div>").addClass("pager").append($("<span>").addClass("span-pager").text("1 / " + totalImages)).appendTo(imageScrollContainerDiv);
                }

                // Function to initialize ScrollView
                function initializeScrollView() {
                    // Check if ScrollView should be initialized
                    const enablePager = !imageScrollContainerDiv.hasClass('pager') && fetchedData && fetchedData.length > 1;

                    // Initialize Kendo ScrollView with appropriate options
                    imageScrollItem.find(".imageScrollSection").kendoScrollView({
                        enablePager: enablePager,
                        contentHeight: "100%",
                        // Only include change event if enablePager is true
                        change: enablePager ? function (e) {
                            const currentPage = e.nextPage + 1;
                            const totalImages = fetchedData.length;
                            imageScrollItem.find(".span-pager").text(currentPage + " / " + totalImages);
                        } : undefined
                    });

                    imagescroll.find('.imageScrollSection').css({ width: width, height: height });

                    if (fetchedData.length <= 1) {
                        imageScrollItem.find(".k-scrollview-prev, .k-scrollview-next").addClass('hidden_important');
                    }
                }


                // Function to dynamically invoke a function by name
                function invokeFunctionByName(functionName) {
                    if (typeof window[functionName] === 'function') {
                        return window[functionName]();
                    } else {
                        return [];
                    }
                }


                // Fetch data and populate imageScrollSectionDiv
                if (images.includes("/")) {
                    let ds = new kendo.data.DataSource({
                        type: "aspnetmvc-ajax",
                        transport: { type: "aspnetmvc-ajax", read: { dataType: "json", url: images } },
                        schema: { data: response => response }
                    });

                    ds.fetch(() => {
                        fetchedData = ds.view().map(item => ({ Id: item.Id, ImageUrl: item.ImageUrl }));
                        fetchedData.forEach(item => imageScrollSectionDiv.append(createImageDiv(item)));
                        if (fetchedData.length > 1) createPager(fetchedData.length);
                        initializeScrollView();
                    });
                } else {
                    fetchedData = invokeFunctionByName(images);
                    if (Array.isArray(fetchedData)) {
                        fetchedData.forEach(item => imageScrollSectionDiv.append(createImageDiv(item)));
                        if (fetchedData.length > 1) createPager(fetchedData.length);
                    }
                }

                // If no data show demo image
                if (fetchedData.length === 0 && !images.includes("/")) {
                    const demoDivImg = $("<div>").addClass("demo-image").css({ width: width, height: height });
                    const exclamationIcon = $('<i>').addClass('fa-light fa-triangle-exclamation');
                    demoDivImg.append(exclamationIcon);
                    imageScrollSectionDiv.append(demoDivImg);
                }

                // Append elements to DOM
                imageScrollSectionDiv.appendTo(imageScrollContainerDiv);
                imageScrollContainerDiv.appendTo(imageScrollItem);
                imageScrollItem.appendTo(imagescroll);
                initializeScrollView();
            });
        }
    }

    $(function () {

        initializeImageScroll();
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-imagescroll').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeImageScroll();
                        }
                    }
                });
            });
        });

        // Start observing the document body for added elements
        observer.observe(document.body, { childList: true, subtree: true });

    });
})();
(function () {
    // Define variables
    let initialLoad = false;
    let kfFolderValue;
    let kfSubFolderValue;
    let sortField;
    let sortOrder;
    let viewType;
    let hideIcons = false;
    let endPoint = null;
    let searchParam = null;
    let hideListViewButtonsOnMultiSelectClick = true;
    let hideActions;
    let isRightIconClicked = false;
    let iconActions = {};


    // Function to trigger tab based on value
    function triggerTab(value) {
        // Determine the tab id based on value
        const tabId = value.includes("Inbox") ? '#inbox-tab' : '#archive-tab';
        // Trigger click event on tabm jn jncc
        $(tabId).trigger('click');
    }

    // Function to setup developer display
    function updateDefaultDisplaySettings(folder, subFolder, field, order) {
        // Set initial load to true
        initialLoad = true;
        // Set kfSubFolderValue, sortField, and sortOrder
        kfSubFolderValue = subFolder;
        sortField = field;
        sortOrder = order;
        if (kfSubFolderValue) {
            kfSubFolderValue = kfSubFolderValue.replace(/\s/g, '');
        }

        // Set kfFolderValue
        kfFolderValue = folder;

        // If both kfFolderValue and kfSubFolderValue exist, combine them and trigger the  corresponding tab
        if (kfFolderValue && kfSubFolderValue) {
            kfSubFolderValue = kfFolderValue + "" + kfSubFolderValue;
            triggerTab(kfSubFolderValue);
        }
    }

    function changeMailboxView(viewType) {
        changeView(null, null, viewType);
    }

    function hideMultiSelectQuickActions(hideActions) {
        hideQuickActions(hideActions);
    }

    // Function to update the data source with the search term
    function updateDataSourceWithSearch(searchTerm) {
        console.log("DataSource updated with search term:", searchTerm);
        initialLoad = true;
        searchParam = searchTerm;

        let isVisible;
        var toolbarInbox = document.getElementById('toolbarInbox');
        if (toolbarInbox) {
            isVisible = window.getComputedStyle(toolbarInbox).getPropertyValue('display') !== 'none';
        }

        const folder = isVisible ? "Inbox" : "Archive";

        kfFolderValue = folder;
        triggerTab(kfFolderValue);
    }

    function triggerSwipeAction(itemId) {
        triggerQuickActionsById(itemId);
    }

    $(function () {
        // Define a variable to hold the displayQuickActions function
        var displayQuickActions;
        var changeView;
        var hideQuickActions;
        var triggerQuickActionsById;
        // Check if there are any tabs with class '.kf-mailbox'
        if ($('.kf-mailbox').length > 0) {
            console.log(".kf-mailbox onDocumentReady executed");
            // Iterate over each '.kf-mailbox' element
            $('.kf-mailbox').each(function (index, element) {
                // Initialize Kendo TabStrip for '.kf-tabs' elements
                $('.kf-tabs').kendoTabStrip({
                    animation: {
                        open: {
                            effects: 'fadeIn'
                        }
                    }
                });

                // Initialize Kendo TabStrip for '#toolbarInbox'
                $("#toolbarInbox").kendoTabStrip({
                    animation: {
                        open: {
                            effects: 'fadeIn'
                        }
                    }
                }).addClass("k-tabstrip-scrollable");

                // Handle dragging and scrolling
                let isDragging = false;
                let startX, startY;
                let selectedSubFolderFilter = null;
                let isActionButtonsDisplayed = $('.k-listview-content').data("kf-is-action-button-displayed");

                // Function to handle dragging and scrolling
                function handleDraggingAndScrolling($element) {
                    // Mousedown event for desktop
                    $element.on("mousedown", function (event) {
                        isDragging = true;

                        startX = event.pageX;
                        startY = event.pageY;

                        event.preventDefault(); // Prevents text selection while dragging
                    });

                    // Touchstart event for mobile
                    $element.on("touchstart", function (event) {
                        isDragging = true;

                        startX = event.touches[0].pageX;
                        startY = event.touches[0].pageY;
                    });

                    // Mousemove event for desktop
                    $element.on("mousemove", function (event) {
                        if (isDragging) {
                            var deltaX = event.pageX - startX;
                            var deltaY = event.pageY - startY;

                            $element.scrollLeft($element.scrollLeft() - deltaX);
                            $element.scrollTop($element.scrollTop() - deltaY);

                            startX = event.pageX;
                            startY = event.pageY;
                        }
                    });

                    // Touchmove event for mobile
                    $element.on("touchmove", function (event) {
                        if (isDragging) {
                            var deltaX = event.touches[0].pageX - startX;
                            var deltaY = event.touches[0].pageY - startY;

                            $element.scrollLeft($element.scrollLeft() - deltaX);
                            $element.scrollTop($element.scrollTop() - deltaY);

                            startX = event.touches[0].pageX;
                            startY = event.touches[0].pageY;
                            event.preventDefault(); // Prevents default touch behavior
                        }
                    });

                    // Mouseup event for desktop
                    $(document).on("mouseup", function () {
                        isDragging = false;
                    });

                    // Touchend event for mobile
                    $(document).on("touchend", function () {
                        isDragging = false;
                    });

                    // Wheel event
                    $element.on("wheel", function (event) {
                        scrollTabs(event, $element);
                        event.preventDefault(); // Prevents scrolling of the whole page
                    });

                    // Add touchmove event to set isDragging to true
                    $element.on("touchmove", function () {
                        isDragging = true;
                    });
                }

                // Scroll tabs function
                function scrollTabs(event, $element) {
                    var delta = event.originalEvent.deltaY || event.originalEvent.detail || event.originalEvent.wheelDelta;

                    $element.scrollLeft($element.scrollLeft() + delta);

                    event.preventDefault();
                }

                // Call handleDraggingAndScrolling for '.kf-tabstrip-toolbarInbox' and '.kf-tabstrip-toolbarArchive'
                handleDraggingAndScrolling($(".kf-tabstrip-toolbarInbox"));
                handleDraggingAndScrolling($(".kf-tabstrip-toolbarArchive"));


                // Hide container on page load
                $("#mailCountContainer").hide();

                // Add class to the first list item of '.kf-tabstrip-toolbarInbox'
                $('.kf-tabstrip-toolbarInbox li:first').addClass('k-active');

                // Append icons to '#actionButtons'
                console.log("isActionButtonsDisplayed - ", isActionButtonsDisplayed);
                if (isActionButtonsDisplayed) {
                    $('#actionButtons').append(
                        $('<span class="left-icon"><i class="fa-light fa-arrow-down-short-wide"></i></span>'),
                        $('<span class="middle-icon"><i class="fa-light fa-list"></i></span>'),
                        $('<span class="right-icon"><i class="fa-light fa-square-check"></i></span>')
                    );
                }

                let dataSource;
                let dataSourceHeader;
                let isLeftIconClicked = false;

                // Left icon click event
                $('.left-icon').click(function () {
                    const kfActionButtonSortValue = $('.k-listview-content').data("kf-action-button-sort");
                    isLeftIconClicked = true;
                    if (kfActionButtonSortValue) {
                        const sortMethod = $('.k-listview-content').data("kf-action-button-sort");

                        if (typeof window[sortMethod] === 'function') {
                            window[sortMethod](dataSourceHeader);
                        }

                        $("#mailCountContainer").hide().empty();
                        $('.right-icon').removeClass('active highlight');

                        const activeTab = getActiveTab();
                        if (activeTab) {
                            // Get the text content of the active tab
                            var activeTabText = activeTab.data('name');
                            initializeListViews(activeTabText);
                        }
                    }

                    /*$('.right-icon').removeClass('active highlight');*/
                });

                // Function to retrieve the current view state
                function getMailboxViewState() {
                    let mailboxViewState = localStorage.getItem('mailboxViewState');
                    if (mailboxViewState === "undefined" || mailboxViewState === '' || mailboxViewState === null) {
                        mailboxViewState = 'list'; // Update the variable
                        localStorage.setItem('mailboxViewState', 'list'); // Set default value to 'list'
                    }
                    return mailboxViewState;
                }

                function setMailboxViewState(viewType) {
                    if (viewType === "list" || viewType === "compact") {
                        localStorage.setItem('mailboxViewState', viewType);
                        if (viewType === "list") {
                            let listContent = $('.kf-listview-content');
                            const isCompactView = listContent.hasClass('kf-listView');
                            if (!isCompactView) {
                                return;
                            } else {
                                listContent.toggleClass('kf-listView');
                                const isListViewIconCheck = listViewContent.hasClass('kf-listView');
                                const middleIcon = isListViewIconCheck ? '<i class="fa-light fa-window-maximize"></i>' : '<i class="fa-light fa-list"></i>';

                                $(this).html(middleIcon);
                                // Remove existing drawers and classes using the new function
                                removeQuickActionsAndDrawer();

                                $("#mailCountContainer").hide().empty();
                                $('.right-icon').removeClass('active highlight');

                                const activeTab = getActiveTab();
                                if (activeTab) {
                                    // Get the text content of the active tab
                                    var activeTabText = activeTab.data('name');
                                    initializeListViews(activeTabText);
                                }
                            }
                        } else {
                            //compact
                            let listContent = $('.kf-listview-content');
                            const isCompactView = listContent.hasClass('kf-listView');
                            if (!isCompactView) {
                                listContent.toggleClass('kf-listView');
                                const isListViewIconCheck = listViewContent.hasClass('kf-listView');
                                const middleIcon = isListViewIconCheck ? '<i class="fa-light fa-window-maximize"></i>' : '<i class="fa-light fa-list"></i>';

                                $(this).html(middleIcon);
                                // Remove existing drawers and classes using the new function
                                removeQuickActionsAndDrawer();

                                $("#mailCountContainer").hide().empty();
                                $('.right-icon').removeClass('active highlight');

                                const activeTab = getActiveTab();
                                if (activeTab) {
                                    // Get the text content of the active tab
                                    var activeTabText = activeTab.data('name');
                                    initializeListViews(activeTabText);
                                }
                            } else {
                                return;
                            }
                        }
                    } else {
                        $('.middle-icon').trigger('click', false);
                    }
                    $('.middle-icon').trigger('click', false);
                }

                $('.middle-icon').click(function (event, isFromBtn = true) {
                    changeView(null, isFromBtn, null);
                });

                changeView = function (event, isFromBtn, viewType) {
                    const validViewTypes = ['compact', 'list'];
                    const listViewContent = $('.kf-listview-content');
                    const isNotListView = listViewContent.hasClass('kf-listView');

                    // Retrieve the view from localStorage
                    var view = localStorage.getItem('mailboxViewState');

                    // Fallback to getMailboxViewState if the view is not set
                    if (view === null || view === "undefined") {
                        getMailboxViewState();
                    }

                    // Override the view with viewType if provided and is a valid type
                    if (viewType && validViewTypes.includes(viewType)) {
                        view = viewType;
                        localStorage.setItem('mailboxViewState', viewType);
                    }

                    // Toggle the class based on the view state and button click
                    if ((isFromBtn && view == 'list') || (!isFromBtn && view == 'compact' && !isNotListView)) {
                        listViewContent.toggleClass('kf-listView');
                        localStorage.setItem('mailboxViewState', 'compact');
                    } else if ((isFromBtn && view == 'compact') || (!isFromBtn && view == 'list' && isNotListView)) {
                        listViewContent.toggleClass('kf-listView');
                        localStorage.setItem('mailboxViewState', 'list');
                    }

                    // Update the button icon based on the current view state or viewType
                    const isListViewIconCheck = listViewContent.hasClass('kf-listView');
                    let middleIcon = '';
                    if (event === null && viewType === 'compact') {
                        middleIcon = '<i class="fa-light fa-window-maximize"></i>';
                    } else if (event === null && viewType === 'list') {
                        middleIcon = '<i class="fa-light fa-list"></i>';
                    } else {
                        middleIcon = isListViewIconCheck ? '<i class="fa-light fa-window-maximize"></i>' : '<i class="fa-light fa-list"></i>';
                    }

                    // Set the icon HTML
                    if (event) {
                        $(event.currentTarget).html(middleIcon);
                    } else {
                        $('.middle-icon').html(middleIcon);
                    }

                    // Remove existing drawers and classes
                    removeQuickActionsAndDrawer();

                    // Hide and empty the mail count container
                    $("#mailCountContainer").hide().empty();
                    $('.right-icon').removeClass('active highlight');

                    // Get the active tab and reinitialize list views if needed
                    const activeTab = getActiveTab();
                    if (activeTab) {
                        // Get the text content of the active tab
                        var activeTabText = activeTab.data('name');
                        if (isFromBtn) {
                            initializeListViews(activeTabText);
                        }
                    }
                };

                hideQuickActions = function (hideActions) {
                    console.log("------------------------->", hideActions);
                    hideListViewButtonsOnMultiSelectClick = hideActions;
                }

                // Right icon click event
                $('.right-icon').click(function () {
                    isRightIconClicked = true;
                    $(this).toggleClass('active highlight');
                    /*hideListViewButtonsOnMultiSelectClick = false;*/
                    console.log("isRightIconClicked value - ", isRightIconClicked);


                    $('.k-listview-item').toggleClass('selected-right-icon');
                    const isActive = $(this).hasClass('active');
                    $('.checkBoxListView').toggleClass('hidden-checkbox', !isActive);

                    // Show checkbox if right icon is active
                    if (isActive) {
                        $(this).closest('.k-listview-item').find('.checkBoxListView').show();
                    } else {
                        $(".listViewButtons").show();
                    }

                    checkedItems = [];
                    $('.checkBoxListView').prop('checked', false);
                    $("#mailCountContainer").hide().empty();
                });

                // Inbox tab click event
                $('#inbox-tab').click(function () {
                    hideIcons = false;
                    isRightIconClicked = false;
                    toggleToolbars(true);
                    // Set the first item in the inbox toolbar as active
                    $('.kf-tabstrip-toolbarInbox li').removeClass('k-active').first().addClass('k-active');

                    // Handle subfolder value and initial load
                    if (kfSubFolderValue && initialLoad) {
                        const firstLetter = kfSubFolderValue.charAt(0);
                        const convertedValue = firstLetter.toLowerCase() + kfSubFolderValue.slice(1);
                        $(`#${convertedValue}`).trigger('click');
                    } else {
                        // Initialize list views with "All" if no subfolder or not refreshed
                        initializeListViews("All");
                    }
                    scrollToActiveTab(".kf-tabstrip-toolbarInbox");

                    // Reset initial load flag
                    initialLoad = false;
                    // Clear active highlight icons and mail count container
                    clearActiveHighlightsAndMailCount();
                });

                let clickCount = 0;
                // Archive tab click event
                $('#archive-tab').click(function () {
                    toggleToolbars(false);
                    isRightIconClicked = false;
                    // Set the first item in the archive toolbar as active
                    $('.kf-tabstrip-toolbarArchive li').removeClass('k-active').first().addClass('k-active');

                    if (clickCount === 0) {
                        $('#toolbarArchive').kendoTabStrip({
                            animation: {
                                open: {
                                    effects: 'fadeIn'
                                }
                            }
                        });
                    }
                    clickCount++;

                    // Handle subfolder value and initial load
                    if (kfSubFolderValue && initialLoad) {
                        const firstLetter = kfSubFolderValue.charAt(0);
                        const convertedValue = firstLetter.toLowerCase() + kfSubFolderValue.slice(1);
                        $(`#${convertedValue}`).trigger('click');
                    } else {
                        // Initialize list views with "All" if no subfolder or not refreshed
                        initializeListViews("All");
                        $('.kf-tabstrip-toolbarArchive li:first').addClass('k-active');
                    }
                    scrollToActiveTab(".kf-tabstrip-toolbarArchive");

                    // Reset initial load flag
                    initialLoad = false;
                    // Clear active highlight icons and mail count container
                    clearActiveHighlightsAndMailCount();

                    var $tabstripItemsWrapper = $('#toolbarArchive .k-tabstrip-items-wrapper');
                    if ($tabstripItemsWrapper.length === 2) {
                        $tabstripItemsWrapper.first().remove();
                    }
                });

                // Function to scroll to active tab
                function scrollToActiveTab(tabstripClass) {
                    var activeTab = $(tabstripClass + ' .k-tabstrip-item.k-active');
                    if (activeTab.length > 0) {
                        var tabStrip = $(tabstripClass);
                        var activeTabLeft = activeTab.position().left;
                        tabStrip.animate({ scrollLeft: activeTabLeft }, 300);
                    }
                }

                // Function to clear active highlight icons and mail count container
                function clearActiveHighlightsAndMailCount() {
                    $(".right-icon.active.highlight").removeClass("active highlight");
                    $("#mailCountContainer").hide().empty();
                }

                // Inbox subfolder click event
                $('#inboxAll, #inboxNew, #inboxViewed, #inboxPending, #inboxActionRequired ,#inboxPickupRequested').click(function () {
                    // Clear active highlight icons and mail count container
                    isRightIconClicked = false;
                    clearActiveHighlightsAndMailCount();
                    hideIcons = false;
                    const buttonText = $(this).text().replace(/\d+/g, '').trim();
                    initializeListViews(buttonText);
                });

                // Archive subfolder click event
                $('#archiveAll, #archiveForwarded, #archiveChecksDeposited, #archivePickedUp, #archiveRecycled, #archiveShredded').click(function () {
                    // Clear active highlight icons and mail count container
                    hideIcons = false;
                    isRightIconClicked = false;
                    clearActiveHighlightsAndMailCount();
                    const buttonText = $(this).text().replace(/\d+/g, '').trim();
                    initializeListViews(buttonText);
                });

                // Archive shipment click event
                $('#archiveShipments').click(function () {
                    // Clear active highlight icons and mail count container
                    clearActiveHighlightsAndMailCount();
                    isRightIconClicked = false;
                    hideIcons = true;
                    const buttonText = $(this).text().replace(/\d+/g, '').trim();
                    initializeListViews(buttonText);
                });

                $(document).on('click', '.itemId, .itemDetails, .itemTitleDetail, .imageSection', function () {
                    // Check if the clicked element is not listViewButtons
                    if (!$(this).closest(".k-listview-item").find(".drawer-container").length > 0 && !$(event.target).closest('.listViewButtons').length
                        && !$(event.target).closest('.k-scrollview-prev').length
                        && !$(event.target).closest('.k-scrollview-next').length) {
                        // Remove existing drawers and classes using the new function
                        listInnerItemCount = 0;
                        removeQuickActionsAndDrawer();

                        const listItem = $(this).closest(".k-listview-item");
                        const itemOnClickAction = $('.k-listview-content').data("kf-item-on-click");

                        if (typeof window[itemOnClickAction] === 'function') {
                            window[itemOnClickAction](listItem.find("#kf-listview-id").val());
                        }

                        $("#mailCountContainer").hide().empty();
                        $('.right-icon').removeClass('active highlight');

                        $('.k-listview-item').each(function () {
                            if ($(this).hasClass('selected-right-icon')) {
                                //console.log('Found .selected-right-icon in', this);
                                uncheckAllCheckboxes();
                            } else {
                                //console.log('No .selected-right-icon found in', this);
                            }
                        });
                    }
                });

                $(document).on('click', '.shipmentInfoDiv', function (event) {
                    // Check if the clicked element is not listViewButtons
                    if (!$(this).closest(".k-listview-item").find(".drawer-container").length > 0) {
                        // Remove existing drawers and classes using the new function
                        removeQuickActionsAndDrawer();

                        const shipmentItem = $(this).closest(".shipmentInfoDiv");
                        const itemId = shipmentItem.find("#kf-listview-id").val();

                        const shipmentOnClickAction = $('.k-listview-content').data("kf-shipment-on-click");
                        if (typeof window[shipmentOnClickAction] === 'function') {
                            window[shipmentOnClickAction](itemId);
                        }

                        $("#mailCountContainer").hide().empty();
                        $('.right-icon').removeClass('active highlight');
                    }
                });

                function toggleToolbars(showInbox) {
                    $('#toolbarInbox').toggle(showInbox);
                    $('#toolbarArchive').toggle(!showInbox);
                }

                // Function to initialize list views with subfolder filter
                function initializeListViews(subFolderFilter, field = null, order = null) {
                    $('.k-listview-content').each(function (index, element) {
                        const listViewContent = $(element);
                        let isVisible;
                        let pageNumber = 1;
                        let pageSize = listViewContent.data('kf-list-pagesize') || 10;
                        selectedSubFolderFilter = subFolderFilter
                        var toolbarInbox = document.getElementById('toolbarInbox');
                        if (toolbarInbox) {
                            isVisible = window.getComputedStyle(toolbarInbox).getPropertyValue('display') !== 'none';
                        }

                        if (hideIcons) {
                            var middleIcon = document.querySelector('.middle-icon');
                            var rightIcon = document.querySelector('.right-icon');

                            if (middleIcon) {
                                middleIcon.style.display = 'none';
                            } if (rightIcon) {
                                rightIcon.style.display = 'none';
                            }
                        } else {
                            var middleIcon = document.querySelector('.middle-icon');
                            var rightIcon = document.querySelector('.right-icon');

                            if (middleIcon) {
                                middleIcon.style.display = 'block';
                            }
                            if (rightIcon) {
                                rightIcon.style.display = 'block';
                            }
                        }

                        const filterFolder = isVisible ? "Inbox" : "Archive";
                        if (filterFolder != kfFolderValue) {
                            kfFolderValue = filterFolder;
                        }

                        if (!isLeftIconClicked) {
                            dataSource = getDataSource(listViewContent.data('kf-list-source'), kfFolderValue, selectedSubFolderFilter, searchParam, pageNumber, pageSize);
                        }

                        if (field != null && order != null) {
                            dataSource.sort({ field: field, dir: order });
                        }

                        if (sortField != null && sortOrder != null) {
                            dataSource.sort({ field: sortField, dir: sortOrder });
                        }

                        isLeftIconClicked = false;

                        let counts = { "All": 0 };

                        listViewContent.empty();

                        let skeletonContainer1, skeletonContainer2, skeletonCompactContainer1, skeletonCompactContainer2, skeletonCompactContainer3, skeletonCompactContainer4, skeletonCompactContainer5;
                        let shipmentSkeletonCompactContainer1, shipmentSkeletonCompactContainer2, shipmentSkeletonCompactContainer3;

                        const view = getMailboxViewState();

                        if (subFolderFilter === 'Shipments') {
                            shipmentSkeletonCompactContainer1 = createSkeletonContainerForShipment();
                            listViewContent.append(shipmentSkeletonCompactContainer1);
                            shipmentSkeletonCompactContainer1.show();

                            shipmentSkeletonCompactContainer2 = createSkeletonContainerForShipment();
                            listViewContent.append(shipmentSkeletonCompactContainer2);
                            shipmentSkeletonCompactContainer2.show();

                            shipmentSkeletonCompactContainer3 = createSkeletonContainerForShipment();
                            listViewContent.append(shipmentSkeletonCompactContainer3);
                            shipmentSkeletonCompactContainer3.show();
                        } else {
                            if (view === 'compact') {
                                skeletonCompactContainer1 = createSkeletonCompactContainer();
                                listViewContent.append(skeletonCompactContainer1);
                                skeletonCompactContainer1.show();
                                skeletonCompactContainer2 = createSkeletonCompactContainer();
                                listViewContent.append(skeletonCompactContainer2);
                                skeletonCompactContainer2.show();
                                skeletonCompactContainer3 = createSkeletonCompactContainer();
                                listViewContent.append(skeletonCompactContainer3);
                                skeletonCompactContainer3.show();
                                skeletonCompactContainer4 = createSkeletonCompactContainer();
                                listViewContent.append(skeletonCompactContainer4);
                                skeletonCompactContainer4.show();
                                skeletonCompactContainer5 = createSkeletonCompactContainer();
                                listViewContent.append(skeletonCompactContainer5);
                                skeletonCompactContainer5.show();
                            } else {
                                skeletonContainer1 = createSkeletonContainer();
                                listViewContent.append(skeletonContainer1);
                                skeletonContainer1.show();
                                skeletonContainer2 = createSkeletonContainer();
                                listViewContent.append(skeletonContainer2);
                                skeletonContainer2.show();
                            }
                        }

                        // Fetch the data
                        dataSource.fetch(function () {
                            const listViewItemsArray = [];

                            if (subFolderFilter === 'Shipments') {
                                shipmentSkeletonCompactContainer1.hide();
                                shipmentSkeletonCompactContainer2.hide();
                                shipmentSkeletonCompactContainer3.hide();
                            } else {
                                if (view === 'list') {
                                    // Hide SkeletonContainer after data is loaded
                                    skeletonContainer1.hide();
                                    skeletonContainer2.hide();
                                }
                                else {
                                    skeletonCompactContainer1.hide();
                                    skeletonCompactContainer2.hide();
                                    skeletonCompactContainer3.hide();
                                    skeletonCompactContainer4.hide();
                                }
                            }
                            listViewContent.empty();

                            updateCount(mailboxCounts);

                            this.view().forEach(function (item) {
                                const subFolder = item.SubFolder;

                                // Update counts
                                counts[subFolder] = (counts[subFolder] ?? 0) + 1;
                                if (subFolderFilter === "All" || item.SubFolder === subFolderFilter) {
                                    listViewItemsArray.push({
                                        listViewContent: listViewContent,
                                        item: item
                                    });

                                    if (subFolderFilter === "All") {
                                        counts["All"]++;
                                    }
                                }

                                if (subFolderFilter !== "All" && item.Folder === filterFolder) {
                                    counts["All"]++;
                                }
                            });

                            // Append list items to the content
                            listViewItemsArray.forEach(item => {
                                appendListItem(item.listViewContent, item.item);
                            });

                            listViewContent.off('scroll').on('scroll', function () {
                                if (listViewContent.scrollTop() + listViewContent.innerHeight() >= listViewContent[0].scrollHeight - 1) {
                                    pageNumber++;

                                    dataSource = getDataSource(
                                        listViewContent.data('kf-list-source'),
                                        kfFolderValue,
                                        selectedSubFolderFilter,
                                        searchParam,
                                        pageNumber,
                                        pageSize
                                    );

                                    dataSource.fetch(function () {
                                        const listViewItemsArray = [];
                                        this.view().forEach(function (item) {
                                            if ((subFolderFilter === "All" || item.SubFolder === subFolderFilter) && item.Folder === kfFolderValue) {
                                                listViewItemsArray.push({
                                                    listViewContent: listViewContent,
                                                    item: item
                                                });
                                            }
                                        });

                                        listViewItemsArray.forEach(item => appendListItem(item.listViewContent, item.item));

                                    });

                                }
                            });

                            // Add a message if no items exist for the current tab
                            const activeTab = getActiveTab();
                            if (activeTab && activeTab.data('name') === subFolderFilter && listViewContent.children().length === 0) {
                                listViewContent.append('<span class="k-no-item-data">There are no mail items in this folder.</span>');
                            }

                            if (this.view().length > 0) {
                                const firstItem = this.view()[0];
                                dataSourceHeader = Object.keys(firstItem).filter(field => !['_events', '_handlers', 'uid', 'parent'].includes(field));
                            }
                        });
                    });

                    setMailboxViewState(viewType);
                }

                function updateCount(mailboxCounts) {

                    let counts = {
                        Inbox: { All: 0, New: 0, Viewed: 0, Pending: 0, ActionRequired: 0, PickupRequested: 0 },
                        Archive: { All: 0, Forwarded: 0, Shipments: 0, ChecksDeposited: 0, PickedUp: 0, Recycled: 0, Shredded: 0 }
                    };

                    Object.keys(mailboxCounts).forEach(function (folder) {
                        if (counts[folder]) {
                            Object.keys(mailboxCounts[folder]).forEach(function (subFolder) {
                                if (counts[folder][subFolder] !== undefined) {
                                    counts[folder][subFolder] = mailboxCounts[folder][subFolder];
                                }
                            });
                        }
                    });
                    updateToolbarItemsCount(counts);
                }

                // Function to create skeleton container
                function createSkeletonContainer() {
                    const skeletonContainer = $('<div class="kf-skeleton-container">');
                    const skeletonListItemContainer = $('<div class="k-listview-item">');
                    const skeletonDetailsInfoContainer = $('<div class="detailsInfoDiv">');
                    const skeletonDetailsSectionContainer = $('<div class="detailsSection">');
                    const skeletonImageSectionContainer = $('<div class="imageSection animationDiv">');
                    const skeletonitemInfoAndButtonsContainer = $('<div class="itemInfoAndButtonsDiv">');
                    const skeletonItemDetailsContainer = $('<div class="itemDetails">');
                    const skeletonItemMailStatusesContainer = $('<div class="itemMailStatusesDiv ">');
                    const skeletonItemTimeStampContainer = $('<div class="itemTimeStamp animationDiv">');
                    const skeletonItemIdContainer = $('<div class="itemId animationDiv">');
                    const skeletonlistViewButtonsContainer = $('<div class="listViewButtons animationDiv">');

                    const itemMailStatusesDivSpan = $('<span class="itemMailStatusSkel animationDiv">');

                    const boltIcon = $('<i></i>');
                    const ellipsisIcon = $('<i></i>');

                    skeletonlistViewButtonsContainer.append(boltIcon, ellipsisIcon);
                    skeletonItemMailStatusesContainer.append(itemMailStatusesDivSpan);
                    skeletonitemInfoAndButtonsContainer.append(skeletonItemIdContainer).append(skeletonlistViewButtonsContainer);
                    skeletonItemDetailsContainer.append(skeletonItemMailStatusesContainer).append(skeletonItemTimeStampContainer);
                    skeletonDetailsSectionContainer.append(skeletonitemInfoAndButtonsContainer);
                    skeletonDetailsSectionContainer.append(skeletonItemDetailsContainer);
                    skeletonDetailsInfoContainer.append(skeletonDetailsSectionContainer);
                    skeletonDetailsInfoContainer.append(skeletonImageSectionContainer);
                    skeletonContainer.append(skeletonListItemContainer.append(skeletonDetailsInfoContainer));

                    return skeletonContainer;
                }
                function createSkeletonCompactContainer() {
                    const skeletonContainer = $('<div class="kf-skeleton-container kf-skeleton-container-compact">');
                    const skeletonListItemContainer = $('<div class="k-listview-item">');
                    const skeletonDetailsInfoContainer = $('<div class="detailsInfoDiv">');
                    const skeletonDetailsSectionContainer = $('<div class="detailsSection">');
                    const skeletonImageSectionContainer = $('<div class="imageContainer"><div class="imageSection animationDiv">');
                    const skeletonitemInfoAndButtonsContainer = $('<div class="itemInfoAndButtonsDiv">');
                    const skeletonItemDetailsContainer = $('<div class="itemDetails">');
                    const skeletonItemMailStatusesContainer = $('<div class="itemMailStatusesDiv animationDiv">');
                    const skeletonItemTimeStampContainer = $('<div class="itemTimeStamp animationDiv">');
                    const skeletonItemIdContainer = $('<div class="itemId animationDiv">');
                    const skeletonlistViewButtonsContainer = $('<div class="listViewButtons animationDiv">');

                    const itemMailStatusesDivSpan = $('<span class="itemMailStatusSkel animationDiv"></i>');

                    const boltIcon = $('<i></i>');
                    const ellipsisIcon = $('<i></i>');

                    skeletonlistViewButtonsContainer.append(boltIcon, ellipsisIcon);
                    skeletonItemMailStatusesContainer.append(itemMailStatusesDivSpan);
                    skeletonitemInfoAndButtonsContainer.append(skeletonItemIdContainer).append(skeletonlistViewButtonsContainer);
                    skeletonItemDetailsContainer.append(skeletonItemMailStatusesContainer).append(skeletonItemTimeStampContainer);
                    skeletonDetailsSectionContainer.append(skeletonitemInfoAndButtonsContainer);
                    skeletonDetailsSectionContainer.append(skeletonItemDetailsContainer);
                    skeletonDetailsInfoContainer.append(skeletonDetailsSectionContainer);
                    skeletonDetailsInfoContainer.append(skeletonImageSectionContainer);
                    skeletonContainer.append(skeletonListItemContainer.append(skeletonDetailsInfoContainer));

                    return skeletonContainer;
                }

                function createSkeletonContainerForShipment() {
                    const shipmentDetailsInfoDiv = $("<div>").addClass('shipmentInfoDiv');
                    const shipmentSpan = $("<span>").addClass('shipmentId');

                    // Div contains the Label and Date
                    const shipmentLabelAndDateDivInfo = $("<div>").addClass('shipmentLabelDateInfoDiv');
                    const forwardCompleteSpan = $("<span>").addClass('forward_label animationDiv');
                    const forwardCompleteDateSpan = $("<span>").addClass('forward_date animationDiv');
                    shipmentLabelAndDateDivInfo.append(forwardCompleteSpan);
                    shipmentLabelAndDateDivInfo.append(forwardCompleteDateSpan);

                    // Div contains the Address and the Number of Mail Items
                    const addressLabelDivInfo = $("<div>").addClass('addressLabelInfoDiv');
                    const addressLabelInfo = $("<span>").addClass('address_label animationDiv');
                    const shipmentBundleInfo = $("<span>").addClass('shipment_bundle animationDiv');
                    const itemNumberInfo = $("<span>").addClass('item_number animationDiv');
                    addressLabelDivInfo.append(addressLabelInfo);
                    addressLabelDivInfo.append(shipmentBundleInfo);
                    addressLabelDivInfo.append(itemNumberInfo);

                    shipmentDetailsInfoDiv.append(shipmentSpan).append(shipmentLabelAndDateDivInfo).append(addressLabelDivInfo);

                    return shipmentDetailsInfoDiv;
                }

                // Array to store checked items
                let checkedItems = [];
                let listInnerItemCount = 0;

                // Function to append list item
                function appendListItem(listViewContent, item) {
                    iconActions = { ...item.IconActions };
                    const values = Object.values(iconActions);
                    if (item.SubFolder === 'Shipments') {
                        appendShipmentListItem(listViewContent, item);
                    }
                    else {
                        //const listItemID = "listItem_" + Math.random().toString(36).substr(2, 9);
                        const listItemID = "listItem_" + listInnerItemCount;
                        let listItem;
                        if (isRightIconClicked) {
                            listItem = $("<div>").addClass("k-listview-item selected-right-icon").attr("id", listItemID).data("itemId", item.Id);
                        } else {
                            listItem = $("<div>").addClass("k-listview-item").attr("id", listItemID).data("itemId", item.Id);
                        }
                        listItem.data("kendoDataItem", item);

                        const hiddenInput = $('<input>').attr({
                            type: "hidden",
                            id: "kf-listview-id",
                            value: item.Id
                        });
                        listItem.append(hiddenInput);

                        const hiddenQuickActions = $('<input>', {
                            type: "hidden",
                            id: "kf-listview-quickActions",
                            "data-quick-actions": item.QuickActions !== null ? item.QuickActions.join(',') : ''
                        });
                        listItem.append(hiddenQuickActions);

                        if (item.ActionRequired) {
                            listItem.addClass("actionRequiredClass");
                        }
                        const detailsInfoDiv = $("<div>").addClass("detailsInfoDiv").attr("id", `detailsInfoDiv_${listInnerItemCount}`);
                        const containerDivImg = $("<div>").addClass("imageContainer").attr("id", `imageContainer_${listInnerItemCount}`);
                        const detailsDivImg = $("<div>").addClass("imageSection").attr("id", `imageSection_${listInnerItemCount}`);
                        const pagerDiv = $("<div>").addClass("pager").attr("id", `pager_${listInnerItemCount}`);
                        if ($('#mailListView').hasClass('kf-listView')) {
                            // If the element with id "mailListView" contains the class "kf-listView"
                            if (item.Image.length > 0) {
                                // Show only the first image
                                const imgDiv = $("<div>").addClass("imageDiv").attr({ "data-role": "page", "id": `imageDiv_${listInnerItemCount}` });
                                $("<img>").attr("src", item.Image[0]).appendTo(imgDiv);
                                detailsDivImg.append(imgDiv);
                            } else {
                                // If no images, add a demo image
                                const demoDivImg = $("<div>").addClass("demo-image").attr("id", `demo-image_${listInnerItemCount}`);;
                                const exclamationIcon = $('<i>').addClass('fa-light fa-triangle-exclamation');
                                demoDivImg.append(exclamationIcon); // Append the icon to the demoDivImg
                                detailsDivImg.append(demoDivImg);
                            }
                        } else {
                            // If the element with id "mailListView" does not contain the class "kf-listView"
                            if (item.Image.length > 0) {
                                // Show all images with a pager
                                item.Image.forEach(imageUrl => {
                                    const imgDiv = $("<div>").addClass("imageDiv").attr({ "data-role": "page", "id": `imageDiv_${listInnerItemCount}` });
                                    $("<img>").attr("src", imageUrl).appendTo(imgDiv);
                                    detailsDivImg.append(imgDiv);
                                });

                                // Add pager if multiple images are present
                                if (item.Image.length > 1) {
                                    const totalImages = item.Image.length;
                                    const pageSpan = $("<span>").addClass("span-pager").text("1 / " + totalImages);
                                    pagerDiv.append(pageSpan);
                                }
                            } else {
                                // If no images, add a demo image
                                const demoDivImg = $("<div>").addClass("demo-image");
                                const exclamationIcon = $('<i>').addClass('fa-light fa-triangle-exclamation');
                                demoDivImg.append(exclamationIcon); // Append the icon to the demoDivImg
                                detailsDivImg.append(demoDivImg);
                            }
                        }

                        const checkBoxDiv = $("<div>").addClass("checkBoxDiv").attr("id", `checkBoxDiv_${listInnerItemCount}`);
                        let checkbox;
                        if (isRightIconClicked) {
                            checkbox = $('<input>').addClass("checkBoxListView").attr("type", "checkbox");
                        } else {
                            checkbox = $('<input>').addClass("checkBoxListView hidden-checkbox").attr("type", "checkbox");
                        }

                        const countSpan = $("<span>").addClass("span-checkBoxDiv");
                        checkBoxDiv.append(checkbox).append(countSpan);

                        if (item.AlertMessage) {
                            const alertMessageDiv = $("<div>", { "class": "alertMessageDiv" });
                            const exclamationIcon = $('<i>').addClass('fa-regular fa-triangle-exclamation');
                            const storageState = item.StorageState;
                            if (storageState.includes('Incurring')) {
                                alertMessageDiv.addClass('incurring');
                            } else {
                                alertMessageDiv.addClass('about-to-incur');
                            }
                            const messageText = item.AlertMessage;
                            const anchorTagRegex = /<a\b[^>]*>.*?<\/a>/g; // Global flag for multiple occurrences
                            const modifiedText = messageText.replace(anchorTagRegex, function (match) {
                                const hrefRegex = /href="([^"]*)"/; // Extract href attribute value
                                const hrefMatch = match.match(hrefRegex);
                                if (hrefMatch && hrefMatch[1]) {
                                    const hrefValue = hrefMatch[1];
                                    return `<a href="${hrefValue}" target="_blank">${match}</a>`;
                                } else {
                                    return match; // If href attribute is not found, return the original match
                                }
                            });

                            // Append the modified text to alertMessageDiv
                            $("<div>").addClass("alertMessageInfoDiv").html(modifiedText).prepend(exclamationIcon).appendTo(alertMessageDiv);

                            detailsInfoDiv.append(alertMessageDiv);
                        }

                        detailsInfoDiv.kendoTouch({
                            enableSwipe: true,
                            swipe: function (e) {
                                const targetListViewItem = $(e.touch.target).closest('.k-listview-item');
                                const drawerContainerExists = targetListViewItem.find(".drawer-container").length > 0;
                                const itemData = targetListViewItem.data("kendoDataItem")

                                if ($(e.touch.target).closest('.kf-listView').length > 0) {
                                    if (e.direction === "left") {
                                        displayQuickActions(targetListViewItem, itemData);
                                    } else if (e.direction === "right" && drawerContainerExists) {
                                        displayQuickActions(targetListViewItem, itemData);
                                    }
                                }
                            }
                        });

                        detailsInfoDiv.append(checkBoxDiv);

                        const detailsDiv = $("<div>").addClass("detailsSection").attr("id", `detailsSection_${listInnerItemCount}`);
                        const itemInfoAndButtonsDiv = $("<div>", { "class": "itemInfoAndButtonsDiv", "id": `itemInfoAndButtonsDiv_${listInnerItemCount}` });
                        const itemIdDiv = $("<div>").addClass("itemId").append(item.ActionRequired ? $("<i>", { "class": "fa-solid fa-period" }) : "").append(item.ItemNumber).appendTo(itemInfoAndButtonsDiv);
                        const activeTabId = $(".k-tabstrip-item.k-active").attr("id");
                        if ((activeTabId === "inbox-tab" || activeTabId === "archive-tab") && item.ActionRequired) {
                            appendPeriodIconIfRequired(activeTabId);
                        }

                        itemIdDiv.after(createListViewButtons(false));
                        itemInfoAndButtonsDiv.appendTo(detailsDiv);

                        const detailsDivInner = $("<div>").addClass("itemDetails").attr("id", `itemDetails_${listInnerItemCount}`);
                        const itemMailStatusesDiv = $("<div>").addClass("itemMailStatusesDiv").attr("id", `itemMailStatusesDiv_${listInnerItemCount}`);

                        item.MailStatus.forEach(status => {
                            const span = $("<span>").addClass("itemMailStatus animationDiv").text(status);
                            itemMailStatusesDiv.append(span);

                            appendStatusForItems(span, status, isShipmentItem = false);
                        });

                        if (item.Folder === "Archive") {
                            itemMailStatusesDiv.addClass("archiveStatus");
                        }

                        itemMailStatusesDiv.appendTo(detailsDivInner);
                        $("<div>").addClass("itemTimeStamp").text(item.ReceivedDate).appendTo(detailsDivInner);

                        const titleDetailDiv = $("<div>").addClass("itemTitleDetail").attr("id", `itemTitleDetail_${listInnerItemCount}`);
                        if (item.Title) {
                            $("<div>").addClass("itemTitle").text(item.Title).appendTo(titleDetailDiv);
                        }

                        detailsDivInner.appendTo(detailsDiv);
                        if (item.Title) {
                            titleDetailDiv.appendTo(detailsDiv);
                        }

                        detailsDiv.appendTo(detailsInfoDiv);
                        detailsDivImg.appendTo(containerDivImg);
                        containerDivImg.append(pagerDiv);
                        containerDivImg.appendTo(detailsInfoDiv);
                        listItem.append(detailsInfoDiv);
                        listViewContent.append(listItem);

                        // Initialize ScrollView for multiple images
                        if (!$('#mailListView').hasClass('kf-listView') && item.Image.length > 1) {
                            listItem.find(".imageSection").kendoScrollView({
                                enablePager: true,
                                contentHeight: "100%",
                                change: function (e) {
                                    const currentPage = e.nextPage + 1;
                                    const totalImages = item.Image.length;
                                    listItem.find(".span-pager").text(currentPage + " / " + totalImages);
                                }
                            });
                        }

                        checkbox.on('change', function () {
                            const itemId = item.Id;
                            if ($(this).is(":checked")) {
                                checkedItems.push(itemId);

                                if (checkedItems.length > 0) {
                                    $(".listViewButtons").hide();
                                }
                            } else {
                                checkedItems = checkedItems.filter(item => item !== itemId);

                                if (checkedItems.length > 0) {
                                    $(".listViewButtons").hide();
                                } else {
                                    $(".listViewButtons").show();
                                }
                            }

                            updateSelectedMailCount(checkedItems.length);
                        });
                        listInnerItemCount++;
                    }
                }

                function appendStatusForItems(span, status, isShipmentItem) {
                    const newStatuses = ["New", "Rates Quoted", "Opened & Scanned", "Pickup Ready"];
                    const completedStatuses = ["Forward Completed", "Deposit Completed", "Pickup Completed", "Recycle Completed", "Shred Completed", "Verified"];

                    if (newStatuses.includes(status)) {
                        span.addClass("inboxStatus");
                    } else if (completedStatuses.includes(status)) {
                        span.addClass("completedStatus");
                    } else if (status === "Unverified") {
                        span.addClass("dangerStatus");
                    }
                }

                function appendShipmentListItem(listViewContent, item) {
                    if (selectedSubFolderFilter === 'Shipments') {
                        const shipmentListItemID = "shipmentListItem_" + listInnerItemCount;
                        const shipmentListItem = $("<div>").addClass("k-listview-item").attr("id", shipmentListItemID).data("itemId", item.Id);
                        shipmentListItem.data("kendoDataItem", item);

                        const hiddenInput = $('<input>').attr({
                            type: "hidden",
                            id: "kf-listview-id",
                            value: item.Id
                        });
                        shipmentListItem.append(hiddenInput);

                        const shipmentDetailsInfoDiv = $("<div>").addClass('shipmentInfoDiv').attr("id", `shipmentInfoDiv_${listInnerItemCount}`);
                        const shipmentSpan = $("<span>").addClass('shipmentId').attr("id", `shipmentId_${listInnerItemCount}`).text(item.ItemNumber);
                        shipmentDetailsInfoDiv.append(shipmentSpan);

                        // Div contains the Label and Date
                        const shipmentLabelAndDateDivInfo = $("<div>").addClass('shipmentLabelDateInfoDiv').attr("id", `shipmentLabelDateInfoDiv_${listInnerItemCount}`);
                        let labelDiv = $("<div>").addClass('labelClass');
                        let forwardCompleteSpan;
                        item.MailStatus.forEach(status => {
                            forwardCompleteSpan = $("<span>").addClass('forward_label').text(status);
                            appendStatusForItems(forwardCompleteSpan, status, true);
                            labelDiv.append(forwardCompleteSpan);
                            //shipmentLabelAndDateDivInfo.append(forwardCompleteSpan);
                        });
                        shipmentLabelAndDateDivInfo.append(labelDiv);
                        const forwardCompleteDateSpan = $("<span>").addClass('forward_date').text(item.ReceivedDate);

                        shipmentLabelAndDateDivInfo.append(forwardCompleteDateSpan);

                        // Div contains the Address and the Number of Mail Items
                        const addressLabelDivInfo = $("<div>").addClass('addressLabelInfoDiv').attr("id", `addressLabelInfoDiv_${listInnerItemCount}`);
                        const addressLabelInfo = $("<span>").addClass('address_label').text(item.ForwardingAddressName);
                        const shipmentBundleInfo = $("<span>").addClass('shipment_bundle').text(item.ShipmentBundleMessage);
                        const itemNumberInfo = $("<span>").addClass('item_number').text(item.TotalCost);
                        addressLabelDivInfo.append(addressLabelInfo);
                        addressLabelDivInfo.append(shipmentBundleInfo);
                        addressLabelDivInfo.append(itemNumberInfo);

                        shipmentDetailsInfoDiv.append(hiddenInput).append(shipmentLabelAndDateDivInfo).append(addressLabelDivInfo);

                        listViewContent.append(shipmentDetailsInfoDiv);

                        // Initialize touch events for swipe actions
                        shipmentDetailsInfoDiv.kendoTouch({
                            enableSwipe: true,
                            swipe: function (e) {
                                const targetListViewItem = $(e.touch.target).closest('.k-listview-item');
                                const drawerContainerExists = targetListViewItem.find(".drawer-container").length > 0;

                                // Retrieve the item data associated with the list view item
                                const itemData = targetListViewItem.data("kendoDataItem");

                                if ($(e.touch.target).closest('.kf-listView').length > 0) {
                                    if (e.direction === "left") {
                                        displayQuickActions(targetListViewItem, itemData);
                                    } else if (e.direction === "right" && drawerContainerExists) {
                                        displayQuickActions(targetListViewItem, itemData);
                                    }
                                }
                            }
                        });

                        listInnerItemCount++;
                    }
                }

                // Function to display quick actions
                displayQuickActions = function (context, item) {
                    const parentListViewContent = context.closest(".k-listview-content");
                    const parentListViewItem = context;
                    var id = context.find("#kf-listview-id").val();
                    const validCancelStatuses = [
                        "Pickup Requested",
                        "Scan Requested",
                        "Deposit Requested",
                        "Shred Requested",
                        "Rates Requested",
                        "Pending Shipment",
                        "Recycle Requested"
                    ];

                    const showCancelAction = Object.values(item.MailStatus).some(status => validCancelStatuses.includes(status));

                    if (parentListViewContent.hasClass("kf-listView") && !parentListViewItem.find(".drawer-container").length > 0) {
                        // Remove existing drawers and classes using the new function
                        removeQuickActionsAndDrawer();

                        // Extract quick actions data
                        const quickActionsData = context.find("#kf-listview-quickActions").data("quick-actions").split(',');
                        if (quickActionsData[0]) {
                            const drawerContainer = $("<div>", { "class": "drawer-container" });

                            // Generate buttons for each quick action
                            quickActionsData.forEach(action => {
                                let iconClass = "";

                                // Determine the icon class based on the action
                                switch (action.trim().toLowerCase()) {
                                    case "find":
                                        iconClass = "fa-folder-magnifying-glass";
                                        break;
                                    case "upload":
                                        iconClass = "fa-square-this-way-up";
                                        break;
                                    case "send":
                                        iconClass = "fa-hand-holding-box";
                                        break;

                                    case "delete":
                                        iconClass = "fa-trash-can";
                                        break;
                                    case "cancel":
                                        if (showCancelAction) {
                                            iconClass = "fa-arrow-left-to-line";
                                        }
                                        break;
                                    default:
                                        break;
                                }

                                // Create button and attach click event
                                if (iconClass) {
                                    const button = $("<button>").html(`<i class="fa-light ${iconClass}"></i>`).on("click", function () {
                                        const kfButtonQuickActionValue = $('.k-listview-content').data("kf-button-quick-action");
                                        if (kfButtonQuickActionValue) {

                                            if (typeof window[kfButtonQuickActionValue] === 'function') {
                                                window[kfButtonQuickActionValue](id, action);
                                            }

                                            // Code to execute after click functionality is done
                                            $("#mailCountContainer").hide().empty();
                                            $('.right-icon').removeClass('active highlight');
                                        }
                                    });
                                    // Append button to drawer container
                                    drawerContainer.append(button);
                                }

                            });

                            parentListViewItem.append(drawerContainer);
                            parentListViewItem.toggleClass('kf-quickActions');
                        }

                        // Calculate drawer width
                        const drawerWidth = parentListViewItem.find(".drawer-container").width();

                        // Adjust margin-left for details info div
                        const detailsInfoDiv = parentListViewItem.find(".detailsInfoDiv");
                        detailsInfoDiv.css("margin-left", "-" + drawerWidth + "px");

                        // Set transition effect for .detailsInfoDiv and .drawer-container
                        $(".detailsInfoDiv, .drawer-container").css("transition", "margin-left 0.2s ease, margin-right 0.2s ease");

                        // Toggle class to initiate the transition
                        parentListViewItem.find(".drawer-container").addClass("visible");

                        // Set the initial margin-right to make the drawer hidden
                        $(".drawer-container").css("margin-right", "-" + drawerWidth + "px");

                        // Adjust margin-right to slide the drawer in
                        $(".drawer-container").css("margin-right", "0");
                    } else if (parentListViewItem.find(".drawer-container").length > 0) {
                        // Remove existing drawers and classes using the new function
                        removeQuickActionsAndDrawer();
                    }
                }

                // Trigger the swipe function wuth Id
                triggerQuickActionsById = function (itemId) {
                    const targetItem = $(`#${itemId}`); // Select the target item by its ID

                    if (targetItem.length === 0) {
                        console.error(`Item with ID "${itemId}" not found!`);
                        return;
                    }

                    const parentListView = targetItem.closest(".kf-listView");
                    if (parentListView.length === 0) {
                        console.error("ListView container not found for the given item!");
                        return;
                    }

                    const itemData = targetItem.data("kendoDataItem"); // Get the associated data item
                    if (!itemData) {
                        console.error(`No data found for item with ID "${itemId}"!`);
                        return;
                    }

                    // Call the displayQuickActions function with the context (target item) and data
                    displayQuickActions(targetItem, itemData);
                }

                // Function to remove quick actions and drawer container
                function removeQuickActionsAndDrawer() {
                    $(".kf-quickActions").removeClass("kf-quickActions");
                    $(".drawer-container").remove();
                    const detailInfoDiv = $(".detailsInfoDiv");
                    detailInfoDiv.css("margin-left", "");
                }

                // Function to update selected mail count
                function updateSelectedMailCount(count) {
                    const countContainerDiv = $('<div class="countContainer">');
                    if (count > 0) {
                        $("#mailCountContainer").show().empty();
                        countContainerDiv.text(count + (count > 1 ? " mails selected" : " mail selected")).appendTo($("#mailCountContainer"));
                    } else {
                        $("#mailCountContainer").hide();
                    }

                    const listViewButtonsHidden = $(".listViewButtons").is(":hidden");
                    const actionContainerDiv = $('<div class="actionContainer">');
                    if (count >= 1 && listViewButtonsHidden) {
                        const selectAllText = createSelectAllText();
                        const deselectAllText = createDeselectAllText();
                        selectAllText.appendTo(actionContainerDiv);
                        deselectAllText.appendTo(actionContainerDiv);
                        actionContainerDiv.appendTo($("#mailCountContainer"));
                        console.log("hideListViewButtonsOnMultiSelectClick - ", hideListViewButtonsOnMultiSelectClick);
                        if (hideListViewButtonsOnMultiSelectClick) {
                            createListViewButtons(true).appendTo(actionContainerDiv);
                        }
                    }
                }

                // Function to update selected mail count
                function createSelectAllText() {
                    return $("<span>")
                        .text("Select All")
                        .addClass("selectAllButton")
                        .on("click", function () {
                            $(".checkBoxListView").prop('checked', true);
                            checkedItems = [];
                            $(".k-listview-item").each(function () {
                                checkedItems.push($(this).data("itemId"));
                            });
                            updateSelectedMailCount(checkedItems.length);
                            $(".selectAllButton").hide();
                            $(".deselectAllButton").show();
                        });
                }

                // Function to create deselect all text
                function createDeselectAllText() {
                    return $("<span>")
                        .text("Deselect All")
                        .addClass("deselectAllButton")
                        .hide()
                        .on("click", function () {
                            $(".checkBoxListView").prop('checked', false);
                            checkedItems = [];
                            updateSelectedMailCount(checkedItems.length);
                            $(".deselectAllButton").hide();
                            $(".selectAllButton").show();
                            $(".listViewButtons").show();
                        });
                }

                // Function to uncheck all checkboxes
                function uncheckAllCheckboxes() {
                    $('.checkBoxListView').prop('checked', false);
                    $('.k-listview-item').toggleClass('selected-right-icon');
                    $(".listViewButtons").show();
                }

                // Function to create list view buttons
                function createListViewButtons(appendingTheMailCount) {
                    const listViewButtons = $("<div>", { "class": "listViewButtons", "id": `listViewButtons_${listInnerItemCount}` });

                    // Create the bolt icon
                    const boltIcon = $("<i>", { "class": "bolt-icon fa-light fa-bolt" }).on("click", function () {

                        const kfButtonBoltValue = $('.k-listview-content').data("kf-button-bolt");
                        if (kfButtonBoltValue) {
                            //console.log("kfButtonBoltValue - ", kfButtonBoltValue);
                            const listItem = $(this).closest(".k-listview-item");
                            let kfListViewId;
                            if (checkedItems.length > 0) {
                                kfListViewId = checkedItems;
                            } else {
                                kfListViewId = listItem.find("#kf-listview-id").val();
                            }

                            if (typeof window[kfButtonBoltValue] === 'function') {
                                window[kfButtonBoltValue](kfListViewId);
                            } else {
                                console.error(`Function ${kfButtonBoltValue} is not defined`);
                            }

                            $("#mailCountContainer").hide().empty();
                            $('.right-icon').removeClass('active highlight');
                            checkedItems = [];

                            $('.k-listview-item').each(function () {
                                if ($(this).hasClass('selected-right-icon')) {
                                    //console.log('Found .selected-right-icon in', this);
                                    uncheckAllCheckboxes();
                                } else {
                                    //console.log('No .selected-right-icon found in', this);
                                }
                            });
                        }
                    });

                    // Create the ellipsis icon
                    const ellipsisIcon = $("<i>", {
                        "class": "ellipsis-icon fa-light fa-ellipsis-vertical"
                    }).on("click", function () {
                        const kfButtonEllipsisValue = $('.k-listview-content').data("kf-button-ellipsis");
                        if (kfButtonEllipsisValue) {
                            const listItem = $(this).closest(".k-listview-item");
                            let kfListViewId;
                            if (checkedItems.length > 0) {
                                kfListViewId = checkedItems;
                            } else {
                                kfListViewId = listItem.find("#kf-listview-id").val();
                            }

                            if (typeof window[kfButtonEllipsisValue] === 'function') {
                                window[kfButtonEllipsisValue](kfListViewId);
                            } else {
                                console.error(`Function ${kfButtonEllipsisValue} is not defined`);
                            }

                            $("#mailCountContainer").hide().empty();
                            $('.right-icon').removeClass('active highlight');
                            checkedItems = [];

                            $('.k-listview-item').each(function () {
                                if ($(this).hasClass('selected-right-icon')) {
                                    //console.log('Found .selected-right-icon in', this);
                                    uncheckAllCheckboxes();
                                } else {
                                    //console.log('No .selected-right-icon found in', this);
                                }
                            });
                        }
                    });

                    let iconValues = Object.values(iconActions);

                    if (iconValues.length > 0) {
                        // Check for specific icons in the array
                        if (iconValues.includes("Bolt") && iconValues.includes("Ellipsis")) {
                            // Append both icons if both are present
                            listViewButtons.append(boltIcon, ellipsisIcon);
                        } else if (iconValues.includes("Bolt")) {
                            // Append only the Bolt icon if present
                            listViewButtons.append(boltIcon);
                        } else if (iconValues.includes("Ellipsis")) {
                            // Append only the Ellipse icon if present
                            listViewButtons.append(ellipsisIcon);
                        }
                    }

                    if (isRightIconClicked && hideListViewButtonsOnMultiSelectClick && appendingTheMailCount) {
                        listViewButtons.append(boltIcon, ellipsisIcon); // Correct casing used for variable names
                    }

                    // Return the list view buttons container
                    return listViewButtons;
                }

                function updateToolbarItemsCount(counts) {
                    // Update counts for both the Inbox and Archive toolbar items
                    updateCountsForToolbar('#toolbarInbox', counts.Inbox);
                    updateCountsForToolbar('#toolbarArchive', counts.Archive);
                }

                // Function to update counts for toolbar
                function updateCountsForToolbar(toolbarId, counts) {
                    $(`${toolbarId} li`).each(function () {
                        const itemName = $(this).data('name').replace(/\s+/g, ''); // Normalize key (remove spaces)
                        const itemId = $(this).attr('id');
                        let count = counts[itemName] ?? 0;
                        const className = `${itemName}-${itemId}-count`;

                        $(this).find('span.count-span').remove();

                        const newSpan = $('<span>')
                            .addClass('count-span')
                            .addClass(className)
                            .text(count);

                        $(this).find('span.k-link').append(newSpan);
                    });
                }

                // Define a variable to store MailboxCounts
                let mailboxCounts = {};

                function getDataSource(endPoint, kfFolderValue, kfSubFolderValue, searchParam, pageNumber, pageSize) {
                    if (typeof endPoint === "string" && endPoint.includes("()")) {
                        var functionName = endPoint.replace("()", "");

                        // Check if the function exists on the window object
                        if (typeof window[functionName] === "function") {
                            return new kendo.data.DataSource({
                                data: window[functionName](),
                                schema: {
                                    data: function (response) {
                                        return response; // Response is the array of mailbox items
                                    },
                                    total: function (response) {
                                        return response.length; // Total number of items
                                    }
                                },
                                error: function (e) {
                                    console.error("Kendo DataSource Error:", e);
                                }
                            });
                        } else {
                            console.error(`Function ${functionName} is not defined`);
                            return;
                        }
                    } else if (endPoint.includes("/")) {
                        // Case when the endPoint is a URL for an API call
                        return new kendo.data.DataSource({
                            transport: {
                                read: {
                                    type: "POST",
                                    url: endPoint,
                                    contentType: "application/x-www-form-urlencoded",
                                    dataType: "json",
                                    data: {
                                        SubFolder: kfSubFolderValue,
                                        Folder: kfFolderValue,
                                        SearchString: searchParam,
                                        PageNumber: pageNumber,
                                        PageSize: pageSize
                                    }
                                }
                            },
                            schema: {
                                data: function (response) {
                                    if (response.MailboxCounts) {
                                        mailboxCounts = response.MailboxCounts;
                                    }

                                    return response.Data || [];
                                },
                                total: function (response) {
                                    return response.TotalCount || 0;
                                }
                            },
                            error: function (e) {
                            }
                        });
                    } else {
                        return new kendo.data.DataSource({ data: JSON.parse(endPoint) });
                    }
                }

                // Function to append period icon if required
                function appendPeriodIconIfRequired(tabId) {
                    const tab = $("#" + tabId);
                    const link = tab.find(".k-link");
                    if (link.children(".fa-period").length === 0) {
                        link.append($("<i>", { "class": "fa-solid fa-period" }));
                    }
                }

                // Function to get the active tab
                function getActiveTab() {
                    // Check if there is an active tab with the Id "inbox-tab"
                    const activeTabInbox = $('#inbox-tab');
                    // Check if there is an active tab with the Id "archive-tab"
                    const activeTabArchive = $('#archive-tab');

                    // Select the active tab based on which one has the "k-active" class
                    if (activeTabInbox.hasClass('k-active')) {
                        return $('.kf-tabstrip-toolbarInbox li.k-active');
                    } else if (activeTabArchive.hasClass('k-active')) {
                        return $('.kf-tabstrip-toolbarArchive li.k-active');
                    }
                }

                // Get the list view content
                let listViewContent = $('.k-listview-content');
                // Get the values of kf-mailbox-sub-folder and kf-mailbox-folder attributes
                kfSubFolderValue = listViewContent.data("kf-mailbox-sub-folder");
                kfFolderValue = listViewContent.data("kf-mailbox-folder");
                // Set initial load to true
                initialLoad = true;

                // If kfSubFolderValue exists, trigger the corresponding tab
                if (kfSubFolderValue) {
                    kfSubFolderValue = kfSubFolderValue.replace(/\s/g, '');
                    triggerTab(kfSubFolderValue);
                } else if (kfFolderValue) {
                    triggerTab(kfFolderValue);
                } else {
                    initializeListViews("All");
                }
            });
        }

        // Make displayQuickActions accessible globally
        window.displayQuickActions = displayQuickActions;;

        // Change View by using this function
        window.changeView = changeView;

        //Hide quick actions on multi select
        window.hideQuickActions = hideQuickActions;

        // Show the Quick actions for the particular item
        window.triggerQuickActionsById = triggerQuickActionsById;
    });

    kungfui.updateDefaultDisplaySettings = updateDefaultDisplaySettings;
    kungfui.updateDataSourceWithSearch = updateDataSourceWithSearch;
    kungfui.changeMailboxView = changeMailboxView;
    kungfui.hideMultiSelectQuickActions = hideMultiSelectQuickActions;
    kungfui.triggerSwipeAction = triggerSwipeAction;

})();
(function () {
    function showNotification(id, content, type, width, top, left, timeout) {
        if (id && id.length > 0) {
            // Find notification element by Id
            let notificationElement = $(`#${id}`);
            // Remove any existing notifications
            $('.k-notification').remove();

            // Extract notification content, type, width, position, and timeout from data attributes
            content = content ? content : notificationElement.data("kf-notification-content");
            // If content is null or empty
            if (!content || content.trim() === '') {
                console.error("Notification content cannot be null or empty.");
            }
            type = type ? type : notificationElement.data("kf-notification-type");
            width = width ? width : notificationElement.data("kf-notification-width");
            top = top ? top : notificationElement.data("kf-notification-top");
            left = left ? left : notificationElement.data("kf-notification-left");
            timeout = timeout ? timeout : notificationElement.data("kf-notification-timeout");

            // Find the parent notification container
            var appendTo = notificationElement.closest('.kf-notification');
            // Initialize the Kendo UI notification widget
            var notificationWidget = notificationElement.kendoNotification({
                animation: false,
                appendTo: appendTo,
                width: width,
                autoHideAfter: timeout,
                hideOnClick: true
            }).data("kendoNotification");

            // Show the notification
            notificationWidget.show(content, type);
            notificationElement.show();
            if (top && left) {
                $('.k-notification').css({ top: top, left: left });
            }
            else if (top) {
                $('.k-notification').css({ top: top });
                $('.k-notification').addClass('horizontal-centered');
            }
            else if (left) {
                $('.k-notification').css({ left: left });
                $('.k-notification').addClass('vertical-centered');
            }
            else {
                $('.k-notification').addClass('k-notification-center');
            }

            // Remove notification icon if type is "processing"
            if (type === "" || type === "processing") {
                notificationElement.find('.k-notification > span').remove();
            }

            // Add 'visible' class to parent notification container if it contains notifications
            var notifications = $('.kf-notification');
            notifications.each(function () {
                var notification = $(this);

                // Check if the notification contains the k-notification class
                if (notification.find('.k-notification').length > 0) {
                    notification.addClass('visible');
                }
            });

            // Hide notification after timeout if specified
            if (timeout) {
                setTimeout(function () {
                    notificationElement.closest('.kf-notification').removeClass('visible');
                }, timeout);
            }

            // Hide notification when clicked
            notificationElement.find('.k-notification').on('click', function () {
                $('.kf-notification').removeClass('visible');
            });
        }
    }

    $(function () {
        if ($('.kf-notification').length > 0) {
            kendo.setDefaults("iconType", "font");

            $('.kf-notification').each(function (index, element) {

            });
        }
    });

    kungfui.showNotification = showNotification;

})();
(function () {
    function initializeNumericTextBoxes() {
        const elements = $('.kf-numeric-textbox').not('.kf-initialized');

        if (elements.length > 0) {
            kendo.setDefaults("iconType", "font");

            elements.each(function (index, element) {
                initializeNumericTextBox($(element));
            });
        }

    }
    // Function to initialize numeric textboxes
    function initializeNumericTextBox(numericTextbox) {
        // Extract data attributes
        const id = numericTextbox.data('kf-numeric-textbox-id');
        const name = numericTextbox.data('kf-numeric-textbox-name');
        const width = numericTextbox.data('kf-numeric-textbox-width');
        const value = numericTextbox.data('kf-numeric-textbox-value').toString();
        const type = numericTextbox.data('kf-numeric-textbox-type').toString();
        const precision = numericTextbox.data('kf-numeric-textbox-precision').toString();
        const label = numericTextbox.data('kf-numeric-textbox-label').toString();
        const floatingLabel = numericTextbox.data('kf-numeric-textbox-floating-label');
        const prefixValue = numericTextbox.data('kf-numeric-textbox-prefix-value');
        const suffixValue = numericTextbox.data('kf-numeric-textbox-suffix-value');
        const subtitle = numericTextbox.data('kf-numeric-textbox-subtitle');
        const maxLengthValue = numericTextbox.data('kf-numeric-textbox-max-length');
        const required = numericTextbox.data('kf-numeric-textbox-required');

        // Create container for numeric textbox
        const numericTextboxItem = $("<div>")
            .addClass("kf-numeric-textbox-item")
            .attr("id", id)
            .data("id", id)
            .appendTo(numericTextbox);

        // Determine input type based on data attribute
        const inputType = type === "integer" ? "number" : "text";

        // Create input element
        const input = $("<input>").attr({
            "id": id,
            "data-kf-name": name || '',
            "value": value,
            "type": inputType,
            "required": required || ''
        }).on('input', function () {
            if (maxLengthValue && $(this).val().length > maxLengthValue) {
                $(this).val($(this).val().slice(0, -1));
            }
        }).appendTo(numericTextboxItem);

        let format;

        // Determine the format based on precision
        if (precision) {
            format = "n" + precision;
        } else if (type === "decimal" && !precision) {
            // If type is decimal and precision is not provided, set format to "n2" by default
            format = "n2";
        }

        // Set options for the numeric textbox
        const numericTextBoxOptions = {
            format: format ? format : 'n0',
            label: {
                content: label,
                floating: floatingLabel
            },
            prefixOptions: prefixValue ? {
                template: () => `<span id='length-units'>${prefixValue}</span>`
            } : undefined,
            suffixOptions: suffixValue ? {
                template: () => `<div class='selected-length-unit' id='selected-unit'>${suffixValue}</div>`
            } : undefined
        };

        numericTextbox.addClass('kf-initialized')
        // Initialize the KendoNumericTextBox
        input.kendoNumericTextBox(numericTextBoxOptions);

        // Set width if provided
        if (width) {
            numericTextboxItem.find('.k-numerictextbox.k-input').css('width', width);
        }

        const floatingLabelContainer = numericTextboxItem.find('.k-input-inner');
        if (floatingLabel && !label) {
            floatingLabelContainer.addClass('has-label');
        } else {
            floatingLabelContainer.removeClass('has-label');
        }

        // Add 'kf-transition' class
        numericTextboxItem.find('.k-numerictextbox.k-input').addClass('kf-transition');

        // Handle input change event
        input.on("change", function () {
            const id = this.id;
            let inputValue = $(this).val();
            const onChangeHandle = $(this).closest('.kf-numeric-textbox').data('kf-numeric-textbox-handle-onchange');

            if (onChangeHandle) {
                const inputFormat = $(this).data("kendoNumericTextBox").options.format;
                const numericTextBox = $(this).data("kendoNumericTextBox");

                inputValue = formatValue(inputValue, inputFormat);
                $('.kf-numeric-textbox-item').find('.k-input-spinner.k-spin-button').remove();
                $(this).val(inputValue);
                numericTextBox.value(inputValue);

                // Call the onchange handler function
                window[onChangeHandle](id, inputValue);
            }
        });

        // Add 'floating-with-prefix' class to label if both floatingLabel and prefix are true
        if (floatingLabel && prefixValue) {
            numericTextboxItem.find('.k-label.k-input-label').addClass('floating-with-prefix');
        }

        // Add subtitle if present
        if (subtitle) {
            $(`<div class='k-form-hint'>${subtitle}</div>`).appendTo(numericTextbox);
        }

        // Remove spinner and label if not using floating label
        numericTextboxItem.find('.k-input-spinner.k-spin-button').remove();

        // Remove class k-input-prefix-horizontal
        $('.k-input-prefix.k-input-prefix-horizontal').removeClass('k-input-prefix-horizontal');

        // Add the class 'floating-label-empty if value is empty and floatingLabel is true
        if (!value && floatingLabel) {
            numericTextboxItem.find('.k-label.k-input-label').addClass('floating-label-empty');
        }

        numericTextboxItem.find('input[data-role="numerictextbox"]').on('input', function () {
            const input = $(this);
            if (input.val().trim() === '') {
                numericTextboxItem.find('.k-label.k-input-label').addClass('floating-label-empty');
            } else {
                numericTextboxItem.find('.k-label.k-input-label').removeClass('floating-label-empty');
            }
        });

        input.on("blur", function () {
            const inputFormat = input.data("kendoNumericTextBox").options.format;
            const numericTextBox = input.data("kendoNumericTextBox");
            const value = input.val();

            // If the value does not contain a decimal point, remove the spinner
            if (!value.includes(".")) {
                $('.kf-numeric-textbox-item').find('.k-input-spinner.k-spin-button').remove();
            }

            // Apply formatting to the value based on the input format
            numericTextBox.value(formatValue(value, inputFormat));
        });
    }

    // Function to format value based on format
    function formatValue(value, format) {
        if (value === '') {
            return null;
        }
        return format === "n0" ? Math.floor(kendo.parseFloat(value)) : kendo.parseFloat(value);
    }

// Function to set value by Id
function setNumericTextBoxValue(id, value) {
    // Check if the input value is empty
    if (value === '') {
        // If empty, set the value to an empty string
        value = '';
    } else {
        // Ensure the value is a string before performing replacement
        if (typeof value === 'number') {
            value = value.toString();
        }
        // Replace the comma with a dot for JavaScript numeric conversion if it contains a comma
        if (value.includes(',')) {
            value = parseFloat(value.replace('.', '').replace(',', '.'));
        } else {
            // If value contains a dot, directly convert it to a number
            value = parseFloat(value);
        }
    }

        if (id && id.length > 0) {
            const numericTextboxElement = $(`#${id}`);
            const inputElement = numericTextboxElement.find('input[type="text"]');
            const type = numericTextboxElement.data('kf-numeric-textbox-type').toString();
            let precisionValue = numericTextboxElement.data('kf-numeric-textbox-precision').toString();

            // Check if input element exists
            if (inputElement.length > 0) {
                let formattedValue = value;

                // Set default precision to 2 if not provided for decimal type
                if (type === 'decimal' && !precisionValue) {
                    precisionValue = '2';
                }

                // Add decimal points if precision value is provided
                if (precisionValue && value !== '') {
                    formattedValue = addDecimalPoints(value, precisionValue);
                }

                // Set the formatted value to the input element
                inputElement.val(formattedValue);

                const floatingLabelContainer = numericTextboxElement.find('[data-role="floatinglabel"]');

                if (formattedValue === '' || formattedValue === null || formattedValue === undefined) {
                    // Remove k-focus and add k-empty classes to indicate the label should be in its original position
                    floatingLabelContainer.removeClass('k-focus').addClass('k-empty');
                } else {
                    // Remove k-empty and add k-focus classes to keep the label floating
                    floatingLabelContainer.removeClass('k-empty').addClass('k-focus');
                }


            }
        }
    }

    // Function to add decimal points to value based on precision and respect culture
    function addDecimalPoints(value, precision) {
        if (value === '') {
            return null;
        }
        if (isNaN(value) || isNaN(precision) || precision <= 0) {
            return value;
        }

        // Convert value to float and round it to the specified precision
        const roundedValue = parseFloat(value).toFixed(precision);

        return roundedValue; // Return the value
    }

    // Function to get value by Id
    function getNumericTextBoxValue(id) {
        const numericTextboxElement = $(`#${id}`);
        const inputElement = numericTextboxElement.find('input[type="text"]');

        if (inputElement.length > 0 && inputElement.val() !== "") {
            const rawValue = inputElement.val();

            // Parse the value using Kendo's culture-aware parsing
            const numericValue = kendo.parseFloat(rawValue);

            if (!isNaN(numericValue)) {
                return numericValue;
            }
        }

        return null; // Return null if value couldn't be parsed as numeric
    }

    // Function to disable textbox
    function disableNumericTextBox(id) {
        if (id && id.length > 0)
            $(`#${id}`).closest('.kf-numeric-textbox').addClass('k-disabled');
    }

    // Function to enable textbox
    function enableNumericTextBox(id) {
        if (id && id.length > 0)
            $(`#${id}`).closest('.kf-numeric-textbox').removeClass('k-disabled');
    }

    $(function () {

        initializeNumericTextBoxes();
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-numeric-textbox').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeNumericTextBoxes();
                        }
                    }
                });
            });
        });

        // Start observing the document body for added elements
        observer.observe(document.body, { childList: true, subtree: true });
    });

    kungfui.enableNumericTextBox = enableNumericTextBox;
    kungfui.disableNumericTextBox = disableNumericTextBox;
    kungfui.getNumericTextBoxValue = getNumericTextBoxValue;
    kungfui.setNumericTextBoxValue = setNumericTextBoxValue;

})();

(function () {
    var popoverIdToTargetIdMap = {};
    var popOverTargets = [];
    var disablePopoverClosing = false;

    function initializePopover() {
        const elements = $('.kf-popover').not('.kf-initialized');
        if (elements.length > 0) {
            elements.each(function () {
                let targetId = $(this).data('kf-popover-target-id');
                let popoverId = $(this).data('kf-popover-id'); // Ensure you have this attribute
                let popoverData = {
                    header: $(this).data('kf-popover-header'),
                    body: $(this).data('kf-popover-body'),
                    offset: $(this).data('kf-popover-offset'),
                    position: $(this).data('kf-popover-position'),
                    showOn: $(this).data('kf-popover-show-on'),
                    onclick: $(this).data('kf-popover-on-click'),
                    onclose: $(this).data('kf-popover-on-close'),
                    width: $(this).data('kf-popover-width'),
                    height: $(this).data('kf-popover-height'),
                    popoverId: popoverId
                };

                if (this.parentElement.className != "inlineUnit") {
                    createPopOver(targetId, popoverData);
                    if (popoverId) {
                        popoverIdToTargetIdMap[popoverId] = targetId;
                    }
                }

                $(this).addClass('kf-initialized');

            });
        }
    }

    function createPopOver(targetId, popoverData) {
        const targetedElement = $(`#${targetId}`);
        //targetedElement.addClass('kf-initialized');
        let { header, body, offset, position, showOn, onclick, onclose, width, popoverId, height } = popoverData;

        if (kungfui.isNullOrWhitespace(onclick)) {
            onclick = "";
        } else {
            onclick = `onclick='${onclick}'`;
        }

        var kendoHeader = `<div class='k-popover-header-div' data-height='${height}' data-width='${width}' data-popover-id='${popoverId}' data-target-id='${targetId}'><label class='k-popover-header-font-style' ${onclick}>${header}</label><button id='hide${popoverId}' class='k-popover-button-border-color k-button k-button-md k-rounded-md k-button-flat k-popover-button-popover-style k-button-flat-base k-icon-button'><span class='k-icon k-font-icon k-i-x k-button-icon'></span></button></div>`;
        var kendoBody = `<div class='k-popover-body-div ${height ? "scrollable_popover" : ""}' ${onclick}>${body}</div>`;

        // Ensure width does not exceed viewport width
        if (width && /^\d+(\.\d+)?%$/.test(width)) {
            width = parseFloat(width) + 'vw';
        }

        let targetOptions = {
            header: kendoHeader,
            body: kendoBody,
            offset: offset,
            position: position,
            showOn: showOn === 'external' ? 'click' : showOn,
            width: width,
            height: height,
        };

        if (showOn === 'external') {
            targetOptions.filter = '6cb9074b-b81c-4cff-b020-8ba1e2dc0505'; // to prevent default click from being triggered
        }
        if (width) {
            targetOptions.width = width;
            $('.k-popover .k-popup').addClass('custom-popover-class');
        }
        if (height) {
            targetOptions.height = height;
        }

        let target = targetedElement.kendoPopover(targetOptions).data('kendoPopover');
        if (target) {
            target.bind('show', function (e) {
                if (target.options.showOn !== 'click')
                    return; // do not change behavior of non-click popovers

                e.sender.wrapper.data("kendoPopup").bind("close", function (e) {
                    if (disablePopoverClosing) {
                        e.preventDefault(); //prevent popup closing
                    }
                });
            });

            popOverTargets.push({
                targetId: targetId,
                popoverId: popoverId,
                target: target
            });

            document.addEventListener('click', function (e) {
                const idOfLabelClicked = e.target.closest(`#hide${popoverId}`);
                $('.k-animation-container').addClass('kf-popover');
                if (idOfLabelClicked) {
                    disablePopoverClosing = false;
                    target.hide();
                    if (!kungfui.isNullOrWhitespace(onclose)) {
                        window[onclose]();
                    }
                } else {
                    disablePopoverClosing = true;
                }
            });

            document.addEventListener('wheel', function () {
                disablePopoverClosing = true;
            });

            document.addEventListener('touchstart', function () {
                disablePopoverClosing = true;
            });
        }
    }

    function showPopOver(targetId) {
        setTimeout(function () {
            var targetedPopup = popOverTargets.find(obj => obj.targetId === targetId);

            if (!targetedPopup) {
                const popoverId = Object.keys(popoverIdToTargetIdMap).find(id => popoverIdToTargetIdMap[id] === targetId);
                if (popoverId) {
                    initializePopoverById(popoverId);
                    targetedPopup = popOverTargets.find(obj => obj.targetId === targetId);
                }
            }

            if (targetedPopup) {
                popOverTargets.forEach(popup => {
                    if (popup.targetId === targetId && popup.popoverId !== targetedPopup.popoverId) {
                        popup.target.hide();
                    }
                });
                targetedPopup.target.show();
            }
        }, 100);
    }

    function showPopOverById(popoverId) {
        setTimeout(function () {
            const targetId = popoverIdToTargetIdMap[popoverId];
            if (!targetId) {
                return;
            }

            let popover = popOverTargets.find(obj => obj.targetId === targetId && obj.popoverId === popoverId);

            if (!popover) {
                initializePopoverById(popoverId);
                popover = popOverTargets.find(obj => obj.targetId === targetId && obj.popoverId === popoverId);
            }

            if (popover) {
                // Hide all other popovers with the same targetId
                popOverTargets.forEach(popup => {
                    if (popup.targetId === targetId && popup.popoverId !== popoverId) {
                        popup.target.hide();
                    }
                });

                // Show the specific popover
                popover.target.show();
            }
        }, 100);
    }

    function hidePopOverById(popoverId) {
        setTimeout(function () {
            const popover = popOverTargets.find(obj => obj.popoverId === popoverId);
            disablePopoverClosing = false;

            if (popover) {
                popover.target.hide();
            }
        }, 100);
    }

    function hidePopOvers() {
        disablePopoverClosing = false;
        for (var popup of popOverTargets) {
            popup.target.hide();
        }
    }

    // Utility function to initialize a popover by target ID
    function initializePopoverById(popoverId) {
        const targetId = popoverIdToTargetIdMap[popoverId];
        if (!targetId) {
            console.warn(`No targetId found for popoverId ${popoverId}`);
            return;
        }

        const popoverElement = $(`.kf-popover[data-kf-popover-id='${popoverId}']`);

        let popoverData = {
            header: popoverElement.data('kf-popover-header'),
            body: popoverElement.data('kf-popover-body'),
            offset: popoverElement.data('kf-popover-offset'),
            position: popoverElement.data('kf-popover-position'),
            showOn: popoverElement.data('kf-popover-show-on'),
            onclick: popoverElement.data('kf-popover-on-click'),
            onclose: popoverElement.data('kf-popover-on-close'),
            width: popoverElement.data('kf-popover-width'),
            height: popoverElement.data('kf-popover-height'),
            popoverId: popoverElement.data('kf-popover-id')
        };
        createPopOver(targetId, popoverData);
    }

    $(function () {

        initializePopover();
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-popover').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializePopover();
                        }
                    }
                });
            });
        });
        // Start observing the document body for added elements
        observer.observe(document.body, { childList: true, subtree: true });
    });

    kungfui.hidePopOvers = hidePopOvers;
    kungfui.hidePopOverById = hidePopOverById;
    kungfui.showPopOverById = showPopOverById;
    kungfui.showPopOver = showPopOver;

})();
(function () {
    function initializeProgressbar() {
        const elements = $('.kf-progressbar').not('.kf-initialized');
        if (elements.length > 0) {
            kendo.setDefaults("iconType", "font");

            elements.each(function (index, element) {
                const progressBar = $(this);

                // Extract data attributes
                const id = progressBar.data('kf-progressbar-id');
                const width = progressBar.data('kf-progressbar-width');
                const value = progressBar.data('kf-progressbar-value');

                // Create progress bar item
                const progressBarItem = $("<div>")
                    .addClass("kf-progressbar-item")
                    .attr("id", id)
                    .data("id", id)
                    .css("width", width);

                // Initialize Kendo UI ProgressBar
                const progressBarInstance = progressBarItem.kendoProgressBar({
                    orientation: "horizontal",
                    min: 0,
                    max: 100, // Default max value, can be adjusted as needed
                    type: "value",
                    animation: false
                }).data("kendoProgressBar");

                progressBar.addClass('kf-initialized');

                // Set the value of the progress bar
                setProgressBarValue(progressBarInstance, value);

                // Append progress bar item to the progress bar container
                progressBarItem.appendTo(progressBar);

                // Hide progress status elements
                hideProgressStatus(progressBar);
            });
        }
    }

    function setProgressBarValue(progressBarInstance, value) {
        // Set the value of the progress bar
        progressBarInstance.value(value);
    }

    function hideProgressStatus(progressBar) {
        // Hide progress status elements
        progressBar.find('.k-progress-status').hide();
    }

    function setProgressBarValueById(id, progressBarValue) {
        if (id && id.length > 0) {
            // Find progress bar element by Id
            let progressBarElement = $(`#${id}`);

            // Find the progress bar item inside the container
            const progressBarItem = progressBarElement.find('.kf-progressbar-item');

            // Retrieve the Kendo UI ProgressBar instance from the progress bar item
            const progressBarInstance = progressBarItem.data("kendoProgressBar");

            // Set the value of the progress bar
            setProgressBarValue(progressBarInstance, progressBarValue);

            // Hide progress status elements
            hideProgressStatus(progressBarElement);
        }
    }

    $(function () {

        initializeProgressbar();
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-progressbar').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeProgressbar();
                        }
                    }
                });
            });
        });

        // Start observing the document body for added elements
        observer.observe(document.body, { childList: true, subtree: true });
    });

    kungfui.setProgressBarValueById = setProgressBarValueById;

})();


(function () {
    function initializeRadiogroup() {
        const elements = $('.kf-radiogroup').not('.kf-initialized');
        if (elements.length > 0) {
            kendo.setDefaults("iconType", "font");

            elements.each(function (index, element) {
                let radioElement = $(this);
                const radioLayout = radioElement.data('kf-radiogroup-layout');
                const radioValue = String(radioElement.data('kf-radiogroup-value'));
                const radioDataSourceName = radioElement.data('kf-radiogroup-source');
                const radioOnChange = radioElement.data('kf-radiogroup-onchange');
                const radioId = radioElement.attr('id');
                const name = radioElement.data('kf-radiogroup-name');
                let radioDataSource;

                if (radioDataSourceName !== '' && radioDataSourceName !== undefined) {
                    if (radioDataSourceName.indexOf('/') !== -1) {
                        $.getJSON(radioDataSourceName, function (data) {
                            var radioItems = [];
                            $.each(data, function (index, item) {
                                radioItems.push({
                                    label: item.text,
                                    value: item.value
                                });
                            });
                            radioDataSource = radioItems;
                            initializeRadioGroup(radioElement, radioDataSource, radioLayout, radioValue, radioOnChange, radioId, name);
                        });
                    } else {
                        radioDataSource = window[radioDataSourceName]();
                        radioDataSource = radioDataSource.map(function (item) {
                            return {
                                label: item.text,
                                value: item.value
                            };
                        });
                        initializeRadioGroup(radioElement, radioDataSource, radioLayout, radioValue, radioOnChange, radioId, name);
                    }
                }
            });

        }
    }

    function initializeRadioGroup(radioElement, radioDataSource, radioLayout, radioValue, radioOnChange, radioId, name) {
        radioElement.kendoRadioGroup({
            items: radioDataSource,
            layout: radioLayout,
            value: radioValue,
            change: function (e) {
                if (radioOnChange) {
                    var selectedValue = e.sender.value();
                    var selectedItem = e.sender._items.find(function (item) {
                        return item.value.toString() === selectedValue;
                    });
                    var selectedLabel = selectedItem.label;
                    window[radioOnChange](selectedLabel, selectedValue);
                }
            }
        }).data("kendoRadioGroup");

        const radioItems = radioElement.find('.k-radio-item input.k-radio');
        radioItems.addClass('kf-transition');
        radioElement.addClass('kf-initialized');
        radioElement.find('.k-radio').attr('data-kf-name', name);
    }

    function enableRadioGroupbyId(id) {
        if (id && id.length > 0) {
            const radioGroup = $(`#${id}`).getKendoRadioGroup();
            radioGroup.enable(true);
        }
    }

    function disableRadioGroupbyId(id) {
        if (id && id.length > 0) {
            const radioGroup = $(`#${id}`).getKendoRadioGroup();
            radioGroup.enable(false);
        }
    }

    function enableRadioGroupbyValue(id, value) {
        if (id && id.length > 0) {
            const radioGroup = $(`#${id}`).getKendoRadioGroup();
            if (radioGroup) {
                const items = radioGroup.items();
                let index = -1;
                items.each(function (i) {
                    if ($(this).val() === value.toString()) {
                        index = i;
                        return false;
                    }
                });
                if (index !== -1) {
                    radioGroup.enableItem(true, index);
                }
            }
        }
    }

    function disableRadioGroupbyValue(id, value) {
        if (id && id.length > 0) {
            const radioGroup = $(`#${id}`).getKendoRadioGroup();
            if (radioGroup) {
                const items = radioGroup.items();
                let index = -1;
                items.each(function (i) {
                    if ($(this).val() === value.toString()) {
                        index = i;
                        return false;
                    }
                });

                if (index !== -1) {
                    radioGroup.enableItem(false, index);
                }
            }
        }
    }

    function setRadioGroupValue(id, value) {
        if (id && id.length > 0) {
            const radioGroup = $(`#${id}`).getKendoRadioGroup();
            if (radioGroup) {
                const isValueInItems = radioGroup._items.some(item => item.value.toString() === value.toString());
                if (isValueInItems) {
                    radioGroup.value(value);
                }
                else {
                    radioGroup.value(null);
                }
            }
        }
    }

    function getRadioGroupValue(id) {
        if (id && id.length > 0) {
            const radioGroup = $(`#${id}`).getKendoRadioGroup();
            const value = radioGroup.value();
            let text = null;
            if (value) {

                const selectedItem = radioGroup._items.find(function (item) {
                    return item.value.toString() === value.toString();
                });
                if (selectedItem) {
                    text = selectedItem.label;
                }
                return { value: value, text: text };
            }
        }
    }

    $(function () {

        initializeRadiogroup();
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-radiogroup').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeRadiogroup();
                        }
                    }
                });
            });
        });

        // Start observing the document body for added elements
        observer.observe(document.body, { childList: true, subtree: true });
    });

    kungfui.getRadioGroupValue = getRadioGroupValue;
    kungfui.setRadioGroupValue = setRadioGroupValue;
    kungfui.disableRadioGroupbyValue = disableRadioGroupbyValue;
    kungfui.enableRadioGroupbyValue = enableRadioGroupbyValue;
    kungfui.disableRadioGroupbyId = disableRadioGroupbyId;
    kungfui.enableRadioGroupbyId = enableRadioGroupbyId;

})();






(function () {
    window.addEventListener('load', function () {
        setTimeout(function () {
            document.body.style.display = 'block';

            const headerExists = $('header').length > 0;
            const footerExists = $('footer').length > 0;

            let headerHeight = 0;
            let footerHeight = 0;
            const mainViewUl = $('ul.main-view');

            if (headerExists) {
                headerHeight = $('header').outerHeight();
            }
            else {
                mainViewUl.addClass('kf-noHeader');
            }

            if (footerExists) {
                footerHeight = $('footer').outerHeight();
            } else {
                mainViewUl.addClass('kf-noFooter');
            }

            let totalHeight = $(window).height();
            let mainContainer = $('.kf-main-container');

            if (mainContainer.length > 0) {
                mainContainer.css('height', totalHeight - headerHeight - footerHeight);
            }

            if (footerExists) {
                function adjustSubmenuPosition() {
                    let footerHeight = $('footer.border-top.footer.text-muted').outerHeight();
                    $('.k-drawer-items .submenu-btn').css('bottom', footerHeight + 'px');
                }

                adjustSubmenuPosition();
                $(window).resize(adjustSubmenuPosition);
            }
            const $selectedChildItem = $('.k-drawer-item.child.k-selected');
            if ($selectedChildItem.length > 0) {
                const childWidth = $selectedChildItem.data('width');
                if (childWidth) {
                    $('.k-drawer-container').css('width', childWidth);
                }
            }
            if (document.querySelector('body .kf-main-container')) {
                document.body.style.marginBottom = '0';
            }
        }, 10);
    });

    function initializeKendoDrawer(element, data) {
        const drawerContainers = $('.k-drawer-container');
        const containerLength = drawerContainers.length;
        if (containerLength === 0) {
            let template = generateMenu(data);

            $(element).kendoDrawer({
                template: template,
                mode: 'push',
                mini: true,
                itemClick: function (e) {
                    const $clickedItem = $(e.item).closest('li');
                    const clickedAction = $clickedItem.find(".k-item-text").data("kf-item-action") || $clickedItem.find(".k-item-text").data("kf-subitem-action");
                    const currentAction = window.location.pathname;

                    if (clickedAction === currentAction && $clickedItem.length == 1) {
                        if ($clickedItem.hasClass('child')) {
                            const parentID = $clickedItem.find(".k-item-text").data("parent-id");
                            const $sideNavigation = $clickedItem.closest('.kf-sidenavigation');
                            const $parentItem = $sideNavigation.find('.parent').filter(function () {
                                return $(this).find('.k-item-text').data('id') === parentID;
                            });
                            $parentItem.addClass('k-selected');
                        }

                        if ($clickedItem.hasClass('child')) {
                            const childWidth = $clickedItem.data('width');
                            if (childWidth !== null && childWidth !== undefined) {
                                $('.k-drawer-container').css('width', childWidth);
                            }
                        }
                        return;
                    }

                    let parentId = null;
                    let childParentId = null;

                    if (!$clickedItem.hasClass('submenu-btn') && $clickedItem.length == 1) {
                        let clickedItemId = $clickedItem.find(".k-item-text").data("id");

                        if ($clickedItem.hasClass('parent')) {
                            parentId = clickedItemId;
                        } else if ($clickedItem.hasClass('child')) {
                            parentId = $clickedItem.find('.k-item-text').data('parent-id');
                            childParentId = clickedItemId;
                        }
                        activateSideNavigation(parentId, childParentId);
                    }
                    else {
                        $('.k-drawer-item').removeClass('k-selected');
                        activateSideNavMenu()
                    }

                },
                position: 'left',
                swipeToOpen: false,
                autoCollapse: false,
            });

            initializeMenuTooltips(element);

            $('.main-view').on('click', '#subMenuButton', function (event) {
                event.stopPropagation();
                $(".sub-view").toggle();
                const $menuButtonIcon = $(this).find("i");
                if ($menuButtonIcon.hasClass("fa-chevron-left")) {
                    $menuButtonIcon.removeClass("fa-chevron-left").addClass("fa-chevron-right");
                    $('.k-drawer-container').css('width', '');
                } else {
                    $menuButtonIcon.removeClass("fa-chevron-right").addClass("fa-chevron-left");
                    const $selectedChildItem = $('.k-drawer-item.child.k-selected');
                    if ($selectedChildItem.length > 0) {
                        const childWidth = $selectedChildItem.data('width');
                        if (childWidth) {
                            $('.k-drawer-container').css('width', childWidth);
                        }
                    }
                }
            });
            $('.main-view').on('mousedown', '#subMenuButton', function (event) {
                event.stopPropagation();
                event.preventDefault();
            });
            $('.main-view').on('dblclick', '.parent', function (event) {
                event.stopPropagation();
            });

        }
    }

    function activateSideNavigation(parentId, childParentId) {
        let action;

        if (!childParentId) {
            const $subItems = $(`.sub-view .child .k-item-text[data-parent-id="${parentId}"]`);

            if ($subItems.length > 0) {
                action = $subItems.first().data('kf-subitem-action');
            } else {
                action = $(`.parent .k-item-text[data-id="${parentId}"]`).data("kf-item-action");
            }
        } else {
            action = $(`.child .k-item-text[data-id="${childParentId}"]`).data('kf-subitem-action');
        }

        if (action) {
            navigateTo(action);
            return;
        }
    }

    function generateMenu(menuItems) {
        let mainMenuHtml = `<ul class='main-view'>`;
        let subMenuHtml = "<ul class='sub-view' style='display: none; padding-left:72px;'>";

        menuItems.forEach(item => {
            const menuItemHtml = `<li class='parent' data-role='drawer-item' data-tooltip="${item.tooltip || ''}"> 
            <span class='k-icon ${item.icon}'></span>
            <span class='k-item-text' data-id='${item.id}' data-kf-item-action='${item.action}'></span>
        </li>`;
            if (item.subItems && item.subItems.length > 0) {
                item.subItems.forEach(subItem => {
                    let subMenuItemHtml;
                    let widthStyle = '';
                    if (item.width !== null && item.width !== undefined) {
                        if (item.width.endsWith('%')) {
                            let widthValue = parseFloat(item.width);
                            if (!isNaN(widthValue) && widthValue > 50) {
                                widthStyle = '50%';
                            } else {
                                widthStyle = item.width;
                            }
                        } else {
                            widthStyle = item.width;
                        }
                    }
                    if (subItem.icon) {
                        subMenuItemHtml = `<li class='child' data-role='drawer-item' data-width='${widthStyle}' data-tooltip="${subItem.tooltip || ''}"> 
                        <span class='k-icon ${subItem.icon}'></span>
                        <span class='k-item-text' data-parent-id='${item.id}' data-id='${subItem.id}' data-kf-subitem-action='${subItem.action}'></span>
                    </li>`;
                    } else {
                        subMenuItemHtml = `<li class='child' data-role='drawer-item' data-width='${widthStyle}'>${subItem.text}
                        <span class='k-item-text' data-parent-id='${item.id}' data-id='${subItem.id}' data-kf-subitem-action='${subItem.action}'></span>
                    </li>`;
                    }
                    subMenuHtml += subMenuItemHtml;
                });
                mainMenuHtml += menuItemHtml;
            } else {
                mainMenuHtml += menuItemHtml;
            }

        });
        subMenuHtml += "</ul>";
        mainMenuHtml += "</ul>";
        return mainMenuHtml + subMenuHtml;
    }

    function activateSideNavMenu() {
        const $mainView = $('.main-view');
        const $subView = $('.sub-view');
        const redirectUri = window.location.href.replace(/^https?:\/\/[^\/]+/, '');

        let mainItemId = null;
        let subItemId = null;

        const $mainItemSpan = $mainView.find(`span[data-kf-item-action="${redirectUri}"]`);
        const $subItemSpan = $subView.find(`span[data-kf-subitem-action="${redirectUri}"]`);

        if ($mainItemSpan.length) {
            mainItemId = $mainItemSpan.data('id');
        } else if ($subItemSpan.length) {
            subItemId = $subItemSpan.data('id');
            mainItemId = $subItemSpan.data('parent-id');
        }

        if (mainItemId) {
            const $mainItem = $mainView.find(`span[data-id="${mainItemId}"]`).closest('li');
            $mainView.find('li').removeClass('k-selected');
            $mainItem.addClass('k-selected');

            if (subItemId) {
                if (!$mainView.find('.submenu-btn').length) {
                    $('<li>', {
                        id: 'subMenuButton',
                        'data-role': 'drawer-item',
                        class: 'submenu-btn k-drawer-item',
                        role: 'menuitem',
                        'aria-label': ''
                    }).append($('<i>', { class: 'fa-solid fa-chevron-left' })).appendTo($mainView);
                }
                $mainView.find('.submenu-btn').show();

                $subView.find('.child').each(function () {
                    const $childLi = $(this);
                    $childLi.toggle($childLi.find('.k-item-text').data('parent-id') === mainItemId);
                });

                const $subItem = $subView.find(`span[data-id="${subItemId}"]`).closest('li');
                $subView.find('li').removeClass('k-selected');
                $subItem.addClass('k-selected');

                $subView.show();
            } else {
                $subView.hide();
                $mainView.find('.submenu-btn').hide();
            }
        } else {
            $subView.hide();
        }
    }

    function navigateTo(action) {
        window.location.href = action;
    }

    $(window).resize(function () {
        const headerExists = $('header').length > 0;
        const footerExists = $('footer').length > 0;

        let headerHeight = 0;
        let footerHeight = 0;

        if (headerExists) {
            headerHeight = $('header').outerHeight();
        }

        if (footerExists) {
            footerHeight = $('footer').outerHeight();
        }

        let totalHeight = $(window).height();
        let mainContainer = $('.kf-main-container');

        if (mainContainer.length > 0) {
            mainContainer.css('height', totalHeight - headerHeight - footerHeight);
        }

        if (footerExists) {
            let footerHeight = $('footer.border-top.footer.text-muted').outerHeight();
            $('.k-drawer-items .submenu-btn').css('bottom', footerHeight + 'px');
        }
    });

    $(function () {
        if ($('.kf-sidenavigation').length > 0) {
            $('.kf-sidenavigation').each(function (index, element) {
                let sideNavigationElement = element;
                let jsonDataString = $(sideNavigationElement).attr('kf-json-data');
                let jsonData = JSON.parse(jsonDataString);

                const dynamicArray = jsonData.map(item => ({
                    id: item.id,
                    icon: item.icon,
                    tooltip: item.tooltip,
                    action: item.action,
                    width: item.width,
                    subItems: item.subItems?.map(subItem => ({
                        id: subItem.id,
                        icon: subItem.icon,
                        text: subItem.text,
                        tooltip: item.tooltip,
                        action: subItem.action,
                    }))
                }));
                initializeKendoDrawer(element, dynamicArray);
                activateSideNavMenu();
            });
        }
    });

    function initializeMenuTooltips(menu) {
        $(menu).find("li.k-drawer-item").each((i, el) => {
            let text = $(el).data('tooltip')?.trim();
            if (!text)
                return;

            $(el).kendoTooltip({
                showOn: "mouseenter",
                hideOn: "mouseleave",
                position: "right",
                offset: -12,
                content: function (e) {
                    let text = $(el).data('tooltip').trim();
                    return text;
                }
            })
        })
    }

})();
(function () {
    function initializeSwitch() {
        const elements = $('.kf-switch').not('.kf-initialized');
        if (elements.length > 0) {
            kendo.setDefaults("iconType", "font");

            elements.each(function (index, element) {

                let switchElement = $(this);
                const id = switchElement.data('kf-id');
                const switchLabel = switchElement.data('kf-switch-label');
                const switchValue = switchElement.data('kf-switch-value');
                const switchSize = switchElement.data('kf-switch-size');
                const switchDisabled = switchElement.data('kf-switch-disabled');
                const onChange = switchElement.data('kf-switch-onchange');

                let existingswitch = switchElement.find('.k-switch');
                if (existingswitch.length > 0) {
                    existingswitch.remove();
                }

                const switchItemDiv = $("<div>").addClass("kf-switch-item");
                switchElement.addClass('kf-initialized');
                switchElement.append(switchItemDiv);

                switchItemDiv.kendoSwitch({
                    size: switchSize ? switchSize.toLowerCase() : 'medium',
                    isChecked: switchValue.toLowerCase() === 'true',
                    change: function (e) {
                        if (onChange) {
                            window[onChange](id, e.checked);
                        }
                    }
                });

                // Create and append the label element after the switch item div
                if (switchLabel) {
                    const labelElement = $("<label>").addClass("kf-switch-label").text(switchLabel);
                    switchElement.find('.k-switch').after(labelElement);
                }

                if (switchDisabled.toString().toLowerCase() === 'true') {
                    switchElement.addClass('k-disabled');
                }

                if (switchValue !== undefined && switchValue !== null) {
                    if (switchValue.toString().toLowerCase() === 'true') {
                        switchItemDiv.data('kendoSwitch').value(true);
                    } else {
                        switchItemDiv.data('kendoSwitch').value(false);
                    }
                }
            });
        }
    }

    function getSwitchValue(id) {
        let switchInstance = $(`#${id}`);
        const spanElement = switchInstance.find('.kf-switch-item');
        if (spanElement.hasClass('k-switch-off')) {
            return false;
        } else {
            return true;
        }
    }

    function enableSwitch(id) {
        if (id && id.length > 0) {
            let switchInstance = $(`#${id}`);
            if (switchInstance.hasClass('k-disabled')) {
                switchInstance.removeClass('k-disabled');
            }
        }
    }

    function disableSwitch(id) {
        if (id && id.length > 0) {
            let switchInstance = $(`#${id}`);
            switchInstance.addClass('k-disabled');
        }
    }

    function setSwitchValue(id, value) {
        if (id && id.length > 0) {
            let switchElement = $(`#${id}`);
            if (switchElement.length > 0) {
                let switchItem = switchElement.find('.kf-switch-item');
                if (value) {
                    switchItem.removeClass('k-switch-off').addClass('k-switch-on');
                } else {
                    switchItem.removeClass('k-switch-on').addClass('k-switch-off');
                }
            }
        }
    }

    $(function () {

        initializeSwitch();
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-switch').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeSwitch();
                        }
                    }
                });
            });
        });

        // Start observing the document body for added elements
        observer.observe(document.body, { childList: true, subtree: true });
    });

    kungfui.getSwitchValue = getSwitchValue;
    kungfui.enableSwitch = enableSwitch;
    kungfui.disableSwitch = disableSwitch;
    kungfui.setSwitchValue = setSwitchValue;

})();




(function () {
    // Function to initialize tabstrip
    function initializeTabstrip(tabstrip) {
        // Find all tab elements within the tabstrip
        const tabs = tabstrip.find('.kf-tabstrip-tab');
        const defaultTab = tabstrip.data('kf-tabstrip-default-tab-index');
        const dataSources = [];

        // Loop through each tab
        tabs.each(function (index, element) {
            const tabElement = $(element);
            tabElement.addClass('kf-transition');
            // Get tab information
            const id = tabElement.data('kf-tabstrip-tab-id');
            const source = tabElement.data('kf-tabstrip-tab-content-source');
            const onChange = tabElement.data('kf-tabstrip-tab-on-change');

            dataSources.push({ id: id, source: source, onChange: onChange});
        });

        // Create the tabstrip
        createTabStrip(dataSources, tabstrip);

        // Trigger the click event for the first tab after all tabs are created
        let tabIndex = parseInt(defaultTab);
        const tabArray = tabstrip.find('.kf-tabstrip-tabs li');
        if ((!isNaN(tabIndex) && tabIndex >= 0) && tabIndex <= tabArray.length) {
            const tabDefault = tabArray[tabIndex];
            tabDefault.click();
        }
        
    }

    // Function to create tabstrip
    function createTabStrip(fetchedData, tabstrip) {
        // Determine tabstrip type
        const isPrimaryTabstrip = tabstrip.data('kf-tabstrip-type') === 'Primary';
        const tabstripElement = tabstrip.find('.kf-tabstrip-tabs');
        const tabListElement = $('<ul>');
        const ulId = tabstrip.data('kf-tabstrip-id');
        tabListElement.addClass(`kf-tabstrip-${ulId}`);
        tabstrip.css({
            'max-width': tabstrip.data('kf-tabstrip-width')
        });

        // Create tab list element
        let tabstripListElement;
        if (!isPrimaryTabstrip) {
            tabstripListElement = $('<div>').addClass('kf-tabstrip-list');
            tabstrip.append(tabstripListElement);
            tabstripListElement.append(tabListElement);
        } else {
            tabstripElement.append(tabListElement);
        }

        // Loop through fetched data to create tabs
        fetchedData.forEach(folder => {
            const id = folder.id;
            const onClick = folder.onChange;
            const li = $('<li>').attr({ "id": id, "data-on-click": onClick }).appendTo(tabListElement);
            const contentUrl = folder.source;

            // Handle tab click event
            li.on('click', function () {
                // Remove existing tab content
                tabstrip.find('.kf-tabstrip-content').remove();
                $.get(contentUrl, function (data) {
                    const $tabContent = $(data);
                    initializeTabstrip($tabContent);
                    // Create new content container
                    const tabContentContainer = $('<div>').addClass('kf-tabstrip-content');
                    tabContentContainer.append($tabContent);
                    // Append the new content container
                    tabstrip.append(tabContentContainer);
                    // Set the max-height for the content container
                    tabContentContainer.css({
                        'max-height': tabstrip.data('kf-tabstrip-height')
                    });
                });
            });
        });

        // Initialize tabstrip
        tabListElement.kendoTabStrip({
            animation: { open: { effects: 'fadeIn' } }
        });

        // Attach tabs to their respective list items
        const tabs = tabstrip.find('.kf-tabstrip-tab');
        tabs.each(function (index, element) {
            const tabElement = $(element);
            const tabId = tabElement.attr('id');
            const tabLi = tabstrip.find(`li#${tabId}`);

            tabLi.append('<span unselectable="on" class="k-link">').find('.k-link').append(tabElement);
        });

        if (!isPrimaryTabstrip) {
            const tabLink = tabstrip.find('.k-tabstrip-item .k-link');
            tabLink.addClass('kf-transition');
        }

        // Set first tab as active if none are specified
        if (!tabstrip.find('.kf-tabstrip-tabs .k-tabstrip-item.k-active').length) {
            const firstTabs = tabstrip.find(isPrimaryTabstrip ? '.kf-tabstrip-tabs .k-tabstrip-item:first' : '.kf-tabstrip-list .k-tabstrip-item:first');
            firstTabs.addClass('k-active');
        }

        // Handle click events on tabs
        tabstrip.on('click', 'li[data-on-click]', function () {
            const onClickFunction = $(this).data('on-click');
            if (onClickFunction && typeof window[onClickFunction] === 'function') {
                window[onClickFunction]($(this).attr('id'));
            }
        });

        // Handle dragging and scrolling
        handleDraggingAndScrolling($(`.kf-tabstrip-${ulId}`));
    }

    // Function to show a tabstrip
    function showTabStripTab(tabstripId, tabId) {
        // Get the tabstrip element
        var tabstrip = $("#" + tabstripId);

        // Find the tab element with the specified ID
        var tab = tabstrip.find("#" + tabId);

        // Show the tab
        tab.show();
    }

    // Function to hide a tabstrip
    function hideTabStripTab(tabstripId, tabId) {
        // Get the tabstrip element
        var tabstrip = $("#" + tabstripId);

        // Find the tab element with the specified ID
        var tab = tabstrip.find("#" + tabId);

        // Hide the tab
        tab.hide();
    }

    // Function to disable a tab in the tabstrip
    function disableTabStripTab(tabstripId, tabId) {
        var tabstrip = document.getElementById(tabstripId);
        if (tabstrip) {
            var tabToDisable = tabstrip.querySelector('#' + tabId);
            if (tabToDisable) {
                tabToDisable.setAttribute('aria-disabled', 'true');
                tabToDisable.classList.add('k-disabled');
            }
        }
    }

    // Function to enable a tab in the tabstrip
    function enableTabStripTab(tabstripId, tabId) {
        var tabstrip = document.getElementById(tabstripId);
        if (tabstrip) {
            var tabToEnable = tabstrip.querySelector('#' + tabId);
            if (tabToEnable) {
                tabToEnable.removeAttribute('aria-disabled');
                tabToEnable.classList.remove('k-disabled');
            }
        }
    }

    function setTabStripTabActive(tabstripId, tabId) {
        const tabstrip = document.getElementById(tabstripId);
        if (tabstrip) {
            const tabToActivate = tabstrip.querySelector('#' + tabId);
            if (tabToActivate) {
                // Remove 'k-active' class from all tabs
                const tabs = tabstrip.querySelectorAll('.k-tabstrip-item');
                tabs.forEach(function (tab) {
                    tab.classList.remove('k-active');
                });

                // Add 'k-active' class to the specified tab
                tabToActivate.classList.add('k-active');

                // Set 'aria-selected' attribute to true for the specified tab
                tabToActivate.setAttribute('aria-selected', 'true');
                // Trigger click event on the specified tab
                tabToActivate.click();
            }
        }
    }

    // Handle dragging and scrolling
    let isDragging = false;
    let startX, startY;

    // Function to handle dragging and scrolling
    function handleDraggingAndScrolling($element) {
        // Mousedown event for desktop
        $element.on("mousedown", function (event) {
            isDragging = true;

            startX = event.pageX;
            startY = event.pageY;

            event.preventDefault(); // Prevents text selection while dragging
        });

        // Touchstart event for mobile
        $element.on("touchstart", function (event) {
            isDragging = true;

            startX = event.touches[0].pageX;
            startY = event.touches[0].pageY;
        });

        // Mousemove event for desktop
        $element.on("mousemove", function (event) {
            if (isDragging) {
                var deltaX = event.pageX - startX;
                var deltaY = event.pageY - startY;

                $element.scrollLeft($element.scrollLeft() - deltaX);
                $element.scrollTop($element.scrollTop() - deltaY);

                startX = event.pageX;
                startY = event.pageY;
            }
        });

        // Touchmove event for mobile
        $element.on("touchmove", function (event) {
            if (isDragging) {
                var deltaX = event.touches[0].pageX - startX;
                var deltaY = event.touches[0].pageY - startY;

                $element.scrollLeft($element.scrollLeft() - deltaX);
                $element.scrollTop($element.scrollTop() - deltaY);

                startX = event.touches[0].pageX;
                startY = event.touches[0].pageY;
                event.preventDefault(); // Prevents default touch behavior
            }
        });

        // Mouseup event for desktop
        $(document).on("mouseup", function () {
            isDragging = false;
        });

        // Touchend event for mobile
        $(document).on("touchend", function () {
            isDragging = false;
        });

        // Wheel event
        $element.on("wheel", function (event) {
            scrollTabs(event, $element);
            event.preventDefault(); // Prevents scrolling of the whole page
        });

        // Add touchmove event to set isDragging to true
        $element.on("touchmove", function () {
            isDragging = true;
        });
    }

    // Scroll tabs function
    function scrollTabs(event, $element) {
        var delta = event.originalEvent.deltaY || event.originalEvent.detail || event.originalEvent.wheelDelta;
        $element.scrollLeft($element.scrollLeft() + delta);
        event.preventDefault();
    }

    $(function () {
        if ($('.kf-tabstrip').length > 0) {
            kendo.setDefaults("iconType", "font");

            $('.kf-tabstrip').each(function (index, element) {
                initializeTabstrip($(element));
            });
        }
    });

    kungfui.showTabStripTab = showTabStripTab;
    kungfui.hideTabStripTab = hideTabStripTab;
    kungfui.disableTabStripTab = disableTabStripTab;
    kungfui.enableTabStripTab = enableTabStripTab;
    kungfui.setTabStripTabActive = setTabStripTabActive;

})();
(function () {
    function initializeTextarea() {
        const elements = $('.kf-textarea').not('.kf-initialized');
        if (elements.length > 0) {
            kendo.setDefaults("iconType", "font");

            elements.each(function (index, element) {
                initializeTextArea($(element));
            });
        }
    }

    // Initialize each .kf-textarea element
    function initializeTextArea(textAreaElement) {
        // Get data attributes
        const id = textAreaElement.data('kf-textarea-id');
        const value = textAreaElement.data('kf-textarea-value').toString();
        const label = textAreaElement.data('kf-textarea-label').toString();
        const subtitle = textAreaElement.data('kf-textarea-sub-title').toString();
        const floatingLabel = textAreaElement.data('kf-textarea-floating-label');
        const width = textAreaElement.data('kf-textarea-width');
        const maxLength = textAreaElement.data('kf-textarea-max-length');
        const onChangeMethod = textAreaElement.data('kf-textarea-onchange');
        const lineHeight = textAreaElement.data('kf-textarea-line-height');
        const name = textAreaElement.data('kf-textarea-name');
        let required = textAreaElement.data('kf-textarea-required');
        // Create textarea element and append to .kf-textarea element
        const textarea = $("<textarea>").attr({
            "id": id,
            "data-kf-name": name ? name : "",
        }).appendTo(textAreaElement);

        // Configure kendoTextArea options
        const textAreaOptions = {
            label: {
                content: label,
                floating: floatingLabel
            },
            "value": value,
            rows: lineHeight,
            change: function (e) {
                const newValue = e.sender.value();
                // Call onchange method if defined
                if (onChangeMethod) {
                    window[onChangeMethod](id, newValue);
                }
            }
        };

        // Initialize kendoTextArea
        textarea.kendoTextArea(textAreaOptions);

        // Add transition class to input
        textAreaElement.find('.k-input.k-textarea').addClass('kf-transition');
        textAreaElement.css('width', width);

        // Append character count wrapper
        const initial_length = value.length;
        textAreaElement.append(`<div class="k-textarea-char-count-wrapper"><span class="k-textarea-char-count">${initial_length} / ${maxLength}</span></div>`);
        // Add subtitle if present
        if (subtitle) {
            // Create the subtitle element
            const subtitleElement = $(`<div class='k-form-hint'>${subtitle}</div>`);
            subtitleElement.insertBefore(textAreaElement.find('.k-textarea-char-count'));
        }

        // Update character count on input
        const updateCharCount = () => {
            let currentLength = textarea.val().length;
            if (currentLength > maxLength) {
                textarea.val(textarea.val().substring(0, maxLength));
                currentLength = maxLength;
            }
            textAreaElement.find('.k-textarea-char-count').text(`${currentLength} / ${maxLength}`);
        };
        textarea.on('input', updateCharCount);
        updateCharCount();

        //textAreaElement.find('.k-label.k-input-label').addClass('k-textarea');
        textAreaElement.find('.k-label.k-input-label').removeClass('k-label k-input-label').addClass('k-textarea k-label k-input-label');

        const floatingLabelContainer = textAreaElement.find('.k-input-inner');
        if (floatingLabel && !label) {
            floatingLabelContainer.addClass('has-label');
        } else {
            floatingLabelContainer.removeClass('has-label');
        }

        // Click event to focus on textarea
        $('.kf-textarea .k-textarea').on('click', function () {
            const $textarea = $(this).find('textarea');
            $textarea.focus();
        });

        // Add the class 'floating-label-empty' if value is empty and floatingLabel is true
        if (!value && floatingLabel) {
            textAreaElement.find('.k-label.k-input-label').addClass('floating-label-empty');
        }

        textAreaElement.find('textarea').on('input', function () {
            const textarea = textAreaElement.find('textarea');
            if (textarea.val().trim() === '') {
                textAreaElement.find('.k-label.k-input-label').addClass('floating-label-empty');
            } else {
                textAreaElement.find('.k-label.k-input-label').removeClass('floating-label-empty');
            }
        });

        textAreaElement.addClass('kf-initialized');
    }

    // Function to set value by Id
    function setTextAreaValue(id, value) {
        const textAreaElement = $(`#${id}`);
        const inputElement = textAreaElement.find('textarea');
        const maxLength = parseInt(textAreaElement.data('kf-textarea-max-length'));

        if (inputElement.length > 0) {
            if (value.length > maxLength) {
                value = value.substring(0, maxLength);
            }
            inputElement.val(value);
            const floatingLabel = textAreaElement.find('[data-role="floatinglabel"]');
            if (!floatingLabel.hasClass('k-state-empty')) {
                floatingLabel.addClass(' k-focus');
            }

            const charCountWrapper = textAreaElement.find('.k-textarea-char-count-wrapper');
            charCountWrapper.find('.k-textarea-char-count').text(`${value.length} / ${maxLength}`);
        }
    }

    // Function to get value by Id
    function getTextAreaValue(id) {
        const textAreaElement = $(`#${id}`);
        const inputElement = textAreaElement.find('textarea');

        if (inputElement.length > 0 && inputElement.val() !== "") {
            return inputElement.val();
        }
    }

    // Function to disable textarea
    function disableTextArea(id) {
        const textAreaElement = $(`#${id}`);
        const textArea = textAreaElement.find('textarea');

        textArea.prop('disabled', true);

        textAreaElement.addClass('k-disabled');
        const floatingLabelContainer = textAreaElement.find('[data-role="floatinglabel"]');
        floatingLabelContainer.addClass('k-disabled');
    }

    // Function to enable textarea
    function enableTextArea(id) {
        const textAreaElement = $(`#${id}`);
        const textArea = textAreaElement.find('textarea');

        textArea.prop('disabled', false);

        textAreaElement.removeClass('k-disabled');
        const floatingLabelContainer = textAreaElement.find('[data-role="floatinglabel"]');
        floatingLabelContainer.removeClass('k-disabled');
    }

    $(function () {
        initializeTextarea();
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-textarea').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeTextarea();
                        }
                    }
                });
            });
        });

        // Start observing the document body for added elements
        observer.observe(document.body, { childList: true, subtree: true });
    });

    kungfui.enableTextArea = enableTextArea;
    kungfui.disableTextArea = disableTextArea;
    kungfui.getTextAreaValue = getTextAreaValue;
    kungfui.setTextAreaValue = setTextAreaValue;

})();
(function () {
    function initializeTextbox() {
        const elements = $('.kf-textbox').not('.kf-initialized');
        if (elements.length > 0) {
            kendo.setDefaults("iconType", "font");
            elements.each(function (index, element) {
                if (this.parentElement.className != "inlineUnit") {
                    dataForKendoIcon = createTextbox(this, null);

                    if (dataForKendoIcon["type"] == "Password") {

                        let input = "#" + dataForKendoIcon['id'];
                        let button = "#" + dataForKendoIcon['id'] + "-suffix";

                        $(input).kendoTextBox({
                            suffixOptions: {
                                icon: "fa-light fa-eye",
                                template: () => `<button id="${dataForKendoIcon['id']}-suffix" class="kf-textbox-icon" style="display:none"></button>`
                            },
                            change: dataForKendoIcon['change'],
                        });

                        $(button).kendoButton({
                            fillMode: "flat",
                            iconClass: "fa-light fa-eye",
                            click: revealPassword
                        });

                        // add this to disable to blur event from firing 
                        $(button).on('mousedown', function (e) {
                            e.preventDefault();
                        });

                        $(input).on('blur', function (e) {
                            $(button).hide();
                            $(input).attr('type', 'password');
                            $(button).find('span.k-icon').addClass('fa-eye').removeClass('fa-eye-slash');
                        });

                        $(input).on('focus input', function (e) {
                            if ($(input).val())
                                $(button).show();
                            else
                                $(button).hide();
                        });
                    }

                    //for kendo icon prefix and suffix
                    else if (dataForKendoIcon['hasBothKendoIcon']) {
                        $("#" + dataForKendoIcon['id']).kendoTextBox({
                            prefixOptions: {
                                template: () => `<span class='k-icon ${dataForKendoIcon['leftKendoIcon']}'></span>`,
                                icon: dataForKendoIcon['leftKendoIcon']
                            },
                            change: dataForKendoIcon['change'],
                            placeholder: dataForKendoIcon['placeholder'],
                            suffixOptions: {
                                icon: dataForKendoIcon['rightKendoIcon'],
                                template: () => `<button id="${dataForKendoIcon['id']}-suffix" class="kf-textbox-icon"></button>`
                            }
                        });
                        $("#" + dataForKendoIcon['id'] + "-suffix").kendoButton({
                            fillMode: "flat",
                            iconClass: dataForKendoIcon['rightKendoIcon'],
                            click: dataForKendoIcon['rightKendoIconOnClick']
                        });
                    }
                    else {
                        if (!kungfui.isNullOrWhitespace(dataForKendoIcon['leftKendoIcon']) && dataForKendoIcon['leftKendoIcon'] != 'None') {
                            $("#" + dataForKendoIcon['id']).kendoTextBox({
                                prefixOptions: {
                                    icon: dataForKendoIcon['leftKendoIcon'],
                                    template: () => `<span class='k-icon ${dataForKendoIcon['leftKendoIcon']}'></span>`
                                },
                                change: dataForKendoIcon['change'],
                                placeholder: dataForKendoIcon['placeholder']
                            });
                        }
                        if (!kungfui.isNullOrWhitespace(dataForKendoIcon['rightKendoIcon']) && dataForKendoIcon['rightKendoIcon'] != 'None') {
                            $("#" + dataForKendoIcon['id']).kendoTextBox({
                                suffixOptions: {
                                    icon: dataForKendoIcon['rightKendoIcon'],
                                    template: () => `<button id="${dataForKendoIcon['id']}-suffix" class="kf-textbox-icon"></button>`
                                },
                                change: dataForKendoIcon['change'],
                                placeholder: dataForKendoIcon['placeholder']
                            });


                            $("#" + dataForKendoIcon['id'] + "-suffix").kendoButton({
                                fillMode: "flat",
                                iconClass: dataForKendoIcon['rightKendoIcon'],
                                click: dataForKendoIcon['rightKendoIconOnClick']

                            });
                        }
                    }

                    $(this).addClass('kf-initialized');
                }
            });
        }
    }

    var textBoxTableForTarget = [];

    function createTextbox(node, container) {
        let floatingLabel = kungfui.convertToBoolean($(node).data('kf-textbox-floating-label'));
        let label = $(node).data('kf-textbox-label');
        let subtitle = $(node).data('kf-textbox-subtitle');
        let id = $(node).data('kf-textbox-id');
        let type = $(node).data('kf-textbox-type');
        let maxLength = $(node).data('kf-textbox-max-length');
        let width = $(node).data('kf-textbox-width');
        let onChange = $(node).data('kf-textbox-onchange');
        let disabled = kungfui.convertToBoolean($(node).data('kf-textbox-disabled'));
        let name = $(node).data('kf-textbox-name');
        //kendo icons
        let leftKendoIcon = $(node).data('kf-textbox-kendo-left-icon');
        let rightKendoIcon = $(node).data('kf-textbox-kendo-right-icon');
        let rightKendoIconOnClick = $(node).data('kf-textbox-kendo-right-icon-onclick');
        let value = $(node).data('kf-textbox-value');
        let placeholder = $(node).data('kf-textbox-placeholder');
        let required = $(node).data('kf-textbox-required');

        //checking if has kendo icon
        let hasLeftKendoIcon = false;
        if (!kungfui.isNullOrWhitespace(leftKendoIcon)) {
            hasLeftKendoIcon = true;
        }
        let hasRightKendoIcon

        if (!kungfui.isNullOrWhitespace(rightKendoIcon)) {
            hasRightKendoIcon = true;
        }

        let hasKendoIcon = false;
        if (hasLeftKendoIcon || hasRightKendoIcon) {
            hasKendoIcon = true;
        }

        let typeAttribute = type == "Password" ? `type=${type.toLowerCase()}` : "";
        let maxLengthAttribute = maxLength > 0 ? `maxlength=${maxLength}` : "";
        let styleWidth = !kungfui.isNullOrWhitespace(width) ? `style="width:${width} !important"` : "";
        let styleWidthForKendo = !kungfui.isNullOrWhitespace(width) ? `style="width:${width}; padding-left:4px; !important"` : "";
        let textBoxParameter = {
            value: value,
            change: onChange ? function (e) { eval(`${onChange}(e)`) } : null
        };

        //for floating label
        if (floatingLabel) {
            textBoxParameter.label = {
                content: label,
                floating: true
            }
        } else {
            textBoxParameter.label = {
                content: label,
                floating: false
            }
        }

        if (!kungfui.isNullOrWhitespace(placeholder)) {
            textBoxParameter.placeholder = placeholder
        }

        if (container == null) {
            container = node;
        }

        var targetTextBox;

        // Set the name attribute based on the label value
        let nameAttribute = name ? `data-kf-name="${name}"` : "";
        if (required === 'True') {
            if (hasLeftKendoIcon || hasRightKendoIcon) {
                targetTextBox = $(`<input id='${id}' autocomplete='off' ${typeAttribute} ${maxLengthAttribute} ${styleWidthForKendo} required="required" ${nameAttribute}/>`)
                    .appendTo(container)
                    .kendoTextBox().data("kendoTextBox");
            } else {
                targetTextBox = $(`<input id=${id} ${typeAttribute} ${maxLengthAttribute} ${styleWidth} required="required" ${nameAttribute}/>`)
                    .appendTo(container)
                    .kendoTextBox(textBoxParameter).data("kendoTextBox");
            }
        } else {
            if (hasLeftKendoIcon || hasRightKendoIcon) {
                targetTextBox = $(`<input id='${id}' autocomplete='off' ${typeAttribute} ${maxLengthAttribute} ${styleWidthForKendo} ${nameAttribute}/>`)
                    .appendTo(container)
                    .kendoTextBox().data("kendoTextBox");
            } else {
                targetTextBox = $(`<input id=${id} ${typeAttribute} ${maxLengthAttribute} ${styleWidth} ${nameAttribute}/>`)
                    .appendTo(container)
                    .kendoTextBox(textBoxParameter).data("kendoTextBox");
            }
        }

        if (!kungfui.isNullOrWhitespace(subtitle) && !hasKendoIcon) {
            $(`<div class='k-form-hint'>${subtitle}</div>`).insertAfter($(container).find(`#${id}`).parent());
        }

        textBoxTableForTarget.push({
            target: targetTextBox,
            id: id
        })

        if (kungfui.isNullOrWhitespace(placeholder)) {
            placeholder = label;
        }

        // Add the class 'floating-label-empty' if value is empty and floatingLabel is true
        if (!value && floatingLabel) {
            $(node).find('.k-label.k-input-label').addClass('floating-label-empty');
        }

        $(node).find('input').on('input', function () {
            const input = $(node).find('input');
            if (input.val().trim() === '') {
                $(node).find('.k-label.k-input-label').addClass('floating-label-empty');
            } else {
                $(node).find('.k-label.k-input-label').removeClass('floating-label-empty');
            }
        });

        // add k-disabled class
        if (disabled) {
            $(node).addClass("k-disabled");
        }

        $(node).addClass("kf-initialized");

        return {
            type: type,
            hasBothKendoIcon: hasLeftKendoIcon === hasRightKendoIcon,
            hasLeftKendoIcon: hasLeftKendoIcon,
            hasRightKendoIcon: hasRightKendoIcon,
            id: id,
            leftKendoIcon: leftKendoIcon,
            rightKendoIcon: rightKendoIcon,
            change: onChange ? function (e) { eval(onChange)(e); } : null,
            placeholder: placeholder,
            rightKendoIconOnClick: rightKendoIconOnClick ? function (e) { eval(rightKendoIconOnClick)(e); } : null,
        };
    }

    function enableTextBox(id) {
        if (id && id.length > 0)
            $(`#${id}`).closest('.kf-textbox').removeClass('k-disabled');
    }

    function getId(node) {
        let id = $(node).data('kf-textbox-id');
        return id;
    }

    function disableTextBox(id) {
        if (id && id.length > 0)
            $(`#${id}`).closest('.kf-textbox').addClass('k-disabled');
    }

    function changeTextboxValue(id, value) {
        var textBox = textBoxTableForTarget.find(x => x.id === id);
        textBox.target.value(value)
    }

    function getTextboxValue(id) {
        var textBox = textBoxTableForTarget.find(x => x.id === id);
        return textBox.target.value();
    }
    function revealPassword(e) {
        let input = $(e.target).parent().parent().find('input');
        let icon = $(e.target).find('span');

        $(input).focus();

        if ($(input).attr('type') == 'password') {
            $(input).attr('type', 'text');
            $(icon).addClass('fa-eye-slash').removeClass('fa-eye');
        }
        else {
            $(input).attr('type', 'password');
            $(icon).addClass('fa-eye').removeClass('fa-eye-slash');
        }
    }

    $(function () {

        initializeTextbox();
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        const addedElements = $(node).find('.kf-textbox').not('.kf-initialized');
                        if (addedElements.length > 0) {
                            initializeTextbox();
                        }
                    }
                });
            });
        });

        // Start observing the document body for added elements
        observer.observe(document.body, { childList: true, subtree: true });

    });

    kungfui.getTextboxValue = getTextboxValue;
    kungfui.changeTextboxValue = changeTextboxValue;
    kungfui.disableTextBox = disableTextBox;
    kungfui.getId = getId;
    kungfui.enableTextBox = enableTextBox;
})();
