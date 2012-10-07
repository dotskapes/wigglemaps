// #include 'vect.js'

(function () {

    var BASE_DIR = '';

    // #include 'utils/jquery.hotkeys.js'
    // #include 'utils/jquery.mousewheel.js'
    // #include 'rAF.js'
    // #include 'util.js'
    // #include 'utils/binary.js'
    // #include 'shader-utils.js'
    // #include 'utils/texture.js'
    // #include 'camera.js'
    // #include 'panner.js'
    // #include 'events.js'
    // #include 'engine.js'
    // #include 'buffer.js'
    // #include 'select.js'
    // #include 'trapezoid.js'
    // #include 'range.js'
    // #include 'feature.js'
    // #include 'point.js'
    // #include 'polygon.js'
    // #include 'line.js'
    // #include 'grid.js'
    // #include 'ascii.js'
    // #include 'sgrid.js'
    // #include 'selector.js'
    // #include 'raster.js'
    // #include 'hillshade.js'
    // #include 'tile.js'
    // #include 'ows.js'
    // #include 'geojson.js'
    // #include 'shapefile.js'
    // #include 'range_bar.js'
    // #include 'slider.js'
    // #include 'map.js'

    var ready_queue = [];

    window.wiggle = {
	Map: Map,
	layer: {
	    PointLayer: PointLayer,
	    LineLayer: LineLayer,
	    PolygonLayer: PolygonLayer,
	    Grid: Grid,
	    Hillshade: Hillshade,
	    Elevation: Elevation
	},
	io: {
	    Shapefile: Shapefile,
	    GeoJSON: GeoJSON,
	    KML: KML,
	    SparseGrid: SparseGrid,
	    WMS: WMS
	},
	util: {
	    fcolor: fcolor,
	    icolor: icolor
	},
	widget: {
	    Slider: Slider
	},
	ready: function (func) {
	    ready_queue.push (func);
	}
    };

    $ (document).ready (function () {
	$ ('script[src*="wigglemaps"]').each (function (i, script) {
	    var regex = /wigglemaps(\.min)?\.js/;
	    if ($ (script).attr('src').match (regex))
		BASE_DIR = $ (script).attr('src').replace (regex, '');
	});
	$.each (ready_queue, function (i, func) {
	    func ();
	});
    });
} ());