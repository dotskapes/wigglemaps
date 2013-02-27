function multiRendererFactory (Renderers) {
    return function (engine, layer, options) {
        var renderers = [];
        
        var MultiView = function (views) {
            this.update = function (key, value) {
                $.each (views, function (i, view) {
                    view.update (key, value);
                });
            };

            this.keys = function () {
                var items = {};
                $.each (views, function (i, view) {
                    for (key in view.style_map) {
                        items[key] = true;
                    }        
                });
                return items;
            };
        };

        $.each (Renderers, function (i, Renderer) {
            renderers.push (new Renderer (engine, layer, options));
        });

        this.views = [];

        this.create = function (key, style) {
            var views = [];
            $.each (renderers, function (i, renderer) {
                views.push (renderer.create (key, style));
            });
            return new MultiView (views);
        };

        this.draw = function () {
            $.each (renderers, function (i, renderer) {
                renderer.draw ();
            });
        };
    };
};
