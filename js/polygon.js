var poly_shader = null;

var default_poly_alpha = .5;
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

function PolygonLayer () {
    var default_poly_color = new Color (.02, .44, .69, 1);
    var default_poly_stroke = new Color (.02, .44, .69, 1);
    
    if (!poly_shader) {
	poly_shader = makeProgram (BASE_DIR + 'shaders/poly');
    }
    if (!line_shader) {
	line_shader = makeProgram (BASE_DIR + 'shaders/line');
    }
    this.id = new_feature_id ();

    var fill_buffers = new Buffers (1024);
    fill_buffers.create ('vert', 2);
    fill_buffers.create ('color', 3);
    fill_buffers.create ('alpha', 1);

    var stroke_buffers = new Buffers (1024);
    stroke_buffers.create ('vert', 2);
    stroke_buffers.create ('norm', 2);
    stroke_buffers.create ('color', 3);
    //stroke_buffers.create ('unit', 3);
    stroke_buffers.create ('alpha', 1);

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
	var stroke_start, stroke_count;

	var set_color = function () {
	    var color = _style['fill'];
	    if (!color)
		color = layer.style ('fill');
	    if (!color)
		color = default_poly_color;
	    fill_buffers.repeat ('color', color.array, fill_start, fill_count);

	    color = _style['stroke'];
	    if (!color)
		color = layer.style ('stroke');
	    if (!color)
		color = default_poly_stroke;
	    stroke_buffers.repeat ('color', color.array, stroke_start, stroke_count);
	};

	var set_alpha = function () {
	    //layer.alpha_front (_style['opacity'], start, count);
	    var opacity = _style['opacity'];
	    if (!opacity)
		opacity = layer.style ('opacity');
	    if (!opacity)
		opacity = default_poly_alpha;
	    
	    fill_buffers.repeat ('alpha', [opacity], fill_start, fill_count);
	};

	var p = triangulate_polygon (this.geom);
	fill_count = p.length / 2;
	fill_start = fill_buffers.alloc (fill_count);
	fill_buffers.write ('vert', p, fill_start, fill_count);

	stroke_count = this.geom[0].length * 6;
	stroke_start = draw_lines (stroke_buffers, this.geom[0]);
	for (var i = 1; i < this.geom.length; i ++) {
	    stroke_count += this.geom[i].length * 6;    
	    draw_lines (stroke_buffers, this.geom[i]);
	}

	var _style = {};

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
	    if (key == 'opacity') {
		set_alpha ();
	    }
	};

	set_color ();
	set_alpha ();
    };	

    var features = {};
    var num_polys = 0;
    
    this.features = function () {
	var elem = [];
	for (key in features) {
	    elem.push (features[key]);
	}
	return new LayerSelector (elem);
    };

    this.append = function (data) {
	var p = new Polygon (data);
	features[p.id] = p;
	num_polys ++;
    };
    
    this.style = function (key, value) {
	if (arguments.length > 1)
	    throw "Not Implemented";
	return null;
    };

    this.draw = function (engine, dt, select) {
	if (select)
	    return;
	fill_buffers.update (dt);	
	stroke_buffers.update (dt);	

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
	//line_shader.data ('circle_in', stroke_buffers.get ('unit'));
	
	line_shader.data ('px_w', 2.0 / engine.canvas.width ());
	line_shader.data ('px_h', 2.0 / engine.canvas.height ());
	
	gl.drawArrays (gl.TRIANGLES, 0, stroke_buffers.count ()); 
    };
};