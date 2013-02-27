function FeatureView (geom, styleFunc) {
    this.style_map = {};

    this.geom = geom;

    var style = {};

    this.updateMany = function (styleObject) {
        for (var key in styleObject) {
            this.updateOne (key, styleObject[value]);
        };
    };

    // Update the buffers for a specific property    
    this.updateOne = function (key, value) {
        // If the value is not defined, there is problem
        if (value === undefined)
            throw "No value for style defined";

        if (style[key] == value)
            return;

        style[key] = value;

        if (key in this.style_map) {
            this.style_map[key] (value);
        }
    };

    this.updateDefault = function (key) {
        var value = styleFunc (key);
        this.updateOne (key, value);
    };
    
    // Overloaded function to update the view
    this.update = function (arg0, arg1) {
        if (typeof arg0 == "string") {
            if (arg1 === undefined)
                this.updateDefault (arg0);
            else
                this.updateOne (arg0, arg1);
        }
        else {
            this.updateMany (arg0);
        }
    };

    this.keys = function () {
        var items = {};
        for (key in this.style_map) {
            items[key] = true;
        }        
        return items;
    };
        
    // Update all buffers for all properties
    this.updateAll = function () {
        for (var key in this.style_map) {
            this.updateDefault (key);
        }
    };
};
