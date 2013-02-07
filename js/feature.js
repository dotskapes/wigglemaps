// Constructor for the basic geometry types that can be rendered

var STYLE = 1;
var ATTR = 2;
var GEOM = 3;

var Feature = function (prop, layer) {
    var feature = this;

    // Unique feature ID
    this.id = new_feature_id ();
    this.type = 'Feature';

    // The Geometry type
    this.type = prop.type;

    var attr = prop.attr;

    // Attribute getter and setter
    this.attr = function (key, value) {
        if (arguments.length < 2) {
            return attr[key];
        }
        else {
            throw "Not Implemented";
        }
    };

    // The geometry of the object
    this.geom = prop.geom;

    // Retreives or sets the geometry of the object
    this.geometry = function () {

    };

    /*var change_callbacks = [];

    var trigger_change = function (mode, key, value) {
        $.each (change_callbacks, function (i, callback) {
            callback (feature, mode, key, value);
        });
    };

    // A function to broadcast when the geometry or feature specific styles change
    // This is used when changes occur that views may not be aware of
    this.change = function (change_func) {
        change_callbacks.push (change_func);
    };

    this.compute = function (engine, key) {
        return derived_style (engine, this, layer, key);
    };*/

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
