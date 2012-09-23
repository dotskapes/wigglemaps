var grid_shader = null;

function Grid (options) {
    if (!grid_shader) {
	grid_shader = makeProgram (BASE_DIR + 'shaders/grid');
    }
    if (!options)
	options = {};
    if (!options.style)
	options.style = {};
    var lower = options.lower;
    var upper = options.upper;
    var rows = options.rows;
    var cols = options.cols;

    var xres = (upper.x - lower.x) / cols;
    var yres = (upper.y - lower.y) / rows;

    var data = new Float32Array (rows * cols);

    var tex_data = new Uint8Array (cols * rows * 4);

    var dirty = false;
    var write_color = function (i, c) {
	//var c = options.ramp[j];
	tex_data[i * 4] = parseInt (c.r * 255);
	tex_data[i * 4 + 1] = parseInt (c.g * 255);
	tex_data[i * 4 + 2] = parseInt (c.b * 255);
	tex_data[i * 4 + 3] = parseInt (c.a * 255);
    };

    var buffers = new Buffers (6);
    buffers.create ('vert', 2);
    buffers.create ('screen', 2);
    buffers.create ('tex', 2);

    var min = new vect (lower.x, lower.y);
    var max = new vect (upper.x, upper.y);

    var tmin = new vect (0, 0);
    var tmax = new vect (1, 1);

    var start = buffers.alloc (6);

    buffers.write ('vert', rectv (min, max), start, 6);
    buffers.write ('screen', rectv (new vect (-1, -1), new vect (1, 1)), start, 6);
    buffers.write ('tex', rectv (tmin, tmax), start, 6);

    var tex = gl.createTexture ();
    gl.bindTexture (gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);  
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);  
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture (gl.TEXTURE_2D, null);

    var index = function (i, j) {
	return cols * i + j;
    };

    this.lower = function () {
	return lower.clone ();
    };

    this.upper = function () {
	return upper.clone ();
    };

    this.rows = function () {
	return rows;
    };

    this.cols = function () {
	return cols;
    };

    this.centroid = function (i, j) {
	return new vect (lower.x + xres * j + xres / 2, lower.y + yres * i + yres / 2);
    };

    this.get = function (i, j) {
	return data[index (i, j)];
    };

    var max_val = -Infinity;
    var min_val = Infinity;
    var quantiles = {};

    /*this.bounds = function () {
	return {
	    min: min_val,
	    max: max_val
	};
    };*/

    this.qunatiles = function (size, sort) {
	if (!sort) {
	    sort = function (a, b) {
		return a - b;
	    };
	}
	var points = []
	for (var i = 0; i < data.length; i ++) {
	    points.push (data[i]);
	};
	points.sort (sort);
	var quantiles = [-Infinity];
	for (var i = 1; i < size; i ++) {
	    var b = parseInt (inc * i)
	    quantiles.push (points[b]);
	}
	quantiles.push (Infinity);
	return quantiles;
    };

    this.set = function (i, j, val) {
	if (i >= rows || j >= cols)
	    throw "Index Out of Bounds";
	var k = index (i, j);
	data[k] = val;
	dirty = true;
	/*if (val > max_val)
	    max_val = val;
	if (val < min_val)
	    min_val = val;
	dirty = true;*/
	//write_color (k, options.map (val));
    };

    this.raw_set = function (k, val) {
	if (k >= rows * cols)
	    throw "Index Out of Bounds: " + k;
	data[k] = val;
	dirty = true;
    };

    this.clear = function (val) {
	for (var i = 0; i < rows * cols; i ++) {
	    data[i] = val;
	}
    };

    var framebuffer = null;

    this.draw = function (engine, dt) {
	if (!framebuffer)
	    framebuffer = engine.framebuffer ();
	buffers.update ();
	if (dirty) {
	    max_val = -Infinity;
	    min_val = Infinity;
	    for (var i = 0; i < rows * cols; i ++) {
		var val = data[i];
		if (val > max_val)
		    max_val = val;
		if (val < min_val)
		    min_val = val;
	    }
	    for (var i = 0; i < rows * cols; i ++) {
		write_color (i, options.map (min_val, max_val, data[i]));
	    }
	    gl.bindTexture (gl.TEXTURE_2D, tex);
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cols, rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, tex_data);
	    gl.bindTexture (gl.TEXTURE_2D, null);
	    dirty = false;
	}
	
	if (options.style.antialias) {
	    framebuffer.activate ({
		blend: false
	    });
	}

	gl.useProgram (grid_shader);
	    
	grid_shader.data ('screen', engine.camera.mat3);
	grid_shader.data ('pos', buffers.get ('vert'));
	
	grid_shader.data ('tex_in', buffers.get ('tex'));
	    
	grid_shader.data ('sampler', tex);
	
	var size = vect.sub (engine.camera.screen (max), engine.camera.screen (min));
	grid_shader.data ('width', size.x);
	grid_shader.data ('height', -size.y);
	
	grid_shader.data ('rows', rows);
	grid_shader.data ('cols', cols);
	
	grid_shader.data ('blur', options.blur);
	
	gl.drawArrays (gl.TRIANGLES, 0, buffers.count ());

	if (options.style.antialias) {
	    framebuffer.deactivate ();
	    engine.draw_blur (framebuffer.tex);
	}

	//engine.post_draw (options.style);

	/*var do_draw = function (use_mat, image, hor) {
	    gl.useProgram (grid_shader);
	    
	    grid_shader.data ('screen', engine.camera.mat3);
	    if (use_mat) 
		grid_shader.data ('pos', buffers.get ('vert'));
	    else
		grid_shader.data ('pos', buffers.get ('screen'));
	    grid_shader.data ('use_mat', use_mat);
	    grid_shader.data ('tex_in', buffers.get ('tex'));
	    
	    grid_shader.data ('sampler', image);
	    
	    var size = vect.sub (engine.camera.screen (max), engine.camera.screen (min));
	    grid_shader.data ('width', size.x);
	    grid_shader.data ('height', -size.y);
	  
	    grid_shader.data ('rows', rows);
	    grid_shader.data ('cols', cols);
	    
	    grid_shader.data ('blur', options.blur);
	    grid_shader.data ('hor', hor);
	    
	    gl.drawArrays (gl.TRIANGLES, 0, buffers.count ());
	};

	if (options.blur) {
	    //gl.bindFramebuffer (gl.FRAMEBUFFER, engine.framebuffer);
	    //gl.clearColor (0, 0, 0, 0);
	    //gl.clear(gl.COLOR_BUFFER_BIT);
	    //gl.clearDepth (0.0);
	    //do_draw (true, tex, true);
	    //gl.bindFramebuffer (gl.FRAMEBUFFER, null);
	    //do_draw (false, engine.tex_canvas, false);
	    //do_draw (true, tex, true)
	}
	else {
	    //do_draw (tex);
	}*/
    };
};