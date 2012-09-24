var BASE_DIR;

$ (document).ready (function () {
    var webgl_js = [
	'webgl-debug',
	'rAF',
	'util',
	//'utils/jDataView/src/jdataview',
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
	//'style',
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

    BASE_DIR = $ ('script[src*="webgl_maps.js"]').attr ('src').replace ('webgl_maps.js', '');
    
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
