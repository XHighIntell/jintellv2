

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


    //export function startClass(element: HTMLElement, timeout: number, classname: string): Promise<void>;
    //export function stopClass(element: HTMLElement, classname: string): void;


    /** internally used by startHide, stopHider. */
    interface StartHideProcess {
        element: HTMLElement;
        timer: number;
        class: string;
        promise: Promise<void>;
    }

}