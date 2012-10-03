function Texture (options) {
    var settings = copy (options);
    default_model (settings, {
	mag_filter: gl.LINEAR,
	min_filter: gl.LINEAR,
	wrap_s: gl.CLAMP_TO_EDGE,
	wrap_t: gl.CLAMP_TO_EDGE,
	mipmap: false
    });

    var tex = gl.createTexture ();

    var img = null;
    this.image = function (_img) {
	img = _img;
	gl.bindTexture (gl.TEXTURE_2D, tex);
	gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);  
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, settings.mag_filter);  
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, settings.min_filter);  
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, settings.wrap_s);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, settings.wrap_t);
	if (settings.mipmap)
	    gl.generateMipmap(gl.TEXTURE_2D);  
	gl.bindTexture (gl.TEXTURE_2D, null);
    };

    this.texture = function () {
	if (!img)
	    return null;
	else
	    return tex;
    };
};

function getImage (path, callback) {
    var img = new Image ();
    img.crossOrigin = '';
    img.onload = function () {
	callback (img);
    };
    img.src = path;
};
