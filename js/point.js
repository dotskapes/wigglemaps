// A point for the layer. A point is actually a multi-point, so it can be
// made up of many "spatial" points. The geometry format for the point type is:
// [[lon, lat], [lon, lat], [lon, lat], ...]
var Point = function (prop, feature) {
    Feature.call (this, prop, feature);

    // Converts geometry representation of a point to a vector
    var geom2vect = function (geom) {
        return new vect (geom[0], geom[1]);
    };

    // Set the bounding box for the point
    this.bounds = null;
    for (var i = 0; i < this.geom.length; i ++) {
        var pos = geom2vect (this.geom[i]);
        var bbox = new Box (pos.clone (), pos.clone ());
	if (this.bounds)
	    this.bounds.union (bbox);
	else
	    this.bounds = bbox;
    }

    // Check if a point (usually a mouse position) is contained in the buffer
    // of this Point
    this.contains = function (engine, p) {
        var s = engine.camera.screen (p);
        var rad = this.style ('radius');
        for (var i = 0; i < this.geom.length; i ++) {
            var v = engine.camera.screen (geom2vect (this.geom[i]));
            return (vect.dist (v, s) < rad)
        }
    };
};

// Contains point specific operations, particualrly to perform geometric queries
// on points faster. This datatype is immutable. Points cannot be added or removed 
// from it.
var PointCollection = function (points) {
    // Search a rectangle for point contained within
    this.search = function () {
        
    };

    // Determine if a point is contained in the buffer of any of the points
    this.contains = function () {

    };
};

var point_shader = null;
var circle_tex;

var unit = rect (0, 0, 1, 1);

var default_point_color = new Color (.02, .44, .69, 1);
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

	var p = new vect (prop.geom[0][0], prop.geom[0][1]);

	this.bounds = new Box (p.clone (), p.clone ());
	var start, count;
	
	var total_points = 0;

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
	total_points = this.geom.length;
	count = 6 * total_points;
	start = buffers.alloc (count);

	$.each (this.geom, function (index, point) {
	    buffers.repeat ('vert', point, start + index * 6, 6);
	    buffers.write ('unit', unit, start + index * 6, 6);
	});
	//count = 6;
	//start = buffers.alloc (count);
	
	//buffers.repeat ('vert', this.geom, start, count);
	//buffers.write ('unit', unit, start, count);
	
	set_color ();
	set_alpha ();
    };

    var tree = null;

    var num_points = 0;
    var dirty = false;

    var _properties = {};
    var features = {};

    this.bounds = null
    
    this.append = function (data) {
	var p = new Point (data);
	for (key in p.attr) 
	    _properties[key] = true;
	features[p.id] = p;

	num_points ++;
	dirty = true;	
	tree = null;

	if (this.bounds)
	    this.bounds.union (p.bounds);
	else
	    this.bounds = p.bounds.clone ();

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
  
    this.update_move = function (engine, p) {

    };
    
    var count = 0;
    this.draw = function (engine, dt, select) {
	buffers.update (dt);
	if (num_points > 0) {
	    if (dirty) {
		if (!tree) {
		    var r_points = [];
		    for (var key in features) {
			$.each (features[key].geom, function (i, point) {
			    r_points.push ({
				key: key,
				x: point[0],
				y: point[1]
			    });
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
