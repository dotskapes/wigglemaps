function LayerController (engine, layer, options) {
    var controller = this;

    // Set this as the parent of the layer in the event hierarchy
    EventManager.manage (layer);
    EventManager.linkParent (engine, layer);

    // All the renderers for this layer
    this.renderers = {};

    // A flat view of all views in all renderers
    this.views = {};

    // Used as a callback when the StyleManager changes a feature
    var update_feature = function (f, key) {
        var value = StyleManager.derivedStyle (f, layer, engine, key);
        controller.views[f.id].update (key, value);
    };

    layer.features ().each (function (i, f) {
        var renderKey;
        if (f.type in engine.Renderers) {
            renderKey = f.type;
        }
        else {
            renderKey = 'default';
        }
        if (!(renderKey in controller.renderers)) {
            controller.renderers[renderKey] = new engine.Renderers[renderKey] (engine, layer, options);
        }
        var view = controller.renderers[renderKey].create (options.geomFunc (f), (function (feature) {
            return function (key) {
                return StyleManager.derivedStyle (feature, layer, engine, key);
            }
        }) (f));

        controller.views[f.id] = view;

        EventManager.linkParent (layer, f);
        EventManager.addEventHandler (f, 'style', update_feature);
    });

    this.update = function (engine, dt) {
        for (var key in this.renderers) {
            this.renderers[key].update (dt);
        }
    };

    this.draw = function (engine, dt) {
        for (var key in this.renderers) {
            this.renderers[key].draw (dt);
        }
    };

};
