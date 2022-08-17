﻿hljs.registerLanguage('dts', function(a) {
    return {
        case_insensitive: true, // language is case-insensitive
        contains: [
            {
                scope: 'string',
                begin: '"', end: '"'
            },
            {
                scope: 'keyword',
                begin: '\\b(constructor|void|this|function)\\b',
            },
            {
                scope: 'attr',           // name
                begin: /(\w+)(?= *:)/,
            },
            {
                scope: 'class built_in', // type
                begin: /(?<=: *)(string|object|any)/,
            },
            {
                scope: 'class',
                begin: /(?<=: *)(\w+)/,  //  : class
            },
            {
                scope: 'class built_in', // standalone name
                begin: /(string|object|any)/,
            },
            //{
            //    scope: 'function', // fun()
            //    begin: /\w+(?= *\()/,
            //},
            {
                scope: 'class',          // class[]
                begin: /\w+(?= *\[\])/,
            },
            {
                scope: 'class',          // class standalone end of string
                begin: /^\w+$/,
            },
            {
                scope: 'class',          // <T> < T >
                begin: /(?<=< *)\w+(?= *>)/,
            },
        ]
    }
});

!function() {
    var docs = window.docs; docs = {}; window.docs = docs;

    docs.generateArticle = async function(article) {

        if (article._ == 'field') return await docs.generateArticleField(article);

        var $article = $(`
<div class="article">
    <div class="title"></div>
    <div class="description"></div>
</div>`);

        var $title = $article.find('.title'); $title.html(article.title);
        var $description = $article.find('.description'); $description.html(article.description);


        $article.append(docs.generateGroupConstructors(article.constructors));
        $article.append(docs.generateGroupFields(article.fields));
        $article.append(docs.generateGroupProperties(article.properties));
        $article.append(docs.generateGroupEvents(article.events));
        $article.append(docs.generateGroupMethods(article.methods));
        $article.append(docs.generateGroupOverloads(article.overloads));
        $article.append(docs._generateRemarks(article.remarks));
        $article.append(await docs._generateExamples(article.examples));
        

        return $article[0];
    }
    docs.generateArticleField = async function(article) {
        var $article = $(`
<div class="article article-field">
    <div class="title"></div>
    
</div>`);
        var $title = $article.find('.title'); $title.html(article.title);
        
        if (article.type) {
            var $type = $('<a class="type" data-code="dts">').append(article.type);
            $type.attr('href', article.href);
            $article.append($type);
        }
        if (article.description) $article.append($('<div class="description">').append(article.description));
        

        $article.append(docs._generateRemarks(article.remarks));
        $article.append(await docs._generateExamples(article.examples));

        return $article[0];
    }

    docs.generateGroupConstructors = function(items) {
        if (items == null || items.length == 0) return;

        var $group = $(
`<div class="group-members constructors">
    <div class="title">Constructors</div>
</div>`);

        $group.append(items.map(function(item) { return docs.generateItemConstructor(item) }));

        return $group[0];
    }
    docs.generateGroupFields = function(items) {
        if (items == null || items.length == 0) return;

        var $group = $(
            `<div class="group-members fields">
    <div class="title">Fields</div>
</div>`);

        $group.append(items.map(function(item) { return docs.generateItemField(item) }));

        return $group[0];
    }
    docs.generateGroupProperties = function(items) {
        if (items == null || items.length == 0) return;

        var $group = $(
`<div class="group-members properties">
    <div class="title">Properties</div>
</div>`);

        $group.append(items.map(function(item) { return docs.generateItemProperty(item) }));

        return $group[0];
    }
    docs.generateGroupEvents = function(items) {
        if (items == null || items.length == 0) return;

        var $group = $(
            `<div class="group-members events">
    <div class="title">Events</div>
</div>`);

        $group.append(items.map(function(item) { return docs.generateItemEvent(item) }));

        return $group[0];
    }
    docs.generateGroupMethods = function(items) {
        if (items == null || items.length == 0) return;

        var $group = $(
            `<div class="group-members methods">
    <div class="title">Methods</div>
</div>`);

        $group.append(items.map(function(item) { return docs.generateItemMethod(item) }));

        return $group[0];
    }
    docs.generateGroupOverloads = function(items) {
        if (items == null || items.length == 0) return;

        var $group = $(
            `<div class="group-members overloads">
    <div class="title">Overloads</div>
</div>`);

        var $title = $group.find('.title');
        if (items.length == 1) $title.remove();

        $group.append(items.map(function(item) { return docs.generateItemOverload(item) }));

        return $group[0];
    }

    docs.generateItemConstructor = function(item) {
        var $item = $(
`<div class="item-member item-method item-constructor">
    <div class="label">
        <div class="icon method"></div>
        <div class="title" data-code="dts"></div>
    </div>
    <div class="content"></div>
</div>`);

        var $title = $item.find('.label .title');
        var $content = $item.find('.content');

        $title.html(item.title);
        $content.append($('<div class="description">').append(item.description));
        $content.append(docs._generateParameters(item.parameters));
        $content.append(docs._generateRemarks(item.remarks));

        return $item[0];
    }
    docs.generateItemField = function(item) {
        var $item = $(
`<div class="item-member item-field">
    <div class="label">
        <div class="icon field"></div>
        <div class="title" data-code="dts"></div>
    </div>
    <div class="content"></div>
</div>`);

        var $title = $item.find('.label .title');
        var $content = $item.find('.content');

        $title.html(item.title);

        if (item.type) {
            var $type = $('<a class="type" data-code="dts">').append(item.type);
            $type.attr('href', item.href);
            $content.append($type);
        }

        $content.append($('<div class="description">').append(item.description));
        $content.append(docs._generateRemarks(item.remarks));

        return $item[0];
    }
    docs.generateItemProperty = function(item) {
        var $item = $(
`<div class="item-member item-property">
    <div class="label">
        <div class="icon property"></div>
        <div class="title" data-code="dts"></div>
    </div>
    <div class="content"></div>
</div>`);
        var $title = $item.find('.label .title'); $title.html(item.title)
        var $content = $item.find('.content');

        if (item.type) {
            var $type = $('<a class="type" data-code="dts">').append(item.type);
            $type.attr('href', item.href);
            $content.append($type);
        }
        $content.append($('<div class="description">').append(item.description));
        $content.append(docs._generatePropertyValue(item.value));
        $content.append(docs._generateRemarks(item.remarks));

        return $item[0];
    }
    docs.generateItemEvent = function(item) {
        var $item = $(
            `<div class="item-member item-event">
    <div class="label">
        <div class="icon event"></div>
        <div class="title" data-code="dts"></div>
    </div>
    <div class="content"></div>
</div>`);

        var $title = $item.find('.label .title'); $title.html(item.title)
        var $content = $item.find('.content');


        $content.append($('<div class="description">').append(item.description));
        $content.append(docs._generateRemarks(item.remarks));

        return $item[0];
    }
    docs.generateItemMethod = function(item) {
        var $item = $(
            `<div class="item-member item-method">
    <div class="label">
        <div class="icon method"></div>
        <div class="title"></div>
    </div>
    <div class="content"></div>
</div>`);

        var $title = $item.find('.label .title'); $title.html(item.title);
        var $content = $item.find('.content');

        $content.append($('<div class="description">').append(item.description));
        $content.append(docs.generateGroupOverloads(item.overloads));
        $content.append(docs._generateRemarks(item.remarks));

        return $item[0];
    }
    docs.generateItemOverload = function(item) {
        var $item = $(
            `<div class="item-member item-overload">
    <div class="label">
        <div class="title" data-code="dts"></div>
    </div>
    <div class="content"></div>
</div>`);

        var $title = $item.find('.label .title'); $title.html(item.title);
        var $content = $item.find('.content');

        $content.append($('<div class="description">').append(item.description));
        $content.append(docs._generateParameters(item.parameters));
        $content.append(docs._generateReturns(item.returns));
        $content.append(docs._generateRemarks(item.remarks));

        return $item[0];
    }


    docs._generateParameters = function(parameters) {

        if (parameters == null || parameters.length == 0) return;

        var $element = $(`<div class="parameters">
    <div class="title">Parameters</div>
</div>`);

        parameters.forEach(function(param) {
            var $param = $(`<div class="parameter">
    <div class="info">
        <div class="name"></div>
        <a class="type" data-code="dts"></a>
    </div>
    <div class="description"></div>
</div>`).appendTo($element);

            var $name = $param.find('.name');
            var $type = $param.find('.type');
            var $description = $param.find('.description');

            $name.html(param.name);
            $type.html(param.type);
            $description.html(param.description);

            if (param.href) $type.attr('href', param.href);
        });


        return $element[0];
    }
    docs._generateReturns = function(returns) {
        if (!returns) return;

        var $element = $(`
<div class="returns">
    <div class="title">Returns</div>
</div>`);

        if (typeof returns == "string") 
            $element.append($('<div class="description">').append(returns));
        else {
            $element.append($('<a class="type" data-code="dts">').append(returns.type).attr('href', returns.href));
            $element.append($('<div class="description">').append(returns.description));
        }
        
        return $element[0];
    }
    docs._generateRemarks = function(remarks) {
        if (!remarks) return;

        var $element = $(`
<div class="remarks">
    <div class="title">Remarks</div>
</div>`);
        $element.append($('<div>').append(remarks));

        return $element[0];
    }
    docs._generateExamples = async function(examples) {
        if (!examples) return;

        var $element = $(`
<div class="examples">
    <div class="title">Examples</div>
</div>`);

        var response = await fetch(examples);
        var responseText = await response.text();

        var $root = $(responseText);
        $root.appendTo($element);
        
        return $element[0];
    }
    docs._generatePropertyValue = function(value) {
        if (value == null) return;

        var $element = $(`
<div class="property-value">
    <div class="title">Property Value</div>
</div>`);
        $element.append($('<div class="description">').append(value.description));

        return $element[0];
    }
}()


!function() {
    var ui = docs.ui; ui = {}; docs.ui = ui;

    /** @type {{ [T: string]: HTMLElement }} */
    var articles = {};
    var $section = $('.documents-section')
    var $tree = $section.find('.docs-tree');
    var $articles = $section.find('.articles');
    var $loading = $section.find('.loading-overlay');

    ui._getArticleElement = async function(id) {
        var element = articles[id];

        if (element == null) {
            var url = ui._getArticleUrl(id);

            var response = await fetch(url);
            var contentType = response.headers.get('content-type');
            if (contentType.indexOf('text/html') !== -1) {
                var html = await response.text();
                var $root = $('<div class="article"></div>').append(html);

                element = articles[id] = $root[0];
            } else if (contentType.indexOf('application/json') !== -1) {
                var json = await response.json();
                element = articles[id] = await docs.generateArticle(json);
            }


            element.querySelectorAll('*[data-code]').forEach(function(element) {
                var language = element.getAttribute('data-code');

                if (!language) return;
                element.classList.add(language);
                hljs.highlightElement(element);
            });
        }

        return element;
    }
    ui._getArticleUrl = function(id) {
        if (id == 'getting-started') return 'article/Getting Started.html';
        else return 'article/' + id + '.json';
    }
    ui.open = async function(id) {
        //var element = articles[id];
        

        $tree.find('.item-member').removeClass('active');
        $tree.find('[data-article="' + id + '"]').addClass('active');
        $articles.children().remove();
        history.replaceState(null, document.title, '?q=' + id);

        $loading.show().addClass('active');
        var element = await ui._getArticleElement(id);
        $loading.hide().removeClass('active');
        
        $articles.append(element);

        
        return element;
    }
    
    // handle events
    $tree.on('click', '.item-member>.label', async function() {
        var $item = $(this).parent();
        var id = $item.attr('data-article');

        if (!id) return;
        if ($item.is('.active') == true) return;
        
        ui.open(id);
    });
    $articles.on('click', '.item-member>.label,.item-method>.label', function() { $(this).parent().toggleClass('expaned') });

    var qs = intell.qs();
    var id = qs.q;

    if (id) ui.open(id);
    else ui.open('getting-started');
}();

