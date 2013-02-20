function FeatureRenderer (engine, layer) {
    this.engine = engine;

    // A list of views of the object
    this.views = [];

    /*// Update all features with a style property
    this.update = function (key) {
        throw "Don't ever call this";
        for (var i = 0; i < views.length; i ++) {
            this.views[i].update (key);
        }
    };*/

    this.View = function () {
        throw "Attempt to call abstract function";
    };

    this.create = function (feature) {
        var view = new this.View (this.geomFunc (feature));
        this.views.push (view);
        return view;
    };

    this.draw = function () {
    };

    this.geomFunc = function (feature) {
        return feature.geom;
    };
};
