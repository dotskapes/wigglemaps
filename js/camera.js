function Camera (canvas, options) {
    var camera = this;
    if (!options)
        options = {};

    if (options.size && options.center) {
        var world_half = options.size.clone ().scale (.5);
        options.min = vect.sub (options.center, world_half);
        options.max = vect.add (options.center, world_half);
    }

    default_model (options, {
        min: new vect (0, 0),
        max: new vect (1, 1)
    });

    var world_max = options.max;
    var world_min = options.min;

    this.worldToPx = new Float32Array (9);
    this.pxToScreen = new Float32Array (9);
    this.worldToScreen = new Float32Array (9);

    // Legacy access for backwards compatibility
    this.mat3 = this.worldToScreen;

    this.reconfigure = function () {
        var width = canvas.width ();
        var height = canvas.height ();
        var world_range = vect.sub (world_max, world_min);

        var setupWorld = function () {
            camera.worldToPx[0] = width / world_range.x;
            camera.worldToPx[1] = 0;
            camera.worldToPx[2] = 0;
            camera.worldToPx[3] = 0;
            camera.worldToPx[4] = height / world_range.y;
            camera.worldToPx[5] = 0;
            camera.worldToPx[6] = -(world_min.x * width) / world_range.x;
            camera.worldToPx[7] = -(world_min.y * height) / world_range.y;
            camera.worldToPx[8] = 1;
        };

        var setupPx = function () {
            camera.pxToScreen[0] = 2.0 / width;
            camera.pxToScreen[1] = 0;
            camera.pxToScreen[2] = 0;
            camera.pxToScreen[3] = 0;
            camera.pxToScreen[4] = 2.0 / height;
            camera.pxToScreen[5] = 0;
            camera.pxToScreen[6] = -1;
            camera.pxToScreen[7] = -1;
            camera.pxToScreen[8] = 1;
        };

        var setupProj = function () {
            camera.worldToScreen[0] = 2.0 / world_range.x;
            camera.worldToScreen[1] = 0;
            camera.worldToScreen[2] = 0;
            camera.worldToScreen[3] = 0;
            camera.worldToScreen[4] = 2.0 / world_range.y;
            camera.worldToScreen[5] = 0;
            camera.worldToScreen[6] = -world_min.x / world_range.x - 1;
            camera.worldToScreen[7] = -world_min.y / world_range.y - 1;
            camera.worldToScreen[8] = 1;
        };

        setupWorld ();
        setupPx ();
        setupProj ();

    };

    this.reconfigure ();

    canvas.resize (function(event) {
        camera.reconfigure ();
    });
};

/*function Camera (canvas, options) {
    if (!options)
	options = {};

    var ratio = canvas.width () / canvas.height (); 

    if (!('center' in options))
	options.center = new vect (0, 0);
    if (!('extents' in options))
	options.extents = 180.0;
    if (!('v_extents' in options))
	options.v_extents = options.extents / ratio;

    this.mat3 = new Float32Array (9);
    //this.mat3[0] = 2.0 / canvas.width ();
    //this.mat3[5] = 2.0 / canvas.height ();

    this.mat3[0] = 2.0 / options.extents;
    this.mat3[4] = 2.0 / options.v_extents;
    this.mat3[8] = 1.0;
    
    this.mat3[6] = 0.0;
    this.mat3[7] = 0.0;
    
    this.level = 1.0;

    this.project = function (v) {
	var c = new vect (
            2.0 * (v.x - canvas.offset ().left) / canvas.width () - 1.0,
		-(2.0 * (v.y - canvas.offset ().top) / canvas.height () - 1.0));
        c.x = c.x / this.mat3[0] - this.mat3[6] / this.mat3[0];
        c.y = c.y / this.mat3[4] - this.mat3[7] / this.mat3[4];
	return c;
    };
    
    this.screen = function (v) {
        var c = new vect (
	    v.x * this.mat3[0] + this.mat3[6],
            v.y * this.mat3[4] + this.mat3[7]);
        c.x = canvas.offset ().left + canvas.width () * (c.x + 1.0) / 2.0;
        c.y = canvas.offset ().top + canvas.height () * (-c.y + 1.0) / 2.0;
        return c;
    };

    this.percent = function (v) {
	return new vect (
	    2 * ((v.x - canvas.offset ().left) / canvas.width ()) - 1,
	    -(2 * ((v.y - canvas.offset ().top) / canvas.height ()) - 1));
    };

    this.pixel = function (v) {
	return new vect (canvas.offset ().left + ((v.x + 1) / 2) * canvas.width (),
			 canvas.offset ().top + ((-v.y + 1) / 2) * canvas.height ());
    };
    
    this.move = function (v) {
        this.mat3[6] -= v.x * this.mat3[0];
        this.mat3[7] -= v.y * this.mat3[4];
    };
    
    this.position = function (v) {
	if (!v) {
	    return new vect (-this.mat3[6] / this.mat3[0], -this.mat3[7] / this.mat3[4]);
	}
        this.mat3[6] = -v.x * this.mat3[0];
        this.mat3[7] = -v.y * this.mat3[4];		
    };
    this.position (options.center);

    this.extents = function (width, height) {
	options.extents = width;
        if (!height)
            options.v_extents = options.extents / ratio;
        else
            options.v_extents = height;

	var pos = this.position ();
	this.level = 1.0;

	this.mat3[0] = 2.0 / options.extents;
	this.mat3[4] = 2.0 / options.v_extents;

	this.position (pos);
    };
    
    this.zoom = function (scale) {
	var pos = new vect (this.mat3[6] / this.mat3[0], this.mat3[7] / this.mat3[4]);
	this.mat3[0] *= scale;
	this.mat3[4] *= scale;
	this.mat3[6] = pos.x * this.mat3[0];
	this.mat3[7] = pos.y * this.mat3[4];
	this.level *= scale;
    };
    
    this.reset = function () {
	this.zoom (1.0 / this.level);
    };

    this.reconfigure = function () {
	var p = this.position ();
	this.mat3[4] /= ratio;
	ratio = canvas.width () / canvas.height (); 
	this.mat3[4] *= ratio;
	this.position (p);
    };
};*/
