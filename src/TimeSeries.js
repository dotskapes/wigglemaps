function TimeSeries (selector, layer, options) {
    var engine = this;
    if (options === undefined)
        options = {};

    if (!options.order) {
        options.order = layer.numeric ();
        options.order.sort ();
    }

    var unionBounds = function (bound1, bound2) {
        var min, max;

        if (bound1.min < bound2.min)
            min = bound1.min;
        else 
            min = bound2.min;

        if (bound1.max > bound2.max)
            max = bound1.max;
        else 
            max = bound2.max;
        return {
            'min': min,
            'max': max
        };
    };

    var features = layer.features ();
    var bounds = null;
    $.each (options.order, function (i, timeStep) {
        var stepBounds = features.range (timeStep);
        if (!bounds)
            bounds = stepBounds;
        else
            bounds = unionBounds (bounds, stepBounds);
    });

    default_model (options, {
        'range': {
            'min': bounds.min,
            'max': bounds.max
        },
        'domain': {
            'min': 0,
            'max': options.order.length - 1,
        },
        'min': new vect (0, bounds.min),
        'width': options.order.length - 1,
        'height': bounds.max - bounds.min,
        'worldMin': new vect (0, bounds.min),
        'worldMax': new vect (options.order.length - 1, bounds.max),
        'xlock': false,
        'ylock': false,
    });

    var order = options.order;

    options.geomFunc = function (feature) {
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

    BaseEngine.call (this, selector, options);

    this.styles = {
        'default': {
            'fill': new Color (.02, .44, .69, 1.0),
            'fill-opacity': .5,
            'stroke': new Color (.02, .44, .69, 1.0),
            'stroke-opacity': 1.0,
            'stroke-width': 2.0,
        }
    };

    this.Renderers = {
        'default': LineRenderer
    };

    this.Queriers = {
        '*': TimeSeriesQuerier
    };

    var grid_style = {
        'stroke': new Color (.25, .25, .25, 1.0),
        'stroke-width': .75,
        'stroke-opacity': 1.0
    };
    var gridStyleFunc = function (key) {
        return grid_style[key];
    };
    var drawGrid = function () {

        var grid_renderer = new LineRenderer (engine);

        $.each (options.order, function (i, key) {
            var line = [[[ 
                [i, options.range.min], 
                [i, options.range.max] 
            ]]];
            grid_renderer.create (line, gridStyleFunc);
        });

        var rect = [[[ 
            [options.domain.min, options.range.min], 
            [options.domain.max, options.range.min], 
            [options.domain.max, options.range.max], 
            [options.domain.min, options.range.max], 
            [options.domain.min, options.range.min] 
        ]]];
        grid_renderer.create (rect, gridStyleFunc);

        engine.scene.push (grid_renderer);

        if (options.ticks) {
            var currentTick = 0;
            while (currentTick > options.range.min)
                currentTick -= options.ticks;
            while (currentTick < options.range.max) {
                var line = [[[
                    [options.domain.min, currentTick],
                    [options.domain.max, currentTick]
                ]]];
                grid_renderer.create (line, gridStyleFunc);
                currentTick += options.ticks
            }
        }
    };
    drawGrid ();

    this.scene.push (new LayerController (engine, layer, options));
    this.queriers[layer.id] = new Querier (this, layer, options);
};
