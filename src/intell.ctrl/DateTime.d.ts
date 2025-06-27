declare namespace intell.ctrl {
    export class DateTime {

        constructor(element: HTMLElement);

        //#region Properties
        /** Gets the root element of control. */
        readonly element: HTMLElement;

        /** Gets the element label of control. */
        readonly elementLabel: HTMLElement;

        readonly elementChildren: HTMLElement;

        readonly elementIntersect: HTMLElement;

        value?: number;
        timezoneOffset: number;
        firstDayOfWeek: number;

        /** Gets or sets the locales of the calendar. */
        locales?: string | string[];
        secondsEnabled: boolean;
        millisecondsEnabled: boolean;
        hour12: boolean;
        nullable: boolean;

        /** Gets or sets the locations where the calendar is positioned when displayed. */
        calendarLocations: number[];

        /** Gets or sets the option that determines where the calendar is positioned when displayed. */
        calendarOption: intell.ctrl.ShowAtOption;

        /** Gets or sets the fade-out duration for the calendar. */
        calendarFadeOutTime: number;

        /** Gets or sets the active state of this DateTime picker. */
        active: boolean;

        /** Gets or sets a value indicating whether its calendar are displayed. Return false when calendar are in the fading process. */
        calendarVisible: boolean;

        //#endregion

        // methods
        getPrivate(): DateTimePrivate;
        customFormatDisplay(time: number): string;

        showChildrenAt(target: HTMLElement, locations?: number[], option?: ShowAtOption): void;
        showChildrenAt(coords: CoordinatesLike, locations?: number[], option?: ShowAtOption): void;
        showChildrenAtRect(target: DOMRect, locations?: number[], option?: ShowAtOption): void;
        showChildrenAtElement(target: HTMLElement, locations?: number[], option?: ShowAtOption): void;
        showChildrenAtCoord(coordinates: CoordinatesLike, locations?: number[], option?: ShowAtOption): void;
        /** Hides the calendar. When the calendar is hidden, its session value is cleared. */
        hideChildren(): void;
        /** Immediately hides the calendar. When the calendar is hidden, its session value is cleared. */
        hideChildrenImmediately(): void;

        /** Sets new date/time value. Returns true if succeed, else false. */
        protected setValue(newValue: number, raiseEvents: boolean): boolean;

        /** Returns false if the current displaying month is the same with the new value. */
        protected setCalendarMonth(time: number, forceUpdate?: boolean): boolean;
        protected setCalendarValue(time: number): void;
        protected setFirstDayOfWeek(firstDayOfWeek: number): void;
        protected calendarNext(months: number): void;

        // CLOCK
        protected setClockValue(value: number): void;
        protected getClockUnitName(taret: HTMLElement): DateTimePrivate["clockCurrentUnitName"];
        protected getClockUnitElement(name: DateTimePrivate["clockCurrentUnitName"]): HTMLElement;
        protected setClockCurrentUnitName(name: DateTimePrivate["clockCurrentUnitName"]): void;

        
        

        // methods - occurs when users do input - ui events
        protected _blur(): void;
        protected _keydown(e: KeyboardEvent): void;
        protected _mousedown(e: MouseEvent): void;
        protected _change(e: Event): void;

        // static methods =============================
        public static getItem(element: HTMLElement): DateTime;
        public static setItem(element: HTMLElement, comboBox: DateTime): DateTime;

        /** Gets the local time zone offset in minutes. */
        public static getLocaleTimezoneOffset(): number;
        public static getWeekDayName(day: number, locales?: string): string;
        public static getMonthName(month: number, locales?: string): string;

        static getYear(time: number, timeZoneOffset: number): number;
        static getMonth(time: number, timeZoneOffset: number): number;

        /** Gets the day-of-the-month. */
        static getDate(time: number, timeZoneOffset: number): number;
        static getDayOfWeek(time: number, timeZoneOffset: number): number;
        static getHours(time: number, timeZoneOffset: number): number;
        static getMinutes(time: number, timeZoneOffset: number): number;
        static getSeconds(time: number, timeZoneOffset: number): number;
        static getMilliseconds(time: number, timeZoneOffset: number): number;

        /** Gets 24-hours clock of date time.*/
        static getClockTime(time: number, timeZoneOffset: number): number;
        static parse(s: string, timeZoneOffset: number): number;

        /** Checks whenever two datetimes have the same date. */
        public static isSameDate(time1: number, time2: number, timeZoneOffset: number): boolean;
        /** Checks whenever two datetimes have the same month. */
        public static isSameMonth(time1: number, time2: number, timeZoneOffset: number): boolean;
    }


    interface DateTimePrivate {
        element: HTMLElement;
        elementLabel: HTMLElement;
        elementLabelInput: HTMLInputElement;
        elementLabelEdit: HTMLElement;
        elementChildren: HTMLElement;
        elementIntersect: HTMLElement;

        elementCalendar: HTMLElement;
        elementCalendarHeader: HTMLElement;
        elementCalendarTitle: HTMLElement;
        elementCalendarPrev: HTMLElement;
        elementCalendarNext: HTMLElement;
        elementCalendarTable: HTMLElement;
        elementCalendarTableHead: HTMLElement;
        elementCalendarTableBody: HTMLElement;

        elementClock: HTMLElement;
        elementClockTime: HTMLElement;
        elementClockHours: HTMLElement; elementClockHoursValue: HTMLElement;
        elementClockMinutes: HTMLElement; elementClockMinutesValue: HTMLElement;
        elementClockSeconds: HTMLElement; elementClockSecondsValue: HTMLElement;
        elementClockMilliseconds: HTMLElement; elementClockMillisecondsValue: HTMLElement;
        elementClockNoon: HTMLElement;
        elementClockTimezone: HTMLElement;

        active: boolean;
        value?: number;
        timezoneOffset: number;
        firstDayOfWeek: number;
        locales?: string | string[];
        secondsEnabled: boolean;
        millisecondsEnabled: boolean;
        hour12: boolean;
        nullable: boolean;

        calendarLocations: number[];
        calendarOption: intell.ctrl.ShowAtOption;
        calendarFadeOutTime: number;

        // session
        childrenVisible: boolean;
        childrenFadingOut: boolean;

        calendarMonth?: number;
        calendarStart?: number; // the first date displayed on the calendar
        calendarEnd?: number; // the last date displayed on the calendar
        calendarValue?: number;

        // clockActive: boolean;
        clockValue: number;
        clockCurrentUnitName: "hours" | "minutes" | "seconds" | "milliseconds" | "noon" | undefined;
        clockCurrentUnitValue: number;
        clockCurrentInputCount: number; // number of keys user pressed
    }

}


interface GlobalEventHandlersEventMap {
    "datetimechange": Event & { control: intell.ctrl.DateTime };
}