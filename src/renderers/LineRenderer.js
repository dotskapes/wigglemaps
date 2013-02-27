var INITIAL_LINES = 1024;

function draw_lines (stroke_buffers, geom) {

    var vertCount = 6 * geom.length;
    var startIndex = stroke_buffers.alloc (vertCount);
    
    var unit_buffer = [-1, 1, 
                       -1, -1, 
                       1, -1,

                       -1, 1,
                       1, -1,
                       1, 1
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

    var prev = null;
    var current = next_vert ();
    var next = next_vert ();

    var prev_list = [];
    var current_list = [];
    var next_list = [];
    
    while (current) {
        prev_list.push (prev || vect.add (current, vect.sub (current, next)));
        current_list.push (current);
        next_list.push (next || vect.add (current, vect.sub (current, prev)));

        prev = current;
	current = next;
	next = next_vert ();
    }

    var prev_buffer = [];
    var current_buffer = [];
    var next_buffer = [];

    currentIndex = startIndex;

    var add_vert = function (p, c, n) {
        /*prev_buffer.push (p.x);
        prev_buffer.push (p.y);

        current_buffer.push (c.x);
        current_buffer.push (c.y);

        current_buffer.push (c.x);
        current_buffer.push (c.y);*/
        stroke_buffers.write ('prev', p.array (), currentIndex, 1);
        stroke_buffers.write ('current', c.array (), currentIndex, 1);
        stroke_buffers.write ('next', n.array (), currentIndex, 1);
        currentIndex ++;

    };
        
    for (var i = 1; i < geom.length; i ++) {
        stroke_buffers.write ('unit', unit_buffer, currentIndex, 6);

        add_vert (prev_list[i - 1], current_list[i - 1], next_list[i - 1]);
        add_vert (next_list[i - 1], current_list[i - 1], prev_list[i - 1]);
        add_vert (next_list[i], current_list[i], prev_list[i]);

        add_vert (prev_list[i - 1], current_list[i - 1], next_list[i - 1]);
        add_vert (next_list[i], current_list[i], prev_list[i]);
        add_vert (prev_list[i], current_list[i], next_list[i]);
    }
    return vertCount;
};

function LineRenderer (engine) {
    FeatureRenderer.call (this, engine);

    if (!(engine.shaders['line'])) {
        engine.shaders['line'] = makeProgram (engine.gl, BASE_DIR + 'shaders/line');
    }
    var line_shader = engine.shaders['line'];

    var stroke_buffers = new Buffers (engine.gl, 1024);
    //stroke_buffers.create ('vert', 2);
    //stroke_buffers.create ('norm', 2);
    stroke_buffers.create ('prev', 2);
    stroke_buffers.create ('current', 2);
    stroke_buffers.create ('next', 2);
    stroke_buffers.create ('unit', 2);

    stroke_buffers.create ('width', 1);
    stroke_buffers.create ('color', 3);
    stroke_buffers.create ('alpha', 1);

    //stroke_buffers.create ('unit', 2);

    var LineView = function (feature_geom, feature_style) {
        FeatureView.call (this, feature_geom, feature_style);

	var stroke_start = stroke_buffers.count ();
        var stroke_count = 0;

        this.style_map = {
            'stroke': function (color) {
	        stroke_buffers.repeat ('color', color.array, stroke_start, stroke_count);
            },
            'stroke-opacity': function (opacity) {
	        stroke_buffers.repeat ('alpha', [opacity], stroke_start, stroke_count);
            },
            'stroke-width': function (width) {
	        stroke_buffers.repeat ('width', [width], stroke_start, stroke_count);
            }
        };

        var point_cmp = function (p1, p2) {
            return ((p1[0] == p2[0]) && (p1[1] == p2[1]));
        };

	$.each (feature_geom, function (i, poly) {
	    for (var i = 0; i < poly.length; i ++) {
		//stroke_count += poly[i].length * 6;
                //draw_graph_lines (stroke_buffers, poly[i]);
                stroke_count += draw_lines (stroke_buffers, poly[i]);
                /*if (point_cmp (poly[i][0], poly[i][poly[i].length - 1]))
                    draw_map_lines (stroke_buffers, poly[i]);
                else
		    draw_graph_lines (stroke_buffers, poly[i]);*/
	    }
	});
    };

    this.View = LineView;

    this.draw = function () {
        var gl = engine.gl;
	stroke_buffers.update ();	

	gl.useProgram (line_shader);
	
	line_shader.data ('world', engine.camera.worldToPx);
	line_shader.data ('screen', engine.camera.pxToScreen);


        line_shader.data ('prev', stroke_buffers.get ('prev'));
        line_shader.data ('current', stroke_buffers.get ('current'));
        line_shader.data ('next', stroke_buffers.get ('next'));
	line_shader.data ('color_in', stroke_buffers.get ('color'));
	line_shader.data ('alpha_in', stroke_buffers.get ('alpha'));
	line_shader.data ('circle_in', stroke_buffers.get ('unit'));
	line_shader.data ('width', stroke_buffers.get ('width'));
	
	line_shader.data ('px_w', 2.0 / engine.canvas.width ());
	line_shader.data ('px_h', 2.0 / engine.canvas.height ());
	gl.drawArrays (gl.TRIANGLES, 0, stroke_buffers.count ()); 
    }

};
