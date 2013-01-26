var poly_shader = null;


//var default_poly_color = new Color (0, 0, 1, 1);

var triangulate_polygon = function (elem) {
    var poly = [];
    for (var k = 0; k < elem.length; k++) {
	var p = [];
	//for (var i = elem[k].length - 1; i >= 1; i --) {
	for (var i = 1; i < elem[k].length; i ++) {
	    p.push (rand_map (elem[k][i][0], elem[k][i][1]));
	}
	p.push (poly[0]);
	poly.push (p);
    }
    return trapezoid_polygon (poly); 
};

function PolygonLayer (prop) {
    if (!prop)
	prop = {};
    if (!prop.style)
	prop.style = {};
    var default_poly_fill, default_poly_stroke, default_poly_fill_alpha, default_poly_stroke_alpha;
    if ('fill' in prop.style)
	default_poly_fill = prop.style['fill'];
    else
	default_poly_fill = new Color (.02, .44, .69, 1);

    if ('stroke' in prop.style)
	default_poly_stroke = prop.style['stroke'];
    else
	default_poly_stroke = new Color (.02, .44, .69, 1);

    if ('fill-opacity' in prop.style)   
	default_poly_fill_alpha = prop.style['fill-opacity'];
    else
	default_poly_fill_alpha = .5;

    if ('stroke-opacity' in prop.style)   
	default_poly_stroke_alpha = prop.style['stroke-opacity'];
    else
	default_poly_stroke_alpha = 1.0;

    var initialized = false;
    
    this.id = new_feature_id ();

    var fill_buffers, stroke_buffers;
    
    var layer = this;

    function Polygon (prop) {
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
	
	var fill_start, fill_count;
	var stroke_start, stroke_count = 0;

	var set_color = function () {
	    var color;
	    if (('fill' in _style))
		color = _style['fill'];
	    else
		color = layer.style ('fill');
	    fill_buffers.repeat ('color', color.array, fill_start, fill_count);

	    if (('stroke' in _style))
		color = _style['stroke'];
	    else
		color = layer.style ('stroke');
	    stroke_buffers.repeat ('color', color.array, stroke_start, stroke_count);
	};

	var set_alpha = function () {
	    //layer.alpha_front (_style['opacity'], start, count);
	    var opacity;
	    if (('fill-opacity' in _style))
		opacity = _style['fill-opacity'];
	    else
		opacity = layer.style ('fill-opacity');
	    
	    fill_buffers.repeat ('alpha', [opacity], fill_start, fill_count);

	    if ('stroke-opacity' in _style)
		opacity = _style['stroke-opacity'];
	    else
		opacity = layer.style ('stroke-opacity');
	    stroke_buffers.repeat ('alpha', [opacity], stroke_start, stroke_count);
	};
	
	var min = new vect (Infinity, Infinity);
	var max = new vect (-Infinity, -Infinity);
	$.each (this.geom, function (i, poly) {
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
	this.bounds = new Box (min, max);

        this.initialize = function () {
	    var simple = [];
	    fill_count = 0;
	    $.each (this.geom, function (i, poly) {
                // Begin temp error handling code
                var p;
	        var count = 0;
	        while (count < 100) {
		    try {
                        p = triangulate_polygon (poly);
                        break;
		    } catch (e) {
		        count ++;
		    }
	        }
	        if (count == 100)
                    throw "Rendering Polygon Failed";
                
                // End temp error handling code
                
	        //var p = triangulate_polygon (poly);
                
	        fill_count += p.length / 2;
	        simple.push (p);
	    });

	    fill_start = fill_buffers.alloc (fill_count);
	    var current = fill_start;
            
	    $.each (simple, function (i, p) {	
	        var count = p.length / 2;;
	        fill_buffers.write ('vert', p, current, count);
	        current += count;
	    });
            
            
	    stroke_start = stroke_buffers.count ();
	    $.each (this.geom, function (i, poly) {
	        for (var i = 0; i < poly.length; i ++) {
		    stroke_count += poly[i].length * 6;    
		    draw_lines (stroke_buffers, poly[i]);
	        }
	    });

	    set_color ();
	    set_alpha ();
        };

	/*stroke_count = this.geom[0].length * 6;
	stroke_start = draw_lines (stroke_buffers, this.geom[0]);
	for (var i = 1; i < this.geom.length; i ++) {
	    stroke_count += this.geom[i].length * 6;    
	    draw_lines (stroke_buffers, this.geom[i]);
	}*/

	var _style = {};
	copy_value (_style, prop.style, 'fill', hex_to_color);
	copy_value (_style, prop.style, 'stroke', hex_to_color);
	copy_value (_style, prop.style, 'fill-opacity', parseFloat);
	copy_value (_style, prop.style, 'stroke-opacity', parseFloat);

	this.style = function (key, val) {
	    if (arguments.length == 1)
		return _style[key];
	    _style[key] = val;
	    if (key == 'fill') {
		set_color ();
	    }
	    if (key == 'stroke') {
		set_color ();
	    }	    
	    if (key == 'fill-opacity') {
		set_alpha ();
	    }
	    if (key == 'stroke-opacity') {
		set_alpha ();
	    }
	};
    };	

    var features = {};
    var num_polys = 0;
    var tree = null;
    
    this.features = function () {
	var elem = [];
	for (key in features) {
	    elem.push (features[key]);
	}
	return new LayerSelector (elem);
    };

    this.search = function (box) {
	var min = box.min;
	var max = box.max;
	var elem = tree.search (min, max);
	var keys = {};
	$.each (elem, function (i, p) {
	    keys[p.key] = true;
	});
	var results = [];
	for (var k in keys) {
	    results.push (features[k]);
	}
	return new LayerSelector (results);
    };

    this.contains = function (p) {
	var s = 0;
	var results = [];
	for (var i in features) {
	    var feature = features[i];
	    if (feature.bounds.contains (p)) {
		s ++;
		for (var j = 0; j < feature.geom.length; j ++) {
		    var poly = feature.geom[j];
		    var count = 0;
		    $.each (poly, function (k, ring) {
			for (var l = 0; l < ring.length; l ++) {
			    var m = (l + 1) % ring.length;
			    if ((p.y - ring[l][1]) / (p.y - ring[m][1]) < 0) {
				var inf = new vect (720, p.y);
				var v1 = new vect (ring[l][0], ring[l][1]);
				var v2 = new vect (ring[m][0], ring[m][1]);
				if (vect.intersects (p, inf, v1, v2))
				    count ++
			    }
			}
		    });
		    if ((count % 2) == 1) {
			results.push (feature);
		    }
		}
	    }
	}
	return new LayerSelector (results);
    };

    this.aggregate = function (points, callback) {
	points.features ().each (function (i, f) {
	    $.each (f.geom, function (j, point) {
		var poly = layer.contains (new vect (point[0], point[1]));
		if (poly) {
		    callback (poly, f);
		}

	    });
	});
    };

    this.bounds = null;

    var dirty = false;

    this.append = function (data) {
	var p = new Polygon (data);
	if (this.bounds)
	    this.bounds.union (p.bounds);
	else
	    this.bounds = p.bounds.clone ();
	features[p.id] = p;
	num_polys ++;
	dirty = true;
	tree = null;
        
        if (initialized)
            p.initialize ();
    };
    
    this.style = function (key, value) {
	if (arguments.length > 1)
	    throw "Not Implemented";
	if (key == 'fill')
	    return default_poly_fill;
	if (key == 'stroke')
	    return default_poly_stroke;
	if (key == 'fill-opacity')
	    return default_poly_fill_alpha;
	if (key == 'stroke-opacity')
	    return default_poly_stroke_alpha;
	return null;
    };

    var over_func = null, out_func = null;
    this.mouseover = function (func) {
	over_func = func;
    }

    this.mouseout = function (func) {
	out_func = func;
    }

    var current_over = {};
    this.update_move = function (engine, p) {
	if (over_func || out_func) {
	    var c = this.contains (p);
	    var new_over = {};
	    if (c) {
		c.each (function (i, f) {
		    new_over[f.id] = f;
		});
	    }
	    for (var key in current_over) {
		if (!(key in new_over) && out_func) 
		    out_func (current_over[key]);
	    }
	    for (var key in new_over) {
		if (!(key in current_over) && over_func) 
		    over_func (new_over[key]);
	    }
	    current_over = new_over;
	    /*if (c != null && c.get (0) != current_over.get (0)) {
		if (out_func && current_over)
		    out_func (current_over);
		if (over_func && c)
		    over_func (c);
		current_over = c;
	    }*/
	}
    };
    this.force_out = function (engine) {
	for (var key in current_over) {
	    if (out_func)
		out_func (current_over[key]);
	}
	current_over = {};
	/*if (out_func && current_over) 
	    out_func (current_over);
	current_over = null;*/
    };

    this.initialize = function (engine) {
        if (!poly_shader) {
	    poly_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/poly');
        }
        if (!line_shader) {
	    line_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/line');
        }

        fill_buffers = new Buffers (engine.gl, 1024);
        fill_buffers.create ('vert', 2);
        fill_buffers.create ('color', 3);
        fill_buffers.create ('alpha', 1);
        
        stroke_buffers = new Buffers (engine.gl, 1024);
        stroke_buffers.create ('vert', 2);
        stroke_buffers.create ('norm', 2);
        stroke_buffers.create ('color', 3);
        //stroke_buffers.create ('unit', 2);
        stroke_buffers.create ('alpha', 1);

        //for (var i = 0; i < features.length; i ++) {
        for (var key in features) {
            features[key].initialize ();
        }
        initialized = true;
    };

    this.draw = function (engine, dt, select) {
	if (select)
	    return;

        var gl = engine.gl;

	fill_buffers.update (dt);	
	stroke_buffers.update (dt);	
	if (dirty) {
	    var r_points = [];
	    for (var key in features) {
		$.each (features[key].geom, function (i, poly) {
		    $.each (poly, function (j, ring) {
			$.each (ring, function (k, pair) {
			    r_points.push ({
				key: key,
				x: pair[0],
				y: pair[1]
			    });			
			});
		    });
		});
	    }
	    tree = new RangeTree (r_points);
	    dirty = false;
	}

	gl.useProgram (poly_shader);

	poly_shader.data ('screen', engine.camera.mat3);
	poly_shader.data ('pos', fill_buffers.get ('vert'));
	poly_shader.data ('color_in', fill_buffers.get ('color'));  
	poly_shader.data ('alpha_in', fill_buffers.get ('alpha'));  
	
	gl.drawArrays (gl.TRIANGLES, 0, fill_buffers.count ());


	gl.useProgram (line_shader);
	
	line_shader.data ('screen', engine.camera.mat3);
	line_shader.data ('pos', stroke_buffers.get ('vert'));
	line_shader.data ('norm', stroke_buffers.get ('norm'));
	line_shader.data ('color_in', stroke_buffers.get ('color'));
	line_shader.data ('alpha_in', stroke_buffers.get ('alpha'));
	//line_shader.data ('circle_in', stroke_buffers.get ('unit'));
	
	line_shader.data ('px_w', 2.0 / engine.canvas.width ());
	line_shader.data ('px_h', 2.0 / engine.canvas.height ());
	
	gl.drawArrays (gl.TRIANGLES, 0, stroke_buffers.count ()); 
    };
};
