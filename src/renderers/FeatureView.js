function FeatureView (geom) {
    this.style_map = {};

    this.geom = geom;
    
    // Update the buffers for a specific property
    this.update = function (key, value) {
        //var value = StyleManager.derivedStyle (feature, layer, engine, key);
        if (value === null)
            throw "Style property does not exist";
        if (key in this.style_map) {
            this.style_map[key] (value);
        }
    };

    this.keys = function () {
        var items = {};
        for (key in this.style_map) {
            items[key] = true;
        }        
        return items;
    };
        
    /*// Update all buffers for all properties
    this.update_all = function () {
        for (var key in this.style_map) {
            this.update (key);
        }
        for (var i = 0; i < this.children.length; i ++) {
            this.children[i].update_all ();
        }
    };*/
};
