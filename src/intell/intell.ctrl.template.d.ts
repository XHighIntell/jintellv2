


/** This namespace is internally used by classes in intell.ctrl 
* This typescript type declaration won't be built into output */
declare namespace intell.ctrl.template {

    /** Setups prototype methods and static methods for new class.
     * - getPrivate(),
     * - static getItem(), 
     * - static setItem()  */
    export function inherit(constructor: Constructor, option: InheritOption): void;

    interface InheritOption {
        ctrlKey: symbol | string;
        mode: 'all';
        // methods: ['getPrivate']
        // static_methods: ['getItem', 'setItem'];
    }

    interface Constructor {
        (element: HTMLElement): void;

        prototype: {
            getPrivate(_default?: object): object;
        }

        getItem(element: HTMLElement): object;
        setItem(element: HTMLElement, control: object): object;
    }

}