//type ReplaceReturnType<T> = (this: ThisParameterType<T>, ...args: Parameters<T>) => "stopPropagation" | void;

declare namespace intell {

    
    // ======= classes =======
    /** Event register object that is used to add, remove listeners and dispatch them. */
    export class EventRegister<T extends (this: any, ...args: any) => any> {

        /** Initializes a new instance of EventRegister object that is used to add, remove listeners and dispatch them. 
         * @param target The value of <mark>this</mark> provided for dispatching to listeners. */
        constructor(target?: object, option?: EventRegisterOption);

        protected option: EventRegisterOption;

        /** Private */
        protected listeners: T[];

        /** Private */
        protected target: ThisParameterType<T>;

        /** Registers an event listener callback to this event. Listeners can return "stop" to prevent further chain of callbacks. */
        addListener(callback: (this: ThisParameterType<T>, ...args: Parameters<T>) => "stop" | void | Promise<any>): void;
        
        /** Deregisters an event listener callback from this event. */
        removeListener(callback: T): void;

        /** Dispatches a synthetic event. */
        dispatch(...args: Parameters<T>): void;

        /** Determines whether this event includes a listener among its entries.
         * @param callback Listener whose registration status shall be tested */
        hasListener(callback: T): boolean;

        /** Determines whether this event has any listeners. */
        hasListeners(): boolean;
    }

    // ======= methods =======
    /** Creates and assigns on/off function for EventTarget object. */
    export function createOnOff(target: EventTarget): void;

    /** Get response from servers by using XMLHttpRequest. */
    export function get(url: string): HttpRequest;

    /** Post data to servers by using XMLHttpRequest. */
    export function post(url: string): HttpRequest;

    /** Create a query object from a string.
    * @param search The string containing key value pair that separate by =. If search is not specified, location.search.substr(1) will be used instead.
    * @returns Return the key value pair object. */
    export function qs(search?: string): { [T: string]: string };

    export function wait(timeout: number): Promise<void>;

    // ======= fields =======
    /** Gets the version of this library. */
    export var version: '2.0.0';


    interface EventRegisterOption {
        /** A boolean value indicating that the listener should be invoked at most once after being added. If true, the listener would be automatically removed when invoked. If not specified, defaults to false. */
        once: boolean;
    } 

    

    /** It is "on" function; and created by createOnOff. */
    interface OnRegister<EventMap = DocumentEventMap, This = void, ChainType = void> {
        <K extends keyof EventMap>(this: EventTarget, type: K, listener: (this: This, ev: EventMap[K]) => any, options?: boolean | AddEventListenerOptions): ChainType;
        <K extends keyof EventMap>(this: EventTarget, type: K, name: string, listener: (this: This, ev: EventMap[K]) => any, options?: boolean | AddEventListenerOptions): ChainType;
    }

    /** It is "on/off" function; and created by createOnOff. */
    interface OnOffEventTarget<EventMap = DocumentEventMap, This = void, ChainType = void> extends EventTarget {
        on: OnRegister<EventMap, This, ChainType>;
        off(name: string): void;
    }

    /** Internal used */
    interface CreateOnOffFunction {
        get(target: EventTarget): { name: string, type: string, listener: () => void, options?: boolean | AddEventListenerOptions }[];
        on: OnRegister<DocumentEventMap>;
        off(name: string): void;
        (): void;
    }



    interface HttpRequest extends XMLHttpRequest {

        on: OnRegister<XMLHttpRequestEventMap, HttpRequest, HttpRequest>;
        off(name: string): void;

        loadstart(handler: (this: this, ev: XMLHttpRequestEventMap["loadstart"]) => any, options?: boolean | AddEventListenerOptions): this;
        readystatechange(handler: (this: this, ev: XMLHttpRequestEventMap["readystatechange"]) => any, options?: boolean | AddEventListenerOptions): this;
        progress(handler: (this: this, ev: XMLHttpRequestEventMap["progress"]) => any, options?: boolean | AddEventListenerOptions): this;
        load(handler: (this: this, ev: XMLHttpRequestEventMap["load"]) => any, options?: boolean | AddEventListenerOptions): this;
        loadend(handler: (this: this, ev: XMLHttpRequestEventMap["loadend"]) => any, options?: boolean | AddEventListenerOptions): this;
        error(handler: (this: this, ev: XMLHttpRequestEventMap["error"]) => any, options?: boolean | AddEventListenerOptions): this;
    }

    

    //export var on: OnRegister<DocumentEventMap, void, typeof intell>;
    //export function off(name: string): void;
    //export var onLoad: EventRegister<(this: HTMLAudioElement, ev: MouseEvent) => any>;
}


type NotKeyOf<T, U> = { [k in keyof T]: T[k] extends U ? never : k }[keyof T];
type NotKeyOfFunction<T> = { [k in keyof T]: T[k] extends Function ? never : k }[keyof T];

type defineProperties<T> = {
    [K in keyof T]?: {
        get: (this: T) => T[K];
        set?: (this: T, newValue: T[K]) => void;
    }
}



