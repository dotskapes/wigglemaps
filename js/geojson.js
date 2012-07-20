function GeoJSON (data) {
    var num_points = 0, num_polys = 0, num_lines = 0;
    var points = [], polys = [], lines = [];
    for (var i = 0; i < data.features.length; i ++) {
	var feature = data.features[i];
	if (feature.type == 'Feature') {
	    if (feature.geometry.type == 'Point') {
		num_points ++;
		points.push ({
		    geom: [feature.geometry.coordinates],
		    attr: feature.properties
		});
	    }
	    if (feature.geometry.type == 'MultiPoint') {
		num_points += feature.geometry.cooordinates.length;
		points.push ({
		    geom: feature.geometry.coordinates,
		    attr: feature.properties
		});
	    }
	    if (feature.geometry.type == 'Polygon') {
		var poly = feature.geometry.coordinates;
		var oriented = [];
		for (var k = 0; k <= poly.length - 1; k ++) {
		    var o_ring = [];
		    for (var j = poly[k].length - 1; j >= 0; j --) {
			o_ring.push (poly[k][j]);
		    }
		    oriented.push (o_ring);
		}
		num_polys ++;
		polys.push ({
		    geom: [oriented],
		    attr: feature.properties
		});
	    }
	    if (feature.geometry.type == 'MultiPolygon') {
		var rings = [];
		$.each (feature.geometry.coordinates, function (i, poly) {
		    var oriented = [];
		    for (var k = 0; k <= poly.length - 1; k ++) {
			var o_ring = [];
			for (var j = poly[k].length - 1; j >= 0; j --) {
			    o_ring.push (poly[k][j]);
			}
			oriented.push (o_ring);
		    }
		    rings.push (oriented);
		});
		num_polys ++;
		polys.push ({
		    geom: rings,
		    attr: feature.properties
		});
	    }
	    if (feature.geometry.type == 'MultiLineString') {
		$.each (feature.geometry.coordinates, function (i, line) {
		    num_lines ++;
		    lines.push ({
			geom: line,
			attr: feature.properties
		    });
		});
	    }
	}
    }
    if (num_points > 0) {
	var p_layer = new PointLayer (num_points);
	$.each (points, function (i, v) {
	    p_layer.append (v);
	});
	return p_layer;
    }
    else if (num_polys > 0) {
	var p_layer = new PolygonLayer ();
	$.each (polys, function (i, v) {
	    var count = 0;
	    while (count < 100) {
		try {
		    p_layer.append (v);
		    count = 101;
		} catch (e) {
		    count ++;
		}
	    }
	    if (count == 100)
		console.log ('rendering polygon failed')
	});
	return p_layer;	
    }
    else if (num_lines > 0) {
	var line_layer = new LineLayer ();
	$.each (lines, function (i, v) {
	    line_layer.append (v);
	});
	return line_layer;
    }
};

/*function triangulate_polygon (elem) {
    //var poly = [];
    var poly = new clist ();
    for (var i = elem.length - 1; i >= 0; i --) {
	//poly.push (new vect (elem[i][0], elem[i][1]));
	poly.append (new vect (elem[i][0], elem[i][1]));
    }
    var tri = new Float32Array ((elem.length - 2) * 3 * 3);
    index = 0;
    function add_point (a) {
	if (index > (elem.length - 2) * 3 * 3)
	    throw "Index out of bounds!";
	tri[index] = a.x;
	tri[index + 1] = a.y;
	tri[index + 2] = 1.0;
	index += 3;
	//tri.push (a.x);
	//tri.push (a.y);
	//tri.push (1.0);
    };
    function add_triangle (a, b, c) {
	add_point (a);
	add_point (b);
	add_point (c);
    };
    var i = -1;
    var count = poly.length;
    while (poly.length > 3) {
	i ++;
	if (i >= poly.length) {
	    if (count == poly.length){
		console.log ('bad ear removal with', poly.length);
		break;
	    }
	    count = poly.length;
	    i -= poly.length;
	}
	var prev = poly.current.prev.data;
	var current = poly.current.data;
	var next = poly.current.next.data;

	//if (!vect.left2d (poly[i], poly[k], poly[j], 0.0)) {
	if (!vect.left2d (prev, next, current, 0.0)) {
	    var okay = true;
	    //for (var m = 0; m < poly.length; m ++) {
	    var other = poly.current.next.next;
	    while (other.next != poly.current.prev) {
		//var l = m + 1;
		//if (l >= poly.length)
		//    l -= poly.length;
		//if (l == i || l == k || m == i || m == k)
		//    continue;
		//if (vect.intersect2d (poly[i], poly[k], poly[m], poly[l], 0)) {
		if (vect.intersect2d (prev, next, other.data, other.next.data, 0)) {
		    okay = false;
		    break;
		}
		other = other.next;
	    }
	    if (okay) {
		add_triangle (prev, current, next);
		poly.remove ();
		//poly.splice (j, 1);
	    }
	}
	poly.next ();
    }
    add_triangle (poly.current.prev.data, poly.current.data, poly.current.next.data);
    //add_triangle (poly[0], poly[1], poly[2]);
    return tri;
};

var rand_map = (function () {
    //var factor = .000000001;
    var factor = 1e-6
    var xmap = {} 
    var ymap = {} 
    return function (x, y) {
	var key = x.toString () + ',' + y.toString ();
	if (!(key in xmap)) {
	    xmap[key] = x + Math.random () * factor - (factor / 2);
	    ymap[key] = y + Math.random () * factor - (factor / 2);
	}
	return new vect (xmap[key], ymap[key]);
    };
}) ();

triangulate_polygon = function (elem) {
    var poly = [];
    for (var k = 0; k < elem.length; k++) {
	var p = [];
	for (var i = elem[k].length - 1; i >= 1; i --) {
	    p.push (rand_map (elem[k][i][0], elem[k][i][1]));
	}
	p.push (poly[0]);
	poly.push (p);
    }
    return trapezoid_polygon (poly); 
    var tri = new Float32Array (elem.length * 3 * 2 * 3);
    index = 0;
    function add_point (a) {
	if (index > (elem.length * 3 * 2 * 3))
	    throw "Index out of bounds!";
	tri[index] = a.x;
	tri[index + 1] = a.y;
	tri[index + 2] = 1.0;
	index += 3;
	//tri.push (a.x);
	//tri.push (a.y);
	//tri.push (1.0);
    };
    function add_triangle (a, b, c) {
	add_point (a);
	add_point (b);
	add_point (c);
    };	

    function bisect (p0, p1, p2) {
        var v = vect.sub (p2, p0);
        v.normalize ();
	    v.rotateZ (Math.PI / 2);
	    v.scale (.05);
	    return vect.add (p1, v);
    };
    for (var i = 0; i < poly.length; i ++) {
	    var h = i - 1;
	    if (h < 0)
	        h += poly.length;
        var j = (i + 1);
	    if (j >= poly.length)
	        j -= poly.length;
	    var k = (i + 2);
	    if (k >= poly.length)
	        k -= poly.length;

	    var p3 = bisect (poly[h], poly[i], poly[j]);
	    var p4 = bisect (poly[i], poly[j], poly[k]);
	    add_triangle (poly[i], poly[j], p3);
	    add_triangle (p4, p3, poly[j]);
	}
	return tri;
};*/

/*var key_count = 0;
function Layer (data) {
    var start_time = new Date ().getTime ();
    this.id = layer_id;
    layer_id ++;
    if (!point_shader || !poly_shader) {
	poly_shader = makeProgram (BASE_DIR + '/shaders/poly');
	point_shader = makeProgram (BASE_DIR + '/shaders/point');

	circle_tex = getTexture (BASE_DIR + 'images/circle.png');

	$ (document).bind ('keydown', 'a', function () {
	    key_count ++;
	});
	$ (document).bind ('keydown', 's', function () {
	    key_count --;
	});
    }
    this.bbox = data.bbox;
    //this.epsg = parseInt (data.crs.properties.code);

    var unit = rect (0, 0, 1, 1);
    var points = [];
    var num_points = 0;
    var r_points = [];

    var polys = [];
    var num_polys = 0;
    var poly_count = 0;

    //var id_keys = {};
    var features = [];
    var properties = [];

    var tree = null;

    var prop_key = {}    
    for (var i = 0; i < data.features.length; i ++) {
	var feature = data.features[i];
	for (key in feature.properties) {
	    if (!(key in prop_key))
		prop_key[key] = true;
	}
	if (feature.type == 'Feature') {
	    if (feature.geometry.type == 'Point') {
		features.push (feature);
		feature.start = num_points * 6;
		feature.count = 6;

		num_points ++;		

		var x = feature.geometry.coordinates[0];
		var y = feature.geometry.coordinates[1];

		feature.x = x;
		feature.y = y;

		r_points.push (feature);
		
		//points.push.apply (points, rect (x, y, .1, .1));
		for (var j = 0; j < 6; j ++) {
		    points.push.apply (points, [x, y, 1]);
		}
	    }
	    if (feature.geometry.type == 'MultiPolygon') {
		features.push (feature);
		feature.start = poly_count;
		feature.properties['rand'] = Math.random ();
		var count = 0;
		for (var j = 0; j < feature.geometry.coordinates.length; j ++) {
		    //for (var k = 0; k < feature.geometry.coordinates[j].length; k ++) {  
			//count += (feature.geometry.coordinates[j][k].length * 6);
			//var p = triangulate_polygon (feature.geometry.coordinates[j][k])
		    try {
			    var p = triangulate_polygon (feature.geometry.coordinates[j]);
			    num_polys ++;
			    polys.push (p);
			    count += p.length / 3;
			}
			catch (e) {
			    console.log ('failed', i, j);
			}
		    }
		feature.count = count;
		poly_count += count;		
	    }
	    if (feature.geometry.type == 'Polygon') {
		features.push (feature);
		feature.start = poly_count;
		feature.properties['rand'] = Math.random ();
		var count = 0;
		try {
		    var p = triangulate_polygon (feature.geometry.coordinates);
		    num_polys ++;
		    polys.push (p);
		    count += p.length / 3;
		}
		catch (e) {
		    console.log ('failed');
		}
		feature.count = count;
		poly_count += count;		
	    }
	}
    }
    for (key in prop_key) {
	properties.push (key);
    }
    var point_buffer; 
    var unit_buffer; 
    var elem_buffer;
    var color_buffer;
    var id_buffer;
    var color_array;
    var back_array;
    var id_array;
    var poly_buffer;
    if (num_points > 0) {
	tree = new RangeTree (r_points);
	point_buffer = staticBuffer (points, 3);
	unit_buffer = repeats (unit, 3, num_points);
	//elem_buffer = indexBuffer (num_points * 6, 1);
	color_buffer = dynamicBuffer (num_points * 6, 4);
	id_buffer = dynamicBuffer (point_buffer.numItems, 4);
	color_array = new Float32Array (num_points * 6 * 4);
	back_array = new Float32Array (num_points * 6 * 4);
	id_array = new Float32Array (num_points * 6 * 4);
	//indices = new Uint16Array (num_points * 6);
	for (var i = 0; i < num_points * 6 * 4; i += 4) {
	    color_array[i] = .45;
	    color_array[i + 1] = .66;
	    color_array[i + 2] = .81;
	    color_array[i + 3] = 1.0;
	    //indices[i] = i;
	}
	color_buffer.update (color_array, 0);
	//elem_buffer.update (indices, 0);
    }
    if (num_polys > 0) {
	poly_buffer = staticBufferJoin (polys, 3);
	//console.log (polys);
	//poly_buffer = staticBuffer (polys, 3);
	color_buffer = dynamicBuffer (poly_buffer.numItems, 4);
	id_buffer = dynamicBuffer (poly_buffer.numItems, 4);
	color_array = new Float32Array (poly_buffer.numItems * 4);
	back_array = new Float32Array (poly_buffer.numItems * 4);
	id_array = new Float32Array (poly_buffer.numItems * 4);
	for (var i = 0; i < poly_buffer.numItems * 4; i += 4) {
	    color_array[i] = 0.0;
	    color_array[i + 1] = 0.0;
	    color_array[i + 2] = 1.0;
	    color_array[i + 3] = .5;
	}
	color_buffer.update (color_array, 0);
    }
    //for (var i = 0; i < features.length; i ++) {
	//var id = set_id_color (this, features[i], id_array);
	//id_keys[id] = features[i];
    //}
    engine.manager.register (this, features, id_array);
    id_buffer.update (id_array, 0);
    var end_time =  new Date ().getTime ();
    
    console.log ('Load Time', end_time - start_time);

    this.choropleth = function (name, colors) {
	features.sort (function (a, b) {
	    return a.properties[name] - b.properties[name];
	});
	for (var i = 0; i < features.length; i ++) {
	    var f = features[i];
	    var index = Math.floor (((i / features.length)) * colors.length);
	    colors[index].t ++;
	    for (var j = f.start; j < f.start + f.count; j ++) {
		color_array[j * 4] = colors[index].r;
		color_array[j * 4 + 1] = colors[index].g;
		color_array[j * 4 + 2] = colors[index].b;
		color_array[j * 4 + 3] = colors[index].a;
	    }
	}
	color_buffer.update (color_array, 0);
	console.log (colors);
    };

    LayerSelector = function (f) {
	var elements = f;
	this.length = f.length;
	this.get = function (i) {
	    return f[i];
	};
	this.remove = function (index) {
	    var elem = [];
	    for (var i = 0; i < elements.length; i ++) {
		if (index != i) 
		    elem.push (elements[i]);
	    }
	    return new LayerSelector (elem);
	};
	var operators = {
	    '>': function (a, b) { return a > b},
	    '<': function (a, b) { return a < b},
	    '==': function (a, b) { return a == b},
	    '>=': function (a, b) { return a >= b},
	    '<=': function (a, b) { return a <= b}
	};

	this.subset = function (elem) {
	    var subset = [];
	    for (var i = 0; i < elem.length; i ++) {
		subset.push (elements[elem[i]]);
	    }
	    return new LayerSelector (subset);
	};

	this.select = function (string) {
	    if (string.match (/^\s*\*\s*$/))
		return new LayerSelector (f);
	    var matches = string.match (/^\s*(\w+)\s*([=<>]+)\s*(\w+)\s*$/);
	    if (!matches)
		return;
	    var field1 = matches[1];
	    var op = matches[2];
	    var val = null;
	    var field2 = null;;
	    if (isNaN (matches[3])) {
		field2 = matches[3];
	    }
	    else {
		val = parseFloat (matches[3]);
	    }
	    elem = [];
	    if (field2) {
		for (var i = 0; i < f.length; i ++) {
		    if (operators[op] (f[i].properties[field1], f[i].properties[field2])) {
			elem.push (f[i]);
		    }
		}
	    }
	    else {
		for (var i = 0; i < f.length; i ++) {
		    if (operators[op] (f[i].properties[field1], val)) {
			elem.push (f[i]);
		    }
		}
	    }
	    return new LayerSelector (elem);
	};
	this.color = function (c) {
	    for (var i = 0; i < elements.length; i ++) {
		var f = elements[i];
		for (var j = f.start; j < f.start + f.count; j ++) {
		    color_array[j * 4] = c.r;
		    color_array[j * 4 + 1] = c.g;
		    color_array[j * 4 + 2] = c.b;
		    color_array[j * 4 + 3] = c.a;
		}
	    }
	    color_buffer.update (color_array, 0);
	    return this;
	};

	this.highlight = function (color) {
	    for (var i = 0; i < elements.length; i ++) {
		var f = elements[i];
		for (var j = f.start; j < f.start + f.count; j ++) {
		    back_array[j * 4] = color_array[j * 4];
		    back_array[j * 4 + 1] = color_array[j * 4 + 1];
		    back_array[j * 4 + 2] = color_array[j * 4 + 2];
		    back_array[j * 4 + 3] = color_array[j * 4 + 3];
		}
	    }
	    return this.color (color);
	};
	this.unhighlight = function () {
	    for (var i = 0; i < elements.length; i ++) {
		var f = elements[i];
		for (var j = f.start; j < f.start + f.count; j ++) {
		    color_array[j * 4] = back_array[j * 4];
		    color_array[j * 4 + 1] = back_array[j * 4 + 1];
		    color_array[j * 4 + 2] = back_array[j * 4 + 2];
		    color_array[j * 4 + 3] = back_array[j * 4 + 3];
		}
	    }
	    color_buffer.update (color_array, 0);
	    return this;
	};

	this.click = function (func) {
	    
	};
    };

    this.features = function () {
	return new LayerSelector (features);
    };

    this.properties = function () {
	return properties;
    }

    this.search = function (box) {
	var min = box.min;
	var max = box.max;
	var elem = tree.search (min, max);
	return new LayerSelector (elem);
    };

    this.mouseover = function (func) {
	engine.manager.bind ('mouseover', this, func);
    };

    this.mouseout = function (func) {
	engine.manager.bind ('mouseout', this, func);
    };

    this.click = function (func) {
	engine.manager.bind ('click', this, func);
    };

    this.style = function (id, key, value) {

    };
    
    
    var count = 0;
    this.draw = function (engine, dt, select) {
	if (num_points > 0) {
	    gl.useProgram (point_shader);

	    point_shader.data ('screen', engine.camera.mat3);
	    point_shader.data ('pos', point_buffer);
	    point_shader.data ('circle_in', unit_buffer);
	    if (select)
		point_shader.data ('color_in', id_buffer);
	    else
		point_shader.data ('color_in', color_buffer);
	    point_shader.data ('select', select);

	    point_shader.data ('aspect', engine.canvas.width () / engine.canvas.height ());
	    point_shader.data ('pix_w', 2.0 / engine.canvas.width ());
	    point_shader.data ('rad', 5);

	    point_shader.data ('glyph', circle_tex);
	    

	    point_shader.data ('zoom', 1.0 / engine.camera.level);

	    gl.drawArrays (gl.TRIANGLES, 0, point_buffer.numItems); 
	    //gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, elem_buffer);
	    //gl.drawElements (gl.TRIANGLES, elem_buffer.numItems, gl.UNSIGNED_SHORT, 0);
	    //gl.bindBuffer (gl.ARRAY_BUFFER, null);
	}
	if (num_polys > 0) {
	    gl.useProgram (poly_shader);
	    
	    poly_shader.data ('screen', engine.camera.mat3);
	    poly_shader.data ('pos', poly_buffer);
	    if (select)
		poly_shader.data ('color_in', id_buffer);
	    else
		poly_shader.data ('color_in', color_buffer);

	    //gl.drawArrays (gl.TRIANGLES, 0, key_count * 3); 
	    gl.drawArrays (gl.TRIANGLES, 0, poly_buffer.numItems); 
	}
    };
};*/