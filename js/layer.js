function Layer () {
    // The renderers for displaying geometries
    var point_renderer = null;
    var polygon_renderer = null;
    var line_renderer = null;

    // If rendering for the layer has been initialized
    var layer_initialized = false;

    // The layer's style properties
    var layer_style = {};

    // Lookups for each geometry type
    var points = {};
    var polygons = {};
    var lines = {};

    this.style = function (key, value) {
        // Getter if only one argument passed
        if (arguments.length < 2) {
            return layer_style[key];
        }
        // Otherwise, set property
        else {
            layer_style[key] = value;
            // If initialized, update rendering property
            if (layer_initialized) {
                point_renderer.update (key);
                polygon_renderer.update (key);
                line_renderer.update (key)
            }
        }
    };

    // A point for the layer. A point is actually a multi-point, so it can be
    // made up of many "spatial" points. The geometry format for the point type is:
    // [[lon, lat], [lon, lat], [lon, lat], ...]
    var Point = function () {
        Feature.call (this);

        // Converts geometry representation of a point to a vector
        var geom2vect = function (geom) {
            return new vect (geom[0], geom[1]);
        };

        // Set the bounding box for the point
        this.bounds = null;
        for (var i = 0; i < this.geom.length; i ++) {
            var pos = point2vect (this.geom[i]);
            var bbox = new Box (pos.clone (), pos.clone ());
	    if (this.bounds)
	        this.bounds.union (bbox);
	    else
	        this.bounds = bbox

        var old_initialize = this.initialize;
        this.initialize = function () {
            old_initialize (point_renderer);
        };
    };

    this.bounds = function () {};
    this.features = function () {};

    this.search = function () {};
    this.contains = function () {};
    
    this.append = function (feature) {
        // If the layer has already been initialized, initialize the feature
    };

    this.style = function () {};

    this.mouseover = function () {};
    this.mouseout = function () {};

    // Receive low level mouse position handlers from the bound engine
    this.update_move = function () {};
    this.force_out = function () {};

    // Sets up the renderers for each geometry
    this.initialize = function (engine) {
        //Setup the renderers for the layer
        point_renderer = new PointRenderer (engine, layer_style);
        //polygon_renderer = new PolygonRender (engine, layer_style);
        //line_renderer = new LineRenderer (engine, layer_style);

        // Initialize all existing geometry for rendering
        for (var id in features) {
            features[key].initialize ();
        }
    };

    // Draw all features in the layer
    this.draw = function (dt) {
        if (!layer_initialized) {
            throw "Layer has not yet been initialized";
        }
        point_renderer.draw ();
        polygon_renderer.draw ();
        line_renderer.draw ();
    };
};
