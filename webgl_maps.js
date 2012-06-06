var BASE_DIR;

$ (document).ready (function () {
    var webgl_js = [
	'webgl-debug',
	'util',
	'vect',
	'shader-utils',
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
	'selector',
	'raster',
	'geojson',
	'range_bar',
	'slider',
	'map'
    ];

    BASE_DIR = $ ('script[src*="webgl_maps.js"]').attr ('src').replace ('webgl_maps.js', '');
    console.log (BASE_DIR);
    
    $.each (webgl_js, function (index, value) {
	$.ajax ({
	    url: BASE_DIR + 'js/' + value + '.js',
	    async: false,
	    error: function (xhr, status, reason) {
		throw reason;
	    }
	});
    });

    //engine = new Engine ();

    //var p = new vect (-55, -10);
    //engine.camera.position (p);
});