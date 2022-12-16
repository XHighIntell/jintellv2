declare namespace intell.ctrl {
    export class Menu {
        /** Initializes a new instance of the Menu class from element. */
        constructor();

        /** Initializes a new instance of the Menu class from element. 
         * @param element The element for which to create Menu.*/
        constructor(element: HTMLElement);

        // ======================== properties ========================
        /** Gets the root element of the menu. */
        readonly element: HTMLElement;

        /** Gets the children element of the menu. */
        readonly elementChildren: HTMLElement;

        /** Gets the label element of the menu. */
        readonly elementLabel: HTMLElement;

        /** Gets the icon element of the menu. */
        readonly elementIcon: HTMLElement;

        /** Gets name element of the menu. */
        readonly elementName: HTMLElement;

        /** Gets the intersect element of the menu. */
        readonly elementIntersect: HTMLElement;

        /** Gets the abstract element of the menu. */
        readonly elementMenuAbstract: HTMLElement;

        /** Gets the parent of the menu. */
        readonly parent: Menu;

        /** Gets the children of the menu. The return value is a clone array, it is safe to modify or use on some where. */
        readonly children: Menu[];

        /** Gets or sets textContent of the icon element. */
        icon: string;

        /** Gets or sets textContent of the name element. */
        name: string;

        /** Gets or sets locations indicating where the children of the root menu are placed when displayed. */
        rootLocations: number[];

        /** Gets or sets option indicating where the children of the root menu are placed when displayed. */
        rootOption: ctrl.ShowAtOption;

        /** Gets or sets fading out duration for the children element of the root menu. */
        rootFadeOutTime: number;

        /** Gets or sets locations indicating where the children of the child menu are placed when displayed. */
        childLocations: number[];

        /** Gets or sets option indicating where the children of the child menu are placed when displayed. */
        childOption: ctrl.ShowAtOption;

        /** Gets or sets fading out duration for the children element of the child menu. */
        childFadeOutTime: number;

        /** Gets or sets the active state of this menu. */
        active: boolean;

        /** Gets or sets a value indicating whether its child are displayed. Return false when children are in the fading process. */
        childrenVisible: boolean;

        // ======================== methods ========================
        getPrivate(): MenuPrivate;

        /** Gets the root menu of its or itself if it is root menu. */
        getRoot(): Menu;

        /** Gets the current active menu at highest level. */
        getHighestActive(): Menu;

        /** Adds a new Menu, to the end of the current menu, with a specified caption. */
        add(name: string): Menu;

        /** Adds a previously created Menu to the end of the current menu. */
        add(menu: Menu): void;

        /** Adds a new Menu, to the end of the current menu, with a specified option. */
        add(option: MenuOption): Menu;

        protected addName(name: string): Menu;
        protected addMenu(menu: Menu): void;
        protected addOption(option: MenuOption): Menu;

        /** Adds a new separator, to the end of the current menu. */
        addSeparator(): HTMLElement;

        /** Removes the menu from its parent menu. */
        remove(): void;

        /** Removes the specified menu from the children. */
        removeChildren(menu: Menu): boolean;

        /** Removes all child from the list. */
        clear(): void;

        

        showChildrenAt(target: HTMLElement, locations?: number[], option?: ShowAtOption): void;
        showChildrenAt(coords: CoordinatesLike, locations?: number[], option?: ShowAtOption): void;
        protected showChildrenAtRect(target: DOMRect, locations?: number[], option?: ShowAtOption): void;
        protected showChildrenAtElement(target: HTMLElement, locations?: number[], option?: ShowAtOption): void;
        protected showChildrenAtCoord(coordinates: CoordinatesLike, locations?: number[], option?: ShowAtOption): void;
        hideChildren(): void;
        hideChildrenImmediately(): void;
        protected checkHasChildren(): void;


        // methods - ui events
        protected _keydown_tab(e: KeyboardEvent): void;
        protected _keydown_arrow_or_enter(e: KeyboardEvent): void;
        protected _dispatchEvent_menuclick(menu: Menu): void;

        // static methods
        static getItem(element: HTMLElement): Menu;
        static setItem(element: HTMLElement, menu: Menu): Menu;
    }

    interface MenuOption {
        icon: string;
        name: string;
        shortcut: string;
    }
    interface MenuPrivate {
        element: HTMLElement;
        elementLabel: HTMLElement;
        elementIcon: HTMLElement;
        elementName: HTMLElement;
        elementChildren: HTMLElement;
        elementIntersect: HTMLElement;

        elementMenuAbstract: HTMLElement;

        parent: Menu;
        children: Menu[];

        icon: string;
        name: string;

        rootLocations: number[];
        rootOption: intell.ctrl.ShowAtOption;
        rootFadeOutTime: number;

        childLocations: number[];
        childOption: intell.ctrl.ShowAtOption;
        childFadeOutTime: number;

        // session
        active: boolean;
        childrenVisible: boolean;
        childrenFadingOut: boolean;
    }
}


