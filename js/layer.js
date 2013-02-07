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
    // The renderers for displaying geometries
    var renderers = {};

    // Collections for each geometry type
    var collections = {};

    // If rendering for the layer has been initialized
    var layer_initialized = false;

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

    this.style3 = function (view_name, key, value) {
        if (layer_style[view_name] === undefined)
            layer_style[view_name] = {};
        if (value === undefined) {
            if (layer_style[view_name][key] !== undefined)
                return layer_style[view_name][key];
            else
                return null;
        }
        else {
            throw "Not Implemeneted";
        }
    };

    this.style = function (arg0, arg1, arg2) {
        if (arg0.type == 'Engine') {
            return this.style3 (arg0.id, arg1, arg2);
        }
        else {
            return this.style3 ('*', arg0, arg1);
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

            // If initialized, update rendering property
            if (layer_initialized) {
                throw "Not Implemented";
            }
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

        // If the layer has already been initialized, initialize the feature
        if (layer_initialized) {
            throw "Not Implemeneted";
            //f.initialize (renderers[f.type]);
        }
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

    // Sets up the renderers for each geometry
    this.initialize = function (engine) {
        var new_renderers = {};
        for (var key in engine.Renderer) {
            new_renderers[key] = new engine.Renderer[key] (engine, this);
        }
        /* //Setup the renderers for the layer
        for (var key in geom_types) {
            var Renderer = engine.Renderer[key];
            if (!Renderer)
                Renderer = engine.Renderer['*'];
            new_renderers[key] = new Renderer (engine, this);
        }*/

        layer_initialized = true;

        // Initialize all existing geometry for rendering
        for (var id in features) {
            var f = features[id];
            var renderer;
            if (new_renderers[f.type])
                renderer = new_renderers[f.type]
            else
                renderer = new_renderers['*'];
            if (renderer)
                features[id].initialize (renderer);
        }
        renderers[engine.id] = new_renderers;
    };

    // Update the data structures
    this.update = function () {
        var selector = this.features ();
        for (var key in geom_types) {
            collections[key] = new geom_types[key]['collection'] (selector.type (key).items ());
        }
        dirty = false;
    };

    // Draw all features in the layer
    this.draw = function (dt) {
        if (dirty) {
            this.update ();
        }

        if (!layer_initialized) {
            throw "Layer has not yet been initialized";
        }
        for (var key in renderers) {
            for (var geom in renderers[key])
                renderers[key][geom].draw ();
        }
        //polygon_renderer.draw ();
        //line_renderer.draw ();
    };
};
