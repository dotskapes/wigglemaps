var FeatureRenderer = function (engine) {
    var renderer = this;

    this.engine = engine;

    // A list of views of the object
    this.views = [];

    // Update all features with a style property
    this.update = function (key) {
        for (var i = 0; i < views.length; i ++) {
            this.views[i].update (key);
        }
    };

    this.View = function () {
        throw "Attempt to call abstract function";
    };

    this.create = function (geom, style) {
        //var view = new this.View (this.geomFunc (feature), styleFuncFactory (feature));
        var view = new this.View (geom, style);
        this.views.push (view);
        view.updateAll ();
        return view;
    };

    this.draw = function () {
        throw "Attempt to call abstract function";
    };

    /*this.geomFunc = function (feature) {
        return feature.geom;
    };

    var styleFuncFactory = function (feature) {
        return function (key) {
            return renderer.styleFunc (feature, key);
        };
    };
    
    this.styleFunc = function (feature, key) {
        return StyleManager.derivedStyle (feature, layer, engine, key);
    };*/
};
