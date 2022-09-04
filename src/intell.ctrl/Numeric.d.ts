


declare namespace intell.ctrl {

    /** Represents a spin box that displays numeric values. */
    export class Numeric {

        /** Initializes a new instance of the Numeric class from element.
         * @param element The element for which to create Numeric.*/
        constructor(element: HTMLElement);

        // properties
        /** Gets the root element of control. */
        element: HTMLElement;

        /** Gets the button up element. */
        elementUp: HTMLElement;

        /** Gets the button down element. */
        elementDown: HTMLElement;

        /** Gets the input element. */
        elementInput: HTMLInputElement;

        /** Gets or sets the minimum allowed value; the default is null. */
        min: number;

        /** Gets or sets the maxium allowed value; the default is null. */
        max: number;

        /** Gets or sets the minimum number of digits to appear after the decimal point; the default is 0. */
        minimumFractionDigits: number;

        /** Gets or sets the maximum number of digits to appear after the decimal point; the default is 2. */
        maximumFractionDigits: number;

        /** Gets or sets the decimal separator; the default is locale decimal separator. */
        decimalSeparator: string;

        /** Gets or sets the thousand separator; the default is locale thousand separator. */
        thousandSeparator: string;

        /** Gets or sets the value of Numeric. */
        value?: number;

        /** Gets or sets whether the value can be null; the default is false. */
        nullable: boolean;

        /** Gets or sets the value to increment or decrement the spin box (also known as an up-down control) when the up or down buttons are clicked; the default is 1. */
        increment: number;

        // methods
        getPrivate(): NumericPrivate;
        increaseSessionBy(value: number): void;
        protected _focusout(): void;

        // static methods
        /** Returns a floating point number parsed from the given string specified language-sensitive representation. */
        static parseFloat(text: string, option: NumericFormatOption): number;

        /** Returns a string with a language-sensitive representation of this number. If number is null/NaN, return empty string. 
         * @param number The value to parse. If this argument is not a string, then it is converted to one using the ToString abstract operation.
         * @param option An object that supplies culture-specific formatting information. */
        static formatNumber(number: number, option: NumericFormatOption): string;
        static getItem(element: HTMLElement): Numeric;
        static setItem(element: HTMLElement, comboBox: Numeric): Numeric;
    }

    interface NumericFormatOption {
        /** Gets or sets the minimum number of digits to appear after the decimal point; the default is 0. */
        minimumFractionDigits: number;

        /** Gets or sets the maximum number of digits to appear after the decimal point; the default is 2. */
        maximumFractionDigits: number;

        /** Gets or sets the decimal separator; the default is locale decimal separator. */
        decimalSeparator: string;

        /** Gets or sets the thousand separator; the default is locale thousand separator. */
        thousandSeparator: string;
    }

    interface NumericPrivate {
        element: HTMLElement;
        elementUp: HTMLElement;
        elementDown: HTMLElement;
        elementInput: HTMLInputElement;
        min: number;
        max: number;
        minimumFractionDigits: number;
        maximumFractionDigits: number;
        decimalSeparator: number;
        thousandSeparator: number;
        nullable: boolean;
        value: number;

        increment: number;
    }


}