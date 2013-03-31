function SelectionBox (engine) {
    var sel_box_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/selbox');
    var enabled = false;
    var dragging = false;
    var start = null;
    var end = null;
    var sel_buffer = dynamicBuffer (engine.gl, 6, 2);
    var bound_buffer = staticBuffer (engine.gl, rect (0, 0, 1, 1), 2);
    var reset_rect = function () {
        sel_buffer.update (rectv (start, end), 0);
        engine.dirty = true;
    };
    engine.canvas.bind ('mousedown', function (event) {
        if (!enabled)
            return;
        dragging = true;
        start = engine.camera.percent (new vect (event.clientX, event.clientY));
        end = start;
        reset_rect ();
    });

    var release_func = function ()  {};
    this.select = function (func) {
        release_func = func;
    };

    $ (document).bind ('mouseup', function (event) {
        if (!enabled)
            return;
        if (!dragging)
            return;
        var min = engine.camera.project (engine.camera.pixel (start));
        var max = engine.camera.project (engine.camera.pixel (end));
        if (min.x > max.x) {
            var tmp = min.x;
            min.x = max.x;
            max.x = tmp;
        }
        if (min.y > max.y) {
            var tmp = min.y;
            min.y = max.y;
            max.y = tmp;
        }
        dragging = false;
        release_func (new Box (min, max));
        engine.dirty = true;
    });

    $(document).bind ('click', function (event) {
        if (!enabled)
            return;
    });

    $(document).bind ('mousemove', function (event) {
        if (!enabled)
            return;
        if (dragging) {
            end = engine.camera.percent (new vect (event.clientX, event.clientY));          
            reset_rect ();
        }
    });

    this.enable = function () {
        enabled = true;
    };

    this.disable = function () {
        enabled = false;
    }
    
    this.draw = function (engine, dt) {
        var gl = engine.gl;
        if (dragging) {
            gl.useProgram (sel_box_shader);
            
            sel_box_shader.data ('pos', sel_buffer);
            sel_box_shader.data ('edge_in', bound_buffer);
            
            gl.drawArrays (gl.TRIANGLES, 0, sel_buffer.numItems); 
        }
    };
};
