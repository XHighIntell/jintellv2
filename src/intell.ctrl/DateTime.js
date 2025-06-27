!function() {
    //if (globalThis.window == null) return;
    const ctrl = intell.ctrl;
    let DateTime = ctrl.DateTime;

    const ACTIVE_CLASS = "ACTIVE";
    const CHILDREN_VISIBLE_CLASS = "CHILDREN-VISIBLE"; // Appears on the top most element
    const CHILDREN_FADEOUT_CLASS = "CHILDREN-OUT";     // Appears on the top most element
    const FADEOUT_CLASS = "OUT";
    const CHANGE_EVENT = "datetimechange";
    //const FIRST_ACTIVE_CLASS = "FIRST";

    // ====== constructor =======
    /** @param {HTMLElement} element */
    DateTime = function(element) {
        
        // 1. If this function is called without the new keyword, recall if with the new keyword
        // 2. If functions are not added to the prototype, create/add them

        // --1 & 1a--
        if (DateTime.getItem(element)) return DateTime.getItem(element);
        if (this instanceof DateTime == false) return new DateTime(element);


        let _this = DateTime.setItem(element, this);
        let $element = $(element);
        let $label = $element.find('>.Label');
        let $input = $label.find('.Input');
        let $edit = $label.find('.Edit');
        let $children = $element.find('>.Children');
        let $intersect = $children.find('>.Intersect');

        let $calendar = $children.find('.Calendar');
        let $calendarHeader = $calendar.find('.Calendar-Header');
        let $calendarTitle = $calendar.find('.Calendar-Title');
        let $calendarPrev = $calendar.find('.Calendar-Prev');
        let $calendarNext = $calendar.find('.Calendar-Next');
        let $calendarTable = $calendar.find('.Calendar-Table');
        let $calendarTableHead = $calendar.find('.Calendar-Table-Head');
        let $calendarTableBody = $calendar.find('.Calendar-Table-Body');

        let $clock = $children.find('.Clock');
        let $clockTime = $clock.find('.Time');
        let $clockHours = $clock.find('.Hours'); let $clockHoursValue = $clockHours.find('.Value');
        let $clockMinutes = $clock.find('.Minutes'); let $clockMinutesValue = $clockMinutes.find('.Value');
        let $clockSeconds = $clock.find('.Seconds'); let $clockSecondsValue = $clockSeconds.find('.Value');
        let $clockMilliseconds = $clock.find('.Milliseconds'); let $clockMillisecondsValue = $clockMilliseconds.find('.Value');
        let $clockNoon = $clock.find('.Noon');
        let $clockTimezone = $clock.find('.Timezone');

        // Predefine
        if ($label.length == 0) $label = $(`<div class="Label"></div>`).prependTo(element);
        if ($input.length == 0) $input = $(`<input class="Input"/>`).appendTo($label);
        if ($edit.length == 0) $edit = $(`<div class="Edit"></div>`).appendTo($label);
        if ($children.length == 0) $children = $(`<div class="Children"></div>`).appendTo(element);
        if ($intersect.length == 0) $intersect = $(`<div class="Intersect"></div>`).prependTo($children);

        if ($calendar.length == 0) $calendar = $(`<div class="Calendar"></div>`).appendTo($children);
        if ($calendarHeader.length == 0) $calendarHeader = $(`<div class="Calendar-Header"></div>`).appendTo($calendar);
        if ($calendarTitle.length == 0) $calendarTitle = $(`<div class="Calendar-Title"></div>`).prependTo($calendarHeader);
        if ($calendarPrev.length == 0) $calendarPrev = $(`<div class="Calendar-Prev" tabindex="0"></div>`).appendTo($calendarHeader);
        if ($calendarNext.length == 0) $calendarNext = $(`<div class="Calendar-Next" tabindex="0"></div>`).appendTo($calendarHeader);
        if ($calendarTable.length == 0) $calendarTable = $(`<div class="Calendar-Table" tabindex="0"></div>`).appendTo($calendar);
        if ($calendarTableHead.length == 0) $calendarTableHead = $(`<div class="Calendar-Table-Head"></div>`).prependTo($calendarTable);
        if ($calendarTableBody.length == 0) $calendarTableBody = $(`<div class="Calendar-Table-Body"></div>`).appendTo($calendarTable);

        if ($clock.length == 0) $clock = $(`<div class="Clock"></div>`).appendTo($children);
        if ($clockTime.length == 0) $clockTime = $(`<span class="Time" tabindex="0"></div>`).appendTo($clock);
        if ($clockHours.length == 0) $clockHours = $(`<span class="Hours"><span class="Value"></span></span>`).prependTo($clockTime); if ($clockHoursValue.length == 0) $clockHoursValue = $clockHours.find('.Value');
        if ($clockMinutes.length == 0) $clockMinutes = $(`<span class="Minutes">:<span class="Value"></span></span>`).insertAfter($clockHours); if ($clockMinutesValue.length == 0) $clockMinutesValue = $clockMinutes.find('.Value');
        if ($clockSeconds.length == 0) $clockSeconds = $(`<span class="Seconds">:<span class="Value"></span></span>`).insertAfter($clockMinutes); if ($clockSecondsValue.length == 0) $clockSecondsValue = $clockSeconds.find('.Value');
        if ($clockMilliseconds.length == 0) $clockMilliseconds = $(`<span class="Milliseconds">.<span class="Value"></span></span>`).insertAfter($clockSeconds); if ($clockMillisecondsValue.length == 0) $clockMillisecondsValue = $clockMilliseconds.find('.Value');
        if ($clockNoon.length == 0) $clockNoon = $(`<span class="Noon"></span>`).insertAfter($clockMilliseconds); 
        if ($clockTimezone.length == 0) $clockTimezone = $(`<span class="Timezone"></span>`).insertAfter($clockNoon);

        $clockNoon[0]?.insertAdjacentText('beforebegin', ' ');
        $clockNoon[0]?.insertAdjacentText('afterend', ' ');

        let __private = _this.getPrivate({});
        __private.element = element;
        __private.elementLabel = $label[0];
        __private.elementLabelInput = $input[0];
        __private.elementLabelEdit = $edit[0];
        __private.elementChildren = $children[0];
        __private.elementIntersect = $intersect[0];
        __private.elementCalendar
        __private.elementCalendarTitle = $calendarTitle[0];
        __private.elementCalendarPrev = $calendarPrev[0];
        __private.elementCalendarNext = $calendarNext[0];
        __private.elementCalendarTable = $calendarTable[0];
        __private.elementCalendarTableHead = $calendarTableHead[0];
        __private.elementCalendarTableBody = $calendarTableBody[0];

        __private.elementClock = $clock[0];
        __private.elementClockTime = $clockTime[0];
        __private.elementClockHours = $clockHours[0]; __private.elementClockHoursValue = $clockHoursValue[0];
        __private.elementClockMinutes = $clockMinutes[0]; __private.elementClockMinutesValue = $clockMinutesValue[0];
        __private.elementClockSeconds = $clockSeconds[0]; __private.elementClockSecondsValue = $clockSecondsValue[0];
        __private.elementClockMilliseconds = $clockMilliseconds[0]; __private.elementClockMillisecondsValue = $clockMillisecondsValue[0];
        __private.elementClockNoon = $clockNoon[0];
        __private.elementClockTimezone = $clockTimezone[0];
        
        __private.active = false;
        __private.firstDayOfWeek = 0; 
        __private.timezoneOffset = DateTime.getLocaleTimezoneOffset();
        __private.locales = navigator.language;
        __private.secondsEnabled = true;
        __private.millisecondsEnabled = false;
        __private.hour12 = false;
        __private.nullable = true;
        __private.calendarLocations = [9, 1];
        __private.calendarOption = { container_mode: "auto", space: -1 }
        __private.calendarFadeOutTime = 0;

        // session
        __private.childrenVisible = false;
        __private.childrenFadingOut = false;
        __private.clockValue = 0;
        __private.clockCurrentUnitName = undefined;
        __private.clockCurrentUnitValue = 0;
        __private.clockCurrentInputCount = 0;

        //
        _this.firstDayOfWeek = __private.firstDayOfWeek;
        _this.timezoneOffset = __private.timezoneOffset;
        _this.secondsEnabled = __private.secondsEnabled;
        _this.millisecondsEnabled = __private.millisecondsEnabled;

        // handle events
        element.addEventListener('focusin', function(e) {
            // PURPOSE: activate when it or its children got focus

            if (__private.element.contains(e.target) == true) _this.active = true;
        });
        document.addEventListener('focusin', function(e) {
            // PURPOSE: deactivate when lost focus to another element outside
            // do not deactivate when childrens take focus

            if (__private.active == false) return; // already lost focus
            if (element.contains(e.target) == true) return;
            // occurs when another element steal focus from us

            _this._blur();
        });
        document.addEventListener('mousedown', function(e) {
            // PURPOSE: deactivate when lost focus by mousedown outside

            if (__private.active == false) return; // already lost focus
            // if (__private.calendarVisible == true && __private.calendarFadingOut == true) return; // fading out
            if (__private.element.contains(e.target) == true) return; // mouseup from inside

            _this._blur();
        });
        element.addEventListener('keydown', function(e) { _this._keydown(e) });
        element.addEventListener('change', function(e) {
            _this._change(e);
        });
        $edit[0]?.addEventListener('click', function() {
            const __private = _this.getPrivate();
            if (__private.childrenVisible == false) _this._keydown({ key: "Enter" });
            else _this._keydown({ key: "Enter" });
        });
        $calendarPrev.click(function(e) {
            if (__private.calendarMonth == null) return;

            _this.calendarNext(-1);
        });
        $calendarNext.click(function() {
            if (__private.calendarMonth == null) return;

            _this.calendarNext(1);
        });
        $calendarTableBody.on('click', '>div', function(e) { _this.setCalendarValue(this._time) });

        __private.elementClockTime?.addEventListener('focus', function() {
            var __private = _this.getPrivate();
            if (__private.clockCurrentUnitName == null) _this.setClockCurrentUnitName("hours");
        });
        __private.elementClockTime?.addEventListener('blur', function(e) {
            _this.setClockCurrentUnitName(null);
        });
        __private.elementClockTime?.addEventListener('mousedown', function(e) {
            const name = _this.getClockUnitName(e.target);
            if (name) _this.setClockCurrentUnitName(name);
        });
    }
    ctrl.DateTime = DateTime;

    // ===== setup inherit ======
    ctrl.template.inherit(DateTime, { ctrlKey: Symbol('DateTime') });
    
    // ====== properties ======
    const prototype = DateTime.prototype;
    ctrl.template.defineProperties(prototype, {
        element: {
            get: function() { return this.getPrivate().element },
            set: function() { throw new Error("'DateTime.element' cannot be assigned to -- it is read only") }
        },
        elementLabel: {
            get: function() { return this.getPrivate().elementLabel },
            set: function() { throw new Error("'DateTime.elementLabel' cannot be assigned to -- it is read only") }
        },
        elementChildren: {
            get: function() { return this.getPrivate().elementChildren },
            set: function() { throw new Error("'DateTime.elementCalendar' cannot be assigned to -- it is read only") }
        },
        elementIntersect: {
            get: function() { return this.getPrivate().elementIntersect },
            set: function() { throw new Error("'DateTime.elementIntersect' cannot be assigned to -- it is read only") }
        },

        value: {
            get: function() { return this.getPrivate().value },
            set: function(newValue) {
                if (typeof (newValue) != "number" && newValue != null) throw new Error("DateTime.value must be number");

                this.setValue(newValue, false);
            }
        },
        timezoneOffset: {
            get: function() { return this.getPrivate().timezoneOffset },
            set: function(newValue) {
                if (typeof newValue !== 'number') throw new Error("DateTime.timezoneOffset must be number");

                const __private = this.getPrivate();
                __private.timezoneOffset = newValue;

                if (newValue == 0) __private.elementClockTimezone.textContent = "UTC";
                else {
                    const hhmm = intell.ctrl.Time.getHHMMSS(Math.abs(newValue) * 60000);

                    __private.elementClockTimezone.textContent = `GMT${newValue > 0 ? '-' : '+'}${hhmm.hours.toString().padStart(2, "0")}${hhmm.minutes.toString().padStart(2, "0")}`;
                }                
            }
        },
        firstDayOfWeek: {
            get: function() { return this.getPrivate().firstDayOfWeek },
            set: function(newValue) { this.setFirstDayOfWeek(newValue) }
        },
        locales: {
            get: function() { return this.getPrivate().locales },
            set: function(newValue) {
                const __private = this.getPrivate();
                __private.locales = newValue;

                this.setFirstDayOfWeek(__private.firstDayOfWeek);
                this.setCalendarMonth(__private.calendarMonth, true);
            }
        },
        secondsEnabled: {
            get: function() { return this.getPrivate().secondsEnabled },
            set: function(newValue) {
                const __private = this.getPrivate();

                __private.secondsEnabled = newValue;
                $(__private.elementClockSeconds).toggle(newValue == true);
            }
        },
        millisecondsEnabled: {
            get: function() { return this.getPrivate().millisecondsEnabled },
            set: function(newValue) {
                const __private = this.getPrivate();

                __private.millisecondsEnabled = newValue;
                $(__private.elementClockMilliseconds).toggle(newValue == true);
            }
        },
        hour12: {
            get: function() { return this.getPrivate().hour12 },
            set: function(newValue) {
                const __private = this.getPrivate();

                __private.hour12 = newValue;
                this.setClockValue(__private.clockValue);
                $(__private.elementClockNoon).toggle(newValue == true);
            }
        },
        nullable: {
            get: function() { return this.getPrivate().nullable },
            set: function(newValue) { this.getPrivate().nullable = newValue },
        },
        calendarLocations: {
            get: function() { return this.getPrivate().calendarLocations },
            set: function(newValue) { this.getPrivate().calendarLocations = newValue },
        },
        calendarOption: {
            get: function() { return this.getPrivate().calendarOption },
            set: function(newValue) { this.getPrivate().calendarOption = newValue },
        },
        calendarFadeOutTime: {
            get: function() { return this.getPrivate().calendarFadeOutTime },
            set: function(newValue) { this.getPrivate().calendarFadeOutTime = newValue },
        },

        active: {
            get: function() { return this.getPrivate().active },
            set: function(newValue) {
                var __private = this.getPrivate();

                if (__private.active == newValue) return;

                // 1. set ACTIVE class
                // 2. When active equal true
                //    a. show calendar
                // 3. when active equal false
                //    a. calendar must be deactive too


                // --1--
                __private.element.classList.toggle(ACTIVE_CLASS, newValue);
                __private.active = newValue;

                if (newValue == true) {
                    // --2a--
                } else {
                    // --3a--
                    this.hideChildren();
                }
            }
        },
        calendarVisible: {
            get: function() { return this.getPrivate().childrenVisible },
            set: function(newValue) {

                var __private = this.getPrivate();

                // 1. exit if already in the same state
                // 2. When newValue == true
                //    a. show calendar
                // 3. When newValue == false
                //    a. hide calendar

                // --1--
                if (__private.childrenVisible == newValue) return;

                if (newValue == true) {
                    // --2a--
                    this.showChildrenAt(__private.element)
                } else {
                    // --3a--
                    this.hideChildren();
                }

            }
        }
    });
    
    // ====== methods ======
    prototype.customFormatDisplay = function(time) {
        const __private = this.getPrivate();
        const hours = Math.floor(Math.abs(__private.timezoneOffset) / 60);
        const minutes = Math.floor(Math.abs(__private.timezoneOffset) % 60);
        const timeZone = `${__private.timezoneOffset > 0 ? '-' : '+'}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`; // +07:00

        const date = new Date(time);

        const part1 = Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(date);
        const part2 = Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false, fractionalSecondDigits: __private.millisecondsEnabled == true ? 3 : undefined, timeZone: timeZone, timeZoneName: 'short' }).format(date);
        
        //const part1 = date.toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' });
        //const part2 = date.toLocaleString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false, fractionalSecondDigits: __private.millisecondsEnabled == true ? 3 : undefined, timeZone: timeZone, timeZoneName: 'short' });
        
        return `${part1} ${part2}`
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
        // 5. display information on Calendar and Clock

        var __private = this.getPrivate();
        
        // --1--
        if (locations == null) locations = locations ?? __private.calendarLocations;
        if (option == null) option = option ?? __private.calendarOption;

        var element = __private.element;
        var elementCalendar = __private.elementChildren;
        var elementIntersect = __private.elementIntersect;

        // --2--
        if (__private.childrenVisible == true) return;


        if (__private.childrenFadingOut == false) {
            // --3a--
            var result = ctrl.showAt(elementCalendar, target, locations, option);
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
            ctrl.stopHide(elementCalendar);
        }
        element.focus({ preventScroll: true });
        __private.childrenVisible = true;

        // --5-- 
        this.setCalendarMonth(__private.value ?? Date.now());
        this.setClockValue(__private.value == null ? 0 : DateTime.getClockTime(__private.value, __private.timezoneOffset));
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
        var elementCalendar = __private.elementChildren;
        var delayHideTime = __private.calendarFadeOutTime;

        // --3a--
        if (delayHideTime == 0) this.hideChildrenImmediately();
        else {
            // --3b-- 
            __private.childrenVisible = false;
            __private.childrenFadingOut = true;

            element.classList.remove(CHILDREN_VISIBLE_CLASS);
            element.classList.add(CHILDREN_FADEOUT_CLASS);

            ctrl.startHide(elementCalendar, delayHideTime, FADEOUT_CLASS).then(function() {
                element.classList.remove(CHILDREN_FADEOUT_CLASS);

                __private.childrenFadingOut = false;
                __private.calendarMonth = null;
                __private.calendarValue = null;
            });

            // --4--
            //__private.children.forEach(child => {
            //    var child__private = child.getPrivate();
            //    if (child__private.active == true) child.active = false;
            //    child.hideChildren()
            //});
        };
    }
    prototype.hideChildrenImmediately = function() {
        var __private = this.getPrivate();
        var element = __private.element;
        var elementCalendar = __private.elementChildren;

        // 1. if children are completely hidden, exit
        // 2. stop the fading-out process and hide elementChildren immediately
        //    a. remove classes
        // 3. hide the children too and deactive them too

        // --1--
        if (__private.childrenVisible == false && __private.childrenFadingOut == false) return;

        __private.childrenVisible = false;
        __private.childrenFadingOut = false;
        __private.calendarMonth = null;
        __private.calendarValue = null;

        // --2--
        ctrl.stopHide(elementCalendar); ctrl.hide(elementCalendar);
        element.classList.remove(CHILDREN_VISIBLE_CLASS, CHILDREN_FADEOUT_CLASS);
    }

    prototype.setCalendarMonth = function(calendarDateTime, force) {
        const __private = this.getPrivate();
        const timezoneOffset = __private.timezoneOffset;

        if (force !== true && __private.calendarMonth != null && DateTime.isSameMonth(calendarDateTime, __private.calendarMonth, timezoneOffset) == true) return false;
        
        const Year = DateTime.getYear(calendarDateTime, timezoneOffset);
        const Month = DateTime.getMonth(calendarDateTime, timezoneOffset); // 1 - 12
        const firstDateOfMonthTime = Date.UTC(Year, Month- 1, 1) + timezoneOffset * 60_000;
        const lastDateOfMonthTime = Date.UTC(Year, Month, 0) + timezoneOffset * 60_000;

        // firstDateOfMonth.Day + ? startOffset ? = firstDayOfWeek
        let startOffset = __private.firstDayOfWeek - DateTime.getDayOfWeek(firstDateOfMonthTime, timezoneOffset);
        if (startOffset > 0) startOffset -= 7;

        // lastDateOfMonth.Day + ? endOffset ? = (firstDayOfWeek + 7 - 1) % 7
        let endOffset = (__private.firstDayOfWeek + 7 - 1) % 7 - DateTime.getDayOfWeek(lastDateOfMonthTime, timezoneOffset);
        if (endOffset < 0) endOffset += 7;

        const startTime = firstDateOfMonthTime + 86_400_000 * startOffset;
        let endTime = lastDateOfMonthTime + 86_400_000 * endOffset;

        const co = (endTime - startTime) / 86_400_000 + 1; // co + ? = 42
        if (co < 42) endTime += (42 - co) * 86_400_000;

        // September 2024
        __private.elementCalendarTitle.innerHTML = DateTime.getMonthName(DateTime.getMonth(calendarDateTime, timezoneOffset), __private.locales) + ' ' + Year;
        __private.elementCalendarTableBody.replaceChildren(); // let clear everythings

        for (let i = 0; ; i++) {
            const currentTime = startTime + i * 86_400_000;

            const element = $(`<div><span>${DateTime.getDate(currentTime, timezoneOffset)}</span ></div >`)[0];
            element._time = currentTime;

            if (DateTime.isSameMonth(currentTime, calendarDateTime, timezoneOffset) == false) element.classList.add('OTHER-MONTH');
            if (__private.value != null && DateTime.isSameDate(currentTime, __private.value, timezoneOffset) == true) element.classList.add('SELECTED');

            __private.elementCalendarTableBody.append(element);

            if (currentTime >= endTime) break;
        }

        __private.calendarMonth = calendarDateTime;
        __private.calendarStart = startTime;
        __private.calendarEnd = endTime;

        if (__private.calendarValue != null) this.setCalendarValue(__private.calendarValue);

        return true;
    }
    prototype.setCalendarValue = function(calendarValue) {
        const __private = this.getPrivate();
        const timezoneOffset = __private.timezoneOffset;
        const childrenElements = Array.from(__private.elementCalendarTableBody.children);
        const element = childrenElements.find(element => DateTime.isSameDate(element._time, calendarValue, timezoneOffset));

        $(childrenElements).removeClass('ACTIVE');
        if (element != null) element.classList.add('ACTIVE');

        __private.calendarValue = calendarValue;
    }
    prototype.setFirstDayOfWeek = function(firstDayOfWeek) {
        if (typeof firstDayOfWeek !== 'number') throw new Error("DateTime.firstDayOfWeek must be number");
        if (firstDayOfWeek < 0 || firstDayOfWeek > 6) throw new Error("DateTime.firstDayOfWeek must be 0 to 6")

        const __private = this.getPrivate();

        for (let i = firstDayOfWeek; i < firstDayOfWeek + 7; i++) {
            let element = __private.elementCalendarTableHead.children[i - firstDayOfWeek];
            if (element == null) {
                const $element = $('<div></div>');
                element = $element[0];
                __private.elementCalendarTableHead.appendChild(element);
            }
            element.innerHTML = DateTime.getWeekDayName(i, __private.locales); // .substr(0, 2);
            element.className = `Day${i}`;
        }

        __private.firstDayOfWeek = firstDayOfWeek;

        if (__private.calendarMonth != null) this.setCalendarMonth(__private.calendarMonth, true)
        if (__private.calendarValue != null) this.setCalendarValue(__private.calendarValue);
    }
    prototype.calendarNext = function(n) {
        const __private = this.getPrivate();
        if (__private.calendarMonth == null) return;

        const calendarMonthDate = new Date(__private.calendarMonth - __private.timezoneOffset * 60000);
        const newCalendarMonth = Date.UTC(calendarMonthDate.getUTCFullYear(), calendarMonthDate.getUTCMonth() + n);

        this.setCalendarMonth(newCalendarMonth);
    }

    prototype.setClockValue = function(value) {
        const __private = this.getPrivate();
        const hhmmss = intell.ctrl.Time.getHHMMSS(value);

        if (__private.hour12 == false) {
            __private.elementClockHoursValue.textContent = hhmmss.hours;
            __private.elementClockMinutesValue.textContent = hhmmss.minutes.toString().padStart(2, '0');
            __private.elementClockSecondsValue.textContent = hhmmss.seconds.toString().padStart(2, '0');
            __private.elementClockMillisecondsValue.textContent = hhmmss.milliseconds.toString().padStart(3, '0');
            __private.elementClockNoon.textContent = "";
        } else {
            __private.elementClockHoursValue.textContent = hhmmss.hours % 12;
            __private.elementClockMinutesValue.textContent = hhmmss.minutes.toString().padStart(2, '0');
            __private.elementClockSecondsValue.textContent = hhmmss.seconds.toString().padStart(2, '0');
            __private.elementClockMillisecondsValue.textContent = hhmmss.milliseconds.toString().padStart(3, '0');
            __private.elementClockNoon.textContent = hhmmss.hours < 12 ? "AM" : "PM";
        }

        __private.clockValue = value;
    }
    prototype.getClockUnitName = function(target) {
        const __private = this.getPrivate();

        if (__private.elementClockHours.contains(target)) return "hours";
        else if (__private.elementClockMinutes.contains(target)) return "minutes";
        else if (__private.elementClockSeconds.contains(target)) return "seconds";
        else if (__private.elementClockMilliseconds.contains(target)) return "milliseconds";
        else if (__private.elementClockNoon.contains(target)) return "noon";
    }
    prototype.getClockUnitElement = function(name) {
        var __private = this.getPrivate();

        if (name == "hours") return __private.elementClockHours;
        if (name == "minutes") return __private.elementClockMinutes;
        if (name == "seconds") return __private.elementClockSeconds;
        if (name == "milliseconds") return __private.elementClockMilliseconds;
        if (name == "noon") return __private.elementClockNoon;
    }
    prototype.setClockCurrentUnitName = function(name) {
        var __private = this.getPrivate();

        if (name !== "hours" && name != "minutes" && name != "seconds" && name != "milliseconds" && name != "noon" && name != null) throw new Error("'name' must be 'hours', 'minutes', 'seconds', 'milliseconds' or 'noon'");
        if (__private.clockCurrentUnitName == name) return;

        __private.clockCurrentUnitName = name;
        __private.clockCurrentUnitValue = 0;
        __private.clockCurrentInputCount = 0;

        $([__private.elementClockHours, __private.elementClockMinutes, __private.elementClockSeconds, __private.elementClockMilliseconds, __private.elementClockNoon]).removeClass(ACTIVE_CLASS);
        this.getClockUnitElement(name)?.classList.add(ACTIVE_CLASS);
    }
    prototype.setValue = function(newValue, raiseEvent) {
        const __private = this.getPrivate();
        const oldValue = __private.value;

        // if we are not allow null, exit 
        if (__private.nullable == false && newValue == null) return false;

        __private.value = newValue;


        if (newValue == null) __private.elementLabelInput.value = '';
        else {
            const displayText = this.customFormatDisplay(newValue);
            __private.elementLabelInput.value = displayText;
        }

        if (__private.childrenVisible == true) {
            this.setCalendarMonth(__private.value ?? Date.now(), true);
            this.setCalendarValue(newValue);
            this.setClockValue(__private.value == null ? 0 : DateTime.getClockTime(__private.value, __private.timezoneOffset));
        }

        if (raiseEvent == true && oldValue != newValue) {
            const event = new Event(CHANGE_EVENT, { cancelable: false, bubbles: true });
            event.control = this;
            __private.element.dispatchEvent(event);
        }

        return true;
    }

    // `_` mean handle events
    prototype._blur = function() {
        const __private = this.getPrivate();

        if (__private.childrenVisible == true) doBeforeHideChildren.apply(this);
       
        (this).active = false;
    }
    prototype._keydown = function(e) {
        const __private = this.getPrivate();

        if (e.code == "Escape") {
            // occurs when user press Esc
            // 1. while calendar visible
            // 2. while calendar hidden

            if (__private.childrenVisible == true) {
                // --1--
                this.hideChildren();
                __private.element.focus();
            }
            else {
                // --2--
            }
        }
        
        if (document.activeElement == __private.element) {
            if (e.key == "Enter") {
                if (__private.childrenVisible == false) {
                    (this).calendarVisible = true;
                }
                else {
                    doBeforeHideChildren.apply(this);
                    this.hideChildren();
                }
            }
        }
        else if (document.activeElement == __private.elementCalendarPrev || document.activeElement == __private.elementCalendarNext) {
            if (e.key == "Enter") {
                if (document.activeElement == __private.elementCalendarPrev) this.calendarNext(-1);
                if (document.activeElement == __private.elementCalendarNext) this.calendarNext(+1);
            }
            else if (e.code == "Space") {
                if (document.activeElement == __private.elementCalendarPrev) this.calendarNext(-1);
                else if (document.activeElement == __private.elementCalendarNext) this.calendarNext(+1);
                e.preventDefault();
            }
        }
        else if (document.activeElement == __private.elementCalendarTable) { // when table is holding focus
            if (e.code.startsWith("Arrow") == true) {
                e.preventDefault();

                if (__private.calendarValue == null) {
                    if (__private.value != null) this.setCalendarValue(__private.value);
                    else {
                        const Year = DateTime.getYear(__private.calendarMonth, __private.timezoneOffset);
                        const Month = DateTime.getMonth(__private.calendarMonth, __private.timezoneOffset);
                        const first = Date.UTC(Year, Month - 1, 1) + __private.timezoneOffset * 60_000;
                        this.setCalendarValue(first);
                    }
                    return;
                }

                if (e.code == "ArrowLeft") {
                    this.setCalendarMonth(__private.calendarValue - 86_400_000);
                    this.setCalendarValue(__private.calendarValue - 86_400_000);
                }
                else if (e.code == "ArrowRight") {
                    this.setCalendarMonth(__private.calendarValue + 86_400_000);
                    this.setCalendarValue(__private.calendarValue + 86_400_000);
                }
                else if (e.code == "ArrowUp") {
                    this.setCalendarMonth(__private.calendarValue - 86_400_000 * 7);
                    this.setCalendarValue(__private.calendarValue - 86_400_000 * 7);
                }
                else if (e.code == "ArrowDown") {
                    this.setCalendarMonth(__private.calendarValue + 86_400_000 * 7);
                    this.setCalendarValue(__private.calendarValue + 86_400_000 * 7);
                }
            }
        }

        else if (document.activeElement == __private.elementClockTime) {
            if (e.key === parseInt(e.key).toString()) { // occurs when user presses 0-9
                const hhmmss = intell.ctrl.Time.getHHMMSS(__private.clockValue);
                const inputNumber = parseInt(e.key); // 0 - 9
                let newUnitValue = 0;

                __private.clockCurrentInputCount++; // number user pressed 

                if (__private.clockCurrentInputCount == 1) newUnitValue = inputNumber;
                else newUnitValue = __private.clockCurrentUnitValue * 10 + inputNumber;

                let moveNext = false;

                if (__private.clockCurrentUnitName == 'hours') {
                    const maxHours = __private.hour12 == false ? 24 : 12;

                    if (newUnitValue >= maxHours) { newUnitValue = inputNumber; __private.clockCurrentInputCount = 1 }
                    __private.elementClockHoursValue.innerHTML = hhmmss.hours = newUnitValue;

                    if (newUnitValue * 10 >= maxHours) moveNext = true;
                }
                else if (__private.clockCurrentUnitName == 'minutes') {
                    if (newUnitValue >= 60) { newUnitValue = inputNumber; __private.clockCurrentInputCount = 1 }
                    hhmmss.minutes = newUnitValue
                    __private.elementClockMinutesValue.innerHTML = newUnitValue.toString().padStart(2, '0');

                    if (newUnitValue >= 6) moveNext = true;
                }
                else if (__private.clockCurrentUnitName == 'seconds') {
                    if (newUnitValue >= 60) { newUnitValue = inputNumber; __private.clockCurrentInputCount = 1 }
                    hhmmss.seconds = newUnitValue;
                    __private.elementClockSecondsValue.innerHTML = newUnitValue.toString().padStart(2, '0');

                    if (newUnitValue >= 6) moveNext = true;
                }
                else if (__private.clockCurrentUnitName == 'milliseconds') {
                    newUnitValue = newUnitValue % 1000;

                    if (newUnitValue >= 1000) {
                        newUnitValue = inputNumber;
                        __private.clockCurrentInputCount = 1;
                    }
                    hhmmss.milliseconds = newUnitValue;
                    __private.elementClockMillisecondsValue.innerHTML = newUnitValue.toString().padStart(3, '0');

                    if (newUnitValue >= 100) moveNext = true;
                }

                __private.clockValue = hhmmss.hours * 3600_000 + hhmmss.minutes * 60000 + hhmmss.seconds * 1000 + hhmmss.milliseconds;
                __private.clockCurrentUnitValue = newUnitValue;

                if (moveNext == true) this._keydown({ key: "ArrowRight" });
                
            }
            else if (e.code == "KeyA" || e.code == "KeyP" && __private.clockCurrentUnitName == 'noon') {
                const hhmmss = intell.ctrl.Time.getHHMMSS(__private.clockValue);

                if (e.code == "KeyA") {
                    hhmmss.hours = hhmmss.hours % 12;
                    __private.elementClockNoon.textContent = "AM";
                }
                else if (e.code == "KeyP") {
                    if (hhmmss.hours < 12) hhmmss.hours += 12;
                    __private.elementClockNoon.textContent = "PM";
                }

                __private.clockValue = hhmmss.hours * 3600_000 + hhmmss.minutes * 60000 + hhmmss.seconds * 1000 + hhmmss.milliseconds;
            }
            else if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
                const blocks = ['hours', 'minutes'];
                if (__private.secondsEnabled == true) blocks.push('seconds');
                if (__private.millisecondsEnabled == true) blocks.push('milliseconds');
                if (__private.hour12 == true) blocks.push('noon');

                const factor = e.key == "ArrowLeft" ? -1 : 1;
                const index = blocks.indexOf(__private.clockCurrentUnitName);
                const nextName = blocks[index + factor];
                if (nextName) this.setClockCurrentUnitName(nextName);
            }
        }
    }
    prototype._change = function(e) {
        const __private = this.getPrivate();

        if (e.target == __private.elementLabelInput) {
            const text = __private.elementLabelInput.value.trim();
            const possibleValues = [];

            if (text == "") possibleValues.push(undefined);
            else {
                let value = parseInt(text);
                if (isNaN(value) == false && value.toString() == text) possibleValues.push(value);

                value = Date.parse(text);
                if (isNaN(value) == false) possibleValues.push(value);
            }

            // now we already have possibleValues

            const result = possibleValues.length == 0 ? this.setValue(__private.value, false) : this.setValue(possibleValues[0], true);

            // user enter nonsense input, reverse the text back
            if (result == false) __private.elementLabelInput.value = this.customFormatDisplay(__private.value);
            
        }
    }

    /** @this {intell.ctrl.DateTime} */
    function doBeforeHideChildren() {
        const __private = this.getPrivate();
        let newValue = 0;

        if (__private.calendarValue != null) {
            newValue = __private.calendarValue + __private.clockValue;
        } else {
            const startDateTime = __private.value - (__private.value - __private.timezoneOffset * 60000) % 86400000;
            newValue = startDateTime + __private.clockValue;
        }

        if (isNaN(newValue) == true) return;
        const oldValue = __private.value;

        if (oldValue == newValue) return;

        this.setValue(newValue, true);
        //(this).value = newValue; 
        //
        //if (oldValue != newValue) {
        //    __private.element.dispatchEvent(new Event(CHANGE_EVENT, { cancelable: false, bubbles: true }));
        //}
        
    }


    // ==== static methods ====
    DateTime.getLocaleTimezoneOffset = function() {
        return new Date().getTimezoneOffset();
    }
    DateTime.getWeekDayName = function(day, locales) {
        const formater = new Intl.DateTimeFormat(locales, { weekday: "short", timeZone: '+00' });
        return formater.formatToParts(Date.UTC(0, 0, day))[0].value;
    }
    DateTime.getMonthName = function(month, locales) {
        const formater = new Intl.DateTimeFormat(locales, { month: "long", timeZone: '+00' });
        return formater.formatToParts(Date.UTC(0, month, 0))[0].value;
    }

    DateTime.getYear = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return new Date(time - timezoneOffset * 60000).getUTCFullYear();
    }
    DateTime.getMonth = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return new Date(time - timezoneOffset * 60000).getUTCMonth() + 1;
    }
    DateTime.getDate = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return new Date(time - timezoneOffset * 60000).getUTCDate();
    }
    DateTime.getDayOfWeek = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return new Date(time - timezoneOffset * 60000).getDay();
    }
    DateTime.getHours = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return new Date(time - timezoneOffset * 60000).getUTCHours();
    }
    DateTime.getMinutes = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return new Date(time - timezoneOffset * 60000).getUTCHours();
    }
    DateTime.getSeconds = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return new Date(time - timezoneOffset * 60000).getUTCHours();
    }
    DateTime.getMilliseconds = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return new Date(time - timezoneOffset * 60000).getUTCMilliseconds();
    }
    DateTime.getClockTime = function(time, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        const date = new Date(time - timezoneOffset * 60000);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();
        const milliseconds = date.getUTCMilliseconds();

        return hours * 3600_000 + minutes * 60000 + seconds * 1000 + milliseconds;
    }
    DateTime.parse = function(s, timezoneOffset) {
        
    }

    DateTime.isSameDate = function(time1, time2, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return Math.floor((time1 - timezoneOffset * 60000) / 86_400_000) == Math.floor((time2 - timezoneOffset * 60000) / 86_400_000);
    }
    DateTime.isSameMonth = function(time1, time2, timezoneOffset) {
        if (timezoneOffset == null) throw new Error("timezoneOffset can't be null")
        return DateTime.getMonth(time1, timezoneOffset) == DateTime.getMonth(time2, timezoneOffset);
    }
}()