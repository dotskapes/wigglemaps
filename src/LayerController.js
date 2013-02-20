function LayerController (engine, layer, geomFunc, options) {
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
        var key;
        if (f.type in engine.Renderers) {
            key = f.type;
        }
        else {
            key = 'default';
        }
        if (!(key in controller.renderers)) {
            controller.renderers[key] = new engine.Renderers[key] (engine, layer, options);
        }
        var view = controller.renderers[key].create (f);

        controller.views[f.id] = view;

        // Update all style properties
        for (var key in view.keys ()) {
            update_feature (f, key);
        }

        //StyleManager.registerCallback (engine, f, update_feature);
        EventManager.manage (f);
        EventManager.linkParent (layer, f);
        EventManager.addEventHandler (f, 'style', update_feature);
        //f.change (handle_change);
    });

    this.draw = function (engine, dt) {
        for (var key in this.renderers) {
            this.renderers[key].draw (dt);
        }
    };

};
