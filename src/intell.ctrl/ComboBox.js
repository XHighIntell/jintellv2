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