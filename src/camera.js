function Camera (canvas, options) {
    var camera = this;
    if (!options)
        options = {};

    if (options.width && !options.height) {
        options.height = options.width;
    }
    else if (!options.width && options.height) {
        options.width = options.height;
    }

    var aspect = canvas.height () / canvas.width (); 

    if (options.min) {
        options.center = vect.add (options.min, new vect (options.width, options.height * aspect).scale (.5));
    }
    else if (!options.center) {
        options.center = new vect (0, 0);
    }


    // These four parameters (along with the viewport aspect ratio) completely determine the
    // transformation matrices.
    var worldWidth = options.width;
    var worldHeight = options.height
    var worldRatio = options.height / options.width;
    var center = options.center.clone ();
    var level = 1.0;

    // The three transformation matrices: One that goes from world space to pixel space
    // One that goes from pixel space to screen space, and one that does both for efficency
    this.worldToPx = new Float32Array (9);
    this.pxToScreen = new Float32Array (9);
    this.worldToScreen = new Float32Array (9);

    // Deprecated: Legacy access for backwards compatibility
    this.mat3 = this.worldToScreen;


    // Rebuild the matrices. Needs to be called everytime any of the above mentioned parameters
    // Changes
    this.reconfigure = function () {

        var aspectRatio = canvas.height () / canvas.width (); 
        var worldRatio = worldHeight / worldWidth;

        //var half_size = vect.sub (options.max, options.min).scale (.5).scale (1.0 / level);

        var half_size = new vect (worldWidth / level, (worldWidth * worldRatio * aspectRatio) / level).scale (.5);

        var world_max = vect.add (center, half_size);
        var world_min = vect.sub (center, half_size);
        
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
            camera.worldToScreen[6] = -2.0 * world_min.x / world_range.x - 1;
            camera.worldToScreen[7] = -2.0 * world_min.y / world_range.y - 1;
            camera.worldToScreen[8] = 1;
        };

        setupWorld ();
        setupPx ();
        setupProj ();

    };

    // Initial call to setup the matrices
    this.reconfigure ();

    // Coverts a screen coordinate (in pixels) to a point in the world
    this.project = function (v) {
	var c = new vect (
            2.0 * (v.x - canvas.offset ().left) / canvas.width () - 1.0,
		-(2.0 * (v.y - canvas.offset ().top) / canvas.height () - 1.0));
        c.x = c.x / this.mat3[0] - this.mat3[6] / this.mat3[0];
        c.y = c.y / this.mat3[4] - this.mat3[7] / this.mat3[4];
	return c;
    };
    
    // Converts a world coordinate to a screen coordinate
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

    // Moves the center point
    this.move = function (v) {
        center.add (v);
        this.reconfigure ();
    };

    // Zooms the canvas
    this.zoom = function (scale) {
	level *= scale;
        this.reconfigure ();
    };

    // Sets the center point
    // Variable length arguments:
    // 0 for the getter, 1 to send a vector, two to send scalars
    this.position = function (arg0, arg1) {
        if (arg0 === undefined)
            return center.clone ();
        else if (arg1 === undefined)
            center = arg0.clone ();
        else
            center = new vect (arg0, arg1);
        this.reconfigure ();
    };

    // Reset the zoom level to the original
    this.reset = function () {
        level = 1.0;
        this.reconfigure ();
    };

    // Listens for aspect ratio changes
    canvas.resize (function(event) {
        camera.reconfigure ();
    });

    // Scales both the width and height to a new size at zoom level 1
    // Resets the zoom level to prevent unexpected size effects
    this.extents = function (newWidth) {
        worldWidth = newWidth;
        worldHeight = newWidth * worldRatio;
        level = 1.0;
        this.reconfigure ();
    };
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
