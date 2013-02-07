//var set_id_color, bind_event;

var TILE_SERVER = 'http://eland.ecohealthalliance.org/wigglemaps';

var Mouse = {
    x: 0,
    y: 0
};

var blur_shader = null;
var light_shader = null;

function Engine (selector, map, options) {
    if (!options) {
	options = {};
    }
    default_model (options, {
	base: 'default',
	background: new Color (0, 0, 0, 1),
	antialias: true
    });

    this.type = 'Engine';
    this.id = new_feature_id ();

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
	for (var i = 0; i < framebuffers.length; i ++) {
	    framebuffers[i].resize ();
	}
    };

    var gl = setContext (this.canvas, DEBUG);
    this.gl = gl;
    gl.viewport (0, 0, that.canvas.width (), that.canvas.height ());

    gl.blendFunc (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable (gl.BLEND);

    if (!blur_shader) {
	blur_shader = makeProgram (gl, BASE_DIR + 'shaders/blur');
    }
    if (!light_shader) {
	light_shader = makeProgram (gl, BASE_DIR + 'shaders/light');
    }
    var buffers = new Buffers (gl, 6);
    buffers.create ('vert', 2);
    buffers.create ('tex', 2);

    var start = buffers.alloc (6);

    buffers.write ('vert', rectv (new vect (-1, -1), new vect (1, 1)), start, 6);
    buffers.write ('tex', rectv (new vect (0, 0), new vect (1, 1)), start, 6);
    buffers.update ();
    //gl.clearColor(options.background.r, options.background.g, options.background.b, options.background.a);

    this.scene = [];

    this.shaders = {};

    //this.styler = new StyleManager ();
    this.camera = new Camera (this.canvas, options);
    this.scroller = new Scroller (this);

    this.pxW = 1 / this.canvas.attr ('width');
    this.pxH = 1 / this.canvas.attr ('height');

    this.Renderer = {
        'Point': PointRenderer,
        'Polygon': PolygonRenderer,
        'Line': LineRenderer,
    };

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

    var base = null;
    var set_base = function () {
	if (options.base == 'default' || options.base == 'nasa') {
	    var settings = copy (options);
	    copy_to (settings, {
		source: 'file',
		url: TILE_SERVER + '/tiles/nasa_topo_bathy',
		levels: 8,
		size: 256
	    });
	    base = new MultiTileLayer (settings);
	    /*base = new MultiTileLayer ([
		{
		    url: BASE_DIR + 'tiles/nasa_topo_bathy/512',
		    min: new vect (-180, -90),
		    cols: 2,
		    rows: 1,
		    cellsize: 180,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/nasa_topo_bathy/1024',
		    min: new vect (-180, -90),
		    cols: 4,
		    rows: 2,
		    cellsize: 90,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/nasa_topo_bathy/2048',
		    min: new vect (-180, -90),
		    cols: 8,
		    rows: 4,
		    cellsize: 45,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/nasa_topo_bathy/4096',
		    min: new vect (-180, -90),
		    cols: 16,
		    rows: 8,
		    cellsize: 22.5,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/nasa_topo_bathy/8192',
		    min: new vect (-180, -90),
		    cols: 32,
		    rows: 16,
		    cellsize: 11.25,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/nasa_topo_bathy/16384',
		    min: new vect (-180, -90),
		    cols: 64,
		    rows: 32,
		    cellsize: 5.625,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/nasa_topo_bathy/32768',
		    min: new vect (-180, -90),
		    cols: 128,
		    rows: 64,
		    cellsize: 2.8125,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/nasa_topo_bathy/65536',
		    min: new vect (-180, -90),
		    cols: 256,
		    rows: 128,
		    cellsize: 1.40625,
		    size: 256
		}
	    ], options);*/
	}
	else if (options.base == 'ne') {
	    var settings = copy (options);
	    copy_to (settings, {
		source: 'file',
		url: TILE_SERVER + '/tiles/NE1_HR_LC_SR_W_DR',
		levels: 6,
		size: 256
	    });
	    base = new MultiTileLayer (settings);
	    /*base = new MultiTileLayer ([
		{
		    url: BASE_DIR + 'tiles/NE1_HR_LC_SR_W_DR/512',
		    min: new vect (-180, -90),
		    cols: 2,
		    rows: 1,
		    cellsize: 180,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/NE1_HR_LC_SR_W_DR/1024',
		    min: new vect (-180, -90),
		    cols: 4,
		    rows: 2,
		    cellsize: 90,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/NE1_HR_LC_SR_W_DR/2048',
		    min: new vect (-180, -90),
		    cols: 8,
		    rows: 4,
		    cellsize: 45,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/NE1_HR_LC_SR_W_DR/4096',
		    min: new vect (-180, -90),
		    cols: 16,
		    rows: 8,
		    cellsize: 22.5,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/NE1_HR_LC_SR_W_DR/8192',
		    min: new vect (-180, -90),
		    cols: 32,
		    rows: 16,
		    cellsize: 11.25,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/NE1_HR_LC_SR_W_DR/16384',
		    min: new vect (-180, -90),
		    cols: 64,
		    rows: 32,
		    cellsize: 5.625,
		    size: 256
		}
	    ], options);*/
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
        if (base)
            base.initialize (that);
    };
    set_base ();

    this.enable_z = function () {
	gl.depthFunc (gl.LEQUAL);
	gl.enable (gl.DEPTH_TEST);
    };

    this.disable_z = function () {
	gl.disable (gl.DEPTH_TEST);
    }

    var framebuffers = [];
    var framebuffer_stack = [null];
    this.framebuffer = function () {
	var framebuffer = gl.createFramebuffer ();
	gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer);
	framebuffer.width = that.canvas.width ();
	framebuffer.height = that.canvas.height ();
    
	var tex = gl.createTexture ();
	gl.bindTexture (gl.TEXTURE_2D, tex);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);  
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);  
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, framebuffer.width, framebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	
	var renderbuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, framebuffer.width, framebuffer.height);

	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
	
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	var frame = {
	    framebuffer: framebuffer,
	    renderbuffer: renderbuffer,
	    tex: tex,
	    resize: function () {
		framebuffer.width = that.canvas.width ();
		framebuffer.height = that.canvas.height ();

		gl.bindTexture (gl.TEXTURE_2D, tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, framebuffer.width, framebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, framebuffer.width, framebuffer.height);

		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	    },
	    activate: function (options) {
		if (!options)
		    options = {};
		default_model (options, {
		    blend: true,
		    clear: true
		});

		framebuffer_stack.push (framebuffer);
		
		if (!options.blend)
		    gl.disable (gl.BLEND);
		
		gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer);
		gl.viewport (0, 0, that.canvas.width (), that.canvas.height ());

		if (options.clear) {

		    gl.clearColor (0, 0, 0, 0);
		    gl.clear(gl.COLOR_BUFFER_BIT);
		    gl.clearDepth (0.0);
		}
	    },
	    deactivate: function () {
		var current = framebuffer_stack.pop ();
		var last = framebuffer_stack[framebuffer_stack.length - 1];
		if (current != framebuffer)
		    throw "Non-nested use of framebuffers";
		gl.bindFramebuffer (gl.FRAMEBUFFER, last);
		// THIS WILL CAUSE PROBLEMS - SAVE LAST VALUE OF BLEND
		gl.enable (gl.BLEND);
	    },
	};
	framebuffers.push (frame);
	return frame;
    };

    var screen_buffer = this.framebuffer ();
    var blur_hor = this.framebuffer ();

    this.draw_blur = function (tex) {
	gl.useProgram (blur_shader);
	
	blur_hor.activate ({
	    blend: false
	});
	
	blur_shader.data ('pos', buffers.get ('vert'))
	blur_shader.data ('tex_in', buffers.get ('tex'))
	blur_shader.data ('sampler', tex)
	blur_shader.data ('width', that.canvas.width  ());
	blur_shader.data ('height', that.canvas.height ())
	//blur_shader.data ('kernel', [2 * Math.sqrt (2), 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
	blur_shader.data ('hor', true);
	
	gl.drawArrays (gl.TRIANGLES, 0, buffers.count ());
	
	blur_hor.deactivate ();

	blur_shader.data ('pos', buffers.get ('vert'));
	blur_shader.data ('tex_in', buffers.get ('tex'));
	blur_shader.data ('sampler', blur_hor.tex);
	blur_shader.data ('width', that.canvas.width  ());
	blur_shader.data ('height', that.canvas.height ());
	//blur_shader.data ('kernel', [2 * Math.sqrt (2), 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
	blur_shader.data ('hor', false);
	
	gl.drawArrays (gl.TRIANGLES, 0, buffers.count ());
    };

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
	    
	gl.clearColor(options.background.r, options.background.g, options.background.b, options.background.a);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.clearDepth (0.0);

	var shade_ready = false;
	if (that.shade)
	    shade_ready = that.shade.ready ();

	if (shade_ready) {
	    screen_buffer.activate ();
	}

	if (base) {
	    base.draw (that, dt);
	}

	for (var i = 0; i < that.scene.length; i ++) {
	    that.scene[i].draw (that, dt, false);
	}

	that.sel.draw (that, dt);

	
	requestAnimationFrame (draw);
    };

    this.read_pixel = function (x, y) {
	gl.bindFramebuffer (gl.FRAMEBUFFER, that.framebuffer);
	var pixel = new Uint8Array (4);
	var perX = (x - that.canvas.position ().left)/ that.canvas.width ();
	var perY = (that.canvas.position ().top + that.canvas.height () - y) / that.canvas.height ();
	gl.readPixels (parseInt (perX * that.framebuffer.width), parseInt (perY * that.framebuffer.height), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
	gl.bindFramebuffer (gl.FRAMEBUFFER, null);
	return pixel;
    };

    $ (document).mousemove (function (event) {
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
    });

    this.canvas.click (function (event) {
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

    this.canvas.mousemove(function (event) {
	if (dragging) {

	}
	else {
            var p = new vect (Mouse.x, Mouse.y);
	    $.each (that.scene, function (i, layer) {
		if (layer.update_move)
		    layer.update_move (that, p);
	    });
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
