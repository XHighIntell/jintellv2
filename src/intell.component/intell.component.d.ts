declare namespace intell.component {

    // properties
    /** Gets config. */
    export var config: Config;
    /** Gets loaded components. */
    export var manifests: ComponentManifest[];    

    // methods
    /** Register a new ComponentManifest. */
    export function addManifest(manifest: Omit<ComponentManifest, "_html" | "_default">): ComponentManifest;
    /** Gets ComponentManifest by its name.  */
    export function getManifest(name: string): Promise<ComponentManifest>;
    /** Transform a specified element. */
    export function transform(elementComponent: HTMLElement): Promise<void>;
    /** Transform all component elements in specified element. */
    export function transformAll(element: HTMLElement): Promise<void>;

    interface Config {
        rootDir: string;
    }
    
    interface ComponentManifest {
        /** The name of the component. The name of the component is case insensitive. */
        name: string;
        /** The url of html file.*/
        html?: string;
        /** The url of js file. */
        js?: string;
        /** The urls of css file. */
        css?: string[];

        _html: string;
        _default(element: HTMLElement, elementOriginal: HTMLElement): void;
    }

}