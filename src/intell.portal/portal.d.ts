declare namespace intell.portal {

    // classes
    export class Portal {
        /** Initializes a new instance of portal from element. */
        constructor(element: HTMLElement);

        // fields
        protected taskbar: PortalTaskbar;
        protected overlay: PortalOverlay;

        // properties
        /** Gets the list of application. */
        applications: Application[];
        /** Gets or sets acctive application. */
        activeApplication: Application;

        // methods
        /** Add a manifest to portal. */
        addManifest(manifest: ApplicationManifest, callback: ((application: Application) => void)): Application;

        /** Open the first application that have manifest.startup equal true.  */
        open(): void;
        /** Open an application that added before. */
        open(application: Application): void;
        /** Open an application specified by its id. If there are no match id open default applcation. */
        open(applicationId: string): void;

        /** (private) Load all resources of an application. */
        protected load(application: Application): Promise<void>;
        /** (private) Load a single javascript. Javascript will be ignored if url that have loaded before. */
        protected loadJavascript(url: string): Promise<void>;
        /** (private) Load a single style sheet. Style sheet will be ignored if url that have loaded before. */
        protected loadStyle(url: string): Promise<void>;

        /** Occurs when the activeApplication property value changes. */
        onChange: intell.EventRegister<(this: Portal, event: { oldApplication: Application, newApplication: Application }) => void>;
    }
    export class Application {

        protected __callback: (application: Application) => Promise<any> | void;

        /** Gets the manifest of application. */
        manifest: ApplicationManifest;

        /** The root element of application. */
        elementRoot: HTMLElement;

        /** Gets the sidebar element. */
        elementShortcut: HTMLElement;

        /** The status of this application. "NONE" = 0, "LOADING" = 1, "LOADED" = 2, "FAIL" = 3 */
        status: "NONE" | "LOADING" | "LOADED" | "FAIL";

        /** The error occurs while loading. */
        error: Error;

        /** Occur when the portal opens this application. */
        onOpen: intell.EventRegister<(this: Application) => void>;
    }

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
        title: string;

        /** Url to icon/image of the application. */
        icon: string;

        /** Display a text as icon/image of the application. */
        iconText: string;

        /** Pin this application to menu. The default is true. */
        shortcut: boolean;

        /** The shortcut group */
        group: string;

        /** Load the application immediately after add. The default is false. */
        startup: boolean;

        content: ApplicationManifestContent;
    }
    interface ApplicationManifestContent {
        /** The HTML file to be injected into page. */
        html: string;

        /** The list of JavaScript files to be injected into portal. */
        js: string[];

        /** (Unsupport) The list of CSS files to be injected into portal. */
        css: string[];
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


