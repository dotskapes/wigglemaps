//var set_id_color, bind_event;

var Mouse = {
    x: 0,
    y: 0
};

function Engine (selector, options) {
    if (!options) {
	options = {};
    }
    if (!('base' in options)) {
	options.base = 'default';
    }
    console.log (options);
    if (!('background' in options)) {
	options.background = new Color (0, 0, 0, 1);
    }
    var that = this;
    this.canvas = $ ('<canvas></canvas>').attr ('id', 'viewer');
    if (selector) {
	$ (selector).append (this.canvas);
	this.canvas.attr ('width', $ (selector).width ());
	this.canvas.attr ('height', $ (selector).height ());
    }
    else {
	selector = window;
	$ ('body').append (this.canvas);
	this.canvas.attr ('width', $ (selector).width ());
	this.canvas.attr ('height', $ (selector).height ());	
	$ (window).resize (function () {
	    that.resize ();
	});
    }

    this.resize = function () {
	that.canvas.attr ('width', $ (selector).width ());
	that.canvas.attr ('height', $ (selector).height ());	
	gl.viewport (0, 0, that.canvas.width (), that.canvas.height ());
	that.camera.reconfigure ();
    };

    setContext (this.canvas, DEBUG);

    //gl.clearColor(options.background.r, options.background.g, options.background.b, options.background.a);

    gl.blendFunc (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable (gl.BLEND);

    //gl.depthFunc (gl.GEQUAL);
    //gl.enable (gl.DEPTH_TEST);

    this.scene = [];

    //this.styler = new StyleManager ();
    this.camera = new Camera (this.canvas, options);
    this.scroller = new Scroller (this);

    this.pxW = 1 / this.canvas.attr ('width');
    this.pxH = 1 / this.canvas.attr ('height');

    this.sel = new SelectionBox (this);

    this.select = function (flag) {
	if (flag) {
	    this.scroller.disable ();
	    this.sel.enable ();
	}
	else {
	    this.scroller.enable ();
	    this.sel.disable ();
	}
    };

    //this.manager = new EventManager (this);

    var old_time =  new Date ().getTime ();
    var fps_window = [];

    //base_east = null;
    //base_west = null;

    this.attr = function (key, value) {
	if (key == 'base') {
	    options.base = value;
	    set_base ()
	}
    }

    base = null;
    var set_base = function () {
	if (options.base == 'default' || options.base == 'nasa') {
	    base = new MultiTileLayer ([
		{
		    url: BASE_DIR + '/tiles/nasa_topo_bathy/512',
		    min: new vect (-180, -90),
		    cols: 2,
		    rows: 1,
		    cellsize: 180,
		    size: 256
		},
		{
		    url: BASE_DIR + '/tiles/nasa_topo_bathy/1024',
		    min: new vect (-180, -90),
		    cols: 4,
		    rows: 2,
		    cellsize: 90,
		    size: 256
		},
		{
		    url: BASE_DIR + '/tiles/nasa_topo_bathy/2048',
		    min: new vect (-180, -90),
		    cols: 8,
		    rows: 4,
		    cellsize: 45,
		    size: 256
		},
		{
		    url: BASE_DIR + '/tiles/nasa_topo_bathy/4096',
		    min: new vect (-180, -90),
		    cols: 16,
		    rows: 8,
		    cellsize: 22.5,
		    size: 256
		},
		{
		    url: BASE_DIR + '/tiles/nasa_topo_bathy/8192',
		    min: new vect (-180, -90),
		    cols: 32,
		    rows: 16,
		    cellsize: 11.25,
		    size: 256
		},
		{
		    url: BASE_DIR + '/tiles/nasa_topo_bathy/16384',
		    min: new vect (-180, -90),
		    cols: 64,
		    rows: 32,
		    cellsize: 5.625,
		    size: 256
		},
		{
		    url: BASE_DIR + '/tiles/nasa_topo_bathy/32768',
		    min: new vect (-180, -90),
		    cols: 128,
		    rows: 64,
		    cellsize: 2.8125,
		    size: 256
		},
		{
		    url: BASE_DIR + '/tiles/nasa_topo_bathy/65536',
		    min: new vect (-180, -90),
		    cols: 256,
		    rows: 128,
		    cellsize: 1.40625,
		    size: 256
		}
	    ], options);
	}
	else if (options.base == 'ne') {
	    base = new MultiTileLayer ([
		{
		    url: BASE_DIR + '/tiles/NE1_HR_LC_SR_W_DR/512',
		    min: new vect (-180, -90),
		    cols: 2,
		    rows: 1,
		    cellsize: 180,
		    size: 256
		},
		{
		    url: BASE_DIR + '/tiles/NE1_HR_LC_SR_W_DR/1024',
		    min: new vect (-180, -90),
		    cols: 4,
		    rows: 2,
		    cellsize: 90,
		    size: 256
		},
		{
		    url: BASE_DIR + '/tiles/NE1_HR_LC_SR_W_DR/2048',
		    min: new vect (-180, -90),
		    cols: 8,
		    rows: 4,
		    cellsize: 45,
		    size: 256
		},
		{
		    url: BASE_DIR + '/tiles/NE1_HR_LC_SR_W_DR/4096',
		    min: new vect (-180, -90),
		    cols: 16,
		    rows: 8,
		    cellsize: 22.5,
		    size: 256
		},
		{
		    url: BASE_DIR + '/tiles/NE1_HR_LC_SR_W_DR/8192',
		    min: new vect (-180, -90),
		    cols: 32,
		    rows: 16,
		    cellsize: 11.25,
		    size: 256
		},
		{
		    url: BASE_DIR + '/tiles/NE1_HR_LC_SR_W_DR/16384',
		    min: new vect (-180, -90),
		    cols: 64,
		    rows: 32,
		    cellsize: 5.625,
		    size: 256
		}
	    ], options);
	}
	else {
	    base = null;
	}
	/*$.ajax ({
	    url: BASE_DIR + 'tiles/base_east.kml',
	    dataType: 'xml',
	    success: function (data) {
		base_east = new KML (data);
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
		console.log (jqXHR, textStatus, errorThrown);
	    }
	});
	
	$.ajax ({
	    url: BASE_DIR + 'tiles/base_west.kml',
	    dataType: 'xml',
	    success: function (data) {
		base_west = new KML (data);
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
		console.log (jqXHR, textStatus, errorThrown);
	    }
	});*/
    };
    set_base ();

    var framebuffer = gl.createFramebuffer ();
    gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer);
    framebuffer.width = this.canvas.width ();
    framebuffer.height = this.canvas.height ();
    
    var tex = gl.createTexture ();
    gl.bindTexture (gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);  
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);  
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, framebuffer.width, framebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    //gl.generateMipmap(gl.TEXTURE_2D);

    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, framebuffer.width, framebuffer.height);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.dirty = true;

    var draw = function () {
	var current_time = new Date ().getTime ();
	var dt = (current_time - old_time) / 1000;
	that.scroller.update (dt);
	if (fps_window.length >= 60)
	    fps_window.splice (0, 1);
	fps_window.push (dt);
	var fps = 0;
	for (var i = 0; i < fps_window.length; i ++) {
	    fps += fps_window[i];
	}
	fps /= fps_window.length;
	$ ('#fps').text (Math.floor (1 / fps));
	old_time = current_time;

	/*if (that.dirty) {

	    gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer);
	    gl.clearColor(0, 0, 0, 1);
	    gl.clear(gl.COLOR_BUFFER_BIT);
	    gl.clearDepth (0.0);
	    for (var i = 0; i < that.scene.length; i ++) {
		that.scene[i].draw (that, dt, true);
	    }
	    gl.bindFramebuffer (gl.FRAMEBUFFER, null);
	    //that.dirty = false;
	}*/
	    
	gl.clearColor(options.background.r, options.background.g, options.background.b, options.background.a);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.clearDepth (0.0);
	if (base) {
	    base.draw (that, dt, false);
	}
	for (var i = 0; i < that.scene.length; i ++) {
	    that.scene[i].draw (that, dt, false);
	}
	that.sel.draw (that, dt);
	//if (!dragging)
	//    that.manager.update (dt);
	
	requestAnimationFrame (draw);
    };

    /*var trigger_event;
    (function () {
	var r = 0;
	var g = 0;
	var b = 0;
	var features = {};
	var layers = {};
	var events = {};
	set_id_color = function (layer, feature, array) {
	    b ++;
	    if (b > 255) {
		b = 0;
		g ++;
	    }
	    if (g > 255) {
		g = 0;
		r ++;
	    }
	    if (r > 255)
		throw "Too many elements to assign unique id";
	    for (var i = feature.start; i < feature.start + feature.count; i ++) {
		array[i * 4] = r / 255;
		array[i * 4 + 1] = g / 255;
		array[i * 4 + 2] = b / 255;
		array[i * 4 + 3] = 1.0;
	    }
	    var key = r + ',' + g + ',' + b;
	    layers[key] = layer; 
	    features[key] = feature; 
	    return key;
	};

	var is_zero = function (pixel) {
	    return (pixel[0] == 0 && pixel[1] == 0 && pixel[2] == 0);
	}
	
	var current = new Uint8Array (4);
	trigger_event = function (pixel) {
	    var same = true;
	    for (var i = 0; i < 4; i ++) {
		if (current[i] != pixel[i])
		    same = false;
	    }
	    if (same) {
		return;
	    }
	    if (!is_zero (current)) {
		var key = current[0] + ',' + current[1] + ',' + current[2];
		var layer = layers[key];
		var feature = features[key];
		if (!('mouseout' in events))
		    return;
		if (!(layer.id in events['mouseout']))
		    return;
		for (var i = 0; i < events['mouseout'][layer.id].length; i ++) {
		    events['mouseout'][layer.id][i] (new LayerSelector ([feature]));
		}
	    }
	    for (var i = 0; i < 4; i ++) {
		current[i] = pixel[i];
	    }
	    if (is_zero (pixel))
		return null;
	    var key = pixel[0] + ',' + pixel[1] + ',' + pixel[2];
	    var layer = layers[key];
	    var feature = features[key];
	    if (!('mouseover' in events))
		return;
	    if (!(layer.id in events['mouseover']))
		return;
	    for (var i = 0; i < events['mouseover'][layer.id].length; i ++) {
		events['mouseover'][layer.id][i] (new LayerSelector ([feature]));
	    }
	};

	bind_event = function (type, layer, func)  {
	    if (!(type in events))
		events[type] = {};
	    if (!(layer in events[type]))
		events[type][layer.id] = [];
	    events[type][layer.id].push (func);
	};
    }) ();*/
    
    this.read_pixel = function (x, y) {
	gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer);
	var pixel = new Uint8Array (4);
	var perX = (x - that.canvas.position ().left)/ that.canvas.width ();
	var perY = (that.canvas.position ().top + that.canvas.height () - y) / that.canvas.height ();
	gl.readPixels (parseInt (perX * framebuffer.width), parseInt (perY * framebuffer.height), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
	gl.bindFramebuffer (gl.FRAMEBUFFER, null);
	return pixel;
    };

    $ (document).mousemove (function (event) {
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
	//console.log ('move', Mouse.x, Mouse.y);
    });

    this.canvas.click (function (event) {
	//that.manager.click (Mouse.x, Mouse.y);
    });
    
    this.canvas.dblclick (function (event) {
    });

    var dragging = false;
    this.canvas.mousedown (function (event) {
	dragging = true;
    });

    this.canvas.mouseup (function (event) {
	dragging = false;
    });

    //var popup = $ ('<div class="popup overlay"></div>');
    this.canvas.mousemove(function (event) {
	if (dragging) {
	    //popup.remove ();
	    //var pos = that.camera.project (new vect (event.clientX, event.clientY));
	}
	else {
	    var p = that.camera.project (new vect (Mouse.x, Mouse.y));
	    $.each (that.scene, function (i, layer) {
		if (layer.update_move)
		    layer.update_move (that, p);
	    });
	    //var pixel = readPixel (event.clientX, event.clientY);
	    //trigger_event (pixel);
	}
    });

    this.canvas.mouseout (function (event) {
	$.each (that.scene, function (i, layer) {
	    if (layer.force_out)
		layer.force_out (that);
	});
    });

    requestAnimationFrame (draw);
    
};