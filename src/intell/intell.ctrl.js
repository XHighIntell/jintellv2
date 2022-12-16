!function() {
    if (globalThis.window == null) return;
    var ctrl = intell.ctrl; ctrl = {}; intell.ctrl = ctrl;

    // === methods ===
    ctrl.show = function(element) {

        // 1. validate
        // 2. remove inline style
        // 3. getComputedStyle; if the element display is still none, set inline style

        // --1--
        if (arguments.length == 0) throw new TypeError("Failed to execute 'show' on 'intell.ctrl': 1 argument required, but only 0 present.");
        if (element instanceof HTMLElement == false) return;

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
                    if (rect.y - margin < container.y) {
                        rect.y = container.y + margin;
                        score--;
                    }
                    break;
                case 4: case 5: case 6:
                    if (rect.x + rect.width + margin > container.x + container.width) {
                        rect.x = container.x + container.width - margin - rect.width;
                        score--
                    }
                    break;
                case 7: case 8: case 9:
                    if (rect.y + rect.height + margin > container.y + container.height) {
                        rect.y = container.y + container.height - margin - rect.height;
                        score--;
                    }
                    break;
                case 10: case 11: case 12:
                    if (rect.x - margin < container.x) {
                        rect.x = container.x + margin;
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
                    if (computedStyle.overflow != 'visible' && computedStyle.position != 'static') return true;

                    return false;
                });

                if (elementContainer != null) {
                    let width = Math.max(elementContainer.clientWidth, elementContainer.offsetWidth, elementContainer.scrollWidth) - 1;
                    let height = Math.max(elementContainer.clientHeight, elementContainer.offsetHeight, elementContainer.scrollHeight) - 1;

                    let offset = $(elementContainer).offset();
                    let scrollbar_right_size = elementContainer.offsetWidth - elementContainer.clientWidth;
                    let scrollbar_bottom_size = elementContainer.offsetHeight - elementContainer.clientHeight;

                    // notes: <html> <body> tag cannot obtain a scroll bar (the browser scroll bar stays outside the border of the root element).
                    // => This may need more implementation.
                    if (elementContainer == document.documentElement || elementContainer == document.body) {
                        scrollbar_right_size = 0;
                        scrollbar_bottom_size = 0;
                    }

                    clone.container = new DOMRect(offset.left, offset.top, width - scrollbar_right_size, height - scrollbar_bottom_size);

                    option = clone;
                }
            }
        }


        $(element).css({ left: '-900px', visibility: 'hidden' });
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
    
}();