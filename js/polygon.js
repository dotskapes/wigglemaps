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
    var default_poly_color = new Color (0, 0, 1, 1);
    
    if (!poly_shader) {
	poly_shader = makeProgram (BASE_DIR + 'shaders/poly');
    }
    this.id = new_feature_id ();
    var fill_buffers = new Buffers (1024);
    fill_buffers.create ('vert', 2);
    fill_buffers.create ('color', 3);
    fill_buffers.create ('alpha', 1);

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

	var _style = {};

	set_color ();
	set_alpha ();
    };	

    var features = {};
    var num_polys = 0;

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

	gl.useProgram (poly_shader);

	poly_shader.data ('screen', engine.camera.mat3);
	poly_shader.data ('pos', fill_buffers.get ('vert'));
	poly_shader.data ('color_in', fill_buffers.get ('color'));  
	poly_shader.data ('alpha_in', fill_buffers.get ('alpha'));  
	
	gl.drawArrays (gl.TRIANGLES, 0, fill_buffers.count ());
    };
};