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

    var framebuffers = [];

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

    this.camera = new Camera (engine, options);
    this.scroller = new Scroller (this, options);

    this.extents = function (width) {
	this.camera.extents (width);
    };

    this.center = function (arg0, arg1) {
        if (arg1 === undefined)
	    this.camera.position (arg0);
        else
	    this.camera.position (new vect (arg0, arg1));
    };

    this.pxW = 1 / this.canvas.attr ('width');
    this.pxH = 1 / this.canvas.attr ('height');

    this.Renderers = {};
    this.Queriers = {};

    this.renderers = {};
    this.views = {};

    this.styles = {};

    this.dirty = true;

    this.defaultStyle = function (f_type, key) {
        var value;
        if (f_type in this.styles) {
            value = this.styles[f_type][key];
        }
        if (value === null || value === undefined) {
            value = this.styles['default'][key];
        }
        if (value === null || value === undefined) {
            return null;
        }
        else {
            return value;
        }
        
    };

    EventManager.manage (this);

    this.search = function (layer, box) {
        return this.queriers[layer.id].boxSearch (box);
    };

    this.style = function (object, key, value) {
        if (this.styles[object.id] === undefined)
            this.styles[object.id] = {};
        if (value === undefined) {
            if (this.styles[object.id][key] !== undefined)
                return this.styles[object.id][key];
            else
                return null;
        }
        else {
            this.styles[object.id][key] = value;

            // If initialized, update rendering property
            if (object.id in this.views) {
                this.views[object.id].update (key);
            }
            else if (object.id in this.renderers) {
                $.each (this.renderers[object.id], function (i, renderer) {
                    renderer.update ();
                });
            }
        } 
    };

    var sel = new SelectionBox (this);

    this.select = function (func)  {
	sel.select (func);
    };

    var selectEnabled = false;
    this.enableSelect = function () {
	this.scroller.disable ();
	sel.enable ();
        selectEnabled = true;
    };
    this.disableSelect = function () {
	this.scroller.enable ();
	sel.disable ();
        selectEnabled = false;
    };

    var old_time =  new Date ().getTime ();
    var fps_window = [];

    // Ensures that the main drawing function is called in the scope of the engine
    var draw = (function (engine) {
        return function () {
            engine.draw ();
        };
    }) (this);

    this.shaders = {};

    this.scene = [];
    this.queriers = {};

    var lastDraw = 0;

    var lastMouse = 0;

    // Updates the elemenets of the engine, including styles and mouse events
    this.update = function () {
        // Update the FPS counter
	var current_time = new Date ().getTime ();
	var dt = (current_time - old_time) / 1000;

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

        // Update the pan and zoom controller
	this.scroller.update (dt);

        // Update the mouse event
        if (Mouse.lastMove > lastMouse) {
            var mouse = vect (Mouse.x, Mouse.y);
            var oneOver = false;
            $.each (this.queriers, function (layerId, querier) {
                var feature = querier.pointSearch (mouse);
                if (feature) {
                    EventManager.mouseOver (feature);
                    oneOver = true;
                    return false;
                }
            });
            if (!oneOver) {
                EventManager.mouseOver (null);
            }
        }
        lastMouse = Mouse.lastMove;

        // Update each renderer
        $.each (this.scene, function (i, layer) {
            if (layer.update)
                layer.update (engine, dt);
        });

    };

    this.draw = function () {
        this.update ();

        // If nothing has been done, don't redraw
        if (this.dirty) {

            // Clear the old color buffer
	    gl.clearColor(options.background.r, options.background.g, options.background.b, options.background.a);
	    gl.clear(gl.COLOR_BUFFER_BIT);
	    gl.clearDepth (0.0);
            
            $.each (this.scene, function (i, layer) {
                layer.draw (engine);
            });

            if (selectEnabled) {
	        sel.draw (this);
            }

        }

        this.dirty = false;

	requestAnimationFrame (draw);
        
    };

    this.enableZ = function () {
	gl.depthFunc (gl.LEQUAL);
	gl.enable (gl.DEPTH_TEST);
    };

    this.disableZ = function () {
	gl.disable (gl.DEPTH_TEST);
    }

    this.canvas.mouseout (function () {
        EventManager.mouseOver (null);
    });

    // Start the animation loop
    requestAnimationFrame (draw);
};