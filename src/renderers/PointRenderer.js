var INITIAL_POINTS = 1024;

var unit = rect (0, 0, 1, 1);

function PointRenderer (engine, layer) {
    FeatureRenderer.call (this, engine, layer);

    if (!(engine.shaders['point'])) {
        engine.shaders['point'] = makeProgram (engine.gl, BASE_DIR + 'shaders/point');
    }
    var point_shader = engine.shaders['point'];
    
    // A value greater than or equal to the maximum radius of each point
    var max_rad = 10.0;

    // The required buffers for rendering
    var buffers = new Buffers (engine.gl, INITIAL_POINTS);
    buffers.create ('vert', 2);
    buffers.create ('unit', 2);
    buffers.create ('stroke_width', 1);
    buffers.create ('rad', 1);
    buffers.create ('fill_color', 3);
    buffers.create ('fill', 1);
    buffers.create ('stroke_color', 3);
    buffers.create ('stroke', 1);
    buffers.create ('alpha', 1);

    // Rendering class for an individual point
    var PointView = function (feature) {
        FeatureView.call (this, feature, layer, engine);

        // The start index of the buffer
        var start;
        
        // The number of vertices in the buffer for this feature
        var count;
        
        // Instructions on how to write to the buffers for specific styles
        this.style_map = {
            'fill': function (color) {
                if (color == 'none') {
	            buffers.repeat ('fill', [-.75], start, count);
                }
                else {
	            buffers.repeat ('fill', [.75], start, count);
	            buffers.repeat ('fill_color', color.array, start, count);                                }
            },
            'opacity': function (opacity) {
	        buffers.repeat ('alpha', [opacity], start, count);
            },
            'radius': function (rad) {
                if (rad > max_rad)
                    max_rad = rad;
                buffers.repeat ('rad', [rad], start, count);
            },
            'stroke': function (color) {
                if (color == 'none') {
	            buffers.repeat ('stroke', [-.75], start, count);
                }
                else {
	            buffers.repeat ('stroke', [.75], start, count);
	            buffers.repeat ('stroke_color', color.array, start, count);
                }
            },
            'stroke-width': function (width) {
                buffers.repeat ('stroke_width', [width], start, count);                
            }
        };
        
        var feature_geom = feature.geom;

	var total_points = feature_geom.length;
	count = 6 * total_points;
	start = buffers.alloc (count);

	$.each (feature_geom, function (index, point) {
	    buffers.repeat ('vert', point, start + index * 6, 6);
	    buffers.write ('unit', unit, start + index * 6, 6);
	});

        this.update_all ();
    };

    this.view_factory = function (feature) {
        return new PointView (feature);
    };

    this.draw = function () {
        var gl = engine.gl;

	buffers.update ();

	gl.useProgram (point_shader);
        
	point_shader.data ('screen', engine.camera.mat3);

	point_shader.data ('pos', buffers.get ('vert'));
	point_shader.data ('circle_in', buffers.get ('unit'));

	point_shader.data ('color_in', buffers.get ('fill_color'));  
	point_shader.data ('stroke_color_in', buffers.get ('stroke_color'));  
	point_shader.data ('alpha_in', buffers.get ('alpha')); 

        point_shader.data ('fill_in', buffers.get ('fill'));
        point_shader.data ('stroke_in', buffers.get ('stroke'));

	point_shader.data ('aspect', engine.canvas.width () / engine.canvas.height ());
	point_shader.data ('pix_w', 2.0 / engine.canvas.width ());
	point_shader.data ('rad', buffers.get ('rad'));

	point_shader.data ('stroke_width_in', buffers.get ('stroke_width'));

	point_shader.data ('max_rad', max_rad);
        
	//point_shader.data ('glyph', circle_tex);
        
	gl.drawArrays (gl.TRIANGLES, 0, buffers.count ()); 
    };
};
