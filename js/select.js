var sel_box_shader = null;
function SelectionBox (engine) {
    if (!sel_box_shader)
	sel_box_shader = makeProgram ('http://zk.healthscapes.org/map/static/shaders/selbox');
    var enabled = false;
    var dragging = false;
    var start = null;
    var end = null;
    var sel_buffer = dynamicBuffer (6, 3);
    var bound_buffer = staticBuffer (rect (0, 0, 1, 1), 3);
    var reset_rect = function () {
	sel_buffer.update (rectv (start, end), 0);
    };
    $ (engine.canvas).bind ('mousedown', function (event) {
	if (!enabled)
	    return;
	dragging = true;
	show = true;
	start = engine.camera.percent (new vect (event.clientX, event.clientY));
	end = start;
	reset_rect ();
    });

    $ (document).bind ('mouseup', function (event) {
	if (!enabled)
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
	br_precip.search (min, max).color (new Color (0, 1, 0, 1));
	dragging = false;
    });

    $(document).bind ('click', function (event) {
	if (!enabled)
	    return;
	show = false;
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
	if (dragging) {
	    gl.useProgram (sel_box_shader);
	    
	    sel_box_shader.data ('pos', sel_buffer);
	    sel_box_shader.data ('edge_in', bound_buffer);
	    
	    gl.drawArrays (gl.TRIANGLES, 0, sel_buffer.numItems); 
	}
    };
};