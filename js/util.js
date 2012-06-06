var PI = 3.14159265;

if (! ('requestAnimationFrame' in window)) {
  if ('mozRequestAnimationFrame' in window)
    requestAnimationFrame = mozRequestAnimationFrame;
  else if ('webkitRequestAnimationFrame' in window)
    requestAnimationFrame = webkitRequestAnimationFrame;
}

var default_copy = function (dst, src, key, def, cast) {
    if (key in src) {
	if (cast)
	    dst[key] = cast (src[key]);
	else
	    dst[key] = src[key];
    }
    else
	dst[key] = def;
};

var copy_value = function (dst, src, key, cast) {
    if (key in src) {
	if (cast)
	    dst[key] = cast (src[key]);
	else
	    dst[key] = src[key];
    }
};

function as_rgb (array) {
	return 'rgb(' + Math.round (array[0] * 255) + ',' + Math.round (array[1] * 255) + ',' + Math.round (array[2] * 255) + ')'
}

function Color (r, g, b, a) {
    if (r <= 1 && g <= 1 && b <= 1 && a <= 1) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
    }
    else {
	this.r = r / 255;
	this.g = g / 255;
	this.b = b / 255;
	this.a = a / 255;
    }
    
    this.array = [this.r, this.g, this.b, this.a];

    this.vect = function () {
	return this.array;
    };
};

function hex_to_color (hex) {
    var r = parseInt (hex.slice (1, 3), 16);
    var g = parseInt (hex.slice (3, 5), 16);
    var b = parseInt (hex.slice (5, 7), 16);
    return new Color (r, g, b, 255);
};

function is_list (elem) {
    if (elem == null)
	return false;
    if (elem.length == undefined)
	return false;
    for (var i = 0; i < elem.length; i ++) {
	if (!(i in elem))
	    return false;
    }
    return true;
};