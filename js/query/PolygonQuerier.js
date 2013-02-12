var PolygonQuerier = function (engine, layer) {
    var r_points = [];
    layer.features ().each (function (n, polygon) {
	$.each (polygon.geom, function (i, poly) {
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
        // Check to see if one of the corners of the box are in the polygon
        layer.features ().each (function (i, polygon) {
            for (var j = 0; j < 4; j ++) {
                if (polygon.contains (box.vertex (j)))
                    keys[polygon.id] = polygon;
            }
        });
	var results = [];
	for (var k in keys) {
	    results.push (keys[k]);
	}
	return new LayerSelector (results);

    };
    this.pointSearch = function (p) {
        var results = [];
        layer.feature ().each (function (i, polygon) {
            if (polygon.contains (p))
                results.push (polygon);
        });
        return new LayerSelector (results);
    };
};
