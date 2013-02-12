function vect (x, y, z) {
    this.x = x;
    this.y = y;
    if (!z)
	this.z = 0.0;
    else
	this.z = z;
    this.add = function (v) {
	this.x += v.x;
	this.y += v.y;
	this.z += v.z;
    };
    this.sub = function (v) {
	this.x -= v.x;
	this.y -= v.y;
	this.z -= v.z;
    };
    this.scale = function (s) {
	this.x *= s;
	this.y *= s;
	this.z *= s;
        return this;
    };
    this.length = function () {
	return Math.sqrt (this.x * this.x + this.y * this.y + this.z * this.z);
    };
    this.normalize = function () {
	var scale = Math.sqrt (this.x * this.x + this.y * this.y + this.z * this.z);
	if (scale == 0)
	    return this;
	this.x /= scale;
	this.y /= scale;
	this.z /= scale;
        return this;
    };
    this.div = function (v) {
	this.x /= v.x;
	this.y /= v.y;
	this.z /= v.z;
    };
    this.floor = function () {
	this.x = Math.floor (this.x);
	this.y = Math.floor (this.y);
	this.z = Math.floor (this.z);
    };
    this.zero = function () {
	return ((this.x + this.y + this.z) == 0);
    };
    this.dot = function (v) {
	return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
    };
    this.cross = function (v) {
	throw 'Need to reimplement';
	//return (this.x * v.y) - (this.y * v.x);
    };
    this.rotate = function (omega) {
	var cos = Math.cos (omega);
	var sin = Math.sin (omega);
	xp = cos * this.x - sin * this.y;
	yp = sin * this.x + cos * this.y;
	this.x = xp;
	this.y = yp;
	return this;
    };
    this.clone = function () {
        return new vect (this.x, this.y, this.z); 
    };

    this.array = function () {
        return [this.x, this.y];
    };
};

vect.scale = function (v, s) {
    return new vect (v.x * s, v.y * s, v.z * s);
};

vect.add = function (v1, v2) {
    return new vect (v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
};

vect.sub = function (v1, v2) {
    if (!v1 || !v2) {
	throw "Bad Vector";
    }
    return new vect (v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
};

vect.dist = function (v1, v2) {
    var x = v2.x - v1.x;
    var y = v2.y - v1.y;
    var z = v2.z - v1.z;
    return Math.sqrt (x * x + y * y + z * z);
};

vect.dir = function (v1, v2) {
    var v = vect.sub (v1, v2);
    v.normalize ();
    return v;
}

vect.dot2d = function (v1, v2) {
    return (v1.x * v2.x) + (v1.y * v2.y);
};

vect.cross = function (v1, v2) {
    return (v1.x * v2.y) - (v1.y * v2.x);
};

vect.left = function (a, b, c, tol) {
    if (!tol)
	tol = 0;
    var v1 = vect.sub (b, a);
    var v2 = vect.sub (c, a);
    return (vect.cross (v1, v2) >= -tol);
};

vect.intersects = function (a, b, c, d, tol) {
    if (!tol)
	tol = 0;
    return (vect.left (a, b, c, tol) != vect.left (a, b, d, tol) &&
	    vect.left (c, d, b, tol) != vect.left (c, d, a, tol));
};

vect.intersect2dt = function (a, b, c, d) {
    var denom = a.x * (d.y - c.y) +
        b.x * (c.y - d.y) +
        d.x * (b.y - a.y) +
        c.x * (a.y - b.y);

    if (denom == 0)
	return Infinity;
    
    var num_s = a.x * (d.y - c.y) +
        c.x * (a.y - d.y) +
        d.x * (c.y - a.y);
    var s = num_s / denom;

    var num_t = -(a.x * (c.y - b.y) +
                  b.x * (a.y - c.y) +
		  c.x * (b.y - a.y));
    var t = num_t / denom;
    
    return t;
};

vect.intersect2dpos = function (a, b, c, d) {
    var denom = a.x * (d.y - c.y) +
        b.x * (c.y - d.y) +
        d.x * (b.y - a.y) +
        c.x * (a.y - b.y);

    if (denom == 0)
	return Infinity;
    
    var num_s = a.x * (d.y - c.y) +
        c.x * (a.y - d.y) +
        d.x * (c.y - a.y);
    var s = num_s / denom;

    /*var num_t = -(a.x * (c.y - b.y) +
                  b.x * (a.y - c.y) +
		  c.x * (b.y - a.y));
    var t = num_t / denom;*/
    
    var dir = vect.sub (b, a);
    dir.scale (s);
    return vect.add (a, dir);
};

vect.rotate = function (v, omega) {
    var cos = Math.cos (omega);
    var sin = Math.sin (omega);
    xp = cos * v.x - sin * v.y;
    yp = sin * v.x + cos * v.y;
    var v = new vect (xp, yp, v.z);
    return v;
};

vect.normalize = function (c) {
    var v = c.clone ();
    var scale = Math.sqrt (v.x * v.x + v.y * v.y + v.z * v.z);
    if (scale == 0)
	return v;
    v.x /= scale;
    v.y /= scale;
    v.z /= scale;
    return v;
};

(function () {

    var BASE_DIR = '';

    /*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/

(function(jQuery){
	
	jQuery.hotkeys = {
		version: "0.8",

		specialKeys: {
			// '=' can be either 107 or 187 depending on it's location on the keyboard
			8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 59: ";",
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "=", 109: "-", 110: ".", 111 : "/", 112: "f1", 113: "f2", 
			114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 120: "f9", 121: "f10", 
			122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 186: ";", 187: "=", 188: ",", 
			189: "-", 190: ".", 191: "/", 219: "\[", 220: "\\", 221: "]", 222: "'", 224: "meta"
		},
	
		shiftNums: {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ":", "'": "\"", ",": "<", 
			".": ">",  "/": "?",  "\\": "|", "[": "{", "]": "}"
		}
	};

	function keyHandler( handleObj ) {
		// Only care when a possible input has been specified
		if ( typeof handleObj.data !== "string" ) {
			return;
		}
		
		var origHandler = handleObj.handler,
			keys = handleObj.data.toLowerCase().split(" ");
	
		handleObj.handler = function( event ) {
			// Don't fire in text-accepting inputs that we didn't directly bind to
			if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
				 event.target.type === "text") ) {
				return;
			}
			
			// Keypress represents characters, not special keys
			var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
				character = String.fromCharCode( event.which ).toLowerCase(),
				key, modif = "", possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if ( event.altKey && special !== "alt" ) {
				modif += "alt+";
			}

			if ( event.ctrlKey && special !== "ctrl" ) {
				modif += "ctrl+";
			}
			
			// TODO: Need to make sure this works consistently across platforms
			if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
				modif += "meta+";
			}

			if ( event.shiftKey && special !== "shift" ) {
				modif += "shift+";
			}

			if ( special ) {
				possible[ modif + special ] = true;

			} else {
				possible[ modif + character ] = true;
				possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if ( modif === "shift+" ) {
					possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
				}
			}

			for ( var i = 0, l = keys.length; i < l; i++ ) {
				if ( possible[ keys[i] ] ) {
					return origHandler.apply( this, arguments );
				}
			}
		};
	}

	jQuery.each([ "keydown", "keyup", "keypress" ], function() {
		jQuery.event.special[ this ] = { add: keyHandler };
	});

})( jQuery );    /*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
				       timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
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

var Mouse = {
    x: 0,
    y: 0
};

$ (document).mousemove (function (event) {
    Mouse.x = event.clientX;
    Mouse.y = event.clientY;
});

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
    function bint32 (data, offset) {
    //console.log (data.charCodeAt (offset) & 0xff, data.charCodeAt (offset + 1) & 0xff, data.charCodeAt (offset + 2) & 0xff, data.charCodeAt (offset + 3) & 0xff);
    return (
	((data.charCodeAt (offset) & 0xff) << 24) +
	    ((data.charCodeAt (offset + 1) & 0xff) << 16) +
	    ((data.charCodeAt (offset + 2) & 0xff) << 8) +
	    (data.charCodeAt (offset + 3) & 0xff)
    );
};

function lint32 (data, offset) {
    return (
	((data.charCodeAt (offset + 3) & 0xff) << 24) +
	    ((data.charCodeAt (offset + 2) & 0xff) << 16) +
	    ((data.charCodeAt (offset + 1) & 0xff) << 8) +
	    (data.charCodeAt (offset) & 0xff)
    );
};

function ldbl64 (data, offset) {
    var b0 = data.charCodeAt (offset) & 0xff;
    var b1 = data.charCodeAt (offset + 1) & 0xff;
    var b2 = data.charCodeAt (offset + 2) & 0xff;
    var b3 = data.charCodeAt (offset + 3) & 0xff;
    var b4 = data.charCodeAt (offset + 4) & 0xff;
    var b5 = data.charCodeAt (offset + 5) & 0xff;
    var b6 = data.charCodeAt (offset + 6) & 0xff;
    var b7 = data.charCodeAt (offset + 7) & 0xff;

    var sign = 1 - 2 * (b7 >> 7);
    var exp = (((b7 & 0x7f) << 4) + ((b6 & 0xf0) >> 4)) - 1023;
    //var frac = (b6 & 0x0f) * Math.pow (2, -4) + b5 * Math.pow (2, -12) + b4 * Math.pow (2, -20) + b3 * Math.pow (2, -28) + b2 * Math.pow (2, -36) + b1 * Math.pow (2, -44) + b0 * Math.pow (2, -52);

    //return sign * (1 + frac) * Math.pow (2, exp);
    var frac = (b6 & 0x0f) * Math.pow (2, 48) + b5 * Math.pow (2, 40) + b4 * Math.pow (2, 32) + b3 * Math.pow (2, 24) + b2 * Math.pow (2, 16) + b1 * Math.pow (2, 8) + b0;

    return sign * (1 + frac * Math.pow (2, -52)) * Math.pow (2, exp);
}

function lfloat32 (data, offset) {
    var b0 = data.charCodeAt (offset) & 0xff;
    var b1 = data.charCodeAt (offset + 1) & 0xff;
    var b2 = data.charCodeAt (offset + 2) & 0xff;
    var b3 = data.charCodeAt (offset + 3) & 0xff;

    var sign = 1 - 2 * (b3 >> 7);
    var exp = (((b3 & 0x7f) << 1) + ((b2 & 0xfe) >> 7)) - 127;

    var frac = (b2 & 0x7f) * Math.pow (2, 16) + b1 * Math.pow (2, 8) + b0;

    return sign * (1 + frac * Math.pow (2, -23)) * Math.pow (2, exp);
}    /* Copyright 2011, Zack Krejci
 * Licensed under the MIT License
 */

var DEBUG = false;

//gl = null;


function setContext (canvas) {
    if (!DEBUG) 
	gl = canvas.get (0).getContext ('experimental-webgl', {
	    alpha: false,
	    antialias: true,
	    premultipliedAlpha: false
	});
    else {
	function throwOnGLError(err, funcName, args) {
	    throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to " + funcName;
	};
	gl = WebGLDebugUtils.makeDebugContext(canvas.get (0).getContext ('experimental-webgl', {
	    alpha: false,
	    antialias: true,
	    premultipliedAlpha: false
	}), throwOnGLError);
    }
    return gl;
};

function rect (x, y, w, h) {
    var verts = [
        x - w, y + h,
        x - w, y - h,
        x + w, y + h,
	
        x - w, y - h,
        x + w, y - h,
        x + w, y + h
    ];
    return verts;
};

function rectv (p1, p2, z) {
    var verts;
    if (arguments.length == 2) {
	verts = [
            p1.x, p2.y,
            p1.x, p1.y,
            p2.x, p2.y,
	    
            p1.x, p1.y,
            p2.x, p1.y,
            p2.x, p2.y
	];
    }
    else {
	verts = [
            p1.x, p2.y, z,
            p1.x, p1.y, z,
            p2.x, p2.y, z,
	    
            p1.x, p1.y, z,
            p2.x, p1.y, z, 
            p2.x, p2.y, z
	];
    }
    return verts;
};

function makeProgram (gl, path) {
    if (!gl)
	return null;
    var shader = gl.createProgram();

    var vert_shader = getShader (gl, gl.VERTEX_SHADER, path + '/vert.glsl');
    var frag_shader = getShader (gl, gl.FRAGMENT_SHADER, path + '/frag.glsl');

    gl.attachShader(shader, vert_shader);
    gl.attachShader(shader, frag_shader);
    gl.linkProgram(shader);

    addVars (gl, shader, vert_shader, frag_shader);
    //addVars (gl, shader, frag, vert_shader, frag_shader);

    return shader;
};

function getShader (gl, type, path) {
    var shader = gl.createShader (type);

    $.ajax ({
	async: false,
	url: path,
	dataType: 'text',
	success: function (data) {
	    gl.shaderSource (shader, data);
	    gl.compileShader (shader);
	    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw (gl.getShaderInfoLog(shader));
	    }
	    shader.source = data;
	},
	error: function (xhr) {
	    console.log ("Could not load " + path);
	}
    });
    return shader;
};

function addVars (gl, shader, vert, frag) {
    var uniforms = {};
    var attr = {};

    var u = (vert.source + frag.source).match (/((uniform)|(attribute)) (\w+) (\w+)/mg);
    var tex_count = 0;
    gl.useProgram (shader);
    if (u) {
	for (var i = 0; i < u.length; i ++) {
	    var v = u[i].split (' ');
	    uniforms[v[2]] = {
		u: v[0],
		type: v[1],
		loc: null //gl.getUniformLocation (shader, v[2])
	    };
	    if (v[0] == 'uniform') {
		uniforms[v[2]].loc = gl.getUniformLocation (shader, v[2]);
	    }
	    else {
		var loc = gl.getAttribLocation (shader, v[2]);
		uniforms[v[2]].loc = loc;
	    }
	    if (v[1] == 'sampler2D') {
		uniforms[v[2]].tex = tex_count;
		tex_count ++;
	    }
	}
	shader.get = function (name) {
	    return uniforms[name].loc;
	}
	shader.data = function (name, data) {
	    var d = uniforms[name];
	    if (!d)
		throw "Could not find shader variable " + name;
	    if (d.u == 'uniform') {
		if (d.type == 'float')
		    gl.uniform1f (d.loc, data);
		else if (d.type == 'vec2')
		    gl.uniform2fv (d.loc, data);
		else if (d.type == 'ivec2')
		    gl.uniform2iv (d.loc, data);
		else if (d.type == 'vec3')
		    gl.uniform3fv (d.loc, data);
		else if (d.type == 'ivec3')
		    gl.uniform3iv (d.loc, data);
		else if (d.type == 'vec4')
		    gl.uniform4fv (d.loc, data);
		else if (d.type == 'ivec4')
		    gl.uniform4iv (d.loc, data);
		else if (d.type == 'bool')
		    gl.uniform1i (d.loc, data);
		else if (d.type == 'mat4')
		    gl.uniformMatrix4fv (d.loc, false, data);	
		else if (d.type == 'mat3')
		    gl.uniformMatrix3fv (d.loc, false, data);	
		else if (d.type == 'sampler2D') {
		    if ('texture' in data)
			data = data.texture ();
		    gl.activeTexture (gl['TEXTURE' + d.tex]); 
		    gl.bindTexture (gl.TEXTURE_2D, data);
		    gl.uniform1i (d.loc, d.tex);
		}
		else if (d.type == 'int')
		    gl.uniform1i (d.loc, data);
		else
		    throw "Unsupported Type for Shader Helper: " + d.type;
	    }
	    else if (d.u == 'attribute') {
		gl.enableVertexAttribArray (d.loc);
		gl.bindBuffer (gl.ARRAY_BUFFER, data);
		gl.vertexAttribPointer (d.loc, data.itemSize, gl.FLOAT, false, 0, 0);
	    }
	    else 
		throw "Type: " + d.u + " Recieved";
	};
    }
};

function repeats (gl, data, itemSize, count) {
    var buffer = gl.createBuffer ();
    buffer.itemSize = itemSize;
    buffer.numItems = count;
    var float_data = new Float32Array (data.length * count * itemSize);
    for (var i = 0; i < count; i ++) {
	for (var j = 0; j < data.length; j ++) {
	    float_data[i * data.length + j] = data[j];
	}
    }
    gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
    gl.bufferData (gl.ARRAY_BUFFER, float_data, gl.STATIC_DRAW);
    gl.bindBuffer (gl.ARRAY_BUFFER, null);
    return buffer;
};

function staticBuffer (gl, data, itemSize) {
    var buffer = gl.createBuffer ();
    var float_data = new Float32Array (data);
    gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
    buffer.itemSize = itemSize;
    buffer.numItems = data.length / itemSize;
    
    gl.bufferData (gl.ARRAY_BUFFER, float_data, gl.STATIC_DRAW);
    gl.bindBuffer (gl.ARRAY_BUFFER, null);
    return buffer;
};

function staticBufferJoin (gl, data, itemSize) {
    var buffer = gl.createBuffer ();
    var count = 0;
    for (var i = 0; i < data.length; i ++) {
	count += data[i].length;
    }
    var float_data = new Float32Array (count);
    var index = 0;
    for (var i = 0; i < data.length; i ++) {
	for (var j = 0; j < data[i].length; j ++) {
	    float_data[index] = data[i][j];
	    index ++;
	}
    }
    gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
    buffer.itemSize = itemSize;
    buffer.numItems = count / itemSize;
    
    gl.bufferData (gl.ARRAY_BUFFER, float_data, gl.STATIC_DRAW);
    gl.bindBuffer (gl.ARRAY_BUFFER, null);
    return buffer;
};

function dynamicBuffer (gl, items, itemSize) {
    if (!gl)
	return null;
    var buffer = gl.createBuffer ();
    gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
    var float_data = new Float32Array (items * itemSize);
    buffer.itemSize = itemSize;
    buffer.numItems = items;
    
    buffer.update = function (data, index) {
        var float_data = new Float32Array (data);
	gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
        gl.bufferSubData (gl.ARRAY_BUFFER, 4 * index, float_data);		
	gl.bindBuffer (gl.ARRAY_BUFFER, null);
    }
    
    gl.bufferData (gl.ARRAY_BUFFER, float_data, gl.DYNAMIC_DRAW);
    gl.bindBuffer (gl.ARRAY_BUFFER, null);
    return buffer;
};

function indexBuffer (gl, items, itemSize) {
    var buffer = gl.createBuffer ();
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, buffer);
    var float_data = new Uint16Array (items);
    buffer.itemSize = itemSize;
    buffer.numItems = items / itemSize;
    
    buffer.update = function (data, index) {
        var float_data = new Uint16Array (data);
	gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferSubData (gl.ELEMENT_ARRAY_BUFFER, 2 * index, float_data);		
	gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, null);
    }
    
    gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, float_data, gl.DYNAMIC_DRAW);
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, null);
    return buffer;
};

var tex_count = 0;
function getTexture (gl, path, callback) {
    var tex = gl.createTexture ();
    tex.id = tex_count;
    tex_count ++;
    var img = new Image ();
    img.onload = function () {
	gl.bindTexture (gl.TEXTURE_2D, tex);  
	gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);  
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);  
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);  
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	//gl.generateMipmap(gl.TEXTURE_2D);  
	gl.bindTexture (gl.TEXTURE_2D, null);
	if (callback)
	    callback ();
    };
    img.src = path;
    return tex;
};

/*function asyncTexture (path, callback) {
    jxhr = $.ajax ({
	url: path,
	success: function (img) {
	    console.log (img);
	    var tex = gl.createTexture ();
	    tex.id = tex_count;
	    tex_count ++;

	    gl.bindTexture(gl.TEXTURE_2D, tex);  
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);  
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);  
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);  
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	    gl.generateMipmap(gl.TEXTURE_2D);  
	    gl.bindTexture(gl.TEXTURE_2D, null);
	    console.log (img);

	    callback (tex);
	},
	error: function (xhr, message) {
	    console.log (message);
	}
    });
    return jxhr;
}*/
    function Buffers (gl, initial_size) {
    var data = {};
    
    var size;
    if (!initial_size)
	size = 256;
    else
	size = initial_size;

    var current = 0;

    var copy_array = function (dst, src, start, count) {
	if (!dst)
	    console.log ('ack');
	if (!start)
	    start = 0;
	if (!count)
	    count = src.length;
	for (var i = 0; i < count; i ++) {
	    dst[start + i] = src[i];
	}
    };

    var resize = function (min_expand) {
	var new_size = size;
	while (new_size < min_expand)
	    new_size *= 2;
	size = new_size;
	for (name in data) {
	    var new_array = new Float32Array (new_size * data[name].len);
	    var old_array = data[name].array;
	    var new_buffer = dynamicBuffer (gl, size, data[name].len);
	    
	    copy_array (new_array, old_array);
	    data[name].array = new_array;
	    data[name].buffer = new_buffer;
	    data[name].dirty = true;
	}
    };

    this.create = function (name, len) {
	if (!len)
	    throw "Length of buffer must be a positive integer";
	var array = new Float32Array (size * len);
	var buffer = dynamicBuffer (gl, size, len);
	data[name] = {
	    array: array,
	    buffer: buffer,
	    len: len,
	    dirty: false
	};
    };

    this.alloc = function (num) {
	if ((current + num) >= size)
	    resize (current + num);
	var start = current;
	current += num;
	return start;
    };

    this.get = function (name) {
	//console.log (name, data[name].array);
	return data[name].buffer;
    };

    this.write = function (name, array, start, count) {
	copy_array (data[name].array, array, start * data[name].len, count * data[name].len);
	data[name].dirty = true;
    };

    this.repeat = function (name, elem, start, count) {
	for (var i = 0; i < count; i ++) {
	    copy_array (data[name].array, elem, (start + i) * data[name].len, data[name].len);
	}
	data[name].dirty = true;	
    };

    this.count = function () {
	return current;
    };

    this.data = function (name) {
	return data[name].array;
    };

    this.update = function () {
	for (name in data) {
	    if (data[name].dirty) {
		if (data[name].buffer)
		    data[name].buffer.update (data[name].array, 0);
		data[name].dirty = false;
	    }
	}
    };
};
    function Texture (gl, options) {
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

    var StyleManager = new function () {
    // The structure of style lookup is: Engine ids, then feature and layer ids
    // Layers and features coexist on the same level. The cascade is looked up
    // at runtime
    //
    // 'default' is used for feature's styles specified sans Engine
    // Engine's define their own default styles, which they must will registered the
    // first time that Engine is seen
    this.styles = {};

    this.derivedStyle = function (feature, layer, engine, key) {
        // It makes no sense to talk about the derived style without an engine
        if (!engine)
            throw "Undefined operation";
        var value;
        // First precxidence is an engine's feature style
        value = this.getStyle (feature, engine, key);
        // Second is an orphaned feature style
        if (value === null) {
            value = this.getStyle (feature, null, key);
            // Third is ane engine's layer style
            if (value === null) {
                value = this.getStyle (layer, engine, key);                
                // Fourth is an  orphaned layer style
                if (value === null) {
                    value = this.getStyle (layer, engine, key);     
                    // Fifth is the engine type default
                    if (value === null) {
                        value = engine.defaultStyle (feature.type, key);
                    }
                }
            }
        }
        return value;
    };

    /*var callbacks = {};
    this.registerCallback = function (engine, object, func) {
        if (!callbacks[engine.id])
            callbacks[engine.id] = {};
        callbacks[engine.id][object.id] = func;
    };*/

    var lookupEngine = function (engine) {
        if (!engine) { 
            return 'default';
        }
        else {
            return engine.id;
        }
    }

    var initializeStyle = function (object, engine) {
        var engine_id = lookupEngine (engine);
        if (!(engine_id in StyleManager.styles))
            StyleManager.styles[engine_id] = {};
        if (!(object.id in StyleManager.styles[engine_id]))
            StyleManager.styles[engine_id][object.id] = {};
    };

    // object is a layer or feature
    this.getStyle = function (object, engine, key) {
        initializeStyle (object, engine);
        var value;
        var engine_id = lookupEngine (engine);
        value = this.styles[engine_id][object.id][key];
        if (value === undefined)
            return null;
        else
            return value;
    };

    // object is a layer or feature
    this.setStyle = function (object, engine, key, value) {
        initializeStyle (object, engine);
        var engine_id = lookupEngine (engine);
        this.styles[engine_id][object.id][key] = value;
        EventManager.trigger (object, 'style', [object, key]);
        /*if (engine) {
            if (callbacks[engine.id]) {
                if (callbacks[engine.id][object.id]) {
                    callbacks[engine.id][object.id] (object, key);
                }
            }
        }
        else {
            $.each (callbacks, function (engine_id, ob_callback) {
                if (ob_callback[object.id]) {
                    ob_callback[object.id] (object, key);
                }
            });
        }*/
    };

} ();



/*
// Cascading style lookup
function derived_style (engine, feature, layer, key) {
    var value = feature.style (engine, key); 
    if (value === null) {
        value = layer.style (engine, key);
        if (value === null) {
            value = default_style[feature.type][key];
        }
    }
    return value;
};*/

// function StyleManager () {
//     var matches = {};

//     var strip_whitespace = function (arg) {
// 	var val = arg.match (/^\s*([^\s]+)\s*$/);
// 	if (!val.length)
// 	    return null;
// 	return val[1];
//     };

//     var is_geometry = function (val) {
// 	return (val == 'polygon' || val == 'point' || val == 'line' || val == '*');
//     };

//     var parse_selector = function (arg) {
// 	var is_id = str_contains (arg, '#');
// 	var is_class = str_contains (arg, '.');
// 	if (is_id && is_class)
// 	    return null;
// 	//if (is_id || is_class) {
// 	var selector_match = arg.match (/^(\w*)([\.\#](\w+))?$/)
// 	if (!selector_match)
// 	    return null;
// 	var sel_type = selector_match[1];
// 	if (!sel_type)
// 	    sel_type = '*';
// 	if (!is_geometry (sel_type))
// 	    return null;
// 	console.log ('found', sel_type);
// 	//var name_match = arg.match (/^(\w*)[\.\#](\w+)/);
// 	var name = selector_match[2];
// 	if (!name)
// 	    name = '*';
// 	return {
// 	    type: sel_type,
// 	    name: name
// 	};
// 	//}
//     };

//     var split_arg = function (arg) {
// 	arg = arg.replace (/\s*([,()])\s*/g, '$1');
// 	var vals = arg.split (' ');
// 	var result = [];
// 	$.each (vals, function (i, v) {
// 	    if (v.length > 0)
// 		result.push (v);
// 	});
// 	return result;
//     };

//     var convert_type = function (name, val) {
// 	var results = [];
// 	$.each (val, function (i, v) {
// 	    if (isRGB (v)) {
// 		results.push (parseRGB (v));
// 	    }
// 	    else if (isInt (v)) {
// 		results.push (parseInt (v));
// 	    }
// 	    else if (isFloat (v)) {
// 		results.push (parseFloat (v));
// 	    }
// 	    else {
// 		results.push (v);
// 	    }
// 	});
// 	return results;
//     };

//     var parse_prop = function (prop, string) {
// 	args = string.split (':');
// 	if (args.length != 2) {
// 	    if (string != ' ' && string != '')
// 		console.log ('Error parsing css string:', string);
// 	    return;
// 	}
// 	var name = strip_whitespace (args[0]);
// 	var val = split_arg (args[1]);
// 	if (!name || !val)
// 	    return;
// 	prop[name] = convert_type (name, val);
//     };

//     $.each (document.styleSheets, function (i, sheet) {
// 	$.each (sheet.rules || sheet.cssRules, function (j, rule) {
// 	    var selector_ob = parse_selector (rule.selectorText);
// 	    if (!selector_ob)
// 		return;
// 	    var prop_raw = rule.style.cssText.split (';')
// 	    console.log (prop_raw);
// 	    var prop = {};
// 	    $.each (prop_raw, function (k, string) {
// 		parse_prop (prop, string);
// 	    });
// 	    if (!(selector_ob.type in matches))
// 		matches[selector_ob.type] = {}
// 	    matches[selector_ob.type][selector_ob.name] = prop;
// 	    //if (!(rule.selectorText in matches))
// 	    //    matches[rule.selectorText] = prop;
// 	    //else
// 	    //    matches.concat (prop)
// 	});
//     });
//     console.log ('css', matches);
//     // var pages = $ ('link[rel="stylesheet"]')
//     var defaults = {};
//     var layers = {};
//     var features = {};
//     this.register = function (feature) {
	
//     };
// };
    function Camera (canvas, options) {
    var camera = this;
    if (!options)
        options = {};

    if (options.width && !options.height) {
        options.height = options.width;
    }
    else if (!options.width && options.height) {
        options.width = options.height;
    }

    var aspect = canvas.height () / canvas.width (); 

    if (options.min) {
        options.center = vect.add (options.min, new vect (options.width, options.height * aspect).scale (.5));
    }
    else if (!options.center) {
        options.center = new vect (0, 0);
    }


    // These four parameters (along with the viewport aspect ratio) completely determine the
    // transformation matrices.
    var worldWidth = options.width;
    var worldHeight = options.height
    var worldRatio = options.height / options.width;
    var center = options.center.clone ();
    var level = 1.0;

    // The three transformation matrices: One that goes from world space to pixel space
    // One that goes from pixel space to screen space, and one that does both for efficency
    this.worldToPx = new Float32Array (9);
    this.pxToScreen = new Float32Array (9);
    this.worldToScreen = new Float32Array (9);

    // Deprecated: Legacy access for backwards compatibility
    this.mat3 = this.worldToScreen;


    // Rebuild the matrices. Needs to be called everytime any of the above mentioned parameters
    // Changes
    this.reconfigure = function () {

        var aspectRatio = canvas.height () / canvas.width (); 
        var worldRatio = worldHeight / worldWidth;

        //var half_size = vect.sub (options.max, options.min).scale (.5).scale (1.0 / level);

        var half_size = new vect (worldWidth / level, (worldWidth * worldRatio * aspectRatio) / level).scale (.5);

        var world_max = vect.add (center, half_size);
        var world_min = vect.sub (center, half_size);
        
        var width = canvas.width ();
        var height = canvas.height ();
        var world_range = vect.sub (world_max, world_min);

        var setupWorld = function () {
            camera.worldToPx[0] = width / world_range.x;
            camera.worldToPx[1] = 0;
            camera.worldToPx[2] = 0;
            camera.worldToPx[3] = 0;
            camera.worldToPx[4] = height / world_range.y;
            camera.worldToPx[5] = 0;
            camera.worldToPx[6] = -(world_min.x * width) / world_range.x;
            camera.worldToPx[7] = -(world_min.y * height) / world_range.y;
            camera.worldToPx[8] = 1;
        };

        var setupPx = function () {
            camera.pxToScreen[0] = 2.0 / width;
            camera.pxToScreen[1] = 0;
            camera.pxToScreen[2] = 0;
            camera.pxToScreen[3] = 0;
            camera.pxToScreen[4] = 2.0 / height;
            camera.pxToScreen[5] = 0;
            camera.pxToScreen[6] = -1;
            camera.pxToScreen[7] = -1;
            camera.pxToScreen[8] = 1;
        };

        var setupProj = function () {
            camera.worldToScreen[0] = 2.0 / world_range.x;
            camera.worldToScreen[1] = 0;
            camera.worldToScreen[2] = 0;
            camera.worldToScreen[3] = 0;
            camera.worldToScreen[4] = 2.0 / world_range.y;
            camera.worldToScreen[5] = 0;
            camera.worldToScreen[6] = -2.0 * world_min.x / world_range.x - 1;
            camera.worldToScreen[7] = -2.0 * world_min.y / world_range.y - 1;
            camera.worldToScreen[8] = 1;
        };

        setupWorld ();
        setupPx ();
        setupProj ();

    };

    // Initial call to setup the matrices
    this.reconfigure ();

    // Coverts a screen coordinate (in pixels) to a point in the world
    this.project = function (v) {
	var c = new vect (
            2.0 * (v.x - canvas.offset ().left) / canvas.width () - 1.0,
		-(2.0 * (v.y - canvas.offset ().top) / canvas.height () - 1.0));
        c.x = c.x / this.mat3[0] - this.mat3[6] / this.mat3[0];
        c.y = c.y / this.mat3[4] - this.mat3[7] / this.mat3[4];
	return c;
    };
    
    // Converts a world coordinate to a screen coordinate
    this.screen = function (v) {
        var c = new vect (
	    v.x * this.mat3[0] + this.mat3[6],
            v.y * this.mat3[4] + this.mat3[7]);
        c.x = canvas.offset ().left + canvas.width () * (c.x + 1.0) / 2.0;
        c.y = canvas.offset ().top + canvas.height () * (-c.y + 1.0) / 2.0;
        return c;
    };

    this.percent = function (v) {
	return new vect (
	    2 * ((v.x - canvas.offset ().left) / canvas.width ()) - 1,
	    -(2 * ((v.y - canvas.offset ().top) / canvas.height ()) - 1));
    };

    this.pixel = function (v) {
	return new vect (canvas.offset ().left + ((v.x + 1) / 2) * canvas.width (),
			 canvas.offset ().top + ((-v.y + 1) / 2) * canvas.height ());
    };

    // Moves the center point
    this.move = function (v) {
        center.add (v);
        this.reconfigure ();
    };

    // Zooms the canvas
    this.zoom = function (scale) {
	level *= scale;
        this.reconfigure ();
    };

    // Sets the center point
    // Variable length arguments:
    // 0 for the getter, 1 to send a vector, two to send scalars
    this.position = function (arg0, arg1) {
        if (arg0 === undefined)
            return center.clone ();
        else if (arg1 === undefined)
            center = arg0.clone ();
        else
            center = new vect (arg0, arg1);
        this.reconfigure ();
    };

    // Reset the zoom level to the original
    this.reset = function () {
        level = 1.0;
        this.reconfigure ();
    };

    // Listens for aspect ratio changes
    canvas.resize (function(event) {
        camera.reconfigure ();
    });

    // Scales both the width and height to a new size at zoom level 1
    // Resets the zoom level to prevent unexpected size effects
    this.extents = function (newWidth) {
        worldWidth = newWidth;
        worldHeight = newWidth * worldRatio;
        level = 1.0;
        this.reconfigure ();
    };
};

/*function Camera (canvas, options) {
    if (!options)
	options = {};

    var ratio = canvas.width () / canvas.height (); 

    if (!('center' in options))
	options.center = new vect (0, 0);
    if (!('extents' in options))
	options.extents = 180.0;
    if (!('v_extents' in options))
	options.v_extents = options.extents / ratio;

    this.mat3 = new Float32Array (9);
    //this.mat3[0] = 2.0 / canvas.width ();
    //this.mat3[5] = 2.0 / canvas.height ();

    this.mat3[0] = 2.0 / options.extents;
    this.mat3[4] = 2.0 / options.v_extents;
    this.mat3[8] = 1.0;
    
    this.mat3[6] = 0.0;
    this.mat3[7] = 0.0;
    
    this.level = 1.0;

    this.project = function (v) {
	var c = new vect (
            2.0 * (v.x - canvas.offset ().left) / canvas.width () - 1.0,
		-(2.0 * (v.y - canvas.offset ().top) / canvas.height () - 1.0));
        c.x = c.x / this.mat3[0] - this.mat3[6] / this.mat3[0];
        c.y = c.y / this.mat3[4] - this.mat3[7] / this.mat3[4];
	return c;
    };
    
    this.screen = function (v) {
        var c = new vect (
	    v.x * this.mat3[0] + this.mat3[6],
            v.y * this.mat3[4] + this.mat3[7]);
        c.x = canvas.offset ().left + canvas.width () * (c.x + 1.0) / 2.0;
        c.y = canvas.offset ().top + canvas.height () * (-c.y + 1.0) / 2.0;
        return c;
    };

    this.percent = function (v) {
	return new vect (
	    2 * ((v.x - canvas.offset ().left) / canvas.width ()) - 1,
	    -(2 * ((v.y - canvas.offset ().top) / canvas.height ()) - 1));
    };

    this.pixel = function (v) {
	return new vect (canvas.offset ().left + ((v.x + 1) / 2) * canvas.width (),
			 canvas.offset ().top + ((-v.y + 1) / 2) * canvas.height ());
    };
    
    this.move = function (v) {
        this.mat3[6] -= v.x * this.mat3[0];
        this.mat3[7] -= v.y * this.mat3[4];
    };
    
    this.position = function (v) {
	if (!v) {
	    return new vect (-this.mat3[6] / this.mat3[0], -this.mat3[7] / this.mat3[4]);
	}
        this.mat3[6] = -v.x * this.mat3[0];
        this.mat3[7] = -v.y * this.mat3[4];		
    };
    this.position (options.center);

    this.extents = function (width, height) {
	options.extents = width;
        if (!height)
            options.v_extents = options.extents / ratio;
        else
            options.v_extents = height;

	var pos = this.position ();
	this.level = 1.0;

	this.mat3[0] = 2.0 / options.extents;
	this.mat3[4] = 2.0 / options.v_extents;

	this.position (pos);
    };
    
    this.zoom = function (scale) {
	var pos = new vect (this.mat3[6] / this.mat3[0], this.mat3[7] / this.mat3[4]);
	this.mat3[0] *= scale;
	this.mat3[4] *= scale;
	this.mat3[6] = pos.x * this.mat3[0];
	this.mat3[7] = pos.y * this.mat3[4];
	this.level *= scale;
    };
    
    this.reset = function () {
	this.zoom (1.0 / this.level);
    };

    this.reconfigure = function () {
	var p = this.position ();
	this.mat3[4] /= ratio;
	ratio = canvas.width () / canvas.height (); 
	this.mat3[4] *= ratio;
	this.position (p);
    };
};*/
    function Scroller (engine) {
    var drag = false;
    var start = new vect (0, 0);
    var pos = new vect (0, 0);
    var dir = null;
    var speed = 0;
    
    engine.canvas.mousedown (function (event) {
	//console.log (event);
	start = new vect (event.clientX, event.clientY);
	drag = true;
	//console.log ('pos', engine.camera.project (new vect (event.clientX, event.clientY)));
    });
    
    $ (window).bind ('mouseup', function () {
	drag = false;
    });
    
    /*engine.canvas.mousemove (function (event) {
       pos = new vect (event.clientX, event.clientY);
   });*/
    
    $ (document).bind ('keypress', '+', function (event) {
       engine.camera.zoom (1.1);
   });
    
    $ (document).bind ('keypress', '-', function (event) {
       engine.camera.zoom (10 / 11);
   });
    
    $ (document).bind ('keypress', '0', function (event) {
       engine.camera.reset ();
   });
    
    engine.canvas.bind ('mousewheel', function (event, delta) {
	delta *= .5;
	if (delta < 0) {
            delta *= -1;
            delta += 1.0;
            delta = 1.0 / delta;
	}
	else {
	    delta += 1.0;
	}
	engine.camera.zoom (delta);
	event.preventDefault ();
    });
    
    var enabled = true;
    this.disable = function () {
	enabled = false;
    };

    this.enable = function () {
	enabled = true;
    };

    this.update = function (dt) {
	pos = new vect (Mouse.x, Mouse.y);
	if (drag && enabled) {
	    var m = vect.sub (engine.camera.project (start), engine.camera.project (pos));
	    engine.camera.move (m);
	    start = pos;
	    speed = m.length () / dt;
	    dir = m;
	    dir.normalize ();
	}
	else if (speed > .01) {
	    if (dir) {
		engine.camera.move (vect.scale (dir, speed * dt));
		speed -= 3.0 * dt * speed;
            }
	}
    };
};    var EventManager = new function () {
    this.listeners = {};

    this.manage = function (object) {
        if (!(object.id in this.listeners)) {
            this.listeners[object.id] = {
                parents: [],
                callbacks: {}
            };
        }
    };

    this.linkParent = function (parent, object) {
        this.listeners[object.id].parents.push (parent.id);
    };

    this.addEventHandler = function (object, eventType, handler) {
        if (!(this.listeners[object.id].callbacks[eventType]))
            this.listeners[object.id].callbacks[eventType] = [];
        this.listeners[object.id].callbacks[eventType].push (handler);
    };

    // Maybe these low level events should be handler by the engine itself?
    // The engine knows how to search layers for individual features
    this.moveMouse = function (engine) {

    };
    this.clickMouse = function (engine) {

    };
    this.mouseDown = function (engine) {

    };
    this.trigger = function (object, eventType, args) {
        if (object.id in this.listeners) {
            if (eventType in this.listeners[object.id].callbacks) {
                $.each (this.listeners[object.id].callbacks[eventType], function (i, handler) {
                    handler.apply (object, args);
                });
            }
            $.each (this.listeners[object.id].parents, function (i, parent) {
                EventManager.trigger (parent, eventType, args);
            });
        }
    };

} ();
/*function EventManager (engine) {
    var events = {
	'mouseover': {},
	'mouseout': {},
	'click': {}
    };
    var callers = {};
    var features = {};

    var r = 0;
    var g = 0;
    var b = 0;
    var set_id_color = function () {
	b ++;
	if (b > 255) {
	    b = 0;
	    g ++;
	}
	if (g > 255) {
	    g = 0;
	    r ++;
	}
	if (r > 255)
	    throw "Too many elements to assign unique id";
	return {
	    r: r, 
	    g: g,
	    b: b
	};
    };

    this.register = function (layer, f) {
	var c = set_id_color ();
	var key = c.r + ',' + c.g + ',' + c.b;
	
	callers[key] = layer;
	features[key] = f;

	if (!(layer.id in events['click'])) {
	    for (key in events) {
		events[key][layer.id] = [];
	    }
	}
	return c;
    };
    
    this.bind = function (type, caller, func) {
	if (!(type in events))
	    throw "Event type " + type + " does not exist";
	events[type][caller.id].push (func);
    };

    var cx = -1;
    var cy = -1;
    var current = new Uint8Array (4);

    var is_zero = function (pixel) {
	return (pixel[0] == 0 && pixel[1] == 0 && pixel[2] == 0);
    }

    var trigger_event = function (type, pixel) {
	var key = pixel[0] + ',' + pixel[1] + ',' + pixel[2];
	var layer = callers[key];
	var feature = features[key];
	for (var i = 0; i < events[type][layer.id].length; i ++) {
	    events[type][layer.id][i] (new LayerSelector ([feature]));
	}
    }

    var click = false;
    var click_queue = [];
    this.click = function (x, y) {
	click = true;
	click_queue.push ({
	    x: x,
	    y: y
	});
    };

    this.update = function (dt) {
	if (cx != Mouse.x || cy != Mouse.y) {
	    var pixel = engine.read_pixel (Mouse.x, Mouse.y);
	    cx = Mouse.x;
	    cy = Mouse.y;
	    var same = true;
	    for (var i = 0; i < 4; i ++) {
		if (current[i] != pixel[i])
		    same = false;
	    }
	    if (same) {
		return null;
	    }
	    if (!is_zero (current)) {
		trigger_event ('mouseout', current);
		//console.log ('out');
	    }
	    //console.log (pixel);
	    for (var i = 0; i < 4; i ++) {
		current[i] = pixel[i];
	    }
	    if (is_zero (pixel))
		return null;
	    trigger_event ('mouseover', pixel);
	}
	if (click) {
	    click = false;
	    while (click_queue.length > 0) {
		var pos = click_queue.splice (0, 1)[0];
		var px = engine.read_pixel (pos.x, pos.y);
		if (!is_zero (px)) {			
		    trigger_event ('click', px);					    
		}
	    }
	}
    };
};
*/
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
};    var SLIDER_WIDTH = 20;

function Slider (pos, size, units) {
    var position = function (index) {
	if (index >= units)
	    throw "Slider index out of bounds";
	return (size.x / (units - 1)) * index;
    };

    var slider_index = function (p) {
	if (p <= pos.x)
	    return 0;
	if (p >= pos.x + size.x)
	    return units - 1;
	return Math.round (((p - pos.x) / size.x) * (units - 1));
    };
    
    this.dom = $ ('<div></div>')
	.addClass ('slider-container')
	.css ('position', 'relative')
	.css ('left', pos.x)
	.css ('top', pos.y)
	.css ('width', size.x)
	.css ('height', size.y);

    var dragging = false;
    var current = 0;
    var bar = $ ('<div></div>')
	.addClass ('slider-box')
	.css ('position', 'relative')
	.css ('left', -SLIDER_WIDTH / 2)
	.css ('height', size.y)
	.css ('width', SLIDER_WIDTH)
	.mousedown (function () {
	    dragging = true;
	});

    this.tick = function () {
	return current;
    };

    this.count = function () {
	return units;
    };

    var change_event = function (index) {};
    this.change = function (func) {
	change_event = func;
    };

    var release_event = function (index) {};
    this.release = function (func) {
	release_event = func;
    };

    this.dragging = function () {
	return dragging;
    };

    this.dom.append (bar);

    this.set = function (index) {
	if (index != current)
	    change_event (index);
	current = index;
	var px = position (index);
	bar.css ('left', px - SLIDER_WIDTH / 2);
	release_event (index);
    };
    
    $ (document).bind ('mouseup', function () {
	if (!dragging)
	    return;
	dragging = false;
	var index = slider_index (event.clientX);
	release_event (index);
    });

    $ (document).bind ('mousemove', function (event) {    
	if (dragging) {
	    var index = slider_index (event.clientX);
	    if (index != current)
		change_event (index);
	    current = index;
	    var px = position (index);
	    bar.css ('left', px - SLIDER_WIDTH / 2);
	}
    });
    
};
    function FeatureView (feature, layer, engine) {
    this.style_map = {};
    
    // Update the buffers for a specific property
    this.update = function (key) {
        var value = StyleManager.derivedStyle (feature, layer, engine, key);
        if (value === null)
            throw "Style property does not exist";
        if (key in this.style_map) {
            this.style_map[key] (value);
        }
    };
        
    // Update all buffers for all properties
    this.update_all = function () {
        for (var key in this.style_map) {
            this.update (key);
        }
    };
};
    function FeatureRenderer (engine, layer) {
    this.engine = engine;

    // A list of views of the object
    this.views = [];

    // Update all features with a style property
    this.update = function (key) {
        for (var i = 0; i < views.length; i ++) {
            this.views[i].update (key);
        }
    };

    this.view_factory = function () {
        throw "Not Implemented";
    };

    this.create = function (feature, feature_geom) {
        var view = this.view_factory (feature, feature_geom, engine);
        view.update_all ();
        this.views.push (view);
        return view;
    };
};
    var INITIAL_POINTS = 1024;

var unit = rect (0, 0, 1, 1);

function PointRenderer (engine, layer) {
    FeatureRenderer.call (this, engine, layer);

    if (!(engine.shaders['point'])) {
        engine.shaders['point'] = makeProgram (engine.gl, BASE_DIR + 'shaders/point');
    }
    var point_shader = engine.shaders['point'];
    
    // A value greater than or equal to the maximum radius of each point
    var max_rad = 10.0;

    // The required buffers for rendering
    var buffers = new Buffers (engine.gl, INITIAL_POINTS);
    buffers.create ('vert', 2);
    buffers.create ('unit', 2);
    buffers.create ('stroke_width', 1);
    buffers.create ('rad', 1);
    buffers.create ('fill_color', 3);
    buffers.create ('fill', 1);
    buffers.create ('stroke_color', 3);
    buffers.create ('stroke', 1);
    buffers.create ('alpha', 1);

    // Rendering class for an individual point
    var PointView = function (feature) {
        FeatureView.call (this, feature, layer, engine);

        // The start index of the buffer
        var start;
        
        // The number of vertices in the buffer for this feature
        var count;
        
        // Instructions on how to write to the buffers for specific styles
        this.style_map = {
            'fill': function (color) {
                if (color == 'none') {
	            buffers.repeat ('fill', [-.75], start, count);
                }
                else {
	            buffers.repeat ('fill', [.75], start, count);
	            buffers.repeat ('fill_color', color.array, start, count);                                }
            },
            'opacity': function (opacity) {
	        buffers.repeat ('alpha', [opacity], start, count);
            },
            'radius': function (rad) {
                if (rad > max_rad)
                    max_rad = rad;
                buffers.repeat ('rad', [rad], start, count);
            },
            'stroke': function (color) {
                if (color == 'none') {
	            buffers.repeat ('stroke', [-.75], start, count);
                }
                else {
	            buffers.repeat ('stroke', [.75], start, count);
	            buffers.repeat ('stroke_color', color.array, start, count);
                }
            },
            'stroke-width': function (width) {
                buffers.repeat ('stroke_width', [width], start, count);                
            }
        };
        
        var feature_geom = feature.geom;

	var total_points = feature_geom.length;
	count = 6 * total_points;
	start = buffers.alloc (count);

	$.each (feature_geom, function (index, point) {
	    buffers.repeat ('vert', point, start + index * 6, 6);
	    buffers.write ('unit', unit, start + index * 6, 6);
	});

        this.update_all ();
    };

    this.view_factory = function (feature) {
        return new PointView (feature);
    };

    this.draw = function () {
        var gl = engine.gl;

	buffers.update ();

	gl.useProgram (point_shader);
        
	point_shader.data ('screen', engine.camera.mat3);

	point_shader.data ('pos', buffers.get ('vert'));
	point_shader.data ('circle_in', buffers.get ('unit'));

	point_shader.data ('color_in', buffers.get ('fill_color'));  
	point_shader.data ('stroke_color_in', buffers.get ('stroke_color'));  
	point_shader.data ('alpha_in', buffers.get ('alpha')); 

        point_shader.data ('fill_in', buffers.get ('fill'));
        point_shader.data ('stroke_in', buffers.get ('stroke'));

	point_shader.data ('aspect', engine.canvas.width () / engine.canvas.height ());
	point_shader.data ('pix_w', 2.0 / engine.canvas.width ());
	point_shader.data ('rad', buffers.get ('rad'));

	point_shader.data ('stroke_width_in', buffers.get ('stroke_width'));

	point_shader.data ('max_rad', max_rad);
        
	//point_shader.data ('glyph', circle_tex);
        
	gl.drawArrays (gl.TRIANGLES, 0, buffers.count ()); 
    };
};
    var INITIAL_LINES = 1024;

function draw_lines (stroke_buffers, geom) {

    var vertCount = 6 * geom.length;
    var startIndex = stroke_buffers.alloc (vertCount);
    
    var unit_buffer = [-1, 1, 
                       -1, -1, 
                       1, -1,

                       -1, 1,
                       1, -1,
                       1, 1
                      ];

    var index = 0;
    var next_vert = function () {
	if (geom[index]) {
	    var v = new vect (geom[index][0], geom[index][1]);
	    index ++;
	    return v;
	}
	else
	    return null;
    };

    var prev = null;
    var current = next_vert ();
    var next = next_vert ();

    var prev_list = [];
    var current_list = [];
    var next_list = [];
    
    while (current) {
        prev_list.push (prev || vect.add (current, vect.sub (current, next)));
        current_list.push (current);
        next_list.push (next || vect.add (current, vect.sub (current, prev)));

        prev = current;
	current = next;
	next = next_vert ();
    }

    var prev_buffer = [];
    var current_buffer = [];
    var next_buffer = [];

    currentIndex = startIndex;

    var add_vert = function (p, c, n) {
        /*prev_buffer.push (p.x);
        prev_buffer.push (p.y);

        current_buffer.push (c.x);
        current_buffer.push (c.y);

        current_buffer.push (c.x);
        current_buffer.push (c.y);*/
        stroke_buffers.write ('prev', p.array (), currentIndex, 1);
        stroke_buffers.write ('current', c.array (), currentIndex, 1);
        stroke_buffers.write ('next', n.array (), currentIndex, 1);
        currentIndex ++;

    };
        
    for (var i = 1; i < geom.length; i ++) {
        stroke_buffers.write ('unit', unit_buffer, currentIndex, 6);

        add_vert (prev_list[i - 1], current_list[i - 1], next_list[i - 1]);
        add_vert (next_list[i - 1], current_list[i - 1], prev_list[i - 1]);
        add_vert (next_list[i], current_list[i], prev_list[i]);

        add_vert (prev_list[i - 1], current_list[i - 1], next_list[i - 1]);
        add_vert (next_list[i], current_list[i], prev_list[i]);
        add_vert (prev_list[i], current_list[i], next_list[i]);
    }
    return vertCount;
};

function LineRenderer (engine, layer) {
    FeatureRenderer.call (this, engine, layer);

    if (!(engine.shaders['line'])) {
        engine.shaders['line'] = makeProgram (engine.gl, BASE_DIR + 'shaders/line');
    }
    var line_shader = engine.shaders['line'];

    var stroke_buffers = new Buffers (engine.gl, 1024);
    //stroke_buffers.create ('vert', 2);
    //stroke_buffers.create ('norm', 2);
    stroke_buffers.create ('prev', 2);
    stroke_buffers.create ('current', 2);
    stroke_buffers.create ('next', 2);
    stroke_buffers.create ('unit', 2);

    stroke_buffers.create ('width', 1);
    stroke_buffers.create ('color', 3);
    stroke_buffers.create ('alpha', 1);

    //stroke_buffers.create ('unit', 2);

    var LineView = function (feature, feature_geom) {
        FeatureView.call (this, feature, layer, engine);

	var stroke_start = stroke_buffers.count ();
        var stroke_count = 0;

        this.style_map = {
            'stroke': function (color) {
	        stroke_buffers.repeat ('color', color.array, stroke_start, stroke_count);
            },
            'stroke-opacity': function (opacity) {
	        stroke_buffers.repeat ('alpha', [opacity], stroke_start, stroke_count);
            },
            'stroke-width': function (width) {
	        stroke_buffers.repeat ('width', [width], stroke_start, stroke_count);
            }
        };

        var point_cmp = function (p1, p2) {
            return ((p1[0] == p2[0]) && (p1[1] == p2[1]));
        };

        if (!feature_geom)
            feature_geom = feature.geom;

	$.each (feature_geom, function (i, poly) {
	    for (var i = 0; i < poly.length; i ++) {
		//stroke_count += poly[i].length * 6;
                //draw_graph_lines (stroke_buffers, poly[i]);
                stroke_count += draw_lines (stroke_buffers, poly[i]);
                /*if (point_cmp (poly[i][0], poly[i][poly[i].length - 1]))
                    draw_map_lines (stroke_buffers, poly[i]);
                else
		    draw_graph_lines (stroke_buffers, poly[i]);*/
	    }
	});

        this.update_all ();
    };

    this.view_factory = function (feature, feature_geom, draw_func) {
        return new LineView (feature, feature_geom, draw_func);
    };

    this.draw = function () {
        var gl = engine.gl;
	stroke_buffers.update ();	

	gl.useProgram (line_shader);
	
	line_shader.data ('world', engine.camera.worldToPx);
	line_shader.data ('screen', engine.camera.pxToScreen);


        line_shader.data ('prev', stroke_buffers.get ('prev'));
        line_shader.data ('current', stroke_buffers.get ('current'));
        line_shader.data ('next', stroke_buffers.get ('next'));
	line_shader.data ('color_in', stroke_buffers.get ('color'));
	line_shader.data ('alpha_in', stroke_buffers.get ('alpha'));
	line_shader.data ('circle_in', stroke_buffers.get ('unit'));
	line_shader.data ('width', stroke_buffers.get ('width'));
	
	line_shader.data ('px_w', 2.0 / engine.canvas.width ());
	line_shader.data ('px_h', 2.0 / engine.canvas.height ());
	gl.drawArrays (gl.TRIANGLES, 0, stroke_buffers.count ()); 
    }

};
    var INITIAL_POLYGONS = 1024;

function PolygonRenderer (engine, layer) {
    FeatureRenderer.call (this, engine, layer);

    if (!(engine.shaders['polygon'])) {
        engine.shaders['polygon'] = makeProgram (engine.gl, BASE_DIR + 'shaders/poly');
    }
    var poly_shader = engine.shaders['polygon'];

    var line_renderer = new LineRenderer (engine, layer);

    var fill_buffers = new Buffers (engine.gl, INITIAL_POLYGONS);
    fill_buffers.create ('vert', 2);
    fill_buffers.create ('color', 3);
    fill_buffers.create ('alpha', 1);

    var PolygonView = function (feature) {
        FeatureView.call (this, feature, layer, engine);

        var lines = line_renderer.create (feature);

        var fill_start;

        var fill_count;

        this.style_map = {
            'fill': function (color) {
	        fill_buffers.repeat ('color', color.array, fill_start, fill_count);
            },
            'fill-opacity': function (opacity) {
	        fill_buffers.repeat ('alpha', [opacity], fill_start, fill_count);
            }
        };

        var feature_geom = feature.geom;

	var simple = [];
	fill_count = 0;

	$.each (feature_geom, function (i, poly) {
            // Begin temp error handling code
            var p;
	    var count = 0;
	    while (count < 100) {
		try {
                    p = triangulate_polygon (poly);
                    break;
		} catch (e) {
		    count ++;
		}
	    }
	    if (count == 100)
                throw "Rendering Polygon Failed";
            
            // End temp error handling code
            
	    //var p = triangulate_polygon (poly);
            
	    fill_count += p.length / 2;
	    simple.push (p);
	});
        
	fill_start = fill_buffers.alloc (fill_count);
	var current = fill_start;
        
	$.each (simple, function (i, p) {	
	    var count = p.length / 2;
	    fill_buffers.write ('vert', p, current, count);
	    current += count;
	});

        this.update_all ();
    };

    this.view_factory = function (feature) {
        return new PolygonView (feature);
    };

    this.draw = function () {
        var gl = engine.gl;

	fill_buffers.update ();
	gl.useProgram (poly_shader);
        
	poly_shader.data ('screen', engine.camera.mat3);
	poly_shader.data ('pos', fill_buffers.get ('vert'));
	poly_shader.data ('color_in', fill_buffers.get ('color'));  
	poly_shader.data ('alpha_in', fill_buffers.get ('alpha'));  
	
	gl.drawArrays (gl.TRIANGLES, 0, fill_buffers.count ());

        line_renderer.draw ();
    };
};
    function TimeSeriesRenderer (engine, layer, options) {
    FeatureRenderer.call (this, engine, layer, options);
    
    var line_renderer = new LineRenderer (engine, layer);

    this.view_factory = function (feature) {
        var linestrings = [];
        var linestring = [];
        var order = layer.attr ('order');
        for (var i = 0; i < order.length; i ++) {
            var y = feature.attr (order[i]);

            // End this linestring and start a new one if the point is undefined
            if (isNaN (y)) {
                if (linestring.length > 0) {
                    linestrings.push (linestring);
                    linestring = [];
                }
            }
            else {
                //linestring.push ([(i - options.range.min.x) / (options.range.width ()), (y - options.range.min.y) / (options.range.height ())]);
                linestring.push ([i, y]);
            }
        }
        if (linestring.length > 0)
            linestrings.push (linestring);
        //linestring = [[.25, .75], [.3,0], [.35, .75], [1.5, .5]];
        //linestring = linestring.slice (20, 25);
        var feature_geom = [linestrings];

        return line_renderer.create (feature, feature_geom);
    };

    this.draw = function () {
        line_renderer.draw ();
    };

};

    var Querier = function (engine, layer) {
    queryTypes = {
        'Point': PointQuerier,
        'Polygon': PolygonQuerier,
        //'Line': lineQuerier
    };

    var queriers = {};
    $.each (queryTypes, function (geomType, GeomQuerier) {
        queriers[geomType] = new GeomQuerier (engine, layer, layer.features ().type (geomType));
    });

     this.boxSearch = function (box) {
        var results = new LayerSelector ([]);
        for (var key in queriers) {
            var search_results = queriers[key].boxSearch (box);
            results = results.join (search_results);
        }
        return results;
    };

    this.pointSearch = function (p) {
        var results = new LayerSelector ([]);
        for (var key in queriers) {
            var search_results = queriers[key].pointSearch (p);
            results = results.join (search_results);
        }
        return results;
    };
};
    // A controller for point specific operations, particualrly to perform geometric queries
// on points faster. 
var PointQuerier = function (engine, layer, points) {
    var search_points = [];
    var max_radius = 0;
    points.each (function (i, point) {
        var radius = StyleManager.derivedStyle (point, layer, engine, 'radius');
        if (radius > max_radius)
            max_radius = radius;
        $.each (point.geom, function (index, pair) {
            search_points.push ({
                x: pair[0],
                y: pair[1],
                ref: point
            });
        });
    });
    var range_tree = new RangeTree (search_points);

    this.boxSearch = function (box) {
        var elem = range_tree.search (box);
	var results = [];
	$.each (elem, function (index, point) {
	    results.push (point.ref);
	});
	return new LayerSelector (results);
    }

    this.pointSearch = function (s) {
        var min = vect.add (s, new vect (-max_radius, max_radius));
        var max = vect.add (s, new vect (max_radius, -max_radius));
        var box = new Box (engine.camera.project (min), engine.camera.project (max));
        var elem = range_tree.search (box);
        for (var i = 0; i < elem.length; i ++) {
            var point = elem[i].ref;

            var rad = StyleManager.derivedStyle (point, layer, engine, 'radius');
            for (var i = 0; i < point.geom.length; i ++) {
                var v = engine.camera.screen (geom2vect (point.geom[i]));
                if (vect.dist (v, s) < rad)
                    return new LayerSelector ([point.ref]);
            }
	}
        return new LayerSelector ([]);
    };
};
    var PolygonQuerier = function (engine, layer) {
    var r_points = [];
    layer.features ().each (function (n, polygon) {
	$.each (polygon.geom, function (i, poly) {
	    $.each (poly, function (j, ring) {
		$.each (ring, function (k, pair) {
		    r_points.push ({
                        ref: polygon,
			x: pair[0],
			y: pair[1]
		    });			
		});
	    });
	});
    });
    var tree = new RangeTree (r_points);

    this.boxSearch = function (box) {
        // Range search on the vertices of the polygon
	var elem = tree.search (box);
	var keys = {};
	$.each (elem, function (i, p) {
	    keys[p.ref.id] = p.ref;
	});
        // Check to see if one of the corners of the box are in the polygon
        layer.features ().each (function (i, polygon) {
            for (var j = 0; j < 4; j ++) {
                if (polygon.contains (box.vertex (j)))
                    keys[polygon.id] = polygon;
            }
        });
	var results = [];
	for (var k in keys) {
	    results.push (keys[k]);
	}
	return new LayerSelector (results);

    };
    this.pointSearch = function (p) {
        var results = [];
        layer.feature ().each (function (i, polygon) {
            if (polygon.contains (p))
                results.push (polygon);
        });
        return new LayerSelector (results);
    };
};

    function BaseEngine (selector, options) {
    var engine = this;

    default_model (options, {
	background: new Color (0, 0, 0, 1),
    });

    this.type = 'Engine';
    this.id = new_feature_id ();

    this.canvas = $ ('<canvas></canvas>').attr ('id', 'viewer');
    var gl = null;

    if (selector) {
	$ (selector).append (this.canvas);
	this.canvas.attr ('width', $ (selector).width ());
	this.canvas.attr ('height', $ (selector).height ());
    }
    else {
	selector = window;
	$ ('body').append (this.canvas);
	this.canvas.attr ('width', $ (selector).width ());
	this.canvas.attr ('height', $ (selector).height ());
	$ (window).resize (function (event) {
            engine.resize ();
        });
    }

    var framebuffers = [];

    this.resize = function () {
	this.canvas.attr ('width', $ (selector).width ());
	this.canvas.attr ('height', $ (selector).height ());	
	gl.viewport (0, 0, this.canvas.width (), this.canvas.height ());
	this.camera.reconfigure ();
	for (var i = 0; i < framebuffers.length; i ++) {
	    framebuffers[i].resize ();
	}
    };

    gl = setContext (this.canvas, DEBUG);
    this.gl = gl;
    gl.viewport (0, 0, this.canvas.width (), this.canvas.height ());

    gl.blendFunc (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable (gl.BLEND);

    this.camera = new Camera (this.canvas, options);
    this.scroller = new Scroller (this);

    this.extents = function (width) {
	this.camera.extents (width);
    };

    this.center = function (arg0, arg1) {
        if (arg1 === undefined)
	    this.camera.position (arg0);
        else
	    this.camera.position (new vect (arg0, arg1));
    };

    this.pxW = 1 / this.canvas.attr ('width');
    this.pxH = 1 / this.canvas.attr ('height');

    this.Renderers = {};

    this.renderers = {};
    this.views = {};

    this.styles = {};

    this.defaultStyle = function (f_type, key) {
        var value;
        if (f_type in this.styles) {
            value = this.styles[f_type][key];
        }
        if (value === null || value === undefined) {
            value = this.styles['default'][key];
        }
        if (value === null || value === undefined) {
            return null;
        }
        else {
            return value;
        }
        
    };

    // Used as a callback when the StyleManager changes a feature
    var update_feature = function (f, key) {
        engine.views[f.id].update (key);
    };

    EventManager.manage (this);

    this.append = function (layer) {
        // Legacy layer drawing code
        if ('draw' in layer) {
            this.scene[layer.id] = layer;
            return;
        }
        // An engine can only draw a layer once
        if (layer.id in this.renderers)
            throw "Added layer to Engine twice";

        EventManager.manage (layer);
        EventManager.linkParent (this, layer);

        this.renderers[layer.id] = {};
        layer.features ().each (function (i, f) {
            var key;
            if (f.type in engine.Renderers) {
                key = f.type;
            }
            else {
                key = 'default';
            }
            if (!(key in engine.renderers[layer.id])) {
                engine.renderers[layer.id][key] = new engine.Renderers[key] (engine, layer, options);
            }
            var view = engine.renderers[layer.id][key].create (f);
            view.update_all ();

            if (engine.views[f.id] !== undefined)
                throw "Cannot add a feature twice to the same Engine";

            engine.views[f.id] = view;
            
            //StyleManager.registerCallback (engine, f, update_feature);
            EventManager.manage (f);
            EventManager.linkParent (layer, f);
            EventManager.addEventHandler (f, 'style', update_feature);
            //f.change (handle_change);
        });
        //this.scene[layer.id] = this.renderers;
        this.layers[layer.id] = layer;
        this.queriers[layer.id] = new Querier (this, layer);

        // Temporary for dev: Make the layer immutable
        layer.fixed = true;
    };

    this.search = function (layer, box) {
        return this.queriers[layer.id].boxSearch (box);
    };

    this.style = function (object, key, value) {
        if (this.styles[object.id] === undefined)
            this.styles[object.id] = {};
        if (value === undefined) {
            if (this.styles[object.id][key] !== undefined)
                return this.styles[object.id][key];
            else
                return null;
        }
        else {
            this.styles[object.id][key] = value;

            // If initialized, update rendering property
            if (object.id in this.views) {
                this.views[object.id].update (key);
            }
            else if (object.id in this.renderers) {
                $.each (this.renderers[object.id], function (i, renderer) {
                    renderer.update ();
                });
            }
        } 
    };

    var sel = new SelectionBox (this);

    this.select = function (func)  {
	sel.select (func);
    };

    var selectEnabled = false;
    this.enableSelect = function () {
	this.scroller.disable ();
	sel.enable ();
        selectEnabled = true;
    };
    this.disableSelect = function () {
	this.scroller.enable ();
	sel.disable ();
        selectEnabled = false;
    };

    var old_time =  new Date ().getTime ();
    var fps_window = [];

    // Ensures that the main drawing function is called in the scope of the engine
    var draw = (function (engine) {
        return function () {
            engine.draw ();
        };
    }) (this);

    this.shaders = {};

    this.scene = {};
    this.layers = {};
    this.queriers = {};

    this.draw = function () {

        // Update the FPS counter
	var current_time = new Date ().getTime ();
	var dt = (current_time - old_time) / 1000;
	this.scroller.update (dt);
	if (fps_window.length >= 60)
	    fps_window.splice (0, 1);
	fps_window.push (dt);
	var fps = 0;
	for (var i = 0; i < fps_window.length; i ++) {
	    fps += fps_window[i];
	}
	fps /= fps_window.length;
	$ ('#fps').text (Math.floor (1 / fps));
	old_time = current_time;


        // Clear the old color buffer
	gl.clearColor(options.background.r, options.background.g, options.background.b, options.background.a);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.clearDepth (0.0);

        // Legacy drawing code
        $.each (this.scene, function (i, layer) {
            layer.draw (engine, dt);
        });
        
        $.each (this.renderers, function (i, layer_renderers) {
            $.each (layer_renderers, function (j, renderer) {
                    renderer.draw (dt);
            });
        });

	requestAnimationFrame (draw);

        if (selectEnabled) {
	    sel.draw (this, dt);
        }

    };

    this.enableZ = function () {
	gl.depthFunc (gl.LEQUAL);
	gl.enable (gl.DEPTH_TEST);
    };

    this.disableZ = function () {
	gl.disable (gl.DEPTH_TEST);
    }

    // Start the animation loop
    requestAnimationFrame (draw);
};


/*

//var set_id_color, bind_event;

var TILE_SERVER = 'http://eland.ecohealthalliance.org/wigglemaps';

var blur_shader = null;
var light_shader = null;

function Engine (selector, map, options) {
    if (!options) {
	options = {};
    }
    default_model (options, {
	base: 'default',
	background: new Color (0, 0, 0, 1),
	antialias: true
    });

    this.type = 'Engine';
    this.id = new_feature_id ();

    var that = this;
    this.canvas = $ ('<canvas></canvas>').attr ('id', 'viewer');
    if (selector) {
	$ (selector).append (this.canvas);
	this.canvas.attr ('width', $ (selector).width ());
	this.canvas.attr ('height', $ (selector).height ());
    }
    else {
	selector = window;
	$ ('body').append (this.canvas);
	this.canvas.attr ('width', $ (selector).width ());
	this.canvas.attr ('height', $ (selector).height ());
	$ (window).resize (function () {
	    that.resize ();
	});
    }

    this.resize = function () {
	that.canvas.attr ('width', $ (selector).width ());
	that.canvas.attr ('height', $ (selector).height ());	
	gl.viewport (0, 0, that.canvas.width (), that.canvas.height ());
	that.camera.reconfigure ();
	for (var i = 0; i < framebuffers.length; i ++) {
	    framebuffers[i].resize ();
	}
    };

    var gl = setContext (this.canvas, DEBUG);
    this.gl = gl;
    gl.viewport (0, 0, that.canvas.width (), that.canvas.height ());

    gl.blendFunc (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable (gl.BLEND);

    if (!blur_shader) {
	blur_shader = makeProgram (gl, BASE_DIR + 'shaders/blur');
    }
    if (!light_shader) {
	light_shader = makeProgram (gl, BASE_DIR + 'shaders/light');
    }
    var buffers = new Buffers (gl, 6);
    buffers.create ('vert', 2);
    buffers.create ('tex', 2);

    var start = buffers.alloc (6);

    buffers.write ('vert', rectv (new vect (-1, -1), new vect (1, 1)), start, 6);
    buffers.write ('tex', rectv (new vect (0, 0), new vect (1, 1)), start, 6);
    buffers.update ();
    //gl.clearColor(options.background.r, options.background.g, options.background.b, options.background.a);

    this.scene = [];

    this.shaders = {};

    //this.styler = new StyleManager ();
    this.camera = new Camera (this.canvas, options);
    this.scroller = new Scroller (this);

    this.pxW = 1 / this.canvas.attr ('width');
    this.pxH = 1 / this.canvas.attr ('height');

    this.Renderer = {
        'Point': PointRenderer,
        'Polygon': PolygonRenderer,
        'Line': LineRenderer,
    };

    this.sel = new SelectionBox (this);

    this.select = function (flag) {
	if (flag) {
	    this.scroller.disable ();
	    this.sel.enable ();
	}
	else {
	    this.scroller.enable ();
	    this.sel.disable ();
	}
    };

    //this.manager = new EventManager (this);

    var old_time =  new Date ().getTime ();
    var fps_window = [];

    //base_east = null;
    //base_west = null;

    this.attr = function (key, value) {
	if (key == 'base') {
	    options.base = value;
	    set_base ()
	}
    }

    var base = null;
    var set_base = function () {
	if (options.base == 'default' || options.base == 'nasa') {
	    var settings = copy (options);
	    copy_to (settings, {
		source: 'file',
		url: TILE_SERVER + '/tiles/nasa_topo_bathy',
		levels: 8,
		size: 256
	    });
	    base = new MultiTileLayer (settings);
	}
	else if (options.base == 'ne') {
	    var settings = copy (options);
	    copy_to (settings, {
		source: 'file',
		url: TILE_SERVER + '/tiles/NE1_HR_LC_SR_W_DR',
		levels: 6,
		size: 256
	    });
	    base = new MultiTileLayer (settings);
	}
	else if (options.base == 'ne1') {
	    var settings = copy (options);
	    copy_to (settings, {
		source: 'file',
		url: TILE_SERVER + '/tiles/NE1_HR_LC',
		levels: 6,
		size: 256
	    });
	    base = new MultiTileLayer (settings);
	}
	else {
	    base = null;
	}
        if (base)
            base.initialize (that);
    };
    set_base ();

    this.enable_z = function () {
	gl.depthFunc (gl.LEQUAL);
	gl.enable (gl.DEPTH_TEST);
    };

    this.disable_z = function () {
	gl.disable (gl.DEPTH_TEST);
    }

    var framebuffers = [];
    var framebuffer_stack = [null];
    this.framebuffer = function () {
	var framebuffer = gl.createFramebuffer ();
	gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer);
	framebuffer.width = that.canvas.width ();
	framebuffer.height = that.canvas.height ();
    
	var tex = gl.createTexture ();
	gl.bindTexture (gl.TEXTURE_2D, tex);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);  
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);  
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, framebuffer.width, framebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	
	var renderbuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, framebuffer.width, framebuffer.height);

	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
	
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	var frame = {
	    framebuffer: framebuffer,
	    renderbuffer: renderbuffer,
	    tex: tex,
	    resize: function () {
		framebuffer.width = that.canvas.width ();
		framebuffer.height = that.canvas.height ();

		gl.bindTexture (gl.TEXTURE_2D, tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, framebuffer.width, framebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, framebuffer.width, framebuffer.height);

		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	    },
	    activate: function (options) {
		if (!options)
		    options = {};
		default_model (options, {
		    blend: true,
		    clear: true
		});

		framebuffer_stack.push (framebuffer);
		
		if (!options.blend)
		    gl.disable (gl.BLEND);
		
		gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer);
		gl.viewport (0, 0, that.canvas.width (), that.canvas.height ());

		if (options.clear) {

		    gl.clearColor (0, 0, 0, 0);
		    gl.clear(gl.COLOR_BUFFER_BIT);
		    gl.clearDepth (0.0);
		}
	    },
	    deactivate: function () {
		var current = framebuffer_stack.pop ();
		var last = framebuffer_stack[framebuffer_stack.length - 1];
		if (current != framebuffer)
		    throw "Non-nested use of framebuffers";
		gl.bindFramebuffer (gl.FRAMEBUFFER, last);
		// THIS WILL CAUSE PROBLEMS - SAVE LAST VALUE OF BLEND
		gl.enable (gl.BLEND);
	    },
	};
	framebuffers.push (frame);
	return frame;
    };

    var screen_buffer = this.framebuffer ();
    var blur_hor = this.framebuffer ();

    this.draw_blur = function (tex) {
	gl.useProgram (blur_shader);
	
	blur_hor.activate ({
	    blend: false
	});
	
	blur_shader.data ('pos', buffers.get ('vert'))
	blur_shader.data ('tex_in', buffers.get ('tex'))
	blur_shader.data ('sampler', tex)
	blur_shader.data ('width', that.canvas.width  ());
	blur_shader.data ('height', that.canvas.height ())
	//blur_shader.data ('kernel', [2 * Math.sqrt (2), 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
	blur_shader.data ('hor', true);
	
	gl.drawArrays (gl.TRIANGLES, 0, buffers.count ());
	
	blur_hor.deactivate ();

	blur_shader.data ('pos', buffers.get ('vert'));
	blur_shader.data ('tex_in', buffers.get ('tex'));
	blur_shader.data ('sampler', blur_hor.tex);
	blur_shader.data ('width', that.canvas.width  ());
	blur_shader.data ('height', that.canvas.height ());
	//blur_shader.data ('kernel', [2 * Math.sqrt (2), 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
	blur_shader.data ('hor', false);
	
	gl.drawArrays (gl.TRIANGLES, 0, buffers.count ());
    };

    this.dirty = true;

    var draw = function () {
	var current_time = new Date ().getTime ();
	var dt = (current_time - old_time) / 1000;
	that.scroller.update (dt);
	if (fps_window.length >= 60)
	    fps_window.splice (0, 1);
	fps_window.push (dt);
	var fps = 0;
	for (var i = 0; i < fps_window.length; i ++) {
	    fps += fps_window[i];
	}
	fps /= fps_window.length;
	$ ('#fps').text (Math.floor (1 / fps));
	old_time = current_time;
	    
	gl.clearColor(options.background.r, options.background.g, options.background.b, options.background.a);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.clearDepth (0.0);

	var shade_ready = false;
	if (that.shade)
	    shade_ready = that.shade.ready ();

	if (shade_ready) {
	    screen_buffer.activate ();
	}

	if (base) {
	    base.draw (that, dt);
	}

	for (var i = 0; i < that.scene.length; i ++) {
	    that.scene[i].draw (that, dt, false);
	}

	that.sel.draw (that, dt);

	
	requestAnimationFrame (draw);
    };

    this.read_pixel = function (x, y) {
	gl.bindFramebuffer (gl.FRAMEBUFFER, that.framebuffer);
	var pixel = new Uint8Array (4);
	var perX = (x - that.canvas.position ().left)/ that.canvas.width ();
	var perY = (that.canvas.position ().top + that.canvas.height () - y) / that.canvas.height ();
	gl.readPixels (parseInt (perX * that.framebuffer.width), parseInt (perY * that.framebuffer.height), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
	gl.bindFramebuffer (gl.FRAMEBUFFER, null);
	return pixel;
    };

    $ (document).mousemove (function (event) {
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
    });

    this.canvas.click (function (event) {
    });
    
    this.canvas.dblclick (function (event) {
    });

    var dragging = false;
    this.canvas.mousedown (function (event) {
	dragging = true;
    });

    this.canvas.mouseup (function (event) {
	dragging = false;
    });

    this.canvas.mousemove(function (event) {
	if (dragging) {

	}
	else {
            var p = new vect (Mouse.x, Mouse.y);
	    $.each (that.scene, function (i, layer) {
		if (layer.update_move)
		    layer.update_move (that, p);
	    });
	}
    });

    this.canvas.mouseout (function (event) {
	$.each (that.scene, function (i, layer) {
	    if (layer.force_out)
		layer.force_out (that);
	});
    });

    requestAnimationFrame (draw);
    
};
*/
    var Map = function (selector, options) {
    var engine = this;

    if (options === undefined)
        options = {};

    default_model (options, {
        'width': 360,
        'center': new vect (0, 0)
    });

    BaseEngine.call (this, selector, options);    

    default_model (options, {
        'base': 'default',
        'tile-server': 'http://eland.ecohealthalliance.org/wigglemaps',
        'min': new vect (-180, -90),
        'max': new vect (180, 90),
    });

    this.Renderers = {
        'Point': PointRenderer,
        'Polygon': PolygonRenderer,
        'Line': LineRenderer,
    };

    this.styles = {
        'Point': {
            'fill': new Color (.02, .44, .69, 1.0),
            'opacity': 1.0,
            'radius': 5.0,
            'stroke': 'none',
            'stroke-width': 2.0
        },
        'Polygon': {
            'fill': new Color (.02, .44, .69, 1.0),
            'fill-opacity': .5,
            'stroke': new Color (.02, .44, .69, 1.0),
            'stroke-opacity': 1.0,
            'stroke-width': .75
        },
        'Line': {
            'stroke': new Color (.02, .44, .69, 1.0),
            'stroke-opacity': 1.0,
            'stroke-width': 2.0
        },
        'default': {
            'fill': new Color (.02, .44, .69, 1.0),
            'fill-opacity': .5,
            'stroke': new Color (.02, .44, .69, 1.0),
            'stroke-opacity': 1.0,
            'stroke-width': 1.0            
        }
    };

    var base = null;
    var setBase = function () {
	if (options.base == 'default' || options.base == 'nasa') {
	    var settings = copy (options);
	    copy_to (settings, {
		source: 'file',
		url: options['tile-server'] + '/tiles/nasa_topo_bathy',
		levels: 8,
		size: 256
	    });
	    base = new MultiTileLayer (settings);
	}
	else if (options.base == 'ne') {
	    var settings = copy (options);
	    copy_to (settings, {
		source: 'file',
		url: options['tile-server'] + '/tiles/NE1_HR_LC_SR_W_DR',
		levels: 6,
		size: 256
	    });
	    base = new MultiTileLayer (settings);
	}
	else if (options.base == 'ne1') {
	    var settings = copy (options);
	    copy_to (settings, {
		source: 'file',
		url: TILE_SERVER + '/tiles/NE1_HR_LC',
		levels: 6,
		size: 256
	    });
	    base = new MultiTileLayer (settings);
	}
	else {
	    base = null;
	}
        if (base) {
            base.initialize (engine);
            engine.scene[base.id] = base;
        };
    };
    setBase ();
};
/*var Map = function (selector, options) {
    this.center = function (x, y) {
	engine.camera.position (new vect (x, y));
    };

    this.vcenter = function (v) {
	this.center (v.x, v.y);
    };

    this.extents = function (width) {
	engine.camera.extents (width);
    };

    this.append = function (layer) {
        layer.initialize (engine);
	engine.scene.push (layer);
    };

    this.remove = function (layer) {
	for (var i = 0; i < engine.scene.length; i ++) {
	    if (engine.scene[i] == layer) {
		engine.scene.splice (i, 1);
		return true;
	    }
	}
	return false;
    };

    this.shade = function (data) {
	var shade = new Hillshade (data);
	engine.shade = shade;
    };

    this.select = function (func)  {
	if (!func)
	    engine.select (false);
	else {
	    engine.sel.select (func);
	    engine.select (true);
	}
    };

    this.resize = function () {
	engine.resize ();
    }

    this.attr = function (key, value) {
	engine.attr (key, value);
    };

    this.png = function () {
	var data = engine.canvas.get (0).toDataURL ();

	$.ajax ({
	    url: '../server/export.png',
	    type: 'POST',
	    data: data
	});
    };

    this.width = function () {
	return engine.canvas.innerWidth ();
    };

    this.height = function () {
	return engine.canvas.innerHeight ();
    };

    var click_func = null;
    this.click = function (func) {
	click_func = func;
    };

    engine = new Engine (selector, this, options);

    engine.canvas.click (function (event) {
	if (click_func) {
	    var v = new vect (event.pageX, event.pageY);
	    var p = engine.camera.project (v);
	    click_func (p);
	}
    });
};
*/
    function TimeSeries (selector, options) {
    if (options === undefined)
        options = {};
    BaseEngine.call (this, selector, options);
   
    default_model (options, {
        'range': new Box (new vect (0, 0), new vect (1, 1))
    });

    this.styles = {
        'default': {
            'fill': new Color (.02, .44, .69, 1.0),
            'fill-opacity': .5,
            'stroke': new Color (.02, .44, .69, 1.0),
            'stroke-opacity': 1.0,
            'stroke-width': 2.0,
        }
    };

    //this.extents (1, 1);
    //this.center (.5, .5);

    this.Renderers = {
        'default': TimeSeriesRenderer
    };
};

    function SelectionBox (engine) {
    var sel_box_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/selbox');
    var enabled = false;
    var dragging = false;
    var start = null;
    var end = null;
    var sel_buffer = dynamicBuffer (engine.gl, 6, 2);
    var bound_buffer = staticBuffer (engine.gl, rect (0, 0, 1, 1), 2);
    var reset_rect = function () {
	sel_buffer.update (rectv (start, end), 0);
    };
    engine.canvas.bind ('mousedown', function (event) {
	if (!enabled)
	    return;
	dragging = true;
	show = true;
	start = engine.camera.percent (new vect (event.clientX, event.clientY));
	end = start;
	reset_rect ();
    });

    var release_func = function ()  {};
    this.select = function (func) {
	release_func = func;
    };

    $ (document).bind ('mouseup', function (event) {
	if (!enabled)
	    return;
	if (!dragging)
	    return;
	var min = engine.camera.project (engine.camera.pixel (start));
	var max = engine.camera.project (engine.camera.pixel (end));
	if (min.x > max.x) {
	    var tmp = min.x;
	    min.x = max.x;
	    max.x = tmp;
	}
	if (min.y > max.y) {
	    var tmp = min.y;
	    min.y = max.y;
	    max.y = tmp;
	}
	dragging = false;
	release_func (new Box (min, max));
    });

    $(document).bind ('click', function (event) {
	if (!enabled)
	    return;
	show = false;
    });

    $(document).bind ('mousemove', function (event) {
	if (!enabled)
	    return;
	if (dragging) {
	    end = engine.camera.percent (new vect (event.clientX, event.clientY));	    
	    reset_rect ();
	}
    });

    this.enable = function () {
	enabled = true;
    };

    this.disable = function () {
	enabled = false;
    }
    
    this.draw = function (engine, dt) {
        var gl = engine.gl;
	if (dragging) {
	    gl.useProgram (sel_box_shader);
	    
	    sel_box_shader.data ('pos', sel_buffer);
	    sel_box_shader.data ('edge_in', bound_buffer);
	    
	    gl.drawArrays (gl.TRIANGLES, 0, sel_buffer.numItems); 
	}
    };
};
    var triangulate_polygon = function (elem) {
    var poly = [];
    for (var k = 0; k < elem.length; k++) {
	var p = [];
	//for (var i = elem[k].length - 1; i >= 1; i --) {
	for (var i = 1; i < elem[k].length; i ++) {
	    p.push (rand_map (elem[k][i][0], elem[k][i][1]));
	}
	p.push (poly[0]);
	poly.push (p);
    }
    return trapezoid_polygon (poly); 
};

function circle (index, length) {
    while (index >= length)
	index -= length;
    while (index < 0)
	index += length;
    return index
};

/*function Trapezoid (p0, p1, p2, p3) {
    this.points = [p0, p1, p2, p3];
    this.adj = [null, null, null, null];
    this.inside = false;
    this.poly = [false, false, false, false];

    var circle (index) {
	while (index >= this.points.length)
	    index -= this.points.length;
	while (index < 0)
	    index += this.points.length;
	return index
    };

    this.contains = function (p) {
	for (var i = 0; i < this.points.length; i ++) {
	    var j = circle (i);
	    if (!vect.left (this.points[i], this.points[j], p))
		return false;
	};
	return true;
    };
};*/

function Vertex (current, upper, lower, index) {
    this.current = current;
    this.upper = upper;
    this.lower = lower;
    this.index = index;
};

function xsearch (sweep, poly, index) {
    var upper = sweep.length - 1;
    var lower = 0;
    var current = parseInt ((sweep.length - 1) / 2);
    if (sweep.length == 0) {
	return 0;
    }
    while (true) {
	if (upper < 0 || lower >= sweep.length) {
	    console.log (upper, lower, current, sweep.length);
	    throw "Index Out of Bounds";
	}
	if (sweep[current] == index) {
	    return current;
	}
	if (upper == lower) {
	    if (poly[sweep[current]].x > poly[index].x) {
		return current;
	    }
	    else {
		return current + 1;
	    }
	}
	if (poly[sweep[current]].x > poly[index].x) {
	    upper = current;
	}
	else if (poly[sweep[current]].x < poly[index].x) {
	    lower = current + 1;
	}
	else {
	    if (poly[sweep[current]].y > poly[index].y) {
		if (lower == current)
		    return lower;
		upper = current - 1;
	    }
	    else {
		if (upper == current)
		    return current;
		lower = current + 1;
	    }
	}
	current = parseInt ((upper + lower) / 2);
    }
};

function set_contains (sweep, index) {
    for (var i = 0; i < sweep.length; i ++) {
	if (sweep[i] == index)
	    return true;
    }
    return false;
};

function solvex (poly, index, slice) {
    if (index == undefined)
	throw "whoa";
    if ((poly[index + 1].y - poly[index].y) == 0)
	return Math.min (poly[index].x, poly[index + 1].x);
    var t = (slice - poly[index].y) / (poly[index + 1].y - poly[index].y);
    //console.log ('t', slice, poly[index + 1].y,  poly[index].y, t);
    return poly[index].x + (poly[index + 1].x - poly[index].x) * t;
};

function find_index (sweep, index) {
    for (var i = 0; i < sweep.length; i ++) {
    	if (sweep[i] == index)
	    return i;
    }
    return false;
};

function sorted_index (sweep, poly, xpos, slice) {
    for (var i = 0; i < sweep.length; i ++) {
	var sxpos = solvex (poly, sweep[i], slice);
	//console.log (sweep[i], index, xpos, sxpos);
	if (sxpos > xpos)
	    return i;
	if (sxpos - xpos == 0) {
	    //console.log ('same', sweep[i], index, poly[sweep[i]].y, poly[index].y);
	    if (poly[sweep[i]].y > poly[index].y)
		return i;
	}
    }
    //console.log ('biggest');
    return sweep.length;
};
    
/*function add (sweep, poly, index) {
    var i = ysearch (sweep, poly, index);
    sweep.splice (i, 0, index);
};

function remove (sweep, poly, index) {
    var i = ysearch (sweep, poly, index);
    if (sweep[i] == index)
	return sweep.splice (i, 1)[0];
    throw "Element Not Found: [" + sweep + '] ' + sweep[i] + ' ' + index;
};*/

function intersect (v, poly, index) {
    return new vect (solvex (poly, index, poly[v].y), poly[v].y);
};

function add_point (trap, a) {
    if (!a)
	throw "eek";
    trap.push (a.x);
    trap.push (a.y);
    //trap.push (1.0);
}

function add_trap (trap, bottom, top) {
    if (!bottom || !top || ((top.length + bottom.length != 3) && (top.length + bottom.length != 4)))
	throw "ahh";
    /*for (var i = 0; i < bottom.length; i ++) {
	console.log (bottom[i].x, bottom[i].y);
    }
    for (var i = 0; i < top.length; i ++) {
	console.log (top[i].x, top[i].y);
    }
    console.log ('');*/
    if ((bottom.length + top.length) == 3) {
	for (var i = 0; i < bottom.length; i ++) {
	    add_point (trap, bottom[i]);
	}
	for (var i = 0; i < top.length; i ++) {
	    add_point (trap, top[i]);
	}
    }
    else {
	if (bottom[1].x < bottom[0].x) {
	    var tmp = bottom[0];
	    bottom[0] = bottom[1];
	    bottom[1] = tmp;
	}
	if (top[1].x < top[0].x) {
	    var tmp = top[0];
	    top[0] = top[1];
	    top[1] = tmp;
	}
	
	/*if (bottom[0].y != bottom[1].y)
	    throw 'y';
	if (top[0].y != top[1].y)
	    throw 'y';
	if (bottom[0].x == bottom[1].x)
	    throw 'x';
	if (top[0].x == top[1].x)
	    throw 'x';*/
	add_point (trap, bottom[0]);
	add_point (trap, bottom[1]);
	add_point (trap, top[1]);

	add_point (trap, top[0]);
	add_point (trap, top[1]);
	add_point (trap, bottom[0]);
    }
};

function trapezoid_polygon (poly_in) {
    var vertices = [];
    var count = 0;
    var poly = [];
    for (var k = 0; k < poly_in.length; k ++) {
	for (var i = 0; i < poly_in[k].length - 1; i ++) {
	    var j = circle (i + 1, poly_in[k].length - 1);
	    var h = circle (i - 1, poly_in[k].length - 1);
	    vertices.push (new Vertex (i + count, j + count, h + count, k));
	    poly.push (poly_in[k][i]);
	}
	poly.push (poly_in[k][0]);
	count += poly_in[k].length;
    }
    vertices.sort (function (a, b) {
	// Fix me! will fail with horizontal lines
	return poly[a.current].y - poly[b.current].y;
    });
    var sweep = [];
    var state = [];
    var lower = new vect (-200, 0);
    var upper = new vect (200, 0);
    var count = 0
    var pairs = [];
    var change = 0;
    var trap = [];
    //console.log (vertices, poly);
    for (var i = 0; i < vertices.length; i ++) {
	var v = vertices[i];
	var l_in = set_contains (sweep, v.lower);
	var u_in = set_contains (sweep, v.current);

	//console.log (v);

	/*var l_pos = sorted_index (sweep, poly, v.lower, poly[v.current].y);
	var u_pos = sorted_index (sweep, poly, v.current, poly[v.current].y);*/

	var l_pos, u_pos;
	if (l_in && !u_in) {
	    l_pos = find_index (sweep, v.lower);
	    u_pos = l_pos;
	}
	else if (u_in && !l_in) {
	    u_pos = find_index (sweep, v.current);
	    l_pos = u_pos;
	}
	else if (l_in && u_in) {
	    l_pos = find_index (sweep, v.lower);
	    u_pos = find_index (sweep, v.current);
	}
	else if (!l_in && !u_in) {
	    u_pos = sorted_index (sweep, poly, poly[v.current].x, poly[v.current].y);
	    l_pos = u_pos;
	}

	if (Math.abs (l_pos - u_pos) > 1) {
	    for (var j = 0; j < sweep.length; j ++) {
		//console.log (solvex (poly, sweep[j], poly[v.current].y));
	    }
	    //console.log ('prev', solvex (poly, v.lower, poly[v.current].y));
	    //console.log ('current', solvex (poly, v.current, poly[v.current].y));
	    throw "Bad";
	}

	//var above_in = poly[v.upper].x >= poly[v.current].x;
	var above_in = vect.left (poly[v.lower], poly[v.current], poly[v.upper]);
	//console.log (above_in, poly[v.upper].x - poly[v.current].x);

	var s_index = Math.floor (Math.min (l_pos, u_pos) / 2);

	if (!above_in && !l_in && !u_in) {
	    //console.log ('pos1', v.current, u_pos, l_pos);
	    add_trap (trap, state[s_index], [intersect (v.current, poly, sweep[u_pos - 1]), intersect (v.current, poly, sweep[u_pos])]);
	    state.splice (s_index, 1, [intersect (v.current, poly, sweep[u_pos - 1]), poly[v.current]], 
			  [poly[v.current], intersect (v.current, poly, sweep[l_pos])]);	    
	}
	else if (above_in && !l_in && !u_in) {
	    //console.log ('pos2', u_pos, l_pos);
	    state.splice (s_index, 0, [poly[v.current]]);
	}
	else if (l_in && !u_in) {
	    //console.log ('pos3', u_pos, l_pos, s_index);
	    add_trap (trap, state[s_index], [intersect (v.current, poly, sweep[Math.max (l_pos, u_pos) - 1]), poly[v.current]]);
	    state[s_index] = [intersect (v.current, poly, sweep[Math.min (l_pos, u_pos) - 1]), poly[v.current]];
	}
	else if (!l_in && u_in) {
	    //console.log ('pos4', u_pos, l_pos, s_index);
	    add_trap (trap, state[s_index], [poly[v.current], intersect (v.current, poly, sweep[Math.min (u_pos, l_pos) + 1])]);
	    state[s_index] = [poly[v.current], intersect (v.current, poly, sweep[Math.max (u_pos, l_pos) + 1])];
	    //if (state[s_index][0].x > state[s_index][1].x)
	    //state[s_index] = [intersect (v.current, poly, sweep[Math.min (u_pos, l_pos) - 1]), poly[v.current]];
	}
	else if (!above_in && l_in && u_in) {
	    //console.log ('pos5', u_pos, l_pos, s_index);
	    
	    add_trap (trap, state[s_index], [intersect (v.current, poly, sweep[Math.min (l_pos, u_pos) - 1]), poly[v.current]]);
	    add_trap (trap, state[s_index + 1], [intersect (v.current, poly, sweep[Math.max (l_pos, u_pos) + 1]), poly[v.current]]);

	    state.splice (s_index, 2, [intersect (v.current, poly, sweep[Math.min (l_pos, u_pos) - 1]), intersect (v.current, poly, sweep[Math.max (l_pos, u_pos) + 1])]);
	}
	else if (above_in && l_in && u_in) {
	    //console.log ('pos6', u_pos, l_pos);
	    add_trap (trap, state[s_index], [poly[v.current]]);
	    state.splice (s_index, 1);	    
	}

	if (l_in && !u_in) {
	    sweep[l_pos] = v.current;
	}
	else if (u_in && !l_in) {
	    sweep[u_pos] = v.lower;
	}
	else if (l_in && u_in) {
	    sweep.splice (find_index (sweep, v.lower), 1);
	    sweep.splice (find_index (sweep, v.current), 1);
	}
	else if (!l_in && !u_in) {
	    //if (poly[v.lower].x > poly[v.upper].x)
	    if (!above_in)
		sweep.splice (l_pos, 0, v.current, v.lower);
	    else
		sweep.splice (l_pos, 0, v.lower, v.current);
	}

	for (var j = 0; j < sweep.length - 1; j ++) {
	    if (solvex (poly, sweep[j], poly[v.current].y) > solvex (poly, sweep[j + 1], poly[v.current].y)) {
		//console.log (solvex (poly, sweep[j], poly[v.current].y), solvex (poly, sweep[j + 1], poly[v.current].y));
		console.log ('Misplaced Sweep');
		throw "Misplace!";
	    }
	}

	/*for (var j = 0; j < state.length; j ++) {
	    for (var k = 0; k < state[j].length - 1; k ++) {
		if (vect.dist (state[j][k], state[j][k + 1]) == 0) 
		    throw "Double!";
		if (state[j][k].x > state[j][k + 1].x)
		    throw "Order!";
	    }
	}*/

	/*if (l_in) {
	    //console.log (v.lower, 'out', l_pos);
	    //console.log (v.lower, 'out', l_pos, sweep.toString ());
	    if (l_pos > u_pos)
		u_pos --;
	    sweep.splice (find_index (sweep, v.lower), 1);
	}
	else {
	    //console.log (v.lower, 'in', l_pos);
	    if (u_pos >= l_pos)
		u_pos ++;
	    sweep.splice (l_pos, 0, v.lower);
	}

	//u_pos = sorted_index (sweep, poly, v.current, poly[v.current].y);
	if (u_in) {
	    //console.log (v.current, 'out', u_pos);
	    //console.log (v.current, 'out', u_pos, sweep.toString ());
	    sweep.splice (find_index (sweep, v.current), 1);
	}
	else {
	    //console.log (v.current, 'in', u_pos);
	    if (!l_in && poly[v.current].x > poly[v.upper].x)
		sweep.splice (l_pos, 0, v.current);
	    else
		sweep.splice (l_pos + 1, 0, v.current);
	}*/
	
	/*lower.y = poly[v.current].y;
	upper.y = poly[v.current].y;
	var l_index = xsearch (sweep, poly, v.lower);
	var u_index = xsearch (sweep, poly, v.current);

	var l_left = vect.left (lower, upper, poly[v.lower]);
	var u_left = vect.left (lower, upper, poly[v.upper]);
	var bottom, top;
	if (l_left != u_left) {
	    if (u_left) {
		bottom = sweep[u_index - 1];
		top = sweep[u_index];
	    }
	    else {
		bottom = sweep[u_index];
		top = sweep[u_index + 1];
	    }
	}
	else {
	    if (u_left) {
		bottom = sweep[u_index - 1];
		top = sweep[u_index];
	    }
	    else {
		bottom = sweep[u_index - 1];
		top = sweep[u_index + 1];
	    }
	}

	if (sweep[l_index] == v.lower) {
	    console.log ('found');
	    sweep.splice (l_index, 1);
	}
	else {
	    sweep.splice (l_index, 0, v.lower);
	}

	if (sweep[u_index] == v.current) {
	    console.log ('found');
	    sweep.splice (u_index, 1);
	}
	else {
	    sweep.splice (u_index, 0, v.current);
	}
	var done = false;
	for (var j = 0; j < pairs.length; j ++) {
	    if (pairs[j][0] == bottom && pairs[j][1] == top){
		pairs.splice (j, 1);
		done = true;
		change ++;
	    }
	}
	if (!done) {
	    pairs.push ([bottom, top]);
	}*/
	/*if (!vect.left (lower, upper, poly[v.lower])) {
	    remove (sweep, poly, v.lower);
	}
	else {
	    add (sweep, poly, v.lower);
	}
	if (!vect.left (lower, upper, poly[v.upper])) {
	    remove (sweep, poly, v.current);
	}
	else {
	    add (sweep, poly, v.current);
	}*/
    
    }
    if (sweep.length > 0) {
	console.log (sweep);
	throw "Bad " + sweep.length;
    }
    //console.log (change);
    if (pairs.length > 0) {
	console.log (pairs);
	throw "Wrong";
    }
    //console.log (change, pairs.length);
    return trap;
    /*var indices = [];
    for (var i = 0; i < poly.length; i ++) {
	indices.push (i);
    };
    for (var i = indices.length - 1; i >= 0; i --) {
	var j = Math.floor (Math.random () * i);
	var tmp = indices[i];
	indices[i] = indices[j];
	indices[j] = tmp;
    };
    var i = indices.pop ();
    var j = circle (index, poly);
    new Trapezoid (poly[index], poly[j], */
    
};
    function AABBNode (feature, bounds, first, second) {
    this.bounds = bounds;
    this.feature = feature;

    this.first = null;
    this.second = null;

    this.dist = function (node) {
        return vect.dist (this.bounds.centroid (), node.bounds.centroid ());
    };
    
    this.join = function (node) {
        return new AABBNode (null, this.bounds.union (node.bounds), this, node);
    };
};

function AABBTree (features) {
    var nodes = [];
    
    for (var key in features) {
        var node = new AABBNode (features[key], features[key].bounds, null, null);
        nodes.push (node);
    }

    var join_nearest = function () {
        var min_dist = Infinity;
        var min_i = -1;
        var min_j = -1;
        for (var i = 0; i < nodes.length; i ++) {
            for (var j = 0; j < i; j ++) {
                var dist = nodes[i].dist (nodes[j]);
                if (dist < min_dist) {
                    min_dist = dist;
                    min_i = i;
                    min_j = j;
                }
            }
        }
        var new_box = nodes[min_i].join (nodes[min_j]);
        nodes.splice (min_i, 1);
        nodes.splice (min_j, 1);
        nodes.push (new_box);
    };

    while (nodes.length > 2) {
        join_nearest ();
    }

    console.log (nodes[0]);
    
};
    function Box (v1, v2) {
    this.min = v1.clone ();
    this.max = v2.clone ();
    this.contains = function (p) {
	return (v1.x <= p.x) && (v2.x >= p.x) && (v1.y <= p.y) && (v2.y >= p.y);
    };

    this.x_in = function (p) {
	return (v1.x <= p.x) && (v2.x >= p.x);
    };

    this.x_left = function (p) {
	return (v1.x >= p.x);
    };

    this.x_right = function (p) {
	return (v2.x <= p.x);
    };

    this.y_in = function (p) {
	return (v1.y <= p.y) && (v2.y >= p.y);
    };

    this.y_left = function (p) {
	return (v1.y >= p.y);
    };

    this.y_right = function (p) {
	return (v2.y <= p.y);
    };

    this.area = function () {
	return (this.max.x - this.min.x) * (this.max.y - this.min.y);
    }

    this.height = function () {
	return this.max.y - this.min.y;
    };

    this.width = function () {
	return this.max.x - this.min.x;
    };
    
    this.vertex = function (index) {
	switch (index) {
	case 0:
	    return this.min.clone ();
	    break;
	case 1:
	    return new vect (this.max.x, this.min.y);
	    break;
	case 2:
	    return this.max.clone ();
	    break;
	case 3:
	    return new vect (this.min.x, this.max.y);
	    break;
	default:
	    throw "Index out of bounds: " + index ;
	}
    };

    this.intersects = function (box) {
	for (var i = 0; i < 4; i ++) {
	    for (var j = 0; j < 4; j ++) {
		if (vect.intersects (this.vertex (i), this.vertex ((i + 1) % 4),
				     box.vertex (j), box.vertex ((j + 1) % 4)))
		    return true;
	    }
	}
	if (this.contains (box.min) &&
	    this.contains (box.max) &&
	    this.contains (new vect (box.min.x, box.max.y)) &&
	    this.contains (new vect (box.max.x, box.min.y)))
	    return true;
	if (box.contains (this.min) &&
	    box.contains (this.max) &&
	    box.contains (new vect (this.min.x, this.max.y)) &&
	    box.contains (new vect (this.max.x, this.min.y)))
	    return true;
	return false
    };

    this.union = function (b) {
	this.min.x = Math.min (this.min.x, b.min.x);
	this.min.y = Math.min (this.min.y, b.min.y);

	this.max.x = Math.max (this.max.x, b.max.x);
	this.max.y = Math.max (this.max.y, b.max.y);
    };

    this.centroid = function () {
	return new vect ((this.max.x + this.min.x) / 2, (this.max.y + this.min.y) / 2);
    };

    this.clone = function () {
	return new Box (v1, v2);
    };
};

function RangeNode (elem, start, end, current) {
    this.data = elem[current];
    this.left = null;
    this.right = null;
    if (start != current)
	this.left = new RangeNode (elem, start, current - 1, parseInt ((start + (current - 1)) / 2));
    if (end != current)
	this.right = new RangeNode (elem, current + 1, end, parseInt ((end + (current + 1)) / 2));
    this.subtree = [];
    for (var i = start; i <= end; i ++) {
	this.subtree.push (elem[i]);
    };
    this.subtree.sort (function (a, b) {
	return a.y - b.y;
    });

    var xrange = function (b) {
	return (b.x_in (elem[start]) && b.x_in (elem[end]));
    };

    this.yrange = function (b, start, end) {
	return (b.y_in (this.subtree[start]) && b.y_in (this.subtree[end]));
    };

    this.subquery = function (result, box, start, end, current) {
	if (this.yrange (box, start, end)) {
	    for (var i = start; i <= end; i ++) {
		result.push (this.subtree[i]);
	    }
	    return;
	};
	if (box.y_in (this.subtree[current]))
	    result.push (this.subtree[current]);
	if (box.y_left (this.subtree[current])){
	    if (current != end)
		this.subquery (result, box, current + 1, end, parseInt ((end + (current + 1)) / 2));
	}
	else if (box.x_right (this.subtree[current])) {
	    if (current != start)
		this.subquery (result, box, start, current - 1, parseInt ((start + (current - 1)) / 2));
	}
	else {
	    if (current != end)
		this.subquery (result, box, current + 1, end, parseInt ((end + (current + 1)) / 2));
	    if (current != start)
		this.subquery (result, box, start, current - 1, parseInt ((start + (current - 1)) / 2));
	}
    };
    
    this.search = function (result, box) {
	if (xrange (box)) {
	    this.subquery (result, box, 0, this.subtree.length - 1, parseInt ((this.subtree.length - 1) / 2));
	    return;
	}
	else {
	    if (box.contains (this.data))
		result.push (this.data);
	    if (box.x_left (this.data)) {
		if (this.right)
		    this.right.search (result, box);
	    }
	    else if (box.x_right (this.data)) {
		if (this.left)
		    this.left.search (result, box);
	    }
	    else {
		if (this.left)
		    this.left.search (result, box);
		if (this.right)
		    this.right.search (result, box);
	    }
	}
    };
};

function RangeTree (elem) {
    elem.sort (function (a, b) {
	return a.x - b.x;
    });
    if (elem.length > 0)
        this.root = new RangeNode (elem, 0, elem.length - 1, parseInt ((elem.length - 1) / 2));
    else
        this.root == null;

    this.search = function (_box) {
        if (!this.root)
            return [];
	//var box = new Box (min, max);
        var box = _box.clone ();
	var result = [];
	this.root.search (result, box);
	return result;
    };
};

    // Constructor for the basic geometry types that can be rendered

var STYLE = 1;
var ATTR = 2;
var GEOM = 3;

var Feature = function (prop, layer) {
    var feature = this;

    // Unique feature ID
    this.id = new_feature_id ();
    this.type = 'Feature';

    // The Geometry type
    this.type = prop.type;

    var attr = prop.attr;

    // Attribute getter and setter
    this.attr = function (key, value) {
        if (value === undefined) {
            return attr[key];
        }
        else {
            throw "Not Implemented";
        }
    };

    // The geometry of the object
    this.geom = prop.geom;

    // Retreives or sets the geometry of the object
    this.geometry = function () {

    };

    /*var change_callbacks = [];

    var trigger_change = function (mode, key, value) {
        $.each (change_callbacks, function (i, callback) {
            callback (feature, mode, key, value);
        });
    };

    // A function to broadcast when the geometry or feature specific styles change
    // This is used when changes occur that views may not be aware of
    this.change = function (change_func) {
        change_callbacks.push (change_func);
    };

    this.compute = function (engine, key) {
        return derived_style (engine, this, layer, key);
    };*/

    this.style = function (arg0, arg1, arg2) {
        var engine, key, value;
        if (!arg0 || arg0.type == 'Engine') {
            engine = arg0;
            key = arg1;
            value = arg2;
        }
        else {
            engine = null;
            key = arg0;
            value = arg1;
        }
        if (value === undefined) {
            return StyleManager.getStyle (this, engine, key);
        }
        else {
            StyleManager.setStyle (this, engine, key, value);
            return this;
        }
    };
};

var EARTH = 6378.1

var new_feature_id = (function () {
    var current_id = 1;
    return function () {
	var id = current_id;
	current_id ++;
	return id;
    };
}) ();

var rand_map = (function () {
    var factor = 1e-6
    var xmap = {} 
    var ymap = {} 
    return function (x, y) {
	// Temporary Fix
	return new vect (x + Math.random () * factor - (factor / 2), y + Math.random () * factor - (factor / 2));
	// End Temp
	var key = x.toString () + ',' + y.toString ();
	if (!(key in xmap)) {
	    xmap[key] = x + Math.random () * factor - (factor / 2);
	    ymap[key] = y + Math.random () * factor - (factor / 2);
	}
	return new vect (xmap[key], ymap[key]);
    };
}) ();
    var geom_types = {
    'Point': Point,
    'Polygon': Polygon,
    'Line': Line
};

function Layer (options) {
    if (!options)
        options = {};

    this.id = new_feature_id ();
    this.type = 'Layer';

    // The layer's style properties
    var layer_style = {};

    // Lookup for each geometry type
    var features = {};

    // Copy over the defined styles
    if (options.style) {
        throw "Not Implemeneted";
    }

    this.style = function (arg0, arg1, arg2) {
        var engine, key, value;
        if (!arg0 || arg0.type == 'Engine') {
            engine = arg0;
            key = arg1;
            value = arg2;
        }
        else {
            engine = null;
            key = arg0;
            value = arg1;
        }
        if (value === undefined) {
            return StyleManager.getStyle (this, engine, key);
        }
        else {
            StyleManager.setStyle (this, engine, key, value);
            return this;
        }
    };

    this.bounds = null;

    this.features = function () {
        var elem = [];
        for (var id in features) {
            elem.push (features[id]);
        }
        return new LayerSelector (elem);
    };

    var props = {};
    this.properties = function () {
        var results = [];
        for (var key in props) {
            results.push (key);
        }
        return results;
    };
    this.numeric = function () {
        var results = [];
        for (var key in props) {
            if (props[key])
                results.push (key);
        }
        return results;
    };

    var layer_attr = {};
    this.attr = function (key, value) {
        // Getter if only one argument passed
        if (arguments.length < 2) {
            if (layer_attr[key] !== undefined)
                return layer_attr[key];
            else
                return null;
        }
        // Otherwise, set property
        else {
            layer_attr[key] = value;
        }
    };

    this.fixed = false;
    
    this.append = function (feature) {
        if (this.fixed)
            throw "Layers are currently immutable once added to a map";
        var f = new geom_types[feature.type] (feature, this);
        features[f.id] = f;

        // Update the layer bounding box
	if (this.bounds)
	    this.bounds.union (f.bounds);
	else
	    this.bounds = f.bounds.clone ();

        for (var key in feature.attr) {
            if (props[key] === undefined) { 
                if (!isNaN (feature.attr[key]))
                    props[key] = true;
                else
                    props[key] = false;
            }
            else {
                if (!isNaN (feature.attr[key]) && props[key])
                    props[key] = true;
                else
                    props[key] = false;
            }
        };

        dirty = true;
    };

    // User defined event handler functions
    var over_func = null, out_func = null;
    this.mouseover = function (func) {
	over_func = func;
    };

    this.mouseout = function (func) {
        out_func = func;
    };

    // Receive low level mouse position handlers from the bound engine
    var current_over = {};
    this.update_move = function (engine, p) {
	if (over_func || out_func) {
	    var c = this.map_contains (engine, p);
	    var new_over = {};
	    if (c) {
		c.each (function (i, f) {
		    new_over[f.id] = f;
		});
	    }
	    for (var key in current_over) {
		if (!(key in new_over) && out_func) 
		    out_func (current_over[key]);
	    }
	    for (var key in new_over) {
		if (!(key in current_over) && over_func) 
		    over_func (new_over[key]);
	    }
	    current_over = new_over;    
        }
    };
    this.force_out = function () {
	for (var key in current_over) {
	    if (out_func)
		out_func (current_over[key]);
	}
	current_over = {};
    };
};
    // A point for the layer. A point is actually a multi-point, so it can be
// made up of many "spatial" points. The geometry format for the point type is:
// [[lon, lat], [lon, lat], [lon, lat], ...]
var Point = function (prop, layer) {
    Feature.call (this, prop, layer);

    // Converts geometry representation of a point to a vector
    var geom2vect = function (geom) {
        return new vect (geom[0], geom[1]);
    };

    // Set the bounding box for the point
    this.bounds = null;
    for (var i = 0; i < this.geom.length; i ++) {
        var pos = geom2vect (this.geom[i]);
        var bbox = new Box (pos.clone (), pos.clone ());
	if (this.bounds)
	    this.bounds.union (bbox);
	else
	    this.bounds = bbox;
    }

    // Check if a point (usually a mouse position) is contained in the buffer
    // of this Point
    this.map_contains = function (engine, p) {
        //var s = engine.camera.screen (p);
        var s = p;
        //var rad = this.compute ('radius');
        var rad = StyleManager.derivedStyle (this, layer, engine, 'radius');
        for (var i = 0; i < this.geom.length; i ++) {
            var v = engine.camera.screen (geom2vect (this.geom[i]));
            if (vect.dist (v, s) < rad)
                return true;
        }
        return false;
    };
};


var PointCollection = function (points) {
    var search_points = [];
    var max_radius = 0;
    $.each (points, function (key, point) {
        var radius = StyleManager.derivedStyle (this, layer, engine, 'radius');
        if (radius > max_radius)
            max_radius = radius;
        $.each (point.geom, function (index, pair) {
            search_points.push ({
                x: pair[0],
                y: pair[1],
                ref: point
            });
        });
    });
    var range_tree = new RangeTree (search_points);

    // Search a rectangle for point contained within
    this.search = function (box) {
        var elem = range_tree.search (box);
	var results = [];
	$.each (elem, function (index, point) {
	    results.push (point.ref);
	});
	return new LayerSelector (results);
    };

    // Determine if a point is contained in the buffer of any of the points
    this.map_contains = function (engine, p) {
        //var s = engine.camera.screen (p);
        var s = p;
        var min = vect.add (s, new vect (-max_radius, max_radius));
        var max = vect.add (s, new vect (max_radius, -max_radius));
        var box = new Box (engine.camera.project (min), engine.camera.project (max));
        var elem = range_tree.search (box);
        for (var i = 0; i < elem.length; i ++) {
            var point = elem[i];
	    if (point.ref.map_contains (engine, p))
                return new LayerSelector ([point.ref]);
	}
        return new LayerSelector ([]);
    };
};
    function Polygon (prop, layer) {
    Feature.call (this, prop, layer);
    
    this.bounds = linestring_bounds (this.geom);

    this.map_contains = function (engine, p) {
        return this.contains (engine.camera.project (p));
    };

    this.contains = function (p) {
	var s = 0;
	var results = [];
        var feature = this;
	if (feature.bounds.contains (p)) {
	    s ++;
	    for (var j = 0; j < feature.geom.length; j ++) {
		var poly = feature.geom[j];
		var count = 0;
		$.each (poly, function (k, ring) {
		    for (var l = 0; l < ring.length; l ++) {
			var m = (l + 1) % ring.length;
			if ((p.y - ring[l][1]) / (p.y - ring[m][1]) < 0) {
			    var inf = new vect (720, p.y);
			    var v1 = new vect (ring[l][0], ring[l][1]);
			    var v2 = new vect (ring[m][0], ring[m][1]);
			    if (vect.intersects (p, inf, v1, v2))
				count ++
			}
		    }
		});
		if ((count % 2) == 1) {
                    return true;
		}
	    }
	}
        return false;
    };

};

function PolygonCollection (polygons) {
    var r_points = [];
    for (var n = 0; n < polygons.length; n ++) {
	$.each (polygons[n].geom, function (i, poly) {
	    $.each (poly, function (j, ring) {
		$.each (ring, function (k, pair) {
		    r_points.push ({
                        ref: polygons[n],
			x: pair[0],
			y: pair[1]
		    });			
		});
	    });
	});
    }
    tree = new RangeTree (r_points);

    this.search = function (box) {
	var elem = tree.search (box);
	var keys = {};
	$.each (elem, function (i, p) {
	    keys[p.ref.id] = p.ref;
	});
        for (var i = 0; i < polygons.length; i ++) {
            for (var j = 0; j < 4; j ++) {
                if (polygons[i].contains (box.vertex (j)))
                    keys[polygons[i].id] = polygons[i];
            }
        }
	var results = [];
	for (var k in keys) {
	    results.push (keys[k]);
	}
	return new LayerSelector (results);
    };

    this.map_contains = function (engine, p) {
        return this.contains (engine.camera.project (p));
    };

    this.contains = function (p) {
        var results = [];
        for (var i = 0; i < polygons.length; i ++) {
            if (polygons[i].contains (p))
                results.push (polygons[i]);
        }
        return new LayerSelector (results);
    };
};
    function linestring_bounds (geom) {
    var min = new vect (Infinity, Infinity);
    var max = new vect (-Infinity, -Infinity);
    $.each (geom, function (i, poly) {
	$.each (poly, function (k, ring) {
	    $.each (ring, function (j, pair) {
		if (pair[0] < min.x)
		    min.x = pair[0];
		if (pair[0] > max.x)
		    max.x = pair[0];
		if (pair[1] < min.y)
		    min.y = pair[1];
		if (pair[1] > max.y)
		    max.y = pair[1];
	    });
	});
    });
    return new Box (min, max);
};


function draw_graph_lines (stroke_buffers, geom) {
    var count = 6 * geom.length;
    var start = stroke_buffers.alloc (count);
    
    var unit = [
        new vect (1, 1),
        new vect (1, -1),
        new vect (-1, -1),
        new vect (-1, 1)
    ];

    var index = 0;
    var next_vert = function () {
	if (geom[index]) {
	    var v = new vect (geom[index][0], geom[index][1]);
	    index ++;
	    return v;
	}
	else
	    return null;
    };

    var prev = next_vert ();
    var current = next_vert ();
    var next = next_vert ();

    var get_norm_dir = function (u1, u2) {
        var dir = vect.dir (u1, u2);
        return dir.rotate (PI / 2);
    };

    var intersect_parallel_lines = function (p1, p2, p3) {
        //var norm1 = vect.sub (get_norm_dir (p1, p2), current);
        //var norm2 = vect.sub (get_norm_dir (p2, p3), current);
        var norm1 = get_norm_dir (p1, p2);
        var norm2 = get_norm_dir (p2, p3);

        var x1 = vect.add (p1, norm1);
        var x2 = vect.add (p2, norm1);
        var x3 = vect.add (p2, norm2);
        var x4 = vect.add (p3, norm2);
        
        var intersect = vect.intersect2dpos (x1, x2, x3, x4);
        if (intersect == Infinity)
            return vect.add (p2, norm1);
        else
            return intersect;
    };

    var p_norm1 = vect.dir (prev, current).rotate (-PI / 2);
    var p_norm2 = vect.dir (prev, current).rotate (PI / 2);

    var c_norm1, c_norm2;

    var write_quad = function (buffer, v1, v2, v3, v4) {
        buffer.push (v1.x);
        buffer.push (v1.y);

        buffer.push (v2.x);
        buffer.push (v2.y);

        buffer.push (v3.x);
        buffer.push (v3.y);

        buffer.push (v1.x);
        buffer.push (v1.y);

        buffer.push (v3.x);
        buffer.push (v3.y);

        buffer.push (v4.x);
        buffer.push (v4.y);
    };

    var vert_buffer = [];
    var norm_buffer = [];
    var unit_buffer = [];

    while (current) {
        if (next) {
            c_norm1 = vect.sub (intersect_parallel_lines (prev, current, next), current);
            c_norm2 = vect.sub (intersect_parallel_lines (next, current, prev), current);
        }
        else {
            c_norm1 = vect.dir (prev, current).rotate (PI / 2);
            c_norm2 = vect.dir (prev, current).rotate (-PI / 2);
            // TODO: if first == last, connect them together
        }
        
        write_quad (vert_buffer, prev, prev, current, current);
        write_quad (norm_buffer, p_norm1, p_norm2, c_norm1, c_norm2);
        write_quad (unit_buffer, unit[0], unit[1], unit[2], unit[3]);

        p_norm1 = c_norm2;
        p_norm2 = c_norm1;

	prev = current;
	current = next;
	next = next_vert ();
    };

    stroke_buffers.write ('vert', vert_buffer, start, count);
    stroke_buffers.write ('norm', norm_buffer, start, count);
    stroke_buffers.write ('unit', unit_buffer, start, count);

    return start;

};

function draw_map_lines (stroke_buffers, geom) {
    var count = 6 * geom.length;
    var start = stroke_buffers.alloc (count);

    var index = 0;
    var next_vert = function () {
	if (geom[index]) {
	    var v = new vect (geom[index][0], geom[index][1]);
	    index ++;
	    return v;
	}
	else
	    return null;
    };

    var unit = [
        new vect (1, 1),
        new vect (1, -1),
        new vect (-1, -1),
        new vect (-1, 1)
    ];
    
    var vert_buffer = [];
    var norm_buffer = [];
    var unit_buffer = []
    var unit_buffer = [-1, 0, 1, 0, -1, -1, 1, -1, -1, -1, 1, 0];
    //var unit_buffer = [, 0, 0, 0, 0, 0, 0];
    //var unit_buffer = [-1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1];
    var write_vert = function (buffer, v, index, invert) {
	if (!invert) {
	    buffer[index] = v.x;
	    buffer[index + 1] = v.y;
	}
	else {
	    buffer[index] = -v.x;
	    buffer[index + 1] = -v.y;
	}
    };
    var cp_vert = function (buffer, v1, v2, invert) {
	write_vert (buffer, v1, 0, false);
	write_vert (buffer, v2, 2, false);
	write_vert (buffer, v1, 4, invert);
	
	write_vert (buffer, v2, 6, invert);
	write_vert (buffer, v1, 8, invert);
	write_vert (buffer, v2, 10, false);
    };
    
    var prev = next_vert ();
    var current = next_vert ();
    var next = next_vert ();
    var p_norm = vect.dir (prev, current).rotate (PI / 2);
    var c_norm;
    var write_index = start;
    
    while (current) {
	if (next) {
            var p1 = vect.dir (next, current);
            var p2 = vect.dir (current, prev);
            c_norm = vect.sub (p1, p2).scale (.5).normalize ();
	}
	else {
	    c_norm = vect.dir (prev, current).rotate (PI / 2);
	}
        //c_norm = new vect (0.0, 1.0);
        //p_norm = new vect (0.0, 1.0);
	cp_vert (vert_buffer, prev, current, false);
	cp_vert (norm_buffer, p_norm, c_norm, true);
	//cp_vert (unit_buffer, new vect (0, 1), new vect (0, 1), true);
	stroke_buffers.write ('vert', vert_buffer, write_index, 6);
	stroke_buffers.write ('norm', norm_buffer, write_index, 6);
	stroke_buffers.write ('unit', unit_buffer, write_index, 6);
	write_index += 6;
	
	prev = current;
	current = next;
	next = next_vert ();
	p_norm = c_norm;
    }
    return start;
};

function Line (prop, layer) {
    Feature.call (this, prop, layer);

    this.bounds = linestring_bounds (this.geom);

    this.map_contains = function (engine, p) {
        return false;
    }
};

function LineCollection (lines) {
    this.search = function (box) {
        return new LayerSelector ([]);
    };

    this.map_contains = function (engine, p) {
        return new LayerSelector ([]);
    };

    this.contains = function (p) {
        return new LayerSelector ([]);
    };
};

    var grid_shader = null;

function Grid (options) {
    if (!grid_shader) {
	grid_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/grid');
    }
    if (!options)
	options = {};
    if (!options.style)
	options.style = {};
    var lower = options.lower;
    var upper = options.upper;
    var rows = options.rows;
    var cols = options.cols;

    var xres = (upper.x - lower.x) / cols;
    var yres = (upper.y - lower.y) / rows;

    var data = new Float32Array (rows * cols);

    var tex_data = new Uint8Array (cols * rows * 4);

    var dirty = false;
    var write_color = function (i, c) {
	//var c = options.ramp[j];
	tex_data[i * 4] = parseInt (c.r * 255);
	tex_data[i * 4 + 1] = parseInt (c.g * 255);
	tex_data[i * 4 + 2] = parseInt (c.b * 255);
	tex_data[i * 4 + 3] = parseInt (c.a * 255);
    };

    var buffers = new Buffers (engine.gl, 6);
    buffers.create ('vert', 2);
    buffers.create ('screen', 2);
    buffers.create ('tex', 2);

    var min = new vect (lower.x, lower.y);
    var max = new vect (upper.x, upper.y);

    var tmin = new vect (0, 0);
    var tmax = new vect (1, 1);

    var start = buffers.alloc (6);

    buffers.write ('vert', rectv (min, max), start, 6);
    buffers.write ('screen', rectv (new vect (-1, -1), new vect (1, 1)), start, 6);
    buffers.write ('tex', rectv (tmin, tmax), start, 6);

    var tex = gl.createTexture ();
    gl.bindTexture (gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);  
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);  
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture (gl.TEXTURE_2D, null);

    var index = function (i, j) {
	return cols * i + j;
    };

    this.lower = function () {
	return lower.clone ();
    };

    this.upper = function () {
	return upper.clone ();
    };

    this.rows = function () {
	return rows;
    };

    this.cols = function () {
	return cols;
    };

    this.centroid = function (i, j) {
	return new vect (lower.x + xres * j + xres / 2, lower.y + yres * i + yres / 2);
    };

    this.get = function (i, j) {
	return data[index (i, j)];
    };

    var max_val = -Infinity;
    var min_val = Infinity;
    var quantiles = {};

    /*this.bounds = function () {
	return {
	    min: min_val,
	    max: max_val
	};
    };*/

    this.qunatiles = function (size, sort) {
	if (!sort) {
	    sort = function (a, b) {
		return a - b;
	    };
	}
	var points = []
	for (var i = 0; i < data.length; i ++) {
	    points.push (data[i]);
	};
	points.sort (sort);
	var quantiles = [-Infinity];
	for (var i = 1; i < size; i ++) {
	    var b = parseInt (inc * i)
	    quantiles.push (points[b]);
	}
	quantiles.push (Infinity);
	return quantiles;
    };

    this.set = function (i, j, val) {
	if (i >= rows || j >= cols)
	    throw "Index Out of Bounds";
	var k = index (i, j);
	data[k] = val;
	dirty = true;
	/*if (val > max_val)
	    max_val = val;
	if (val < min_val)
	    min_val = val;
	dirty = true;*/
	//write_color (k, options.map (val));
    };

    this.raw_set = function (k, val) {
	if (k >= rows * cols)
	    throw "Index Out of Bounds: " + k;
	data[k] = val;
	dirty = true;
    };

    this.clear = function (val) {
	for (var i = 0; i < rows * cols; i ++) {
	    data[i] = val;
	}
    };

    this.initialize = function () {

    };

    var framebuffer = null;

    this.draw = function (engine, dt) {
	if (!framebuffer)
	    framebuffer = engine.framebuffer ();
	buffers.update ();
	if (dirty) {
	    max_val = -Infinity;
	    min_val = Infinity;
	    for (var i = 0; i < rows * cols; i ++) {
		var val = data[i];
		if (val > max_val)
		    max_val = val;
		if (val < min_val)
		    min_val = val;
	    }
	    for (var i = 0; i < rows * cols; i ++) {
		write_color (i, options.map (min_val, max_val, data[i]));
	    }
	    gl.bindTexture (gl.TEXTURE_2D, tex);
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cols, rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, tex_data);
	    gl.bindTexture (gl.TEXTURE_2D, null);
	    dirty = false;
	}
	
	if (options.style.antialias) {
	    framebuffer.activate ({
		blend: false
	    });
	}

	gl.useProgram (grid_shader);
	    
	grid_shader.data ('screen', engine.camera.mat3);
	grid_shader.data ('pos', buffers.get ('vert'));
	
	grid_shader.data ('tex_in', buffers.get ('tex'));
	    
	grid_shader.data ('sampler', tex);
	
	var size = vect.sub (engine.camera.screen (max), engine.camera.screen (min));
	grid_shader.data ('width', size.x);
	grid_shader.data ('height', -size.y);
	
	grid_shader.data ('rows', rows);
	grid_shader.data ('cols', cols);
	
	grid_shader.data ('blur', options.blur);
	
	gl.drawArrays (gl.TRIANGLES, 0, buffers.count ());

	if (options.style.antialias) {
	    framebuffer.deactivate ();
	    engine.draw_blur (framebuffer.tex);
	}

	//engine.post_draw (options.style);

	/*var do_draw = function (use_mat, image, hor) {
	    gl.useProgram (grid_shader);
	    
	    grid_shader.data ('screen', engine.camera.mat3);
	    if (use_mat) 
		grid_shader.data ('pos', buffers.get ('vert'));
	    else
		grid_shader.data ('pos', buffers.get ('screen'));
	    grid_shader.data ('use_mat', use_mat);
	    grid_shader.data ('tex_in', buffers.get ('tex'));
	    
	    grid_shader.data ('sampler', image);
	    
	    var size = vect.sub (engine.camera.screen (max), engine.camera.screen (min));
	    grid_shader.data ('width', size.x);
	    grid_shader.data ('height', -size.y);
	  
	    grid_shader.data ('rows', rows);
	    grid_shader.data ('cols', cols);
	    
	    grid_shader.data ('blur', options.blur);
	    grid_shader.data ('hor', hor);
	    
	    gl.drawArrays (gl.TRIANGLES, 0, buffers.count ());
	};

	if (options.blur) {
	    //gl.bindFramebuffer (gl.FRAMEBUFFER, engine.framebuffer);
	    //gl.clearColor (0, 0, 0, 0);
	    //gl.clear(gl.COLOR_BUFFER_BIT);
	    //gl.clearDepth (0.0);
	    //do_draw (true, tex, true);
	    //gl.bindFramebuffer (gl.FRAMEBUFFER, null);
	    //do_draw (false, engine.tex_canvas, false);
	    //do_draw (true, tex, true)
	}
	else {
	    //do_draw (tex);
	}*/
    };
};
    function AsciiGrid (data, options) {
    var vals = data.split ('\n');
    var meta = vals.splice (0, 6);
    var cols = parseInt (meta[0].slice (14));
    var rows = parseInt (meta[1].slice (14));
    var xllcorner = parseFloat (meta[2].slice (14));
    var yllcorner = parseFloat (meta[3].slice (14));
    var cellsize =  parseFloat (meta[4].slice (14));
    var nodata_value = meta[5].slice (14);
    var max_val = -Infinity;
    var min_val = Infinity;

    var index = function (i, j) {
	return cols * i + j;
    };

    var settings = {};
    for (key in options)
	settings[key] = options[key];
    settings.lower = new vect (xllcorner, yllcorner);
    settings.upper = new vect (xllcorner + cellsize * cols, yllcorner + cellsize * rows);
    settings.rows = rows;
    settings.cols = cols;
    
    var grid = new Grid (settings);

    for (var i = 0; i < rows; i ++) {
	var r = vals[i].split (' ');
	for (var j = 0; j < cols; j ++) {
	    if (r[j] == nodata_value) {
		grid.set (rows - 1 - i, j, NaN);
	    }
	    else {
		grid.set (rows - 1 - i, j, parseFloat (r[j]));
	    }
	}
    }
    return grid;
};    function SparseGrid (data, options) {
    var xmin = lfloat32 (data, 0);
    var ymin = lfloat32 (data, 4);

    var cols = lint32 (data, 8);
    var rows = lint32 (data, 12);
    var cellsize = lfloat32 (data, 16);

    var records_start = 20;

    var settings = {};
    for (key in options)
	settings[key] = options[key];
    settings.lower = new vect (xmin, ymin);
    settings.upper = new vect (xmin + cellsize * cols, ymin + cellsize * rows);
    settings.rows = rows;
    settings.cols = cols;

    var grid = new Grid (settings);

    var read_cells = function (start, index, count) {
	for (var i = 0; i < count; i ++) {
	    var val = lfloat32 (data, start + i * 4);
	    grid.raw_set (index + i, val);
	}
    };
    
    var offset = records_start;
    while (offset < data.length) {
	var index = lint32 (data, offset);
	var count = lint32 (data, offset + 4);
	read_cells (offset + 4, index, count);
	offset += 8 + count * 4;
    }
    
    return grid;
};    var LayerSelector = function (elem) {

    var lookup = null;

    this.length = elem.length;

    this.count = function () {
	return elem.length;
    }

    this.items = function () {
        return elem;
    };

    this.type = function (key) {
        var result = [];
        for (var i = 0; i < elem.length; i ++) {
            if (elem[i].type == key)
                result.push (elem[i]);
        }
        return new LayerSelector (result);
    };

    this.join = function (selector) {
        var result = [];
        for (var i = 0; i < elem.length; i ++) {
            result.push (elem[i]);        
        }
        for (var i = 0; i < selector.count (); i ++) {
            var item = selector.get (i);
            if (!this.id (item.id))
                result.push (item);
        }
        return new LayerSelector (result);
    };

    this.attr = function (field) {
        throw "Not Implemented";
	/*if (!elem.length)
	    return null;
	else
	    return elem[0].attr(field);*/
    };

    this.get = function (i) {
	return elem[i];
    };

    this.subset = function (keys) {
	var result = [];
	for (var i = 0; i < keys.length; i ++) {
	    result.push (elem[keys[i]]);
	}
	return new LayerSelector (result);
    };

    this.id = function (key) {
	if (!lookup) {
	    lookup = {};
	    for (var i = 0; i < elem.length; i ++) {
		lookup[elem[i].id] = elem[i];
	    }
	}
	if (key in lookup) {
	    return lookup[key];
	}
	else {
	    return null;
	}
    };

    this.each = function (func) {
	for (var i = 0; i < elem.length; i ++) {
	    func (i, elem[i]);
	}
	return this;
    };

    var operators = {
	'>': function (a, b) { return a > b},
	'<': function (a, b) { return a < b},
	'==': function (a, b) { return a == b},
	'>=': function (a, b) { return a >= b},
	'<=': function (a, b) { return a <= b}
    };
    this.select = function (string) {
	if (string.match (/^\s*\*\s*$/))
	    return new LayerSelector (elem);
	var matches = string.match (/^\s*([^\s]+)\s*([=<>]+)\s*(([^\s])+)\s*$/);
	if (!matches)
	    throw "Bad Selector";
	var field1 = matches[1];
	var op = matches[2];
	var val = null;
	var field2 = null;
	if (isNaN (matches[3])) {
	    field2 = matches[3];
	}
	else {
	    val = parseFloat (matches[3]);
	}
	new_elem = [];
	if (field2) {
	    for (var i = 0; i < elem.length; i ++) {
		if (operators[op] (elem[i].attr(field1), elem[i].attr(field2))) {
		    new_elem.push (elem[i]);
		}
	    }
	}
	else {
	    for (var i = 0; i < elem.length; i ++) {
		if (operators[op] (elem[i].attr(field1), val)) {
		    new_elem.push (elem[i]);
		}
	    }
	}
	return new LayerSelector (new_elem);
    };

    this.filter = function (test) {
	var results = [];
	for (var i = 0; i < elem.length; i ++) {
	    if (test (elem[i]))
		results.push (elem[i]);
	}
	return new LayerSelector (results);
    }

    this.quantile = function (field, q, total) {
	elem.sort (function (a, b) {
	    return a.attr(field) - b.attr(field);
	});
	var top = Math.round (q * this.length / total);
	var bottom = Math.round ((q - 1) * this.length / total);
	return new LayerSelector (elem.slice (bottom, top));
    };

    this.range = function (field) {
	var min = Infinity;
	var max = -Infinity;
        var okay = false;
	for (var i = 0; i < elem.length; i ++) {
            var val = elem[i].attr(field);
            if (!isNaN (val)) {
                okay = true;
	        if (min > val)
		    min = val;
	        if (max < val)
		    max = val;
            }
	}
        if (!okay)
            return null;
	return {
	    min: min,
	    max: max
	};
    };

    this.style = function (arg0, arg1, arg2) {
        var map_value = function (value, i, f) {
	    if ((typeof value) == 'function') {
                return value (f);
            }
            else if (is_list (value)) {
                return value[i];
            }
            else 
                return value;
        };

        var engine, key, value;
        if (arg0.type == 'Engine') {
            engine = arg0;
            key = arg1;
            value = arg2;
        }
        else {
            engine = null;
            key = arg0;
            value = arg1;
        }
            
        // Getter style on a layer selector is shorthand for getting the style on
        // only the first element
        if (value === undefined) {
            if (elem[0])
                return elem[0].style (engine, key)
        }
        else {
            // Otherwise, set the value, depending on the type of value
	    $.each (elem, function (i, f) {
                f.style (engine, key, map_value (value, i, f));
	    });
	    return this;
        }
    };
};
    var raster_shader = null;

function KML (data) {
    var bounds = $ (data).find ('LatLonBox');
    var min = new vect (parseFloat (bounds.find ('west').text ()), parseFloat (bounds.find ('south').text ()));
    var max = new vect (parseFloat (bounds.find ('east').text ()), parseFloat (bounds.find ('north').text ()));
    var url = $ (data).find ('GroundOverlay Icon href').text ();
    return new Raster (BASE_DIR + url, min, max);
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

var OMEGA = Math.PI / 4;

var hillshade_shader = null;
function Hillshade (data) {
    if (!hillshade_shader)
	hillshade_shader = makeProgram (BASE_DIR + 'shaders/hillshade');

    var bounds = $ (data).find ('LatLonBox');
    var min = new vect (parseFloat (bounds.find ('west').text ()), parseFloat (bounds.find ('south').text ()));
    var max = new vect (parseFloat (bounds.find ('east').text ()), parseFloat (bounds.find ('north').text ()));
    var url = $ (data).find ('GroundOverlay Icon href').text ();
    //var min = data.min;
    //var max = data.max;
    //var url = data.url;
    var ready = false;
    var image = getTexture (url, function () {
	ready = true;
    });

    this.ready = function () {
	return ready;
    };

    var tex_buffer = staticBuffer (rectv (new vect (0, 1), new vect (1, 0)), 2);
    var pos_buffer = staticBuffer (rectv (min, max), 2);

    var azimuth = 315.0;

    this.draw = function (engine, dt) {
	if (!ready)
	    return;
	gl.useProgram (altitude_shader);

	//azimuth += (OMEGA / (2 * Math.PI)) * dt;
	while (azimuth >= 1.0)
	    azimuth -= 1.0;
	altitude_shader.data ('azimuth', azimuth);
	altitude_shader.data ('altitude', (Math.PI / 4) / (2 * Math.PI));


	altitude_shader.data ('screen', engine.camera.mat3);
	altitude_shader.data ('pos', pos_buffer);
	altitude_shader.data ('tex_in', tex_buffer);

	altitude_shader.data ('elevation', image);
	//altitude_shader.data ('background', base_west.image);

	var size = vect.sub (engine.camera.screen (max), engine.camera.screen (min));
	
	//altitude_shader.data ('pix_w', 2.0 / engine.canvas.width ());
	//altitude_shader.data ('pix_h', 2.0 / engine.canvas.height ());
	altitude_shader.data ('pix_w', 1.0 / size.x);
	altitude_shader.data ('pix_h', 1.0 / size.y);

	gl.drawArrays (gl.TRIANGLES, 0, pos_buffer.numItems); 

	return azimuth;
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
};    var OMEGA = Math.PI / 4;

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
    var TIMEOUT = 1000;

var z_base = 0;

var NUM_TILES = 8;

var total_drawn = 0;
var total_calls = 0;

var tile_shader = null;
function MultiTileLayer (options) {
    var layers = [];
    var available = [];

    for (var i = 0; i < options.levels; i ++) {
	var settings = copy (options);
	if (settings.source == 'file')
	    settings.url += '/' + options.size * Math.pow (2, (i + 1));
	settings.min = new vect (-180, -90);
	settings.rows = Math.pow (2, i);
	settings.cols = settings.rows * 2;
	settings.cellsize = 180 / settings.rows;
	settings.z_index = 1.0 - z_base - i / 1000;
	settings.available = available;
	
	var layer = new TileLayer (settings);
	layers.push (layer);
    }
    var z_top = 1.0 - z_base - options.levels / 1000;
    z_base += (options.levels + 2) / 1000;

    var buffers = null;

    var initialized = false;
    this.initialize = function (engine) {
        if (!tile_shader)
	    tile_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/tile');

        buffers = new Buffers (engine.gl, NUM_TILES * 6);
        buffers.create ('vert', 3);
        buffers.create ('tex', 2);
        buffers.create ('lookup', 1);
        buffers.alloc (NUM_TILES * 6);

        for (var i = 0; i < 25; i ++) {
	    available.push (new Texture (engine.gl));
        }

        for (var i = 0; i < layers.length; i ++) {
            layers[i].initialize (engine);
        }

        layers[0].fetch_all ();
        layers[0].noexpire (true);
        
        initialized = true;
    };

    this.draw = function (engine, dt) {
        //if (!initialized)
        //    initialize (engine);

	gl.useProgram (tile_shader);
	tile_shader.data ('screen', engine.camera.mat3);

	total_drawn = 0;
	total_calls = 0;
	var min = Infinity
	var current = layers[0];

	var max_layer, min_layer;
	
	for (var i  = 0; i < layers.length; i ++) {
	    //var ratio = Math.abs (layers[i].size ().x / (levels[i].cols * levels[i].size));
	    var ratio = (options.size * layers[i].cols) / layers[i].size (engine).x;
	    if (ratio < 1)
		ratio = 1 / ratio;
	    //ratio -= 1;
	    if (ratio < min) {
		min = ratio;
		current = layers[i];
		max_layer = i;
	    }
	}
	for (var i = max_layer; i >= 0; i --) {
	    layers[i].fetch ();
	}
	    //current.fetch ();
	/*for (var i = max_layer; i >= 0; i --) {
	    min_layer = i;
	    if (layers[i].ready ())
		break;
	}*/
	//layers[min_layer].draw (engine, dt);

	if (current.ready ()) {
	    current.draw (engine, dt, buffers, 0, true);
	}
	else {	    
	    engine.enableZ ();
	    //current.draw (engine, dt, z_top);
	    var count = 0;
	    for (var i = max_layer; i >= 0; i --) {
		count = layers[i].draw (engine, dt, buffers, count, i == 0);
		//if (layers[i].ready ())
		//    break;
	    }
	    engine.disableZ ();
	}
	$.each (layers, function (i, layer) {
	    layer.cull ();
	});
	//console.log (total_drawn, total_calls);
    };
};

function TileLayer (options) {
    if (!options)
	options = {};
    if (!options.desaturate)
	options.desaturate = 0.0;
    if (!options.darken)
	options.darken = 0.0;
    if (!options.hue)
	options.hue = 0.0;
    if (!options.hue_color)
	options.hue_color = fcolor (0.0, 0.0, 0.0, 1.0);
    if (!options.available) {
	options.available = [];
	for (var i = 0; i < 8; i ++)
	    options.available.push (new Texture (gl));
    }

    var engine;

    var gl = null;
    var change_context = function (_engine) {
        engine = _engine;
        gl = engine.gl;
    };
    
    var url = options.url;
    var min = options.min;
    var rows = options.rows;
    var cols = options.cols;
    var cellsize = options.cellsize;

    this.rows = rows;
    this.cols = cols;

    var tile_ids = {};
    var tiles = {};

    var create_tile = function (i, j) {
	var rmin = new vect (min.x + i * cellsize, min.y + j * cellsize);
	var rmax = new vect (min.x + (i + 1) * cellsize, min.y + (j + 1) * cellsize);
	    //var start = buffers.alloc (6);
	var tile = {
	    vert: rectv (rmin, rmax, options.z_index),
	    tex: null,
	    i: i,
	    j: j,
	    id: (i + cols * j),
	    ready: false,
	    min: rmin,
	    max: rmax
	};
	tiles[i][j] = tile;
	tile_ids[tile.id] = tile;
    };

    for (var i = 0; i < cols; i ++) {
	tiles[i] = {};
    }

    this.size = function (engine) {
	var smin = engine.camera.screen (min);
	var smax = engine.camera.screen (vect.add (min, new vect (cellsize * cols, cellsize * rows)));
	var v = vect.sub (smax, smin);
	v.y = Math.abs (v.y);
	return v;
    }

    var noexpire = false;
    this.noexpire = function (flag) {
	noexpire = flag;
    };

    this.cull = function () {
	if (!noexpire) {
	    var time = new Date().getTime ();
	    for (var key in current) {
		if (time - current[key] > TIMEOUT) {
		    var tile = tile_ids[key];
		    delete tile_ids[key];

		    delete tiles[tile.i][tile.j];
		    
		    options.available.push (tile.tex);
		    tile.tex = null;
		    tile.ready = false;
		    
		    delete current[key];
		}
	    }
	}	
    };

    var get_bounds = function () {
	var smin = engine.camera.project (new vect (engine.canvas.offset ().left, engine.canvas.offset ().top + engine.canvas.height ()));
	var smax = engine.camera.project (new vect (engine.canvas.offset ().left + engine.canvas.width (), engine.canvas.offset ().top));
	var min_col = Math.floor ((smin.x - min.x) / cellsize);
	var max_col = Math.ceil ((smax.x - min.x) / cellsize);

	var min_row = Math.floor ((smin.y - min.y) / cellsize);
	var max_row = Math.ceil ((smax.y - min.y) / cellsize);

	return {
	    min_col: min_col,
	    max_col: max_col,
	    min_row: min_row,
	    max_row: max_row,
	}
    };

    var current = {};

    this.ready = function () {

	var bounds = get_bounds ();

	for (var i = Math.max (0, bounds.min_col); i < Math.min (cols, bounds.max_col); i ++) {
	    for (var j = Math.max (0, bounds.min_row); j < Math.min (rows,bounds. max_row); j ++) {
		if (!tiles[i][j])
		    return false;
		if (!tiles[i][j].ready)
		    return false;
	    }
	}
	return true;
    };

    var get_tex = function (i, j) {
	if (!tiles[i][j].tex) {
	    var path;
	    if (options.source == 'file') {
		var index = tiles[i][j].id;
		path = url + '/' + index + '.png';
	    }
	    else if (options.source == 'wms') {
		path = make_url (url, {
		    service: 'wms',
		    version: '1.1.0',
		    request: 'GetMap',
		    layers: options.layer,
		    bbox: [tiles[i][j].min.x, tiles[i][j].min.y, tiles[i][j].max.x, tiles[i][j].max.y].join (','),
		    width: options.size,
		    height: options.size,
		    srs: 'EPSG:4326',
		    format: 'image/png',
		    transparent: 'true'
		});
	    }
	    /*tiles[i][j].tex = getTexture (path, (function (tile) {
		return function () {
		    tile.ready = true;
		};
		});
		}) (tiles[i][j]))*/
	    tiles[i][j].tex = options.available.pop ();
	    if (!tiles[i][j].tex)
		tiles[i][j].tex = new Texture (gl);
	    getImage (path, (function (tile) {
		return function (img) {
		    if (tile.tex) {
			tile.tex.image (img);
			tile.ready = true;
		    }
		}
	    }) (tiles[i][j]));
		
	}
    };

    this.fetch_all = function () {
	var time = new Date().getTime ();
	for (var i = 0; i < cols; i ++) {
	    for (var j = 0; j < rows; j ++) {
		if (!tiles[i][j])
		    create_tile (i, j);
		if (!tiles[i][j].tex)
		    get_tex (i, j);
		current[tiles[i][j].id] = time;
	    }
	}
    };

    this.fetch = function () {
	var bounds = get_bounds ();

	var time = new Date().getTime ();
	for (var i = Math.max (0, bounds.min_col - 1); i < Math.min (cols, bounds.max_col + 1); i ++) {
	    for (var j = Math.max (0, bounds.min_row - 1); j < Math.min (rows,bounds. max_row + 1); j ++) {
		if (!tiles[i][j])
		    create_tile (i, j);
		if (!tiles[i][j].tex)
		    get_tex (i, j);
		current[tiles[i][j].id] = time;
	    }
	}
    };

    var initialized = false;
    this.initialize = function (engine) {
        if (initialized)
            throw "Not Implemented: Migrating Tile Layers to New Map";

        if (!tile_shader)
	    tile_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/tile');

        change_context (engine);
        initialized = true;
    };

    this.draw = function (engine, dt, buffers, count, flush) {
        if (!initialized)
            this.initialize (engine);

	var do_draw = function () {
	    total_calls ++;
	    buffers.update ();

	    tile_shader.data ('pos', buffers.get ('vert'));
	    tile_shader.data ('tex_in', buffers.get ('tex'));
	    tile_shader.data ('lookup_in', buffers.get ('lookup'));
	    tile_shader.data ('desaturate', options.desaturate);
	    tile_shader.data ('darken', options.darken);
	    tile_shader.data ('hue', options.hue);
	    tile_shader.data ('hue_color', options.hue_color.array);
	   
	    gl.drawArrays (gl.TRIANGLES, 0, count * 6);
	};

	var bounds = get_bounds ();
	
	var time = new Date().getTime ();
	for (var i = Math.max (0, bounds.min_col); i < Math.min (cols, bounds.max_col); i ++) {
	    for (var j = Math.max (0, bounds.min_row); j < Math.min (rows, bounds.max_row); j ++) {
		if (tiles[i][j] && tiles[i][j].ready && tiles[i][j].tex) {
		    
		    buffers.write ('vert', tiles[i][j].vert, count * 6, 6);
		    buffers.write ('tex', rectv (new vect (0, 0), new vect (1, 1)), count * 6, 6);
		    buffers.repeat ('lookup', [count / NUM_TILES + 1 / (NUM_TILES * 2)], count * 6, 6);
		    current[tiles[i][j].id] = time; 

		    tile_shader.data ('sampler' + count, tiles[i][j].tex);
		    if (tiles[i][j].tex == null)
			throw "badness";
		    count ++;
		    total_drawn ++;

		    if (count >= NUM_TILES) {
			do_draw ();
			count = 0;
		    }
		}
	    }
	}
	if (flush)
	    do_draw ();
	return count;
    };
};
    function WMS (options) {
    var settings = copy (options);
    require (settings, ['url', 'layer'])
    default_model (settings, {
	levels: 16,
	size: 256
    });
    force_model (settings, {
	source: 'wms'
    });

    var layer = new MultiTileLayer (settings);
    return layer;
};    var GeoJSON = function (data, options) {
    if (options === undefined)
        options = {};
    var layer = new Layer (options);
    for (var i = 0; i < data.features.length; i ++) {
	var feature = data.features[i];
	if (feature.type == 'Feature') {
	    if (feature.geometry.type == 'Point') {
		layer.append ({
                    type: 'Point',
		    geom: [feature.geometry.coordinates],
		    attr: feature.properties
		});
	    }
	    if (feature.geometry.type == 'MultiPoint') {
		layer.append ({
                    type: 'Point',
		    geom: feature.geometry.coordinates,
		    attr: feature.properties
		});
	    }
	    if (feature.geometry.type == 'Polygon') {
		var poly = feature.geometry.coordinates;
		var oriented = [];
		for (var k = 0; k <= poly.length - 1; k ++) {
		    var o_ring = [];
		    for (var j = poly[k].length - 1; j >= 0; j --) {
			o_ring.push (poly[k][j]);
		    }
		    oriented.push (o_ring);
		}
		layer.append ({
                    type: 'Polygon',
		    geom: [oriented],
		    attr: feature.properties
		});
                //return layer;
	    }
	    if (feature.geometry.type == 'MultiPolygon') {
		var rings = [];
		$.each (feature.geometry.coordinates, function (i, poly) {
		    var oriented = [];
		    for (var k = 0; k <= poly.length - 1; k ++) {
			var o_ring = [];
			for (var j = poly[k].length - 1; j >= 0; j --) {
			    o_ring.push (poly[k][j]);
			}
			oriented.push (o_ring);
		    }
		    rings.push (oriented);
		});
		layer.append ({
                    type: 'Polygon',
		    geom: rings,
		    attr: feature.properties
		});
	    }
	    if (feature.geometry.type == 'MultiLineString') {
		$.each (feature.geometry.coordinates, function (i, line) {
		    layer.append ({
                        type: 'Line',
			geom: [[line]],
			attr: feature.properties
		    });
		});
	    }
	}
    }
    return layer;
    /*if (num_points > 0) {
	var p_layer = new PointLayer (num_points);
	$.each (points, function (i, v) {
	    p_layer.append (v);
	});
	return p_layer;
    }
    else if (num_polys > 0) {
	var p_layer = new PolygonLayer (options);
	$.each (polys, function (i, v) {
	    var count = 0;
	    while (count < 100) {
		try {
		    p_layer.append (v);
		    count = 101;
		} catch (e) {
		    count ++;
		}
	    }
	    if (count == 100)
		console.log ('rendering polygon failed')
	});
	return p_layer;	
    }
    else if (num_lines > 0) {
	var line_layer = new LineLayer ();
	$.each (lines, function (i, v) {
	    line_layer.append (v);
	});
	return line_layer;
    }*/
};

/*function triangulate_polygon (elem) {
    //var poly = [];
    var poly = new clist ();
    for (var i = elem.length - 1; i >= 0; i --) {
	//poly.push (new vect (elem[i][0], elem[i][1]));
	poly.append (new vect (elem[i][0], elem[i][1]));
    }
    var tri = new Float32Array ((elem.length - 2) * 3 * 3);
    index = 0;
    function add_point (a) {
	if (index > (elem.length - 2) * 3 * 3)
	    throw "Index out of bounds!";
	tri[index] = a.x;
	tri[index + 1] = a.y;
	tri[index + 2] = 1.0;
	index += 3;
	//tri.push (a.x);
	//tri.push (a.y);
	//tri.push (1.0);
    };
    function add_triangle (a, b, c) {
	add_point (a);
	add_point (b);
	add_point (c);
    };
    var i = -1;
    var count = poly.length;
    while (poly.length > 3) {
	i ++;
	if (i >= poly.length) {
	    if (count == poly.length){
		console.log ('bad ear removal with', poly.length);
		break;
	    }
	    count = poly.length;
	    i -= poly.length;
	}
	var prev = poly.current.prev.data;
	var current = poly.current.data;
	var next = poly.current.next.data;

	//if (!vect.left2d (poly[i], poly[k], poly[j], 0.0)) {
	if (!vect.left2d (prev, next, current, 0.0)) {
	    var okay = true;
	    //for (var m = 0; m < poly.length; m ++) {
	    var other = poly.current.next.next;
	    while (other.next != poly.current.prev) {
		//var l = m + 1;
		//if (l >= poly.length)
		//    l -= poly.length;
		//if (l == i || l == k || m == i || m == k)
		//    continue;
		//if (vect.intersect2d (poly[i], poly[k], poly[m], poly[l], 0)) {
		if (vect.intersect2d (prev, next, other.data, other.next.data, 0)) {
		    okay = false;
		    break;
		}
		other = other.next;
	    }
	    if (okay) {
		add_triangle (prev, current, next);
		poly.remove ();
		//poly.splice (j, 1);
	    }
	}
	poly.next ();
    }
    add_triangle (poly.current.prev.data, poly.current.data, poly.current.next.data);
    //add_triangle (poly[0], poly[1], poly[2]);
    return tri;
};

var rand_map = (function () {
    //var factor = .000000001;
    var factor = 1e-6
    var xmap = {} 
    var ymap = {} 
    return function (x, y) {
	var key = x.toString () + ',' + y.toString ();
	if (!(key in xmap)) {
	    xmap[key] = x + Math.random () * factor - (factor / 2);
	    ymap[key] = y + Math.random () * factor - (factor / 2);
	}
	return new vect (xmap[key], ymap[key]);
    };
}) ();

triangulate_polygon = function (elem) {
    var poly = [];
    for (var k = 0; k < elem.length; k++) {
	var p = [];
	for (var i = elem[k].length - 1; i >= 1; i --) {
	    p.push (rand_map (elem[k][i][0], elem[k][i][1]));
	}
	p.push (poly[0]);
	poly.push (p);
    }
    return trapezoid_polygon (poly); 
    var tri = new Float32Array (elem.length * 3 * 2 * 3);
    index = 0;
    function add_point (a) {
	if (index > (elem.length * 3 * 2 * 3))
	    throw "Index out of bounds!";
	tri[index] = a.x;
	tri[index + 1] = a.y;
	tri[index + 2] = 1.0;
	index += 3;
	//tri.push (a.x);
	//tri.push (a.y);
	//tri.push (1.0);
    };
    function add_triangle (a, b, c) {
	add_point (a);
	add_point (b);
	add_point (c);
    };	

    function bisect (p0, p1, p2) {
        var v = vect.sub (p2, p0);
        v.normalize ();
	    v.rotateZ (Math.PI / 2);
	    v.scale (.05);
	    return vect.add (p1, v);
    };
    for (var i = 0; i < poly.length; i ++) {
	    var h = i - 1;
	    if (h < 0)
	        h += poly.length;
        var j = (i + 1);
	    if (j >= poly.length)
	        j -= poly.length;
	    var k = (i + 2);
	    if (k >= poly.length)
	        k -= poly.length;

	    var p3 = bisect (poly[h], poly[i], poly[j]);
	    var p4 = bisect (poly[i], poly[j], poly[k]);
	    add_triangle (poly[i], poly[j], p3);
	    add_triangle (p4, p3, poly[j]);
	}
	return tri;
};*/

/*var key_count = 0;
function Layer (data) {
    var start_time = new Date ().getTime ();
    this.id = layer_id;
    layer_id ++;
    if (!point_shader || !poly_shader) {
	poly_shader = makeProgram (BASE_DIR + '/shaders/poly');
	point_shader = makeProgram (BASE_DIR + '/shaders/point');

	circle_tex = getTexture (BASE_DIR + 'images/circle.png');

	$ (document).bind ('keydown', 'a', function () {
	    key_count ++;
	});
	$ (document).bind ('keydown', 's', function () {
	    key_count --;
	});
    }
    this.bbox = data.bbox;
    //this.epsg = parseInt (data.crs.properties.code);

    var unit = rect (0, 0, 1, 1);
    var points = [];
    var num_points = 0;
    var r_points = [];

    var polys = [];
    var num_polys = 0;
    var poly_count = 0;

    //var id_keys = {};
    var features = [];
    var properties = [];

    var tree = null;

    var prop_key = {}    
    for (var i = 0; i < data.features.length; i ++) {
	var feature = data.features[i];
	for (key in feature.properties) {
	    if (!(key in prop_key))
		prop_key[key] = true;
	}
	if (feature.type == 'Feature') {
	    if (feature.geometry.type == 'Point') {
		features.push (feature);
		feature.start = num_points * 6;
		feature.count = 6;

		num_points ++;		

		var x = feature.geometry.coordinates[0];
		var y = feature.geometry.coordinates[1];

		feature.x = x;
		feature.y = y;

		r_points.push (feature);
		
		//points.push.apply (points, rect (x, y, .1, .1));
		for (var j = 0; j < 6; j ++) {
		    points.push.apply (points, [x, y, 1]);
		}
	    }
	    if (feature.geometry.type == 'MultiPolygon') {
		features.push (feature);
		feature.start = poly_count;
		feature.properties['rand'] = Math.random ();
		var count = 0;
		for (var j = 0; j < feature.geometry.coordinates.length; j ++) {
		    //for (var k = 0; k < feature.geometry.coordinates[j].length; k ++) {  
			//count += (feature.geometry.coordinates[j][k].length * 6);
			//var p = triangulate_polygon (feature.geometry.coordinates[j][k])
		    try {
			    var p = triangulate_polygon (feature.geometry.coordinates[j]);
			    num_polys ++;
			    polys.push (p);
			    count += p.length / 3;
			}
			catch (e) {
			    console.log ('failed', i, j);
			}
		    }
		feature.count = count;
		poly_count += count;		
	    }
	    if (feature.geometry.type == 'Polygon') {
		features.push (feature);
		feature.start = poly_count;
		feature.properties['rand'] = Math.random ();
		var count = 0;
		try {
		    var p = triangulate_polygon (feature.geometry.coordinates);
		    num_polys ++;
		    polys.push (p);
		    count += p.length / 3;
		}
		catch (e) {
		    console.log ('failed');
		}
		feature.count = count;
		poly_count += count;		
	    }
	}
    }
    for (key in prop_key) {
	properties.push (key);
    }
    var point_buffer; 
    var unit_buffer; 
    var elem_buffer;
    var color_buffer;
    var id_buffer;
    var color_array;
    var back_array;
    var id_array;
    var poly_buffer;
    if (num_points > 0) {
	tree = new RangeTree (r_points);
	point_buffer = staticBuffer (points, 3);
	unit_buffer = repeats (unit, 3, num_points);
	//elem_buffer = indexBuffer (num_points * 6, 1);
	color_buffer = dynamicBuffer (num_points * 6, 4);
	id_buffer = dynamicBuffer (point_buffer.numItems, 4);
	color_array = new Float32Array (num_points * 6 * 4);
	back_array = new Float32Array (num_points * 6 * 4);
	id_array = new Float32Array (num_points * 6 * 4);
	//indices = new Uint16Array (num_points * 6);
	for (var i = 0; i < num_points * 6 * 4; i += 4) {
	    color_array[i] = .45;
	    color_array[i + 1] = .66;
	    color_array[i + 2] = .81;
	    color_array[i + 3] = 1.0;
	    //indices[i] = i;
	}
	color_buffer.update (color_array, 0);
	//elem_buffer.update (indices, 0);
    }
    if (num_polys > 0) {
	poly_buffer = staticBufferJoin (polys, 3);
	//console.log (polys);
	//poly_buffer = staticBuffer (polys, 3);
	color_buffer = dynamicBuffer (poly_buffer.numItems, 4);
	id_buffer = dynamicBuffer (poly_buffer.numItems, 4);
	color_array = new Float32Array (poly_buffer.numItems * 4);
	back_array = new Float32Array (poly_buffer.numItems * 4);
	id_array = new Float32Array (poly_buffer.numItems * 4);
	for (var i = 0; i < poly_buffer.numItems * 4; i += 4) {
	    color_array[i] = 0.0;
	    color_array[i + 1] = 0.0;
	    color_array[i + 2] = 1.0;
	    color_array[i + 3] = .5;
	}
	color_buffer.update (color_array, 0);
    }
    //for (var i = 0; i < features.length; i ++) {
	//var id = set_id_color (this, features[i], id_array);
	//id_keys[id] = features[i];
    //}
    engine.manager.register (this, features, id_array);
    id_buffer.update (id_array, 0);
    var end_time =  new Date ().getTime ();
    
    console.log ('Load Time', end_time - start_time);

    this.choropleth = function (name, colors) {
	features.sort (function (a, b) {
	    return a.properties[name] - b.properties[name];
	});
	for (var i = 0; i < features.length; i ++) {
	    var f = features[i];
	    var index = Math.floor (((i / features.length)) * colors.length);
	    colors[index].t ++;
	    for (var j = f.start; j < f.start + f.count; j ++) {
		color_array[j * 4] = colors[index].r;
		color_array[j * 4 + 1] = colors[index].g;
		color_array[j * 4 + 2] = colors[index].b;
		color_array[j * 4 + 3] = colors[index].a;
	    }
	}
	color_buffer.update (color_array, 0);
	console.log (colors);
    };

    LayerSelector = function (f) {
	var elements = f;
	this.length = f.length;
	this.get = function (i) {
	    return f[i];
	};
	this.remove = function (index) {
	    var elem = [];
	    for (var i = 0; i < elements.length; i ++) {
		if (index != i) 
		    elem.push (elements[i]);
	    }
	    return new LayerSelector (elem);
	};
	var operators = {
	    '>': function (a, b) { return a > b},
	    '<': function (a, b) { return a < b},
	    '==': function (a, b) { return a == b},
	    '>=': function (a, b) { return a >= b},
	    '<=': function (a, b) { return a <= b}
	};

	this.subset = function (elem) {
	    var subset = [];
	    for (var i = 0; i < elem.length; i ++) {
		subset.push (elements[elem[i]]);
	    }
	    return new LayerSelector (subset);
	};

	this.select = function (string) {
	    if (string.match (/^\s*\*\s*$/))
		return new LayerSelector (f);
	    var matches = string.match (/^\s*(\w+)\s*([=<>]+)\s*(\w+)\s*$/);
	    if (!matches)
		return;
	    var field1 = matches[1];
	    var op = matches[2];
	    var val = null;
	    var field2 = null;;
	    if (isNaN (matches[3])) {
		field2 = matches[3];
	    }
	    else {
		val = parseFloat (matches[3]);
	    }
	    elem = [];
	    if (field2) {
		for (var i = 0; i < f.length; i ++) {
		    if (operators[op] (f[i].properties[field1], f[i].properties[field2])) {
			elem.push (f[i]);
		    }
		}
	    }
	    else {
		for (var i = 0; i < f.length; i ++) {
		    if (operators[op] (f[i].properties[field1], val)) {
			elem.push (f[i]);
		    }
		}
	    }
	    return new LayerSelector (elem);
	};
	this.color = function (c) {
	    for (var i = 0; i < elements.length; i ++) {
		var f = elements[i];
		for (var j = f.start; j < f.start + f.count; j ++) {
		    color_array[j * 4] = c.r;
		    color_array[j * 4 + 1] = c.g;
		    color_array[j * 4 + 2] = c.b;
		    color_array[j * 4 + 3] = c.a;
		}
	    }
	    color_buffer.update (color_array, 0);
	    return this;
	};

	this.highlight = function (color) {
	    for (var i = 0; i < elements.length; i ++) {
		var f = elements[i];
		for (var j = f.start; j < f.start + f.count; j ++) {
		    back_array[j * 4] = color_array[j * 4];
		    back_array[j * 4 + 1] = color_array[j * 4 + 1];
		    back_array[j * 4 + 2] = color_array[j * 4 + 2];
		    back_array[j * 4 + 3] = color_array[j * 4 + 3];
		}
	    }
	    return this.color (color);
	};
	this.unhighlight = function () {
	    for (var i = 0; i < elements.length; i ++) {
		var f = elements[i];
		for (var j = f.start; j < f.start + f.count; j ++) {
		    color_array[j * 4] = back_array[j * 4];
		    color_array[j * 4 + 1] = back_array[j * 4 + 1];
		    color_array[j * 4 + 2] = back_array[j * 4 + 2];
		    color_array[j * 4 + 3] = back_array[j * 4 + 3];
		}
	    }
	    color_buffer.update (color_array, 0);
	    return this;
	};

	this.click = function (func) {
	    
	};
    };

    this.features = function () {
	return new LayerSelector (features);
    };

    this.properties = function () {
	return properties;
    }

    this.search = function (box) {
	var min = box.min;
	var max = box.max;
	var elem = tree.search (min, max);
	return new LayerSelector (elem);
    };

    this.mouseover = function (func) {
	engine.manager.bind ('mouseover', this, func);
    };

    this.mouseout = function (func) {
	engine.manager.bind ('mouseout', this, func);
    };

    this.click = function (func) {
	engine.manager.bind ('click', this, func);
    };

    this.style = function (id, key, value) {

    };
    
    
    var count = 0;
    this.draw = function (engine, dt, select) {
	if (num_points > 0) {
	    gl.useProgram (point_shader);

	    point_shader.data ('screen', engine.camera.mat3);
	    point_shader.data ('pos', point_buffer);
	    point_shader.data ('circle_in', unit_buffer);
	    if (select)
		point_shader.data ('color_in', id_buffer);
	    else
		point_shader.data ('color_in', color_buffer);
	    point_shader.data ('select', select);

	    point_shader.data ('aspect', engine.canvas.width () / engine.canvas.height ());
	    point_shader.data ('pix_w', 2.0 / engine.canvas.width ());
	    point_shader.data ('rad', 5);

	    point_shader.data ('glyph', circle_tex);
	    

	    point_shader.data ('zoom', 1.0 / engine.camera.level);

	    gl.drawArrays (gl.TRIANGLES, 0, point_buffer.numItems); 
	    //gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, elem_buffer);
	    //gl.drawElements (gl.TRIANGLES, elem_buffer.numItems, gl.UNSIGNED_SHORT, 0);
	    //gl.bindBuffer (gl.ARRAY_BUFFER, null);
	}
	if (num_polys > 0) {
	    gl.useProgram (poly_shader);
	    
	    poly_shader.data ('screen', engine.camera.mat3);
	    poly_shader.data ('pos', poly_buffer);
	    if (select)
		poly_shader.data ('color_in', id_buffer);
	    else
		poly_shader.data ('color_in', color_buffer);

	    //gl.drawArrays (gl.TRIANGLES, 0, key_count * 3); 
	    gl.drawArrays (gl.TRIANGLES, 0, poly_buffer.numItems); 
	}
    };
};*/
    var SHP_HEADER_LEN = 8;

var SHP_NULL = 0;
var SHP_POINT = 1;
var SHP_POLYGON = 5;

var read_header = function (data) {
    var code = bint32 (data, 0);
    var length = bint32 (data, 24);
    var version = lint32 (data, 28);
    var shapetype = lint32 (data, 32);
    
    var xmin = ldbl64 (data, 36);
    var ymin = ldbl64 (data, 44);
    var xmax = ldbl64 (data, 52);
    var ymax = ldbl64 (data, 60);
    return {
	code: code,
	length: length,
	version: version,
	shapetype: shapetype,
	bounds: new Box (new vect (xmin, ymin), new (xmax, ymax))
    }
};

var load_shx = function (data) {
    var indices = [];
    var append_index = function (offset) {
	indices.push (2 * bint32 (data, offset))
	return offset + 8;
    };
    var offset = 100;
    while (offset < data.length) {
	offset = append_index (offset);
    }
    return indices;
};

var Shapefile = function (options) {
    var path = options.path;
    $.ajax ({
	url: path + '.shx',
	mimeType: 'text/plain; charset=x-user-defined',
	success: function (data) {
	    var indices = load_shx (data);

	    $.ajax ({
		url: path + '.shp',
		mimeType: 'text/plain; charset=x-user-defined',
		success: function (data) {
		    var layer = load_shp (data, indices, options);
		    options.success (layer);
		}
	    });
	}
    });
};

var load_shp = function (data, indices, options) {
    var points = [];
    var polys = [];

    var read_ring = function (offset, start, end) {
	var ring = [];
	for (var i = end - 1; i >= start; i --) {
	    var x = ldbl64 (data, offset + 16 * i);
	    var y = ldbl64 (data, offset + 16 * i + 8);
	    ring.push ([x, y]);
	}
	return ring;
    };

    var read_record = function (offset) {
	var index = bint32 (data, offset);
	var record_length = bint32 (data, offset + 4);

	var record_offset = offset + 8;

	var geom_type = lint32 (data, record_offset);

	if (geom_type == SHP_NULL) {
	    console.log ("NULL Shape");
	    //return offset + 12;
	}
	else if (geom_type == SHP_POINT) {
	    var x = ldbl64 (data, record_offset + 4);
	    var y = ldbl64 (data, record_offset + 12);
	    
	    points.push ({
                type: 'Point',
		attr: {},
		geom: [[x, y]]
	    });
	}
	else if (geom_type == SHP_POLYGON) {
	    var num_parts = lint32 (data, record_offset + 36);
	    var num_points = lint32 (data, record_offset + 40);
	    
	    var parts_start = offset + 52;
	    var points_start = offset + 52 + 4 * num_parts;

	    var rings = []
	    for (var i = 0; i < num_parts; i ++) {
		var start = lint32 (data, parts_start + i * 4);
		var end;
		if (i + 1 < num_parts) {
		    end = lint32 (data, parts_start + (i + 1) * 4);
		}
		else {
		    end = num_points;
		}
		var ring = read_ring (points_start, start, end);
		rings.push (ring);
	    }
	    polys.push ({
                type: 'Polygon',
		attr: {},
		geom: [rings]
	    });
	}
	else {
	    throw "Not Implemented: " + geom_type;
	}
	//return offset + 2 * record_length + SHP_HEADER_LEN;
    };

    //var offset = 100;
    //while (offset < length * 2) {
    //    offset = read_record (offset);
    //}
    for (var i = 0; i < indices.length; i ++) {
	var offset = indices[i];
	read_record (offset);
    }

    if (points.length > 0) {
	var layer = new Layer (options);
	$.each (points, function (i, v) {
	    layer.append (v);
	});
	return layer;
    }
    else if (polys.length > 0) {
	var layer = new Layer (options);
	$.each (polys, function (i, v) {
	    layer.append (v);
	});
	return layer;	
    }
};

    var ready_queue = [];

    window.wiggle = {
	Map: Map,
        TimeSeries: TimeSeries,
	layer: {
            Layer: Layer,
	    Grid: Grid,
	    Hillshade: Hillshade,
	    Elevation: Elevation
	},
	io: {
	    Shapefile: Shapefile,
	    GeoJSON: GeoJSON,
	    KML: KML,
	    SparseGrid: SparseGrid,
	    AsciiGrid: AsciiGrid,
	    WMS: WMS
	},
	util: {
	    fcolor: fcolor,
	    icolor: icolor,
            Box: Box,
            RangeTree: RangeTree
	},
	widget: {
	    Slider: Slider
	},
	ready: function (func) {
	    ready_queue.push (func);
	}
    };

    $ (document).ready (function () {
	$ ('script[src*="wigglemaps"]').each (function (i, script) {
	    var regex = /wigglemaps(\.min)?\.js/;
	    if ($ (script).attr('src').match (regex))
		BASE_DIR = $ (script).attr('src').replace (regex, '');
	});
	$.each (ready_queue, function (i, func) {
	    func ();
	});
    });
} ());
