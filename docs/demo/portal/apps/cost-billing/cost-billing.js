!function() {

    /** @type intell.portal.ApplicationManifest */
    var manifest = {
        id: "cost-billing",
        name: "Cost + Billing",
        description: "Cost + Billing",
        title: "Cost + Billing",
        iconText: "",
        content: {
            html: "apps/cost-billing/ui.html",
            js: ["/static/lib/hljs/highlight.min.js"],
        },
        group: "Account",
    }

    portal.addManifest(manifest, function(application) {
        hljs.highlightElement(application.elementRoot);
    })
}();