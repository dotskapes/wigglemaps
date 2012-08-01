/*var grid_shader = null;

function AsciiGrid (data, options) {
    if (!grid_shader) {
	grid_shader = makeProgram (BASE_DIR + 'shaders/grid');
    }
    var no_color = new Color (0, 0, 0, 0);
    var rows = data.split ('\n');
    var meta = rows.splice (0, 6);
    this.cols = parseInt (meta[0].slice (14));
    this.rows = parseInt (meta[1].slice (14));
    this.xllcorner = parseFloat (meta[2].slice (14));
    this.yllcorner = parseFloat (meta[3].slice (14));
    this.cellsize =  parseFloat (meta[4].slice (14));
    this.nodata_value = meta[5].slice (14);
    var tex_data = new Uint8Array (this.cols * this.rows * 4);
    var count = 0;
    var copy_color = function (count, index) {
	var c;
	if (index < 0)
	    c = no_color;
	else
	    c = options.ramp[index];
	if (!c)
	    console.log ('trouble ahead');
	tex_data[count * 4] = parseInt (c.r * 255);
	tex_data[count * 4 + 1] = parseInt (c.g * 255);
	tex_data[count * 4 + 2] = parseInt (c.b * 255);
	tex_data[count * 4 + 3] = parseInt (c.a * 255);
    };

    var max_val = -Infinity;
    var min_val = Infinity;
    for (var i = 0; i < this.rows; i ++) {
	rows[i] = rows[i].split (' ');
	for (var j = 0; j < this.cols; j ++) {
	    if (rows[i][j] == this.nodata_value){
		rows[i][j] = NaN;
	    }
	    else {
		rows[i][j] = parseFloat (rows[i][j]);
		if (rows[i][j] > max_val)
		    max_val = rows[i][j];
		if (rows[i][j] < min_val)
		    min_val = rows[i][j];
	    }
	}
    }
    var tol = (max_val - min_val) * .05;
    var min = min_val - tol;
    var max = max_val + tol;
    for (var i = this.rows - 1; i >= 0; i --) {
	for (var j = 0; j < this.cols; j ++) {
	    if (isNaN (rows[i][j]) || rows[i][j] == 0) {
		copy_color (count, 0);
	    }
	    else {
		//var mid = max_val / 32;
		//var mid = 0.0;
		//var per = (rows[i][j] - mid) / (max_val - mid + (max_val - mid) * .01);
		//copy_color (count, Math.floor (per) * ramp.length);
		//copy_color (count, Math.floor ((Math.log (rows[i][j]) / Math.log (max_val + 1)) * ramp.length));
		var val = (rows[i][j] - min) / (max - min);
		copy_color (count, Math.floor (val * (options.ramp.length - 1) + 1));
	    }
	    count ++;
	}
    }
    var tex = gl.createTexture ();
    gl.bindTexture (gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);  
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);  
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.cols, this.rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, tex_data);
    gl.bindTexture (gl.TEXTURE_2D, null);

    var buffers = new Buffers (6);
    buffers.create ('vert', 2);
    buffers.create ('tex', 2);

    var min = new vect (this.xllcorner, this.yllcorner);
    var max = new vect (this.xllcorner + this.cols * this.cellsize, this.yllcorner + this.rows * this.cellsize);

    var tmin = new vect (0, 0);
    var tmax = new vect (1, 1);

    var start = buffers.alloc (6);

    buffers.write ('vert', rectv (min, max), start, 6);
    buffers.write ('tex', rectv (tmin, tmax), start, 6);

    this.draw = function (engine, dt, select) {
	if (select)
	    return;

	buffers.update ();

	gl.useProgram (grid_shader);

	grid_shader.data ('screen', engine.camera.mat3);
	grid_shader.data ('pos', buffers.get ('vert'));
	grid_shader.data ('tex_in', buffers.get ('tex'));

	grid_shader.data ('sampler', tex);

	var size = vect.sub (engine.camera.screen (max), engine.camera.screen (min));
	grid_shader.data ('width', size.x);
	grid_shader.data ('height', -size.y);

	grid_shader.data ('rows', this.rows);
	grid_shader.data ('cols', this.cols);

	grid_shader.data ('blur', options.blur);

	gl.drawArrays (gl.TRIANGLES, 0, buffers.count ());
    };
};*/

function AsciiGrid (data, options) {
    var vals = data.split ('\n');
    var meta = vals.splice (0, 6);
    var cols = parseInt (meta[0].slice (14));
    var rows = parseInt (meta[1].slice (14));
    var xllcorner = parseFloat (meta[2].slice (14));
    var yllcorner = parseFloat (meta[3].slice (14));
    var cellsize =  parseFloat (meta[4].slice (14));
    var nodata_value = meta[5].slice (14);
    var max_val = -Infinity;
    var min_val = Infinity;

    var index = function (i, j) {
	return cols * i + j;
    };

    var settings = {};
    for (key in options)
	settings[key] = options[key];
    settings.lower = new vect (xllcorner, yllcorner);
    settings.upper = new vect (xllcorner + cellsize * cols, yllcorner + cellsize * rows);
    settings.rows = rows;
    settings.cols = cols;
    
    var grid = new Grid (settings);

    for (var i = 0; i < rows; i ++) {
	var r = vals[i].split (' ');
	for (var j = 0; j < cols; j ++) {
	    if (r[j] == nodata_value) {
		grid.set (rows - 1 - i, j, NaN);
	    }
	    else {
		grid.set (rows - 1 - i, j, parseFloat (r[j]));
	    }
	}
    }
    return grid;
};