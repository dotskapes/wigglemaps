var geom_types = {
    'Point': Point,
    'Polygon': Polygon,
    'Line': Line
};

var Layer = function (options) {
    if (!options)
        options = {};

    this.id = new_feature_id ();
    this.type = 'Layer';

    // The layer's style properties
    var layer_style = {};

    // Lookup for each geometry type
    var features = {};

    // Copy over the defined styles
    if (options.style) {
        for (var key in options.style) {
            StyleManager.setStyle(this, null, key, options.style[key]);
        }
    }

    this.style = function (arg0, arg1, arg2) {
        var engine, key, value;
        if (!arg0 || arg0.type == 'Engine') {
            engine = arg0;
            key = arg1;
            value = arg2;
        }
        else {
            engine = null;
            key = arg0;
            value = arg1;
        }
        if (value === undefined) {
            return StyleManager.getStyle (this, engine, key);
        }
        else {
            StyleManager.setStyle (this, engine, key, value);
            return this;
        }
    };

    this.bounds = null;

    this.features = function () {
        var elem = [];
        for (var id in features) {
            elem.push (features[id]);
        }
        return new LayerSelector (elem);
    };

    var props = {};
    this.properties = function () {
        var results = [];
        for (var key in props) {
            results.push (key);
        }
        return results;
    };
    this.numeric = function () {
        var results = [];
        for (var key in props) {
            if (props[key])
                results.push (key);
        }
        return results;
    };

    var layer_attr = {};
    this.attr = function (key, value) {
        // Getter if only one argument passed
        if (arguments.length < 2) {
            if (layer_attr[key] !== undefined)
                return layer_attr[key];
            else
                return null;
        }
        // Otherwise, set property
        else {
            layer_attr[key] = value;
        }
    };

    this.fixed = false;
    
    this.append = function (feature) {
        if (this.fixed)
            throw "Layers are currently immutable once added to a map";
        var f = new geom_types[feature.type] (feature, this);
        features[f.id] = f;

        // Update the layer bounding box
        if (this.bounds)
            this.bounds.union (f.bounds);
        else
            this.bounds = f.bounds.clone ();

        for (var key in feature.attr) {
            if (props[key] === undefined) { 
                if (!isNaN (feature.attr[key]))
                    props[key] = true;
                else
                    props[key] = false;
            }
            else {
                if (!isNaN (feature.attr[key]) && props[key])
                    props[key] = true;
                else
                    props[key] = false;
            }
        }

        return f;
    };

    // User defined event handler functions
    //var over_func = null, out_func = null;
    this.mouseover = function (func) {
        EventManager.addEventHandler (this, 'mouseover', func);
    };

    this.mouseout = function (func) {
        EventManager.addEventHandler (this, 'mouseout', func);
    };
};
