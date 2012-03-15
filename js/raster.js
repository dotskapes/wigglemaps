var raster_shader = null;

function KML (data) {
    var bounds = $ (data).find ('LatLonBox');
    var min = new vect (parseFloat (bounds.find ('west').text ()), parseFloat (bounds.find ('south').text ()));
    var max = new vect (parseFloat (bounds.find ('east').text ()), parseFloat (bounds.find ('north').text ()));
    var url = $ (data).find ('GroundOverlay Icon href').text ();
    Raster.call (this, url, min, max);
};

function Raster (url, min, max) {
    if (!raster_shader)
	raster_shader = makeProgram (BASE_DIR + '/shaders/raster');

    console.log (url);
    var image = getTexture (url);
    
    var tex_buffer = staticBuffer (rectv (new vect (0, 1), new vect (1, 0)), 3);
    var pos_buffer = staticBuffer (rectv (min, max), 3);
    
    this.draw = function (engine, dt) {
	gl.useProgram (raster_shader);

	raster_shader.data ('screen', engine.camera.mat3);
	raster_shader.data ('pos', pos_buffer);
	raster_shader.data ('tex_in', tex_buffer);

	raster_shader.data ('sampler', image);

	gl.drawArrays (gl.TRIANGLES, 0, pos_buffer.numItems); 
    };
};