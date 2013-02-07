function TimeSeriesRenderer (engine, layer) {
    FeatureRenderer.call (this, engine, layer);
    
    var line_renderer = new LineRenderer (engine, layer);

    this.view_factory = function (feature) {
        var linestrings = [];
        var linestring = [];
        var order = layer.attr ('order');
        for (var i = 0; i < order.length; i ++) {
            var y = feature.attr (order[i]);

            // End this linestring and start a new one if the point is undefined
            if (isNaN (y)) {
                if (linestring.length > 0) {
                    linestrings.push (linestring);
                    linestring = [];
                }
            }
            else
                linestring.push ([i / 52, y / 6500]);
        }
        if (linestring.length > 0)
            linestrings.push (linestring);
        //linestring = [[.25, .75], [.3,0], [.35, .75], [1.5, .5]];
        //linestring = linestring.slice (20, 25);
        var feature_geom = [linestrings];

        return line_renderer.create (feature, feature_geom);
    };

    this.draw = function () {
        line_renderer.draw ();
    };

};
