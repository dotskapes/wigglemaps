// The main map class
// This is the top level controller for all layers and renderers
var Map = function (selector, options) {
    var engine = this;

    if (options === undefined)
        options = {};

    // The geom function defined how to extract the geometry from a feature
    options.geomFunc = function (f) {
        return f.geom;
    };

    default_model (options, {
        'width': 360,
        'center': new vect (0, 0),
        'base': 'default',
        'tile-server': 'http://eland.ecohealthalliance.org',
        'preserveAspectRatio': true
    });

    Engine.call (this, selector, options); 

    // The renderers map between types and classes
    this.Renderers = {
        'Point': PointRenderer,
        'Polygon': multiRendererFactory ([PolygonRenderer, LineRenderer]),
        'Line': LineRenderer
    };

    // Queriers tell us how to search the geometry, which may not be the literal
    // geometry, depending on the choice of renderer
    this.Queriers = {
        'Point': PointQuerier,
        'Polygon': PolygonQuerier
        //'Line': LineQuerier
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
        // If the base layer already exists, remove to old one
        if (base) {
            // TODO
        }
        var settings;
        if (options.base == 'default' || options.base == 'nasa') {
            settings = copy (options);
            copy_to (settings, {
                source: 'file',
                url: options['tile-server'] + '/tiles/nasa_topo_bathy',
                levels: 8,
                size: 256
            });
            base = new MultiTileLayer (settings);
        }
        else if (options.base == 'ne') {
            settings = copy (options);
            copy_to (settings, {
                source: 'file',
                url: options['tile-server'] + '/tiles/NE1_HR_LC_SR_W_DR',
                levels: 6,
                size: 256
            });
            base = new MultiTileLayer (settings);
        }
        else if (options.base == 'ne1') {
            settings = copy (options);
            copy_to (settings, {
                source: 'file',
                url: options['tile-server'] + '/tiles/NE1_HR_LC',
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
            //engine.scene.push (base);
        };
        engine.base = base;
    };

    setBase ();

    // Allow for settings to be changed dynamically at runtime
    this.settings = function (key, value) {
        options[key] = value;
        if (key == 'base') {
            setBase();
        }
    };

    // Add a layer to the scene. Instantiate a controller (that handles
    // event and style registrations) and a set of queriers (that
    // handle searching rendered geometry)
    this.append = function (layer) {
        this.insert(layer, this.scene.length);
    };

    this.insert = function(layer, index) {
        // Legacy layer drawing code for old-school type layers
        if ('draw' in layer) {
            this.scene.splice (index, 0, layer);
            this.dirty = true;
            return;
        }

        this.scene.splice (index, 0, new LayerController (engine, layer, options));
        this.queriers[layer.id] = new Querier (this, layer, options);

        // When a new layer is added, we should redraw at least once
        this.dirty = true;
    };

    this.remove = function (layer) {
        for (var i = 0; i < this.scene.length; i ++) {
            if (this.scene[i] == layer) {
                var removed = this.scene.splice(i, 1);
                delete removed;
                break;
            }
        }
        if (layer.id in this.queriers) 
            delete this.queriers[layer.id];
    };
};
