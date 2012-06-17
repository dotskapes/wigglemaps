var point_shader = null;
var circle_tex;

var unit = rect (0, 0, 1, 1);

var default_point_color = new Color (116, 169, 207, 255);
var default_point_alpha = 1.0;

function PointLayer (initial_points) {
    if (!point_shader) {
	point_shader = makeProgram (BASE_DIR + 'shaders/point');
	circle_tex = getTexture (BASE_DIR + 'images/circle.png');
    }
    this.id = new_feature_id ();

    var buffers = new Buffers (initial_points);
    buffers.create ('vert', 2);
    buffers.create ('unit', 2);
    buffers.create ('color', 3);
    buffers.create ('alpha', 1);

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
	    buffers.repeat ('color', color.array, start, count);
	};

	var set_alpha = function () {
	    //layer.alpha_front (_style['opacity'], start, count);
	    var opacity = _style['opacity'];
	    if (!opacity)
		opacity = layer.style ('opacity');
	    if (!opacity)
		opacity = default_point_alpha;
	    
	    buffers.repeat ('alpha', [opacity], start, count);
	};

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
	
	buffers.repeat ('vert', this.geom, start, count);
	buffers.write ('unit', unit, start, count);
	
	set_color ();
	set_alpha ();
    };

    var tree = null;

    var num_points = 0;
    var dirty = false;

    var _properties = {};
    var features = {};
    
    this.append = function (data) {
	var p = new Point (data);
	for (key in p.attr) 
	    _properties[key] = true;
	features[p.id] = p;

	num_points ++;
	dirty = true;	
	tree = null;

	return p;
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
	//engine.manager.bind ('click', this, func);
    };

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
		if (!tree) {
		    var r_points = [];
		    for (var key in features) {
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
	    point_shader.data ('pos', buffers.get ('vert'));
	    point_shader.data ('circle_in', buffers.get ('unit'));
	    if (select) 
		return;
		//point_shader.data ('color_in', id_buffer);
	    else {
		point_shader.data ('color_in', buffers.get ('color'));  
		point_shader.data ('alpha_in', buffers.get ('alpha')); 
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