var raster_shader = null;
function Raster (url, min, max) {
    var raster_shader;
    var tex_buffer, pos_buffer;

    var layer_initialized = false;

    this.id = new_feature_id ();

    var tex_ready = false;

    this.initialize = function (engine) {
        if (!raster_shader)
            raster_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/raster');

        this.image = getTexture (engine.gl, url, function () {
            tex_ready = true;
        });
        
        tex_buffer = staticBuffer (engine.gl, rectv (new vect (0, 1), new vect (1, 0)), 2);
        pos_buffer = staticBuffer (engine.gl, rectv (min, max), 2);
        
        layer_initialized = true;
    };

    this.draw = function (engine, dt, select) {
        var gl = engine.gl;

        if (!layer_initialized)
            this.initialize (engine);

        if (!tex_ready)
            return;

        gl.useProgram (raster_shader);

        raster_shader.data ('screen', engine.camera.mat3);
        raster_shader.data ('pos', pos_buffer);
        raster_shader.data ('tex_in', tex_buffer);

        raster_shader.data ('sampler', this.image);

        gl.drawArrays (gl.TRIANGLES, 0, pos_buffer.numItems); 
    };
};
