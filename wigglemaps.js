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
    };
    this.length = function () {
	return Math.sqrt (this.x * this.x + this.y * this.y + this.z * this.z);
    };
    this.normalize = function () {
	var scale = Math.sqrt (this.x * this.x + this.y * this.y + this.z * this.z);
	if (scale == 0)
	    return;
	this.x /= scale;
	this.y /= scale;
	this.z /= scale;
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

    var num_t = -(a.x * (c.y - b.y) +
                 b.x * (a.y - c.y) +
		  c.x * (b.y - a.y));
    var t = num_t / denom;
    
    var next = vect.sub (b, a);
    next.scale (s);
    return vect.add (a, next);
};

vect.rotate = function (v, omega) {
    var cos = Math.cos (omega);
    var sin = Math.sin (omega);
    xp = cos * v.x - sin * v.y;
    yp = sin * v.x + cos * v.y;
    var v = new vect (xp, yp, v.z);
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
}());    var PI = 3.14159265;

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
};    function bint32 (data, offset) {
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

gl = null;


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

function makeProgram (path) {
    if (!gl)
	return null;
    var shader = gl.createProgram();

    var vert_shader = getShader (gl.VERTEX_SHADER, path + '/vert.glsl');
    var frag_shader = getShader (gl.FRAGMENT_SHADER, path + '/frag.glsl');

    gl.attachShader(shader, vert_shader);
    gl.attachShader(shader, frag_shader);
    gl.linkProgram(shader);

    addVars (shader, vert_shader, frag_shader);
    //addVars (gl, shader, frag, vert_shader, frag_shader);

    return shader;
};

function getShader (type, path) {
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

function addVars (shader, vert, frag) {
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

function repeats (data, itemSize, count) {
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

function staticBuffer (data, itemSize) {
    var buffer = gl.createBuffer ();
    var float_data = new Float32Array (data);
    gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
    buffer.itemSize = itemSize;
    buffer.numItems = data.length / itemSize;
    
    gl.bufferData (gl.ARRAY_BUFFER, float_data, gl.STATIC_DRAW);
    gl.bindBuffer (gl.ARRAY_BUFFER, null);
    return buffer;
};

function staticBufferJoin (data, itemSize) {
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

function dynamicBuffer (items, itemSize) {
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

function indexBuffer (items, itemSize) {
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
function getTexture (path, callback) {
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
    function Camera (canvas, options) {
    if (!options)
	options = {};
    if (!('center' in options))
	options.center = new vect (0, 0);
    if (!('extents' in options))
	options.extents = 180.0;

    this.mat3 = new Float32Array (9);
    //this.mat3[0] = 2.0 / canvas.width ();
    //this.mat3[5] = 2.0 / canvas.height ();
    var ratio = canvas.width () / canvas.height (); 
    this.mat3[0] = 2.0 / options.extents;
    this.mat3[4] = ratio * 2.0 / options.extents;
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

    this.extents = function (width) {
	options.extents = width;

	var pos = this.position ();
	this.level = 1.0;

	this.mat3[0] = 2.0 / options.extents;
	this.mat3[4] = ratio * 2.0 / options.extents;

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
};    function Scroller (engine) {
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
};    function EventManager (engine) {
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
	/*for (var i = feature.start; i < feature.start + feature.count; i ++) {
	    array[i * 4] = r / 255;
	    array[i * 4 + 1] = g / 255;
	    array[i * 4 + 2] = b / 255;
	    array[i * 4 + 3] = 1.0;
	}
	var key = r + ',' + g + ',' + b;
	return key;*/
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
};    //var set_id_color, bind_event;

var TILE_SERVER = 'http://eland.ecohealthalliance.org/wigglemaps';

var Mouse = {
    x: 0,
    y: 0
};

var blur_shader = null;
var light_shader = null;

function Engine (selector, options) {
    if (!options) {
	options = {};
    }
    default_model (options, {
	base: 'default',
	background: new Color (0, 0, 0, 1),
	antialias: true
    });

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

    setContext (this.canvas, DEBUG);
    gl.viewport (0, 0, that.canvas.width (), that.canvas.height ());

    gl.blendFunc (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable (gl.BLEND);

    if (!blur_shader) {
	blur_shader = makeProgram (BASE_DIR + 'shaders/blur');
    }
    if (!light_shader) {
	light_shader = makeProgram (BASE_DIR + 'shaders/light');
    }
    var buffers = new Buffers (6);
    buffers.create ('vert', 2);
    buffers.create ('tex', 2);

    var start = buffers.alloc (6);

    buffers.write ('vert', rectv (new vect (-1, -1), new vect (1, 1)), start, 6);
    buffers.write ('tex', rectv (new vect (0, 0), new vect (1, 1)), start, 6);
    buffers.update ();
    //gl.clearColor(options.background.r, options.background.g, options.background.b, options.background.a);

    this.scene = [];

    //this.styler = new StyleManager ();
    this.camera = new Camera (this.canvas, options);
    this.scroller = new Scroller (this);

    this.pxW = 1 / this.canvas.attr ('width');
    this.pxH = 1 / this.canvas.attr ('height');

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
	    /*base = new MultiTileLayer ([
		{
		    url: BASE_DIR + 'tiles/nasa_topo_bathy/512',
		    min: new vect (-180, -90),
		    cols: 2,
		    rows: 1,
		    cellsize: 180,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/nasa_topo_bathy/1024',
		    min: new vect (-180, -90),
		    cols: 4,
		    rows: 2,
		    cellsize: 90,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/nasa_topo_bathy/2048',
		    min: new vect (-180, -90),
		    cols: 8,
		    rows: 4,
		    cellsize: 45,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/nasa_topo_bathy/4096',
		    min: new vect (-180, -90),
		    cols: 16,
		    rows: 8,
		    cellsize: 22.5,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/nasa_topo_bathy/8192',
		    min: new vect (-180, -90),
		    cols: 32,
		    rows: 16,
		    cellsize: 11.25,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/nasa_topo_bathy/16384',
		    min: new vect (-180, -90),
		    cols: 64,
		    rows: 32,
		    cellsize: 5.625,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/nasa_topo_bathy/32768',
		    min: new vect (-180, -90),
		    cols: 128,
		    rows: 64,
		    cellsize: 2.8125,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/nasa_topo_bathy/65536',
		    min: new vect (-180, -90),
		    cols: 256,
		    rows: 128,
		    cellsize: 1.40625,
		    size: 256
		}
	    ], options);*/
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
	    /*base = new MultiTileLayer ([
		{
		    url: BASE_DIR + 'tiles/NE1_HR_LC_SR_W_DR/512',
		    min: new vect (-180, -90),
		    cols: 2,
		    rows: 1,
		    cellsize: 180,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/NE1_HR_LC_SR_W_DR/1024',
		    min: new vect (-180, -90),
		    cols: 4,
		    rows: 2,
		    cellsize: 90,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/NE1_HR_LC_SR_W_DR/2048',
		    min: new vect (-180, -90),
		    cols: 8,
		    rows: 4,
		    cellsize: 45,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/NE1_HR_LC_SR_W_DR/4096',
		    min: new vect (-180, -90),
		    cols: 16,
		    rows: 8,
		    cellsize: 22.5,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/NE1_HR_LC_SR_W_DR/8192',
		    min: new vect (-180, -90),
		    cols: 32,
		    rows: 16,
		    cellsize: 11.25,
		    size: 256
		},
		{
		    url: BASE_DIR + 'tiles/NE1_HR_LC_SR_W_DR/16384',
		    min: new vect (-180, -90),
		    cols: 64,
		    rows: 32,
		    cellsize: 5.625,
		    size: 256
		}
	    ], options);*/
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


    /*var framebuffer = gl.createFramebuffer ();
    gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer);
    framebuffer.width = this.canvas.width ();
    framebuffer.height = this.canvas.height ();
    
    var tex_canvas = gl.createTexture ();
    gl.bindTexture (gl.TEXTURE_2D, tex_canvas);
    gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);  
    gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);  
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, framebuffer.width, framebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, framebuffer.width, framebuffer.height);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex_canvas, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    var framebuffer2 = gl.createFramebuffer ();
    gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer2);
    framebuffer2.width = this.canvas.width ();
    framebuffer2.height = this.canvas.height ();
    
    var tex_canvas2 = gl.createTexture ();
    gl.bindTexture (gl.TEXTURE_2D, tex_canvas2);
    gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);  
    gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);  
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, framebuffer2.width, framebuffer2.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    var renderbuffer2 = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer2);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, framebuffer2.width, framebuffer2.height);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex_canvas2, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer2);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    var current_framebuffer = true;

    this.activate_framebuffer = function (options) {
	if (!options)
	    opitons = {}
	if (!('blend' in options))
	    options.blend = true;
	
	if (!options.blend)
	    gl.disable (gl.BLEND);
	if (current_framebuffer)
	    gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer);
	else
	    gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer2);
	    gl.clearColor (0, 0, 0, 0);
	    gl.clear(gl.COLOR_BUFFER_BIT);
	    gl.clearDepth (0.0);
    };

    var canvas_tex;
    this.deactivate_framebuffer = function () {
	gl.bindFramebuffer (gl.FRAMEBUFFER, null);
	if (current_framebuffer)
	    canvas_tex = tex_canvas;
	else
	    canvas_tex = tex_canvas2;
	current_framebuffer = !current_framebuffer;
	gl.enable (gl.BLEND);
	return canvas_tex;
    };*/

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

    //this.shade = null;

    //var shade_buffer = this.framebuffer ();

    /*var draw_shade = function (dt, screen_tex) {
	if (that.shade) {
	    shade_buffer.activate ();

	    gl.clearColor (.5, .5, 1.0, 1.0);
	    gl.clear (gl.COLOR_BUFFER_BIT);
	    var azimuth = that.shade.draw (that, dt);
	    shade_buffer.deactivate ();

	    gl.useProgram (light_shader);

	    light_shader.data ('pos', buffers.get ('vert'));
	    light_shader.data ('tex_in', buffers.get ('tex'));
	    light_shader.data ('base', screen_tex);
	    light_shader.data ('normal', shade_buffer.tex);
	    light_shader.data ('azimuth', azimuth);

	    gl.drawArrays (gl.TRIANGLES, 0, buffers.count ());
	    
	}
    };*/

    /*this.post_draw = function (options) {
	buffers.update ();

	if (options.antialias) {

	    gl.useProgram (blur_shader);

	    this.activate_framebuffer ({
		blend: false
	    });

	    blur_shader.data ('pos', buffers.get ('vert'))
	    blur_shader.data ('tex_in', buffers.get ('tex'))
	    blur_shader.data ('sampler', canvas_tex)
	    blur_shader.data ('width', that.canvas.width  ());
	    blur_shader.data ('height', that.canvas.height ())
	    blur_shader.data ('hor', true);
	    
	    gl.drawArrays (gl.TRIANGLES, 0, buffers.count ());

	    this.deactivate_framebuffer ();
	    
	    blur_shader.data ('pos', buffers.get ('vert'))
	    blur_shader.data ('tex_in', buffers.get ('tex'))
	    blur_shader.data ('sampler', canvas_tex)
	    blur_shader.data ('width', that.canvas.width  ());
	    blur_shader.data ('height', that.canvas.height ())
	    blur_shader.data ('hor', false);

	    gl.drawArrays (gl.TRIANGLES, 0, buffers.count ());

	}
	
    };*/

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

	/*if (that.dirty) {

	    gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer);
	    gl.clearColor(0, 0, 0, 1);
	    gl.clear(gl.COLOR_BUFFER_BIT);
	    gl.clearDepth (0.0);
	    for (var i = 0; i < that.scene.length; i ++) {
		that.scene[i].draw (that, dt, true);
	    }
	    gl.bindFramebuffer (gl.FRAMEBUFFER, null);
	    //that.dirty = false;
	}*/
	    
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
	//if (options.antialias) {
	//    screen_buffer.activate ();
	//}
	for (var i = 0; i < that.scene.length; i ++) {
	    that.scene[i].draw (that, dt, false);
	}
	//if (options.antialias) {
	//    screen_buffer.deactivate ();
	//    draw_blur (screen_buffer.tex ());
	//}

	/*if (shade_ready) {
	    screen_buffer.deactivate ();
	    draw_shade (dt, screen_buffer.tex);
	}*/

	that.sel.draw (that, dt);
	//if (!dragging)
	//    that.manager.update (dt);
	
	requestAnimationFrame (draw);
    };

    /*var trigger_event;
    (function () {
	var r = 0;
	var g = 0;
	var b = 0;
	var features = {};
	var layers = {};
	var events = {};
	set_id_color = function (layer, feature, array) {
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
	    for (var i = feature.start; i < feature.start + feature.count; i ++) {
		array[i * 4] = r / 255;
		array[i * 4 + 1] = g / 255;
		array[i * 4 + 2] = b / 255;
		array[i * 4 + 3] = 1.0;
	    }
	    var key = r + ',' + g + ',' + b;
	    layers[key] = layer; 
	    features[key] = feature; 
	    return key;
	};

	var is_zero = function (pixel) {
	    return (pixel[0] == 0 && pixel[1] == 0 && pixel[2] == 0);
	}
	
	var current = new Uint8Array (4);
	trigger_event = function (pixel) {
	    var same = true;
	    for (var i = 0; i < 4; i ++) {
		if (current[i] != pixel[i])
		    same = false;
	    }
	    if (same) {
		return;
	    }
	    if (!is_zero (current)) {
		var key = current[0] + ',' + current[1] + ',' + current[2];
		var layer = layers[key];
		var feature = features[key];
		if (!('mouseout' in events))
		    return;
		if (!(layer.id in events['mouseout']))
		    return;
		for (var i = 0; i < events['mouseout'][layer.id].length; i ++) {
		    events['mouseout'][layer.id][i] (new LayerSelector ([feature]));
		}
	    }
	    for (var i = 0; i < 4; i ++) {
		current[i] = pixel[i];
	    }
	    if (is_zero (pixel))
		return null;
	    var key = pixel[0] + ',' + pixel[1] + ',' + pixel[2];
	    var layer = layers[key];
	    var feature = features[key];
	    if (!('mouseover' in events))
		return;
	    if (!(layer.id in events['mouseover']))
		return;
	    for (var i = 0; i < events['mouseover'][layer.id].length; i ++) {
		events['mouseover'][layer.id][i] (new LayerSelector ([feature]));
	    }
	};

	bind_event = function (type, layer, func)  {
	    if (!(type in events))
		events[type] = {};
	    if (!(layer in events[type]))
		events[type][layer.id] = [];
	    events[type][layer.id].push (func);
	};
    }) ();*/
    
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
	//console.log ('move', Mouse.x, Mouse.y);
    });

    this.canvas.click (function (event) {
	//that.manager.click (Mouse.x, Mouse.y);
	//that.read_pixel (event.pageX, event.pageY);
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

    //var popup = $ ('<div class="popup overlay"></div>');
    this.canvas.mousemove(function (event) {
	if (dragging) {
	    //popup.remove ();
	    //var pos = that.camera.project (new vect (event.clientX, event.clientY));
	}
	else {
	    var p = that.camera.project (new vect (Mouse.x, Mouse.y));
	    $.each (that.scene, function (i, layer) {
		if (layer.update_move)
		    layer.update_move (that, p);
	    });
	    //var pixel = readPixel (event.clientX, event.clientY);
	    //trigger_event (pixel);
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
    function Buffers (initial_size) {
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
	    var new_buffer = dynamicBuffer (size, data[name].len);
	    
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
	var buffer = dynamicBuffer (size, len);
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

    this.update = function (dt) {
	for (name in data) {
	    if (data[name].dirty) {
		if (data[name].buffer)
		    data[name].buffer.update (data[name].array, 0);
		data[name].dirty = false;
	    }
	}
    };
};    var sel_box_shader = null;
function SelectionBox (engine) {
    if (!sel_box_shader)
	sel_box_shader = makeProgram (BASE_DIR + 'shaders/selbox');
    var enabled = false;
    var dragging = false;
    var start = null;
    var end = null;
    var sel_buffer = dynamicBuffer (6, 2);
    var bound_buffer = staticBuffer (rect (0, 0, 1, 1), 2);
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
	if (dragging) {
	    gl.useProgram (sel_box_shader);
	    
	    sel_box_shader.data ('pos', sel_buffer);
	    sel_box_shader.data ('edge_in', bound_buffer);
	    
	    gl.drawArrays (gl.TRIANGLES, 0, sel_buffer.numItems); 
	}
    };
};    function circle (index, length) {
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
    
};    function Box (v1, v2) {
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
    this.root = new RangeNode (elem, 0, elem.length - 1, parseInt ((elem.length - 1) / 2));

    this.search = function (min, max) {
	var box = new Box (min, max);
	var result = [];
	this.root.search (result, box);
	return result;
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

function Polygon (geom, prop) {
    if (!prop)
	prop = {};
    if (!prop.attr)
	prop.attr = {};
    if (!prop.style)
	prop.style = {};

    this.geom = geom;
    this.attr = prop.attr;
    this.id = null;

    var layer = null;
    var start_outline, count_outline;
    var start_main, count_main;
    var buffers = null;
   
};    var point_shader = null;
var circle_tex;

var unit = rect (0, 0, 1, 1);

var default_point_color = new Color (.02, .44, .69, 1);
var default_point_alpha = 1.0;

function PointLayer (initial_points) {
    if (!point_shader) {
	point_shader = makeProgram (BASE_DIR + 'shaders/point');
	circle_tex = getTexture (BASE_DIR + 'images/circle.png');
    }
    this.id = new_feature_id ();

    var buffers = new Buffers (initial_points);
    buffers.create ('vert', 2);
    buffers.create ('unit', 2);
    buffers.create ('color', 3);
    buffers.create ('alpha', 1);

    var layer = this;

    var Point = function (prop) {
	if (!prop)
	    prop = {};
	if (!prop.geom)
	    prop.geom = [];
	if (!prop.attr)
	    prop.attr = {};
	if (!prop.style)
	    prop.style = {};

	this.geom = prop.geom;
	this.attr = prop.attr;

	this.id = new_feature_id ();

	var p = new vect (prop.geom[0][0], prop.geom[0][1]);

	this.bounds = new Box (p.clone (), p.clone ());
	var start, count;
	
	var total_points = 0;

	/*this.geom = function (new_geom) {
	  if (this.layer) {
	  
	  }
	  geom = new_geom;
	  };*/

	var _style = {};
	copy_value (_style, prop.style, 'fill', hex_to_color);
	copy_value (_style, prop.style, 'opacity', parseFloat);

	var set_color = function () {
	    //layer.color_front (_style['fill'], start, count);
	    var color = _style['fill'];
	    if (!color)
		color = layer.style ('fill');
	    if (!color)
		color = default_point_color;
	    buffers.repeat ('color', color.array, start, count);
	};

	var set_alpha = function () {
	    //layer.alpha_front (_style['opacity'], start, count);
	    var opacity = _style['opacity'];
	    if (!opacity)
		opacity = layer.style ('opacity');
	    if (!opacity)
		opacity = default_point_alpha;
	    
	    buffers.repeat ('alpha', [opacity], start, count);
	};

	this.style = function (key, val) {
	    if (arguments.length == 1)
		return _style[key];
	    _style[key] = val;
	    if (key == 'fill') {
		set_color ();
	    }
	    if (key == 'opacity') {
		set_alpha ();
	    }
	};
	total_points = this.geom.length;
	count = 6 * total_points;
	start = buffers.alloc (count);

	$.each (this.geom, function (index, point) {
	    buffers.repeat ('vert', point, start + index * 6, 6);
	    buffers.write ('unit', unit, start + index * 6, 6);
	});
	//count = 6;
	//start = buffers.alloc (count);
	
	//buffers.repeat ('vert', this.geom, start, count);
	//buffers.write ('unit', unit, start, count);
	
	set_color ();
	set_alpha ();
    };

    var tree = null;

    var num_points = 0;
    var dirty = false;

    var _properties = {};
    var features = {};

    this.bounds = null
    
    this.append = function (data) {
	var p = new Point (data);
	for (key in p.attr) 
	    _properties[key] = true;
	features[p.id] = p;

	num_points ++;
	dirty = true;	
	tree = null;

	if (this.bounds)
	    this.bounds.union (p.bounds);
	else
	    this.bounds = p.bounds.clone ();

	return p;
    };

    this.features = function () {
	var elem = [];
	for (key in features) {
	    elem.push (features[key]);
	}
	return new LayerSelector (elem);
    };

    this.attr = function () {
	var prop = [];
	for (key in _properties)
	    prop.push (key);
	return prop;
    }

    this.search = function (box) {
	var min = box.min;
	var max = box.max;
	var elem = tree.search (min, max);
	var results = [];
	$.each (elem, function (i, v) {
	    results.push (features[v.key]);
	});
	return new LayerSelector (results);
    };

    this.mouseover = function (func) {
	//engine.manager.bind ('mouseover', this, func);
    };

    this.mouseout = function (func) {
	//engine.manager.bind ('mouseout', this, func);
    };

    this.click = function (func) {
	//engine.manager.bind ('click', this, func);
    };

    this.style = function (key, value) {
	if (arguments.length > 1)
	    throw "Not Implemented";
	return null;
    };
  
    this.update_move = function (engine, p) {

    };
    
    var count = 0;
    this.draw = function (engine, dt, select) {
	buffers.update (dt);
	if (num_points > 0) {
	    if (dirty) {
		if (!tree) {
		    var r_points = [];
		    for (var key in features) {
			$.each (features[key].geom, function (i, point) {
			    r_points.push ({
				key: key,
				x: point[0],
				y: point[1]
			    });
			});
		    }
		    tree = new RangeTree (r_points);
		}
		dirty = false;
	    }
	    gl.useProgram (point_shader);

	    point_shader.data ('screen', engine.camera.mat3);
	    //point_shader.data ('pos', point_buffer);
	    point_shader.data ('pos', buffers.get ('vert'));
	    point_shader.data ('circle_in', buffers.get ('unit'));
	    if (select) 
		return;
		//point_shader.data ('color_in', id_buffer);
	    else {
		point_shader.data ('color_in', buffers.get ('color'));  
		point_shader.data ('alpha_in', buffers.get ('alpha')); 
		//point_shader.data ('color_in', color_buffer); 
	    }

	    point_shader.data ('select', select);

	    point_shader.data ('aspect', engine.canvas.width () / engine.canvas.height ());
	    point_shader.data ('pix_w', 2.0 / engine.canvas.width ());
	    point_shader.data ('rad', 5);

	    point_shader.data ('glyph', circle_tex);

	    point_shader.data ('zoom', 1.0 / engine.camera.level);

	    gl.drawArrays (gl.TRIANGLES, 0, buffers.count ()); 
	}
    };
};
    var poly_shader = null;


//var default_poly_color = new Color (0, 0, 1, 1);

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

function PolygonLayer (prop) {
    if (!prop)
	prop = {};
    if (!prop.style)
	prop.style = {};
    var default_poly_fill, default_poly_stroke, default_poly_fill_alpha, default_poly_stroke_alpha;
    if ('fill' in prop.style)
	default_poly_fill = prop.style['fill'];
    else
	default_poly_fill = new Color (.02, .44, .69, 1);

    if ('stroke' in prop.style)
	default_poly_stroke = prop.style['stroke'];
    else
	default_poly_stroke = new Color (.02, .44, .69, 1);

    if ('fill-opacity' in prop.style)   
	default_poly_fill_alpha = prop.style['fill-opacity'];
    else
	default_poly_fill_alpha = .5;

    if ('stroke-opacity' in prop.style)   
	default_poly_stroke_alpha = prop.style['stroke-opacity'];
    else
	default_poly_stroke_alpha = 1.0;
    
    if (!poly_shader) {
	poly_shader = makeProgram (BASE_DIR + 'shaders/poly');
    }
    if (!line_shader) {
	line_shader = makeProgram (BASE_DIR + 'shaders/line');
    }
    this.id = new_feature_id ();

    var fill_buffers = new Buffers (1024);
    fill_buffers.create ('vert', 2);
    fill_buffers.create ('color', 3);
    fill_buffers.create ('alpha', 1);

    var stroke_buffers = new Buffers (1024);
    stroke_buffers.create ('vert', 2);
    stroke_buffers.create ('norm', 2);
    stroke_buffers.create ('color', 3);
    //stroke_buffers.create ('unit', 2);
    stroke_buffers.create ('alpha', 1);

    var layer = this;

    function Polygon (prop) {
	if (!prop)
	    prop = {};
	if (!prop.geom)
	    prop.geom = [];
	if (!prop.attr)
	    prop.attr = {};
	if (!prop.style)
	    prop.style = {};
	
	this.geom = prop.geom;
	this.attr = prop.attr;
	this.id = new_feature_id ();
	
	var fill_start, fill_count;
	var stroke_start, stroke_count = 0;

	var set_color = function () {
	    var color;
	    if (('fill' in _style))
		color = _style['fill'];
	    else
		color = layer.style ('fill');
	    fill_buffers.repeat ('color', color.array, fill_start, fill_count);

	    if (('stroke' in _style))
		color = _style['stroke'];
	    else
		color = layer.style ('stroke');
	    stroke_buffers.repeat ('color', color.array, stroke_start, stroke_count);
	};

	var set_alpha = function () {
	    //layer.alpha_front (_style['opacity'], start, count);
	    var opacity;
	    if (('fill-opacity' in _style))
		opacity = _style['fill-opacity'];
	    else
		opacity = layer.style ('fill-opacity');
	    
	    fill_buffers.repeat ('alpha', [opacity], fill_start, fill_count);

	    if ('stroke-opacity' in _style)
		opacity = _style['stroke-opacity'];
	    else
		opacity = layer.style ('stroke-opacity');
	    stroke_buffers.repeat ('alpha', [opacity], stroke_start, stroke_count);
	};
	
	var simple = [];
	var fill_count = 0;
	$.each (this.geom, function (i, poly) {
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
	var min = new vect (Infinity, Infinity);
	var max = new vect (-Infinity, -Infinity);
	$.each (this.geom, function (i, poly) {
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
	this.bounds = new Box (min, max);
	fill_start = fill_buffers.alloc (fill_count);
	var current = fill_start;
	$.each (simple, function (i, p) {	
	    var count = p.length / 2;;
	    fill_buffers.write ('vert', p, current, count);
	    current += count;
	});

	stroke_start = stroke_buffers.count ();
	$.each (this.geom, function (i, poly) {
	    for (var i = 0; i < poly.length; i ++) {
		stroke_count += poly[i].length * 6;    
		draw_lines (stroke_buffers, poly[i]);
	    }
	});

	/*stroke_count = this.geom[0].length * 6;
	stroke_start = draw_lines (stroke_buffers, this.geom[0]);
	for (var i = 1; i < this.geom.length; i ++) {
	    stroke_count += this.geom[i].length * 6;    
	    draw_lines (stroke_buffers, this.geom[i]);
	}*/

	var _style = {};
	copy_value (_style, prop.style, 'fill', hex_to_color);
	copy_value (_style, prop.style, 'stroke', hex_to_color);
	copy_value (_style, prop.style, 'fill-opacity', parseFloat);
	copy_value (_style, prop.style, 'stroke-opacity', parseFloat);

	this.style = function (key, val) {
	    if (arguments.length == 1)
		return _style[key];
	    _style[key] = val;
	    if (key == 'fill') {
		set_color ();
	    }
	    if (key == 'stroke') {
		set_color ();
	    }	    
	    if (key == 'fill-opacity') {
		set_alpha ();
	    }
	    if (key == 'stroke-opacity') {
		set_alpha ();
	    }
	};

	set_color ();
	set_alpha ();
    };	

    var features = {};
    var num_polys = 0;
    var tree = null;
    
    this.features = function () {
	var elem = [];
	for (key in features) {
	    elem.push (features[key]);
	}
	return new LayerSelector (elem);
    };

    this.search = function (box) {
	var min = box.min;
	var max = box.max;
	var elem = tree.search (min, max);
	var keys = {};
	$.each (elem, function (i, p) {
	    keys[p.key] = true;
	});
	var results = [];
	for (var k in keys) {
	    results.push (features[k]);
	}
	return new LayerSelector (results);
    };

    this.contains = function (p) {
	var s = 0;
	var results = [];
	for (var i in features) {
	    var feature = features[i];
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
			results.push (feature);
		    }
		}
	    }
	}
	return new LayerSelector (results);
    };

    this.aggregate = function (points, callback) {
	points.features ().each (function (i, f) {
	    $.each (f.geom, function (j, point) {
		var poly = layer.contains (new vect (point[0], point[1]));
		if (poly) {
		    callback (poly, f);
		}

	    });
	});
    };

    this.bounds = null;

    var dirty = false;

    this.append = function (data) {
	var p = new Polygon (data);
	if (this.bounds)
	    this.bounds.union (p.bounds);
	else
	    this.bounds = p.bounds.clone ();
	features[p.id] = p;
	num_polys ++;
	dirty = true;
	tree = null;
    };
    
    this.style = function (key, value) {
	if (arguments.length > 1)
	    throw "Not Implemented";
	if (key == 'fill')
	    return default_poly_fill;
	if (key == 'stroke')
	    return default_poly_stroke;
	if (key == 'fill-opacity')
	    return default_poly_fill_alpha;
	if (key == 'stroke-opacity')
	    return default_poly_stroke_alpha;
	return null;
    };

    var over_func = null, out_func = null;
    this.mouseover = function (func) {
	over_func = func;
    }

    this.mouseout = function (func) {
	out_func = func;
    }

    var current_over = {};
    this.update_move = function (engine, p) {
	if (over_func || out_func) {
	    var c = this.contains (p);
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
	    /*if (c != null && c.get (0) != current_over.get (0)) {
		if (out_func && current_over)
		    out_func (current_over);
		if (over_func && c)
		    over_func (c);
		current_over = c;
	    }*/
	}
    };
    this.force_out = function (engine) {
	for (var key in current_over) {
	    if (out_func)
		out_func (current_over[key]);
	}
	current_over = {};
	/*if (out_func && current_over) 
	    out_func (current_over);
	current_over = null;*/
    };

    this.draw = function (engine, dt, select) {
	if (select)
	    return;
	fill_buffers.update (dt);	
	stroke_buffers.update (dt);	
	if (dirty) {
	    var r_points = [];
	    for (var key in features) {
		$.each (features[key].geom, function (i, poly) {
		    $.each (poly, function (j, ring) {
			$.each (ring, function (k, pair) {
			    r_points.push ({
				key: key,
				x: pair[0],
				y: pair[1]
			    });			
			});
		    });
		});
	    }
	    tree = new RangeTree (r_points);
	    dirty = false;
	}

	gl.useProgram (poly_shader);

	poly_shader.data ('screen', engine.camera.mat3);
	poly_shader.data ('pos', fill_buffers.get ('vert'));
	poly_shader.data ('color_in', fill_buffers.get ('color'));  
	poly_shader.data ('alpha_in', fill_buffers.get ('alpha'));  
	
	gl.drawArrays (gl.TRIANGLES, 0, fill_buffers.count ());


	gl.useProgram (line_shader);
	
	line_shader.data ('screen', engine.camera.mat3);
	line_shader.data ('pos', stroke_buffers.get ('vert'));
	line_shader.data ('norm', stroke_buffers.get ('norm'));
	line_shader.data ('color_in', stroke_buffers.get ('color'));
	line_shader.data ('alpha_in', stroke_buffers.get ('alpha'));
	//line_shader.data ('circle_in', stroke_buffers.get ('unit'));
	
	line_shader.data ('px_w', 2.0 / engine.canvas.width ());
	line_shader.data ('px_h', 2.0 / engine.canvas.height ());
	
	gl.drawArrays (gl.TRIANGLES, 0, stroke_buffers.count ()); 
    };
};
    var line_shader;

function draw_lines (stroke_buffers, geom) {
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
    
    var vert_buffer = [];
    var norm_buffer = [];
    //var unit_buffer = [1, 1, -1, 1, 1, -1, 0, 0, 0, 0, 0, 0];
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
    var p_norm = vect.dir (current, prev).rotate (PI / 2);
    var c_norm;
    var write_index = start;
    
    while (current) {
	if (next) {
	    c_norm = vect.dir (next, prev).rotate (PI / 2);
	}
	else {
	    c_norm = vect.dir (current, prev).rotate (PI /2);
	}
	cp_vert (vert_buffer, prev, current, false);
	cp_vert (norm_buffer, p_norm, c_norm, true);
	//cp_vert (unit_buffer, new vect (0, 1), new vect (0, 1), true);
	stroke_buffers.write ('vert', vert_buffer, write_index, 6);
	stroke_buffers.write ('norm', norm_buffer, write_index, 6);
	//stroke_buffers.write ('unit', unit_buffer, write_index, 6);
	write_index += 6;
	
	prev = current;
	current = next;
	next = next_vert ();
	p_norm = c_norm;
    }
    return start;
};

function LineLayer () {
    var default_stroke = new Color (.02, .44, .69, 1);
    var default_stroke_alpha = 1.0;
    
    if (!line_shader) {
	line_shader = makeProgram (BASE_DIR + 'shaders/line');
    }
    this.id = new_feature_id ();
    var stroke_buffers = new Buffers (1024);
    stroke_buffers.create ('vert', 2);
    stroke_buffers.create ('norm', 2);
    stroke_buffers.create ('unit', 2);
    stroke_buffers.create ('color', 3);
    stroke_buffers.create ('alpha', 1);

    var layer = this;

    function Line (prop) {
	if (!prop)
	    prop = {};
	if (!prop.geom)
	    prop.geom = [];
	if (!prop.attr)
	    prop.attr = {};
	if (!prop.style)
	    prop.style = {};
	
	this.geom = prop.geom;
	this.attr = prop.attr;
	this.id = new_feature_id ();

	/*var set_color = function () {
	    var color = _style['stroke'];
	    if (!color)
		color = layer.style ('stroke');
	    if (!color)
		color = default_poly_stroke;
	    stroke_buffers.repeat ('color', color.array, stroke_start, stroke_count);
	};*/

	var stroke_start, stroke_count = 0;

	var set_color = function () {
	    var color;

	    if (('stroke' in _style))
		color = _style['stroke'];
	    else
		color = layer.style ('stroke');
	    stroke_buffers.repeat ('color', color.array, stroke_start, stroke_count);
	};

	var set_alpha = function () {
	    //layer.alpha_front (_style['opacity'], start, count);
	    var opacity;

	    if ('stroke-opacity' in _style)
		opacity = _style['stroke-opacity'];
	    else
		opacity = layer.style ('stroke-opacity');
	    stroke_buffers.repeat ('alpha', [opacity], stroke_start, stroke_count);
	};

	stroke_start = stroke_buffers.count ();
	draw_lines (stroke_buffers, this.geom);
	stroke_count = this.geom.length * 6;

	var _style = {};
	copy_value (_style, prop.style, 'fill', hex_to_color);
	copy_value (_style, prop.style, 'stroke', hex_to_color);
	copy_value (_style, prop.style, 'fill-opacity', parseFloat);
	copy_value (_style, prop.style, 'stroke-opacity', parseFloat);

	this.style = function (key, val) {
	    if (arguments.length == 1)
		return _style[key];
	    _style[key] = val;
	    if (key == 'fill') {
		set_color ();
	    }
	    if (key == 'stroke') {
		set_color ();
	    }	    
	    if (key == 'fill-opacity') {
		set_alpha ();
	    }
	    if (key == 'stroke-opacity') {
		set_alpha ();
	    }
	};

	set_color ();
	set_alpha ();
    };

    var num_lines = 0;
    var dirty = false;

    var _properties = {};
    var features = {};    

    this.append = function (data) {
	var l = new Line (data);
	for (key in l.attr) 
	    _properties[key] = true;
	features[l.id] = l;

	num_lines ++;
	dirty = true;	

	return l;
    }

    this.style = function (key, value) {
	if (arguments.length > 1)
	    throw "Not Implemented";
	if (key == 'stroke')
	    return default_stroke;
	if (key == 'stroke-opacity')
	    return default_stroke_alpha;
	return null;
    };

    this.draw = function (engine, dt) {
	stroke_buffers.update (dt);
	if (num_lines > 0) {
	    gl.useProgram (line_shader);

	    line_shader.data ('screen', engine.camera.mat3);
	    line_shader.data ('pos', stroke_buffers.get ('vert'));
	    line_shader.data ('norm', stroke_buffers.get ('norm'));
	    line_shader.data ('color_in', stroke_buffers.get ('color'));
	    line_shader.data ('alpha_in', stroke_buffers.get ('alpha'));

	    line_shader.data ('px_w', 2.0 / engine.canvas.width ());
	    line_shader.data ('px_h', 2.0 / engine.canvas.height ());

	    gl.drawArrays (gl.TRIANGLES, 0, stroke_buffers.count ()); 
	}
    }
};    var grid_shader = null;

function Grid (options) {
    if (!grid_shader) {
	grid_shader = makeProgram (BASE_DIR + 'shaders/grid');
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

    var buffers = new Buffers (6);
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
};    function AsciiGrid (data, options) {
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

    this.attr = function (field) {
	if (!elem.length)
	    return null;
	else
	    return elem[0].attr[field];
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
		if (operators[op] (elem[i].attr[field1], elem[i].attr[field2])) {
		    new_elem.push (elem[i]);
		}
	    }
	}
	else {
	    for (var i = 0; i < elem.length; i ++) {
		if (operators[op] (elem[i].attr[field1], val)) {
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
	    return a.attr[field] - b.attr[field];
	});
	var top = Math.round (q * this.length / total);
	var bottom = Math.round ((q - 1) * this.length / total);
	return new LayerSelector (elem.slice (bottom, top));
    };

    this.range = function (field) {
	var min = Infinity;
	var max = -Infinity;
	for (var i = 0; i < elem.length; i ++) {
	    if (min > elem[i].attr[field])
		min = elem[i].attr[field];
	    if (max < elem[i].attr[field])
		max = elem[i].attr[field];
	}
	return {
	    min: min,
	    max: max
	};
    };

    this.style = function (key, value) {
	if (arguments.length == 1) {
	    var result = [];
	    $.each (elem, function (i, v) {
		result.push (v.style (key));
	    });
	    return result;
	}
	if ((typeof value) == 'function') {
	    $.each (elem, function (i, v) {
		v.style (key, value (v));
	    });
	}
	else if (is_list (value)) {
	    $.each (elem, function (i, v) {
		v.style (key, value[i]);
	    });	    
	}
	else {
	    $.each (elem, function (i, v) {
		v.style (key, value);
	    });
	}
	return this;
    };
};    var raster_shader = null;

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
};    var TIMEOUT = 1000;

var z_base = 0;

var NUM_TILES = 8;

var total_drawn = 0;
var total_calls = 0;

function MultiTileLayer (options) {
    var layers = [];
    var available = [];
    for (var i = 0; i < 25; i ++) {
	available.push (new Texture ());
    }
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
    layers[0].fetch_all ();
    layers[0].noexpire (true);

    var buffers = new Buffers (NUM_TILES * 6);
    buffers.create ('vert', 3);
    buffers.create ('tex', 2);
    buffers.create ('lookup', 1);
    buffers.alloc (NUM_TILES * 6);

    this.draw = function (engine, dt) {
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

	gl.useProgram (tile_shader);
	tile_shader.data ('screen', engine.camera.mat3);

	if (current.ready ()) {
	    current.draw (engine, dt, buffers, 0, true);
	}
	else {	    
	    engine.enable_z ();
	    //current.draw (engine, dt, z_top);
	    var count = 0;
	    for (var i = max_layer; i >= 0; i --) {
		count = layers[i].draw (engine, dt, buffers, count, i == 0);
		//if (layers[i].ready ())
		//    break;
	    }
	    engine.disable_z ();
	}
	$.each (layers, function (i, layer) {
	    layer.cull ();
	});
	//console.log (total_drawn, total_calls);
    };
};

var tile_shader = null;
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
	    options.available.push (new Texture ());
    }
    
    if (!tile_shader)
	tile_shader = makeProgram (BASE_DIR + 'shaders/tile');

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
		tiles[i][j].tex = new Texture ();
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

    this.draw = function (engine, dt, buffers, count, flush) {

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
			throw "bad";
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
};    var GeoJSON2JSON
var GeoJSON = function (data, options) {
    var num_points = 0, num_polys = 0, num_lines = 0;
    var points = [], polys = [], lines = [];
    for (var i = 0; i < data.features.length; i ++) {
	var feature = data.features[i];
	if (feature.type == 'Feature') {
	    if (feature.geometry.type == 'Point') {
		num_points ++;
		points.push ({
                    type: 'Point',
		    geom: [feature.geometry.coordinates],
		    attr: feature.properties
		});
	    }
	    if (feature.geometry.type == 'MultiPoint') {
		num_points += feature.geometry.cooordinates.length;
		points.push ({
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
		num_polys ++;
		polys.push ({
                    type: 'Polygon',
		    geom: [oriented],
		    attr: feature.properties
		});
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
		num_polys ++;
		polys.push ({
                    type: 'Polygon',
		    geom: rings,
		    attr: feature.properties
		});
	    }
	    if (feature.geometry.type == 'MultiLineString') {
		$.each (feature.geometry.coordinates, function (i, line) {
		    num_lines ++;
		    lines.push ({
                        type: 'Line',
			geom: line,
			attr: feature.properties
		    });
		});
	    }
	}
    }
    if (num_points > 0) {
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
    }
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
	var p_layer = new PointLayer (points.length);
	$.each (points, function (i, v) {
	    p_layer.append (v);
	});
	return p_layer;
    }
    else if (polys.length > 0) {
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
};
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
    
};    var Map = function (selector, options) {
    engine = new Engine (selector, options);

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
	/*var form = $ ('<form method="POST" action="http://skapes.org/app_in/geodata/export.png"></form>')
	var data_input = $ ('<input name="data" type="text" />');
	data_input.val (data);
	form.append (data_input);
	form.submit ();*/
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

    engine.canvas.click (function (event) {
	if (click_func) {
	    var v = new vect (event.pageX, event.pageY);
	    var p = engine.camera.project (v);
	    click_func (p);
	}
    });
};

    var ready_queue = [];

    window.wiggle = {
	Map: Map,
	layer: {
	    PointLayer: PointLayer,
	    LineLayer: LineLayer,
	    PolygonLayer: PolygonLayer,
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
	    icolor: icolor
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