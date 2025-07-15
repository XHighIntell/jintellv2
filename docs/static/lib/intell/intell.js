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
                //      a. if there is any error in a listener, log into the console and continue.
                // 2. if true, the listener would be automatically removed when invoked
                // 3. if any of the listeners return "stopPropagation", stop. This is internally used
                var once = this.option.once;

                for (var i = 0; i < this.listeners.length; i++) {
                    var callback = this.listeners[i];

                    // --1--
                    try {
                        var action = callback.apply(this.target, arguments);
                    } catch (e) {
                        console.error(e);
                    }
                    
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
    intell.wait = function(timeout) {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    
}();
!function() {
    var ctrl = intell.ctrl; ctrl = {}; intell.ctrl = ctrl;

    // === methods ===
    ctrl.show = function(element) {

        // 1. validate
        // 2. remove inline style
        // 3. getComputedStyle; if the element display is still none, set inline style

        // --1--
        if (arguments.length == 0) throw new TypeError("Failed to execute 'show' on 'intell.ctrl': 1 argument required, but only 0 present.");
        if (element instanceof Element == false) return;

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
    ctrl.toggle = function(element, force) {
        if (force == null) {
            var computedStyle = getComputedStyle(element);

            if (computedStyle.display == 'none') { ctrl.show(element); return true; }
            else { ctrl.hide(element); return false; }
        } else {
            if (force == true) { ctrl.show(element); return true; }
            else { ctrl.hide(element); return false; }
        }
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
                    if (rect.x - margin < container.x) {
                        rect.x = Math.max(0, container.x + margin);
                        score--;
                    }

                    if (rect.x + rect.width + margin > container.x + container.width) {
                        rect.x = Math.max(0, container.x + container.width - margin - rect.width);
                        score--;
                    }

                    if (rect.y - margin < container.y) {
                        rect.y = Math.max(0, container.y + margin);
                        score--;
                    }

                    if (rect.y + rect.height + margin > container.y + container.height) {
                        rect.y = Math.max(0, container.y + container.height - margin - rect.height);
                        score--;
                    }
                    break;
                case 4: case 5: case 6:
                    if (rect.x + rect.width + margin > container.x + container.width) {
                        rect.x = Math.max(0, container.x + container.width - margin - rect.width);
                        score--
                    }

                    if (rect.y + rect.height + margin > container.y + container.height) {
                        rect.y = Math.max(0, container.y + container.height - margin - rect.height);
                        score--
                    }

                    break;
                case 7: case 8: case 9:
                    if (rect.x - margin < container.x) {
                        rect.x = Math.max(0, container.x + margin);
                        score--;
                    }

                    if (rect.x + rect.width + margin > container.x + container.width) {
                        rect.x = Math.max(0, container.x + container.width - margin - rect.width);
                        score--;
                    }

                    if (rect.y - margin < container.y) {
                        rect.y = Math.max(0, container.y + margin);
                        score--;
                    }

                    if (rect.y + rect.height + margin > container.y + container.height) {
                        rect.y = Math.max(0, container.y + container.height - margin - rect.height);
                        score--;
                    }
                    break;
                case 10: case 11: case 12:
                    if (rect.x - margin < container.x) {
                        rect.x = Math.max(0, container.x + margin);
                        score--;
                    }

                    if (rect.y - margin < container.y) {
                        rect.y = Math.max(0, container.y + margin);
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
                    if (element == document.documentElement) return true;

                    var computedStyle = getComputedStyle(element);
                    if (computedStyle.overflow == 'hidden') return true;
                    if (computedStyle.overflow != 'visible' && computedStyle.position != 'static') return true;

                    return false;
                });

                if (elementContainer != null) {
                    let width = Math.max(elementContainer.clientWidth, elementContainer.offsetWidth, elementContainer.scrollWidth) - 1;
                    let height = Math.max(elementContainer.clientHeight, elementContainer.offsetHeight, elementContainer.scrollHeight) - 1;

                    let offset = $(elementContainer).offset();
                    let scrollbar_right_size = elementContainer.offsetWidth - elementContainer.clientWidth;
                    let scrollbar_bottom_size = elementContainer.offsetHeight - elementContainer.clientHeight;

                    if (elementContainer != document.documentElement) {
                        // if we are on scrollable parent that is not documentElement
                        width = elementContainer.clientWidth;
                        height = elementContainer.clientHeight;
                    }

                    // notes: <html> <body> tag cannot obtain a scroll bar (the browser scroll bar stays outside the border of the root element).
                    // => This may need more implementation.
                    scrollbar_right_size = 0;
                    scrollbar_bottom_size = 0;
                    //if (elementContainer == document.documentElement || elementContainer == document.body) {
                    //    scrollbar_right_size = 0;
                    //    scrollbar_bottom_size = 0;
                    //}

                    clone.container = new DOMRect(offset.left, offset.top, width - scrollbar_right_size, height - scrollbar_bottom_size);

                    option = clone;
                }
            }
        }


        $(element).css({ left: '-900px', top: '-90px', visibility: 'hidden' });
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
    ctrl.findClosestElement = function(element, predicate) {
        var target = element;

        while (target) {
            if (predicate(target) == true) return target;

            target = target.parentElement;
        }
    }

    ctrl.rectIntersect = function(a, b) {
        var x1 = Math.max(a.x, b.x);
        var x2 = Math.min(a.x + a.width, b.x + b.width);
        var y1 = Math.max(a.y, b.y);
        var y2 = Math.min(a.y + a.height, b.y + b.height);

        if (x2 >= x1 && y2 >= y1) return new DOMRect(x1, y1, x2 - x1, y2 - y1);

        return null;
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
    ctrl.duplicateNodes = function(nodes) {
        var out = [];
        nodes.forEach(o => out.push(o.cloneNode(true)))
        return out;
    }
}();
!function() {
    //if (globalThis.window == null) return;
    var template = intell.ctrl.template; template = {}; intell.ctrl.template = template;
    var privateKey = Symbol ? Symbol('__private') : '__private';
    
    // methods
    template.inherit = function(constructor, option) {

        // methods
        constructor.prototype.getPrivate = prototype.getPrivate;

        // static methods

        var ctrlKey = option.ctrlKey ?? (Symbol ? new Symbol() : 'ctrlKey');
        
        constructor.getItem = function(element) { return element?.[ctrlKey] }
        constructor.setItem = function(element, control) {
            //if (control instanceof constructor == false) throw new TypeError("'comboBox' must be comboBox.");
            return element[ctrlKey] = control
        }
    }
    template.defineProperties = function(o, properties) { return Object.defineProperties(o, properties) }

    
    /** @type intell.ctrl.template.Constructor */
    var constructor = { prototype: {} };
    var prototype = constructor.prototype;

    
    prototype.getPrivate = function(o) { return this[privateKey] ?? (this[privateKey] = (o ?? {})) }

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
            element: {
                get: function() { return element },
                set: function() { throw new Error("'Portal.element' cannot be assigned to -- it is read only") }
            },
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
        portal.add = function(application) {

            if (application.manifest == null) throw new Error();


            application.manifest.shortcut ??= true;
            application.manifest.startup ??= false;
            application.status ??= "NONE";
            application.onOpen ??= new intell.EventRegister(application);


            // 1. check if application exist
            // 2. create shortcut base on manifest

            // --1--
            var element = this.taskbar.get(application);
            if (element != null) return; // application already exists

            applications.push(application);

            // --2
            if (application.manifest.shortcut === true) {
                application.elementShortcut = this.taskbar.add(application);
            }
        }
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

            application.init = callback;
        }
        portal.addManifestModule = function(moduleName) {
            return import(moduleName).then(function(module) {
                return module.default(portal);
            }); 
        }
        portal.addManifestClass = function(fn) {
            var application = new fn();

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

            if (application.init == null) throw new Error("application.init can't be null when added via addManifestClass.")

            return application;
        }
        portal.addManifestClassModule = async function(moduleName) {
            const module = await import(moduleName);
            return portal.addManifestClass(module.default)
        }

        portal.getApplication = function(id) {
            return applications.find(app => app.manifest.id == id)
        }

        portal.open = async function(arg1) {
            // open method have 3 overloads
            // A. open(): void;
            // B. open(application: Portal.Application): void;
            // C. open(applicationId: string): void;
            
            if (arg1 == null) {
                let application = applications.find(function(value) { return value.manifest.startup == true });
                if (application) return portal.open(application);
            }
            else if (typeof arg1 == "string") {
                // --C--

                // let find a application to open first
                // 1. find application have the same id                

                // --1--
                if (arg1) {
                    let application = applications.find(function(value) { return value.manifest.id == arg1 });

                    return portal.open(application);
                }

            }
            else if (typeof arg1 == "object") {
                // --B--
                /** @type {intell.portal.Application}*/
                let application = arg1;
                let manifest = application.manifest;

                // 1. if open an application already opened, exit this block
                // 2. set active class, hide all other applications
                //      a. hide the container of application
                //      b. hide all applications
                // 3. 

                // --1--
                if (activeApplication == application) return;

                var oldApplication = activeApplication;
                var newApplication = application;


                // --2--
                activeApplication = application;
                portal.taskbar.active(application);
                // --2a--
                intell.ctrl.hide($portalApplications[0]);
                // --2b--
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
                    try {
                        await portal.load(application);

                        // we can't simply append root use jquery:
                        // ================================

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
                            intell.ctrl.show($portalApplications[0]);
                            intell.ctrl.show(application.elementRoot);
                        }
                        else $(application.elementRoot).hide();

                        application.onOpen.dispatch();

                    }
                    catch (e) {
                        if (activeApplication == application) portal.overlay.showError(application);
                        throw e;
                    }

                }
                else if (application.status == "LOADING") {
                    // application is loading
                    portal.overlay.showLoading(application);
                }
                else if (application.status == "LOADED") { //LOADED
                    portal.overlay.hide();
                    intell.ctrl.show($portalApplications[0]);
                    intell.ctrl.show(application.elementRoot);
                }
                else if (application.status == "FAIL") {
                    portal.overlay.showError(application);
                }

                $portalApplications.attr('data-active-application', manifest.id);
                portal.onChange.dispatch({ oldApplication: oldApplication, newApplication: newApplication });

                // because portal.onchange -> application.onopen 
                if (arg1.status == "LOADED") arg1.onOpen.dispatch();


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

                            intell.ctrl.hide(application.elementRoot);
                            $portalApplications.append(application.elementRoot);

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
                if (typeof application.init == 'function') return application.init.call(application, application);

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
                $loadingOverlay.find('.Application-Name').html(application.manifest.name);
                $loadingOverlay.find('.Application-Description').html(application.manifest.description);
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
        var $elementDropdown = $element.find('>.Dropdown');
        var $elementSearch = $elementDropdown.find('>.Search');
        var $elementSearchInput = $elementSearch.find('input');
        var $elementChildren = $elementDropdown.find('>.Children');

        var $elementItemAbstract = $element.find('.Item.abstract').removeClass('abstract').remove();

        //debugger;
        if ($elementSelect.length == 0) $elementSelect = $('<div class="Select"></div>').prependTo(element);
        if ($elementDropdown.length == 0) $elementDropdown = $('<div class="Dropdown"></div>').insertAfter($elementSelect);
        if ($elementChildren.length == 0) $elementChildren = $('<div class="Children"></div>').appendTo($elementDropdown);
        

        var __private = _this.getPrivate({});
        __private.element = element;
        __private.elementSelect = $elementSelect[0];
        __private.elementDropdown = $elementDropdown[0];
        __private.elementSearch = $elementSearch[0];
        __private.elementSearchInput = $elementSearchInput[0];
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
            //debugger;
            if ($target.closest('.Dropdown').length != 0) return;

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
        $elementSearchInput.on('keydown', async function() {
            await intell.wait(1);
            _this._setSearchKeyword(this.value);
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
    const prototype = ComboBox.prototype;
    ctrl.template.defineProperties(prototype, {
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
        value: {
            get: function() {
                var __private = this.getPrivate();
                return __private.selectedItem?.value;
            },
            set: function(newValue) {
                var __private = this.getPrivate();
                var item = __private.items.find(i => i.value == newValue);
                if (item == null) return;

                this.selectedItem = item;
            }
        },
    });

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

        if (option.name != null) item.name = option.name;
        if (option.icon != null) item.icon = option.icon;
        if (option.value != null) item.value = option.value;
        if (option.group != null) item.group = option.group;
        if (option.disabled != null) item.disabled = option.disabled;

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

        __private.items.splice(0, __private.items.length);
        __private.groups.splice(0, __private.groups.length);
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
            ctrl.showAt(__private.elementDropdown, target, __private.popupLocations, __private.popupOption);

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
            ctrl.showAt(__private.elementDropdown, target, __private.popupLocations, __private.popupOption);
            if (__private.selectedItem != null) __private.selectedItem.element.scrollIntoView({ block: "nearest" });

            if (__private.elementSearchInput != null) __private.elementSearchInput.value = "";
            _this._setSearchKeyword("");
        }

        // --3--
        if (hideOnFocusOut == true) {
            setTimeout(async function() {
                var $input = $(__private.elementSearchInput);
                $input[0]?.focus();

                $(target).on('focusout.at', async function(e) {
                    await intell.wait(1);
                    if (__private.element.contains(document.activeElement) == true) return;

                    _this.hideChildren();
                    $(target).off('focusout.at');
                })


            }, 1);
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
            ctrl.showAt(__private.elementDropdown, coord, __private.popupLocations, __private.popupOption);
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
            ctrl.showAt(__private.elementDropdown, coord, __private.popupLocations, __private.popupOption);
            if (__private.selectedItem != null) __private.selectedItem.element.scrollIntoView({ block: "nearest" });
        }

    }

    prototype.hideChildren = function() {
        var __private = this.getPrivate();
        __private.childrenVisible = false;
        $(__private.elementDropdown).hide();


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
    prototype._setSearchKeyword = function(keyword) {
        var __private = this.getPrivate();

        __private.items.forEach(item => {
            if (item.group != null) return;

            if (item.name.toLowerCase().indexOf(keyword.toLowerCase()) != -1) 
                intell.ctrl.show(item.element);
            else 
                intell.ctrl.hide(item.element);
        });

        __private.groups.forEach(g => {
            let hideCount = 0; // count number of item hidden

            intell.ctrl.show(g.element); 
            g.items.forEach(item => {
                if (item.name.toLowerCase().indexOf(keyword.toLowerCase()) != -1) {
                    intell.ctrl.show(item.element); 
                } else {
                    intell.ctrl.hide(item.element);
                    hideCount++;
                }
            });

            if (hideCount == g.items.length) intell.ctrl.hide(g.element)
        });


    }
    //prototype.
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
    var localeDecimalSeparator = (0.1).toLocaleString().substring(1, 2);   // "." in en-US
    var localeThousandSeparator = (1000).toLocaleString().substring(1, 2); // "," in en-US


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
        __private.nullable = true;
        __private.readonly = false;
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
            else if (keyCode == 38 && __private.readonly == false) {
                _this.increaseSessionBy(__private.increment); e.preventDefault();
            }
            else if (keyCode == 40 && __private.readonly == false) {
                _this.increaseSessionBy(-__private.increment); e.preventDefault();
            }
        })
        $elementInput.on('keypress', function(e) {
            if (__private.readonly == true) return false;
            if ('1234567890.,-'.indexOf(e.originalEvent.key) == -1) return false
        });
        $elementInput.on('focusout', function(e) { if (session_skiped == true) return; _this._focusout() });

        $elementUp.on('click', function() {
            if (__private.readonly == true) return;
            _this.increaseSessionBy(_this.increment)
        });
        $elementDown.on('click', function() {
            if (__private.readonly == true) return;
            _this.increaseSessionBy(-_this.increment)
        });

        $elementUp.add($elementDown).mousedown(function(ev) {
            __private.elementInput.focus();

            ev.originalEvent.preventDefault();
        })
        $element.on('mousewheel', function(ev) {
            if (__private.elementInput != document.activeElement) return;
            if (__private.readonly == true) return;

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
            set: function(newValue) {
                var __private = this.getPrivate();

                __private.nullable = newValue;

                if (__private.nullable == false && __private.value == null) {
                    this.value = 0;
                }
            }
        },
        readonly: {
            get: function() { return this.getPrivate().readonly },
            set: function(newValue) {
                var __private = this.getPrivate();

                __private.readonly = newValue
                __private.elementInput.readOnly = newValue;
            }
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
    if (globalThis.window == null) return;
    var ctrl = intell.ctrl;
    var TargetPopup = ctrl.TargetPopup;
    var targetActiveClass = 'POPUP-ATTACHED';


    // ==== constructor ====
    /** @param {HTMLElement} element */
    ctrl.TargetPopup = TargetPopup = function(element) {


        // 1. If this function is called without the new keyword, recall if with the new keyword
        // 2. If functions are not added to the prototype, create/add them

        // --1 & 1a--
        if (TargetPopup.getItem(element)) return TargetPopup.getItem(element);
        if (this instanceof TargetPopup == false) return new TargetPopup(element);

        var _this = TargetPopup.setItem(element, this);
        var $element = $(element);
        var $elementArrow = $element.find('>.Arrow');


        var __private = _this.getPrivate({});
        __private.element = element;
        __private.elementArrow = $elementArrow[0];
        __private.popupLocations = [9, 1];
        __private.popupOption = { container_mode: "auto", space: 1 };
        __private.popupDelayHideTime = 500;
        __private.isVisible = false;
        __private.isFadingOut = false;

        /** @type {HTMLElement} */
        let elementMouseDown;
        /** @type {HTMLElement} */
        let elementMouseUp;

        document.addEventListener('mousedown', function(e) {
            elementMouseDown = e.target;
        });
        document.addEventListener('mouseup', function(e) {
            elementMouseUp = e.target;

            if (__private.isVisible == false) return; // already hidden
            if (__private.isVisible == true && __private.isFadingOut == true) return; // fading out

            if (__private.element.contains(elementMouseDown) == true) return; // mousedown from inside
            if (__private.targetElement != null && __private.targetElement.contains(e.target) == true) return; // mouseup on our target

            _this.hide();
        }, { capture: true });

    }

    // ===== setup inherit ======
    ctrl.template.inherit(TargetPopup, { ctrlKey: Symbol('TargetPopup') });

    // ====== properties ======
    var prototype = TargetPopup.prototype;
    ctrl.template.defineProperties(prototype, {
        element: {
            get: function() { return this.getPrivate().element },
            set: function() { throw new Error("'TargetPopup.element' cannot be assigned to -- it is read only") }
        },
        elementArrow: {
            get: function() { return this.getPrivate().elementArrow },
            set: function() { throw new Error("'TargetPopup.elementArrow' cannot be assigned to -- it is read only") },
        },
        popupLocations: {
            get: function() { return this.getPrivate().popupLocations },
            set: function(newValue) { this.getPrivate().popupLocations = newValue }
        },
        popupOption: {
            get: function() { return this.getPrivate().popupOption },
            set: function(newValue) { this.getPrivate().popupOption = newValue }
        },
        popupDelayHideTime: {
            get: function() { return this.getPrivate().popupDelayHideTime },
            set: function(newValue) { this.getPrivate().popupDelayHideTime = newValue }
        },
    });
    

    // ====== methods ======
    prototype.showAt = function() {
        if (arguments[0] instanceof HTMLElement == true) this.showAtElement.apply(this, arguments);
        else if (typeof arguments[0] == 'object') this.showAtCoord.apply(this, arguments);
        else throw new TypeError("arguments do not match with any overloads.")
    }
    prototype.showAtElement = function(target) {
        var __private = this.getPrivate();

        // 1. if popup is fading out, stop fading
        // 2. if the new target equal current target, return
        // 3. remove active class of previous target
        // 4. set state & showAt
        // 5. setArrowPointTo

        var isVisible = __private.isVisible;
        var isFadingOut = __private.isFadingOut;
        
        // --1--
        if (isVisible == true && isFadingOut == true) intell.ctrl.stopHide(__private.element); // 2. Visible, Fadeout

        // --2--
        // if (target == __private.targetElement) return;

        // --3--
        if (__private.targetElement != null) __private.targetElement.classList.remove(targetActiveClass);

        // --4--
        __private.targetElement = target;
        __private.targetCoordinates = null;
        __private.isVisible = true;
        __private.isFadingOut = false;

        var showAtResult = intell.ctrl.showAtElement(__private.element, target, __private.popupLocations, __private.popupOption);

        __private.element.classList.add('ACTIVE');
        __private.targetElement.classList.add(targetActiveClass);

        // --5--
        if (__private.elementArrow != null) this.setArrowPointToElement(target, showAtResult.location);
    }
    prototype.showAtCoord = function(coordinates) {
        // 1. if popup is fading out, stop fading
        // 3. remove active class of previous target
        // 4. set state & showAt
        // 5. setArrowPointTo

        var __private = this.getPrivate();
        var isVisible = __private.isVisible;
        var isFadingOut = __private.isFadingOut;

        // --1--
        if (isVisible == true && isFadingOut == true) intell.ctrl.stopHide(__private.element); // 2. Visible, Fadeout

        // --3--
        if (__private.targetElement != null) __private.targetElement.classList.remove(targetActiveClass);

        // --4--
        __private.targetElement = null;
        __private.targetCoordinates = coordinates;
        __private.isVisible = true;
        __private.isFadingOut = false;

        var showAtResult = intell.ctrl.showAtCoord(__private.element, coordinates, __private.popupLocations, __private.popupOption);

        __private.element.classList.add('ACTIVE');

        // --5--
        if (__private.elementArrow != null) this.setArrowPointToCoordinates(coordinates, showAtResult.location);
    }
    prototype.hide = function() {
        var __private = this.getPrivate();
        var isVisible = __private.isVisible;
        var isFadingOut = __private.isFadingOut;

        // 5. dispatch hide event

        if (isVisible == false) return; // 1. Invisible
        else if (isVisible == true && isFadingOut == true) return; // 2. Visible, Fadeout
        else if (isVisible == true && isFadingOut == false) {
            // 4. Visible completely

            var previous_targetElement = __private.targetElement;

            // logic
            __private.isVisible = true;
            __private.isFadingOut = true;
            __private.targetElement = null;
            __private.targetCoordinates = null;

            // ui
            if (previous_targetElement != null) previous_targetElement.classList.remove(targetActiveClass);

            __private.element.classList.remove('ACTIVE');

            intell.ctrl.startHide(__private.element, __private.popupDelayHideTime, 'OUT').then(function() {
                __private.isVisible = false;
                __private.isFadingOut = false;
            });

            // --5--
            var event = new Event('targetpopuphide', { cancelable: false, bubbles: true });
            event.targetpopup = this;
            __private.element.dispatchEvent(event);
        }

    }
    prototype.setArrowPointToElement = function(target, location) {
        var $target = $(target);
        var coordinate = $target.offset();
        coordinate.left += $target.outerWidth() / 2;
        coordinate.top += $target.outerHeight() / 2;
        
        this.setArrowPointToCoordinates(coordinate, location);
    }
    prototype.setArrowPointToCoordinates = function(coordinate, location) {
        var __private = this.getPrivate()

        var $elementArrow = $(__private.elementArrow);
        var left = coordinate.left - $elementArrow.outerWidth() / 2;
        var top = coordinate.top - $elementArrow.outerHeight() / 2;

        $elementArrow.removeClass('LEFT UP RIGHT DOWN').css({ left: '', top: '' });


        if (location <= 3) $elementArrow.offset({ left: left }).addClass('DOWN');
        else if (location <= 6) $elementArrow.offset({ top: top }).addClass('LEFT');
        else if (location <= 9) $elementArrow.offset({ left: left }).addClass('UP');
        else $elementArrow.offset({ top: top }).addClass('RIGHT');
    }

    // ==== static methods ====
    TargetPopup.showAt = function() {
        if (arguments[1] instanceof HTMLElement == true) return TargetPopup.showAtElement.apply(TargetPopup, arguments);
        else return TargetPopup.showAtCoord.apply(TargetPopup, arguments);
    }
    TargetPopup.showAtElement = function(element, target, locations, option) {
        var targetPopup = new TargetPopup(element);
        if (locations != null) targetPopup.popupLocations = locations;
        if (option != null) targetPopup.popupOption = option;

        targetPopup.showAt(target);
        return targetPopup;
    }
    TargetPopup.showAtCoord = function(element, coordinate, locations, option) {
        var targetPopup = new TargetPopup(element);
        if (locations != null) targetPopup.popupLocations = locations;
        if (option != null) targetPopup.popupOption = option;

        targetPopup.showAt(coordinate);
        return targetPopup;
    }
}()
!function() {
    if (globalThis.window == null) return;
    var ctrl = intell.ctrl;
    var Time = ctrl.Time;

    const ACTIVE_CLASS = "ACTIVE";

    // ====== constructor =======
    /**@param {HTMLElement} element */
    Time = function(element) {
        
        // 1. If this function is called without the new keyword, recall if with the new keyword
        // 2. setup
        // 3. register handler events

        // --1 & 1a--
        if (Time.getItem(element)) return Time.getItem(element);
        if (this instanceof Time == false) return new Time(element);

        // --2--
        var _this = Time.setItem(element, this);
        var $element = $(element);
        var $elementHours = $element.find('.Hours');
        var $elementMinutes = $element.find('.Minutes');
        var $elementSeconds = $element.find('.Seconds');
        var $elementMilliseconds = $element.find('.Milliseconds');
        
        if ($elementHours.length == 0) $elementHours = $('<div class="Unit Hours"><div class="Value"></div></div>').appendTo(element);
        if ($elementMinutes.length == 0) $elementMinutes = $('<div class="Unit Minutes">:<div class="Value"></div></div>').appendTo(element);
        if ($elementSeconds.length == 0) $elementSeconds = $('<div class="Unit Seconds">:<div class="Value"></div></div>').appendTo(element);
        if ($elementMilliseconds.length == 0) $elementMilliseconds = $('<div class="Unit Milliseconds">.<div class="Value"></div></div>').appendTo(element);

        if (element.tabIndex == -1) element.tabIndex = 0;

        var __private = _this.getPrivate({});
        __private.element = element;
        __private.elementHours = $elementHours[0];
        __private.elementMinutes = $elementMinutes[0];
        __private.elementSeconds = $elementSeconds[0];
        __private.elementMilliseconds = $elementMilliseconds[0];
        __private.value = null;
        __private.nullable = true;
        __private.max = 23 * 3600000 + 59 * 60000 + 59 * 1000 + 999;
        __private.secondsEnabled = true;
        _this.millisecondsEnabled = false;

        this.updateElementLabels();

        // --3--
        $element.focus(function() { _this._focus() });
        $element.mousedown(function(e) { _this._mousedown(e.originalEvent) });
        $element.keydown(function(e) { _this._keydown(e.originalEvent) });
        $element.focusout(function() { _this._focusout() });
        element.addEventListener('wheel', function(e) { _this._wheel(e) });
    }
    ctrl.Time = Time;

    // ===== setup inherit ======
    ctrl.template.inherit(Time, { ctrlKey: Symbol('Time') });

    // ====== properties ======
    var prototype = Time.prototype;
    ctrl.template.defineProperties(prototype, {
        element: {
            get: function() { return this.getPrivate().element },
            set: function() { throw new Error("'Time.element' cannot be assigned to -- it is read only") }
        },
        elementHours: {
            get: function() { return this.getPrivate().elementHours },
            set: function() { throw new Error("'Time.elementHours' cannot be assigned to -- it is read only") }
        },
        elementMinutes: {
            get: function() { return this.getPrivate().elementHours },
            set: function() { throw new Error("'Time.elementHours' cannot be assigned to -- it is read only") }
        },
        elementSeconds: {
            get: function() { return this.getPrivate().elementHours },
            set: function() { throw new Error("'Time.elementHours' cannot be assigned to -- it is read only") }
        },
        elementMilliseconds: {
            get: function() { return this.getPrivate().elementMilliseconds },
            set: function() { throw new Error("'Time.elementMilliseconds' cannot be assigned to -- it is read only") }
        },
        value: {
            get: function() { return this.getPrivate().value },
            set: function(newValue) { this.setValue(newValue) },
        },
        nullable: {
            get: function() { return this.getPrivate().nullable },
            set: function(newValue) {
                var __private = this.getPrivate();
                
                if (__private.nullable == newValue) return;
                __private.nullable = newValue;

                if (newValue == false && __private.value == null) this.value = 0;
            }
        }, 
        max: {
            get: function() { return this.getPrivate().max },
            set: function(newValue) {
                var __private = this.getPrivate();

                if (__private.max == newValue) return;
                __private.max = newValue;

                this.updateElementLabels();
            }
        },

        secondsEnabled: {
            get: function() { return this.getPrivate().secondsEnabled },
            set: function(newValue) {
                var __private = this.getPrivate();

                __private.secondsEnabled = newValue;

                if (newValue == false) {
                    this.millisecondsEnabled = false;
                    ctrl.hide(__private.elementSeconds);
                }
                else ctrl.show(__private.elementSeconds);
            }
        },
        millisecondsEnabled: {
            get: function() { return this.getPrivate().millisecondsEnabled },
            set: function(newValue) {
                var __private = this.getPrivate();               

                __private.millisecondsEnabled = newValue;

                if (newValue == false) ctrl.hide(__private.elementMilliseconds);
                else ctrl.show(__private.elementMilliseconds);
            }
        }

    });

    // ====== methods ======
    prototype.setValue = function(newValue, keepLabel) {
        var __private = this.getPrivate();
        var oldValue = __private.value;
        var newValue = parseInt(newValue);

        if (keepLabel == null) keepLabel = false;

        // 1. check
        //   a. treat NaN as null
        //   b. exit because nothing was changed
        //   c. exit because we are not allow null
        //   d. newValue is not number
        // 2. cap [min;max]

        // --1-
        if (isNaN(newValue) == true) newValue = null;
        if (newValue == oldValue) return;
        if (newValue == null && __private.nullable == false) return;
        if (newValue != null && typeof newValue != 'number') return;


        // --2--
        if (newValue != null && newValue < 0) newValue = 0;
        if (newValue != null && newValue > __private.max) newValue = __private.max;

        // --3--
        if (newValue != null) {
            var hhmmss = Time.getHHMMSS(newValue);
            __private.hours = hhmmss.hours;
            __private.minutes = hhmmss.minutes;
            __private.seconds = hhmmss.seconds;
            __private.milliseconds = hhmmss.milliseconds;
        } else {
            if (keepLabel == false) {
                __private.hours = null;
                __private.minutes = null;
                __private.seconds = null;
                __private.milliseconds = null;
            }
        }
        __private.value = newValue;

        this.updateElementLabels();
    }
    prototype.getUnitElement = function(name) {
        var __private = this.getPrivate();

        if (name == "hours") return __private.elementHours;
        if (name == "minutes") return __private.elementMinutes;
        if (name == "seconds") return __private.elementSeconds;
        if (name == "milliseconds") return __private.elementMilliseconds;
    }

    // ====== protected methods ======
    prototype.getEditName = function(target) {
        var __private = this.getPrivate();

        if (__private.elementHours.contains(target)) return "hours";
        else if (__private.elementMinutes.contains(target)) return "minutes";
        else if (__private.elementSeconds.contains(target)) return "seconds";
        else if (__private.elementMilliseconds.contains(target)) return "milliseconds";
    }
    prototype.setEditName = function(name) {
        var __private = this.getPrivate();

        if (name !== "hours" && name != "minutes" && name != "seconds" && name != "milliseconds") throw new Error("'name' must be 'hours', 'minutes', 'seconds' or 'milliseconds'");
        if (__private.currentUnitName == name) return;

        __private.currentUnitName = name;
        __private.currentNumbers = 0;
        

        $([__private.elementHours, __private.elementMinutes, __private.elementSeconds, __private.elementMilliseconds]).removeClass(ACTIVE_CLASS);

        this.getUnitElement(name).classList.add(ACTIVE_CLASS);
    }
    prototype.setEditValue = function(name, newUnitValue) {
        // 1. cap min
        // 2. cap max for seconds, minutes and hours
        // 3. set value to element
        var __private = this.getPrivate();

        // --1--
        if (newUnitValue < 0) newUnitValue = 0;
        if (__private.nullable == false && newUnitValue == null) newUnitValue = 0;

        // --2--
        if (newUnitValue != null) { 
            switch (name) {
                case "hours":
                    var hhmmss = Time.getHHMMSS(__private.max);
                    if (newUnitValue > hhmmss.hours) newUnitValue = hhmmss.hours;
                    break;
                case "minutes": if (newUnitValue > 59) newUnitValue = 59; break;
                case "seconds": if (newUnitValue > 59) newUnitValue = 59; break;
                case "milliseconds": if (newUnitValue > 999) newUnitValue = 999; break;
            }
        }
        __private[name] = newUnitValue;

        // --3--
        this.updateElementLabel(name, newUnitValue);
    }
    prototype.updateElementLabel = function(name, value) {
        var __private = this.getPrivate();
        var element = this.getUnitElement(name);
        var text = '';
        var length = 0;

        if (name == 'hours') length = Time.GetLengthOfNumber(Time.getHHMMSS(__private.max).hours);
        else if (name == 'milliseconds') length = 3;
        else length = 2;
        
        text = value == null ? '-'.repeat(length) : value.toString().padStart(length, '0');

        element.querySelector(':scope>.Value').textContent = text;
    }
    prototype.updateElementLabels = function() {
        var __private = this.getPrivate();
        var value = __private.value;

        if (value == null) {
            this.updateElementLabel('hours', __private.hours);
            this.updateElementLabel('minutes', __private.minutes);
            this.updateElementLabel('seconds', __private.seconds);
            this.updateElementLabel('milliseconds', __private.milliseconds);
        } else {
            var hhmmss = Time.getHHMMSS(value);

            this.updateElementLabel('hours', hhmmss.hours);
            this.updateElementLabel('minutes', hhmmss.minutes);
            this.updateElementLabel('seconds', hhmmss.seconds);
            this.updateElementLabel('milliseconds', hhmmss.milliseconds);
        }
    }

    // ====== methods events ======
    prototype._focus = function() {
        var __private = this.getPrivate();
        if (__private.currentUnitName == null) this.setEditName("hours");

        __private.save_hours = __private.hours;
        __private.save_minutes = __private.minutes;
        __private.save_seconds = __private.seconds;
        __private.save_milliseconds = __private.milliseconds;
    }
    prototype._mousedown = function(e) {
        var name = this.getEditName(e.target);
        if (name) this.setEditName(name);
    }
    prototype._wheel = function(e) {
        if (e.ctrlKey == true) return;
        
        var __private = this.getPrivate();
        var name = __private.currentUnitName;
        if (name == null) return;

        var currentUnitValue = __private[name] ?? 0;
        var increasement = e.deltaY < 0 ? 1 : -1;
        var newUnitValue = currentUnitValue + increasement;

        this.setEditValue(name, newUnitValue);

        e.preventDefault();
    }
    prototype._keydown = function(e) {
        var __private = this.getPrivate();
        var keycode = e.keyCode;

        if (keycode == 37) { this._keydownLeft(); e.preventDefault(); }
        if (keycode == 39) { this._keydownRight(); e.preventDefault(); }
        if (keycode == 8 || keycode == 46) this._keydownDel();
        if (keycode == 27) this._keydownEsc();

        if (keycode == 38 || keycode == 40) {
            var name = __private.currentUnitName; if (name == null) return;
            var currentUnitValue = __private[name] ?? 0;
            var increasement = keycode == 38 ? 1 : -1;
            var newUnitValue = currentUnitValue + increasement;

            this.setEditValue(name, newUnitValue);

            e.preventDefault();
        }

        if (e.key === parseInt(e.key).toString()) {
            // internal handle number key press
            // 1. calculate newUnitValue from keycode. number (0-9)
            //   a. if current is seconds and newUnitValue > 59 and user press 3 time, newUnitValue is new input
            // 2. setEditValue to handle new value
            // 3. move to next if possible

            var name = __private.currentUnitName; if (name == null) return;
            var inputNumber = parseInt(e.key);
            var currentUnitValue = __private[name]; if (currentUnitValue == null) currentUnitValue = 0;

            __private.currentNumbers++;

            // --1--
            var newUnitValue = 0;
            if (__private.currentNumbers == 1) newUnitValue = inputNumber;
            else newUnitValue = currentUnitValue * 10 + inputNumber;

            // --1a--
            if (name == "seconds" && __private.currentNumbers >= 3) {
                newUnitValue = newUnitValue % 100;
                if (newUnitValue > 59) {
                    newUnitValue = inputNumber;
                    __private.currentNumbers = 1;
                }

            } else if (name == "milliseconds") newUnitValue = newUnitValue % 1000;

            // --2--
            this.setEditValue(name, newUnitValue);

            // --3-
            var moveNext = false;

            if (name == "hours") {
                var hhmmss = Time.getHHMMSS(__private.max);

                if (hhmmss.hours <= 23 && __private.hours > 2) moveNext = true;
                else if (__private.currentNumbers >= Time.GetLengthOfNumber(hhmmss.hours)) moveNext = true;
            }
            else if (name == "minutes") {
                if (__private.minutes > 5) moveNext = true;
                else if (__private.currentNumbers >= 2) moveNext = true;
            }
            else if (name == "seconds") {
                if (__private.seconds > 5) moveNext = true;
                else if (__private.currentNumbers >= 2) moveNext = true;
            }

            if (moveNext == true) this._keydownRight();
        }
    }
    prototype._keydownLeft = function() {
        var __private = this.getPrivate();

        if (__private.currentUnitName == "minutes") this.setEditName("hours")
        else if (__private.currentUnitName == "seconds") this.setEditName("minutes")
        else if (__private.currentUnitName == "milliseconds") this.setEditName("seconds")
    }
    prototype._keydownRight = function() {
        var __private = this.getPrivate();
        var name = __private.currentUnitName;

        if (name == 'hours') this.setEditName("minutes")
        else if (name == 'minutes' && __private.secondsEnabled == true) this.setEditName("seconds")
        else if (name == 'seconds' && __private.millisecondsEnabled == true) this.setEditName("milliseconds")
    }
    prototype._keydownDel = function() {
        var __private = this.getPrivate();
        var name = __private.currentUnitName;
        if (name == null) return;

        this.setEditValue(name, null);
    }
    prototype._keydownEsc = function() {
        var __private = this.getPrivate();

        __private.hours = __private.save_hours;
        __private.minutes = __private.save_minutes;
        __private.seconds = __private.save_seconds;
        __private.milliseconds = __private.save_milliseconds;

        __private.element.blur();
    }
    prototype._focusout = function() {

        // 0. clear editing state, remove ACTIVE_CLASS class
        // 1. parse newValue
        // 2. if newValue equal current value, reset text & return
        // 3. change value
        //    a. can't change value, because of cap min max. reset text
        //    b. can


        /** @type intell.ctrl.Time */
        var _this; _this = this;
        var __private = this.getPrivate();

        
        // --0--
        __private.currentUnitName = null;

        $([__private.elementHours, __private.elementMinutes, __private.elementSeconds, __private.elementMilliseconds]).removeClass(ACTIVE_CLASS);

        // --1--
        var newValue = 0; newValue = null;


        newValue = function() {
            var v = 0;

            if (__private.hours == null) return null;
            else v += __private.hours * 3600000;

            if (__private.minutes == null) return null;
            else v += __private.minutes * 60000;

            if (__private.secondsEnabled == true && __private.seconds == null) return null;
            else v += (__private.seconds == null ? 0 : __private.seconds) * 1000;

            if (__private.millisecondsEnabled == true && __private.milliseconds == null) return null;
            else v += __private.milliseconds == null ? 0 : __private.milliseconds;

            return v;
        }();

        // --2--
        if (__private.value == newValue) {
            this.updateElementLabels();
            return;
        }

        // --3--
        
        var oldValue = __private.value;
        this.setValue(newValue, true);
        
        if (_this.value == oldValue) {
            // --3a--
            this.updateElementLabels();
        } else {
            // --3b--
            var event = new Event('timechange', { cancelable: false, bubbles: true });
            event.time = _this;
            __private.element.dispatchEvent(event);
        }

        //this.value = __private.hours, __private.minutes, __private.seconds

        //__private.hours = null;
        //__private.minutes = null;
        //__private.seconds = null;
        

    }
    

    // ==== static methods ====
    Time.getHHMMSS = function(value) {
        var remaining = value;
        var hours = Math.floor(remaining / 3600000); remaining -= hours * 3600000;
        var minutes = Math.floor(remaining / 60000); remaining -= minutes * 60000;
        var seconds = Math.floor(remaining / 1000); remaining -= seconds * 1000;
        var milliseconds = remaining % 1000;

        return { hours: hours, minutes: minutes, seconds: seconds, milliseconds: milliseconds };
    }
    Time.GetLengthOfNumber = function(value) {
        value = Math.abs(value);
        if (value == 0) return 1;

        return Math.ceil(Math.log10(value + 1));
    }
}()
!function() {
    /* definition
        Menu has 3 states:
        - visible
        - invisible-Fadingout
        - invisible
    */


    if (globalThis.window == null) return;
    var ctrl = intell.ctrl;
    var Menu = ctrl.Menu;

    const ROOT_CLASS = "ROOT";
    const ACTIVE_CLASS = "ACTIVE";
    const HAS_CHILDREN_CLASS = "HAS-CHILDREN";
    const CHILDREN_VISIBLE_CLASS = "CHILDREN-VISIBLE";
    const CHILDREN_FADEOUT_CLASS = "CHILDREN-OUT";
    const FADEOUT_CLASS = null; // "OUT";
    const FIRST_ACTIVE_CLASS = "FIRST";

    const defaultElementMenuAbstractHTML = `<div class="X-Menu">
    <div class="Label">
        <div class="Icon"></div>
        <div class="Name"></div>
    </div>
</div>`;

    // ====== constructor =======
    /** @param {HTMLElement} element */
    Menu = function(element) {

        // 1. If this function is called without the new keyword, recall if with the new keyword
        // 2.
        // 3. default
        // 4. set __private

        if (element == null) element = $(defaultElementMenuAbstractHTML)[0];

        // --1 & 1a--
        if (Menu.getItem(element)) return Menu.getItem(element);
        if (this instanceof Menu == false) return new Menu(element);


        // --2--
        var _this = Menu.setItem(element, this);
        var $element = $(element).addClass(ROOT_CLASS);
        var $label = $element.find('>.Label'); 
        var $icon = $label.find('.Icon');
        var $name = $label.find('.Name');
        var $children = $element.find('>.Children');
        var $intersect = $children.find('>.Intersect');
        var $elementMenuAbstract = $element.find('>.X-Menu.Abstract').removeClass('Abstract').remove();

        // --3--
        if ($label.length == 0) $label = $('<div class="Label"></div>').prependTo(element);
        if ($icon.length == 0) $icon = $('<div class="Icon"></div>').prependTo($label);
        if ($name.length == 0) $name = $('<div class="Name"></div>').appendTo($label);


        // --4--
        var __private = _this.getPrivate({});
        __private.element = element;
        __private.elementLabel = $label[0];
        __private.elementIcon = $icon[0];
        __private.elementName = $name[0];
        __private.elementChildren = $children[0];
        __private.elementIntersect = $intersect[0];
        __private.elementMenuAbstract = $elementMenuAbstract[0];

        __private.parent = null;
        __private.children = [];

        __private.rootLocations = [9, 1];
        __private.rootOption = { container_mode: "auto", space: -1 }
        __private.rootFadeOutTime = 0;
        __private.childLocations = [4, 12];
        __private.childOption = { container_mode: "auto", margin: 0 };
        __private.childFadeOutTime = 500;
        __private.active = false;
        __private.childrenVisible = false;
        __private.childrenFadingOut = false;

        // predefine
        !function() {
            var menu_elements = $children.find('>.X-Menu').toArray();
            
            menu_elements.forEach(element => _this.add(new Menu(element)));
        }();
        

        // handle events
        element.addEventListener('focus', function() { _this.active = true });
        element.addEventListener('mousedown', function(e) {
            // note: occurs when user click on any elements within it

            // 1. ignore if it is from the children Menu
            // 2. if this menu has children, active and showChildren

            // --1--
            var closest_element = ctrl.findClosestElement(e.target, value => Menu.getItem(value) != null);
            if (closest_element != element) return;

            // console.log('mousedown GOOD', this, e, e.target, e.relatedTarget);

            // --2--
            if (_this.children.length != 0) {
                _this.active = true;
                _this.childrenVisible = true;

                if (_this.parent == null) element.focus();

                e.preventDefault();
            }

        }, true);
        element.addEventListener('mouseup', function(e) {
            // 1. ignore if mouseup is not left mouse
            // 2. ignore if it is from the children Menu
            // 3. if this menu has children, dispatch event
            //    a. dispatch event
            //    b. hide all

            // --1--
            if (e.button != 0) return;

            // --2--
            var closest_elementMenu = ctrl.findClosestElement(e.target, value => Menu.getItem(value) != null);
            if (closest_elementMenu != element) return;

            // --3--
            if (_this.children.length == 0) _this._dispatchEvent_menuclick(_this);
        });

        element.addEventListener('mouseenter', function(e) {
            if (_this.parent == null) return;

            _this.active = true;
            _this.childrenVisible = true;
        });
        element.addEventListener('mouseout', function(e) {

            // note:
            //    occurs when mouse leave "target", even if the pointer is still within the "element"
            // 1. make sure to completely leave the "element"
            // 2. prevent calls many times, because we don't want to trigger its parent
            // 3. when mouseout
            //     a. not from .Children
            //     b.     from .Children

            /** @type HTMLElement */
            var target = e.target;
            

            // --1--
            if (this.contains(e.relatedTarget) == true) return;

            // --2--
            var closest_elementMenu = ctrl.findClosestElement(target, value => Menu.getItem(value) != null);
            if (element != closest_elementMenu) return;

            // --3--
            if (target.matches('.Children') == false) {
                // --3a--

                if (_this.parent == null) {

                } else {
                    _this.active = false;
                    _this.childrenVisible = false;
                }
            }
        });
        element.addEventListener('keydown', e => _this._keydown_arrow_or_enter(e));
        element.addEventListener('focusout', function(e) {
            var root = _this.getRoot();

            //console.log('Menu.foucusout', _this, e, document.activeElement);

            if (_this !== root) return;
            if (_this.element == document.activeElement) return;

            
            _this.active = false;
            _this.childrenVisible = false;
        });
        window.addEventListener('click', function(e) {
            //var root = _this.getRoot();
            //
            //if (_this !== root) return;
            //if (__private.element.contains(e.target) == true) return;

            // if (document.activeElement  __private.element.isfo
            //_this.active = false;
            //_this.childrenVisible = false;
            //
            //console.log('click document.activeElement', document.activeElement);
        });

    }
    ctrl.Menu = Menu;

    
    // ===== setup inherit ======
    var prototype = Menu.prototype;
    ctrl.template.inherit(Menu, { ctrlKey: Symbol('Menu') });

    // ====== properties ======    
    ctrl.template.defineProperties(prototype, {
        element: {
            get: function() { return this.getPrivate().element },
            set: function() { throw new Error("'Menu.element' cannot be assigned to -- it is read only") }
        },
        elementChildren: {
            get: function() { return this.getPrivate().elementChildren },
            set: function() { throw new Error("'Menu.elementChildren' cannot be assigned to -- it is read only") }
        },
        elementLabel: {
            get: function() { return this.getPrivate().elementLabel },
            set: function() { throw new Error("'Menu.elementLabel' cannot be assigned to -- it is read only") }
        },
        elementIcon: {
            get: function() { return this.getPrivate().elementIcon },
            set: function() { throw new Error("'Menu.elementIcon' cannot be assigned to -- it is read only") }
        },
        elementName: {
            get: function() { return this.getPrivate().elementName },
            set: function() { throw new Error("'Menu.elementName' cannot be assigned to -- it is read only") }
        },
        elementIntersect: {
            get: function() { return this.getPrivate().elementIntersect },
            set: function() { throw new Error("'Menu.elementIntersect' cannot be assigned to -- it is read only") }
        },
        elementMenuAbstract: {
            get: function() { return this.getPrivate().elementMenuAbstract },
            set: function() { throw new Error("'Menu.elementItemAbstract' cannot be assigned to -- it is read only") }
        },
        icon: {
            get: function() { return this.getPrivate().icon },
            set: function(newValue) {
                var __private = this.getPrivate();

                __private.elementIcon.textContent = __private.icon = newValue;
            }
        },
        name: {
            get: function() { return this.getPrivate().elementName?.textContent },
            set: function(newValue) {
                var __private = this.getPrivate();

                __private.elementName.textContent = __private.name = newValue;
            }
        },

        parent: {
            get: function() { return this.getPrivate().parent },
            set: function() { throw new Error("'Menu.menuParent' cannot be assigned to -- it is read only") }
        },
        children: {
            get: function() { return this.getPrivate().children.slice() },
            set: function() { throw new Error("'Menu.children' cannot be assigned to -- it is read only") }
        },

        rootLocations: {
            get: function() { return this.getPrivate().rootLocations },
            set: function(newValue) { this.getPrivate().rootLocations = newValue },
        },
        rootOption: {
            get: function() { return this.getPrivate().rootOption },
            set: function(newValue) { this.getPrivate().rootOption = newValue },
        },
        rootFadeOutTime: {
            get: function() { return this.getPrivate().rootFadeOutTime },
            set: function(newValue) { this.getPrivate().rootFadeOutTime = newValue },
        },
        childLocations: {
            get: function() { return this.getPrivate().childLocations },
            set: function(newValue) { this.getPrivate().childLocations = newValue },
        },
        childOption: {
            get: function() { return this.getPrivate().childOption },
            set: function(newValue) { this.getPrivate().childOption = newValue },
        },
        childFadeOutTime: {
            get: function() { return this.getPrivate().childFadeOutTime },
            set: function(newValue) { this.getPrivate().childFadeOutTime = newValue },
        },
        active: {
            get: function() { return this.getPrivate().active },
            set: function(newValue) {
                var __private = this.getPrivate();

                if (__private.active == newValue) return;

                // 1. set ACTIVE class
                // 2. When active equal true
                //    a. deactive other brothers 
                // 3. when active equal false
                //    a. children must be deactive too
                

                // --1--
                __private.element.classList.toggle(ACTIVE_CLASS, newValue);
                __private.active = newValue;

                if (newValue == true) {
                    // --2a--
                    var parent = __private.parent;
                    if (parent == null) return;
                    var brothers = parent.children;  // our brothers
                    var deactived = false; 

                    brothers.forEach(brother => {
                        if (brother != this && brother.active == true) {
                            brother.active = false;

                            if (brother.childrenVisible == true) {
                                brother.childrenVisible = false;
                                deactived = true;
                            }

                        }
                    });


                    parent.active = true;
                    parent.childrenVisible = true;
                } else {
                    // --3a--
                    __private.element.classList.remove("FIRST");
                    __private.children.forEach(function(value) { value.active = false });
                }
            }
        },
        childrenVisible: {
            get: function() { return this.getPrivate().childrenVisible },
            set: function(newValue) {
                
                var __private = this.getPrivate();
                var parent = __private.parent;

                // 1. exit if already in the same state
                // 2. When active equal true
                //    a. before show children, others brothers must be hidden
                // 3. When active equal false
                //    a.


                // --1--
                //if (this == root) return;
                if (__private.childrenVisible == newValue) return;
                

                
                if (newValue == true) {
                    // --2a--
                    if (parent != null) {
                        parent.children.forEach(value => {
                            if (value == this) return;
                            var value__private = value.getPrivate();

                            if (__private.children.length == 0) {

                            } else {
                                if (value__private.childrenVisible == true || value__private.childrenFadingOut == true) {
                                    value.hideChildrenImmediately();
                                }
                            }
                        });
                    }

                    this.showChildrenAt(__private.element)

                } else {
                    // --3a--
                    this.hideChildren();
                }

            }
        }
    });

    // ====== methods ======
    prototype.getRoot = function() {
        var menu = this;
        
        while (true) {
            var parent = menu.parent;

            if (parent == null) return menu;
            else menu = parent;
        }
    }
    prototype.getHighestActive = function() {

        // algorithm: if this is active, look for children
        // 1. this is not active
        // 2. look for active in our children

        var __private = this.getPrivate();

        // --1--
        if (__private.active == false) return null;

        // --2--
        var child = __private.children.find(child => child.active == true);

        if (child == null) return this;
        else return child.getHighestActive();
    }

    prototype.add = function() {
        if (arguments.length == 1 && typeof arguments[0] == "string") return this.addName.apply(this, arguments);
        if (arguments.length == 1 && arguments[0] instanceof Menu == true) return this.addMenu.apply(this, arguments);
        if (arguments.length == 1 && typeof arguments[0] == "object") return this.addOption.apply(this, arguments);

        throw new Error("arguments do not match with any overloads.")
    }
    prototype.addName = function(name) { return this.addOption({ name: name }) }
    prototype.addMenu = function(child) {
        var __parent = this.getPrivate();
        var __child = child.getPrivate();

        // 1. add child to the parent AND set this as parent of new child
        // 2. ui/ux
        //      a. if parent don't have elementChildren, create it
        //      b. [Predefine] ignore if the element of the child is already placed in the parent
        // 3. [Feature] remove ROOT_CLASS because the menu doesn't have a parent

        if (child.parent != null) throw new Error("Menu is already added to another menu.");
        if (__parent.children.indexOf(child) == true) return;

        // --1--
        __parent.children.push(child);
        __child.parent = this;

        // --2a--
        if (__parent.elementChildren == null) __parent.elementChildren = $('<div class="Children"></div>').appendTo(__parent.element)[0];
        if (__parent.elementIntersect == null) __parent.elementIntersect = $('<div class="Intersect"></div>').appendTo(__parent.elementChildren)[0];            
        

        // --2b--
        if (__child.element.parentElement != __parent.elementChildren)
            __parent.elementChildren.appendChild(__child.element);

        // --3--
        __child.element.classList.remove(ROOT_CLASS);

        this.checkHasChildren();
    }
    prototype.addOption = function(option) {
        var root = this.getRoot();
        var element = root.elementMenuAbstract != null ? root.elementMenuAbstract.cloneNode(true) : null;
        var menu = new Menu(element);

        if (option.name != null) menu.name = option.name;
        if (option.icon != null) menu.icon = option.icon;

        this.addMenu(menu);

        return menu;
    }
    prototype.addSeparator = function() {
        var $separator = $('<div class="X-Separator"></div>');
        $separator.appendTo(this.elementChildren);
        return $separator[0];
    }

    prototype.remove = function() {
        var __private = this.getPrivate();
        var parent = __private.parent;

        if (parent == null) return;

        parent.removeChildren(this);
    }
    prototype.removeChildren = function(node) {
        var __parent = this.getPrivate();
        var __child = node.getPrivate();
        var children = __parent.children;

        // 1. return false if the menu is not the child of its parent
        // 2. remove from array, remove from ui
        // 3. child no longer have parent

        // --1--
        var index = children.indexOf(node);
        if (index == -1) return false;

        // --2--
        children.splice(index, 1);
        if (__parent.elementChildren.contains(__child.element) == true) __child.element.remove();
        this.checkHasChildren();

        // --3--
        __child.parent = null;
        __child.element.classList.add(ROOT_CLASS);
        return true;
    }
    prototype.clear = function() {
        var __private = this.getPrivate();
        var children = __private.children;

        children.slice().forEach(child => child.remove());
    }

    prototype.showChildrenAt = function() {
        if (arguments[0] instanceof HTMLElement == true) this.showChildrenAtElement.apply(this, arguments);
        else if (typeof arguments[0] == 'object') this.showChildrenAtCoord.apply(this, arguments);
        else throw new TypeError("arguments do not match with any overloads.")
    }
    prototype.showChildrenAtRect = function(target, locations, option) {
        // Visible
        //  FadingOut
        // Invisible

        // 1. default value
        // 2. exit if children are already visible
        // 3. children are completely invisible
        //    a. show children
        //    b. [Feature] calculate position, size for elementIntersect
        // 4. children are in the fading-out process
        

        var __private = this.getPrivate();
        if (__private.children.length == 0) return;

        var root = this.getRoot();

        // --1--
        if (locations == null) locations = this == root ? root.rootLocations : root.childLocations;
        if (option == null) option = this == root ? root.rootOption : root.childOption;

        var element = __private.element;
        var elementChildren = __private.elementChildren;
        var elementIntersect = __private.elementIntersect;

        // --2--
        if (__private.childrenVisible == true) return;

        
        if (__private.childrenFadingOut == false) {
            // --3a--
            var result = ctrl.showAt(elementChildren, target, locations, option);
            element.classList.add(CHILDREN_VISIBLE_CLASS)

            // --3b--
            var a = ctrl.getBoundingClientRectOffset(element);
            var b = result.rect;
            var intersect = ctrl.rectIntersect(a, b);

            if (intersect == null) ctrl.hide(elementIntersect);
            else {
                $(elementIntersect).offset({ left: intersect.left, top: intersect.top });
                elementIntersect.style.width = intersect.width + 'px';
                elementIntersect.style.height = intersect.height + 'px';
                ctrl.show(elementIntersect);
            }
        }
        else {
            // --4--
            __private.childrenFadingOut = false;

            element.classList.add(CHILDREN_VISIBLE_CLASS)
            ctrl.stopHide(elementChildren);
        }
        this.getRoot().element.focus({ preventScroll: true });
        __private.childrenVisible = true;
        
    }
    prototype.showChildrenAtElement = function(target, locations, option) {
        var target = ctrl.getBoundingClientRectOffset(target);

        return this.showChildrenAtRect(target, locations, option);
    }
    prototype.showChildrenAtCoord = function(coord, locations, option) {
        var target = new DOMRect(coord.x ?? coord.left, coord.y ?? coord.top, 0, 0);

        return this.showChildrenAtRect(target, locations, option);
    }
    
    prototype.hideChildren = function() {

        // 1. exit if children are already hiding, or in the fading-out process
        // 2. try to get delayHideTime
        // 3. if delayHideTime = 0
        //     a. equal = 0, hide immediately
        //     b. start the hiding process
        // 4. hide the children and deactive them too


        var __private = this.getPrivate();

        // --1--
        if (__private.childrenVisible == false || __private.childrenFadingOut == true) return;

        // --2--
        var element = __private.element;
        var elementChildren = __private.elementChildren;
        var root = this.getRoot();
        var delayHideTime = this == root ? root.rootFadeOutTime : root.childFadeOutTime;

        // --3a--
        if (delayHideTime == 0) this.hideChildrenImmediately();
        else {
            // --3b-- 
            __private.childrenVisible = false;
            __private.childrenFadingOut = true;

            element.classList.remove(CHILDREN_VISIBLE_CLASS);
            element.classList.add(CHILDREN_FADEOUT_CLASS);

            ctrl.startHide(elementChildren, delayHideTime, FADEOUT_CLASS).then(() => {
                element.classList.remove(CHILDREN_FADEOUT_CLASS);

                __private.childrenFadingOut = false;
                
                // menuclose event will be triggered when children hide
                var event = new Event("menuclose", { bubbles: true, cancelable: true });
                event.menu = this;
                __private.element.dispatchEvent(event);
            });

            // --4--
            __private.children.forEach(child => {
                var child__private = child.getPrivate();
                if (child__private.active == true) child.active = false;
                child.hideChildren()
            });
        };
    }
    prototype.hideChildrenImmediately = function() {
        var __private = this.getPrivate();
        var element = __private.element;
        var elementChildren = __private.elementChildren;

        // 1. if children are completely hidden, exit
        // 2. stop the fading-out process and hide elementChildren immediately
        //    a. remove classes
        // 3. hide the children too and deactive them too

        // --1--
        if (__private.childrenVisible == false && __private.childrenFadingOut == false) return;

        __private.childrenVisible = false;
        __private.childrenFadingOut = false;

        // --2--
        ctrl.stopHide(elementChildren); ctrl.hide(elementChildren);
        element.classList.remove(CHILDREN_VISIBLE_CLASS, CHILDREN_FADEOUT_CLASS);
        elementChildren.classList.remove(FIRST_ACTIVE_CLASS);

        // --3--
        __private.children.forEach(function(child) {
            var child__private = child.getPrivate();
            if (child__private.active == true) child.active = false;
            if (child__private.childrenVisible == true || child__private.childrenFadingOut == true) {
                child.hideChildrenImmediately();
            }
        })

        // menuclose event will be triggered when children hide
        var event = new Event("menuclose", { bubbles: true, cancelable: true });
        event.menu = this;
        __private.element.dispatchEvent(event);
    }
    prototype.checkHasChildren = function() {
        var __private = this.getPrivate();
        var children = __private.children;
        
        __private.element.classList.toggle(HAS_CHILDREN_CLASS, children.length != 0);

        if (children.length == 0 && __private.childrenVisible == true) this.hideChildrenImmediately()
    }

    // ====== methods - ui events ======
    prototype._keydown_arrow_or_enter = function(e) {

        var key = e.key;
        var menu = this.getHighestActive();
        if (menu == null) return;

        var parent = menu.parent;

        // 1. root
        // 2. child
        
        if (parent == null) {
            // --1--
            if (key == "ArrowLeft" || key == "ArrowRight") {

            } else if (key == "ArrowUp" || key == "ArrowDown") {
                if (menu.childrenVisible == false) {
                    if (menu.children.length >= 0) {
                        menu.children[0].active = true;
                        e.preventDefault();
                    }
                } else {
                    if (menu.children.length >= 0) {
                        menu.children[0].active = true;
                        e.preventDefault();
                    }
                }
            }
        } else {
            if (key == "ArrowLeft") {
                var root = menu.getRoot();

                if (parent == root) {

                } else {
                    //parent.childrenVisible = false;
                    parent.hideChildrenImmediately();
                    e.preventDefault();
                }

            } else if (key == "ArrowRight") {
                if (menu.children.length > 0) {
                    menu.childrenVisible = true;
                    menu.children[0].active = true;
                    e.preventDefault();
                }

            } else if (key == "ArrowUp" || key == "ArrowDown") {
                var index = parent.children.indexOf(menu);

                if (key == "ArrowDown") index++; else index--;

                if (index < 0) index = parent.children.length - 1;
                if (index >= parent.children.length) index = 0;

                parent.children[index].active = true;

                e.preventDefault();
            }
        }

        if (key === "Enter") {

            if (menu.children.length == 0) this._dispatchEvent_menuclick(menu);
            else {
                if (menu.childrenVisible == false) {
                    menu.childrenVisible = true;
                    menu.children[0].active = true;
                    e.preventDefault();
                }
            }
        } else if (key === "Escape") {

            if (menu.childrenVisible == true) {
                menu.hideChildrenImmediately();
                e.preventDefault();
            } else {
                if (parent != null) {
                    parent.hideChildrenImmediately();
                } else {
                    menu.element.blur();
                }
            }
        }
    }
    prototype._dispatchEvent_menuclick = function(menu) {
        var root = this.getRoot();

        var event = new Event("menuclick", { bubbles: true, cancelable: true });
        event.menu = menu;
        menu.element.dispatchEvent(event);

        if (event.defaultPrevented == false) {
            root.active = false;
            root.childrenVisible = false;
        } else {

        }
    }

    // ==== static methods ====

}()
!function() {
    if (globalThis.window == null) return;
    var ctrl = intell.ctrl;
    var MenuBar = ctrl.MenuBar;


    // ====== constructor =======
    /** @param {HTMLElement} element */
    MenuBar = function(element) {
        
        // 1. If this function is called without the new keyword, recall if with the new keyword
        // 2. If functions are not added to the prototype, create/add them

        // --1 & 1a--
        if (MenuBar.getItem(element)) return MenuBar.getItem(element);
        if (this instanceof MenuBar == false) return new MenuBar(element);


        var _this = MenuBar.setItem(element, this);
        var $element = $(element);
        var $elementMenuAbstract = $element.find('>.X-Menu.Abstract').removeClass('Abstract').remove();



        var __private = _this.getPrivate({});
        __private.element = element;
        __private.elementMenuAbstract = $elementMenuAbstract[0];
        __private.children = [];

        element.addEventListener('mouseover', function(e) {
            // note: occurs when mouseover element or any of its children
            // 1. get the active menu in the children, exit if we don't have any active menu
            // 2. get the new mouseenter element>* (children only), exit if null
            // 3. get menu instance, exit if null
            // 4. move to next
            //      a. hide current
            //      b. active current

            // --1--
            var currentMenu = __private.children.find(child => child.active == true);
            if (currentMenu == null) return;
            
            // --2--
            var nextMenuElement = ctrl.findClosestElement(e.target, value => value.parentElement == element);
            if (nextMenuElement == null) return;

            // --3--
            var nextMenu = ctrl.Menu.getItem(nextMenuElement);
            if (nextMenu == null) return;

            if (nextMenu == currentMenu) return;

            // --4a--
            var childrenVisible = currentMenu.childrenVisible;
            currentMenu.active = false;
            currentMenu.childrenVisible = false;

            // --4b--
            nextMenu.element.focus();
            nextMenu.active = true;
            nextMenu.childrenVisible = childrenVisible;
        });
        element.addEventListener('keydown', e => _this._keydown_arrow(e));
        $element.on('mouseenter', '>.X-Menu', function(e) {
            //var active_child = __private.children.find(child => child.active == true);
            //if (active_child == null) return;
            //
            //var childrenVisible = active_child.childrenVisible;
            //
            //var menu = ctrl.Menu.getItem(this);
            //var root = menu.getRoot();
            //
            //if (menu != root) return
            //if (menu == active_child) return;
            //
            //menu.element.focus();
            //menu.childrenVisible = childrenVisible;
        })
    }
    ctrl.MenuBar = MenuBar;

    // ===== setup inherit ======
    var prototype = MenuBar.prototype;
    ctrl.template.inherit(MenuBar, { ctrlKey: Symbol('MenuBar') });

    // ====== properties ======
    ctrl.template.defineProperties(prototype, {
        element: {
            get: function() { return this.getPrivate().element },
            set: function() { throw new Error("'MenuBar.element' cannot be assigned to -- it is read only") }
        },
        elementMenuAbstract: {
            get: function() { return this.getPrivate().elementMenuAbstract },
            set: function() { throw new Error("'MenuBar.elementMenuAbstract' cannot be assigned to -- it is read only") }
        },
        children: {
            get: function() { return this.getPrivate().children.slice() },
            set: function() { throw new Error("'MenuBar.children' cannot be assigned to -- it is read only") }
        }
    });

    // ====== methods ======
    prototype.add = function() {
        if (arguments.length == 1 && typeof arguments[0] == "string") return this.addName.apply(this, arguments);
        if (arguments.length == 1 && arguments[0] instanceof intell.ctrl.Menu == true) return this.addMenu.apply(this, arguments);
        if (arguments.length == 1 && typeof arguments[0] == "object") return this.addOption.apply(this, arguments);

        throw new Error("arguments do not match with any overloads.")
    }
    prototype.addOption = function(option) {
        // 1. [Predefine] try to clone elementMenuAbstract if it exists
        // 2. [Predefine] set elementMenuAbstract to child
        // 3. assign icon, name, shortcut...

        // --1--
        var __bar = this.getPrivate();
        var element = __bar.elementMenuAbstract != null ? __bar.elementMenuAbstract.cloneNode(true) : null;
        var menu = new ctrl.Menu(element);

        // --2--
        menu.getPrivate().elementMenuAbstract = __bar.elementMenuAbstract;

        // --3--
        if (option.icon != null) menu.icon = option.icon;
        if (option.name != null) menu.name = option.name;
        if (option.shortcut != null) menu.shortcut = option.shortcut;
        
        this.addMenu(menu);
        return menu;
    }
    prototype.addName = function(name) { return this.addOption({ name: name }) }
    prototype.addMenu = function(child) {
        var __bar = this.getPrivate();
        var __child = child.getPrivate();

        // 1. add child to the parent AND set this as parent of new child
        // 2. ui/ux
        //      a. parent append child
        //      b. focusable

        // --1--
        __bar.children.push(child);
        
        // --2a--
        __bar.element.appendChild(__child.element);

        // --2b--
        if (__child.element.tabIndex == -1) __child.element.tabIndex = 0;
    }


    prototype._keydown_arrow = function(e) {
        var key = e.key;
        var __private = this.getPrivate();

        if (key == "ArrowLeft" || key == "ArrowRight") {
            var activeMenu = __private.children.find(child => child.active == true);
            if (activeMenu == null) return;

            // --1--
            var index = __private.children.indexOf(activeMenu);
            if (key == "ArrowRight") index++; else index--;

            // --2--
            if (index < 0) index = __private.children.length - 1;
            if (index >= __private.children.length) index = 0;

            var nextMenu = __private.children[index];
            if (nextMenu == activeMenu) return;

            if (activeMenu.childrenVisible == false) {
                nextMenu.element.focus();
                e.preventDefault();
            }
            else {
                if (e.defaultPrevented == false) {
                    if (key == "ArrowLeft" || key == "ArrowRight") {
                        nextMenu.element.focus();
                        nextMenu.childrenVisible = true;

                        if (nextMenu.children.length > 0) nextMenu.children[0].active = true;

                        e.preventDefault();
                    }
                }
                //console.log(activeMenu.element, activeMenu.getHighestActive().element, e.defaultPrevented);
            }
        }
    }
    // ==== static methods ====

    

}()
!function() {
    //if (globalThis.window == null) return;
    const ctrl = intell.ctrl;
    let DateTime = ctrl.DateTime;

    const ACTIVE_CLASS = "ACTIVE";
    const CHILDREN_VISIBLE_CLASS = "CHILDREN-VISIBLE"; // Appears on the top most element
    const CHILDREN_FADEOUT_CLASS = "CHILDREN-OUT";     // Appears on the top most element
    const FADEOUT_CLASS = "OUT";
    const CHANGE_EVENT = "datetimechange";
    //const FIRST_ACTIVE_CLASS = "FIRST";

    // ====== constructor =======
    /** @param {HTMLElement} element */
    DateTime = function(element) {
        
        // 1. If this function is called without the new keyword, recall if with the new keyword
        // 2. If functions are not added to the prototype, create/add them

        // --1 & 1a--
        if (DateTime.getItem(element)) return DateTime.getItem(element);
        if (this instanceof DateTime == false) return new DateTime(element);


        let _this = DateTime.setItem(element, this);
        let $element = $(element);
        let $label = $element.find('>.Label');
        let $input = $label.find('.Input');
        let $edit = $label.find('.Edit');
        let $children = $element.find('>.Children');
        let $intersect = $children.find('>.Intersect');

        let $calendar = $children.find('.Calendar');
        let $calendarHeader = $calendar.find('.Calendar-Header');
        let $calendarTitle = $calendar.find('.Calendar-Title');
        let $calendarPrev = $calendar.find('.Calendar-Prev');
        let $calendarNext = $calendar.find('.Calendar-Next');
        let $calendarTable = $calendar.find('.Calendar-Table');
        let $calendarTableHead = $calendar.find('.Calendar-Table-Head');
        let $calendarTableBody = $calendar.find('.Calendar-Table-Body');

        let $clock = $children.find('.Clock');
        let $clockTime = $clock.find('.Time');
        let $clockHours = $clock.find('.Hours'); let $clockHoursValue = $clockHours.find('.Value');
        let $clockMinutes = $clock.find('.Minutes'); let $clockMinutesValue = $clockMinutes.find('.Value');
        let $clockSeconds = $clock.find('.Seconds'); let $clockSecondsValue = $clockSeconds.find('.Value');
        let $clockMilliseconds = $clock.find('.Milliseconds'); let $clockMillisecondsValue = $clockMilliseconds.find('.Value');
        let $clockNoon = $clock.find('.Noon');
        let $clockTimezone = $clock.find('.Timezone');

        // Predefine
        if ($label.length == 0) $label = $(`<div class="Label"></div>`).prependTo(element);
        if ($input.length == 0) $input = $(`<input class="Input"/>`).appendTo($label);
        if ($edit.length == 0) $edit = $(`<div class="Edit"></div>`).appendTo($label);
        if ($children.length == 0) $children = $(`<div class="Children"></div>`).appendTo(element);
        if ($intersect.length == 0) $intersect = $(`<div class="Intersect"></div>`).prependTo($children);

        if ($calendar.length == 0) $calendar = $(`<div class="Calendar"></div>`).appendTo($children);
        if ($calendarHeader.length == 0) $calendarHeader = $(`<div class="Calendar-Header"></div>`).appendTo($calendar);
        if ($calendarTitle.length == 0) $calendarTitle = $(`<div class="Calendar-Title"></div>`).prependTo($calendarHeader);
        if ($calendarPrev.length == 0) $calendarPrev = $(`<div class="Calendar-Prev" tabindex="0"></div>`).appendTo($calendarHeader);
        if ($calendarNext.length == 0) $calendarNext = $(`<div class="Calendar-Next" tabindex="0"></div>`).appendTo($calendarHeader);
        if ($calendarTable.length == 0) $calendarTable = $(`<div class="Calendar-Table" tabindex="0"></div>`).appendTo($calendar);
        if ($calendarTableHead.length == 0) $calendarTableHead = $(`<div class="Calendar-Table-Head"></div>`).prependTo($calendarTable);
        if ($calendarTableBody.length == 0) $calendarTableBody = $(`<div class="Calendar-Table-Body"></div>`).appendTo($calendarTable);

        if ($clock.length == 0) $clock = $(`<div class="Clock"></div>`).appendTo($children);
        if ($clockTime.length == 0) $clockTime = $(`<span class="Time" tabindex="0"></div>`).appendTo($clock);
        if ($clockHours.length == 0) $clockHours = $(`<span class="Hours"><span class="Value"></span></span>`).prependTo($clockTime); if ($clockHoursValue.length == 0) $clockHoursValue = $clockHours.find('.Value');
        if ($clockMinutes.length == 0) $clockMinutes = $(`<span class="Minutes">:<span class="Value"></span></span>`).insertAfter($clockHours); if ($clockMinutesValue.length == 0) $clockMinutesValue = $clockMinutes.find('.Value');
        if ($clockSeconds.length == 0) $clockSeconds = $(`<span class="Seconds">:<span class="Value"></span></span>`).insertAfter($clockMinutes); if ($clockSecondsValue.length == 0) $clockSecondsValue = $clockSeconds.find('.Value');
        if ($clockMilliseconds.length == 0) $clockMilliseconds = $(`<span class="Milliseconds">.<span class="Value"></span></span>`).insertAfter($clockSeconds); if ($clockMillisecondsValue.length == 0) $clockMillisecondsValue = $clockMilliseconds.find('.Value');
        if ($clockNoon.length == 0) $clockNoon = $(`<span class="Noon"></span>`).insertAfter($clockMilliseconds); 
        if ($clockTimezone.length == 0) $clockTimezone = $(`<span class="Timezone"></span>`).insertAfter($clockNoon);

        $clockNoon[0]?.insertAdjacentText('beforebegin', ' ');
        $clockNoon[0]?.insertAdjacentText('afterend', ' ');

        let __private = _this.getPrivate({});
        __private.element = element;
        __private.elementLabel = $label[0];
        __private.elementLabelInput = $input[0];
        __private.elementLabelEdit = $edit[0];
        __private.elementChildren = $children[0];
        __private.elementIntersect = $intersect[0];
        __private.elementCalendar
        __private.elementCalendarTitle = $calendarTitle[0];
        __private.elementCalendarPrev = $calendarPrev[0];
        __private.elementCalendarNext = $calendarNext[0];
        __private.elementCalendarTable = $calendarTable[0];
        __private.elementCalendarTableHead = $calendarTableHead[0];
        __private.elementCalendarTableBody = $calendarTableBody[0];

        __private.elementClock = $clock[0];
        __private.elementClockTime = $clockTime[0];
        __private.elementClockHours = $clockHours[0]; __private.elementClockHoursValue = $clockHoursValue[0];
        __private.elementClockMinutes = $clockMinutes[0]; __private.elementClockMinutesValue = $clockMinutesValue[0];
        __private.elementClockSeconds = $clockSeconds[0]; __private.elementClockSecondsValue = $clockSecondsValue[0];
        __private.elementClockMilliseconds = $clockMilliseconds[0]; __private.elementClockMillisecondsValue = $clockMillisecondsValue[0];
        __private.elementClockNoon = $clockNoon[0];
        __private.elementClockTimezone = $clockTimezone[0];
        
        __private.active = false;
        __private.firstDayOfWeek = 0; 
        __private.timezoneOffset = DateTime.getLocaleTimezoneOffset();
        __private.locales = navigator.language;
        __private.secondsEnabled = true;
        __private.millisecondsEnabled = false;
        __private.hour12 = false;
        __private.nullable = true;
        __private.calendarLocations = [9, 1];
        __private.calendarOption = { container_mode: "auto", space: -1 }
        __private.calendarFadeOutTime = 0;

        // session
        __private.childrenVisible = false;
        __private.childrenFadingOut = false;
        __private.clockValue = 0;
        __private.clockCurrentUnitName = undefined;
        __private.clockCurrentUnitValue = 0;
        __private.clockCurrentInputCount = 0;

        //
        _this.firstDayOfWeek = __private.firstDayOfWeek;
        _this.timezoneOffset = __private.timezoneOffset;
        _this.secondsEnabled = __private.secondsEnabled;
        _this.millisecondsEnabled = __private.millisecondsEnabled;

        // handle events
        element.addEventListener('focusin', function(e) {
            // PURPOSE: activate when it or its children got focus

            if (__private.element.contains(e.target) == true) _this.active = true;
        });
        document.addEventListener('focusin', function(e) {
            // PURPOSE: deactivate when lost focus to another element outside
            // do not deactivate when childrens take focus

            if (__private.active == false) return; // already lost focus
            if (element.contains(e.target) == true) return;
            // occurs when another element steal focus from us

            _this._blur();
        });
        document.addEventListener('mousedown', function(e) {
            // PURPOSE: deactivate when lost focus by mousedown outside

            if (__private.active == false) return; // already lost focus
            // if (__private.calendarVisible == true && __private.calendarFadingOut == true) return; // fading out
            if (__private.element.contains(e.target) == true) return; // mouseup from inside

            _this._blur();
        });
        element.addEventListener('keydown', function(e) { _this._keydown(e) });
        element.addEventListener('change', function(e) {
            _this._change(e);
        });
        $edit[0]?.addEventListener('click', function() {
            const __private = _this.getPrivate();
            if (__private.childrenVisible == false) _this._keydown({ key: "Enter" });
            else _this._keydown({ key: "Enter" });
        });
        $calendarPrev.click(function(e) {
            if (__private.calendarMonth == null) return;

            _this.calendarNext(-1);
        });
        $calendarNext.click(function() {
            if (__private.calendarMonth == null) return;

            _this.calendarNext(1);
        });
        $calendarTableBody.on('click', '>div', function(e) { _this.setCalendarValue(this._time) });

        __private.elementClockTime?.addEventListener('focus', function() {
            var __private = _this.getPrivate();
            if (__private.clockCurrentUnitName == null) _this.setClockCurrentUnitName("hours");
        });
        __private.elementClockTime?.addEventListener('blur', function(e) {
            _this.setClockCurrentUnitName(null);
        });
        __private.elementClockTime?.addEventListener('mousedown', function(e) {
            const name = _this.getClockUnitName(e.target);
            if (name) _this.setClockCurrentUnitName(name);
        });
    }
    ctrl.DateTime = DateTime;

    // ===== setup inherit ======
    ctrl.template.inherit(DateTime, { ctrlKey: Symbol('DateTime') });
    
    // ====== properties ======
    const prototype = DateTime.prototype;
    ctrl.template.defineProperties(prototype, {
        element: {
            get: function() { return this.getPrivate().element },
            set: function() { throw new Error("'DateTime.element' cannot be assigned to -- it is read only") }
        },
        elementLabel: {
            get: function() { return this.getPrivate().elementLabel },
            set: function() { throw new Error("'DateTime.elementLabel' cannot be assigned to -- it is read only") }
        },
        elementChildren: {
            get: function() { return this.getPrivate().elementChildren },
            set: function() { throw new Error("'DateTime.elementCalendar' cannot be assigned to -- it is read only") }
        },
        elementIntersect: {
            get: function() { return this.getPrivate().elementIntersect },
            set: function() { throw new Error("'DateTime.elementIntersect' cannot be assigned to -- it is read only") }
        },

        value: {
            get: function() { return this.getPrivate().value },
            set: function(newValue) {
                if (typeof (newValue) != "number" && newValue != null) throw new Error("DateTime.value must be number");

                this.setValue(newValue, false);
            }
        },
        timezoneOffset: {
            get: function() { return this.getPrivate().timezoneOffset },
            set: function(newValue) {
                if (typeof newValue !== 'number') throw new Error("DateTime.timezoneOffset must be number");

                const __private = this.getPrivate();
                __private.timezoneOffset = newValue;

                if (newValue == 0) __private.elementClockTimezone.textContent = "UTC";
                else {
                    const hhmm = intell.ctrl.Time.getHHMMSS(Math.abs(newValue) * 60000);

                    __private.elementClockTimezone.textContent = `GMT${newValue > 0 ? '-' : '+'}${hhmm.hours.toString().padStart(2, "0")}${hhmm.minutes.toString().padStart(2, "0")}`;
                }                
            }
        },
        firstDayOfWeek: {
            get: function() { return this.getPrivate().firstDayOfWeek },
            set: function(newValue) { this.setFirstDayOfWeek(newValue) }
        },
        locales: {
            get: function() { return this.getPrivate().locales },
            set: function(newValue) {
                const __private = this.getPrivate();
                __private.locales = newValue;

                this.setFirstDayOfWeek(__private.firstDayOfWeek);
                this.setCalendarMonth(__private.calendarMonth, true);
            }
        },
        secondsEnabled: {
            get: function() { return this.getPrivate().secondsEnabled },
            set: function(newValue) {
                const __private = this.getPrivate();

                __private.secondsEnabled = newValue;
                $(__private.elementClockSeconds).toggle(newValue == true);
            }
        },
        millisecondsEnabled: {
            get: function() { return this.getPrivate().millisecondsEnabled },
            set: function(newValue) {
                const __private = this.getPrivate();

                __private.millisecondsEnabled = newValue;
                $(__private.elementClockMilliseconds).toggle(newValue == true);
            }
        },
        hour12: {
            get: function() { return this.getPrivate().hour12 },
            set: function(newValue) {
                const __private = this.getPrivate();

                __private.hour12 = newValue;
                this.setClockValue(__private.clockValue);
                $(__private.elementClockNoon).toggle(newValue == true);
            }
        },
        nullable: {
            get: function() { return this.getPrivate().nullable },
            set: function(newValue) { this.getPrivate().nullable = newValue },
        },
        calendarLocations: {
            get: function() { return this.getPrivate().calendarLocations },
            set: function(newValue) { this.getPrivate().calendarLocations = newValue },
        },
        calendarOption: {
            get: function() { return this.getPrivate().calendarOption },
            set: function(newValue) { this.getPrivate().calendarOption = newValue },
        },
        calendarFadeOutTime: {
            get: function() { return this.getPrivate().calendarFadeOutTime },
            set: function(newValue) { this.getPrivate().calendarFadeOutTime = newValue },
        },

        active: {
            get: function() { return this.getPrivate().active },
            set: function(newValue) {
                var __private = this.getPrivate();

                if (__private.active == newValue) return;

                // 1. set ACTIVE class
                // 2. When active equal true
                //    a. show calendar
                // 3. when active equal false
                //    a. calendar must be deactive too


                // --1--
                __private.element.classList.toggle(ACTIVE_CLASS, newValue);
                __private.active = newValue;

                if (newValue == true) {
                    // --2a--
                } else {
                    // --3a--
                    this.hideChildren();
                }
            }
        },
        calendarVisible: {
            get: function() { return this.getPrivate().childrenVisible },
            set: function(newValue) {

                var __private = this.getPrivate();

                // 1. exit if already in the same state
                // 2. When newValue == true
                //    a. show calendar
                // 3. When newValue == false
                //    a. hide calendar

                // --1--
                if (__private.childrenVisible == newValue) return;

                if (newValue == true) {
                    // --2a--
                    this.showChildrenAt(__private.element)
                } else {
                    // --3a--
                    this.hideChildren();
                }

            }
        }
    });
    
    // ====== methods ======
    prototype.customFormatDisplay = function(time) {
        const __private = this.getPrivate();
        const hours = Math.floor(Math.abs(__private.timezoneOffset) / 60);
        const minutes = Math.floor(Math.abs(__private.timezoneOffset) % 60);
        const timeZone = `${__private.timezoneOffset > 0 ? '-' : '+'}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`; // +07:00

        const date = new Date(time);

        const part1 = Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(date);
        const part2 = Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false, fractionalSecondDigits: __private.millisecondsEnabled == true ? 3 : undefined, timeZone: timeZone, timeZoneName: 'short' }).format(date);
        
        //const part1 = date.toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' });
        //const part2 = date.toLocaleString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false, fractionalSecondDigits: __private.millisecondsEnabled == true ? 3 : undefined, timeZone: timeZone, timeZoneName: 'short' });
        
        return `${part1} ${part2}`
    }
    prototype.showChildrenAt = function() {
        if (arguments[0] instanceof HTMLElement == true) this.showChildrenAtElement.apply(this, arguments);
        else if (typeof arguments[0] == 'object') this.showChildrenAtCoord.apply(this, arguments);
        else throw new TypeError("arguments do not match with any overloads.")
    }
    prototype.showChildrenAtRect = function(target, locations, option) {
        // Visible
        //  FadingOut
        // Invisible

        // 1. default value
        // 2. exit if children are already visible
        // 3. children are completely invisible
        //    a. show children
        //    b. [Feature] calculate position, size for elementIntersect
        // 4. children are in the fading-out process
        // 5. display information on Calendar and Clock

        var __private = this.getPrivate();
        
        // --1--
        if (locations == null) locations = locations ?? __private.calendarLocations;
        if (option == null) option = option ?? __private.calendarOption;

        var element = __private.element;
        var elementCalendar = __private.elementChildren;
        var elementIntersect = __private.elementIntersect;

        // --2--
        if (__private.childrenVisible == true) return;


        if (__private.childrenFadingOut == false) {
            // --3a--
            var result = ctrl.showAt(elementCalendar, target, locations, option);
            element.classList.add(CHILDREN_VISIBLE_CLASS)

            // --3b--
            var a = ctrl.getBoundingClientRectOffset(element);
            var b = result.rect;
            var intersect = ctrl.rectIntersect(a, b);

            if (intersect == null) ctrl.hide(elementIntersect);
            else {
                $(elementIntersect).offset({ left: intersect.left, top: intersect.top });
                elementIntersect.style.width = intersect.width + 'px';
                elementIntersect.style.height = intersect.height + 'px';
                ctrl.show(elementIntersect);
            }
        }
        else {
            // --4--
            __private.childrenFadingOut = false;

            element.classList.add(CHILDREN_VISIBLE_CLASS)
            ctrl.stopHide(elementCalendar);
        }
        element.focus({ preventScroll: true });
        __private.childrenVisible = true;

        // --5-- 
        this.setCalendarMonth(__private.value ?? Date.now());
        this.setClockValue(__private.value == null ? 0 : DateTime.getClockTime(__private.value, __private.timezoneOffset));
    }
    prototype.showChildrenAtElement = function(target, locations, option) {
        var target = ctrl.getBoundingClientRectOffset(target);

        return this.showChildrenAtRect(target, locations, option);
    }
    prototype.showChildrenAtCoord = function(coord, locations, option) {
        var target = new DOMRect(coord.x ?? coord.left, coord.y ?? coord.top, 0, 0);

        return this.showChildrenAtRect(target, locations, option);
    }
    prototype.hideChildren = function() {

        // 1. exit if children are already hiding, or in the fading-out process
        // 2. try to get delayHideTime
        // 3. if delayHideTime = 0
        //     a. equal = 0, hide immediately
        //     b. start the hiding process
        // 4. hide the children and deactive them too


        var __private = this.getPrivate();

        // --1--
        if (__private.childrenVisible == false || __private.childrenFadingOut == true) return;

        // --2--
        var element = __private.element;
        var elementCalendar = __private.elementChildren;
        var delayHideTime = __private.calendarFadeOutTime;

        // --3a--
        if (delayHideTime == 0) this.hideChildrenImmediately();
        else {
            // --3b-- 
            __private.childrenVisible = false;
            __private.childrenFadingOut = true;

            element.classList.remove(CHILDREN_VISIBLE_CLASS);
            element.classList.add(CHILDREN_FADEOUT_CLASS);

            ctrl.startHide(elementCalendar, delayHideTime, FADEOUT_CLASS).then(function() {
                element.classList.remove(CHILDREN_FADEOUT_CLASS);

                __private.childrenFadingOut = false;
                __private.calendarMonth = null;
                __private.calendarValue = null;
            });

            // --4--
            //__private.children.forEach(child => {
            //    var child__private = child.getPrivate();
            //    if (child__private.active == true) child.active = false;
            //    child.hideChildren()
            //});
        };
    }
    prototype.hideChildrenImmediately = function() {
        var __private = this.getPrivate();
        var element = __private.element;
        var elementCalendar = __private.elementChildren;

        // 1. if children are completely hidden, exit
        // 2. stop the fading-out process and hide elementChildren immediately
        //    a. remove classes
        // 3. hide the children too and deactive them too

        // --1--
        if (__private.childrenVisible == false && __private.childrenFadingOut == false) return;

        __private.childrenVisible = false;
        __private.childrenFadingOut = false;
        __private.calendarMonth = null;
        __private.calendarValue = null;

        // --2--
        ctrl.stopHide(elementCalendar); ctrl.hide(elementCalendar);
        element.classList.remove(CHILDREN_VISIBLE_CLASS, CHILDREN_FADEOUT_CLASS);
    }

    prototype.setCalendarMonth = function(calendarDateTime, force) {
        const __private = this.getPrivate();
        const timezoneOffset = __private.timezoneOffset;

        if (force !== true && __private.calendarMonth != null && DateTime.isSameMonth(calendarDateTime, __private.calendarMonth, timezoneOffset) == true) return false;
        
        const Year = DateTime.getYear(calendarDateTime, timezoneOffset);
        const Month = DateTime.getMonth(calendarDateTime, timezoneOffset); // 1 - 12
        const firstDateOfMonthTime = Date.UTC(Year, Month- 1, 1) + timezoneOffset * 60_000;
        const lastDateOfMonthTime = Date.UTC(Year, Month, 0) + timezoneOffset * 60_000;

        // firstDateOfMonth.Day + ? startOffset ? = firstDayOfWeek
        let startOffset = __private.firstDayOfWeek - DateTime.getDayOfWeek(firstDateOfMonthTime, timezoneOffset);
        if (startOffset > 0) startOffset -= 7;

        // lastDateOfMonth.Day + ? endOffset ? = (firstDayOfWeek + 7 - 1) % 7
        let endOffset = (__private.firstDayOfWeek + 7 - 1) % 7 - DateTime.getDayOfWeek(lastDateOfMonthTime, timezoneOffset);
        if (endOffset < 0) endOffset += 7;

        const startTime = firstDateOfMonthTime + 86_400_000 * startOffset;
        let endTime = lastDateOfMonthTime + 86_400_000 * endOffset;

        const co = (endTime - startTime) / 86_400_000 + 1; // co + ? = 42
        if (co < 42) endTime += (42 - co) * 86_400_000;

        // September 2024
        __private.elementCalendarTitle.innerHTML = DateTime.getMonthName(DateTime.getMonth(calendarDateTime, timezoneOffset), __private.locales) + ' ' + Year;
        __private.elementCalendarTableBody.replaceChildren(); // let clear everythings

        for (let i = 0; ; i++) {
            const currentTime = startTime + i * 86_400_000;

            const element = $(`<div><span>${DateTime.getDate(currentTime, timezoneOffset)}</span ></div >`)[0];
            element._time = currentTime;

            if (DateTime.isSameMonth(currentTime, calendarDateTime, timezoneOffset) == false) element.classList.add('OTHER-MONTH');
            if (__private.value != null && DateTime.isSameDate(currentTime, __private.value, timezoneOffset) == true) element.classList.add('SELECTED');

            __private.elementCalendarTableBody.append(element);

            if (currentTime >= endTime) break;
        }

        __private.calendarMonth = calendarDateTime;
        __private.calendarStart = startTime;
        __private.calendarEnd = endTime;

        if (__private.calendarValue != null) this.setCalendarValue(__private.calendarValue);

        return true;
    }
    prototype.setCalendarValue = function(calendarValue) {
        const __private = this.getPrivate();
        const timezoneOffset = __private.timezoneOffset;
        const childrenElements = Array.from(__private.elementCalendarTableBody.children);
        const element = childrenElements.find(element => DateTime.isSameDate(element._time, calendarValue, timezoneOffset));

        $(childrenElements).removeClass('ACTIVE');
        if (element != null) element.classList.add('ACTIVE');

        __private.calendarValue = calendarValue;
    }
    prototype.setFirstDayOfWeek = function(firstDayOfWeek) {
        if (typeof firstDayOfWeek !== 'number') throw new Error("DateTime.firstDayOfWeek must be number");
        if (firstDayOfWeek < 0 || firstDayOfWeek > 6) throw new Error("DateTime.firstDayOfWeek must be 0 to 6")

        const __private = this.getPrivate();

        for (let i = firstDayOfWeek; i < firstDayOfWeek + 7; i++) {
            let element = __private.elementCalendarTableHead.children[i - firstDayOfWeek];
            if (element == null) {
                const $element = $('<div></div>');
                element = $element[0];
                __private.elementCalendarTableHead.appendChild(element);
            }
            element.innerHTML = DateTime.getWeekDayName(i, __private.locales); // .substr(0, 2);
            element.className = `Day${i}`;
        }

        __private.firstDayOfWeek = firstDayOfWeek;

        if (__private.calendarMonth != null) this.setCalendarMonth(__private.calendarMonth, true)
        if (__private.calendarValue != null) this.setCalendarValue(__private.calendarValue);
    }
    prototype.calendarNext = function(n) {
        const __private = this.getPrivate();
        if (__private.calendarMonth == null) return;

        const calendarMonthDate = new Date(__private.calendarMonth - __private.timezoneOffset * 60000);
        const newCalendarMonth = Date.UTC(calendarMonthDate.getUTCFullYear(), calendarMonthDate.getUTCMonth() + n);

        this.setCalendarMonth(newCalendarMonth);
    }

    prototype.setClockValue = function(value) {
        const __private = this.getPrivate();
        const hhmmss = intell.ctrl.Time.getHHMMSS(value);

        if (__private.hour12 == false) {
            __private.elementClockHoursValue.textContent = hhmmss.hours;
            __private.elementClockMinutesValue.textContent = hhmmss.minutes.toString().padStart(2, '0');
            __private.elementClockSecondsValue.textContent = hhmmss.seconds.toString().padStart(2, '0');
            __private.elementClockMillisecondsValue.textContent = hhmmss.milliseconds.toString().padStart(3, '0');
            __private.elementClockNoon.textContent = "";
        } else {
            __private.elementClockHoursValue.textContent = hhmmss.hours % 12;
            __private.elementClockMinutesValue.textContent = hhmmss.minutes.toString().padStart(2, '0');
            __private.elementClockSecondsValue.textContent = hhmmss.seconds.toString().padStart(2, '0');
            __private.elementClockMillisecondsValue.textContent = hhmmss.milliseconds.toString().padStart(3, '0');
            __private.elementClockNoon.textContent = hhmmss.hours < 12 ? "AM" : "PM";
        }

        __private.clockValue = value;
    }
    prototype.getClockUnitName = function(target) {
        const __private = this.getPrivate();

        if (__private.elementClockHours.contains(target)) return "hours";
        else if (__private.elementClockMinutes.contains(target)) return "minutes";
        else if (__private.elementClockSeconds.contains(target)) return "seconds";
        else if (__private.elementClockMilliseconds.contains(target)) return "milliseconds";
        else if (__private.elementClockNoon.contains(target)) return "noon";
    }
    prototype.getClockUnitElement = function(name) {
        var __private = this.getPrivate();

        if (name == "hours") return __private.elementClockHours;
        if (name == "minutes") return __private.elementClockMinutes;
        if (name == "seconds") return __private.elementClockSeconds;
        if (name == "milliseconds") return __private.elementClockMilliseconds;
        if (name == "noon") return __private.elementClockNoon;
    }
    prototype.setClockCurrentUnitName = function(name) {
        var __private = this.getPrivate();

        if (name !== "hours" && name != "minutes" && name != "seconds" && name != "milliseconds" && name != "noon" && name != null) throw new Error("'name' must be 'hours', 'minutes', 'seconds', 'milliseconds' or 'noon'");
        if (__private.clockCurrentUnitName == name) return;

        __private.clockCurrentUnitName = name;
        __private.clockCurrentUnitValue = 0;
        __private.clockCurrentInputCount = 0;

        $([__private.elementClockHours, __private.elementClockMinutes, __private.elementClockSeconds, __private.elementClockMilliseconds, __private.elementClockNoon]).removeClass(ACTIVE_CLASS);
        this.getClockUnitElement(name)?.classList.add(ACTIVE_CLASS);
    }
    prototype.setValue = function(newValue, raiseEvent) {
        const __private = this.getPrivate();
        const oldValue = __private.value;

        // if we are not allow null, exit 
        if (__private.nullable == false && newValue == null) return false;

        __private.value = newValue;


        if (newValue == null) __private.elementLabelInput.value = '';
        else {
            const displayText = this.customFormatDisplay(newValue);
            __private.elementLabelInput.value = displayText;
        }

        if (__private.childrenVisible == true) {
            this.setCalendarMonth(__private.value ?? Date.now(), true);
            this.setCalendarValue(newValue);
            this.setClockValue(__private.value == null ? 0 : DateTime.getClockTime(__private.value, __private.timezoneOffset));
        }

        if (raiseEvent == true && oldValue != newValue) {
            const event = new Event(CHANGE_EVENT, { cancelable: false, bubbles: true });
            event.control = this;
            __private.element.dispatchEvent(event);
        }

        return true;
    }

    // `_` mean handle events
    prototype._blur = function() {
        const __private = this.getPrivate();

        if (__private.childrenVisible == true) doBeforeHideChildren.apply(this);
       
        (this).active = false;
    }
    prototype._keydown = function(e) {
        const __private = this.getPrivate();

        if (e.code == "Escape") {
            // occurs when user press Esc
            // 1. while calendar visible
            // 2. while calendar hidden

            if (__private.childrenVisible == true) {
                // --1--
                this.hideChildren();
                __private.element.focus();
            }
            else {
                // --2--
            }
        }
        
        if (document.activeElement == __private.element) {
            if (e.key == "Enter") {
                if (__private.childrenVisible == false) {
                    (this).calendarVisible = true;
                }
                else {
                    doBeforeHideChildren.apply(this);
                    this.hideChildren();
                }
            }
        }
        else if (document.activeElement == __private.elementCalendarPrev || document.activeElement == __private.elementCalendarNext) {
            if (e.key == "Enter") {
                if (document.activeElement == __private.elementCalendarPrev) this.calendarNext(-1);
                if (document.activeElement == __private.elementCalendarNext) this.calendarNext(+1);
            }
            else if (e.code == "Space") {
                if (document.activeElement == __private.elementCalendarPrev) this.calendarNext(-1);
                else if (document.activeElement == __private.elementCalendarNext) this.calendarNext(+1);
                e.preventDefault();
            }
        }
        else if (document.activeElement == __private.elementCalendarTable) { // when table is holding focus
            if (e.code.startsWith("Arrow") == true) {
                e.preventDefault();

                if (__private.calendarValue == null) {
                    if (__private.value != null) this.setCalendarValue(__private.value);
                    else {
                        const Year = DateTime.getYear(__private.calendarMonth, __private.timezoneOffset);
                        const Month = DateTime.getMonth(__private.calendarMonth, __private.timezoneOffset);
                        const first = Date.UTC(Year, Month - 1, 1) + __private.timezoneOffset * 60_000;
                        this.setCalendarValue(first);
                    }
                    return;
                }

                if (e.code == "ArrowLeft") {
                    this.setCalendarMonth(__private.calendarValue - 86_400_000);
                    this.setCalendarValue(__private.calendarValue - 86_400_000);
                }
                else if (e.code == "ArrowRight") {
                    this.setCalendarMonth(__private.calendarValue + 86_400_000);
                    this.setCalendarValue(__private.calendarValue + 86_400_000);
                }
                else if (e.code == "ArrowUp") {
                    this.setCalendarMonth(__private.calendarValue - 86_400_000 * 7);
                    this.setCalendarValue(__private.calendarValue - 86_400_000 * 7);
                }
                else if (e.code == "ArrowDown") {
                    this.setCalendarMonth(__private.calendarValue + 86_400_000 * 7);
                    this.setCalendarValue(__private.calendarValue + 86_400_000 * 7);
                }
            }
        }

        else if (document.activeElement == __private.elementClockTime) {
            if (e.key === parseInt(e.key).toString()) { // occurs when user presses 0-9
                const hhmmss = intell.ctrl.Time.getHHMMSS(__private.clockValue);
                const inputNumber = parseInt(e.key); // 0 - 9
                let newUnitValue = 0;

                __private.clockCurrentInputCount++; // number user pressed 

                if (__private.clockCurrentInputCount == 1) newUnitValue = inputNumber;
                else newUnitValue = __private.clockCurrentUnitValue * 10 + inputNumber;

                let moveNext = false;

                if (__private.clockCurrentUnitName == 'hours') {
                    const maxHours = __private.hour12 == false ? 24 : 12;

                    if (newUnitValue >= maxHours) { newUnitValue = inputNumber; __private.clockCurrentInputCount = 1 }
                    __private.elementClockHoursValue.innerHTML = hhmmss.hours = newUnitValue;

                    if (newUnitValue * 10 >= maxHours) moveNext = true;
                }
                else if (__private.clockCurrentUnitName == 'minutes') {
                    if (newUnitValue >= 60) { newUnitValue = inputNumber; __private.clockCurrentInputCount = 1 }
                    hhmmss.minutes = newUnitValue
                    __private.elementClockMinutesValue.innerHTML = newUnitValue.toString().padStart(2, '0');

                    if (newUnitValue >= 6) moveNext = true;
                }
                else if (__private.clockCurrentUnitName == 'seconds') {
                    if (newUnitValue >= 60) { newUnitValue = inputNumber; __private.clockCurrentInputCount = 1 }
                    hhmmss.seconds = newUnitValue;
                    __private.elementClockSecondsValue.innerHTML = newUnitValue.toString().padStart(2, '0');

                    if (newUnitValue >= 6) moveNext = true;
                }
                else if (__private.clockCurrentUnitName == 'milliseconds') {
                    newUnitValue = newUnitValue % 1000;

                    if (newUnitValue >= 1000) {
                        newUnitValue = inputNumber;
                        __private.clockCurrentInputCount = 1;
                    }
                    hhmmss.milliseconds = newUnitValue;
                    __private.elementClockMillisecondsValue.innerHTML = newUnitValue.toString().padStart(3, '0');

                    if (newUnitValue >= 100) moveNext = true;
                }

                __private.clockValue = hhmmss.hours * 3600_000 + hhmmss.minutes * 60000 + hhmmss.seconds * 1000 + hhmmss.milliseconds;
                __private.clockCurrentUnitValue = newUnitValue;

                if (moveNext == true) this._keydown({ key: "ArrowRight" });
                
            }
            else if (e.code == "KeyA" || e.code == "KeyP" && __private.clockCurrentUnitName == 'noon') {
                const hhmmss = intell.ctrl.Time.getHHMMSS(__private.clockValue);

                if (e.code == "KeyA") {
                    hhmmss.hours = hhmmss.hours % 12;
                    __private.elementClockNoon.textContent = "AM";
                }
                else if (e.code == "KeyP") {
                    if (hhmmss.hours < 12) hhmmss.hours += 12;
                    __private.elementClockNoon.textContent = "PM";
                }

                __private.clockValue = hhmmss.hours * 3600_000 + hhmmss.minutes * 60000 + hhmmss.seconds * 1000 + hhmmss.milliseconds;
            }
            else if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
                const blocks = ['hours', 'minutes'];
                if (__private.secondsEnabled == true) blocks.push('seconds');
                if (__private.millisecondsEnabled == true) blocks.push('milliseconds');
                if (__private.hour12 == true) blocks.push('noon');

                const factor = e.key == "ArrowLeft" ? -1 : 1;
                const index = blocks.indexOf(__private.clockCurrentUnitName);
                const nextName = blocks[index + factor];
                if (nextName) this.setClockCurrentUnitName(nextName);
            }
        }
    }
    prototype._change = function(e) {
        const __private = this.getPrivate();

        if (e.target == __private.elementLabelInput) {
            const text = __private.elementLabelInput.value.trim();
            const possibleValues = [];

            if (text == "") possibleValues.push(undefined);
            else {
                let value = parseInt(text);
                if (isNaN(value) == false && value.toString() == text) possibleValues.push(value);

                value = Date.parse(text);
                if (isNaN(value) == false) possibleValues.push(value);
            }

            // now we already have possibleValues

            const result = possibleValues.length == 0 ? this.setValue(__private.value, false) : this.setValue(possibleValues[0], true);

            // user enter nonsense input, reverse the text back
            if (result == false) __private.elementLabelInput.value = this.customFormatDisplay(__private.value);
            
        }
    }

    /** @this {intell.ctrl.DateTime} */
    function doBeforeHideChildren() {
        const __private = this.getPrivate();
        let newValue = 0;

        if (__private.calendarValue != null) {
            newValue = __private.calendarValue + __private.clockValue;
        } else {
            const startDateTime = __private.value - (__private.value - __private.timezoneOffset * 60000) % 86400000;
            newValue = startDateTime + __private.clockValue;
        }

        if (isNaN(newValue) == true) return;
        const oldValue = __private.value;

        if (oldValue == newValue) return;

        this.setValue(newValue, true);
        //(this).value = newValue; 
        //
        //if (oldValue != newValue) {
        //    __private.element.dispatchEvent(new Event(CHANGE_EVENT, { cancelable: false, bubbles: true }));
        //}
        
    }


    // ==== static methods ====
    DateTime.getLocaleTimezoneOffset = function() {
        return new Date().getTimezoneOffset();
    }
    DateTime.getWeekDayName = function(day, locales) {
        const formater = new Intl.DateTimeFormat(locales, { weekday: "short", timeZone: '+00' });
        return formater.formatToParts(Date.UTC(0, 0, day))[0].value;
    }
    DateTime.getMonthName = function(month, locales) {
        const formater = new Intl.DateTimeFormat(locales, { month: "long", timeZone: '+00' });
        return formater.formatToParts(Date.UTC(0, month, 0))[0].value;
    }

    DateTime.getYear = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return new Date(time - timezoneOffset * 60000).getUTCFullYear();
    }
    DateTime.getMonth = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return new Date(time - timezoneOffset * 60000).getUTCMonth() + 1;
    }
    DateTime.getDate = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return new Date(time - timezoneOffset * 60000).getUTCDate();
    }
    DateTime.getDayOfWeek = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return new Date(time - timezoneOffset * 60000).getDay();
    }
    DateTime.getHours = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return new Date(time - timezoneOffset * 60000).getUTCHours();
    }
    DateTime.getMinutes = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return new Date(time - timezoneOffset * 60000).getUTCHours();
    }
    DateTime.getSeconds = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return new Date(time - timezoneOffset * 60000).getUTCHours();
    }
    DateTime.getMilliseconds = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return new Date(time - timezoneOffset * 60000).getUTCMilliseconds();
    }
    DateTime.getClockTime = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        const date = new Date(time - timezoneOffset * 60000);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();
        const milliseconds = date.getUTCMilliseconds();

        return hours * 3600_000 + minutes * 60000 + seconds * 1000 + milliseconds;
    }
    DateTime.parse = function(s, timezoneOffset) {
        
    }

    DateTime.isSameDate = function(time1, time2, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return Math.floor((time1 - timezoneOffset * 60000) / 86_400_000) == Math.floor((time2 - timezoneOffset * 60000) / 86_400_000);
    }
    DateTime.isSameMonth = function(time1, time2, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return DateTime.getMonth(time1, timezoneOffset) == DateTime.getMonth(time2, timezoneOffset);
    }
}()
!function() {
    if (globalThis.window == null) return;
    let ns = intell.component; ns = {}; intell.component = ns;

    // varriables
    let config = ns.config; config = { rootDir: "/component/" };
    let manifests = ns.manifests; manifests = [];
    let styleUrls = [''].splice();

    // properties
    intell.ctrl.template.defineProperties(ns, {
        config: {
            get: function() { return config },
            set: function(newValue) {
                if (newValue.rootDir != null) config.rootDir = newValue.rootDir;
            },
        },
        manifests: {
            get: function() { return manifests },
            set: function() { throw new Error("'intell.component.manifests' cannot be assigned to -- it is read only") }
        }
    });

    // methods
    ns.addManifest = function(o) {
        var manifest = Object.assign({}, o);

        // normalize
        if (manifest.html == null) manifest.html = o.name + '/index.html';

        if (manifest.html != null) manifest.html = new URL(config.rootDir + manifest.html, location).href;
        if (manifest.js != null) manifest.js = new URL(config.rootDir + manifest.js, location).href;
        if (manifest.css != null) manifest.css = manifest.css.map(css => new URL(config.rootDir + css, location).href);
        

        manifests.push(manifest);

        return manifest;
    }
    ns.getManifest = async function(name) {
        let manifest = manifests.find(value => value.name == name);
        if (manifest == null) manifest = this.addManifest({ name: name });
        
        if (manifest.html != null && manifest._html == null) {
            let response = await fetch(manifest.html);
            if (response.status !== 200) throw new Error("'" + name + "' component failed to fetch '" + manifest.html + "'");
            let html = await response.text();
            
            manifest._html = html;
        }

        if (manifest.js != null && manifest._default == null) {
            try {
                var module = await import(manifest.js);
            } catch (e) {
                throw new Error("'" + name + "' component failed to dynamically import module '" + manifest.js + "'");
            }

            if (typeof (module.default) !== 'function') throw new Error("'" + name + "' component must export default function");

            manifest._default = module.default;
        }

        if (manifest.css != null) {
            manifest.css.forEach(css => {
                if (styleUrls.indexOf(css) != -1) return;

                styleUrls.push(css);

                var $link = $('<link href="' + css + '" rel="stylesheet">');
                document.head.append($link[0]);
                styleUrls.push(css);
            })
        }
        


        return manifest;
    }
    ns.transform = async function(elementOriginal) {
        if (elementOriginal == null) throw new Error("Element component cannot be null");
        if (elementOriginal.tagName != 'COMPONENT') throw new Error("Element tag must be component");

        const cname = elementOriginal.getAttribute('cname');
        const manifest = await ns.getManifest(cname);
        const $element = $(manifest._html);
        const element = $element[0];

        if ($element.length > 1) throw new Error("Components can't have more than one element.");

        // 1. copy attributes to the new element
        // 2. macro script
        //    a. replace <children/> with clone children
        // 3. replace 

        // --1--
        elementOriginal.getAttributeNames().forEach(function(name) {
            switch (name) {
                case 'cname':
                    break;
                case 'class':
                    element.classList.add(...elementOriginal.classList);
                    break;
                default:
                    element.setAttribute(name, elementOriginal.getAttribute(name));
                    break;
            }
        })          

        // --2a--
        //debugger;
        element.querySelectorAll('children').forEach(e => {
            e.replaceWith(...intell.ctrl.duplicateNodes(elementOriginal.childNodes));
        })
        //element.querySelectorAll('children')?.replaceWith(...elementOriginal.childNodes);

        // --3--
        elementOriginal.replaceWith(element);

        await ns.transformAll(element);

        if (manifest._default != null) manifest._default(element, elementOriginal);
    }
    ns.transformAll = async function(element) {
        var componentElements = element.querySelectorAll('component');
        componentElements = [...componentElements].filter(e => e.parentElement.closest('component') == null);

        for (var i = 0; i < componentElements.length; i++) {
            var componentElement = componentElements[i];
            await ns.transform(componentElement)
        }

        //var promiseAll = [...componentElements].map(e => ns.transform(e));
        //await Promise.all(promiseAll);
    }
}();


if (String.prototype.between == null)
    String.prototype.between = function(startWith, endWith, include) {
        let startIndex = startWith == null ? 0 : this.indexOf(startWith);
        if (startIndex == -1) return null;

        let endIndex = endWith == null ? this.length : this.indexOf(endWith, startIndex + startWith?.length ?? 0);
        if (endIndex == -1) return null;

        if (include == true) return this.substring(startIndex, endIndex + (endWith?.length ?? 0));
        else return this.substring(startIndex + (startWith?.length ?? 0), endIndex);
    }
else {
    console.warn("String.prototype.between is already exists");
}