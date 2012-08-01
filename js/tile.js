var TIMEOUT = 10000;

function MultiTileLayer (levels, options) {
    if (!options)
	options = {};
    var layers = [];
    for (var i = 0; i < levels.length; i ++) {
	var level = levels[i];
	var layer = new TileLayer (level.url, level.min, level.rows, level.cols, level.cellsize, options);
	layers.push (layer);
    }
    layers[0].noexpire (true);

    this.update = function (engine, p) {

    };
    
    this.draw = function (engine, dt, select) {
	if (select)
	    return false;
	
	var min = Infinity
	var current = layers[0];
	
	for (var i  = 0; i < layers.length; i ++) {
	    //var ratio = Math.abs (layers[i].size ().x / (levels[i].cols * levels[i].size));
	    var ratio = (levels[i].size * levels[i].cols) / layers[i].size (engine).x;
	    if (ratio < 1)
		ratio = 1 / ratio;
	    //ratio -= 1;
	    if (ratio < min) {
		min = ratio;
		current = layers[i];
	    }
	}
	if (current != layers[0])
	    layers[0].draw (engine, dt, select);
	current.draw (engine, dt, select);
	$.each (layers, function (i, layer) {
	    layer.cull ();
	});
    };
};

var tile_shader = null;
function TileLayer (url, min, rows, cols, cellsize, options) {
    if (!options)
	options = {};
    if (!options.desaturate)
	options.desaturate = 0.0;
    if (!options.darken)
	options.darken = 0.0;
    if (!options.hue)
	options.hue = 0.0;
    if (!options.hue_color)
	options.hue_color = fcolor (0.0, 0.0, 0.0, 1.0);

    if (!tile_shader)
	tile_shader = makeProgram (BASE_DIR + 'shaders/tile');

    var buffers = new Buffers (6 * rows * cols);
    buffers.create ('vert', 2);
    buffers.create ('tex', 2);
    buffers.create ('lookup', 1);

    var tile_ids = {};
    var tiles = [];
    for (var i = 0; i < cols; i ++) {
	tiles.push ([]);
	for (var j = 0; j < rows; j ++) {
	    var rmin = new vect (min.x + i * cellsize, min.y + j * cellsize);
	    var rmax = new vect (min.x + (i + 1) * cellsize, min.y + (j + 1) * cellsize);
	    //var start = buffers.alloc (6);
	    var tile = {
		vert: rectv (rmin, rmax),
		tex: null,
		i: i,
		j: j,
		id: (i + cols * j),
		ready: false
	    };
	    tiles[i].push (tile);
	    tile_ids[tile.id] = tile;
	    
	    //buffers.write ('vert', rectv (rmin, rmax), start, 6);
	    //buffers.write ('tex', rectv (new vect (0, 0), new vect (1, 1)), start, 6);
	}
    }
    buffers.alloc (6 * 6);

    this.size = function (engine) {
	var smin = engine.camera.screen (min);
	var smax = engine.camera.screen (vect.add (min, new vect (cellsize * cols, cellsize * rows)));
	var v = vect.sub (smax, smin);
	v.y = Math.abs (v.y);
	return v;
    }

    var noexpire = false;
    this.noexpire = function (flag) {
	noexpire = flag;
    };

    this.cull = function () {
	if (!noexpire) {
	    var time = new Date().getTime ();
	    for (var key in current) {
		if (time - current[key] > TIMEOUT) {
		    tile_ids[key].tex = null;
		    tile_ids[key].ready = false;
		    delete current[key];
		}
	    }
	}	
    };

    var current = {};
   
    this.draw = function (engine, dt, select) {
	if (select)
	    return;

	var count = 0;

	gl.useProgram (tile_shader);
	tile_shader.data ('screen', engine.camera.mat3);

	var do_draw = function () {
	    buffers.update ();

	    tile_shader.data ('pos', buffers.get ('vert'));
	    tile_shader.data ('tex_in', buffers.get ('tex'));
	    tile_shader.data ('lookup_in', buffers.get ('lookup'));
	    tile_shader.data ('desaturate', options.desaturate);
	    tile_shader.data ('darken', options.darken);
	    tile_shader.data ('hue', options.hue);
	    tile_shader.data ('hue_color', options.hue_color.array);
	   
	    gl.drawArrays (gl.TRIANGLES, 0, count * 6);
	};


	var smin = engine.camera.project (new vect (engine.canvas.position ().left, engine.canvas.position ().top + engine.canvas.height ()));
	var smax = engine.camera.project (new vect (engine.canvas.position ().left + engine.canvas.width (), engine.canvas.position ().top));
	var min_col = Math.floor ((smin.x - min.x) / cellsize);
	var max_col = Math.ceil ((smax.x - min.x) / cellsize);

	var min_row = Math.floor ((smin.y - min.y) / cellsize);
	var max_row = Math.ceil ((smax.y - min.y) / cellsize);
	
	var time = new Date().getTime ();
	for (var i = Math.max (0, min_col); i < Math.min (cols, max_col); i ++) {
	    for (var j = Math.max (0, min_row); j < Math.min (rows, max_row); j ++) {
		buffers.write ('vert', tiles[i][j].vert, count * 6, 6);
		//buffers.write ('tex', rectv (new vect (count / 6, 0), new vect ((count + 1) / 6, 1)), count * 6, 6);
		buffers.write ('tex', rectv (new vect (0, 0), new vect (1, 1)), count * 6, 6);
		buffers.repeat ('lookup', [count / 6 + 1 / 12], count * 6, 6);
		current[tiles[i][j].id] = time; 
		if (!tiles[i][j].tex) {
		    var index = tiles[i][j].id;
		    tiles[i][j].tex = getTexture (url + '/' + index + '.png', (function (tile) {
			return function () {
			    tile.ready = true;
			};
		    }) (tiles[i][j]))
		}
		/*if (!tiles[i][j].jxhr) {
		    var index = i + cols * j;
		    tiles[i][j].jxhr = ajaxTexture (url + '/' + index + '.png', (function (tile) {
			return function (tex) {
			    tile.tex = tex;
			    tile.ready = true;
			};
		    }) (tiles[i][j]))
		}*/
		if (tiles[i][j].ready) {
		    tile_shader.data ('sampler' + count, tiles[i][j].tex);
		    count ++;
		}
		if (count >= 6) {
		    do_draw ();
		    count = 0;
		}
	    }
	}
	do_draw ();
    };
};