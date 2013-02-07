// Constructor for the basic geometry types that can be rendered
var Feature = function (prop, layer) {
    // The set of features styles
    var feature_style = {
        '*': {}
    };

    // The views for a specific feature. Provides callbacks to update the renderer
    var views = {};

    // Unique feature ID
    this.id = new_feature_id ();

    // The Geometry type
    this.type = prop.type;

    var attr = prop.attr;

    // Attribute getter and setter
    this.attr = function (key, value) {
        if (arguments.length < 2) {
            return attr[key]
        }
    };

    // The geometry of the object
    this.geom = prop.geom;

    // Retreives the geometry of the object
    this.geometry = function () {

    };

    // Initializes a view for a given renderer
    this.initialize = function (renderer) {
        // Create a location in the renderer for the feature
        view = renderer.create (this);

        // Update all styles in the renderer
        view.update_all ();

        views[renderer.engine.id] = view; 
    };

    this.compute = function (engine, key) {
        return derived_style (engine, this, layer, key);
    };

    this.style3 = function (view_name, key, value) {
        if (feature_style[view_name] === undefined)
            feature_style[view_name] = {};
        if (value === undefined) {
            if (feature_style[view_name][key] !== undefined)
                return feature_style[view_name][key];
            else
                return null;
        }
        else {
            feature_style[view_name][key] = value;

            // If initialized, update rendering property
            if (views[view_name])
                views[view_name].update (key);
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
};

var EARTH = 6378.1

var new_feature_id = (function () {
    var current_id = 1;
    return function () {
	var id = current_id;
	current_id ++;
	return id;
    };
}) ();

var rand_map = (function () {
    var factor = 1e-6
    var xmap = {} 
    var ymap = {} 
    return function (x, y) {
	// Temporary Fix
	return new vect (x + Math.random () * factor - (factor / 2), y + Math.random () * factor - (factor / 2));
	// End Temp
	var key = x.toString () + ',' + y.toString ();
	if (!(key in xmap)) {
	    xmap[key] = x + Math.random () * factor - (factor / 2);
	    ymap[key] = y + Math.random () * factor - (factor / 2);
	}
	return new vect (xmap[key], ymap[key]);
    };
}) ();

/*function Polygon (geom, prop) {
  if (!prop)
  prop = {};
  if (!prop.attr)
  prop.attr = {};
  if (!prop.style)
  prop.style = {};

  this.geom = geom;
  this.attr = prop.attr;
  this.id = null;

  var layer = null;
  var start_outline, count_outline;
  var start_main, count_main;
  var buffers = null;
  
  };*/
