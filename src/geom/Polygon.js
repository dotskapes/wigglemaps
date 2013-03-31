var Polygon = function (prop, layer) {
    Feature.call (this, prop, layer);
    
    this.bounds = linestring_bounds (this.geom);

    this.map_contains = function (engine, p) {
        return this.contains (engine.camera.project (p));
    };

    this.contains = function (p) {
        var s = 0;
        var results = [];
        var feature = this;
        if (feature.bounds.contains (p)) {
            s ++;
            for (var j = 0; j < feature.geom.length; j ++) {
                var poly = feature.geom[j];
                var count = 0;
                $.each (poly, function (k, ring) {
                    for (var l = 0; l < ring.length; l ++) {
                        var m = (l + 1) % ring.length;
                        if ((p.y - ring[l][1]) / (p.y - ring[m][1]) < 0) {
                            var inf = new vect (720, p.y);
                            var v1 = new vect (ring[l][0], ring[l][1]);
                            var v2 = new vect (ring[m][0], ring[m][1]);
                            if (vect.intersects (p, inf, v1, v2))
                                count ++
                        }
                    }
                });
                if ((count % 2) == 1) {
                    return true;
                }
            }
        }
        return false;
    };

};

var PolygonCollection = function (polygons) {
    var r_points = [];
    for (var n = 0; n < polygons.length; n ++) {
        $.each (polygons[n].geom, function (i, poly) {
            $.each (poly, function (j, ring) {
                $.each (ring, function (k, pair) {
                    r_points.push ({
                        ref: polygons[n],
                        x: pair[0],
                        y: pair[1]
                    });                 
                });
            });
        });
    }
    tree = new RangeTree (r_points);

    this.search = function (box) {
        var elem = tree.search (box);
        var keys = {};
        $.each (elem, function (i, p) {
            keys[p.ref.id] = p.ref;
        });
        for (var i = 0; i < polygons.length; i ++) {
            for (var j = 0; j < 4; j ++) {
                if (polygons[i].contains (box.vertex (j)))
                    keys[polygons[i].id] = polygons[i];
            }
        }
        var results = [];
        for (var k in keys) {
            results.push (keys[k]);
        }
        return new LayerSelector (results);
    };

    this.map_contains = function (engine, p) {
        return this.contains (engine.camera.project (p));
    };

    this.contains = function (p) {
        var results = [];
        for (var i = 0; i < polygons.length; i ++) {
            if (polygons[i].contains (p))
                results.push (polygons[i]);
        }
        return new LayerSelector (results);
    };
};
