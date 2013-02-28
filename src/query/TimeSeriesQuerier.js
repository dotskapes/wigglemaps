var TimeSeriesQuerier = function (engine, layer, options) {
    var r_points = [];
    layer.features ().each (function (n, polygon) {
        var pushPoint = function (v) {
            r_points.push ({
                ref: polygon,
	        x: v.x,
	        y: v.y
            });
        };
	$.each (options.geomFunc (polygon), function (i, poly) {
	    $.each (poly, function (j, ring) {
                var currentPoint = new vect (ring[0][0], ring[0][1]);
                pushPoint (currentPoint);
                for (var k = 1; k < ring.length; k ++) {
                    var nextPoint = new vect (ring[k][0], ring[k][1]);
                    var t = 0;
                    while (t < 1) {
                        t += .1;
                        var dir = vect.sub (nextPoint, currentPoint).scale (t);
                        pushPoint (vect.add (currentPoint, dir));
                    }
                    currentPoint = nextPoint;
                }
		/*$.each (ring, function (k, pair) {
                    var t = 0;
                    var min 
                    while (t < 1) {
		    r_points.push ({
                        ref: polygon,
			x: pair[0],
			y: pair[1]
		    });			
                        t += .1;
                    }
		});*/
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
