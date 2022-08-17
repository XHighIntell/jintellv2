!function() {
    /** @type intell.portal.ApplicationManifest */
    var manifest = {
        id: "loading",
        name: "Loading Forever",
        description: "This application takes infinite time to load",
        title :"An application take forever to load",
        iconText: "",
        content: {
            html: "apps/loading/loading.html",
        }
    }

    portal.addManifest(manifest, function(application) {
        return new Promise(function() {  });
    })
}();