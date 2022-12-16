
declare namespace intell.ctrl {
    /** Represents a box that displays time/duration value. */
    export class Time {

        /** Initializes a new instance of the Time class from element.
         * @param element The element for which to create Time.*/
        constructor(element: HTMLElement);

        // properties
        /** Gets the root element of control. */
        readonly element: HTMLElement;

        /** Gets the hours element of control. */
        readonly elementHours: HTMLElement;

        /** Gets the minutes element of control. */
        readonly elementMinutes: HTMLElement;

        /** Gets the seconds element of control. */
        readonly elementSeconds: HTMLElement;

        /** Gets the miliseconds element of control. */
        readonly elementMilliseconds: HTMLElement;

        /** Gets or sets the value of time. */
        value: number

        /** Gets or sets whether the value can be null; the default is true. */
        nullable: boolean

        /**  Gets or sets the maxium allowed value; the default is 86399999 (23:59:59.999). */
        max: number;

        /** Gets or sets whether the seconds element is visible. */
        secondsEnabled: boolean;

        /** Gets or sets whether the miliseconds element is visible. */
        millisecondsEnabled: boolean;

        // methods
        getPrivate(): TimePrivate;

        /** Sets value of time. */
        setValue(newValue: number, keepLabel: boolean): void;

        /** Gets the element of the unit by its name. */
        getUnitElement(name: TimePrivate["currentUnitName"]): HTMLElement;

        // protected methods
        protected getEditName(element: HTMLElement): TimePrivate["currentUnitName"];
        protected setEditName(name: TimePrivate["currentUnitName"]): void;
        /** Set value of edit session. */
        protected setEditValue(name: TimePrivate["currentUnitName"], newUnitValue: number): void;
        protected updateElementLabel(name: TimePrivate["currentUnitName"], value: number): void;
        protected updateElementLabels(): void;

        // methods events
        protected _focus(): void;
        protected _mousedown(e: MouseEvent): void;
        protected _wheel(e: WheelEvent): void;
        protected _keydown(e: KeyboardEvent): void;
        protected _keydownLeft(): void;
        protected _keydownRight(): void;
        protected _keydownDel(): void;
        protected _keydownEsc(): void;
        protected _focusout(): void;

        // static methods
        static getItem(element: HTMLElement): Time;
        static setItem(element: HTMLElement, timespan: Time): Time;
        static getHHMMSS(value: number): { hours: number, minutes: number, seconds: number, milliseconds: number };
        static GetLengthOfNumber(value: number): number;

    }


    interface TimePrivate {
        element: HTMLElement;
        elementHours: HTMLElement;
        elementMinutes: HTMLElement;
        elementSeconds: HTMLElement;
        elementMilliseconds: HTMLElement;

        value: number;
        valueAsNumber: number;
        nullable: boolean
        max: number;
        secondsEnabled: boolean;
        millisecondsEnabled: boolean;

        // internal values
        hours: number;
        minutes: number;
        seconds: number;
        milliseconds: number;

        save_hours: number;
        save_minutes: number;
        save_seconds: number;
        save_milliseconds: number;
        currentUnitName: "hours" | "minutes" | "seconds" | "milliseconds";
        currentNumbers: number
    }

    
}