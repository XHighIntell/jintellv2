!function() {
    var ns = intell.portal; ns = {}; intell.portal = ns;

    // classes
    ns.Portal = function Portal(element) {
        // 1. If Portal is called without the new keyword, recall if with the new keyword
        // 2. Code for portal

        // --1--
        if (this instanceof Portal == false) return new Portal(element);
        if (element == null) throw new TypeError("Failed to construct 'Portal': element can't be null.");

        
        // --2--
        /** @type intell.portal.Portal */
        var portal; portal = this; portal.applications = [];

        var $portal = $(element);
        var $portalContent = $portal.find('.Portal-Content');                   // .Portal-Content 
        var $portalApplications = $portalContent.find('.Portal-Applications');  // .Portal-Content .Portal-Applications

        if ($portalContent.length == 0) $portalContent = $('<main class="Portal-Content"></main>').appendTo($portal);
        if ($portalApplications.length == 0) $portalApplications = $('<div class="Portal-Applications"></div>').appendTo($portalContent)


        // fields
        var applications = portal.applications;
        var activeApplication = portal.activeApplication;
        var jsUrls = [];
        var styleUrls = [];

        // properties
        /** @type defineProperties<intell.portal.Portal> */
        var defineProperties = {
            applications: {
                get: function() { return applications.slice() },
                set: function() { throw new Error("'Portal.applications' cannot be assigned to -- it is read only")  }
            },
            activeApplication: {
                get: function() { return activeApplication },
                set: function(application) { this.open(application) }
            },
            
        };
        Object.defineProperties(portal, defineProperties);

        

        // methods
        portal.addManifest = function(manifest, callback) {
            var application = new ns.Application();

            if (manifest.id != null) application.manifest.id = manifest.id;
            if (manifest.name != null) application.manifest.name = manifest.name;
            if (manifest.description != null) application.manifest.description = manifest.description;
            if (manifest.title != null) application.manifest.title = manifest.title;
            if (manifest.icon != null) application.manifest.icon = manifest.icon;
            if (manifest.iconText != null) application.manifest.iconText = manifest.iconText;
            if (manifest.shortcut != null) application.manifest.shortcut = manifest.shortcut;
            if (manifest.group != null) application.manifest.group = manifest.group;
            if (manifest.startup != null) application.manifest.startup = manifest.startup;
            if (manifest.content != null) {
                if (manifest.content.html != null) application.manifest.content.html = manifest.content.html;
                if (manifest.content.js != null) application.manifest.content.js = manifest.content.js;
                if (manifest.content.css != null) application.manifest.content.css = manifest.content.css;
            }


            var manifest = application.manifest;

            // 1. check if application exist
            // 2. create shortcut base on manifest

            // --1--
            var element = this.taskbar.get(application);
            if (element != null) return; // application already exists

            applications.push(application);

            // --2
            if (manifest.shortcut === true) {
                application.elementShortcut = this.taskbar.add(application);
            }
            
            application.__callback = callback;
        }
        portal.addManifestModule = function(moduleName) {
            return import(moduleName).then(function(module) {
                module.default(portal);
            }); 
        }

        portal.open = function(arg1) {
            // open method have 3 overloads
            // A. open(): void;
            // B. open(application: Portal.Application): void;
            // C. open(applicationId: string): void;
            
            if (arg1 == null) {
                let application = applications.find(function(value) { return value.manifest.startup == true });
                if (application) portal.open(application);
            }
            else if (arg1 instanceof ns.Application) {
                // --B--

                let application = arg1;
                let manifest = arg1.manifest;
                
                // 1. if open an application already opened, exit this block
                // 2. set active class, hide all other applications
                // 3. 

                // --1--
                if (activeApplication == application) return;

                var oldApplication = activeApplication;
                var newApplication = application;


                // --2--
                activeApplication = application;

                portal.taskbar.active(application);



                portal.applications.forEach(function(value) {
                    if (value.elementRoot != null) intell.ctrl.hide(value.elementRoot);
                });

                // --3--
                if (application.status == "NONE") {
                    // application never load before
                    // 1. show loading overlay
                    // 2. start load

                    // --1--
                    portal.overlay.showLoading(application);

                    // --2--
                    portal.load(application).then(function() {

                        // we can't simply append root use jquery:
                        // ================================
                        $portalApplications.append(application.elementRoot)
                        // =================================
                        // [Deprecation] Synchronous XMLHttpRequest on the main thread is deprecated 
                        // because of its detrimental effects to the end user's experience. 
                        // For more help, check https://xhr.spec.whatwg.org/.

                        // we have to appendChild via native javascript
                        // then find all script tag and clone them insertAfter the real one
                        // ================================
                        // $portalApplications[0].appendChild(application.root);
                        // $(application.root).find('script').each(function() {
                        //     var script = document.createElement('script');
                        //     script.src = this.src;
                        //     script.type = this.type;
                        // 
                        //     this.parentElement.insertBefore(script, this.nextSibling);
                        //     $(this).remove();
                        // })
                        // ========================



                        if (activeApplication == application) {
                            portal.overlay.hide();
                            $(application.elementRoot).show();
                        }
                        else
                            $(application.elementRoot).hide();

                        application.onOpen.dispatch();
                    }, function(error) {
                        if (activeApplication == application) portal.overlay.showError(application);

                    });

                }
                else if (application.status == "LOADING") {
                    // application is loading
                    portal.overlay.showLoading(application);
                }
                else if (application.status == "LOADED") { //LOADED
                    portal.overlay.hide();
                    intell.ctrl.show(application.elementRoot);
                }
                else if (application.status == "FAIL") {
                    portal.overlay.showError(application);
                }

                portal.taskbar.active(application);
                portal.onChange.dispatch({ oldApplication: oldApplication, newApplication: newApplication });

                // because portal.onchange -> application.onopen 
                if (arg1.status == "LOADED") arg1.onOpen.dispatch();


            }
            else if (typeof arg1 == "string") {
                // --C--

                // let find a application to open first
                // 1. find application have the same id                

                // --1--
                if (arg1) {
                    let application = applications.find(function(value) { return value.manifest.id == arg1 });

                    if (application) portal.open(application);
                    else portal.open();
                }

            }
        }
        portal.load = function(application) {
            // 1. The application status must be none
            // 2. Load html
            // 3. Load script
            // 4. Load style
            
            // --1--
            if (application.status != "NONE") throw new Error("Application is already loaded.");

            application.status = "LOADING";

            var manifest = application.manifest;
            var promise = Promise.resolve();

            // --2--
            if (manifest.content.html) {
                promise = promise.then(function() {
                    return new Promise(function(resolve, reject) {
                        intell.get(manifest.content.html).load(function() {

                            if (this.status != 200) {
                                reject(new Error('Can\'t load html: ' + manifest.content.html));
                                return;
                            }

                            // 1. if have more than 1 element, swap in another div

                            // --1--
                            var $root = $(this.responseText);
                            if ($root.length > 1)
                                $root = $('<div class="Application-Wrapper"></div>').append($root);
                            application.elementRoot = $root[0];

                            resolve();

                        }).error(function() {
                            reject(new Error("ERR_INTERNET_DISCONNECTED"));
                        }).send();

                    });
                });
            }

            // --3--
            if (manifest.content.js && manifest.content.js.length > 0) {
                promise = promise.then(function() {
                    return new Promise(function(resolve, reject) {

                        var tasks = Array.from(manifest.content.js);

                        processTask();

                        function processTask() {
                            var url = tasks.shift();
                            if (url == null) { onFinish(); return }

                            portal.loadJavascript(url).then(function() {
                                processTask();
                            }, function(e) {
                                reject(e);
                            })
                        }
                        function onFinish() { resolve() }

                    });
                })


            }

            // --4--
            if (manifest.content.css && manifest.content.css.length > 0) {

                manifest.content.css.forEach(function(url) {
                    portal.loadStyle(url);
                });
            }

            return promise.then(function() {
                if (typeof application.__callback == 'function') return application.__callback(application);
            }).then(function() {
                application.status = "LOADED";
            }).catch(function(error) {
                application.status = "FAIL";
                application.error = error;

                console.error(error);

                return Promise.reject(error);
            });

        }
        portal.loadJavascript = function(relative_url) {
            var url = new URL(relative_url, document.baseURI);

            if (jsUrls.indexOf(url.href) !== -1) return Promise.resolve();

            return new Promise(function(resolve, reject) {
                return $.getScript({ url: url.href, cache: true }).done(function() {
                    jsUrls.push(url.href);
                    resolve();
                }).fail(function() {
                    reject(new Error('Can\'t load javascript: ' + url.href));
                })
            });
        }
        portal.loadStyle = function(relative_url) {
            var url = new URL(relative_url, document.baseURI);

            if (styleUrls.indexOf(url.href) != -1) {
                // already exist 
                return Promise.resolve();
            } else {
                return new Promise(function(resolve, reject) {
                    
                    var $link = $('<link href="' + url.href + '" rel="stylesheet">');
                    document.head.append($link[0]);
                    styleUrls.push(url.href);

                    resolve();
                });
            }
        }

        // events
        portal.onChange = new intell.EventRegister(portal);

        // sub
        portal.taskbar = function() {
            var taskbar = portal.taskbar; taskbar = {};
            var $taskbar = $portal.find('.Taskbar');
            var $taskbarTop = $taskbar.find('.Taskbar-Top');
            var $taskbarMid = $taskbar.find('.Taskbar-Middle');
            var $shortcutAbstract = $taskbarMid.find('.Shortcut.abstract').removeClass('abstract').remove();
            var $groupAbstract = $taskbarMid.find('.Group.abstract').removeClass('abstract').remove();
            var $actionCollapse = $taskbarTop.find('.Collapse-Button');

            if ($taskbar.length == 0) $taskbar = $('<div class="Taskbar"></div>').insertBefore($portalContent);
            if ($taskbarMid.length == 0) $taskbarMid = $('<div class="Taskbar-Middle"></div>').appendTo($taskbar);
            if ($shortcutAbstract.length == 0) $shortcutAbstract =
$(`<div class="Shortcut" title="" tabindex="0">
    <i class="Icon"></i>
    <span class="Name"></span>
</div>`);

            if ($groupAbstract.length == 0) $groupAbstract =
$(`<div class="Group" data-group="">
    <header>
        <div class="Name"></div>
    </header>
    <div class="Apps">
                        
    </div>
</div>`);

            // fields
            taskbar.keys = {};

            // methods
            taskbar.add = function(application) {
                
                var manifest = application.manifest;
                var $element = $shortcutAbstract.clone();
                var element = $element[0];

                $element.attr('title', manifest.title);
                if (manifest.icon) $element.find('.Icon').css('background-image', 'url("' + manifest.icon + '")');
                else if (manifest.iconText) $element.find('.Icon').html(manifest.iconText);

                $element.find('.Name').html(manifest.name);

                taskbar.setApplication(element, application);


                if (manifest.group) {
                    // 1. find or create create new group if not exists
                    // 2. append shortcut element to group

                    // --1--
                    var $group = $taskbarMid.find('.Group[data-group="' + manifest.group + '"]');
                    if ($group.length == 0) {
                        var $group = $groupAbstract.clone();
                        $group.attr('data-group', manifest.group);
                        $group.find('>header>.Name').html(manifest.group)
                        $taskbarMid.append($group);
                    }

                    // --2--
                    $group.find('.Apps').append($element);

                } else {
                    // when manifest.group equal null or empty, 
                    // must insert shortcut element before any group
                    // 1. find the first match for group
                    // 2. 
                    //   a. found a group, insert before the first match group
                    //   b. don't have any group, append $taskbarMid

                    // --1--
                    var $group = $taskbarMid.find('.Group:first');

                    // --2--
                    if ($group.length) {
                        // --2a--
                        $element.insertBefore($group);
                    } else {
                        // --2b--
                        $taskbarMid.append($element);
                    }


                }



                return element;
            }
            taskbar.get = function(application) {
                return $taskbarMid.find('.Shortcut').toArray().find(function(value) {
                    return taskbar.getApplication(value) == application;
                });
            }
            taskbar.getApplication = function(element) { return element._application }
            taskbar.setApplication = function(element, application) { element._application = application }
            taskbar.active = function(application) {
                var element = taskbar.get(application);
                if (element == null) return;

                $taskbarMid.find('.Shortcut').not(element).removeClass('ACTIVE');
                element.classList.add('ACTIVE');

                return element;
            }
            taskbar.enableCollapseStorage = function(key) {
                taskbar.keys.collapsed = key;

                if (taskbar.keys.collapsed) {
                    if (localStorage.getItem(key) == "true") $taskbar.addClass('COLLAPSED');
                }
            }

            // handle events
            $actionCollapse.click(function() {
                var collapsed = $taskbar.toggleClass('COLLAPSED').is('.COLLAPSED');

                if (taskbar.keys.collapsed) localStorage.setItem(taskbar.keys.collapsed, collapsed);
            });
            $taskbarMid.on('click', '.Shortcut', function() {
                var application = taskbar.getApplication(this);
                if (application) portal.open(application);
            });

            return taskbar;
        }()
        portal.overlay = function() {
            var overlay = portal.overlay; overlay = {};
            var $loadingOverlay = $portalContent.find('.Loading-Overlay');
            var $errorOverlay = $portalContent.find('.Error-Overlay');

            if ($loadingOverlay.length == 0) {
$loadingOverlay = $(`<div class="Loading-Overlay" style="display:none">
    <i class="spring"></i>
    <div class="content">
        <i class="spring"></i>
        <div class="Application-Name"></div>
        <div class="Application-Description"></div>
        <i class="spring" style="flex-grow:1.5"></i>
    </div>
                
    <i class="spring"></i>
    <div class="waiting-box">
        <div class="cycle"></div>
        <div class="cycle" style="animation-delay:.15s"></div>
        <div class="cycle" style="animation-delay:.3s"></div>
        <div class="cycle" style="animation-delay:.45s"></div>
        <div class="cycle" style="animation-delay:.6s"></div>
    </div>
</div>`);

                $portalContent.prepend($loadingOverlay);
            }
            if ($errorOverlay.length == 0) {
$errorOverlay = $(`<div class="Error-Overlay" style="display:none">
    <i class="spring"></i>
    <div class="Error-Content">
        <i class="spring"></i>
        <div class="Title">Oooops!</div>
        <div class="Application-Name"></div>
        <div class="Message"></div>
        <div class="Stack"></div>
        <i class="spring" style="flex-grow:2"></i>
    </div>
    <i class="spring"></i>
</div>`);
                $portalContent.prepend($errorOverlay);
            }

            // methods
            overlay.showLoading = function(application) {
                $loadingOverlay.find('.Application-Name').text(application.manifest.name);
                $loadingOverlay.find('.Application-Description').text(application.manifest.description);
                $loadingOverlay.show();

                $loadingOverlay[0].offsetHeight
                $loadingOverlay.addClass('ACTIVE');

                $errorOverlay.hide();
                $errorOverlay.removeClass('ACTIVE');
            }
            overlay.showError = function(application) {
                $errorOverlay.find('.Message').html(application.error.message);
                $errorOverlay.find('.Stack').html(application.error.stack);
                $errorOverlay.addClass('ACTIVE');
                $errorOverlay.show();

                $loadingOverlay.hide();
                $loadingOverlay.removeClass('ACTIVE');
            }
            overlay.hide = function() {
                $loadingOverlay.hide().removeClass('ACTIVE');
                $errorOverlay.hide().removeClass('ACTIVE');
            }

            return overlay;
        }()

    }
    ns.Application = function Application() {
        // 1. If PortalApplication is called without the new keyword, recall if with the new keyword
        // 2. If functions are not added to the prototype, create/add them
        // 3. 

        // --1--
        if (this instanceof Application == false) return new Application();

        /** @type intell.portal.Application */
        var application; application = this;

        

        application.manifest = {
            id: "",
            icon: "",
            iconText: "",
            name: "",
            title: "",
            description: "",

            content: {
                js: [],
                css: [],
                html: ""
            },

            shortcut: true,
            startup: false,
        }
        application.status = "NONE";
        application.onOpen = new intell.EventRegister(application);
    }

    // methods
}();