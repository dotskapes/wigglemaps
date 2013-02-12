// #include 'src/utils/vect.js'

(function () {

    var BASE_DIR = '';

    // #include 'lib/jquery.hotkeys.js'
    // #include 'lib/jquery.mousewheel.js'
    // #include 'lib/requestAnimationFrame.js'

    // #include 'src/util.js'
    // #include 'src/utils/binary.js'
    // #include 'src/utils/shader-utils.js'
    // #include 'src/utils/Buffers.js'
    // #include 'src/utils/texture.js'

    // #include 'src/style.js'
    // #include 'src/camera.js'
    // #include 'src/panner.js'
    // #include 'src/events.js'
    // #include 'src/range_bar.js'
    // #include 'src/slider.js'

    // #include 'src/renderers/FeatureView.js'
    // #include 'src/renderers/FeatureRenderer.js'
    // #include 'src/renderers/PointRenderer.js'
    // #include 'src/renderers/LineRenderer.js'
    // #include 'src/renderers/PolygonRenderer.js'
    // #include 'src/renderers/TimeRenderer.js'

    // #include 'src/query/Querier.js'
    // #include 'src/query/PointQuerier.js'
    // #include 'src/query/PolygonQuerier.js'

    // #include 'src/Engine.js'
    // #include 'src/Map.js'
    // #include 'src/TimeSeries.js'

    // #include 'src/select.js'
    // #include 'src/trapezoid.js'
    // #include 'src/aabb.js'
    // #include 'src/range.js'

    // #include 'src/model/Feature.js'
    // #include 'src/model/Layer.js'
    // #include 'src/model/Point.js'
    // #include 'src/model/Polygon.js'
    // #include 'src/model/Line.js'

    // #include 'src/grid.js'
    // #include 'src/ascii.js'
    // #include 'src/sgrid.js'
    // #include 'src/selector.js'
    // #include 'src/raster.js'
    // #include 'src/hillshade.js'
    // #include 'src/tile.js'
    // #include 'src/ows.js'
    // #include 'src/io/Geojson.js'
    // #include 'src/io/Shapefile.js'

    var ready_queue = [];

    window.wiggle = {
	Map: Map,
        TimeSeries: TimeSeries,
	layer: {
            Layer: Layer,
	    Grid: Grid,
	    Hillshade: Hillshade,
	    Elevation: Elevation
	},
	io: {
	    Shapefile: Shapefile,
	    GeoJSON: GeoJSON,
	    KML: KML,
	    SparseGrid: SparseGrid,
	    AsciiGrid: AsciiGrid,
	    WMS: WMS
	},
	util: {
	    fcolor: fcolor,
	    icolor: icolor,
            Box: Box,
            RangeTree: RangeTree
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
