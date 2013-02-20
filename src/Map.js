var Map = function (selector, options) {
    var engine = this;

    if (options === undefined)
        options = {};

    default_model (options, {
        'width': 360,
        'center': new vect (0, 0)
    });

    BaseEngine.call (this, selector, options);    

    default_model (options, {
        'base': 'default',
        'tile-server': 'http://eland.ecohealthalliance.org/wigglemaps',
        'min': new vect (-180, -90),
        'max': new vect (180, 90),
    });

    this.Renderers = {
        'Point': PointRenderer,
        'Polygon': multiRendererFactory ([PolygonRenderer, LineRenderer]),
        'Line': LineRenderer,
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
};
/*var Map = function (selector, options) {
    this.center = function (x, y) {
	engine.camera.position (new vect (x, y));
    };

    this.vcenter = function (v) {
	this.center (v.x, v.y);
    };

    this.extents = function (width) {
	engine.camera.extents (width);
    };

    this.append = function (layer) {
        layer.initialize (engine);
	engine.scene.push (layer);
    };

    this.remove = function (layer) {
	for (var i = 0; i < engine.scene.length; i ++) {
	    if (engine.scene[i] == layer) {
		engine.scene.splice (i, 1);
		return true;
	    }
	}
	return false;
    };

    this.shade = function (data) {
	var shade = new Hillshade (data);
	engine.shade = shade;
    };

    this.select = function (func)  {
	if (!func)
	    engine.select (false);
	else {
	    engine.sel.select (func);
	    engine.select (true);
	}
    };

    this.resize = function () {
	engine.resize ();
    }

    this.attr = function (key, value) {
	engine.attr (key, value);
    };

    this.png = function () {
	var data = engine.canvas.get (0).toDataURL ();

	$.ajax ({
	    url: '../server/export.png',
	    type: 'POST',
	    data: data
	});
    };

    this.width = function () {
	return engine.canvas.innerWidth ();
    };

    this.height = function () {
	return engine.canvas.innerHeight ();
    };

    var click_func = null;
    this.click = function (func) {
	click_func = func;
    };

    engine = new Engine (selector, this, options);

    engine.canvas.click (function (event) {
	if (click_func) {
	    var v = new vect (event.pageX, event.pageY);
	    var p = engine.camera.project (v);
	    click_func (p);
	}
    });
};
*/
