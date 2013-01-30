var INITIAL_LINES = 1024;

var line_shader = null;

function LineRenderer (engine, layer) {
    FeatureRenderer.call (this, engine, layer);
    if (!line_shader) {
	line_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/line');        
    }

    var stroke_buffers = new Buffers (engine.gl, 1024);
    stroke_buffers.create ('vert', 2);
    stroke_buffers.create ('norm', 2);
    stroke_buffers.create ('color', 3);
    //stroke_buffers.create ('unit', 2);
    stroke_buffers.create ('alpha', 1);

    var LineView = function (feature) {
        FeatureView.call (this, feature, layer);
        
	var stroke_start = stroke_buffers.count ();
        var stroke_count = 0;

        this.style_map = {
            'stroke': function (color) {
	        stroke_buffers.repeat ('color', color.array, stroke_start, stroke_count);
            },
            'stroke-opacity': function (opacity) {
	        stroke_buffers.repeat ('alpha', [opacity], stroke_start, stroke_count);
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

    this.view_factory = function (feature) {
        return new LineView (feature, layer);
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
