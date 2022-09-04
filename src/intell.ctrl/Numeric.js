!function() {
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





