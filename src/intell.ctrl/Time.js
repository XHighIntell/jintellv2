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

        if (keycode == 37) this._keydownLeft();
        if (keycode == 39) this._keydownRight();
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

        if (48 <= e.keyCode && e.keyCode <= 57) {
            // internal handle number key press
            // 1. calculate newUnitValue from keycode. number (0-9)
            //   a. if current is seconds and newUnitValue > 59 and user press 3 time, newUnitValue is new input
            // 2. setEditValue to handle new value
            // 3. move to next if possible

            var name = __private.currentUnitName; if (name == null) return;
            var inputNumber = e.keyCode - 48;
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