function BaseEngine (selector, options) {
    var engine = this;

    default_model (options, {
	background: new Color (0, 0, 0, 1),
    });

    this.type = 'Engine';
    this.id = new_feature_id ();

    this.canvas = $ ('<canvas></canvas>').attr ('id', 'viewer');
    var gl = null;

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
	$ (window).resize (function (event) {
            engine.resize ();
        });
    }

    this.resize = function () {
	this.canvas.attr ('width', $ (selector).width ());
	this.canvas.attr ('height', $ (selector).height ());	
	gl.viewport (0, 0, this.canvas.width (), this.canvas.height ());
	this.camera.reconfigure ();
	for (var i = 0; i < framebuffers.length; i ++) {
	    framebuffers[i].resize ();
	}
    };

    gl = setContext (this.canvas, DEBUG);
    this.gl = gl;
    gl.viewport (0, 0, this.canvas.width (), this.canvas.height ());

    gl.blendFunc (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable (gl.BLEND);

    this.camera = new Camera (this.canvas, options);
    this.scroller = new Scroller (this);

    this.pxW = 1 / this.canvas.attr ('width');
    this.pxH = 1 / this.canvas.attr ('height');

    this.Renderers = {};

    this.sel = new SelectionBox (this);

    var old_time =  new Date ().getTime ();
    var fps_window = [];

    // Ensures that the main drawing function is called in the scope of the engine
    var draw = (function (engine) {
        return function () {
            engine.draw ();
        };
    }) (this);

    this.shaders = {};

    this.scene = {};

    this.draw = function () {

        // Update the FPS counter
	var current_time = new Date ().getTime ();
	var dt = (current_time - old_time) / 1000;
	this.scroller.update (dt);
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


        // Clear the old color buffer
	gl.clearColor(options.background.r, options.background.g, options.background.b, options.background.a);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.clearDepth (0.0);
        
        $.each (this.scene, function (i, renderers) {
            $.each (renderers, function (j, renderer) {
                renderer.draw (dt);
            });
        });

	requestAnimationFrame (draw);

	this.sel.draw (this, dt);

    };

    $ (document).mousemove (function (event) {
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
    });

    // Start the animation loop
    requestAnimationFrame (draw);
};

function TimeSeries (selector, options) {
    BaseEngine.call (this, selector, options);

    var engine = this;

    this.Renderers = {
        '*': TimeSeriesRenderer
    };

    this.append = function (layer) {
        var renderers = {};
        layer.features ().each (function (f) {
            var key;
            if (f.type in engine.Renderers) {
                key = f.type;
            }
            else {
                key = '*';
            }
            if (!(key in renderers)) {
                renderers[key] = new engine.Renderers[key] (engine, layer);
            }
            
        });
        this.scene[layer.id] = renderers;
        //layer.initialize (this);
        //this.scene.push (layer);
    };

    this.extents = function (width, height) {
	this.camera.extents (width, height);
    };

    this.center = function (x, y) {
	this.camera.position (new vect (x, y));
    };

    this.vcenter = function (v) {
	this.center (v.x, v.y);
    };
};
