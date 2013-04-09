var linestring_bounds = function (geom) {
    var min = new vect (Infinity, Infinity);
    var max = new vect (-Infinity, -Infinity);
    $.each (geom, function (i, poly) {
        $.each (poly, function (k, ring) {
            $.each (ring, function (j, pair) {
                if (pair[0] < min.x)
                    min.x = pair[0];
                if (pair[0] > max.x)
                    max.x = pair[0];
                if (pair[1] < min.y)
                    min.y = pair[1];
                if (pair[1] > max.y)
                    max.y = pair[1];
            });
        });
    });
    return new Box (min, max);
};

var Line = function (prop, layer) {
    Feature.call (this, prop, layer);

    this.bounds = linestring_bounds (this.geom);

    this.map_contains = function (engine, p) {
        return false;
    }
};

var LineCollection = function (lines) {
    this.search = function (box) {
        return new LayerSelector ([]);
    };

    this.map_contains = function (engine, p) {
        return new LayerSelector ([]);
    };

    this.contains = function (p) {
        return new LayerSelector ([]);
    };
};
