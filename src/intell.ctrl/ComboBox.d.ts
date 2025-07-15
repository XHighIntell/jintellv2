


declare namespace intell.ctrl {

    /** Represents a combo box control. */
    export class ComboBox<T = any> {

        /** Initializes a new instance of the ComboBox class from element.
         * @param element The element for which to create ComboBox.*/
        constructor(element: HTMLElement);


        // properties
        /** Gets the root element of ComboBox. */
        readonly element: HTMLElement;
        readonly elementSelect: HTMLElement;
        readonly elementDropdown: HTMLElement;
        readonly elementChildren: HTMLElement;
        readonly elementItemAbstract: HTMLElement;
        readonly childrenVisible: boolean;
        readonly items: ComboBoxItem<T>[];


        popupLocations: number[];
        popupOption: intell.ctrl.ShowAtOption;
        selectedItem: ComboBoxItem<T>;
        /** Gets or sets the value of the ComboBox. If the value does not exist in the options list, the set operation will have no effect.*/
        value?: T;

        // methods
        getPrivate(): ComboBoxPrivate<T>;
        add(item: ComboBoxItem<T>): void;
        add(option: ComboBoxAddOption<T>): ComboBoxItem<T>;
        private addItem(item: ComboBoxItem<T>): void;
        private addOption(option: ComboBoxAddOption<T>): ComboBoxItem<T>;
        remove(item: ComboBoxItem<T>): void;
        clear(): void;

        // navigation methods
        toggleChildren(): void;
        showChildren(): void;
        showChildren(target: HTMLElement, hideOnFocusOut: boolean): void;
        showChildren(coord: intell.ctrl.CoordinatesLike): void;
        protected showChildrenElement(target: HTMLElement, hideOnFocusOut?: boolean): void;
        protected showChildrenCoord(coord: intell.ctrl.CoordinatesLike): void;
        hideChildren(): void;

        protected _pressEsc(): void;
        protected _pressEnter(): void;
        protected _pressUpOrDown(keyCode: number): void;
        protected _mouseUpOrClickItem(element: HTMLElement): void;
        protected _setSearchKeyword(keyword: string): void;

        /** _setItem function works as selectedItem property. _setItem dispatchEvent events while property doesn't.  */
        protected _setItem(item: ComboBoxItem<T>): void;

        // events: comboboxchange

        // static methods
        static getItem(element: HTMLElement): ComboBox;
        static setItem(element: HTMLElement, comboBox: ComboBox): ComboBox;
        
    }
    interface ComboBoxPrivate<T = any> {
        element: HTMLElement;
        elementSelect: HTMLElement;
        elementDropdown: HTMLElement;
        elementSearch: HTMLElement;
        elementSearchInput: HTMLInputElement;
        elementChildren: HTMLElement;
        elementItemAbstract: HTMLElement;
        childrenVisible: boolean;
        items: ComboBoxItem<T>[];
        groups: ComboBoxGroup[]

        popupLocations: number[];
        popupOption: ctrl.ShowAtOption;
        selectedItem: ComboBoxItem<T>;

        // navigation
        session_elementAt: HTMLElement;
        session_selectedItem: ComboBoxItem<T>;
    }
    interface ComboBoxAddOption<T = any> {
        icon?: string;
        name: string;
        value: T;
        group?: string;
        disabled?: boolean;
    }


    export class ComboBoxItem<T = any> {

        constructor(element: HTMLElement);

        // properties
        readonly element: HTMLElement;
        readonly elementIcon: HTMLElement;
        readonly elementName: HTMLElement;
        readonly parent: ComboBox;

        icon: string;
        name: string;
        value: T;
        group: string;
        disabled: boolean;

        // methods
        getPrivate(): ComboBoxItemPrivate;

        // static methods

        /** Gets ComboBoxItem of a element. */
        static getItem(element: HTMLElement): ComboBoxItem;
        static setItem(element: HTMLElement, combobox: ComboBoxItem): ComboBoxItem;
    }
    interface ComboBoxItemPrivate {
        element: HTMLElement;
        elementIcon: HTMLElement;
        elementName: HTMLElement;
        parent: ComboBox;
        parentGroup: ComboBoxGroup;

        icon: string;
        name: string;
        value: any;
        group: string;
        disabled: boolean;
    }


    export class ComboBoxGroup {

        constructor(element: HTMLElement);

        // properties
        readonly element: HTMLElement;
        readonly elementName: HTMLElement;
        readonly elementChildren: HTMLElement;
        readonly items: ComboBoxItem[];

        get name(): string;
        set name(newValue: string);

        // methods
        getPrivate(): ComboBoxGroup;
        add(item: ComboBoxItem): void;
        remove(item: ComboBoxItem): void;

        // static methods
        static getItem(element: HTMLElement): ComboBoxGroup;
        static setItem(element: HTMLElement, comboBoxGroup: ComboBoxGroup): ComboBoxGroup;
    }
    interface ComboBoxGroupPrivate {
        element: HTMLElement;
        elementName: HTMLElement;
        elementChildren: HTMLElement;

        name: string;
        items: ComboBoxItem[];
    }
}


