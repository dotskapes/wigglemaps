var TimeSeriesQuerier = function (engine, layer, options) {
    var r_points = [];
    layer.features ().each (function (n, polygon) {
	$.each (options.geomFunc (polygon), function (i, poly) {
	    $.each (poly, function (j, ring) {
		$.each (ring, function (k, pair) {
		    r_points.push ({
                        ref: polygon,
			x: pair[0],
			y: pair[1]
		    });			
		});
	    });
	});
    });
    var tree = new RangeTree (r_points);

    this.boxSearch = function (box) {
        // Range search on the vertices of the polygon
	var elem = tree.search (box);
	var keys = {};
	$.each (elem, function (i, p) {
	    keys[p.ref.id] = p.ref;
	});
	var results = [];
	for (var k in keys) {
	    results.push (keys[k]);
	}
	return new LayerSelector (results);
    };

    this.pointSearch = function (p) {
        return new LayerSelector ([]);
    };
};
