function TileManager (url, anchor, width, max_level) {
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
}; 