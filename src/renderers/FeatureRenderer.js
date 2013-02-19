function FeatureRenderer (engine, layer) {
    this.engine = engine;

    // A list of views of the object
    this.views = [];

    // The children renderers of this, used to recursively update
    this.children = [];

    // Update all features with a style property
    this.update = function (key) {
        for (var i = 0; i < views.length; i ++) {
            this.views[i].update (key);
        }
        for (var i = 0; i < this.children.length; i ++) {
            this.children[i].update (key);
        }
    };

    this.view_factory = function () {
        throw "Not Implemented";
    };

    this.create = function (feature, feature_geom) {
        var view = this.view_factory (feature, feature_geom, engine);
        view.update_all ();
        this.views.push (view);
        return view;
    };
};
