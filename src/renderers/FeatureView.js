function FeatureView (feature, layer, engine) {
    this.style_map = {};
    
    // Update the buffers for a specific property
    this.update = function (key) {
        var value = StyleManager.derivedStyle (feature, layer, engine, key);
        if (value === null)
            throw "Style property does not exist";
        if (key in this.style_map) {
            this.style_map[key] (value);
        }
    };
        
    // Update all buffers for all properties
    this.update_all = function () {
        for (var key in this.style_map) {
            this.update (key);
        }
    };
};
