

declare namespace intell.ctrl {




    // ======= methods =======
    /** Show the element by changing its display style. */
    export function show(element: HTMLElement): void;

    /** Hide the element by changing its display style. */
    export function hide(element: HTMLElement): void;

    /** Start hiding animation by adding specified classes then completely hide. Calling startHide multiple times will return the Promise from previous call. */
    export function startHide(element: HTMLElement, timeout: number, delayHideClass: string): Promise<void>;

    /** Stop hiding animation by reverting its classes and stop timer. */
    export function stopHide(element: HTMLElement): void;

    /** Returns a DOMRect object providing information about the size of an element and its position relative to the document instead of the viewport. */
    export function getBoundingClientRectOffset(element: HTMLElement): DOMRect;

    export function getRectWhenShowAtRect(popup: DOMRect, target: DOMRect, location: number, option?: GetRectWhenShowAtOption): GetRectWhenShowAtResult;
    export function getRectWhenShowAtCoord(popup: DOMRect, coord: CoordinatesLike, location: number, option?: GetRectWhenShowAtOption): GetRectWhenShowAtResult;

    export function showAt(element: HTMLElement, target: DOMRect, locations: number[], option?: ShowAtOption): GetRectWhenShowAtResult;
    export function showAt(element: HTMLElement, coord: CoordinatesLike, locations: number[], option?: ShowAtOption): GetRectWhenShowAtResult;
    export function showAt(element: HTMLElement, elementTarget: HTMLElement, locations: number[], option?: ShowAtOption): GetRectWhenShowAtResult;
    export function showAtRect(element: HTMLElement, target: DOMRect, locations: number[], option?: ShowAtOption): GetRectWhenShowAtResult;
    export function showAtCoord(elementPopup: HTMLElement, coord: CoordinatesLike, locations: number[], option?: ShowAtOption): GetRectWhenShowAtResult;
    export function showAtElement(elementPopup: HTMLElement, elementTarget: HTMLElement, locations: number[], option?: ShowAtOption): GetRectWhenShowAtResult;

    /** Returns the first element where the predicate is true while traversing up through its ancestors in the DOM tree. */
    export function findParentElement(element: HTMLElement, predicate: (value: HTMLElement) => boolean): HTMLElement | undefined;

    /** Returns the first element where the predicate is true while traversing up through itself and its ancestors in the DOM tree. */
    export function findClosestElement(element: HTMLElement, predicate: (value: HTMLElement) => boolean): HTMLElement | undefined;

    /** Returns a third DOMRect that represents the intersection of two other DOMRect. If there is no intersection, null is returned. */
    export function rectIntersect(a: DOMRect, b: DOMRect): DOMRect;

    //export function startClass(element: HTMLElement, timeout: number, classname: string): Promise<void>;
    //export function stopClass(element: HTMLElement, classname: string): void;


    /** internally used by startHide, stopHider. */
    interface StartHideProcess {
        element: HTMLElement;
        timer: number;
        class: string;
        promise: Promise<void>;
    }

    interface GetRectWhenShowAtOption {
        /** The rectangle popup must be placed inside specified rectangle. */
        container?: DOMRect;

        /** The minimum distance between popup and container. */
        margin?: number;

        /** The minimum distance between popup and target. */
        space?: number;
    }
    interface GetRectWhenShowAtResult {
        /** The location type 1 to 12.. */
        location: number;

        /** The position Rectangle. */
        rect: DOMRect;

        /** Higher is better.  */
        score: number;
    }

    interface ShowAtOption extends GetRectWhenShowAtOption {
        //** Move the popup element right after the target element. */
        // moveToTarget: boolean;

        /** If container_mode is present, `container` will be overridden. */
        container_mode?: 'auto' | 'window';
    }


    type CoordinatesLike = { x: number, y: number } | { left: number, top: number };
        
}