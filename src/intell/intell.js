/* !intell.js | https://github.com/xhighintell/jintellv2 */

window.intell = function() {
    var intell = window.intell; intell = {
        version: '2.0.0'
    };

    // classes
    intell.EventRegister = function EventRegister(target) {

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
                // 2. if any of the listeners return "stopPropagation", stop. This is internally used

                for (var i = 0; i < this.listeners.length; i++) {
                    var callback = this.listeners[i];

                    // --1--
                    var action = callback.apply(this.target, arguments);

                    // --2--
                    if (action == "stop" || action == "stopPropagation") break;
                }
            }
            prototype.hasListener = function(callback) { return this.listeners.indexOf(callback) != -1; }
            prototype.hasListeners = function() { return this.listeners.length > 0; }
        }

        // --3--
        /** @type intell.EventRegister<(this: {x:123}, name: string)=>void> */
        var _this; _this = this;
        _this.listeners = [];
        _this.target = target;

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
        if (search == null) window.location.search.substr(1);
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

    

    //if (window.intell == null) 

    return intell;
}();


//$(asdasd).show();
//intell.show(asdasd);
//intell.controls.show(asdasd);


//intell.get().on('')
