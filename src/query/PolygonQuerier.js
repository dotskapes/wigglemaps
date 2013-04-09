var PolygonQuerier = function (engine, layer, options) {
    var polygons = layer.features ().type ('Polygon');
    var r_points = [];
    polygons.each (function (n, polygon) {
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
        polygons.each (function (i, polygon) {
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
    this.pointSearch = function (s) {
        var p = engine.camera.project (s);
        //var results = [];
        //polygons.each (function (i, polygon) {
        for (var i = 0; i < polygons.count (); i ++) {
            var polygon = polygons.get (i);
            if (polygon.contains (p))
                return polygon;
            //results.push (polygon);
            //});
        }
        //return new LayerSelector (results);
        return null;
    };
};
