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
    //var factor = .000000001;
    var factor = 1e-6
    var xmap = {} 
    var ymap = {} 
    return function (x, y) {
	var key = x.toString () + ',' + y.toString ();
	if (!(key in xmap)) {
	    xmap[key] = x + Math.random () * factor - (factor / 2);
	    ymap[key] = y + Math.random () * factor - (factor / 2);
	}
	return new vect (xmap[key], ymap[key]);
    };
}) ();

function Polygon (geom, prop) {
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
   
};