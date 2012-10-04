var PI = 3.14159265;

/*if (! ('requestAnimationFrame' in window)) {
    if ('mozRequestAnimationFrame' in window)
	requestAnimationFrame = mozRequestAnimationFrame;
    else if ('webkitRequestAnimationFrame' in window)
	requestAnimationFrame = webkitRequestAnimationFrame;
    else {
	requestAnimationFrame = function (callback) {
	    setTimeout (function () {
		callback ();
	    }, 1000 / 60);
	};
    }
}*/

function make_url (base, vars) {
    var items = [];
    for (var key in vars) {
	items.push (key + '=' + vars[key]);
    }
    return base + '?' + items.join ('&');
}

function default_model (options, model) {
    for (var key in model) {
	if (!(key in options))
	    options[key] = model[key];
    }
};

function force_model (options, model) {
    for (var key in model) {
	options[key] = model[key];
    }
};

function copy (src) {
    var dst = {};
    for (key in src)
	dst[key] = src[key];
    return dst;
};

function require (src, fields) {
    for (var i = 0; i < fields.length; i ++) {
	var key = fields[i];
	if (!(key in src))
	    throw "Key " + key + " not found";
    }
};

function copy_to (dst, src) {
    for (key in src)
	dst[key] = src[key];
};

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
};

function clamp (val, min, max) {
    return Math.min (Math.max (val, min), max);
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
    
    this.rgb = function () {
	return 'rgb(' + parseInt (this.r * 255) + ',' + parseInt (this.g * 255) + ',' + parseInt (this.b * 255) + ')';
    };
};

function icolor (r, g, b, a) {
    return new Color (clamp (r / 255, 0, 1), clamp (g / 255, 0, 1), clamp (b / 255, 0, 1), clamp (a / 255, 0, 1));
}

function fcolor (r, g, b, a) {
    return new Color (clamp (r, 0, 1), clamp (g, 0, 1), clamp (b, 0, 1), clamp (a, 0, 1));
}

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

function isQuoted (value) {
    var c = value[0];
    if (c == '"' || c == "'") {
	if (value[value.length - 1] == c)
	    return true;
    }
    return false
};

function isRGB (value) {
    if (value.match (/^rgb\(\d+,\d+,\d+\)$/))
	return true;
    else
	return false;
};

function isFloat (value) {
    if (value.match (/^(\+|\-)?\d*\.\d*$/) && value.length > 1)
	return true;
    else if (value.match (/^(\+|\-)?\d*\.\d*e(\+|\-)?\d+$/) && value.length > 1)
	return true;
    else
	return false;
};

function isInt (value) {
    if (value.length == 1)
	return value.match (/^\d$/);
    else {
	return value.match (/^(\+|\-)?\d+$/);
    }
};

function parseRGB (value) {
    var color_match = value.match (/^rgb\((\d+),(\d+),(\d+)\)$/);
    if (!color_match)
	return null;
    else
	return new Color (color_match[1], color_match[2], color_match[3], 255);
};

function str_contains (string, c) {
    return string.indexOf (c) != -1;
};