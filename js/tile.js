function MultiTileLayer (levels) {
    var layers = [];
    for (var i = 0; i < levels.length; i ++) {
	var level = levels[i];
	var layer = new TileLayer (level.url, level.min, level.rows, level.cols, level.cellsize);
	layers.push (layer);
    }
    
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
    };
};

var tile_shader = null;
function TileLayer (url, min, rows, cols, cellsize) {
    if (!tile_shader)
	tile_shader = makeProgram (BASE_DIR + 'shaders/tile');

    var buffers = new Buffers (6 * rows * cols);
    buffers.create ('vert', 2);
    buffers.create ('tex', 2);

    var tiles = [];
    for (var i = 0; i < cols; i ++) {
	tiles.push ([]);
	for (var j = 0; j < rows; j ++) {
	    var rmin = new vect (min.x + i * cellsize, min.y + j * cellsize);
	    var rmax = new vect (min.x + (i + 1) * cellsize, min.y + (j + 1) * cellsize);
	    //var start = buffers.alloc (6);
	    tiles[i].push ({
		vert: rectv (rmin, rmax),
		tex: null,
		i: i,
		j: j,
		ready: false
	    });
	    
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

    //var index_buffer = indexBuffer (rows * cols * 6, 1);
    /*var extents = function (engine) {
	var smin = engine.camera.project (new vect (engine.canvas.position ().left, engine.canvas.position ().top + engine.canvas.height ()));
	var smax = engine.camera.project (new vect (engine.canvas.position ().left + engine.canvas.width (), engine.canvas.position ().top));
	var min_col = Math.floor ((smin.x - min.x) / cellsize);
	var max_col = Math.ceil ((smax.x - min.x) / cellsize);

	var min_row = Math.floor ((smin.y - min.y) / cellsize);
	var max_row = Math.ceil ((smax.y - min.y) / cellsize);
	
	var count = 0;
	for (var i = Math.max (0, min_col); i < Math.min (cols, max_col); i ++) {
	    for (var j = Math.max (0, min_row); j < Math.min (rows, max_row); j ++) {
		//var elem = [];
		//for (var k = 0; k < 6; k ++) {
		//    elem.push (k + (i * rows + j) * 6);
		//}
		//index_buffer.update (elem, count * 6);
		buffers.write ('vert', tiles[i][j].vert, count * 6, 6);
		buffers.write ('tex', tiles[i][j].tex, count * 6, 6);
		count ++;
		if (count > 6)
		    return 6;
	    }
	}
	return count;
    }*/
    
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
	   
	    gl.drawArrays (gl.TRIANGLES, 0, count * 6);
	};


	var smin = engine.camera.project (new vect (engine.canvas.position ().left, engine.canvas.position ().top + engine.canvas.height ()));
	var smax = engine.camera.project (new vect (engine.canvas.position ().left + engine.canvas.width (), engine.canvas.position ().top));
	var min_col = Math.floor ((smin.x - min.x) / cellsize);
	var max_col = Math.ceil ((smax.x - min.x) / cellsize);

	var min_row = Math.floor ((smin.y - min.y) / cellsize);
	var max_row = Math.ceil ((smax.y - min.y) / cellsize);
	
	for (var i = Math.max (0, min_col); i < Math.min (cols, max_col); i ++) {
	    for (var j = Math.max (0, min_row); j < Math.min (rows, max_row); j ++) {
		buffers.write ('vert', tiles[i][j].vert, count * 6, 6);
		buffers.write ('tex', rectv (new vect (count / 6, 0), new vect ((count + 1) / 6, 1)), count * 6, 6);
		if (!tiles[i][j].tex) {
		    tiles[i][j].tex = getTexture (url + '/' + i + '_' + j + '.png', (function (tile) {
			return function () {
			    tile.ready = true;
			};
		    }) (tiles[i][j]))
		}
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

/*function TileManager (url, anchor, width, max_level) {
    var root = new Tile (url, anchor, width);

    
};

function Tile (root, anchor, width, level, max_level) {
    if (!raster_shader)
	raster_shader = makeProgram (BASE_DIR + 'shaders/raster');

    var min = anchor.clone ();
    var max = new vect (anchor.x + width, anchor.y + width);
    var box = new Box (min, max);
    var bl, tl, br, tr;
    if (level != max_level) {
	var n_width = width / 2;
	bl = new Tile (root, anchor.clone (), n_width, level + 1, max_level);
	tl = new Tile (root, new vect (anchor.x, anchor.y + n_width), n_width, level + 1, max_level);
	br = new Tile (root, new vect (anchor.x + n_width, anchor.y), n_width, level + 1, max_level);
	tr = new Tile (root, new vect (anchor.x + n_width, anchor.y + n_width), n_width, level + 1, max_level);
    }

    var image;
    var loaded = false;
    this.activate = function () {
	image = getTexture (root + level + '.png', function () {
	    loaded = true;
	});
    };

    this.deactivate = function () {
	loaded = false;
	image = null;
    };

    this.ready = function () {
	return loaded;
    };

    this.update = function (result, screen, lvl) {
	var active;
	var abl, atl, abr, atr;
	if (bl) {
	    abl = bl.update (result, screen, lvl);
	    atl = tl.update (result, screen, lvl) ;
	    abr = br.update (result, screen, lvl);
	    atr = tr.update (result, screen, lvl);
	}
	if (level == 0)
	    active = true;
	else if (level > lvl) {
	    active = false;
	}
	else if (screen.intersects (box)) {
	    if (lvl > level) {
		active = abl && atl && abr && atr;
	    }
	    else if (lvl == level) {
		active = true;
	    }
	    //else {
		//active = false;
	    //}
	}
	else {
	    active = false;
	}
	if (active) {
	    if (!loaded)
		this.activate ();
	    result.push (this);
	}
	else {
	    this.deactivate ();
	}
	return this.ready ();
    }

    var tex_buffer = staticBuffer (rectv (new vect (0, 1), new vect (1, 0)), 2);
    var pos_buffer = staticBuffer (rectv (min, max), 2);

    this.draw = function (engine, dt, select) {
	if (select)
	    return;
	var result = [];
	if (level == 0) {
	    var smin = engine.camera.project (new vect (engine.canvas.position ().left, engine.canvas.position ().top + engine.canvas.height ()));
	    var smax = engine.camera.project (new vect (engine.canvas.position ().left + engine.canvas.width (), engine.canvas.position ().top));
	    var map_width = engine.camera.screen (max).x - engine.camera.screen (min).x;
	    var p = Math.log (map_width) / Math.log (2);
	    var current_level = Math.floor (p - 9);
	    if (current_level > max_level)
		current_level = max_level;
	    if (current_level < 0)
		current_level = 0;
	    this.update (result, new Box (smin, smax), current_level);
	}
	if (this.ready ()) {
	    gl.useProgram (raster_shader);
	    
	    raster_shader.data ('screen', engine.camera.mat3);
	    raster_shader.data ('pos', pos_buffer);
	    raster_shader.data ('tex_in', tex_buffer);
	    
	    raster_shader.data ('sampler', image);
	    
	    gl.drawArrays (gl.TRIANGLES, 0, pos_buffer.numItems); 
	}

	if (level != max_level) {
	    bl.draw (engine, dt, select);
	    tl.draw (engine, dt, select);
	    br.draw (engine, dt, select);
	    tr.draw (engine, dt, select);
	}
    };
};*/