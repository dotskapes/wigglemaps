$(document).ready(function () {
    // Do formatting that CSS can't do correctly
    var anchorHeight = $ (window).height () - $('#container').offset ().top
    $('#container').css ('height', anchorHeight);
    $('#map-box').css ('height', anchorHeight - 75);

    var Example = Backbone.Model.extend({
        defaults: {
            tempalate: undefined,
            title: undefined
        }
    });

    var ExampleList = Backbone.Collection.extend({
        models: Example
    });

    var examples = new ExampleList ();

    var ExampleView = Backbone.View.extend({
        initialize: function (options) {
            var view = this;
            this.render ();
            this.model.on('select', function () {
                view.loadExample ();
            });
        },
        tagName: 'div',
        className: 'example',
        render: function () {
            this.$el.append(this.model.get('title'));

            var view = this;
            this.$el.on('click', function () {
                view.model.trigger('select');
            });
        },
        loadExample: function () {
            this.$el.addClass('selected');
        }
    });

    var ListView = Backbone.View.extend({
        initialize: function (options) {
            this.listenTo(options.collection, 'add', this.addExample);
        },
        addExample: function (example) {
            var exampleView = new ExampleView ({
                model: example,
            });
            this.$el.append (exampleView.$el);
        }
    });

    var Workspace = Backbone.Router.extend({
        routes: {
            '': 'loadExample',
            ':exampleName': 'loadExample'
        },
    });

    var router = new Workspace();

    router.on ('route:loadExample', function(exampleName) {
        if (exampleName === undefined) {
            exampleName = 'base';
        }
        examples.where({
            template: exampleName
        })[0].trigger('select');
    });
   

    var list = new ListView ({
        collection: examples,
        el: $ ('#examples')
    });

    examples.add([
        {
            template: 'base',
            title: 'Change Base Layer'
        },
        {
            template: 'binary',
            title: 'Load Shapefiles'
        },
        {
            template: 'hover',
            title: 'Mouse Events'
        },
        {
            template: 'base',
            title: 'Change Base Layer'
        },
        {
            template: 'binary',
            title: 'Load Shapefiles'
        },
        {
            template: 'hover',
            title: 'Mouse Events'
        },
        {
            template: 'base',
            title: 'Change Base Layer'
        },
        {
            template: 'binary',
            title: 'Load Shapefiles'
        },
        {
            template: 'hover',
            title: 'Mouse Events'
        },
        {
            template: 'base',
            title: 'Change Base Layer'
        },
        {
            template: 'binary',
            title: 'Load Shapefiles'
        },
        {
            template: 'hover',
            title: 'Mouse Events'
        }
    ]);

    Backbone.history.start({
        pushState: true,
        root: '/wigglemaps/examples'
    });

    var map = new wiggle.Map ('#map');
});
