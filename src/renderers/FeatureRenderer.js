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

    // Abstract method that should be replaced with a the correct constructor
    this.View = function () {
        throw "Attempt to call abstract function";
    };

    // Create a new view (in wigglemaps land, a slice of buffers)
    // Uses only a representation of geometry and style function
    this.create = function (geom, style) {
        var view = new this.View (geom, style);
        this.views.push (view);
        view.updateAll ();
        return view;
    };

    this.draw = function () {
        throw "Attempt to call abstract function";
    };
};
