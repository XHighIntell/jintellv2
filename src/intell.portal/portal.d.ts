declare namespace intell.portal {

    // classes
    /** Creates a portal for managing applications. */
    export class Portal {
        /** Initializes a new instance of portal from element. 
         @param element The element for which to create portal. */
        constructor(element: HTMLElement);

        // fields
        taskbar: PortalTaskbar;
        overlay: PortalOverlay;

        // properties
        /** The root element of portal. */
        element: HTMLElement;
        /** Gets the list of applications that are added to the portal. */
        applications: Application[];
        /** Gets or sets active application. */
        activeApplication: Application;

        // methods
        add(application: Partial<Application> & Pick<Application, "manifest">): void;

        /** Add a manifest to portal. */
        addManifest(manifest: Partial<ApplicationManifest>, callback: (application: Application) => any | Promise<any>): Application;

        /** Add a manifest to portal via module.
         * @description Required ES2020 (ES11) */
        addManifestModule(moduleName: string): Promise<any>;

        /** Add an application by its constructor method. */
        addManifestClass(constructor: { new(): Application }): Application;

        /** Add an application by its constructor method. */
        addManifestClassModule(moduleName: string): Promise<Application>;

        /** Gets Application by its id. */
        getApplication(id: string): Application;

        /** Open the first application that have manifest.startup equal true.  */
        open(): Promise<void>;
        /** Open an application that added before. */
        open(application: Application): Promise<void>;
        /** Open an application specified by its id. If there are no match id open default applcation. */
        open(applicationId: string): Promise<void>;

        /** Load all resources of an application. */
        load(application: Application): Promise<void>;
        /** (private) Load a single javascript. Javascript will be ignored if url that have loaded before. */
        protected loadJavascript(url: string): Promise<void>;
        /** (private) Load a single style sheet. Style sheet will be ignored if url that have loaded before. */
        protected loadStyle(url: string): Promise<void>;

        /** Occurs when the activeApplication property value changes. */
        onChange: intell.EventRegister<(this: Portal, event: { oldApplication: Application, newApplication: Application }) => void>;
    }
    /** The application that will be added to the portal. */
    export class Application {
        /** Initializes a new instance of application. */
        constructor();

        /** Gets the manifest of application. */
        manifest: ApplicationManifest;

        /** The root element of application. */
        elementRoot?: HTMLElement;

        /** Gets the sidebar element. */
        elementShortcut?: HTMLElement;

        /** The status of this application. "NONE" = 0, "LOADING" = 1, "LOADED" = 2, "FAIL" = 3 */
        status?: "NONE" | "LOADING" | "LOADED" | "FAIL";

        /** The error occurs while loading. */
        error?: Error;

        /** Occur when the portal opens this application. */
        onOpen?: intell.EventRegister<(this: Application) => void>;

        init?(this: Application, application: Application): Promise<any> | void;
    }
    type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
    // methods
    // export function create(element?: HTMLElement): Portal;



    interface ApplicationManifest {

        /** An unique identifier of application. */
        id: string;

        /** The application name. */
        name: string;

        /** A plain text string (no HTML or other formatting) that describes the application while loading. */
        description: string;

        /** A short description of the application */
        title?: string;

        /** Url to icon/image of the application. */
        icon?: string;

        /** Display a text as icon/image of the application. */
        iconText?: string;

        /** Pin this application to menu. The default is true. */
        shortcut?: boolean;

        /** The shortcut group */
        group?: string;

        /** Load the application immediately after add. The default is false. */
        startup?: boolean;

        content: ApplicationManifestContent;
    }
    interface ApplicationManifestContent {
        /** The HTML file to be injected into page. */
        html: string;

        /** The list of JavaScript files to be injected into portal. */
        js?: string[];

        /** (Unsupport) The list of CSS files to be injected into portal. */
        css?: string[];
    }

    interface PortalTaskbar {

        /** A collection of keyname of localStorage that allow taskbar to access. */
        keys: { collapsed: "portal.sidebar.collapsed" };

        // methods
        /** Add a shortcut to sidebar from application. This function doesn't check application already exist or not.*/
        add(application: Application): HTMLElement;
        /** Gets element from application */
        get(application: Application): HTMLElement
        /** Gets application out of element. */
        getApplication(element: HTMLElement): Application;
        /** Sets an application to element. */
        setApplication(element: HTMLElement, application: Application): void;

        /** Add "ACTIVE" classname to shortcut element of an application and remove "ACTIVE" class from others. */
        active(application: Application): HTMLElement

        enableCollapseStorage(key: string): void;
    }
    interface PortalOverlay {
        showLoading(application: Application): void;
        showError(application: Application): void;
        /** hide all overlay */
        hide(): void;
    }
}


