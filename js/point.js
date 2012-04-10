var point_shader = null;
var circle_tex;

var unit = rect (0, 0, 1, 1);

var default_point_color = new Color (116, 169, 207, 255);
var default_point_alpha = 1.0;

function PointLayer (initial_points) {
    this.id = new_feature_id ();
    layer_id ++;

    if (!point_shader || !poly_shader) {
	poly_shader = makeProgram (BASE_DIR + 'shaders/poly');
	point_shader = makeProgram (BASE_DIR + 'shaders/point');

	circle_tex = getTexture (BASE_DIR + 'images/circle.png');
    }

    var buffers = new Buffers (initial_points);
    buffers.create ('points', 3);
    buffers.create ('units', 3);
    buffers.create ('colors', 3);
    buffers.create ('alphas', 1);

    var layer = this;

    var Point = function (prop) {
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
	var start, count;

	/*this.geom = function (new_geom) {
	  if (this.layer) {
	  
	  }
	  geom = new_geom;
	  };*/

	var _style = {};
	copy_value (_style, prop.style, 'fill', hex_to_color);
	copy_value (_style, prop.style, 'opacity', parseFloat);

	var set_color = function () {
	    //layer.color_front (_style['fill'], start, count);
	    var color = _style['fill'];
	    if (!color)
		color = layer.style ('fill');
	    if (!color)
		color = default_point_color;
	    buffers.repeat ('colors', color.array, start, count);
	};

	var set_alpha = function () {
	    //layer.alpha_front (_style['opacity'], start, count);
	    var opacity = _style['opacity'];
	    if (!opacity)
		opacity = layer.style ('opacity');
	    if (!opacity)
		opacity = default_point_alpha;
	    
	    buffers.repeat ('alphas', [opacity], start, count);
	};

	/*this.bind = function (_layer, _id, _buffers) {
	    if (layer)
		throw "Invalid Operation: Point bound twice";
	    layer = _layer;
	    this.id = _id;
	    buffers = _buffers;

	    count = 6;
	    start = buffers.alloc (count);

	    var geom_array = [this.geom[0], this.geom[1], 1];
	    //for (var i = 0; i < _count; i ++) {
	    //    buffers.set ('points', geom_array, start + i, 1);
	    //}
	    buffers.repeat ('points', geom_array, start, count);
	    buffers.write ('units', unit, start, count);

	    set_color ();
	    set_alpha ();
	};*/

	this.style = function (key, val) {
	    if (arguments.length == 1)
		return _style[key];
	    _style[key] = val;
	    if (key == 'fill') {
		set_color ();
	    }
	    if (key == 'opacity') {
		set_alpha ();
	    }
	};

	count = 6;
	start = buffers.alloc (count);
	
	var geom_array = [this.geom[0], this.geom[1], 1];
	buffers.repeat ('points', geom_array, start, count);
	buffers.write ('units', unit, start, count);
	
	set_color ();
	set_alpha ();
    };

    /*var size;
    var vert_array;
    var front_array;
    var back_array;
    var id_array;

    var point_buffer; 
    var unit_buffer; 
    var color_buffer;
    var id_buffer;

    var copy_array = function (dst, src) {
	if (dst.length < src.length)
	    throw "Destination smaller than source";
	for (var i = 0; i < src.length; i ++) {
	    dst[i] = src[i];
	}
    };

    var resize = function (_size) {
	var n_vert_array = new Float32Array (_size * 3);
	var n_front_array = new Float32Array (_size * 4);
	var n_back_array = new Float32Array (_size * 3);
	var n_id_array = new Float32Array (_size * 3);

	if (size) {
	    copy_array (n_vert_array, vert_array);
	    copy_array (n_front_array, front_array);
	    copy_array (n_back_array, back_array);
	    copy_array (n_id_array, id_array);
	}

	vert_array = n_vert_array;
	front_array = n_front_array;
	back_array = n_back_array;
	id_array = n_id_array;
	
	size = _size;

	point_buffer = dynamicBuffer (size, 3);
	unit_buffer = repeats (unit, 3, size);
	color_buffer = dynamicBuffer (size, 4);
	id_buffer = dynamicBuffer (size, 4);
    };

    if (!initial_points)
	initial_points = 256;
    resize (initial_points * 6);*/

    var tree = null;

    var num_points = 0;
    var dirty = false;
    /*var add_point = function (p) {
	var geom = p.geom;
	if ((num_points + 1) * 6 >= size) {
	    resize (size * 2);
	}
	var base3 = num_points * 6 * 3;
	var base4 = num_points * 6 * 4;
	
	for (var i = 0; i < 6; i ++) {
	    var offset3 = i * 3;
	    var offset4 = i * 4;

	    //vert_array[base3 + offset3] = geom[0];
	    //vert_array[base3 + offset3 + 1] = geom[1];
	    //vert_array[base3 + offset3 + 2] = 1.0;
	}
	num_points ++;
	dirty = true;	
	tree = null;
    };*/

    //var tree = new RangeTree (r_points);

    //engine.manager.register (this, features, id_array);
    //id_buffer.update (id_array, 0);

    var _properties = {};
    var features = {};
    
    this.append = function (data) {
	var p = new Point (data);
	for (key in p.attr) 
	    _properties[key] = true;
	features[p.id] = p;

	//var start = num_points * 6;
	//var count = 6;

	num_points ++;
	dirty = true;	
	tree = null;

	return p;

	/*add_point (p);
	var c = engine.manager.register (this, p);
	for (var i = start; i < start + count; i ++) {
	    id_array[i * 4] = c.r / 255;
	    id_array[i * 4 + 1] = c.g / 255;
	    id_array[i * 4 + 2] = c.b / 255;
	    id_array[i * 4 + 3] = 1.0;
	}*/
    };

    this.features = function () {
	var elem = [];
	for (key in features) {
	    elem.push (features[key]);
	}
	return new LayerSelector (elem);
    };

    this.attr = function () {
	var prop = [];
	for (key in _properties)
	    prop.push (key);
	return prop;
    }

    this.search = function (box) {
	var min = box.min;
	var max = box.max;
	var elem = tree.search (min, max);
	var results = [];
	$.each (elem, function (i, v) {
	    results.push (features[v.key]);
	});
	return new LayerSelector (results);
    };

    this.mouseover = function (func) {
	//engine.manager.bind ('mouseover', this, func);
    };

    this.mouseout = function (func) {
	//engine.manager.bind ('mouseout', this, func);
    };

    this.click = function (func) {
	engine.manager.bind ('click', this, func);
    };

    /*this.color_front = function (color, start, count) {
	if (!color)
	    color = default_point_color;
	for (var i = start; i < start + count; i ++) {
	    front_array[i * 4] = color.r;
	    front_array[i * 4 + 1] = color.g;
	    front_array[i * 4 + 2] = color.b;
	}
	dirty = true;
    };

    this.alpha_front = function (alpha, start, count) {
	if (!alpha)
	    alpha = default_point_alpha;
	for (var i = start; i < start + count; i ++) {
	    front_array[i * 4 + 3] = alpha;	
	}
	dirty = true;
    };

    this.color_back = function (value, start, stop) {

    };*/

    this.style = function (key, value) {
	if (arguments.length > 1)
	    throw "Not Implemented";
	return null;
    };
    
    
    var count = 0;
    this.draw = function (engine, dt, select) {
	buffers.update (dt);
	if (num_points > 0) {
	    if (dirty) {
		/*point_buffer.update (vert_array, 0);
		color_buffer.update (front_array, 0);
		id_buffer.update (id_array, 0);*/
		if (!tree) {
		    var r_points = [];
		    for (key in features) {
			r_points.push ({
			    key: key,
			    x: features[key].geom[0],
			    y: features[key].geom[1]
			});
		    }
		    tree = new RangeTree (r_points);
		}
		dirty = false;
	    }
	    gl.useProgram (point_shader);

	    point_shader.data ('screen', engine.camera.mat3);
	    //point_shader.data ('pos', point_buffer);
	    point_shader.data ('pos', buffers.get ('points'));
	    point_shader.data ('circle_in', buffers.get ('units'));
	    if (select) 
		return;
		//point_shader.data ('color_in', id_buffer);
	    else {
		point_shader.data ('color_in', buffers.get ('colors'));  
		point_shader.data ('alpha_in', buffers.get ('alphas')); 
		//point_shader.data ('color_in', color_buffer); 
	    }

	    point_shader.data ('select', select);

	    point_shader.data ('aspect', engine.canvas.width () / engine.canvas.height ());
	    point_shader.data ('pix_w', 2.0 / engine.canvas.width ());
	    point_shader.data ('rad', 5);

	    point_shader.data ('glyph', circle_tex);

	    point_shader.data ('zoom', 1.0 / engine.camera.level);

	    gl.drawArrays (gl.TRIANGLES, 0, buffers.count ()); 
	}
    };
};