!function() {
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