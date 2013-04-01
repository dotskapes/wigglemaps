var INITIAL_POLYGONS = 1024;

var PolygonRenderer = function (engine) {
    FeatureRenderer.call (this, engine);

    if (!(engine.shaders.polygon)) {
        engine.shaders.polygon = makeProgram (engine.gl, BASE_DIR + 'shaders/poly');
    }
    var poly_shader = engine.shaders.polygon;

    var fill_buffers = new Buffers (engine, INITIAL_POLYGONS);
    fill_buffers.create ('vert', 2);
    fill_buffers.create ('color', 3);
    fill_buffers.create ('alpha', 1);

    var PolygonView = function (feature_geom, style_func) {
        FeatureView.call (this, feature_geom, style_func);

        //var lines = line_renderer.create (feature_geom);
        //this.children.push (lines);

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
            if (count == 100) {
                console.log ("Rendering Polygon Failed: Skipping Interior");
                p = [];
            }
            
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
    };

    this.View = PolygonView;

    this.update = function (dt) {
        fill_buffers.update ();
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
    };
};
