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
        });

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