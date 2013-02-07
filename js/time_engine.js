function TimeSeries (selector, options) {
    if (options === undefined)
        options = {};
    BaseEngine.call (this, selector, options);

    this.styles = {
        'default': {
            'fill': new Color (.02, .44, .69, 1.0),
            'fill-opacity': .5,
            'stroke': new Color (.02, .44, .69, 1.0),
            'stroke-opacity': 1.0,
            'stroke-width': 2.0
        }
    };

    this.extents (1, 1);
    this.center (.5, .5);

    this.Renderers = {
        'default': TimeSeriesRenderer
    };
};
