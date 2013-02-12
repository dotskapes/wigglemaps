var INITIAL_POLYGONS = 1024;

function PolygonRenderer (engine, layer) {
    FeatureRenderer.call (this, engine, layer);

    if (!(engine.shaders['polygon'])) {
        engine.shaders['polygon'] = makeProgram (engine.gl, BASE_DIR + 'shaders/poly');
    }
    var poly_shader = engine.shaders['polygon'];

    var line_renderer = new LineRenderer (engine, layer);

    var fill_buffers = new Buffers (engine.gl, INITIAL_POLYGONS);
    fill_buffers.create ('vert', 2);
    fill_buffers.create ('color', 3);
    fill_buffers.create ('alpha', 1);

    var PolygonView = function (feature) {
        FeatureView.call (this, feature, layer, engine);

        var lines = line_renderer.create (feature);

        var fill_start;

        var fill_count;

        this.style_map = {
            'fill': function (color) {
	        fill_buffers.repeat ('color', color.array, fill_start, fill_count);
            },
            'fill-opacity': function (opacity) {
	        fill_buffers.repeat ('alpha', [opacity], fill_start, fill_count);
            }
        };

        var feature_geom = feature.geom;

	var simple = [];
	fill_count = 0;

	$.each (feature_geom, function (i, poly) {
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
	    var count = p.length / 2;
	    fill_buffers.write ('vert', p, current, count);
	    current += count;
	});

        this.update_all ();
    };

    this.view_factory = function (feature) {
        return new PolygonView (feature);
    };

    this.draw = function () {
        var gl = engine.gl;

	fill_buffers.update ();
	gl.useProgram (poly_shader);
        
	poly_shader.data ('screen', engine.camera.mat3);
	poly_shader.data ('pos', fill_buffers.get ('vert'));
	poly_shader.data ('color_in', fill_buffers.get ('color'));  
	poly_shader.data ('alpha_in', fill_buffers.get ('alpha'));  
	
	gl.drawArrays (gl.TRIANGLES, 0, fill_buffers.count ());

        line_renderer.draw ();
    };
};
