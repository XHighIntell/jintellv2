/** @param {intell.portal.Portal} portal */
export default function(portal) {
    var url = import.meta.url;

    /** @type intell.portal.ApplicationManifest */
    var manifest = {
        id: "dynamic",
        name: "Dynamic",
        description: "Dynamic Added at runtime...",
        iconText: "",
        group: 'Account',
        content: {
            html: new URL('ui.html', url).pathname,
            js: [],
        },
    }

    portal.addManifest(manifest, async function(application) {
        hljs.highlightElement(application.elementRoot);
    })
}