!function() {
    if (globalThis.window == null) return;
    let ns = intell.component; ns = {}; intell.component = ns;

    // varriables
    let config = ns.config; config = { rootDir: "/component/" };
    let manifests = ns.manifests; manifests = [];
    let styleUrls = [''].splice();

    // properties
    intell.ctrl.template.defineProperties(ns, {
        config: {
            get: function() { return config },
            set: function(newValue) {
                if (newValue.rootDir != null) config.rootDir = newValue.rootDir;
            },
        },
        manifests: {
            get: function() { return manifests },
            set: function() { throw new Error("'intell.component.manifests' cannot be assigned to -- it is read only") }
        }
    });

    // methods
    ns.addManifest = function(o) {
        var manifest = Object.assign({}, o);

        // normalize
        if (manifest.html == null) manifest.html = o.name + '/index.html';

        if (manifest.html != null) manifest.html = new URL(config.rootDir + manifest.html, location).href;
        if (manifest.js != null) manifest.js = new URL(config.rootDir + manifest.js, location).href;
        if (manifest.css != null) manifest.css = manifest.css.map(css => new URL(config.rootDir + css, location).href);
        

        manifests.push(manifest);

        return manifest;
    }
    ns.getManifest = async function(name) {
        let manifest = manifests.find(value => value.name == name);
        if (manifest == null) manifest = this.addManifest({ name: name });
        
        if (manifest.html != null && manifest._html == null) {
            let response = await fetch(manifest.html);
            if (response.status !== 200) throw new Error("'" + name + "' component failed to fetch '" + manifest.html + "'");
            let html = await response.text();
            
            manifest._html = html;
        }

        if (manifest.js != null && manifest._default == null) {
            try {
                var module = await import(manifest.js);
            } catch (e) {
                throw new Error("'" + name + "' component failed to dynamically import module '" + manifest.js + "'");
            }

            if (typeof (module.default) !== 'function') throw new Error("'" + name + "' component must export default function");

            manifest._default = module.default;
        }

        if (manifest.css != null) {
            manifest.css.forEach(css => {
                if (styleUrls.indexOf(css) != -1) return;

                styleUrls.push(css);

                var $link = $('<link href="' + css + '" rel="stylesheet">');
                document.head.append($link[0]);
                styleUrls.push(css);
            })
        }
        


        return manifest;
    }
    ns.transform = async function(elementOriginal) {
        if (elementOriginal == null) throw new Error("Element component cannot be null");
        if (elementOriginal.tagName != 'COMPONENT') throw new Error("Element tag must be component");

        const cname = elementOriginal.getAttribute('cname');
        const manifest = await ns.getManifest(cname);
        const $element = $(manifest._html);
        const element = $element[0];

        if ($element.length > 1) throw new Error("Components can't have more than one element.");

        // 1. copy attributes to the new element
        // 2. macro script
        //    a. replace <children/> with clone children
        // 3. replace 

        // --1--
        elementOriginal.getAttributeNames().forEach(function(name) {
            switch (name) {
                case 'cname':
                    break;
                case 'class':
                    element.classList.add(...elementOriginal.classList);
                    break;
                default:
                    element.setAttribute(name, elementOriginal.getAttribute(name));
                    break;
            }
        })          

        // --2a--
        //debugger;
        element.querySelectorAll('children').forEach(e => {
            e.replaceWith(...intell.ctrl.duplicateNodes(elementOriginal.childNodes));
        })
        //element.querySelectorAll('children')?.replaceWith(...elementOriginal.childNodes);

        // --3--
        elementOriginal.replaceWith(element);

        await ns.transformAll(element);

        if (manifest._default != null) manifest._default(element, elementOriginal);
    }
    ns.transformAll = async function(element) {
        var componentElements = element.querySelectorAll('component');
        componentElements = [...componentElements].filter(e => e.parentElement.closest('component') == null);

        for (var i = 0; i < componentElements.length; i++) {
            var componentElement = componentElements[i];
            await ns.transform(componentElement)
        }

        //var promiseAll = [...componentElements].map(e => ns.transform(e));
        //await Promise.all(promiseAll);
    }
}();