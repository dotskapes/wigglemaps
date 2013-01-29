var INITIAL_LINES = 1024;

var line_shader = null;

function LineRenderer (engine, layer) {
    if (!line_shader) {
	line_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/line');        
    }

    var stroke_buffers = new Buffers (engine.gl, 1024);
    stroke_buffers.create ('vert', 2);
    stroke_buffers.create ('norm', 2);
    stroke_buffers.create ('color', 3);
    //stroke_buffers.create ('unit', 2);
    stroke_buffers.create ('alpha', 1);

    var views = [];

    var LineView = function (feature) {
        
	var stroke_start = stroke_buffers.count ();
        var stroke_count = 0;

        var style_map = {
            'stroke': function (color) {
	        stroke_buffers.repeat ('color', color.array, stroke_start, stroke_count);
            },
            'stroke-opacity': function (opacity) {
	        stroke_buffers.repeat ('alpha', [opacity], stroke_start, stroke_count);
            }
        };

        // Update the buffers for a specific property
        this.update = function (key) {
            var value = derived_style (feature, layer, key);
            if (value === null)
                throw "Style property does not exist";
            style_map[key] (value);
        };
        
        // Update all buffers for all properties
        this.update_all = function () {
            for (var key in style_map) {
                this.update (key);
            }
        };

	$.each (feature.geom, function (i, poly) {
	    for (var i = 0; i < poly.length; i ++) {
		stroke_count += poly[i].length * 6;    
		draw_lines (stroke_buffers, poly[i]);
	    }
	});

        this.update_all ();
    };

    this.create = function (feature_geom, feature_style) {
        var view = new LineView (feature_geom, feature_style);
        views.push (view);
        return view;
    };

    // Update all features with a style property
    this.update = function (key) {
        for (var i = 0; i < views.length; i ++) {
            views[i].update (key);
        }
    };

    this.draw = function () {
	stroke_buffers.update ();	

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
    }

};
