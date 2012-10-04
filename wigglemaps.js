var wiggle = {};
var BASE_DIR;

$ (document).ready (function () {
    var webgl_js = [
	'utils/jquery.hotkeys',
	'utils/jquery.mousewheel',
	'webgl-debug',
	'rAF',
	'util',
	'utils/binary',
	'vect',
	'shader-utils',
	'utils/texture',
	'camera',
	'panner',
	'events',
	'engine',
	'buffer',
	'select',
	'trapezoid',
	'range',
	'feature',
	'point',
	'polygon',
	'line',
	'grid',
	'ascii',
	'sgrid',
	'selector',
	'raster',
	'tile',
	'ows',
	'geojson',
	'shapefile',
	'range_bar',
	'slider',
	'map'
    ];

    BASE_DIR = $ ('script[src*="wigglemaps.js"]').attr ('src').replace ('wigglemaps.js', '');

    $.each (webgl_js, function (index, value) {
	$.ajax ({
	    url: BASE_DIR + 'js/' + value + '.js',
	    async: false,
	    error: function (xhr, status, reason) {
		throw reason;
	    }
	});
    });
});
