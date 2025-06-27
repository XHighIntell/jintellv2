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