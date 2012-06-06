var line_shader;

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

function LineLayer () {
    var default_line_color = new Color (0, 0, 0, 1);
    
    if (!line_shader) {
	line_shader = makeProgram (BASE_DIR + 'shaders/line');
    }
    this.id = new_feature_id ();
    var stroke_buffers = new Buffers (1024);
    stroke_buffers.create ('vert', 2);
    stroke_buffers.create ('norm', 2);
    stroke_buffers.create ('unit', 2);
    stroke_buffers.create ('color', 3);
    stroke_buffers.create ('alpha', 1);

    var layer = this;

    function Line (prop) {
	if (!prop)
	    prop = {};
	if (!prop.geom)
	    prop.geom = [];
	if (!prop.attr)
	    prop.attr = {};
	if (!prop.style)
	    prop.style = {};
	
	this.geom = prop.geom;
	this.attr = prop.attr;
	this.id = new_feature_id ();

	var set_color = function () {
	    var color = _style['stroke'];
	    if (!color)
		color = layer.style ('stroke');
	    if (!color)
		color = default_poly_stroke;
	    stroke_buffers.repeat ('color', color.array, stroke_start, stroke_count);
	};

	draw_lines (stroke_buffers, this.geom);
    };

    var num_lines = 0;
    var dirty = false;

    var _properties = {};
    var features = {};    

    this.append = function (data) {
	var l = new Line (data);
	for (key in l.attr) 
	    _properties[key] = true;
	features[l.id] = l;

	num_lines ++;
	dirty = true;	

	return l;
    }

    this.draw = function (engine, dt, select) {
	stroke_buffers.update (dt);
	if (num_lines > 0) {
	    if (select)
		return;
	    gl.useProgram (line_shader);

	    line_shader.data ('screen', engine.camera.mat3);
	    line_shader.data ('pos', stroke_buffers.get ('vert'));
	    line_shader.data ('norm', stroke_buffers.get ('norm'));
	    line_shader.data ('color_in', stroke_buffers.get ('color'));

	    line_shader.data ('px_w', 2.0 / engine.canvas.width ());
	    line_shader.data ('px_h', 2.0 / engine.canvas.height ());

	    gl.drawArrays (gl.TRIANGLES, 0, stroke_buffers.count ()); 
	}
    }
};