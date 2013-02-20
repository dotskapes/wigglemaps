function TimeSeriesRenderer (engine, layer, options) {
    LineRenderer.call (this, engine, layer, options);
    
    var order = layer.attr ('order');

    this.geomFunc = function (feature) {
        var linestrings = [];
        var linestring = [];

        for (var i = 0; i < order.length; i ++) {
            var y = feature.attr (order[i]);

            // End this linestring and start a new one if the point is undefined
            if (isNaN (y)) {
                if (linestring.length > 0) {
                    linestrings.push (linestring);
                    linestring = [];
                }
            }
            else {
                linestring.push ([i, y]);
            }
        }
        if (linestring.length > 0)
            linestrings.push (linestring);

        var feature_geom = [linestrings];
        return feature_geom;
    };
};
