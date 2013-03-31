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


function draw_graph_lines (stroke_buffers, geom) {
    var count = 6 * geom.length;
    var start = stroke_buffers.alloc (count);
    
    var unit = [
        new vect (1, 1),
        new vect (1, -1),
        new vect (-1, -1),
        new vect (-1, 1)
    ];

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

    var prev = next_vert ();
    var current = next_vert ();
    var next = next_vert ();

    var get_norm_dir = function (u1, u2) {
        var dir = vect.dir (u1, u2);
        return dir.rotate (PI / 2);
    };

    var intersect_parallel_lines = function (p1, p2, p3) {
        //var norm1 = vect.sub (get_norm_dir (p1, p2), current);
        //var norm2 = vect.sub (get_norm_dir (p2, p3), current);
        var norm1 = get_norm_dir (p1, p2);
        var norm2 = get_norm_dir (p2, p3);

        var x1 = vect.add (p1, norm1);
        var x2 = vect.add (p2, norm1);
        var x3 = vect.add (p2, norm2);
        var x4 = vect.add (p3, norm2);
        
        var intersect = vect.intersect2dpos (x1, x2, x3, x4);
        if (intersect == Infinity)
            return vect.add (p2, norm1);
        else
            return intersect;
    };

    var p_norm1 = vect.dir (prev, current).rotate (-PI / 2);
    var p_norm2 = vect.dir (prev, current).rotate (PI / 2);

    var c_norm1, c_norm2;

    var write_quad = function (buffer, v1, v2, v3, v4) {
        buffer.push (v1.x);
        buffer.push (v1.y);

        buffer.push (v2.x);
        buffer.push (v2.y);

        buffer.push (v3.x);
        buffer.push (v3.y);

        buffer.push (v1.x);
        buffer.push (v1.y);

        buffer.push (v3.x);
        buffer.push (v3.y);

        buffer.push (v4.x);
        buffer.push (v4.y);
    };

    var vert_buffer = [];
    var norm_buffer = [];
    var unit_buffer = [];

    while (current) {
        if (next) {
            c_norm1 = vect.sub (intersect_parallel_lines (prev, current, next), current);
            c_norm2 = vect.sub (intersect_parallel_lines (next, current, prev), current);
        }
        else {
            c_norm1 = vect.dir (prev, current).rotate (PI / 2);
            c_norm2 = vect.dir (prev, current).rotate (-PI / 2);
            // TODO: if first == last, connect them together
        }
        
        write_quad (vert_buffer, prev, prev, current, current);
        write_quad (norm_buffer, p_norm1, p_norm2, c_norm1, c_norm2);
        write_quad (unit_buffer, unit[0], unit[1], unit[2], unit[3]);

        p_norm1 = c_norm2;
        p_norm2 = c_norm1;

        prev = current;
        current = next;
        next = next_vert ();
    };

    stroke_buffers.write ('vert', vert_buffer, start, count);
    stroke_buffers.write ('norm', norm_buffer, start, count);
    stroke_buffers.write ('unit', unit_buffer, start, count);

    return start;

};

function draw_map_lines (stroke_buffers, geom) {
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

    var unit = [
        new vect (1, 1),
        new vect (1, -1),
        new vect (-1, -1),
        new vect (-1, 1)
    ];
    
    var vert_buffer = [];
    var norm_buffer = [];
    var unit_buffer = []
    var unit_buffer = [-1, 0, 1, 0, -1, -1, 1, -1, -1, -1, 1, 0];
    //var unit_buffer = [, 0, 0, 0, 0, 0, 0];
    //var unit_buffer = [-1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1];
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
    var p_norm = vect.dir (prev, current).rotate (PI / 2);
    var c_norm;
    var write_index = start;
    
    while (current) {
        if (next) {
            var p1 = vect.dir (next, current);
            var p2 = vect.dir (current, prev);
            c_norm = vect.sub (p1, p2).scale (.5).normalize ();
        }
        else {
            c_norm = vect.dir (prev, current).rotate (PI / 2);
        }
        //c_norm = new vect (0.0, 1.0);
        //p_norm = new vect (0.0, 1.0);
        cp_vert (vert_buffer, prev, current, false);
        cp_vert (norm_buffer, p_norm, c_norm, true);
        //cp_vert (unit_buffer, new vect (0, 1), new vect (0, 1), true);
        stroke_buffers.write ('vert', vert_buffer, write_index, 6);
        stroke_buffers.write ('norm', norm_buffer, write_index, 6);
        stroke_buffers.write ('unit', unit_buffer, write_index, 6);
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
