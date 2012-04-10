var raster_shader = null;

function KML (data) {
    var bounds = $ (data).find ('LatLonBox');
    var min = new vect (parseFloat (bounds.find ('west').text ()), parseFloat (bounds.find ('south').text ()));
    var max = new vect (parseFloat (bounds.find ('east').text ()), parseFloat (bounds.find ('north').text ()));
    var url = $ (data).find ('GroundOverlay Icon href').text ();
    return new Raster (url, min, max);
};

function Raster (url, min, max) {
    if (!raster_shader)
	raster_shader = makeProgram (BASE_DIR + 'shaders/raster');

    this.image = getTexture (url);
    
    var tex_buffer = staticBuffer (rectv (new vect (0, 1), new vect (1, 0)), 2);
    var pos_buffer = staticBuffer (rectv (min, max), 2);
    
    this.draw = function (engine, dt, select) {
	if (select)
	    return;
	gl.useProgram (raster_shader);

	raster_shader.data ('screen', engine.camera.mat3);
	raster_shader.data ('pos', pos_buffer);
	raster_shader.data ('tex_in', tex_buffer);

	raster_shader.data ('sampler', this.image);

	gl.drawArrays (gl.TRIANGLES, 0, pos_buffer.numItems); 
    };
};

var altitude_shader = null;
function Altitude (data) {
    if (!altitude_shader)
	altitude_shader = makeProgram (BASE_DIR + 'shaders/altitude');

    var bounds = $ (data).find ('LatLonBox');
    var min = new vect (parseFloat (bounds.find ('west').text ()), parseFloat (bounds.find ('south').text ()));
    var max = new vect (parseFloat (bounds.find ('east').text ()), parseFloat (bounds.find ('north').text ()));
    var url = $ (data).find ('GroundOverlay Icon href').text ();
    var image = getTexture (url);

    var tex_buffer = staticBuffer (rectv (new vect (0, 1), new vect (1, 0)), 2);
    var pos_buffer = staticBuffer (rectv (min, max), 2);

    this.draw = function (engine, dt, select) {
	if (select)
	    return;
	gl.useProgram (altitude_shader);

	altitude_shader.data ('screen', engine.camera.mat3);
	altitude_shader.data ('pos', pos_buffer);
	altitude_shader.data ('tex_in', tex_buffer);

	altitude_shader.data ('elevation', image);
	altitude_shader.data ('background', base_west.image);

	var size = vect.sub (engine.camera.screen (max), engine.camera.screen (min));
	
	//altitude_shader.data ('pix_w', 2.0 / engine.canvas.width ());
	//altitude_shader.data ('pix_h', 2.0 / engine.canvas.height ());
	altitude_shader.data ('pix_w', 1.0 / size.x);
	altitude_shader.data ('pix_h', 1.0 / size.y);

	gl.drawArrays (gl.TRIANGLES, 0, pos_buffer.numItems); 
    };
};

var elevation_shader = null;
function Elevation (data) {
    if (!elevation_shader)
	elevation_shader = makeProgram (BASE_DIR + 'shaders/elevation');

    var bounds = $ (data).find ('LatLonBox');
    var min = new vect (parseFloat (bounds.find ('west').text ()), parseFloat (bounds.find ('south').text ()));
    var max = new vect (parseFloat (bounds.find ('east').text ()), parseFloat (bounds.find ('north').text ()));
    var url = $ (data).find ('GroundOverlay Icon href').text ();
    var image = getTexture (url);

    var tex_buffer = staticBuffer (rectv (new vect (0, 1), new vect (1, 0)), 2);
    var pos_buffer = staticBuffer (rectv (min, max), 2);

    this.draw = function (engine, dt, select) {
	if (select)
	    return;
	gl.useProgram (elevation_shader);

	elevation_shader.data ('screen', engine.camera.mat3);
	elevation_shader.data ('pos', pos_buffer);
	elevation_shader.data ('tex_in', tex_buffer);

	elevation_shader.data ('elevation', image);

	var size = vect.sub (engine.camera.screen (max), engine.camera.screen (min));
	
	gl.drawArrays (gl.TRIANGLES, 0, pos_buffer.numItems); 
    };
};