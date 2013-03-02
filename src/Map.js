var Map = function (selector, options) {
    var engine = this;

    if (options === undefined)
        options = {};

    options.geomFunc = function (f) {
        return f.geom;
    };

    default_model (options, {
        'width': 360,
        'center': new vect (0, 0),
        'base': 'default',
        'tile-server': 'http://eland.ecohealthalliance.org/wigglemaps',
        'preserveAspectRatio': true
    });

    BaseEngine.call (this, selector, options); 

    this.Renderers = {
        'Point': PointRenderer,
        'Polygon': multiRendererFactory ([PolygonRenderer, LineRenderer]),
        'Line': LineRenderer,
    };

    this.Queriers = {
        'Point': PointQuerier,
        'Polygon': PolygonQuerier,
        //'Line': lineQuerier
    };

    this.styles = {
        'Point': {
            'fill': new Color (.02, .44, .69, 1.0),
            'opacity': 1.0,
            'radius': 5.0,
            'stroke': 'none',
            'stroke-width': 2.0
        },
        'Polygon': {
            'fill': new Color (.02, .44, .69, 1.0),
            'fill-opacity': .5,
            'stroke': new Color (.02, .44, .69, 1.0),
            'stroke-opacity': 1.0,
            'stroke-width': .75
        },
        'Line': {
            'stroke': new Color (.02, .44, .69, 1.0),
            'stroke-opacity': 1.0,
            'stroke-width': 2.0
        },
        'default': {
            'fill': new Color (.02, .44, .69, 1.0),
            'fill-opacity': .5,
            'stroke': new Color (.02, .44, .69, 1.0),
            'stroke-opacity': 1.0,
            'stroke-width': 1.0            
        }
    };
    var base = null;
    var setBase = function () {
	if (options.base == 'default' || options.base == 'nasa') {
	    var settings = copy (options);
	    copy_to (settings, {
		source: 'file',
		url: options['tile-server'] + '/tiles/nasa_topo_bathy',
		levels: 8,
		size: 256
	    });
	    base = new MultiTileLayer (settings);
	}
	else if (options.base == 'ne') {
	    var settings = copy (options);
	    copy_to (settings, {
		source: 'file',
		url: options['tile-server'] + '/tiles/NE1_HR_LC_SR_W_DR',
		levels: 6,
		size: 256
	    });
	    base = new MultiTileLayer (settings);
	}
	else if (options.base == 'ne1') {
	    var settings = copy (options);
	    copy_to (settings, {
		source: 'file',
		url: TILE_SERVER + '/tiles/NE1_HR_LC',
		levels: 6,
		size: 256
	    });
	    base = new MultiTileLayer (settings);
	}
	else {
	    base = null;
	}
        if (base) {
            base.initialize (engine);
            engine.scene.push (base);
        };
    };

    setBase ();

    this.append = function (layer) {
        // Legacy layer drawing code for old-school type layers
        if ('draw' in layer) {
            this.scene.push (layer);
            return;
        }

        this.scene.push (new LayerController (engine, layer, options));
        this.queriers[layer.id] = new Querier (this, layer, options);
    };
};