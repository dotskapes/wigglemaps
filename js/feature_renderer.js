function FeatureRenderer (engine, layer) {
    // A list of views of the object
    this.views = [];

    // Update all features with a style property
    this.update = function (key) {
        for (var i = 0; i < views.length; i ++) {
            this.views[i].update (key);
        }
    };

    this.view_factory = function () {
        throw "Not Implemented";
    };

    this.create = function (feature) {
        var view = this.view_factory (feature);
        this.views.push (view);
        return view;
    };
};

function FeatureView (feature, layer) {
    this.style_map = {};
    
    // Update the buffers for a specific property
    this.update = function (key) {
        var value = derived_style (feature, layer, key);
        if (value === null)
            throw "Style property does not exist";
        this.style_map[key] (value);
    };
        
    // Update all buffers for all properties
    this.update_all = function () {
        for (var key in this.style_map) {
            this.update (key);
        }
    };
};
