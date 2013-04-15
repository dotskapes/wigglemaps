var Engine = function (selector, options) {
    var engine = this;

    default_model (options, {
        background: new Color (0, 0, 0, 1)
    });

    // This helps the style manager know what kind of element is getting styled
    this.type = 'Engine';

    // Every top level element: engines, layers, features, etc has a unqiue id
    // This gets used by the style manager and event manager
    this.id = new_feature_id ();

    // The engine is responsible for creating an inserting the actual 3D canvas
    // The user is responsible for allocating a div and setting the correct size
    // before the engine is instantiated
    this.canvas = $ ('<canvas></canvas>').attr ('id', 'viewer');
    var gl = null;

    if (selector) {
        $ (selector).append (this.canvas);
    }
    else {
        // If the user doesn't specify a div to use, take over the entire page
        // as a top level application
        selector = window;
        $ ('body').append (this.canvas);
    }
    // Take up the entire space in the allocated div
    this.canvas.attr ('width', $ (selector).width ());
    this.canvas.attr ('height', $ (selector).height ());

    // Resizing the canvas requires a few special steps, so listen for the window 
    // to resize. If the user wants a resize without a window change, then they
    // are resposible for calling resize
    $ (window).resize (function (event) {
        engine.resize ();
    });

    var framebuffers = [];
    var framebuffer_stack = [];
    // Allow layers to request a framebuffer from the engine
    // This lets layers do their own multipass rendering without help
    this.framebuffer = function () {
        var framebuffer = gl.createFramebuffer ();
        gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer);
        framebuffer.width = engine.canvas.width ();
        framebuffer.height = engine.canvas.height ();
    
        // The texture the framebuffer outputs to
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

        // A convience object for layers that can activate, deactivate, and read from
        // The framebuffer
        var frame = {
                framebuffer: framebuffer,
                renderbuffer: renderbuffer,
                tex: tex,
                resize: function () {
                    framebuffer.width = engine.canvas.width ();
                    framebuffer.height = engine.canvas.height ();

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
                    gl.viewport (0, 0, engine.canvas.width (), engine.canvas.height ());

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
                }
            };
        framebuffers.push (frame);
        return frame;
    };

    // When a resize event happens, change the viewport of the GL window
    // and set the heights of the framebuffers
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
    // Set the intial viewport size
    gl.viewport (0, 0, this.canvas.width (), this.canvas.height ());

    // Blending
    gl.blendFunc (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable (gl.BLEND);

    // The camera controls the view matrices
    this.camera = new Camera (engine, options);
    // The scroller controls panning and zooming. It talks to
    // the camera API to change the matrices
    this.scroller = new Scroller (this, options);

    // Set the world space width of canvas without changing the aspect ratio
    this.extents = function (width) {
        this.camera.extents (width);
    };

    // Sets the center point of the canvas in world space
    this.center = function (arg0, arg1) {
        if (arg1 === undefined)
            this.camera.position (arg0);
        else
            this.camera.position (new vect (arg0, arg1));
    };

    // How far is one pixel in 0 to 1 shader space
    this.pxW = 1 / this.canvas.attr ('width');
    this.pxH = 1 / this.canvas.attr ('height');

    this.Renderers = {};
    this.Queriers = {};

    this.renderers = {};
    this.views = {};

    this.styles = {};

    this.dirty = true;

    // Engines (and their subcalsses) are responsable for giving the
    // style manager default styles on request. Not specifying a default
    // a style is an error
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

    // See if any features on a layer are contained in a box
    this.search = function (layer, box) {
        return this.queriers[layer.id].boxSearch (box);
    };

    // Set the style of this engine
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

    // There is only one Selection box for each engine. The user can
    // activate as needed
    var sel = new SelectionBox (this);

    // Specify a callback when the selection box is released through mouseup
    this.select = function (func)  {
        sel.select (func);
    };

    // Turn on and off the selection box
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

    // DEBUG: Measure the framerate in a working set
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

    var labels = new TextController(this, options)
    this.label = function(string, options) {
        labels.append(string, options);
    };

    this.draw = function () {
        this.update ();

        // If nothing has been done, don't redraw
        if (this.dirty) {

            // Clear the old color buffer and depth buffer
            gl.clearColor(options.background.r, options.background.g, options.background.b, options.background.a);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.clearDepth (0.0);
            
            $.each (this.scene, function (i, layer) {
                layer.draw (engine);
            });

            labels.draw(engine);

            if (selectEnabled) {
                sel.draw (this);
            }

        }
        
        // Other layers have access to the dirty flag. They set it to true
        // if a redraw is needed
        this.dirty = false;

        requestAnimationFrame (draw);
        
    };

    this.enableZ = function () {
        gl.depthFunc (gl.LEQUAL);
        gl.enable (gl.DEPTH_TEST);
    };

    this.disableZ = function () {
        gl.disable (gl.DEPTH_TEST);
    };

    this.canvas.mouseout (function () {
        EventManager.mouseOver (null);
    });

    // Start the animation loop
    requestAnimationFrame (draw);
};
