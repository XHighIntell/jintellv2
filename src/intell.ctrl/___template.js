!function() {
    if (globalThis.window == null) return;
    var ctrl = intell.ctrl;
    var __Template = ctrl.__Template;


    // ====== constructor =======
    /** @param {HTMLElement} element */
    __Template = function(element) {
        
        // 1. If this function is called without the new keyword, recall if with the new keyword
        // 2. If functions are not added to the prototype, create/add them

        // --1 & 1a--
        if (__Template.getItem(element)) return __Template.getItem(element);
        if (this instanceof __Template == false) return new __Template(element);


        var _this = __Template.setItem(element, this);
        var $element = $(element);


        var __private = _this.getPrivate({});
        __private.element = element;

    }
    ctrl.__Template = __Template;

    // ===== setup inherit ======
    ctrl.template.inherit(__Template, { ctrlKey: Symbol('__Template') });

    // ====== properties ======
    var prototype = __Template.prototype;
    ctrl.template.defineProperties(prototype, {
        element: {
            get: function() { return this.getPrivate().element },
            set: function() { throw new Error("'__Template.element' cannot be assigned to -- it is read only") }
        }
    });

    // ====== methods ======


    // ==== static methods ====

    

}()