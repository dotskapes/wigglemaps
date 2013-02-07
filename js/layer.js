var geom_types = {
    'Point': {
        geometry: Point,
        collection: PointCollection
    },
    'Polygon': {
        geometry: Polygon,
        collection: PolygonCollection
    },
    'Line': {
        geometry: Line,
        collection: LineCollection
    }
};

function Layer (prop) {
    this.id = new_feature_id ();
    this.type = 'Layer';

    // Collections for each geometry type
    var collections = {};

    // The layer's style properties
    var layer_style = {};

    // Lookup for each geometry type
    var features = {};

    // If new geometry collections need to be instantiated
    var dirty = false;

    // Copy over the defined styles
    if (prop.style) {
        for (var key in prop.style)
            layer_style[key] = prop.style[key];
    }

    this.style = function (arg0, arg1, arg2) {
        throw "Not Implemented";
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
    this.properties = function (numeric) {
        var results = [];
        for (var key in props) {
            if (!numeric || (numeric && props[key]))
                results.push (key);
        }
        return results;
    };

    // Geometry queries

    this.search = function (box) {
        if (dirty) {
            this.update ();
        }
        var results = new LayerSelector ([]);
        for (var key in collections) {
            var search_results = collections[key].search (box);
            results = results.join (search_results);
        }
        return results;
    };
    this.map_contains = function (engine, p) {
        if (dirty) {
            this.update ();
        }
        var results = new LayerSelector ([]);
        for (var key in collections) {
            var search_results = collections[key].map_contains (engine, p);
            results = results.join (search_results);
        }
        return results;
	/*var results = [];
	for (var i in features) {
	    var feature = features[i];
            if (feature.contains (engine, p))
                results.push (feature);
        }
        return new LayerSelector (results);*/
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
    
    this.append = function (feature) {
        var f = new geom_types[feature.type]['geometry'] (feature, this);
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
        };

        dirty = true;
    };

    // User defined event handler functions
    var over_func = null, out_func = null;
    this.mouseover = function (func) {
	over_func = func;
    };

    this.mouseout = function (func) {
        out_func = func;
    };

    // Receive low level mouse position handlers from the bound engine
    var current_over = {};
    this.update_move = function (engine, p) {
	if (over_func || out_func) {
	    var c = this.map_contains (engine, p);
	    var new_over = {};
	    if (c) {
		c.each (function (i, f) {
		    new_over[f.id] = f;
		});
	    }
	    for (var key in current_over) {
		if (!(key in new_over) && out_func) 
		    out_func (current_over[key]);
	    }
	    for (var key in new_over) {
		if (!(key in current_over) && over_func) 
		    over_func (new_over[key]);
	    }
	    current_over = new_over;    
        }
    };
    this.force_out = function () {
	for (var key in current_over) {
	    if (out_func)
		out_func (current_over[key]);
	}
	current_over = {};
    };

    // Update the data structures
    this.update = function () {
        if (dirty) {
            var selector = this.features ();
            for (var key in geom_types) {
                collections[key] = new geom_types[key]['collection'] (selector.type (key).items ());
            }
        }
        dirty = false;
    };
};
