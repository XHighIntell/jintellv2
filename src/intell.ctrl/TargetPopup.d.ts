


declare namespace intell.ctrl {
    export class TargetPopup {

        constructor(element: HTMLElement);

        // properties
        readonly element: HTMLElement;
        readonly elementArrow: HTMLElement;
        popupLocations: number[];
        popupOption: intell.ctrl.ShowAtOption;
        popupDelayHideTime: number;

        // methods
        getPrivate(): TargetPopupPrivate;
        /** When the target element is set while the popup is already shown, the popup will immediately move to the new target element. */
        showAt(target: HTMLElement): void;
        showAt(coords: intell.ctrl.CoordinatesLike): void;
        protected showAtElement(target: HTMLElement): void;
        protected showAtCoord(coordinates: intell.ctrl.CoordinatesLike): void;
        hide(): void;
        protected setArrowPointToElement(target: HTMLElement, location: number): void;
        protected setArrowPointToCoordinates(coordinates: intell.ctrl.CoordinatesLike, location: number): void;

        // static methods
        static getItem(element: HTMLElement): TargetPopup;
        static setItem(element: HTMLElement, comboBox: TargetPopup): TargetPopup;
        static showAt(elementPopup: HTMLElement, target: HTMLElement, locations?: number[], option?: intell.ctrl.ShowAtOption): TargetPopup;
        static showAt(elementPopup: HTMLElement, coordinates: intell.ctrl.CoordinatesLike, locations?: number[], option?: intell.ctrl.ShowAtOption): TargetPopup;
        protected static showAtElement(elementPopup: HTMLElement, target: HTMLElement, locations?: number[], option?: intell.ctrl.ShowAtOption): TargetPopup;
        protected static showAtCoord(elementPopup: HTMLElement, coordinates: intell.ctrl.CoordinatesLike, locations?: number[], option?: intell.ctrl.ShowAtOption): TargetPopup;

    }

    interface TargetPopupPrivate {
        element: HTMLElement;
        elementArrow: HTMLElement;
        popupLocations: number[];
        popupOption: intell.ctrl.ShowAtOption;
        popupDelayHideTime: number;

        // state
        targetElement: HTMLElement;
        targetCoordinates: CoordinatesLike;
        isVisible: boolean;
        isFadingOut: boolean;
    }

}

