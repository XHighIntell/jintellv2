!function() {
    var src = document.currentScript.src;


    /** @type intell.portal.ApplicationManifest */
    var manifest = {
        id: "simple-application",
        name: "Dashboard",
        description: "Welcome the portal...",
        iconText: "",
        content: {
            html:  new URL('dashboard.html', src).pathname,
            js: ["../static/lib/hljs/highlight.min.js"],
            css: [new URL('style.css', src).pathname],
        },
        startup: true,
    }
    

    portal.addManifest(manifest, function(application) {
        var $root = $(application.elementRoot);

        $root.find('.item-example').toArray().forEach(async function(element) {
            var url = element.getAttribute('data-url');
            var response = await fetch(url);
            var responseText = await response.text();

            var $code = $(element).find('>code');
            $code.text(responseText);

            hljs.highlightElement($code[0]);
        });

        $root.on('click', '.item-example>.label', function() { $(this).parent().toggleClass('expanded') });
        $root.find('.toggle').click(function() { $('body>.topbar').toggle() });
    })


}();