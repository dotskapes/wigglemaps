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
