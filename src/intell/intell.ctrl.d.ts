

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
    export function getRectWhenShowAtCoord(popup: DOMRect, target: CoordinatesLike, location: number, option?: GetRectWhenShowAtOption): GetRectWhenShowAtResult;


    export function ShowAtRect(element: HTMLElement, target: DOMRect, locations: number[], option?: ShowAtOption): void;
    export function showAtCoord(elementPopup: HTMLElement, coord: CoordinatesLike, locations: number[], option?: ShowAtOption): void;
    export function showAtElement(elementPopup: HTMLElement, elementTarget: HTMLElement, locations: number[], option?: ShowAtOption): void;


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

        /** The minimum distance between popup and insideRect. */
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
        /** Move the popup element right after the target element. */
        moveToTarget: boolean;
    }


    type CoordinatesLike = { x: number, y: number } | { left: number, top: number };
        
}