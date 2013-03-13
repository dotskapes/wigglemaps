var ready_queue = [];

window.wiggle = {
    Map: Map,
    TimeSeries: TimeSeries,
    layer: {
        Layer: Layer,
	Grid: Grid,
	Hillshade: Hillshade,
	Elevation: Elevation,
        Raster: Raster
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
