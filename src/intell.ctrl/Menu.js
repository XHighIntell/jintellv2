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