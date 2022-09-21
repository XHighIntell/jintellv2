/* !intell.js | https://github.com/xhighintell/jintellv2 */
'use strict';

!function() {
    var intell = globalThis.intell; intell = {
        version: '2.0.0'
    }; globalThis.intell = intell;
    
    // classes
    intell.EventRegister = function EventRegister(target, option) {

        // 1. If EventRegister is called without the new keyword, recall if with the new keyword
        // 2. If functions are not added to the prototype, create/add them
        // 3. 

        // --1--
        if (this instanceof EventRegister == false) return new EventRegister(target);

        // --2--
        /** @type intell.EventRegister<(this: {x:123}, name: string)=>void> */
        var prototype = EventRegister.prototype;

        if (prototype.addListener == null) {
            prototype.addListener = function(callback) {
                if (typeof (callback) != 'function') throw new Error('The callback must be function.');

                this.listeners.push(callback);
            }
            prototype.removeListener = function(callback) {
                var index = this.listeners.indexOf(callback);
                if (index == -1) return;

                this.listeners.splice(index, 1);
            }
            prototype.dispatch = function() {

                // 1. dispatch event to the listeners
                // 2. if true, the listener would be automatically removed when invoked
                // 3. if any of the listeners return "stopPropagation", stop. This is internally used
                var once = this.option.once;

                for (var i = 0; i < this.listeners.length; i++) {
                    var callback = this.listeners[i];

                    // --1--
                    var action = callback.apply(this.target, arguments);

                    // --2--
                    if (once === true) {
                        this.listeners.splice(i, 1);
                        i--;
                    }

                    // --3--
                    if (action == "stop" || action == "stopPropagation") break;
                }
            }
            prototype.hasListener = function(callback) { return this.listeners.indexOf(callback) != -1; }
            prototype.hasListeners = function() { return this.listeners.length > 0; }
        }

        // --3--
        /** @type intell.EventRegister<(this: {x:123}, name: string)=>void> */
        var _this; _this = this;
        _this.option = {};
        _this.listeners = [];
        _this.target = target;

        if (option != null && option.once != null) _this.option.once = option.once;
    }
    

    // methods
    intell.createOnOff = function createOnOff(target) {
        if (target == null) throw new Error("target can't be null");

        /** @type intell.CreateOnOffFunction */
        var fn = createOnOff;

        if (fn.getListeners == null) {

            var symbol = Symbol("createOnOff.listenerInformaions")

            fn.get = function(target) {
                if (target[symbol] == null) target[symbol] = [];
                
                return target[symbol]
            }
            fn.on = function(type, name, listener, options) {
                
                if (typeof name === "string") {
                    this.addEventListener(type, listener, options);

                    var o = fn.get(this);
                    o.push({ name: name, type: type, listener: listener, options: options });
                }
                else this.addEventListener.apply(this, arguments);

                return this;
            }
            fn.off = function(name) {
                var items = fn.get(this);

                for (var i = 0; i < items.length; i++) {
                    var item = items[i];

                    if (item.name == name) {
                        this.removeEventListener(item.type, item.listener, item.options);

                        items.splice(i, 1);
                        i--;
                    }
                }

                return this;
            }
        }
        
        target.on = fn.on;
        target.off = fn.off;
    }
    intell.get = function(url) {
        /** @type intell.HttpRequest */
        var request = new XMLHttpRequest();
        request.open('GET', url);

        intell.createOnOff(request);

        request.loadstart = function(callback) { return this.on('loadstart', callback) }
        request.readystatechange = function(callback) { return this.on('readystatechange', callback) }
        request.progress = function(callback) { return this.on('progress', callback) }
        request.load = function(callback) { return this.on('load', callback) }
        request.loadend = function(callback) { return this.on('loadend', callback) }
        request.error = function(callback) { return this.on('error', callback) }

        return request;
    };
    intell.post = function(url) {
        /** @type intell.HttpRequest */
        var request = new XMLHttpRequest();
        request.open('POST', url);

        intell.createOnOff(request);

        request.loadstart = function(callback) { return this.on('loadstart', callback) }
        request.readystatechange = function(callback) { return this.on('readystatechange', callback) }
        request.progress = function(callback) { return this.on('progress', callback) }
        request.load = function(callback) { return this.on('load', callback) }
        request.loadend = function(callback) { return this.on('loadend', callback) }
        request.error = function(callback) { return this.on('error', callback) }


        return request;
    }
    intell.qs = function(search) {
        if (search == null) search = window.location.search.substr(1);
        var o = search.split('&');

        var r = {};
        for (var i = 0; i < o.length; i++) {
            if (o[i] == "") continue;

            var p = o[i].split('=');
            p[0] = decodeURIComponent(p[0]);
            p[1] = decodeURIComponent(p[1] == undefined ? '' : p[1]);
            r[p[0]] = p[1];
        };
        return r;
    };

    
}();
!function() {
    if (globalThis.window == null) return;
    var ctrl = intell.ctrl; ctrl = {}; intell.ctrl = ctrl;

    // === methods ===
    ctrl.show = function(element) {

        // 1. validate
        // 2. remove inline style
        // 3. getComputedStyle; if the element display is still none, set inline style

        // --1--
        if (arguments.length == 0) throw new TypeError("Failed to execute 'show' on 'intell.ctrl': 1 argument required, but only 0 present.");
        if (element instanceof HTMLElement == false) return;

        // --2--
        if (element.style.display == 'none') element.style.display = '';
        

        // --3--
        var computedStyle = getComputedStyle(element);
        if (computedStyle.display == 'none') {
            if (window.CSS?.supports && CSS.supports('display', 'revert') == true)
                element.style.display = 'revert';
            else 
                element.style.display = 'block';
        }

    }
    ctrl.hide = function(element) {
        var computedStyle = getComputedStyle(element);
        if (computedStyle.display != 'none') element.style.display = 'none';
    }

    // startHide + stopHide
    !function() {
        /** @type intell.ctrl.StartHideProcess[] */
        var processes = [];

        ctrl.startHide = function(element, timeout, delayHideClass) {

            // 1. if the element is in the hiding process, return previous promise

            // 2. add class to element
            // 3. create timer
            // 4. stopHide & hide
            // 5. add to list

            // --1--
            var item = processes.find(function(item) { return item.element == element });
            if (item != null) return item.promise;

            var timer;
            var promise = new Promise(function(resolve, reject) {
                // --2--
                if (delayHideClass != null)
                    element.classList.add.apply(element.classList, delayHideClass.split(' ').filter(function(value) { return value != '' }));

                // --3--
                timer = setTimeout(function() {
                    // --4--
                    ctrl.stopHide(element);
                    ctrl.hide(element);

                    resolve();
                }, timeout);

                
            });

            // --5--
            processes.push({ element: element, timer: timer, class: delayHideClass, promise: promise });

            return promise;
        };
        ctrl.stopHide = function(element) {
            // remove all matching processes
            // 1. remove class
            // 2. remove timer
            // 3. remove from list

            for (var i = 0; i < processes.length; i++) {
                var item = processes[i];

                if (item.element == element) {
                    var classname = item.class;

                    // --1--
                    if (classname != null)
                        element.classList.remove.apply(element.classList, classname.split(' ').filter(function(value) { return value != '' }));

                    // --2--
                    clearTimeout(item.timer);

                    // --3--
                    processes.splice(i, 1)
                    i--;
                }
            }
        }
    }();

    ctrl.getBoundingClientRectOffset = function(element) {
        var rect = element.getBoundingClientRect();

        rect.x += window.scrollX;
        rect.y += window.scrollY;

        return rect;
    }
    ctrl.getRectWhenShowAtRect = function(popup, target, location, option) {

        /*      1   2   3
         *  12 ┌──────────┐ 4
         *  11 │targetRect│ 5
         *  10 └──────────┘ 6
         *      9   8   7
         */

        var space = option?.space ?? 0;
        var margin = option?.margin ?? 0;
        var container = option?.container;
        var score = 0;
        /** */
        var rect = new DOMRect(0, 0, popup.width, popup.height);


        switch (location) {
            case 1: case 9:
                rect.x = target.x; break;
            case 2: case 8:
                rect.x = target.x + (target.width - popup.width) / 2; break;
            case 3: case 7:
                rect.x = target.x + target.width - popup.width; break;
            case 4: case 5: case 6:
                rect.x = target.x + target.width + space; break;
            case 10: case 11: case 12:
                rect.x = target.x - popup.width - space; break;
        }
        switch (location) {
            case 1: case 2: case 3:
                rect.y = target.y - rect.height - space; break;
            case 4: case 12:
                rect.y = target.y; break;
            case 5: case 11:
                rect.y = target.y + (target.height - rect.height) / 2; break;
            case 6: case 10:
                rect.y = target.y + target.height - rect.height; break;
            case 7: case 8: case 9:
                rect.y = target.y + target.height + space; break;
        }


        if (container != null) {
            switch (location) {
                case 1: case 2: case 3:
                    if (rect.y - margin < container.y) {
                        rect.y = container.y + margin;
                        score--;
                    }
                    break;
                case 4: case 5: case 6:
                    if (rect.x + rect.width + margin > container.x + container.width) {
                        rect.x = container.x + container.width - margin - rect.width;
                        score--
                    }
                    break;
                case 7: case 8: case 9:
                    if (rect.y + rect.height + margin > container.y + container.height) {
                        rect.y = container.y + container.height - margin - rect.height;
                        score--;
                    }
                    break;
                case 10: case 11: case 12:
                    if (rect.x - margin < container.x) {
                        rect.x = container.x + margin;
                        score--;
                    }
                    break;
            }

            // we already minus score
            // rect can be bigger than its container
            // rect can exceed its container size in both x-axis and y-axis
            // but can't be placed in negative numbers relative to its container.

            if (rect.x + rect.width + margin > container.x + container.width) rect.x = container.x + container.width - rect.width - margin;
            if (rect.x < container.x) rect.x = container.x;
            
            if (rect.y + rect.height + margin > container.y + container.height) rect.y = container.y + container.height - rect.height - margin;
            if (rect.y < container.y) rect.y = container.y;

        }

        return { location: location, rect: rect, score: score }
    }
    ctrl.getRectWhenShowAtCoord = function(popup, target, location, option) {
        return ctrl.getRectWhenShowAtRect(popup, new DOMRect(target.x ?? target.left, target.y ?? target.top, 0, 0), location, option);
    }

    ctrl.showAt = function(element, o, locations, option) {
        if (o instanceof HTMLElement) return ctrl.showAtElement(element, o, locations, option);
        if (o.width != null && o.height != null) return ctrl.showAtRect(element, o, locations, option);
        else return ctrl.showAtCoord(element, o, locations, option);
    }
    ctrl.showAtRect = function(element, target, locations, option) {

        // 

        if (locations == null) throw new TypeError("locations can't be null");

        if (option?.container_mode != null) {
            
            if (option.container_mode == 'auto') {
                var clone = Object.assign({}, option);

                var elementContainer = ctrl.findParentElement(element, function(element) {
                    return element == document.documentElement || getComputedStyle(element).overflow != 'visible'
                });

                if (elementContainer != null) {
                    let width = Math.max(elementContainer.clientWidth, elementContainer.offsetWidth, elementContainer.scrollWidth) - 1;
                    let height = Math.max(elementContainer.clientHeight, elementContainer.offsetHeight, elementContainer.scrollHeight) - 1;

                    let offset = $(elementContainer).offset();

                    clone.container = new DOMRect(offset.left, offset.top, width, height);

                    option = clone;
                }
            }
        }


        $(element).css({ left: '-900px', visibility: 'hidden' });
        ctrl.show(element);

        var popup = ctrl.getBoundingClientRectOffset(element);
        var results = locations.map(function(location) { return ctrl.getRectWhenShowAtRect(popup, target, location, option) });
        var best = results.sort(function(a, b) {
            var scoreA = a.score * 256 - results.indexOf(a);
            var scoreB = b.score * 256 - results.indexOf(b);

            return scoreB - scoreA;
        })[0];

        $(element).offset({ left: best.rect.x, top: best.rect.y }).css({ visibility: '' });

        return best;
    }
    ctrl.showAtCoord = function(element, coord, locations, option) {
        var target = new DOMRect(coord.x ?? coord.left, coord.y ?? coord.top, 0, 0);

        return ctrl.showAtRect(element, target, locations, option);
    }
    ctrl.showAtElement = function(element, elementTarget, locations, option) {

        //if (option?.moveToTarget === true)
            //elementTarget.parentElement.insertAdjacentElement('beforeend', element);

        var target = ctrl.getBoundingClientRectOffset(elementTarget);

        return ctrl.showAtRect(element, target, locations, option);
    }

    ctrl.findParentElement = function(element, predicate) {
        var target = element.parentElement;
        
        while (target) {
            if (predicate(target) == true) return target;

            target = target.parentElement;
        }
    }


    
    //!function() {
    //    /** @type intell.ctrl.StartHideProcess[] */
    //    var processes = [];
    //
    //    ctrl.startClass = function(element, timeout, classname) {
    //        // 1. if the element is in the hiding process, return previous promise
    //
    //        // 2. add class to element
    //        // 3. create timer
    //        // 4. stopClass
    //        // 5. add to list
    //
    //        // --1--
    //        var item = processes.find(function(item) { return item.element == element });
    //        if (item != null) return item.promise;
    //
    //        var timer;
    //        var promise = new Promise(function(resolve, reject) {
    //            // --2--
    //            if (delayHideClass != null)
    //                element.classList.add.apply(element.classList, delayHideClass.split(' ').filter(function(value) { return value != '' }));
    //
    //            // --3--
    //            timer = setTimeout(function() {
    //                // --4--
    //                ctrl.stopClass(element, classname);
    //
    //                resolve();
    //            }, timeout);
    //
    //
    //        });
    //
    //        // --5--
    //        processes.push({ element: element, timer: timer, class: delayHideClass, promise: promise });
    //
    //        return promise;
    //    }
    //    ctrl.stopClass = function(element, classname) {
    //        // remove all matching processes
    //        // 1. remove class
    //        // 2. remove timer
    //        // 3. remove from list
    //
    //        for (var i = 0; i < processes.length; i++) {
    //            var item = processes[i];
    //
    //            if (item.element == element) {
    //                var classname = item.class;
    //
    //                // --1--
    //                if (classname != null)
    //                    element.classList.remove.apply(element.classList, classname.split(' ').filter(function(value) { return value != '' }));
    //
    //                // --2--
    //                clearTimeout(item.timer);
    //
    //                // --3--
    //                processes.splice(i, 1)
    //                i--;
    //            }
    //        }
    //    }
    //
    //}();
    
}();
!function() {
    if (globalThis.window == null) return;
    var template = intell.ctrl.template; template = {}; intell.ctrl.template = template;
    var privateKey = Symbol ? Symbol('__private') : '__private';
    
    // methods
    template.inherit = function(constructor, option) {

        // methods
        constructor.prototype.getPrivate = prototype.getPrivate;

        // static methods

        var ctrlKey = option.ctrlKey ?? (Symbol ? new Symbol() : 'ctrlKey');
        
        constructor.getItem = function(element) { return element[ctrlKey] }
        constructor.setItem = function(element, control) {
            //if (control instanceof constructor == false) throw new TypeError("'comboBox' must be comboBox.");
            return element[ctrlKey] = control
        }
    }

    
    /** @type intell.ctrl.template.Constructor */
    var constructor = { prototype: {} };
    var prototype = constructor.prototype;

    
    prototype.getPrivate = function(o) { return this[privateKey] ?? (this[privateKey] = o) }

}()
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
// ====== ComboBox ======
!function() {
    if (globalThis.window == null) return;
    var ctrl = intell.ctrl;
    var ComboBox = ctrl.ComboBox;
    var $itemAbstract = $(`<div class="Item">
    <div class="Icon"></div>
    <div class="Name"></div>
</div>`);
    var $groupAbstract = $(`
<div class="Group">
    <header>
        <div class="Name"></div>
    </header>
    <div class="Children"></div>
</div>
`);


    // ====== constructor =======
    /** @param {HTMLElement} element */
    ComboBox = function(element) {
        
        // 1. If this element is already used to create this control, return previous.
        //    a. If this function is called without the new keyword, recall if with the new keyword
        // 2. create & setup default value 
        // 3. handle events


        // --1 & 1a--
        if (ComboBox.getItem(element)) return ComboBox.getItem(element);
        if (this instanceof ComboBox == false) return new ComboBox(element);

        // --2--
        var _this = ComboBox.setItem(element, this);
        var $element = $(element);
        var $elementSelect = $element.find('>.Select');
        var $elementChildren = $element.find('>.Children');
        var $elementItemAbstract = $element.find('.Item.abstract').removeClass('abstract').remove();

        if ($elementSelect.length == 0) $elementSelect = $('<div class="Select"></div>').prependTo(element);
        if ($elementChildren.length == 0) $elementChildren = $('<div class="Children"></div>').insertAfter($elementSelect);


        var __private = _this.getPrivate({});
        __private.element = element;
        __private.elementSelect = $elementSelect[0];
        __private.elementChildren = $elementChildren[0];
        __private.elementItemAbstract = $elementItemAbstract[0];
        __private.childrenVisible = false;
        __private.items = [];
        __private.groups = [];
        __private.popupLocations = [9, 1];
        __private.popupOption = { space: -1, container_mode: "auto" }

        var previous_clientX = 0;
        var previous_clientY = 0;

        // --3--
        $element.mousedown(function(ev) {
            var e = ev.originalEvent;
            var $target = $(e.target);

            if ($target.closest('.Children').length != 0) return;

            if (__private.childrenVisible == false) _this.showChildrenElement(__private.element, true);
            else _this.hideChildren();
            
            e.preventDefault();
            element.focus();

            previous_clientX = e.clientX;
            previous_clientY = e.clientY;
        });
        $elementChildren.on('mouseup', '.Item', function(ev) {
            var e = ev.originalEvent;

            if (Math.abs(previous_clientX - e.clientX) <= 1 && Math.abs(previous_clientY - e.clientY) <= 1) return;

            _this._mouseUpOrClickItem(this);
        });
        $elementChildren.on('click', '.Item', function() { _this._mouseUpOrClickItem(this) });
        $element.keydown(function(ev) {
            var e = ev.originalEvent;
            var keyCode = e.keyCode;

            if (keyCode == 38) { _this._pressUpOrDown(keyCode); e.preventDefault() }
            if (keyCode == 40) { _this._pressUpOrDown(keyCode); e.preventDefault() }
            if (keyCode == 27) _this._pressEsc(keyCode);
        });
        $element.keypress(function(ev) {
            if (ev.originalEvent.keyCode == 13) _this._pressEnter();
        });

        // Predefined
        !function() {
            var $order = $elementChildren.find('>*').remove();

            $order.toArray().forEach(function(element) {
                if (element.matches('.Item') == true) {
                    let item = new ctrl.ComboBoxItem(element);
                    let item__private = item.getPrivate();

                    if (element.matches('.DISABLED') == true) item.disabled = true;
                    item__private.name = item__private.elementName.innerText.trim();
                    item__private.value = element.getAttribute('data-value');
                    
                    _this.add(item);

                    if (element.matches('.ACTIVE') == true) _this.selectedItem = item;
                }
                else if (element.matches('.Group') == true) {
                    var group = new ctrl.ComboBoxGroup(element);
                    group.name = group.elementName.innerText.trim();
                    __private.groups.push(group);
                    $elementChildren.append(element);

                    var elementItems = Array.from(element.querySelectorAll('.Item'));


                    elementItems.forEach(function(element) {
                        var item = new ctrl.ComboBoxItem(element);
                        var item__private = item.getPrivate();

                        //data-value
                        var $element = $(element);
                        if ($element.is('.DISABLED') == true) item.disabled = true;

                        item__private.name = item__private.elementName.innerText.trim();
                        item__private.value = $element.attr('data-value');
                        item__private.group = group.name;

                        _this.add(item);

                        if ($element.is('.ACTIVE') == true) _this.selectedItem = item;
                    })

                    
                }
            })
        }()
        

    }
    ctrl.ComboBox = ComboBox;

    // ===== setup inherit ======
    ctrl.template.inherit(ComboBox, { ctrlKey: Symbol('__ComboBox__') });

    // ======= properties =======
    var prototype = ComboBox.prototype;
    /** @type defineProperties<intell.ctrl.ComboBox>*/
    let defineProperties = {
        element: {
            get: function() { return this.getPrivate().element },
            set: function() { throw new Error("'ComboBox.element' cannot be assigned to -- it is read only") }
        },
        elementSelect: {
            get: function() { return this.getPrivate().elementSelect },
            set: function() { throw new Error("'ComboBox.elementSelect' cannot be assigned to -- it is read only") }
        },
        elementChildren: {
            get: function() { return this.getPrivate().elementChildren },
            set: function() { throw new Error("'ComboBox.elementChildren' cannot be assigned to -- it is read only") }
        },
        elementItemAbstract: {
            get: function() { return this.getPrivate().elementItemAbstract },
            set: function() { throw new Error("'ComboBox.elementItemAbstract' cannot be assigned to -- it is read only") }
        },
        childrenVisible: {
            get: function() { return this.getPrivate().childrenVisible },
            set: function() { throw new Error("'ComboBox.childrenVisible' cannot be assigned to -- it is read only") }
        },
        items: {
            get: function() { return this.getPrivate().items.slice() },
            set: function() { throw new Error("'ComboBox.items' cannot be assigned to -- it is read only") },
        },

        popupLocations: {
            get: function() { return this.getPrivate().popupLocations },
            set: function(newValue) { this.getPrivate().popupLocations = newValue },
        },
        popupOption: {
            get: function() { return this.getPrivate().popupOption },
            set: function(newValue) { this.getPrivate().popupOption = newValue },
        },
        selectedItem: {
            get: function() { return this.getPrivate().selectedItem },
            set: function(newValue) {
                var __private = this.getPrivate();

                if (newValue != null && __private.items.indexOf(newValue) == -1) throw new Error('Cannot set selectedItem that do not belong to combobox.');

                // logic
                __private.selectedItem = newValue;

                // ui/ux
                __private.elementSelect.innerHTML = '';
                if (newValue != null) __private.elementSelect.append(newValue.element.cloneNode(true));

            }
        },
    };
    Object.defineProperties(prototype, defineProperties)

    // ======== methods =========
    prototype.add = function() {
        if (arguments.length == 1 && arguments[0] instanceof ctrl.ComboBoxItem == true) return this.addItem(arguments[0]);
        if (arguments.length == 1 && typeof arguments[0] == "object") return this.addOption(arguments[0]);

        throw new TypeError("arguments do not match with any overloads.")
    }
    prototype.addOption = function(option) {
        var element;

        if (this.elementItemAbstract == null) element = $itemAbstract.clone()[0];
        else element = $(this.elementItemAbstract).clone()[0];
        
        var item = new ctrl.ComboBoxItem(element);

        if (option.name) item.name = option.name;
        if (option.icon) item.icon = option.icon;
        if (option.value) item.value = option.value;
        if (option.group) item.group = option.group;
        if (option.disabled) item.disabled = option.disabled;

        this.addItem(item);

        return item;
    }
    prototype.addItem = function(item) {
        var __private = this.getPrivate();
        if (__private.items.indexOf(item) != -1) throw new Error("The item is already exist.");

        var item__private = item.getPrivate();

        // logic
        item__private.parent = this;
        __private.items.push(item);


        // ui/ux
        var $children = $(__private.elementChildren);

        if (item.group) {
            var group = __private.groups.find(function(value) { return value.name == item.group });
        
        
            if (group == null) {
                var elementGroup = $groupAbstract.clone().appendTo(__private.elementChildren)[0];
                group = new ctrl.ComboBoxGroup(elementGroup);
                group.name = item.group;
        
                __private.groups.push(group);
            }
            group.add(item);
        
        } else {
            $children.append(item__private.element);
        }
    }
    prototype.remove = function(item) {
        var __private = this.getPrivate();
        var item__private = item.getPrivate();
        if (item__private.parent != this) throw new Error("Can't remove item that is not belong to it.");

        /////////////=================

        // logic
        var items = __private.items;
        var index = items.indexOf(item);
        items.splice(index, 1);

        // ui/ux
        var group = item__private.parentGroup;

        if (group == null) {
            item.element.remove();
        } else {
            group.remove(item);

            if (group.items.length == 0) {
                var index = __private.groups.indexOf(group);
                __private.groups.splice(index, 1);
                
                group.element.remove();
            }
        }
    }
    prototype.clear = function() {
        var __private = this.getPrivate();

        __private.items.forEach(function(item) { item.element.remove() });
        __private.groups.forEach(function(group) { group.element.remove() });

        __private.items.slice(0, __private.items.length);
        __private.groups.slice(0, __private.groups.length);
    }

    prototype.showChildren = function(at) {
        var _this = this;
        var __private = this.getPrivate();

        if (arguments.length == 0) this.showChildrenElement(__private.element, true);
        else if (arguments[0] instanceof HTMLElement == true) this.showChildrenElement.apply(this, arguments);
        else if (typeof arguments[0] == 'object') this.showChildrenCoord.apply(this, arguments);
        else {
            throw new TypeError("arguments do not match with any overloads.")
        }
    }
    prototype.showChildrenElement = function(target, hideOnFocusOut) {
        var _this = this;
        var __private = this.getPrivate();

        if (target instanceof HTMLElement == false) throw new TypeError("'target' must be HTMLElement.");
        if (hideOnFocusOut == null) hideOnFocusOut = false;

        // 1. if childrenElement is already shown
        //    a. if previous session_elementAt != null, remove 'ACTIVE' from previous
        //    b. set session_elementAt = target;
        //    c. showAt
        // 2. if childrenElement is hidden
        //    a. create session and set childrenVisible = true
        //    b. set session_elementAt = target;
        //    c. highlight current selectedItem by adding 'ACTIVE' class
        //    d. showAt & scrollIntoView
        // 3. if hideOnFocusOut == true, add focusOut

        // --1--
        if (__private.childrenVisible == true) {
            // --1a--
            if (__private.session_elementAt) {
                __private.session_elementAt.classList.remove('ACTIVE');
                $(__private.session_elementAt).off('focusout.at')
            }

            // --1b--
            __private.session_elementAt = target;
            target.classList.add('ACTIVE');

            // --1c--
            ctrl.showAt(__private.elementChildren, target, __private.popupLocations, __private.popupOption);

        }
        else {
            // --2--

            // --2a--
            __private.session_selectedItem = __private.selectedItem;
            __private.childrenVisible = true;

            // --2b--
            __private.session_elementAt = target;
            target.classList.add('ACTIVE');

            // --2c--
            __private.items.filter(function(item) { return item != __private.selectedItem }).forEach(function(item) {
                item.element.classList.remove('ACTIVE')
            });
            if (__private.selectedItem != null) __private.selectedItem.element.classList.add('ACTIVE');

            // --2d--
            ctrl.showAt(__private.elementChildren, target, __private.popupLocations, __private.popupOption);
            if (__private.selectedItem != null) __private.selectedItem.element.scrollIntoView({ block: "nearest" });
        }

        // --3--
        if (hideOnFocusOut == true) {
            $(target).on('focusout.at', function() {
                _this.hideChildren();
                $(target).off('focusout.at');
            })
        }
        
        
    }
    prototype.showChildrenCoord = function(coord) {
        var _this = this;
        var __private = this.getPrivate();


        // 1. if childrenElement is already shown
        //    a. if previous session_elementAt != null, remove 'ACTIVE' from previous
        //    b. set session_elementAt = null;
        //    c. showAt
        // 2. if childrenElement is hidden
        //    a. create session and set childrenVisible = true
        //    b. highlight current selectedItem by adding 'ACTIVE' class
        //    c. showAt & scrollIntoView

        // --1--
        if (__private.childrenVisible == true) {
            // --1a--
            if (__private.session_elementAt) {
                __private.session_elementAt.classList.remove('ACTIVE');
                $(__private.session_elementAt).off('focusout.at')
            }

            // --1b--
            __private.session_elementAt = null;
            

            // --1c--
            ctrl.showAt(__private.elementChildren, coord, __private.popupLocations, __private.popupOption);
        }
        else {
            // --2--
            // --2a--
            __private.session_selectedItem = __private.selectedItem;
            __private.childrenVisible = true;

            // --2b--
            __private.items.filter(function(item) { return item != __private.selectedItem }).forEach(function(item) {
                item.element.classList.remove('ACTIVE')
            });
            if (__private.selectedItem != null) __private.selectedItem.element.classList.add('ACTIVE');

            // --2c--
            ctrl.showAt(__private.elementChildren, coord, __private.popupLocations, __private.popupOption);
            if (__private.selectedItem != null) __private.selectedItem.element.scrollIntoView({ block: "nearest" });
        }

    }

    prototype.hideChildren = function() {
        var __private = this.getPrivate();
        __private.childrenVisible = false;
        $(__private.elementChildren).hide();


        if (__private.session_elementAt) {
            __private.session_elementAt.classList.remove('ACTIVE');
            __private.session_elementAt = null;
        }

    }
    prototype.toggleChildren = function() {
        var __private = this.getPrivate();
        if (__private.childrenVisible == true)
            this.hideChildren();
        else
            this.showChildren();
    }
    
    prototype._pressEsc = function() {
        // when the user press ESC
        // 1. while children aren't showing: Do nothing
        // 2. while children are showing
        //   a. end current session
        //   b. hide children

        var __private = this.getPrivate();

        if (__private.childrenVisible == false) {
            // --1--

        } else {
            // --2--
            // --2a--
            __private.session_selectedItem = null;
            // --2b--
            this.hideChildren();
        }
    }
    prototype._pressEnter = function() {
        var _this = this;
        var __private = this.getPrivate();

        // when user press enter
        // 1. while children aren't showing: show children
        // 2. while children are showing
        //   a. set new the value
        //   b. hide children

        if (__private.childrenVisible == false) {
            // --1--
            _this.showChildren();
        } else {
            // --2a--
            _this._setItem(__private.session_selectedItem);
            // --2b--
            _this.hideChildren();
        }
    }
    prototype._pressUpOrDown = function(keyCode) {
        if (keyCode != 38 && keyCode != 40) return;

        var _this = this;
        var __private = this.getPrivate();
        var nextItem = getNextItem();

        if (nextItem == null) return;

        if (__private.childrenVisible == false) {
            _this._setItem(nextItem);
            __private.session_selectedItem = null;
        } else if (__private.childrenVisible == true) {

            __private.session_selectedItem = nextItem;

            $(__private.elementChildren).find('.Item').not(nextItem.element).removeClass('ACTIVE');
            nextItem.element.classList.add('ACTIVE');

            if (__private.childrenVisible == true) nextItem.element.scrollIntoView({ block: "nearest" }); 
        }

        /** @returns {intell.ctrl.ComboBoxItem} */
        function getNextItem() {
            var current_selectedItem = __private.session_selectedItem ?? __private.selectedItem;
            var items = Array.from(__private.elementChildren.querySelectorAll('.Item')).map(function(elm) {
                return ctrl.ComboBoxItem.getItem(elm);
            }).filter(function(value) { return value.disabled != true });
            var index = current_selectedItem == null ? -1 : items.indexOf(current_selectedItem);

            if (keyCode == 38) index -= 1;
            else if (keyCode == 40) index += 1;

            return items[index];
        }


    }
    prototype._mouseUpOrClickItem = function(element) {
        // when user click on Item or mouse up on Item

        var item = ctrl.ComboBoxItem.getItem(element);
        
        if (item == null) return;
        if (item.disabled == true) return;
        if (item == this.selectedItem) { this.hideChildren(); return }

        this._setItem(item);
        this.hideChildren();
    }
    prototype._setItem = function(item) {
        var _this = this;
        var __private = this.getPrivate();

        if (__private.selectedItem == item) {
            
        } else {
            _this.selectedItem = item;
            var event = new Event('comboboxchange', { bubbles: true });
            __private.element.dispatchEvent(event);
        }

    }

    // ===== static methods =====


}();

// ====== ComboBoxItem ======
!function() {
    if (globalThis.window == null) return;
    var ctrl = intell.ctrl;
    var ComboBoxItem = ctrl.ComboBoxItem;

    // ====== constructor =======
    ComboBoxItem = function(element) {

        // 1. If this element is already used to create this control, return previous.
        // 1a. If this function is called without the new keyword, recall if with the new keyword

        // --1 & 1a--
        if (ComboBoxItem.getItem(element)) return ComboBoxItem.getItem(element);
        if (this instanceof ComboBoxItem == false) return new ComboBoxItem(element);

        var _this = ComboBoxItem.setItem(element, this);
        var $element = $(element);
        var $elementIcon = $element.find('.Icon');
        var $elementName = $element.find('.Name');


        var __private = _this.getPrivate({});
        __private.element = element;
        __private.elementIcon = $elementIcon[0];
        __private.elementName = $elementName[0];
        __private.name = '';
        __private.disabled = false;
    }
    ctrl.ComboBoxItem = ComboBoxItem;

    // ===== setup inherit ======
    ctrl.template.inherit(ComboBoxItem, { ctrlKey: Symbol('__ComboBoxItem__') });

    // ======= properties =======
    var prototype = ComboBoxItem.prototype;
    /** @type defineProperties<intell.ctrl.ComboBoxItem>*/
    var defineProperties = {
        element: {
            get: function() { return this.getPrivate().element },
            set: function(newValue) { throw new Error("'ComboBoxItem.element' cannot be assigned to -- it is read only") }
        },
        elementIcon: {
            get: function() { return this.getPrivate().elementIcon },
            set: function(newValue) { throw new Error("'ComboBoxItem.elementIcon' cannot be assigned to -- it is read only") }
        },
        elementName: {
            get: function() { return this.getPrivate().elementName },
            set: function(newValue) { throw new Error("'ComboBoxItem.elementName' cannot be assigned to -- it is read only") }
        },
        parent: {
            get: function() { return this.getPrivate().parent },
            set: function(newValue) { throw new Error("'ComboBoxItem.parent' cannot be assigned to -- it is read only") }
        },

        icon: {
            get: function() { return this.getPrivate().icon },
            set: function(newValue) {
                var __private = this.getPrivate(this);
                __private.icon = newValue;
                __private.elementIcon.innerHTML = newValue;
            }
        },
        name: {
            get: function() { return this.getPrivate().name },
            set: function(newValue) {
                var __private = this.getPrivate();
                __private.name = newValue;
                __private.elementName.innerHTML = newValue;

            }
        },
        value: {
            get: function() { return this.getPrivate().value },
            set: function(newValue) { this.getPrivate().value = newValue }
        },
        group: {
            get: function() { return this.getPrivate().group },
            set: function(newValue) {
                var __private = this.getPrivate();

                if (__private.group == newValue) return;

                __private.group = newValue;
            }
        },
        disabled: {
            get: function() { return this.getPrivate().disabled },
            set: function(newValue) {
                var __private = this.getPrivate();

                __private.disabled = newValue;

                __private.element.classList.toggle('DISABLED', __private.disabled);
            }
        },
    }
    Object.defineProperties(prototype, defineProperties);

    // ======== methods =========


    // ===== static methods =====

}();

// ====== ComboBoxGroup =====
!function() {
    if (globalThis.window == null) return;
    var ctrl = intell.ctrl;
    var ComboBoxGroup = ctrl.ComboBoxGroup;

    // ====== constructor =======
    ComboBoxGroup = function(element) {

        // 1. If this element is already used to create this control, return previous.
        // 1a. If this function is called without the new keyword, recall if with the new keyword

        // --1 & 1a--
        if (ComboBoxGroup.getItem(element)) return ComboBoxGroup.getItem(element);
        if (this instanceof ComboBoxGroup == false) return new ComboBoxGroup(element);


        var _this = ComboBoxGroup.setItem(element, this);
        var $element = $(element);
        var $elementName = $element.find('.Name');
        var $elementChildren = $element.find('.Children');
        
        var __private = _this.getPrivate({});
        __private.element = element;
        __private.elementName = $elementName[0];
        __private.elementChildren = $elementChildren[0];
        __private.items = [];
    }
    ctrl.ComboBoxGroup = ComboBoxGroup;

    // ===== setup inherit ======
    ctrl.template.inherit(ComboBoxGroup, { ctrlKey: Symbol('__ComboBoxGroup__') });

    // ======= properties =======
    /** @type defineProperties<intell.ctrl.ComboBoxGroup>*/
    var properties = {
        element: {
            get: function() { return this.getPrivate().element },
            set: function() { throw new Error("'ComboBoxGroup.element' cannot be assigned to -- it is read only") }
        },
        elementName: {
            get: function() { return this.getPrivate().elementName },
            set: function() { throw new Error("'ComboBoxGroup.elementName' cannot be assigned to -- it is read only") }
        },
        elementChildren: {
            get: function() { return this.getPrivate().elementChildren },
            set: function() { throw new Error("'ComboBoxGroup.elementChildren' cannot be assigned to -- it is read only") }
        },
        items: {
            get: function() { return this.getPrivate().items },
            set: function() { throw new Error("'ComboBoxGroup.items' cannot be assigned to -- it is read only") }
        },
        name: {
            get: function() { return this.getPrivate().name },
            set: function(newValue) {
                var __private = this.getPrivate();

                // logic
                __private.name = newValue;

                // ui/ux
                __private.elementName.innerHTML = newValue;
            }
        },
    }
    var prototype = ComboBoxGroup.prototype;
    Object.defineProperties(prototype, properties);

    // ======== methods =========
    prototype.add = function(item) {
        var group__private = this.getPrivate();
        var item__private = item.getPrivate();

        // logic 
        group__private.items.push(item);
        item__private.parentGroup = this;

        // ui/ux
        group__private.elementChildren.append(item.element)
    }
    prototype.remove = function(item) {
        var index = this.items.indexOf(item);
        if (index == -1) return;

        // logic
        this.items.splice(index, 1);

        // ui/ux
        item.element.remove();
    }

    // ===== static methods =====

}();
!function() {
    if (globalThis.window == null) return;
    var ctrl = intell.ctrl;
    var Numeric = ctrl.Numeric;
    var localeDecimalSeparator = (0.1).toLocaleString().substr(1, 1);   // "." in en-US
    var localeThousandSeparator = (1000).toLocaleString().substr(1, 1); // "," in en-US


    // constructor
    /** @param {HTMLElement} element */
    Numeric = function(element) {

        // 1. If this element is already used to create this control, return previous.
        //    a. If this function is called without the new keyword, recall if with the new keyword

        // --1 & 1a--
        if (Numeric.getItem(element)) return Numeric.getItem(element);
        if (this instanceof Numeric == false) return new Numeric(element);


        var _this = Numeric.setItem(element, this);
        var $element = $(element);
        var $elementUp = $element.find('.Action-Up');
        var $elementDown = $element.find('.Action-Down');
        var $elementInput = $element.find('input').addBack('input');

        var __private = _this.getPrivate({});
        __private.element = element;
        __private.elementInput = $elementInput[0];
        __private.elementUp = $elementUp[0];
        __private.elementDown = $elementDown[0];
        __private.min = null;
        __private.max = null;
        __private.minimumFractionDigits = 0;
        __private.maximumFractionDigits = 2;
        __private.decimalSeparator = localeDecimalSeparator;
        __private.thousandSeparator = localeThousandSeparator;
        __private.nullable = false;
        __private.value = null;
        __private.increment = 1;

        // predefine
        _this.value = Numeric.parseFloat(__private.elementInput.value, __private);

        // handle events
        var session_skiped = false;
        $elementInput.focus(function() { session_skiped = false });
        $elementInput.keydown(function(ev) {
            var e = ev.originalEvent;
            var keyCode = e.keyCode;

            if (keyCode == 27) {
                session_skiped = true;
                __private.elementInput.value = Numeric.formatNumber(__private.value, __private);
                __private.elementInput.blur();
            }
            else if (keyCode == 38) {
                _this.increaseSessionBy(__private.increment); e.preventDefault();
            }
            else if (keyCode == 40) {
                _this.increaseSessionBy(-__private.increment); e.preventDefault();
            }
        })
        $elementInput.keypress(function(e) { if ('1234567890.,-'.indexOf(e.originalEvent.key) == -1) return false });
        $elementInput.focusout(function(e) { if (session_skiped == true) return; _this._focusout() });

        $elementUp.click(function() { _this.increaseSessionBy(_this.increment) });
        $elementDown.click(function() { _this.increaseSessionBy(-_this.increment) });

        $elementUp.add($elementDown).mousedown(function(ev) {
            __private.elementInput.focus();

            ev.originalEvent.preventDefault();
        })
        $element.on('mousewheel', function(ev) {
            if (__private.elementInput != document.activeElement) return;

            var e = ev.originalEvent;

            if (e.deltaY > 0) _this.increaseSessionBy(-_this.increment)
            else _this.increaseSessionBy(_this.increment)

            e.preventDefault();
        })
    }
    ctrl.Numeric = Numeric;

    // setup inherit
    ctrl.template.inherit(Numeric, { ctrlKey: Symbol('__Numeric__') });

    // properties
    var prototype = Numeric.prototype;
    /** @type defineProperties<intell.ctrl.Numeric>*/
    let defineProperties = {
        element: {
            get: function() { return this.getPrivate().element },
            set: function() { throw new Error("'Numeric.element' cannot be assigned to -- it is read only") }
        },
        elementUp: {
            get: function() { return this.getPrivate().elementUp },
            set: function() { throw new Error("'Numeric.elementUp' cannot be assigned to -- it is read only") }
        }, elementDown: {
            get: function() { return this.getPrivate().elementDown },
            set: function() { throw new Error("'Numeric.elementDown' cannot be assigned to -- it is read only") }
        },
        elementInput: {
            get: function() { return this.getPrivate().elementInput },
            set: function() { throw new Error("'Numeric.elementInput' cannot be assigned to -- it is read only") }
        },

        min: {
            get: function() { return this.getPrivate().min },
            set: function(newValue) { this.getPrivate().min = newValue },
        },
        max: {
            get: function() { return this.getPrivate().max },
            set: function(newValue) { this.getPrivate().max = newValue },
        },
        minimumFractionDigits: {
            get: function() { return this.getPrivate().minimumFractionDigits },
            set: function(newValue) { this.getPrivate().minimumFractionDigits = newValue }
        },
        maximumFractionDigits: {
            get: function() { return this.getPrivate().maximumFractionDigits },
            set: function(newValue) { this.getPrivate().maximumFractionDigits = newValue }
        },
        decimalSeparator: {
            get: function() { return this.getPrivate().decimalSeparator },
            set: function(newValue) {
                var __private = this.getPrivate();

                __private.decimalSeparator = newValue;
                __private.elementInput.value = Numeric.formatNumber(__private.value, __private);
            },
        },
        thousandSeparator: {
            get: function() { return this.getPrivate().thousandSeparator },
            set: function(newValue) {
                var __private = this.getPrivate();

                __private.thousandSeparator = newValue;
                __private.elementInput.value = Numeric.formatNumber(__private.value, __private);
            }
        },
        nullable: {
            get: function() { return this.getPrivate().nullable },
            set: function(newValue) { this.getPrivate().nullable = newValue }
        },
        value: {
            get: function() { return this.getPrivate().value },
            set: function(newValue) {

                var __private = this.getPrivate();
                var oldValue = __private.value;

                // 1. check
                //   a. treat NaN as null
                //   b. exit because nothing was changed
                //   c. exit because we are not allow null
                //   d. newValue is not number
                // 2. cap [min;max]
                // 3. round to x fraction digits

                // --1--
                if (isNaN(newValue) == true) newValue = null;
                if (newValue == oldValue) return;
                if (newValue == null && __private.nullable == false) return;
                if (newValue != null && typeof newValue != 'number') return;

                // --2--
                if (newValue != null && __private.min != null && newValue < __private.min) newValue = __private.min;
                if (newValue != null && __private.max != null && newValue > __private.max) newValue = __private.max;

                // --3--
                if (newValue != null) {
                    var scale = Math.pow(10, __private.maximumFractionDigits);
                    newValue = Math.round(newValue * scale) / scale;
                }

                __private.value = newValue;
                __private.elementInput.value = Numeric.formatNumber(newValue, __private);

                return true;
            }
        },

        increment: {
            get: function() { return this.getPrivate().increment },
            set: function(newValue) { this.getPrivate().increment = newValue }
        },
    };
    Object.defineProperties(prototype, defineProperties)

    // methods
    prototype.increaseSessionBy = function(increment) {
        var __private = this.getPrivate();



        var newValue = Numeric.parseFloat(__private.elementInput.value, __private);
        if (newValue == null || isNaN(newValue) == true) newValue = 0;

        newValue += increment;

        if (__private.min != null && newValue < __private.min) newValue = __private.min;
        if (__private.max != null && newValue > __private.max) newValue = __private.max;

        __private.elementInput.value = Numeric.formatNumber(newValue, __private);
    }
    prototype._focusout = function() {

        // 1. parse newValue
        // 2. if newValue equal current value, reset text & return
        // 3. if can't change value or new value equal old value
        //    a. can't set
        //    b. can set

        /** @type intell.ctrl.Numeric */
        var _this = this;
        var __private = _this.getPrivate();

        // --1--
        var newValue = Numeric.parseFloat(__private.elementInput.value, __private);

        // --2--
        if (__private.value == newValue) {
            __private.elementInput.value = Numeric.formatNumber(__private.value, __private);
            return;
        }

        var oldValue = __private.value;
        _this.value = newValue;

        // --3--
        if (_this.value == oldValue) {
            // --3a--
            __private.elementInput.value = Numeric.formatNumber(__private.value, __private);
        } else {
            // --3b--
            var event = new Event('numericchange', { cancelable: false, bubbles: true });
            event.numeric = _this;
            __private.elementInput.dispatchEvent(event);
        }
    }


    // static methods
    Numeric.parseFloat = function(text, option) {
        // Assuming we have:
        // thousandSeparator = "| ";
        // decimalSeparator  = "_";

        // 1. "1| 000| 000| 000_88" => "1000000000_88"
        //      thousandSeparator => ""
        //      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement
        // 2. "1000000000_88" => "."

        if (typeof text == "object") text = text.toString();

        // --1--
        if (option.thousandSeparator != null) {
            var regExp = option.thousandSeparator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            text = text.replace(new RegExp(regExp, 'g'), '');
        }

        // --2--
        if (option.decimalSeparator != null) {
            text = text.replace(option.decimalSeparator, '.');
        }

        return parseFloat(text);
    }
    Numeric.formatNumber = function(number, option) {

        // 1. if number is null or NaN, return empty string
        // 2. minimumFractionDigits - maximumFractionDigits
        // 3. 
        //   3a. "1,222,333.20" => "1a222a333b20"
        //   3b. "1a222a333b20" => "1|222|333_20"

        // --1--
        if (number == null || isNaN(number)) return '';
        if (typeof number != 'number') throw new TypeError('value is not number.');

        // --2--
        var text = Intl.NumberFormat('en-US', { minimumFractionDigits: option.minimumFractionDigits, maximumFractionDigits: option.maximumFractionDigits }).format(number);

        // --3a--
        text = text.replace(/,/g, 'a').replace('.', 'b'); // => 1a000a000b14

        // --3b--
        text = text.replace(/a/g, option.thousandSeparator ?? '').replace('b', option.decimalSeparator ?? '.');

        return text;
    }

}()








!function() {

    if (String.prototype.between == null)
        String.prototype.between = function(startWith, endWith, include) {
            var index_start = this.indexOf(startWith);
            if (index_start == -1) return null;

            var index_end = this.indexOf(endWith, index_start + startWith.length);
            if (index_end == -1) return null;

            if (include == true)
                return this.substring(index_start, index_end + endWith.length);
            else
                return this.substring(index_start + startWith.length, index_end);
        }
    else {
        console.warn("String.prototype.between is already exists");
    }
}();



