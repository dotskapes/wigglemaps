var TimeSeriesQuerier = function (engine, layer, options) {
    var lines = layer.features ();
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

    this.pointSearch = function (s) {
        var p = engine.camera.project (s);
        var stepIndex = Math.floor (p.x);
        if (stepIndex < 0 || stepIndex >= options.order.length)
            return null;
        for (var i = 0; i < lines.count (); i ++) {
            var line = lines.get (i);
            var v1 = line.attr (options.order[stepIndex]);
            var v2 = line.attr (options.order[stepIndex + 1]);
            if (isNaN (v1) || isNaN (v2))
                continue;

            var p1 = vect (stepIndex, v1);
            var p2 = vect (stepIndex + 1, v2);

            var s1 = engine.camera.screen (p1);
            var s2 = engine.camera.screen (p2);

            var v = vect.dir (s2, s1)
            var u = vect.sub (s, s1);
            var side1 = vect.dot (u, v);
            var side2 = u.length ();
            var dist2Line = Math.sqrt (Math.pow (side2, 2) - Math.pow (side1, 2));
            if (dist2Line < StyleManager.derivedStyle (line, layer, engine, 'stroke-width'))
                return line;
        }
        //return new LayerSelector ([]);
        return null;
    };
};
