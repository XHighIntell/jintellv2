!function() {

    /** @type intell.portal.ApplicationManifest */
    var manifest = {
        id: "error",
        name: "Error",

        iconText: "",
        title: "An application that got errors while loading",
        description: "An application that got errors while loading",
        content: {
            html: "apps/error/error.html",
        }
    }

    portal.addManifest(manifest, function(application) {
        throw new TypeError("Welcome Error!");
    })

}();