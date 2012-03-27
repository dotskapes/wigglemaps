var basic_shader = null;

function RangeBar (engine, colors, bottom, top) {
    if (!basic_shader)
	basic_shader = makeProgram (BASE_DIR + 'shaders/basic');
    
    var box_width = (top.x - bottom.x) / colors.length;
    var box_height = top.y - bottom.y;
    var c = [];
    var pos = [];

    for (var i = 0; i < colors.length; i ++) {
	var min = new vect (bottom.x + box_width * i, bottom.y);
	var max = new vect (bottom.x + box_width * (i + 1), top.y);
	pos.push.apply (pos, rectv (engine.camera.percent (min), engine.camera.percent (max)));
	for (var k = 0; k < 6; k ++) {
	    c.push.apply (c, colors[i].vect ());
	}
    }

    var pos_buffer = staticBuffer (pos, 3);
    var color_buffer = staticBuffer (c, 4);
    
    this.draw = function (engine, dt, select) {
	if (select)
	    return;
	gl.useProgram (basic_shader);

	basic_shader.data ('pos', pos_buffer);
	basic_shader.data ('color_in', color_buffer);

	gl.drawArrays (gl.TRIANGLES, 0, pos_buffer.numItems); 
    };
};