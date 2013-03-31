// A point for the layer. A point is actually a multi-point, so it can be
// made up of many "spatial" points. The geometry format for the point type is:
// [[lon, lat], [lon, lat], [lon, lat], ...]
var Point = function (prop, layer) {
    Feature.call (this, prop, layer);

    // Converts geometry representation of a point to a vector
    var geom2vect = function (geom) {
        return new vect (geom[0], geom[1]);
    };

    // Set the bounding box for the point
    this.bounds = null;
    for (var i = 0; i < this.geom.length; i ++) {
        var pos = geom2vect (this.geom[i]);
        var bbox = new Box (pos.clone (), pos.clone ());
	if (this.bounds)
	    this.bounds.union (bbox);
	else
	    this.bounds = bbox;
    }

    // Check if a point (usually a mouse position) is contained in the buffer
    // of this Point
    this.map_contains = function (engine, p) {
        //var s = engine.camera.screen (p);
        var s = p;
        //var rad = this.compute ('radius');
        var rad = StyleManager.derivedStyle (this, layer, engine, 'radius');
        for (var i = 0; i < this.geom.length; i ++) {
            var v = engine.camera.screen (geom2vect (this.geom[i]));
            if (vect.dist (v, s) < rad)
                return true;
        }
        return false;
    };
};


var PointCollection = function (points) {
    var search_points = [];
    var max_radius = 0;
    $.each (points, function (key, point) {
        var radius = StyleManager.derivedStyle (this, layer, engine, 'radius');
        if (radius > max_radius)
            max_radius = radius;
        $.each (point.geom, function (index, pair) {
            search_points.push ({
                x: pair[0],
                y: pair[1],
                ref: point
            });
        });
    });
    var range_tree = new RangeTree (search_points);

    // Search a rectangle for point contained within
    this.search = function (box) {
        var elem = range_tree.search (box);
	var results = [];
	$.each (elem, function (index, point) {
	    results.push (point.ref);
	});
	return new LayerSelector (results);
    };

    // Determine if a point is contained in the buffer of any of the points
    this.map_contains = function (engine, p) {
        //var s = engine.camera.screen (p);
        var s = p;
        var min = vect.add (s, new vect (-max_radius, max_radius));
        var max = vect.add (s, new vect (max_radius, -max_radius));
        var box = new Box (engine.camera.project (min), engine.camera.project (max));
        var elem = range_tree.search (box);
        for (var i = 0; i < elem.length; i ++) {
            var point = elem[i];
	    if (point.ref.map_contains (engine, p))
                return new LayerSelector ([point.ref]);
	}
        return new LayerSelector ([]);
    };
};
