var INITIAL_POINTS = 1024;

var point_shader = null;

function PointRenderer (engine, layer) {
    if (!point_shader) {
	point_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/point');
    }

    // The required buffers for rendering
    var buffers = new Buffers (engine.gl, INITIAL_POINTS);
    buffers.create ('vert', 2);
    buffers.create ('unit', 2);
    buffers.create ('color', 3);
    buffers.create ('alpha', 1);

    // A list of views of the object
    var views = [];
    
    // Rendering class for an individual point
    var PointView = function (feature) {
        // The start index of the buffer
        var start;
        
        // The number of vertices in the buffer for this feature
        var count;
        
        // Instructions on how to write to the buffers for specific styles
        var style_map = {
            'fill': function (color) {
	        buffers.repeat ('color', color.array, start, count);                
            },
            'opacity': function (opacity) {
	        buffers.repeat ('alpha', [opacity], start, count);
            }
        };

        // Update the buffers for a specific property
        this.update = function (key) {
            var value = derived_style (feature, layer, key);
            if (!value)
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

	var total_points = feature_geom.length;
	count = 6 * total_points;
	start = buffers.alloc (count);

	$.each (feature_geom, function (index, point) {
	    buffers.repeat ('vert', point, start + index * 6, 6);
	    buffers.write ('unit', unit, start + index * 6, 6);
	});

        this.update_all ();
    };

    this.create = function (feature_geom, feature_style) {
        var view = new PointView (feature_geom, feature_style);
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
	buffers.update ();

	gl.useProgram (point_shader);
        
	point_shader.data ('screen', engine.camera.mat3);

	point_shader.data ('pos', buffers.get ('vert'));
	point_shader.data ('circle_in', buffers.get ('unit'));

	point_shader.data ('color_in', buffers.get ('color'));  
	point_shader.data ('alpha_in', buffers.get ('alpha')); 

	point_shader.data ('aspect', engine.canvas.width () / engine.canvas.height ());
	point_shader.data ('pix_w', 2.0 / engine.canvas.width ());
	point_shader.data ('rad', 5);
        
	//point_shader.data ('glyph', circle_tex);
        
	point_shader.data ('zoom', 1.0 / engine.camera.level);
        
	gl.drawArrays (gl.TRIANGLES, 0, buffers.count ()); 
    };
};
