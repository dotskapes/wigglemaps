// A basic vector type. Supports standard 2D vector operations
var Vector2D = function (x, y) {
    this.x = x;
    this.y = y;

    this.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    this.sub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    this.scale = function (s) {
        this.x *= s;
        this.y *= s;
        return this;
    };
    this.length = function () {
        return Math.sqrt (this.x * this.x + this.y * this.y);
    };
    this.normalize = function () {
        var scale = this.length ();
        if (scale === 0)
            return this;
        this.x /= scale;
        this.y /= scale;
        return this;
    };
    this.div = function (v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    };
    this.floor = function () {
        this.x = Math.floor (this.x);
        this.y = Math.floor (this.y);
        return this;
    };
    this.zero = function () {
        return ((this.x + this.y) === 0);
    };
    this.dot = function (v) {
        return (this.x * v.x) + (this.y * v.y);
    };
    this.cross = function (v) {
        return (this.x * v.y) - (this.y * v.x);
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
        return new Vector2D (this.x, this.y); 
    };

    this.array = function () {
        return [this.x, this.y];
    };
};

// A shortcut for the vector constructor
function vect (x, y) {
    return new Vector2D (x, y);
}

// Shorthand operations for vectors for operations that make new vectors

vect.scale = function (v, s) {
    return v.clone ().scale (s);
};

vect.add = function (v1, v2) {
    return v1.clone ().add (v2);
};

vect.sub = function (v1, v2) {
    return v1.clone ().sub (v2);
};

vect.dist = function (v1, v2) {
    return v1.clone ().sub (v2).length ();
};

vect.dir = function (v1, v2) {
    return v1.clone ().sub (v2).normalize ();
};

vect.dot = function (v1, v2) {
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

    if (denom === 0)
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

    if (denom === 0)
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
    var c = new vect (xp, yp);
    return c;
};

vect.normalize = function (v) {
    return v.clone ().normalize ();
};
(function () {
    'use strict';
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

})( jQuery );/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
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

// Covert parameters into a url
var make_url = function (base, vars) {
    var items = [];
    for (var key in vars) {
        items.push (key + '=' + vars[key]);
    }
    return base + '?' + items.join ('&');
};

// If options is missing a key in the model, copy over a default value
var default_model = function (options, model) {
    for (var key in model) {
        if (!(key in options))
            options[key] = model[key];
    }
};

// Copy everything in a model to options
var force_model = function (options, model) {
    for (var key in model) {
        options[key] = model[key];
    }
};

// Shallow copy all the key, value pairs in an object
var copy = function (src) {
    var dst = {};
    for (var key in src)
        dst[key] = src[key];
    return dst;
};

// Check that an object contains a set of keys
var require = function (src, fields) {
    for (var i = 0; i < fields.length; i ++) {
        var key = fields[i];
        if (!(key in src))
            throw "Key " + key + " not found";
    }
};

// Copy all key value, pairs from src to dst
var copy_to = function (dst, src) {
    for (var key in src)
        dst[key] = src[key];
};

// Copy a key, value pair from src to dst if it exists.
// Otherwise, copy a default value. Optionally, cast the value in src
// to a different type
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

// Copy a key, value pair from src to dst if it exists.
// Optionally, cast the value in src to a different type
var copy_value = function (dst, src, key, cast) {
    if (key in src) {
        if (cast)
            dst[key] = cast (src[key]);
        else
            dst[key] = src[key];
    }
};

// Check if an object is an array
var is_list = function (elem) {
    if (elem === null)
        return false;
    if (elem.length === undefined)
        return false;
    for (var i = 0; i < elem.length; i ++) {
        if (!(i in elem))
            return false;
    }
    return true;
};

// Check if a string is surrounded by quotes
var isQuoted = function (value) {
    var c = value[0];
    if (c == '"' || c == "'") {
        if (value[value.length - 1] == c)
            return true;
    }
    return false;
};

// Check if a string is an rgb SVG string
var isRGB = function (value) {
    if (value.match (/^rgb\(\d+,\d+,\d+\)$/))
        return true;
    else
        return false;
};

// Check if a string is a float
var isFloat = function (value) {
    if (value.match (/^(\+|\-)?\d*\.\d*$/) && value.length > 1)
        return true;
    else if (value.match (/^(\+|\-)?\d*\.\d*e(\+|\-)?\d+$/) && value.length > 1)
        return true;
    else
        return false;
};

// Check if a string is an int
var isInt = function (value) {
    if (value.length == 1)
        return value.match (/^\d$/);
    else {
        return value.match (/^(\+|\-)?\d+$/);
    }
};

// Check if a string contains a substring
var str_contains = function (string, c) {
    return string.indexOf (c) != -1;
};

// Clamp values between two extrema
var clamp = function (val, min, max) {
    return Math.min (Math.max (val, min), max);
};
// Color objects are used throughout the API as a fundemental type
var Color = function (r, g, b, a) {
    // Allow for colors to be specified as both floats and ints
    // The true representation is floats however
    if (r <= 1 && g <= 1 && b <= 1 && a <= 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    else {
        // Eventually, colors should only be specified as floats
        console.warn ('Specifying colors as ints is deprecated');
        this.r = r / 255;
        this.g = g / 255;
        this.b = b / 255;
        this.a = a / 255;
    }
    
    // A flat representation of the vector
    this.array = [this.r, this.g, this.b, this.a];

    // Covert the color to a WebGL format that can be sent to shaders
    this.vect = function () {
        return this.array;
    };
    
    // Convert the color to an SVG readable format
    this.rgb = function () {
        return 'rgb(' + parseInt (this.r * 255, 10) + ',' + parseInt (this.g * 255, 10) + ',' + parseInt (this.b * 255, 10) + ')';
    };
};

// Helper function to for specifying colors as integers
var icolor = function (r, g, b, a) {
    return new Color (clamp (r / 255, 0, 1), clamp (g / 255, 0, 1), clamp (b / 255, 0, 1), clamp (a / 255, 0, 1));
};

// Corresponding helper function for specifying colors as floats
var fcolor = function (r, g, b, a) {
    return new Color (clamp (r, 0, 1), clamp (g, 0, 1), clamp (b, 0, 1), clamp (a, 0, 1));
};

// Covert a flat floating point representation of color to an rgb string
var as_rgb = function (array) {
    conosole.warn('Deprecated: use parseRGB instead');
    return 'rgb(' + Math.round (array[0] * 255, 10) + ',' + Math.round (array[1] * 255, 10) + ',' + Math.round (array[2] * 255, 10) + ')';
};

// Convert a hex string to a color object
var hex_to_color = function (hex) {
    var r = parseInt (hex.slice (1, 3), 16);
    var g = parseInt (hex.slice (3, 5), 16);
    var b = parseInt (hex.slice (5, 7), 16);
    return icolor (r, g, b, 255);
};

// Convert an rgb string to a color object
var parseRGB = function (value) {
    var color_match = value.match (/^rgb\((\d+),(\d+),(\d+)\)$/);
    if (!color_match)
        return null;
    else
        return icolor (color_match[1], color_match[2], color_match[3], 255);
};
var Mouse = {
    x: 0,
    y: 0
};

$ (document).mousemove (function (event) {
    Mouse.x = event.clientX;
    Mouse.y = event.clientY;
    Mouse.lastMove = new Date ().getTime ();
});
var int8 = function (data, offset) {
    return data.charCodeAt (offset);
};

var bint32 = function (data, offset) {
    return (
        ((data.charCodeAt (offset) & 0xff) << 24) +
            ((data.charCodeAt (offset + 1) & 0xff) << 16) +
            ((data.charCodeAt (offset + 2) & 0xff) << 8) +
            (data.charCodeAt (offset + 3) & 0xff)
    );
};

var lint32 = function (data, offset) {
    return (
        ((data.charCodeAt (offset + 3) & 0xff) << 24) +
            ((data.charCodeAt (offset + 2) & 0xff) << 16) +
            ((data.charCodeAt (offset + 1) & 0xff) << 8) +
            (data.charCodeAt (offset) & 0xff)
    );
};

var bint16 = function (data, offset) {
    return (
        ((data.charCodeAt (offset) & 0xff) << 8) +
            (data.charCodeAt (offset + 1) & 0xff)
    );
};

var lint16 = function (data, offset) {
    return (
        ((data.charCodeAt (offset + 1) & 0xff) << 8) +
            (data.charCodeAt (offset) & 0xff)
    );
};

var ldbl64 = function (data, offset) {
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
};

var lfloat32 = function (data, offset) {
    var b0 = data.charCodeAt (offset) & 0xff;
    var b1 = data.charCodeAt (offset + 1) & 0xff;
    var b2 = data.charCodeAt (offset + 2) & 0xff;
    var b3 = data.charCodeAt (offset + 3) & 0xff;

    var sign = 1 - 2 * (b3 >> 7);
    var exp = (((b3 & 0x7f) << 1) + ((b2 & 0xfe) >> 7)) - 127;

    var frac = (b2 & 0x7f) * Math.pow (2, 16) + b1 * Math.pow (2, 8) + b0;

    return sign * (1 + frac * Math.pow (2, -23)) * Math.pow (2, exp);
};

var str = function (data, offset, length) {
    var chars = [];
    var index = offset;
    /*while (true) {
        var c = data[index];
        if (c.charCodeAt (0) != 0)
            chars.push (c);
        else
            return chars.join ('');
        index ++;
    }*/
    while (index < offset + length) {
        var c = data[index];
        if (c.charCodeAt (0) !== 0)
            chars.push (c);
        else {
            break;
        }
        index ++;
    }
    return chars.join ('');
};
/* Copyright 2011, Zack Krejci
 * Licensed under the MIT License
 */

var DEBUG = false;

//gl = null;


var setContext = function (canvas) {
    var gl;
    if (!DEBUG) 
        gl = canvas.get (0).getContext ('experimental-webgl', {
            alpha: false,
            antialias: true,
            premultipliedAlpha: false
        });
    else {
        var throwOnGLError = function (err, funcName, args) {
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

var rect = function (x, y, w, h) {
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

var rectv = function (p1, p2, z) {
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

var makeProgram = function (gl, path) {
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

var getShader = function (gl, type, path) {
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

var addVars = function (gl, shader, vert, frag) {
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
        };
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

var repeats = function (gl, data, itemSize, count) {
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

var staticBuffer = function (gl, data, itemSize) {
    var buffer = gl.createBuffer ();
    var float_data = new Float32Array (data);
    gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
    buffer.itemSize = itemSize;
    buffer.numItems = data.length / itemSize;
    
    gl.bufferData (gl.ARRAY_BUFFER, float_data, gl.STATIC_DRAW);
    gl.bindBuffer (gl.ARRAY_BUFFER, null);
    return buffer;
};

var staticBufferJoin = function (gl, data, itemSize) {
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

var dynamicBuffer = function (gl, items, itemSize) {
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
    };
    
    gl.bufferData (gl.ARRAY_BUFFER, float_data, gl.DYNAMIC_DRAW);
    gl.bindBuffer (gl.ARRAY_BUFFER, null);
    return buffer;
};

var indexBuffer = function (gl, items, itemSize) {
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
    };
    
    gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, float_data, gl.DYNAMIC_DRAW);
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, null);
    return buffer;
};

var tex_count = 0;
var getTexture = function (gl, path, callback) {
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
var Buffers = function (engine, initial_size) {
    var gl = engine.gl;
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
        for (var name in data) {
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
        for (var name in data) {
            if (data[name].dirty) {
                if (data[name].buffer)
                    data[name].buffer.update (data[name].array, 0);
                data[name].dirty = false;
                engine.dirty = true;
            }
        }
    };
};
var Texture = function (engine, options) {
    var gl = engine.gl;
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
        engine.dirty = true;
    };

    this.texture = function () {
        if (!img)
            return null;
        else
            return tex;
    };
};

var getImage = function (path, callback) {
    var img = new Image ();
    img.crossOrigin = '';
    img.onload = function () {
        callback (img);
    };
    img.src = path;
};
var Box = function (v1, v2) {
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
    };

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
        case 1:
            return new vect (this.max.x, this.min.y);
        case 2:
            return this.max.clone ();
        case 3:
            return new vect (this.min.x, this.max.y);
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
        return false;
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
var triangulate_polygon = function (elem) {
    var poly = [];
    var tri = [];
    for (var k = 0; k < elem.length; k++) {
        var p = [];
        //for (var i = elem[k].length - 1; i >= 1; i --) {
        if (elem[k].length <= 3) {
            tri.push (elem[k]);
        }
        else {
            for (var i = 1; i < elem[k].length; i ++) {
                p.push (rand_map (elem[k][i][0], elem[k][i][1]));
            }
        }
        p.push (poly[0]);
        poly.push (p);
    }
    var triangles = trapezoid_polygon (poly);
    for (var i = 0; i < tri.length; i ++) {
        triangles.push (tri[i][0][0]);
        triangles.push (tri[i][0][1]);

        triangles.push (tri[i][1][0]);
        triangles.push (tri[i][1][1]);

        triangles.push (tri[i][2][0]);
        triangles.push (tri[i][2][1]);
    }
    return triangles;
};

var circle = function (index, length) {
    while (index >= length)
        index -= length;
    while (index < 0)
        index += length;
    return index;
};

var Vertex = function (current, upper, lower, index) {
    this.current = current;
    this.upper = upper;
    this.lower = lower;
    this.index = index;
};

var xsearch = function (sweep, poly, index) {
    var upper = sweep.length - 1;
    var lower = 0;
    var current = parseInt ((sweep.length - 1) / 2, 10);
    if (sweep.length === 0) {
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
        current = parseInt ((upper + lower) / 2, 10);
    }
};

var set_contains = function (sweep, index) {
    for (var i = 0; i < sweep.length; i ++) {
        if (sweep[i] == index)
            return true;
    }
    return false;
};

var solvex = function (poly, index, slice) {
    if (index === undefined)
        throw "whoa";
    if ((poly[index + 1].y - poly[index].y) === 0)
        return Math.min (poly[index].x, poly[index + 1].x);
    var t = (slice - poly[index].y) / (poly[index + 1].y - poly[index].y);
    //console.log ('t', slice, poly[index + 1].y,  poly[index].y, t);
    return poly[index].x + (poly[index + 1].x - poly[index].x) * t;
};

var find_index = function (sweep, index) {
    for (var i = 0; i < sweep.length; i ++) {
        if (sweep[i] == index)
            return i;
    }
    return false;
};

var sorted_index = function (sweep, poly, xpos, slice) {
    for (var i = 0; i < sweep.length; i ++) {
        var sxpos = solvex (poly, sweep[i], slice);
        //console.log (sweep[i], index, xpos, sxpos);
        if (sxpos > xpos)
            return i;
        if (sxpos - xpos === 0) {
            //console.log ('same', sweep[i], index, poly[sweep[i]].y, poly[index].y);
            if (poly[sweep[i]].y > poly[index].y)
                return i;
        }
    }
    //console.log ('biggest');
    return sweep.length;
};
    
var intersect = function (v, poly, index) {
    return new vect (solvex (poly, index, poly[v].y), poly[v].y);
};

var add_point = function (trap, a) {
    if (!a)
        throw "eek";
    trap.push (a.x);
    trap.push (a.y);
    //trap.push (1.0);
};

var add_trap = function (trap, bottom, top) {
    if (!bottom || !top || ((top.length + bottom.length != 3) && (top.length + bottom.length != 4)))
        throw "ahh";
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
        
        add_point (trap, bottom[0]);
        add_point (trap, bottom[1]);
        add_point (trap, top[1]);

        add_point (trap, top[0]);
        add_point (trap, top[1]);
        add_point (trap, bottom[0]);
    }
};

var trapezoid_polygon = function (poly_in) {
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
        return poly[a.current].y - poly[b.current].y;
    });
    var sweep = [];
    var state = [];
    var lower = new vect (-200, 0);
    var upper = new vect (200, 0);
    var count = 0;
    var pairs = [];
    var change = 0;
    var trap = [];
    for (var i = 0; i < vertices.length; i ++) {
        var v = vertices[i];
        var l_in = set_contains (sweep, v.lower);
        var u_in = set_contains (sweep, v.current);

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
            state.splice (s_index, 0, [poly[v.current]]);
        }
        else if (l_in && !u_in) {
            add_trap (trap, state[s_index], [intersect (v.current, poly, sweep[Math.max (l_pos, u_pos) - 1]), poly[v.current]]);
            state[s_index] = [intersect (v.current, poly, sweep[Math.min (l_pos, u_pos) - 1]), poly[v.current]];
        }
        else if (!l_in && u_in) {
            add_trap (trap, state[s_index], [poly[v.current], intersect (v.current, poly, sweep[Math.min (u_pos, l_pos) + 1])]);
            state[s_index] = [poly[v.current], intersect (v.current, poly, sweep[Math.max (u_pos, l_pos) + 1])];
        }
        else if (!above_in && l_in && u_in) {
            
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
    return trap;
    
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
                    value = this.getStyle (layer, null, key);     
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
    };

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
//      var val = arg.match (/^\s*([^\s]+)\s*$/);
//      if (!val.length)
//          return null;
//      return val[1];
//     };

//     var is_geometry = function (val) {
//      return (val == 'polygon' || val == 'point' || val == 'line' || val == '*');
//     };

//     var parse_selector = function (arg) {
//      var is_id = str_contains (arg, '#');
//      var is_class = str_contains (arg, '.');
//      if (is_id && is_class)
//          return null;
//      //if (is_id || is_class) {
//      var selector_match = arg.match (/^(\w*)([\.\#](\w+))?$/)
//      if (!selector_match)
//          return null;
//      var sel_type = selector_match[1];
//      if (!sel_type)
//          sel_type = '*';
//      if (!is_geometry (sel_type))
//          return null;
//      console.log ('found', sel_type);
//      //var name_match = arg.match (/^(\w*)[\.\#](\w+)/);
//      var name = selector_match[2];
//      if (!name)
//          name = '*';
//      return {
//          type: sel_type,
//          name: name
//      };
//      //}
//     };

//     var split_arg = function (arg) {
//      arg = arg.replace (/\s*([,()])\s*/g, '$1');
//      var vals = arg.split (' ');
//      var result = [];
//      $.each (vals, function (i, v) {
//          if (v.length > 0)
//              result.push (v);
//      });
//      return result;
//     };

//     var convert_type = function (name, val) {
//      var results = [];
//      $.each (val, function (i, v) {
//          if (isRGB (v)) {
//              results.push (parseRGB (v));
//          }
//          else if (isInt (v)) {
//              results.push (parseInt (v));
//          }
//          else if (isFloat (v)) {
//              results.push (parseFloat (v));
//          }
//          else {
//              results.push (v);
//          }
//      });
//      return results;
//     };

//     var parse_prop = function (prop, string) {
//      args = string.split (':');
//      if (args.length != 2) {
//          if (string != ' ' && string != '')
//              console.log ('Error parsing css string:', string);
//          return;
//      }
//      var name = strip_whitespace (args[0]);
//      var val = split_arg (args[1]);
//      if (!name || !val)
//          return;
//      prop[name] = convert_type (name, val);
//     };

//     $.each (document.styleSheets, function (i, sheet) {
//      $.each (sheet.rules || sheet.cssRules, function (j, rule) {
//          var selector_ob = parse_selector (rule.selectorText);
//          if (!selector_ob)
//              return;
//          var prop_raw = rule.style.cssText.split (';')
//          console.log (prop_raw);
//          var prop = {};
//          $.each (prop_raw, function (k, string) {
//              parse_prop (prop, string);
//          });
//          if (!(selector_ob.type in matches))
//              matches[selector_ob.type] = {}
//          matches[selector_ob.type][selector_ob.name] = prop;
//          //if (!(rule.selectorText in matches))
//          //    matches[rule.selectorText] = prop;
//          //else
//          //    matches.concat (prop)
//      });
//     });
//     console.log ('css', matches);
//     // var pages = $ ('link[rel="stylesheet"]')
//     var defaults = {};
//     var layers = {};
//     var features = {};
//     this.register = function (feature) {

//     };
// };
var Camera = function (engine, options) {
    var canvas = engine.canvas;
    var camera = this;
    if (!options)
        options = {};
    
    if (options.width && !options.height) {
        options.height = options.width;
    }
    else if (!options.width && options.height) {
        options.width = options.height;
    }
    
    var aspect = options.preserveAspectRatio ? canvas.height () / canvas.width () : 1; 
    
    if (options.min) {
        options.center = vect.add (options.min, new vect (options.width, options.height * aspect).scale (.5));
    }
    else if (!options.center) {
        options.center = new vect (0, 0);
    }
    
    
    // These four parameters (along with the viewport aspect ratio) completely determine the
    // transformation matrices.
    var worldWidth = options.width;
    var worldHeight = options.height;
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
        var aspectRatio = options.preserveAspectRatio ? canvas.height () / canvas.width () : 1;  
        var worldRatio = worldHeight / worldWidth;
        var xlevel = options.xlock ? 1 : level;
        var ylevel = options.ylock ? 1 : level;
        
        //var half_size = vect.sub (options.max, options.min).scale (.5).scale (1.0 / level);
        
        var half_size = new vect (worldWidth / xlevel, (worldWidth * worldRatio * aspectRatio) / ylevel).scale (.5);
        
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
        
        engine.dirty = true;
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
        if (scale === undefined)
            return level;
        level = scale;
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
    
    this.size = function () {
        var aspectRatio = options.preserveAspectRatio ? canvas.height () / canvas.width () : 1; 
        var worldRatio = worldHeight / worldWidth;
        var xlevel = options.xlock ? 1 : level;
        var ylevel = options.ylock ? 1 : level;
        
        return new vect (worldWidth / xlevel, (worldWidth * worldRatio * aspectRatio) / ylevel);
    };
};
var Scroller = function (engine, options) {
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
        var zoom = engine.camera.zoom ();
        engine.camera.zoom (zoom * delta);
        readjustWorld ();
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
        var change = false;
        var newPos;
        if (drag && enabled) {
            var m = vect.sub (engine.camera.project (start), engine.camera.project (pos));
            var currentPos = engine.camera.position ();
            newPos = vect.add (currentPos, m);
            engine.camera.position (newPos);

            start = pos;
            speed = m.length () / dt;
            dir = m;
            dir.normalize ();
            change = true;
        }
        else if (speed > .01) {
            if (dir) {
                var m = vect.scale (dir, speed * dt);
                var currentPos = engine.camera.position ();
                newPos = vect.add (currentPos, m);
                engine.camera.position (newPos);
                speed -= 3.0 * dt * speed;
                change = true;
            }
        }

        if (change)
            readjustWorld ();
    };

    var readjustWorld = function () {
        if (options.worldMin && options.worldMax) {
            var newPos = engine.camera.position ();
            var size = engine.camera.size ();
            var worldMaxWidth = options.worldMax.x - options.worldMin.x;

            if (size.x > worldMaxWidth) {
                var worldWidth = size.x * engine.camera.zoom ();
                engine.camera.zoom (worldMaxWidth / worldWidth);
            }

            newPos = engine.camera.position ();
            size = engine.camera.size ();
            var worldMaxHeight = options.worldMax.y - options.worldMin.y;
            if (size.y > worldMaxHeight) {
                var worldHeight = size.y * engine.camera.zoom ();
                engine.camera.zoom (worldMaxHeight / worldHeight);
            }
        }
        var newPos = engine.camera.position ();
        var halfSize = engine.camera.size ().scale (.5);
        var change = false;
        if (options.worldMin) {
            if (newPos.x - halfSize.x < options.worldMin.x)
                newPos.x = options.worldMin.x + halfSize.x;
            if (newPos.y - halfSize.y < options.worldMin.y)
                newPos.y = options.worldMin.y + halfSize.y;
            change = true;
        }
        if (options.worldMax) {
            if (newPos.x + halfSize.x > options.worldMax.x)
                newPos.x = options.worldMax.x - halfSize.x;
            if (newPos.y + halfSize.y > options.worldMax.y)
                newPos.y = options.worldMax.y - halfSize.y;
            change = true;
        }
        if (change)
            engine.camera.position (newPos);
    }
};
var EventManager = new function () {
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
        this.manage (parent);
        this.manage (object);
        this.listeners[object.id].parents.push (parent);
    };

    this.addEventHandler = function (object, eventType, handler) {
        this.manage (object);        
        if (!(this.listeners[object.id].callbacks[eventType]))
            this.listeners[object.id].callbacks[eventType] = [];
        this.listeners[object.id].callbacks[eventType].push (handler);
    };

    // The object (feature/layer/map) that the mouse is currently over
    var currentOver = null;

    this.moveMouse = function (engine) {

    };
    this.clickMouse = function (engine) {

    };
    this.mouseDown = function (engine) {

    };

    this.mouseOver = function (object) {
        if (currentOver !== null && object != currentOver) {
            this.trigger (currentOver, 'mouseout', [currentOver]);
        }
        if (object !== null && object != currentOver) {
            this.trigger (object, 'mouseover', [object]);
        }
        currentOver = object;
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
var FeatureView = function (geom, styleFunc) {
    this.style_map = {};

    this.geom = geom;

    var style = {};

    this.updateMany = function (styleObject) {
        for (var key in styleObject) {
            this.updateOne (key, styleObject[value]);
        }
    };

    // Update the buffers for a specific property    
    this.updateOne = function (key, value) {
        // If the value is not defined, there is problem
        if (value === undefined)
            throw "No value for style defined";

        if (style[key] == value)
            return;

        style[key] = value;

        if (key in this.style_map) {
            this.style_map[key] (value);
        }
    };

    this.updateDefault = function (key) {
        var value = styleFunc (key);
        this.updateOne (key, value);
    };
    
    // Overloaded function to update the view
    this.update = function (arg0, arg1) {
        if (typeof arg0 == "string") {
            if (arg1 === undefined)
                this.updateDefault (arg0);
            else
                this.updateOne (arg0, arg1);
        }
        else {
            this.updateMany (arg0);
        }
    };

    this.keys = function () {
        var items = {};
        for (var key in this.style_map) {
            items[key] = true;
        }        
        return items;
    };
        
    // Update all buffers for all properties
    this.updateAll = function () {
        for (var key in this.style_map) {
            this.updateDefault (key);
        }
    };
};
var FeatureRenderer = function (engine) {
    var renderer = this;

    this.engine = engine;

    // A list of views of the object
    this.views = [];

    // Update all features with a style property
    this.update = function (key) {
        for (var i = 0; i < views.length; i ++) {
            this.views[i].update (key);
        }
    };

    // Abstract method that should be replaced with a the correct constructor
    this.View = function () {
        throw "Attempt to call abstract function";
    };

    // Create a new view (in wigglemaps land, a slice of buffers)
    // Uses only a representation of geometry and style function
    this.create = function (geom, style) {
        var view = new this.View (geom, style);
        this.views.push (view);
        view.updateAll ();
        return view;
    };

    this.draw = function () {
        throw "Attempt to call abstract function";
    };
};
var INITIAL_POINTS = 1024;

var unit = rect (0, 0, 1, 1);

var PointRenderer = function (engine, layer) {
    FeatureRenderer.call (this, engine, layer);

    if (!(engine.shaders.point)) {
        engine.shaders.point = makeProgram (engine.gl, BASE_DIR + 'shaders/point');
    }
    var point_shader = engine.shaders.point;
    
    // A value greater than or equal to the maximum radius of each point
    var max_rad = 10.0;

    // The required buffers for rendering
    var buffers = new Buffers (engine, INITIAL_POINTS);
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
    var PointView = function (feature_geom, feature_style) {
        FeatureView.call (this, feature_geom, feature_style);

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
        
        var total_points = feature_geom.length;
        count = 6 * total_points;
        start = buffers.alloc (count);

        $.each (feature_geom, function (index, point) {
            buffers.repeat ('vert', point, start + index * 6, 6);
            buffers.write ('unit', unit, start + index * 6, 6);
        });
    };

    this.View = PointView;

    this.update = function () {
        buffers.update ();
    };

    this.draw = function () {
        var gl = engine.gl;

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

var draw_lines = function (stroke_buffers, geom) {

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

    var currentIndex = startIndex;

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

var LineRenderer = function (engine) {
    FeatureRenderer.call (this, engine);

    if (!(engine.shaders.line)) {
        engine.shaders.line = makeProgram (engine.gl, BASE_DIR + 'shaders/line');
    }
    var line_shader = engine.shaders.line;

    var stroke_buffers = new Buffers (engine, 1024);
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

    var LineView = function (feature_geom, feature_style) {
        FeatureView.call (this, feature_geom, feature_style);

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

        $.each (feature_geom, function (i, poly) {
            for (var i = 0; i < poly.length; i ++) {
                stroke_count += draw_lines (stroke_buffers, poly[i]);
            }
        });
    };

    this.View = LineView;

    this.update = function () {
        stroke_buffers.update ();
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
    };

};
var INITIAL_POLYGONS = 1024;

var PolygonRenderer = function (engine) {
    FeatureRenderer.call (this, engine);

    if (!(engine.shaders.polygon)) {
        engine.shaders.polygon = makeProgram (engine.gl, BASE_DIR + 'shaders/poly');
    }
    var poly_shader = engine.shaders.polygon;

    var fill_buffers = new Buffers (engine, INITIAL_POLYGONS);
    fill_buffers.create ('vert', 2);
    fill_buffers.create ('color', 3);
    fill_buffers.create ('alpha', 1);

    var PolygonView = function (feature_geom, style_func) {
        FeatureView.call (this, feature_geom, style_func);

        //var lines = line_renderer.create (feature_geom);
        //this.children.push (lines);

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
            if (count == 100) {
                console.log ("Rendering Polygon Failed: Skipping Interior");
                p = [];
            }
            
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
    };

    this.View = PolygonView;

    this.update = function (dt) {
        fill_buffers.update ();
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
    };
};
var TimeSeriesRenderer = function (engine, layer, options) {
    LineRenderer.call (this, engine, layer, options);
    
    var order = options.order;

    this.View = function (feature) {
        var linestrings = [];
        var linestring = [];

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
                linestring.push ([i, y]);
            }
        }
        if (linestring.length > 0)
            linestrings.push (linestring);

        var feature_geom = [linestrings];
        return feature_geom;
    };
};
var multiRendererFactory = function (Renderers) {
    return function (engine, layer, options) {
        var renderers = [];
        
        var MultiView = function (views) {
            this.update = function (key, value) {
                $.each (views, function (i, view) {
                    view.update (key, value);
                });
            };

            this.keys = function () {
                var items = {};
                $.each (views, function (i, view) {
                    for (var key in view.style_map) {
                        items[key] = true;
                    }        
                });
                return items;
            };
        };

        $.each (Renderers, function (i, Renderer) {
            renderers.push (new Renderer (engine, layer, options));
        });

        this.views = [];

        this.create = function (key, style) {
            var views = [];
            $.each (renderers, function (i, renderer) {
                views.push (renderer.create (key, style));
            });
            return new MultiView (views);
        };

        this.update = function () {
            $.each (renderers, function (i, renderer) {
                renderer.update ();
            });
        };

        this.draw = function () {
            $.each (renderers, function (i, renderer) {
                renderer.draw ();
            });
        };
    };
};
var WORLD_MODE = 0;
var SCREEN_MODE = 1;

var fonts = {};
var TextRenderer = function(engine, settings) {

    if (!settings)
        settings = {};
    if (!settings.style)
        settings.style = {};

    if (!engine.text_shader) {
        engine.text_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/text');
    }
    if (!('OpenSans' in fonts)) {
        $.ajax ({
            url: BASE_DIR + '/fonts/OpenSans.svg',
            async: false,
            dataType: 'xml',
            success: function (data) {
                fonts.OpenSans = {};
                var glyphs = data.getElementsByTagName ('glyph');
                for (var i = 0 ; i < glyphs.length; i ++) {
                    var letter = glyphs[i].getAttribute ('unicode');
                    fonts.OpenSans[letter] = {
                        path: glyphs[i].getAttribute ('d'),
                        hor: parseFloat (glyphs[i].getAttribute ('horiz-adv-x'))
                    };
                }
            }
        });
    }

    var buffers = new Buffers (engine);
    buffers.create ('pos', 2);
    buffers.create ('tex', 2);
    buffers.create ('mode', 1);

    var TextView = function(string, options) {
        default_model (options, {
            xmode: WORLD_MODE,
            ymode: WORLD_MODE,
            pos: vect(0, 0),
            height: 8,
            padding: vect(5, 3),
            priority: 0
        });

        this.priority = options.priority;

        var ring_orientation = function (ring) {
            var total = 0;
            for (var i = 0; i < ring.length - 2; i ++) {
                total += (ring[i + 1][0] - ring[i][0]) * (ring[i + 1][1] + ring[i][1]);
            }
            return total > 0;
        };

        var path = function (letter, offset, symbol) {
            if (!letter)
                return;
            var current = [0 + offset, 0];
            var control = [0 + offset, 0];
            var re = /([A-Za-z])([^A-Za-z]*)/g;
            var match = null;
            var rings = [];
            var ring = [];
            while (match = re.exec (letter)) {
                var args = match[2].split (' ');
                var next;
                if (match[1].match ('[Zz]')) {
                    next = [current[0], current[1]];
                    ring.push (ring[0]);
                    if (ring)
                        rings.push (ring);
                    ring = [];
                }
                else if (match[1].match (/[M]/)) {
                    next = [parseFloat (args[0]) + offset, parseFloat (args[1])];
                    ring.push(next);
                    current = next;
                }
                else if (match[1].match (/[Ll]/)) {
                    if (match[1] == 'L')
                        next = [parseFloat (args[0]) + offset, parseFloat (args[1])];
                    else if (match[1] == 'l')
                        next = [current[0] + parseFloat (args[0]), current[1] + parseFloat (args[1])];
                    ring.push (next);
                    current = next;
                }
                else if (match[1].match (/[Hh]/)) {
                    if (match[1] == 'H')
                        next = [parseFloat (args[0]) + offset, current[1]];
                    else if (match[1] == 'h')
                        next = [current[0] + parseFloat (args[0]), current[1]];
                    ring.push (next);
                    current = next;
                }
                else if (match[1].match (/[Vv]/)) {
                    if (match[1] == 'V')            
                        next = [current[0], parseFloat (args[0])];
                    else if (match[1] == 'v')
                        next = [current[0], current[1] + parseFloat (args[0])];
                    ring.push (next);
                    current = next;
                }
                else if (match[1].match (/[QqTt]/)) {
                    if (match[1] == 'Q') {
                        control = [parseFloat (args[0]) + offset, parseFloat (args[1])];
                        next = [parseFloat (args[2]) + offset, parseFloat (args[3])];
                    }
                    else if (match[1] == 'q') {
                        control = [current[0] + parseFloat (args[0]), current[1] + parseFloat (args[1])];
                        next = [current[0] + parseFloat (args[2]), current[1] + parseFloat (args[3])];
                    }
                    else if (match[1] == 'T') {
                        control = [-(control[0] - current[0]) + current[0], -(control[1] - current[1]) + current[1]];
                        next = [parseFloat (args[0]) + offset, parseFloat (args[1])];
                    }
                    else if (match[1] == 't') {
                        control = [-(control[0] - current[0]) + current[0], -(control[1] - current[1]) + current[1]];
                        next = [current[0] + parseFloat (args[0]), current[1] + parseFloat (args[1])];
                    }
                    var mode;
                    var v_next = new vect (next[0], next[1]);
                    var v_current = new vect (current[0], current[1]);
                    var v_control = new vect (control[0], control[1]);
                    if (vect.left (v_next, v_current, v_control)) {
                        mode = 1.0;
                        ring.push (control);
                        ring.push (next);
                    }
                    else {
                        mode = 0.0;
                        ring.push (next);
                    }
                    var start_tri = buffers.alloc (3);
                    buffers.write ('pos', [current[0], current[1], next[0], next[1], control[0], control[1]], start_tri, 3);
                    buffers.write ('tex', [0, 0, 1, 1, .5, 0], start_tri, 3);
                    buffers.repeat ('mode', [mode], start_tri, 3);
                    current = next;
                }
                else
                    throw 'Path error: ' + match[1];
            }

            var count = 0;
            for (var i = 0; i < rings.length; i ++) {
                rings[i].reverse ();
            }
            var poly;
            while (count < 100) {
                try {
                    /*poly.append ({
                      geom: [rings]
                      });*/
                    poly = triangulate_polygon (rings);
                    count = 101;
                } catch (e) {
                    count ++;
                }
            }
            if (count == 100)
                console.log ('rendering polygon failed on', symbol);

            var tri_len = poly.length / 2;
            var start = buffers.alloc (tri_len);
            buffers.write ('pos', poly, start, tri_len);
            buffers.repeat ('tex', [0, 0], start, tri_len);
            buffers.repeat ('mode', [.5], start, tri_len);

            var min_val = Infinity;
            var max_val = -Infinity;
            for (var i = 0; i < rings.length; i ++) {
                for (var j = 0; j < rings[i].length; j ++) {
                    if (rings[i][j][0] < min_val)
                        min_val = rings[i][j][0];
                    if (rings[i][j][0] > max_val)
                        max_val = rings[i][j][0];
                }
            }
            //return max_val - min_val;
        };

        var offset = 0;
        var letters = fonts.OpenSans;
        
        for (var i = 0; i < string.length; i ++) {
            if (string[i] != 'P')
                path (letters[string[i]].path, offset, string[i]);
            offset += (letters[string[i]].hor);
        }

        var width = options.height * offset / 1000;
        this.bbox = function() {
            var px_pos = engine.camera.screen(options.pos);
            var px_size = vect(width, options.height);
            var box = new Box(
                vect(px_pos.x - options.padding.x, px_pos.y - px_size.y - options.padding.y), 
                vect(px_pos.x + px_size.x + options.padding.x, px_pos.y + options.padding.y)
            );
            return box;
        };

    };

    this.views = [];
    this.append = function(string, options) {
        var view = new TextView(string, options);
        this.views.push(view);
    };

    //var framebuffer = null;

    this.draw = function (engine, dt) {
        var gl = engine.gl;
        //if (!framebuffer)
        //    framebuffer = engine.framebuffer ();
        buffers.update ();

        //framebuffer.activate ({
        //    blend: false
        //});

        var text_shader = engine.text_shader;
        gl.useProgram (text_shader);    
        
        text_shader.data ('world', engine.camera.worldToPx);
        text_shader.data ('screen', engine.camera.pxToScreen);
        text_shader.data ('pos', buffers.get ('pos'));
        text_shader.data ('tex_in', buffers.get ('tex'));
        text_shader.data ('mode_in', buffers.get ('mode'));
        
        text_shader.data ('px', 2.0 / engine.canvas.width ());
        text_shader.data ('py', 2.0 / engine.canvas.height ());

        //text_shader.data ('translate', [options.pos.x, options.pos.y]);
        text_shader.data ('translate', [0, 0]);
        //text_shader.data ('height', options.height);
        text_shader.data ('height', 8);
        text_shader.data ('aspect', engine.canvas.height () / engine.canvas.width ());
        text_shader.data ('one_px', 2.0 / engine.canvas.height ());     

        //text_shader.data ('xmode', options.xmode);     
        //text_shader.data ('ymode', options.ymode);

        gl.drawArrays (gl.TRIANGLES, 0, buffers.count ()); 

        //framebuffer.deactivate ();

        //engine.draw_blur (framebuffer.tex);
        //poly.draw (engine, dt);
    };
};
var Querier = function (engine, layer, options) {
    var queriers = {};
    $.each (engine.Queriers, function (geomType, GeomQuerier) {
        queriers[geomType] = new GeomQuerier (engine, layer, options);
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
        //var results = new LayerSelector ([]);
        for (var key in queriers) {
            //var search_results = queriers[key].pointSearch (p);
            //results = results.join (search_results);
            var result = queriers[key].pointSearch (p);
            if (result)
                return result;
        }
        //return results;
        return null;
    };
};
// A controller for point specific operations, particualrly to perform geometric queries
// on points faster. 
var PointQuerier = function (engine, layer, options) {
    var points = layer.features ().type ('Point');
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
    };

    // Converts geometry representation of a point to a vector
    var geom2vect = function (geom) {
        return new vect (geom[0], geom[1]);
    };

    this.pointSearch = function (s) {
        var min = vect.add (s, new vect (-max_radius, max_radius));
        var max = vect.add (s, new vect (max_radius, -max_radius));
        var box = new Box (engine.camera.project (min), engine.camera.project (max));
        var elem = range_tree.search (box);
        for (var i = 0; i < elem.length; i ++) {
            var point = elem[i].ref;
            var rad = StyleManager.derivedStyle (point, layer, engine, 'radius');
            for (var j = 0; j < point.geom.length; j ++) {
                var v = engine.camera.screen (geom2vect (point.geom[j]));
                if (vect.dist (v, s) < rad)
                    //return new LayerSelector ([point.ref]);
                    return point;
            }
        }
        //return new LayerSelector ([]);
        return null;
    };
};
var PolygonQuerier = function (engine, layer, options) {
    var polygons = layer.features ().type ('Polygon');
    var r_points = [];
    polygons.each (function (n, polygon) {
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
        polygons.each (function (i, polygon) {
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
    this.pointSearch = function (s) {
        var p = engine.camera.project (s);
        //var results = [];
        //polygons.each (function (i, polygon) {
        for (var i = 0; i < polygons.count (); i ++) {
            var polygon = polygons.get (i);
            if (polygon.contains (p))
                return polygon;
            //results.push (polygon);
            //});
        }
        //return new LayerSelector (results);
        return null;
    };
};
var TimeSeriesQuerier = function (engine, layer, options) {
    var lines = layer.features ();
    var r_points = [];
    layer.features ().each (function (n, polygon) {
        $.each (options.geomFunc (polygon), function (i, poly) {
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
        var results = [];
        for (var k in keys) {
            results.push (keys[k]);
        }
        return new LayerSelector (results);
    };

    this.pointSearch = function (s) {
        var p = engine.camera.project (s);
        var stepIndex = Math.floor (p.x);
        if (stepIndex < 0 || stepIndex >= options.order.length)
            return null;
        for (var i = 0; i < lines.count (); i ++) {
            var line = lines.get (i);
            var v1 = line.attr (options.order[stepIndex]);
            var v2 = line.attr (options.order[stepIndex + 1]);
            if (isNaN (v1) || isNaN (v2))
                continue;

            var p1 = vect (stepIndex, v1);
            var p2 = vect (stepIndex + 1, v2);

            var s1 = engine.camera.screen (p1);
            var s2 = engine.camera.screen (p2);

            var v = vect.dir (s2, s1);
            var u = vect.sub (s, s1);
            var side1 = vect.dot (u, v);
            var side2 = u.length ();
            var dist2Line = Math.sqrt (Math.pow (side2, 2) - Math.pow (side1, 2));
            if (dist2Line < StyleManager.derivedStyle (line, layer, engine, 'stroke-width'))
                return line;
        }
        //return new LayerSelector ([]);
        return null;
    };
};
var LayerSelector = function (elem) {

    var lookup = null;

    this.length = elem.length;

    this.count = function () {
        return elem.length;
    };

    this.items = function () {
        return elem;
    };

    this.type = function (key) {
        var result = [];
        for (var i = 0; i < elem.length; i ++) {
            if (key == '*' || elem[i].type == key)
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

    this.not = function (selector) {
        var result = [];
        for (var i = 0; i < elem.length; i ++) {
            if (selector.id (elem[i].id) === null)
                result.push (elem[i]);
        }
        return new LayerSelector (result);
    };

    this.both = function (selector) {
        var result = [];
        for (var i = 0; i < elem.length; i ++) {
            if (selector.id (elem[i].id) !== null)
                result.push (elem[i]);
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
        '>': function (a, b) { return a > b; },
        '<': function (a, b) { return a < b; },
        '==': function (a, b) { return a == b; },
        '>=': function (a, b) { return a >= b; },
        '<=': function (a, b) { return a <= b; }
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
        var new_elem = [];
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
    };

    this.quantile = function (field, q, total) {
        var clean = elem.filter (function (f) {
            return (f.attr (field) !== undefined);
        });
        clean.sort (function (a, b) {
            return a.attr(field) - b.attr(field);
        });
        var top = Math.round (q * clean.length / total);
        var bottom = Math.round ((q - 1) * clean.length / total);
        return new LayerSelector (clean.slice (bottom, top));
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
                return elem[0].style (engine, key);
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
var LayerController = function (engine, layer, options) {
    var controller = this;

    // Set this as the parent of the layer in the event hierarchy
    EventManager.manage (layer);
    EventManager.linkParent (engine, layer);

    // All the renderers for this layer
    this.renderers = {};

    // A flat view of all views in all renderers
    this.views = {};

    // Used as a callback when the StyleManager changes a feature
    var update_feature = function (f, key) {
        var value = StyleManager.derivedStyle (f, layer, engine, key);
        controller.views[f.id].update (key, value);
    };

    layer.features ().each (function (i, f) {
        var renderKey;
        if (f.type in engine.Renderers) {
            renderKey = f.type;
        }
        else {
            renderKey = 'default';
        }
        if (!(renderKey in controller.renderers)) {
            controller.renderers[renderKey] = new engine.Renderers[renderKey] (engine, layer, options);
        }
        var view = controller.renderers[renderKey].create (options.geomFunc (f), (function (feature) {
            return function (key) {
                return StyleManager.derivedStyle (feature, layer, engine, key);
            };
        }) (f));

        controller.views[f.id] = view;

        EventManager.linkParent (layer, f);
        EventManager.addEventHandler (f, 'style', update_feature);
    });

    this.update = function (engine, dt) {
        for (var key in this.renderers) {
            this.renderers[key].update (dt);
        }
    };

    this.draw = function (engine, dt) {
        for (var key in this.renderers) {
            this.renderers[key].draw (dt);
        }
    };

};
var TextController = function(engine, settings) {
    var renderer = new TextRenderer(engine);

    this.append = function(string, options) {
        default_model (options, {
            priority: 0
        });

        renderer.append(string, options);

        //renderers.sort(function (a, b) {
        //    return b.priority - a.priority;
        //});
    };

    this.draw = function(engine, dt) {
        renderer.draw(engine, dt);
        /*var drawn = [];
        $.each(renderers, function(i, renderer) {
            var rbox = renderer.bbox();
            for (var i = 0; i < drawn.length; i ++) {
                if (drawn[i].bbox().intersects(rbox)) {
                    return false;
                }
            }
            renderer.draw(engine, dt);
            drawn.push(renderer);
        });*/
    };
};
var Engine = function (selector, options) {
    var engine = this;

    default_model (options, {
        background: new Color (0, 0, 0, 1)
    });

    // This helps the style manager know what kind of element is getting styled
    this.type = 'Engine';

    // Every top level element: engines, layers, features, etc has a unqiue id
    // This gets used by the style manager and event manager
    this.id = new_feature_id ();

    // The engine is responsible for creating an inserting the actual 3D canvas
    // The user is responsible for allocating a div and setting the correct size
    // before the engine is instantiated
    this.canvas = $ ('<canvas></canvas>').attr ('id', 'viewer');
    var gl = null;

    if (selector) {
        $ (selector).append (this.canvas);
    }
    else {
        // If the user doesn't specify a div to use, take over the entire page
        // as a top level application
        selector = window;
        $ ('body').append (this.canvas);
    }
    // Take up the entire space in the allocated div
    this.canvas.attr ('width', $ (selector).width ());
    this.canvas.attr ('height', $ (selector).height ());

    // Resizing the canvas requires a few special steps, so listen for the window 
    // to resize. If the user wants a resize without a window change, then they
    // are resposible for calling resize
    $ (window).resize (function (event) {
        engine.resize ();
    });

    var framebuffers = [];
    var framebuffer_stack = [];
    // Allow layers to request a framebuffer from the engine
    // This lets layers do their own multipass rendering without help
    this.framebuffer = function () {
        var framebuffer = gl.createFramebuffer ();
        gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer);
        framebuffer.width = engine.canvas.width ();
        framebuffer.height = engine.canvas.height ();
    
        // The texture the framebuffer outputs to
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

        // A convience object for layers that can activate, deactivate, and read from
        // The framebuffer
        var frame = {
                framebuffer: framebuffer,
                renderbuffer: renderbuffer,
                tex: tex,
                resize: function () {
                    framebuffer.width = engine.canvas.width ();
                    framebuffer.height = engine.canvas.height ();

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
                    gl.viewport (0, 0, engine.canvas.width (), engine.canvas.height ());

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
                }
            };
        framebuffers.push (frame);
        return frame;
    };

    // When a resize event happens, change the viewport of the GL window
    // and set the heights of the framebuffers
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
    // Set the intial viewport size
    gl.viewport (0, 0, this.canvas.width (), this.canvas.height ());

    // Blending
    gl.blendFunc (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable (gl.BLEND);

    // The camera controls the view matrices
    this.camera = new Camera (engine, options);
    // The scroller controls panning and zooming. It talks to
    // the camera API to change the matrices
    this.scroller = new Scroller (this, options);

    // Set the world space width of canvas without changing the aspect ratio
    this.extents = function (width) {
        this.camera.extents (width);
    };

    // Sets the center point of the canvas in world space
    this.center = function (arg0, arg1) {
        if (arg1 === undefined)
            this.camera.position (arg0);
        else
            this.camera.position (new vect (arg0, arg1));
    };

    // How far is one pixel in 0 to 1 shader space
    this.pxW = 1 / this.canvas.attr ('width');
    this.pxH = 1 / this.canvas.attr ('height');

    this.Renderers = {};
    this.Queriers = {};

    this.renderers = {};
    this.views = {};

    this.styles = {};

    this.dirty = true;

    // Engines (and their subcalsses) are responsable for giving the
    // style manager default styles on request. Not specifying a default
    // a style is an error
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

    EventManager.manage (this);

    // See if any features on a layer are contained in a box
    this.search = function (layer, box) {
        return this.queriers[layer.id].boxSearch (box);
    };

    // Set the style of this engine
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

    // There is only one Selection box for each engine. The user can
    // activate as needed
    var sel = new SelectionBox (this);

    // Specify a callback when the selection box is released through mouseup
    this.select = function (func)  {
        sel.select (func);
    };

    // Turn on and off the selection box
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

    // DEBUG: Measure the framerate in a working set
    var old_time =  new Date ().getTime ();
    var fps_window = [];

    // Ensures that the main drawing function is called in the scope of the engine
    var draw = (function (engine) {
        return function () {
            engine.draw ();
        };
    }) (this);

    this.shaders = {};

    this.scene = [];
    this.queriers = {};

    var lastDraw = 0;

    var lastMouse = 0;

    // Updates the elemenets of the engine, including styles and mouse events
    this.update = function () {
        // Update the FPS counter
        var current_time = new Date ().getTime ();
        var dt = (current_time - old_time) / 1000;

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

        // Update the pan and zoom controller
        this.scroller.update (dt);

        // Update the mouse event
        if (Mouse.lastMove > lastMouse) {
            var mouse = vect (Mouse.x, Mouse.y);
            var oneOver = false;
            $.each (this.queriers, function (layerId, querier) {
                var feature = querier.pointSearch (mouse);
                if (feature) {
                    EventManager.mouseOver (feature);
                    oneOver = true;
                    return false;
                }
            });
            if (!oneOver) {
                EventManager.mouseOver (null);
            }
        }
        lastMouse = Mouse.lastMove;

        // Update each renderer
        $.each (this.scene, function (i, layer) {
            if (layer.update)
                layer.update (engine, dt);
        });

    };

    var labels = new TextController(this, options)
    this.label = function(string, options) {
        labels.append(string, options);
    };

    this.draw = function () {
        this.update ();

        // If nothing has been done, don't redraw
        if (this.dirty) {

            // Clear the old color buffer and depth buffer
            gl.clearColor(options.background.r, options.background.g, options.background.b, options.background.a);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.clearDepth (0.0);

            if (this.base)
                this.base.draw(engine);
            
            $.each (this.scene, function (i, layer) {
                layer.draw (engine);
            });

            labels.draw(engine);

            if (selectEnabled) {
                sel.draw (this);
            }

        }
        
        // Other layers have access to the dirty flag. They set it to true
        // if a redraw is needed
        this.dirty = false;

        requestAnimationFrame (draw);
        
    };

    this.enableZ = function () {
        gl.depthFunc (gl.LEQUAL);
        gl.enable (gl.DEPTH_TEST);
    };

    this.disableZ = function () {
        gl.disable (gl.DEPTH_TEST);
    };

    this.canvas.mouseout (function () {
        EventManager.mouseOver (null);
    });

    // Start the animation loop
    requestAnimationFrame (draw);
};
// The main map class
// This is the top level controller for all layers and renderers
var Map = function (selector, options) {
    var engine = this;

    if (options === undefined)
        options = {};

    // The geom function defined how to extract the geometry from a feature
    options.geomFunc = function (f) {
        return f.geom;
    };

    default_model (options, {
        'width': 360,
        'center': new vect (0, 0),
        'base': 'default',
        'tile-server': 'http://eland.ecohealthalliance.org',
        'preserveAspectRatio': true
    });

    Engine.call (this, selector, options); 

    // The renderers map between types and classes
    this.Renderers = {
        'Point': PointRenderer,
        'Polygon': multiRendererFactory ([PolygonRenderer, LineRenderer]),
        'Line': LineRenderer
    };

    // Queriers tell us how to search the geometry, which may not be the literal
    // geometry, depending on the choice of renderer
    this.Queriers = {
        'Point': PointQuerier,
        'Polygon': PolygonQuerier
        //'Line': LineQuerier
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
        // If the base layer already exists, remove to old one
        if (base) {
            // TODO
        }
        var settings;
        if (options.base == 'default' || options.base == 'nasa') {
            settings = copy (options);
            copy_to (settings, {
                source: 'file',
                url: options['tile-server'] + '/tiles/nasa_topo_bathy',
                levels: 8,
                size: 256
            });
            base = new MultiTileLayer (settings);
        }
        else if (options.base == 'ne') {
            settings = copy (options);
            copy_to (settings, {
                source: 'file',
                url: options['tile-server'] + '/tiles/NE1_HR_LC_SR_W_DR',
                levels: 6,
                size: 256
            });
            base = new MultiTileLayer (settings);
        }
        else if (options.base == 'ne1') {
            settings = copy (options);
            copy_to (settings, {
                source: 'file',
                url: options['tile-server'] + '/tiles/NE1_HR_LC',
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
            //engine.scene.push (base);
        };
        engine.base = base;
    };

    setBase ();

    // Allow for settings to be changed dynamically at runtime
    this.settings = function (key, value) {
        options[key] = value;
        if (key == 'base') {
            setBase();
        }
    };

    // Add a layer to the scene. Instantiate a controller (that handles
    // event and style registrations) and a set of queriers (that
    // handle searching rendered geometry)
    this.append = function (layer) {
        this.insert(layer, this.scene.length - 1);
    };

    this.insert = function(layer, index) {
        // Legacy layer drawing code for old-school type layers
        if ('draw' in layer) {
            this.scene.splice (index, 0, layer);
            this.dirty = true;
            return;
        }

        this.scene.splice (index, 0, new LayerController (engine, layer, options));
        this.queriers[layer.id] = new Querier (this, layer, options);

        // When a new layer is added, we should redraw at least once
        this.dirty = true;
    };

    this.remove = function (layer) {
        for (var i = 0; i < this.scene.length; i ++) {
            if (this.scene[i] == layer) {
                this.scene.splice(i, 1);
                break;
            }
        }
        delete this.queriers[layer.id];
    };
};
var TimeSeries = function (selector, layer, options) {
    var engine = this;
    if (options === undefined)
        options = {};

    if (!options.order) {
        options.order = layer.numeric ();
        options.order.sort ();
    }

    var unionBounds = function (bound1, bound2) {
        var min, max;

        if (bound1.min < bound2.min)
            min = bound1.min;
        else 
            min = bound2.min;

        if (bound1.max > bound2.max)
            max = bound1.max;
        else 
            max = bound2.max;
        return {
            'min': min,
            'max': max
        };
    };

    var features = layer.features ();
    var bounds = null;
    $.each (options.order, function (i, timeStep) {
        var stepBounds = features.range (timeStep);
        if (!bounds)
            bounds = stepBounds;
        else
            bounds = unionBounds (bounds, stepBounds);
    });

    default_model (options, {
        'range': {
            'min': bounds.min,
            'max': bounds.max
        },
        'domain': {
            'min': 0,
            'max': options.order.length - 1
        },
        'min': new vect (0, bounds.min),
        'width': options.order.length - 1,
        'height': bounds.max - bounds.min,
        'worldMin': new vect (0, bounds.min),
        'worldMax': new vect (options.order.length - 1, bounds.max),
        'xlock': false,
        'ylock': false
    });

    var order = options.order;

    options.geomFunc = function (feature) {
        var linestrings = [];
        var linestring = [];

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
                linestring.push ([i, y]);
            }
        }
        if (linestring.length > 0)
            linestrings.push (linestring);

        var feature_geom = [linestrings];
        return feature_geom;
    };

    Engine.call (this, selector, options);

    this.styles = {
        'default': {
            'fill': new Color (.02, .44, .69, 1.0),
            'fill-opacity': .5,
            'stroke': new Color (.02, .44, .69, 1.0),
            'stroke-opacity': 1.0,
            'stroke-width': 2.0
        }
    };

    this.Renderers = {
        'default': LineRenderer
    };

    this.Queriers = {
        '*': TimeSeriesQuerier
    };

    this.highlightTicks = function (indexList, color) {
        var renderer = new LineRenderer (engine);

        var lineStyleFunc = function (key) {
            return {
                'stroke': color,
                'stroke-width': .75,
                'stroke-opacity': 1.0
            }[key];
        };

        $.each (indexList, function (i, index) {
            var line = [[[
                [index, options.range.min],
                [index, options.range.max]
            ]]];
            renderer.create (line, lineStyleFunc);
        });
        engine.scene.push (renderer);
    };

    var grid_style = {
        'stroke': new Color (.25, .25, .25, 1.0),
        'stroke-width': .75,
        'stroke-opacity': 1.0
    };
    var gridStyleFunc = function (key) {
        return grid_style[key];
    };
    var drawGrid = function () {

        var grid_renderer = new LineRenderer (engine);

        $.each (options.order, function (i, key) {
            var line = [[[ 
                [i, options.range.min], 
                [i, options.range.max] 
            ]]];
            grid_renderer.create (line, gridStyleFunc);
        });

        var rect = [[[ 
            [options.domain.min, options.range.min], 
            [options.domain.max, options.range.min], 
            [options.domain.max, options.range.max], 
            [options.domain.min, options.range.max], 
            [options.domain.min, options.range.min] 
        ]]];
        grid_renderer.create (rect, gridStyleFunc);

        engine.scene.push (grid_renderer);

        if (options.ticks) {
            var currentTick = 0;
            while (currentTick > options.range.min)
                currentTick -= options.ticks;
            while (currentTick < options.range.max) {
                var line = [[[
                    [options.domain.min, currentTick],
                    [options.domain.max, currentTick]
                ]]];
                grid_renderer.create (line, gridStyleFunc);
                currentTick += options.ticks;

                engine.label(currentTick.toString().replace('9', 'X'), {
                    pos: vect(0, currentTick),
                    height: 6,
                });
            }
        }
    };
    drawGrid ();

    this.scene.push (new LayerController (engine, layer, options));
    this.queriers[layer.id] = new Querier (this, layer, options);
};
var SelectionBox = function (engine) {
    var sel_box_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/selbox');
    var enabled = false;
    var dragging = false;
    var start = null;
    var end = null;
    var sel_buffer = dynamicBuffer (engine.gl, 6, 2);
    var bound_buffer = staticBuffer (engine.gl, rect (0, 0, 1, 1), 2);
    var reset_rect = function () {
        sel_buffer.update (rectv (start, end), 0);
        engine.dirty = true;
    };
    engine.canvas.bind ('mousedown', function (event) {
        if (!enabled)
            return;
        dragging = true;
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
        engine.dirty = true;
    });

    $(document).bind ('click', function (event) {
        if (!enabled)
            return;
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
    };
    
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
var RangeNode = function (elem, start, end, current) {
    this.data = elem[current];
    this.left = null;
    this.right = null;
    if (start != current)
        this.left = new RangeNode (elem, start, current - 1, parseInt ((start + (current - 1)) / 2, 10));
    if (end != current)
        this.right = new RangeNode (elem, current + 1, end, parseInt ((end + (current + 1)) / 2, 10));
    this.subtree = [];
    for (var i = start; i <= end; i ++) {
        this.subtree.push (elem[i]);
    }
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
        }
        if (box.y_in (this.subtree[current]))
            result.push (this.subtree[current]);
        if (box.y_left (this.subtree[current])){
            if (current != end)
                this.subquery (result, box, current + 1, end, parseInt ((end + (current + 1)) / 2, 10));
        }
        else if (box.x_right (this.subtree[current])) {
            if (current != start)
                this.subquery (result, box, start, current - 1, parseInt ((start + (current - 1)) / 2, 10));
        }
        else {
            if (current != end)
                this.subquery (result, box, current + 1, end, parseInt ((end + (current + 1)) / 2, 10));
            if (current != start)
                this.subquery (result, box, start, current - 1, parseInt ((start + (current - 1)) / 2, 10));
        }
    };
    
    this.search = function (result, box) {
        if (xrange (box)) {
            this.subquery (result, box, 0, this.subtree.length - 1, parseInt ((this.subtree.length - 1) / 2, 10));
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
var RangeTree = function (elem) {
    elem.sort (function (a, b) {
        return a.x - b.x;
    });
    if (elem.length > 0)
        this.root = new RangeNode (elem, 0, elem.length - 1, parseInt ((elem.length - 1) / 2, 10));
    else
        this.root = null;

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

var EARTH = 6378.1;

var new_feature_id = (function () {
    var current_id = 1;
    return function () {
        var id = current_id;
        current_id ++;
        return id;
    };
}) ();

var rand_map = (function () {
    var factor = 1e-6;
    var xmap = {};
    var ymap = {};
    return function (x, y) {
        // Temporary Fix
        return new vect (x + Math.random () * factor - (factor / 2), y + Math.random () * factor - (factor / 2));
        // End Temp
        /*var key = x.toString () + ',' + y.toString ();
        if (!(key in xmap)) {
            xmap[key] = x + Math.random () * factor - (factor / 2);
            ymap[key] = y + Math.random () * factor - (factor / 2);
        }
        return new vect (xmap[key], ymap[key]);*/
    };
}) ();
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
var Polygon = function (prop, layer) {
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

var PolygonCollection = function (polygons) {
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
var linestring_bounds = function (geom) {
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

var Line = function (prop, layer) {
    Feature.call (this, prop, layer);

    this.bounds = linestring_bounds (this.geom);

    this.map_contains = function (engine, p) {
        return false;
    }
};

var LineCollection = function (lines) {
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
var geom_types = {
    'Point': Point,
    'Polygon': Polygon,
    'Line': Line
};

var Layer = function (options) {
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
        for (var key in options.style) {
            StyleManager.setStyle(this, null, key, options.style[key]);
        }
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
        }

        return f;
    };

    // User defined event handler functions
    //var over_func = null, out_func = null;
    this.mouseover = function (func) {
        EventManager.addEventHandler (this, 'mouseover', func);
    };

    this.mouseout = function (func) {
        EventManager.addEventHandler (this, 'mouseout', func);
    };
};
var grid_shader = null;

var Grid = function (options) {
    var engine;
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

    var buffers, tex;

    var min = new vect (lower.x, lower.y);
    var max = new vect (upper.x, upper.y);
    
    var tmin = new vect (0, 0);
    var tmax = new vect (1, 1);

    var dirty = false;
    var write_color = function (i, c) {
        //var c = options.ramp[j];
        tex_data[i * 4] = parseInt (c.r * 255, 10);
        tex_data[i * 4 + 1] = parseInt (c.g * 255, 10);
        tex_data[i * 4 + 2] = parseInt (c.b * 255, 10);
        tex_data[i * 4 + 3] = parseInt (c.a * 255, 10);
    };

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
        var points = [];
        for (var i = 0; i < data.length; i ++) {
            points.push (data[i]);
        }
        points.sort (sort);
        var quantiles = [-Infinity];
        for (var i = 1; i < size; i ++) {
            var b = parseInt (inc * i, 10);
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
        if (engine)
            engine.dirty = true;
    };

    this.raw_set = function (k, val) {
        if (k >= rows * cols)
            throw "Index Out of Bounds: " + k;
        data[k] = val;
        dirty = true;
        if (engine)
            engine.dirty = true;
    };

    this.clear = function (val) {
        for (var i = 0; i < rows * cols; i ++) {
            data[i] = val;
        }
    };
    
    var initialized = false;
    this.initialize = function (_engine) {
        engine = _engine;
        var gl = engine.gl;

        if (!grid_shader) {
            grid_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/grid');
        }
        buffers = new Buffers (engine, 6);
        buffers.create ('vert', 2);
        buffers.create ('screen', 2);
        buffers.create ('tex', 2);
        
        var start = buffers.alloc (6);
        
        buffers.write ('vert', rectv (min, max), start, 6);
        buffers.write ('screen', rectv (new vect (-1, -1), new vect (1, 1)), start, 6);
        buffers.write ('tex', rectv (tmin, tmax), start, 6);
        
        tex = gl.createTexture ();
        gl.bindTexture (gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);  
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);  
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture (gl.TEXTURE_2D, null);
        
        initialized = true;
    };

    var framebuffer = null;

    this.draw = function (engine, dt) {
        var gl = engine.gl;
        if (!initialized)
            this.initialize(engine);
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
    };
};
var raster_shader = null;
var Raster = function (url, min, max) {
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
var OMEGA = Math.PI / 4;

var hillshade_shader = null;
var Hillshade = function (data) {

    var bounds = $ (data).find ('LatLonBox');
    var min = new vect (parseFloat (bounds.find ('west').text ()), parseFloat (bounds.find ('south').text ()));
    var max = new vect (parseFloat (bounds.find ('east').text ()), parseFloat (bounds.find ('north').text ()));
    var url = $ (data).find ('GroundOverlay Icon href').text ();
    //var min = data.min;
    //var max = data.max;
    //var url = data.url;
    var ready = false;
    var image;

    this.ready = function () {
        return ready;
    };

    var tex_buffer, pos_buffer;

    var azimuth = 315.0;

    var initialized = false;
    this.initialize = function (engine) {
        if (!hillshade_shader)
            hillshade_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/hillshade');
        tex_buffer = staticBuffer (engine.gl, rectv (new vect (0, 1), new vect (1, 0)), 2);
        pos_buffer = staticBuffer (engine.gl, rectv (min, max), 2);
        image = getTexture (engine.gl, url, function () {
            ready = true;
        });

        initialized = true;
    };

    this.draw = function (engine, dt) {
        var gl = engine.gl;
        if (!initialized)
            this.initialize(engine);
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
var elevation_shader = null;
var Elevation = function (data) {
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
var TIMEOUT = 1000;

var z_base = 0;

var NUM_TILES = 8;

var total_drawn = 0;
var total_calls = 0;

var MultiTileLayer = function (options) {
    var tile_shader = null;

    var layers = [];
    var available = [];

    var engine = null;
    var gl = null;

    this.id = new_feature_id ();

    var TileLayer = function (options) {
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
        /*if (!options.available) {
          options.available = [];
          for (var i = 0; i < 8; i ++)
          options.available.push (new Texture (gl));
          }*/

        /*var gl = null;
          var change_context = function (_engine) {
          engine = _engine;
          gl = engine.gl;
          };*/
        
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
        };

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
                max_row: max_row
            };
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
                    tiles[i][j].tex = new Texture (engine);
                getImage (path, (function (tile) {
                    return function (img) {
                        if (tile.tex) {
                            tile.tex.image (img);
                            tile.ready = true;
                        }
                    };
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

            //change_context (engine);
            initialized = true;
        };

        this.draw = function (engine, dt, buffers, count, flush) {
            //gl = engine.gl;

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
                        if (tiles[i][j].tex === null)
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
    this.initialize = function (_engine) {
        engine = _engine;
        if (!tile_shader)
            tile_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/tile');

        gl = engine.gl;

        buffers = new Buffers (engine, NUM_TILES * 6);
        buffers.create ('vert', 3);
        buffers.create ('tex', 2);
        buffers.create ('lookup', 1);
        buffers.alloc (NUM_TILES * 6);

        for (var i = 0; i < 25; i ++) {
            available.push (new Texture (engine));
        }

        for (var i = 0; i < layers.length; i ++) {
            layers[i].initialize (engine);
        }

        layers[0].fetch_all ();
        layers[0].noexpire (true);
        
        initialized = true;
    };

    this.draw = function (engine, dt) {
        if (!initialized)
            this.initialize (engine);
        
        gl.useProgram (tile_shader);
        tile_shader.data ('screen', engine.camera.mat3);

        total_drawn = 0;
        total_calls = 0;
        var min = Infinity;
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
                count = layers[i].draw (engine, dt, buffers, count, i === 0);
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
var WMS = function (options) {
    var settings = copy (options);
    require (settings, ['url', 'layer']);
    default_model (settings, {
	levels: 16,
	size: 256
    });
    force_model (settings, {
	source: 'wms'
    });

    var layer = new MultiTileLayer (settings);
    return layer;
};
var GeoJSON = function (data, options) {
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
};
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
        bounds: new Box (vect (xmin, ymin), vect (xmax, ymax))
    };
};

var load_shx = function (data) {
    var indices = [];
    var append_index = function (offset) {
        indices.push (2 * bint32 (data, offset));
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
                    $.ajax ({
                        url: path + '.dbf',
                        mimeType: 'text/plain; charset=x-user-defined',
                        success: function (dbf_data) {
                            var layer = load_shp (data, dbf_data, indices, options);
                            options.success (layer);
                        }
                    });
                }
            });
        }
    });
};

var load_dbf = function (data) {
    var read_header = function (offset) {
        var name = str (data, offset, 10);
        var type = str (data, offset + 11, 1);
        var length = int8 (data, offset + 16);
        return {
            name: name,
            type: type,
            length: length
        };
    };

    // Level of the dBASE file
    var level = int8 (data, 0);

    if (level == 4)
        throw "Level 7 dBASE not supported";

    // Date of last update
    var year = int8 (data, 1);
    var month = int8 (data, 2);
    var day = int8 (data, 3);

    var num_entries = lint32 (data, 4);

    var header_size = lint16 (data, 8);
    var record_size = lint16 (data, 10);

    var FIELDS_START = 32;
    var HEADER_LENGTH = 32;
    
    var header_offset = FIELDS_START;
    var headers = [];
    while (header_offset < header_size - 1) {
        headers.push (read_header (header_offset));
        header_offset += HEADER_LENGTH;
    }

    var records = [];
    var record_offset = header_size;
    while (record_offset < header_size + num_entries * record_size) {
        var declare = str (data, record_offset, 1);
        if (declare == '*') {
            // Record size in the header include the size of the delete indicator
            record_offset += record_size;
        }
        else {
            // Move offset to the start of the actual data
            record_offset ++;
            var record = {};
            for (var i = 0; i < headers.length; i ++) {
                var header = headers[i];
                var value;
                if (header.type == 'C') {
                    value = str (data, record_offset, header.length).trim ();
                }
                else if (header.type == 'N') {
                    value = parseFloat (str (data, record_offset, header.length));
                }
                record_offset += header.length;
                record[header.name] = value;
            }
            records.push (record);
        }
    }
    return records;
};

var load_shp = function (data, dbf_data, indices, options) {
    var features = [];

    var read_ring = function (offset, start, end) {
        var ring = [];
        for (var i = end - 1; i >= start; i --) {
            var x = ldbl64 (data, offset + 16 * i);
            var y = ldbl64 (data, offset + 16 * i + 8);
            ring.push ([x, y]);
        }
        //if (ring.length <= 3)
        //    return [];
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
            
            features.push ({
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

            var rings = [];
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
            features.push ({
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

    var attr = load_dbf (dbf_data);

    //var offset = 100;
    //while (offset < length * 2) {
    //    offset = read_record (offset);
    //}
    for (var i = 0; i < indices.length; i ++) {
        var offset = indices[i];
        read_record (offset);
    }

    var layer = new Layer ();

    for (var i = 0; i < features.length; i ++) {
        var feature = features[i];
        feature.attr = attr[i];
        layer.append (feature);
    }

    return layer;
};
var AsciiGrid = function (data, options) {
    var vals = data.split ('\n');
    var meta = vals.splice (0, 6);
    var cols = parseInt (meta[0].slice (5).trim(), 10);
    var rows = parseInt (meta[1].slice (5).trim(), 10);
    var xllcorner = parseFloat (meta[2].slice (9).trim());
    var yllcorner = parseFloat (meta[3].slice (9).trim());
    var cellsize =  parseFloat (meta[4].slice (8).trim());
    var nodata_value = meta[5].slice (12).trim();
    var max_val = -Infinity;
    var min_val = Infinity;

    var index = function (i, j) {
        return cols * i + j;
    };

    var settings = {};
    for (var key in options)
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
};
var SparseGrid = function (data, options) {
    var xmin = lfloat32 (data, 0);
    var ymin = lfloat32 (data, 4);

    var cols = lint32 (data, 8);
    var rows = lint32 (data, 12);
    var cellsize = lfloat32 (data, 16);

    var records_start = 20;

    var settings = {};
    for (var key in options)
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
};
var KML = function (data) {
    var bounds = $ (data).find ('LatLonBox');
    var min = new vect (parseFloat (bounds.find ('west').text ()), parseFloat (bounds.find ('south').text ()));
    var max = new vect (parseFloat (bounds.find ('east').text ()), parseFloat (bounds.find ('north').text ()));
    var url = $ (data).find ('GroundOverlay Icon href').text ();
    return new Raster (BASE_DIR + url, min, max);
};
var ready_queue = [];

window.wiggle = {
    Map: Map,
    TimeSeries: TimeSeries,
    layer: {
        Layer: Layer,
        Grid: Grid,
        Hillshade: Hillshade,
        Elevation: Elevation,
        Raster: Raster
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
