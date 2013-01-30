function linestring_bounds (geom) {
    var min = new vect (Infinity, Infinity);
    var max = new vect (-Infinity, -Infinity);
    $.each (geom, function (i, poly) {
	$.each (poly, function (k, ring) {
	    $.each (ring, function (j, pair) {
		if (pair[0] < min.x)
		    min.x = pair[0];
		if (pair[0] > max.x)
		    max.x = pair[0];
		if (pair[1] < min.y)
		    min.y = pair[1];
		if (pair[1] > max.y)
		    max.y = pair[1];
	    });
	});
    });
    return new Box (min, max);
};

function draw_lines (stroke_buffers, geom) {
    var count = 6 * geom.length;
    var start = stroke_buffers.alloc (count);

    var index = 0;
    var next_vert = function () {
	if (geom[index]) {
	    var v = new vect (geom[index][0], geom[index][1]);
	    index ++;
	    return v;
	}
	else
	    return null;
    };
    
    var vert_buffer = [];
    var norm_buffer = [];
    //var unit_buffer = [1, 1, -1, 1, 1, -1, 0, 0, 0, 0, 0, 0];
    var write_vert = function (buffer, v, index, invert) {
	if (!invert) {
	    buffer[index] = v.x;
	    buffer[index + 1] = v.y;
	}
	else {
	    buffer[index] = -v.x;
	    buffer[index + 1] = -v.y;
	}
    };
    var cp_vert = function (buffer, v1, v2, invert) {
	write_vert (buffer, v1, 0, false);
	write_vert (buffer, v2, 2, false);
	write_vert (buffer, v1, 4, invert);
	
	write_vert (buffer, v2, 6, invert);
	write_vert (buffer, v1, 8, invert);
	write_vert (buffer, v2, 10, false);
    };
    
    var prev = next_vert ();
    var current = next_vert ();
    var next = next_vert ();
    var p_norm = vect.dir (current, prev).rotate (PI / 2);
    var c_norm;
    var write_index = start;
    
    while (current) {
	if (next) {
	    c_norm = vect.dir (next, prev).rotate (PI / 2);
	}
	else {
	    c_norm = vect.dir (current, prev).rotate (PI /2);
	}
	cp_vert (vert_buffer, prev, current, false);
	cp_vert (norm_buffer, p_norm, c_norm, true);
	//cp_vert (unit_buffer, new vect (0, 1), new vect (0, 1), true);
	stroke_buffers.write ('vert', vert_buffer, write_index, 6);
	stroke_buffers.write ('norm', norm_buffer, write_index, 6);
	//stroke_buffers.write ('unit', unit_buffer, write_index, 6);
	write_index += 6;
	
	prev = current;
	current = next;
	next = next_vert ();
	p_norm = c_norm;
    }
    return start;
};

function Line (prop, layer) {
    Feature.call (this, prop, layer);

    this.bounds = linestring_bounds (this.geom);

    this.map_contains = function (engine, p) {
        return false;
    }
};

function LineCollection (lines) {
    this.search = function (box) {
        return new LayerSelector ([]);
    };

    this.map_contains = function (engine, p) {
        return new LayerSelector ([]);
    };

    this.contains = function (p) {
        return new LayerSelector ([]);
    };
};
