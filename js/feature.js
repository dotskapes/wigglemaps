// Constructor for the basic geometry types that can be rendered
var Feature = function () {
    // The set of features styles
    var feature_style = {};

    // A view for a specific point. Provides callbacks to update the renderer
    var view = null;

    // Attribute getter and setter
    this.attr = function (key, value) {

    };

    // The geometry of the object
    this.geom = prop.geom;

    // Retreives the geometry of the object
    this.geometry = function () {

    };

    // Set the properties for the renderer
    this.initialize = function (renderer) {
        // Create a location in the renderer for the feature
        view = renderer.create (feature_geom, feature_style);
        // Update all styles in the renderer
        view.update_all ();
    };
    
    this.style = function (key, value) {
        // Getter if only one argument passed
        if (arguments.length < 2) {
            return feature_style[key];
        }
        // Otherwise, set property
        else {
            feature_style[key] = value;
            // If initialized, update rendering property
            if (layer_initialized)
                view.update (key)
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
