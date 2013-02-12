var OMEGA = Math.PI / 4;

var hillshade_shader = null;
function Hillshade (data) {
    if (!hillshade_shader)
	hillshade_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/hillshade');

    var bounds = $ (data).find ('LatLonBox');
    var min = new vect (parseFloat (bounds.find ('west').text ()), parseFloat (bounds.find ('south').text ()));
    var max = new vect (parseFloat (bounds.find ('east').text ()), parseFloat (bounds.find ('north').text ()));
    var url = $ (data).find ('GroundOverlay Icon href').text ();
    //var min = data.min;
    //var max = data.max;
    //var url = data.url;
    var ready = false;
    var image = getTexture (engine.gl, url, function () {
	ready = true;
    });

    this.ready = function () {
	return ready;
    };

    var tex_buffer = staticBuffer (engine.gl, rectv (new vect (0, 1), new vect (1, 0)), 2);
    var pos_buffer = staticBuffer (engine.gl, rectv (min, max), 2);

    var azimuth = 315.0;

    this.initialize = function (engine) {

    };

    this.draw = function (engine, dt) {
	if (!ready)
	    return;
	gl.useProgram (hillshade_shader);

	//azimuth += (OMEGA / (2 * Math.PI)) * dt;
	while (azimuth >= 1.0)
	    azimuth -= 1.0;
	hillshade_shader.data ('azimuth', azimuth);
	hillshade_shader.data ('altitude', (Math.PI / 4) / (2 * Math.PI));


	hillshade_shader.data ('screen', engine.camera.mat3);
	hillshade_shader.data ('pos', pos_buffer);
	hillshade_shader.data ('tex_in', tex_buffer);

	hillshade_shader.data ('elevation', image);
	//hillshade_shader.data ('background', base_west.image);

	var size = vect.sub (engine.camera.screen (max), engine.camera.screen (min));
	
	//hillshade_shader.data ('pix_w', 2.0 / engine.canvas.width ());
	//hillshade_shader.data ('pix_h', 2.0 / engine.canvas.height ());
	hillshade_shader.data ('pix_w', 1.0 / size.x);
	hillshade_shader.data ('pix_h', 1.0 / size.y);

	gl.drawArrays (gl.TRIANGLES, 0, pos_buffer.numItems); 

	return azimuth;
    };
};
