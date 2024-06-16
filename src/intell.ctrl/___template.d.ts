declare namespace intell.ctrl {
    export class __Template {

        constructor(element: HTMLElement);

        // properties
        readonly element: HTMLElement;


        // methods
        getPrivate(): __TemplatePrivate;

        // static methods
        static getItem(element: HTMLElement): __Template;
        static setItem(element: HTMLElement, comboBox: __Template): __Template;
    }


    interface __TemplatePrivate {
        element: HTMLElement;
    }

}