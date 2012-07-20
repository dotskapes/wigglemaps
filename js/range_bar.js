var basic_shader = null;

function RangeBar (engine, colors, bottom, top, vert) {
    if (!basic_shader)
	basic_shader = makeProgram (BASE_DIR + 'shaders/basic');
    
    var c = [];
    var pos = [];

    if (!vert) {
	var box_width = Math.abs ((top.x - bottom.x) / colors.length);
	var box_height = Math.abs (top.y - bottom.y);

	for (var i = 0; i < colors.length; i ++) {
	    var min = new vect (bottom.x + box_width * i, bottom.y);
	    var max = new vect (bottom.x + box_width * (i + 1), top.y);
	    pos.push.apply (pos, rectv (engine.camera.percent (min), engine.camera.percent (max)));
	    for (var k = 0; k < 6; k ++) {
		c.push.apply (c, colors[i].vect ());
	    }
	}
    }
    else {
	var box_width = Math.abs (top.x - bottom.x);
	var box_height = Math.abs ((top.y - bottom.y) / colors.length);
	for (var i = 0; i < colors.length; i ++) {
	    var j = colors.length - 1 - i;
	    var min = new vect (bottom.x,  bottom.y + box_height * (j + 1));
	    var max = new vect (top.x, bottom.y - box_height * j);
	    console.log ('box', min, max);
	    pos.push.apply (pos, rectv (engine.camera.percent (min), engine.camera.percent (max)));
	    for (var k = 0; k < 6; k ++) {
		c.push.apply (c, colors[i].vect ());
	    }
	}
    }

    var pos_buffer = staticBuffer (pos, 2);
    var color_buffer = staticBuffer (c, 4);

    this.update = function (engine, p) {

    };
    
    this.draw = function (engine, dt, select) {
	if (select)
	    return;
	gl.useProgram (basic_shader);

	basic_shader.data ('pos', pos_buffer);
	basic_shader.data ('color_in', color_buffer);

	gl.drawArrays (gl.TRIANGLES, 0, pos_buffer.numItems); 
    };
};