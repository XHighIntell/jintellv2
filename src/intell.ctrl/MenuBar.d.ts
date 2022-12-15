declare namespace intell.ctrl {
    export class MenuBar {
        /** Initializes a new instance of the MenuBar class from element.
        * @param element The element for which to create MenuBar.*/
        constructor(element: HTMLElement);

        // properties
        /** Gets the root element of the menu. */
        readonly element: HTMLElement;

        /** Gets the abstract element of the menu. */
        readonly elementMenuAbstract: HTMLElement;

        /** Gets the children of the menubar. The return value is a clone array, it is safe to modify or use on some where. */
        readonly children: Menu[];

        // methods
        getPrivate(): MenuBarPrivate;
        add(name: string): Menu;
        add(menuItem: Menu): void;
        add(option: MenuOption): Menu;
        protected addName(name: string): Menu;
        protected addMenu(menu: Menu): void;
        protected addOption(option: MenuOption): Menu;

        // methods - ui events
        protected _keydown_arrow(e: KeyboardEvent): void;

        // static methods
        static getItem(element: HTMLElement): MenuBar;
        static setItem(element: HTMLElement, comboBox: MenuBar): MenuBar;
    }


    interface MenuBarPrivate {
        element: HTMLElement;
        elementMenuAbstract: HTMLElement;

        children: Menu[];
    }

}