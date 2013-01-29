var INITIAL_POLYGONS = 1024;

var poly_shader = null;

function PolygonRenderer (engine, layer) {
    if (!poly_shader) {
	poly_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/poly');
    }

    var line_renderer = new LineRenderer (engine, layer);

    var fill_buffers = new Buffers (engine.gl, INITIAL_POLYGONS);
    fill_buffers.create ('vert', 2);
    fill_buffers.create ('color', 3);
    fill_buffers.create ('alpha', 1);

    var views = [];

    var PolygonView = function (feature) {

        var lines = line_renderer.create (feature);

        var fill_start;

        var fill_count;

        var style_map = {
            'fill': function (color) {
	        fill_buffers.repeat ('color', color.array, fill_start, fill_count);
            },
            'fill-opacity': function (opacity) {
	        fill_buffers.repeat ('alpha', [opacity], fill_start, fill_count);
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

    this.create = function (feature_geom, feature_style) {
        var view = new PolygonView (feature_geom, feature_style);
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
