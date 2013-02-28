// A controller for point specific operations, particualrly to perform geometric queries
// on points faster. 
var PointQuerier = function (engine, layer, options) {
    var points = layer.features ().type ('Point');
    var search_points = [];
    var max_radius = 0;
    points.each (function (i, point) {
        var radius = StyleManager.derivedStyle (point, layer, engine, 'radius');
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

    this.boxSearch = function (box) {
        var elem = range_tree.search (box);
	var results = [];
	$.each (elem, function (index, point) {
	    results.push (point.ref);
	});
	return new LayerSelector (results);
    }

    this.pointSearch = function (s) {
        var min = vect.add (s, new vect (-max_radius, max_radius));
        var max = vect.add (s, new vect (max_radius, -max_radius));
        var box = new Box (engine.camera.project (min), engine.camera.project (max));
        var elem = range_tree.search (box);
        for (var i = 0; i < elem.length; i ++) {
            var point = elem[i].ref;

            var rad = StyleManager.derivedStyle (point, layer, engine, 'radius');
            for (var i = 0; i < point.geom.length; i ++) {
                var v = engine.camera.screen (geom2vect (point.geom[i]));
                if (vect.dist (v, s) < rad)
                    return new LayerSelector ([point.ref]);
            }
	}
        return new LayerSelector ([]);
    };
};
