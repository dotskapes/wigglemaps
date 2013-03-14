
jade = (function(exports){
/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Lame Array.isArray() polyfill for now.
 */

if (!Array.isArray) {
  Array.isArray = function(arr){
    return '[object Array]' == Object.prototype.toString.call(arr);
  };
}

/**
 * Lame Object.keys() polyfill for now.
 */

if (!Object.keys) {
  Object.keys = function(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  }
}

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    ac = ac.filter(nulls);
    bc = bc.filter(nulls);
    a['class'] = ac.concat(bc).join(' ');
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function nulls(val) {
  return val != null;
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj, escaped){
  var buf = []
    , terse = obj.terse;

  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;

  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if (0 == key.indexOf('data') && 'string' != typeof val) {
        buf.push(key + "='" + JSON.stringify(val) + "'");
      } else if ('class' == key && Array.isArray(val)) {
        buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
      } else if (escaped && escaped[key]) {
        buf.push(key + '="' + exports.escape(val) + '"');
      } else {
        buf.push(key + '="' + val + '"');
      }
    }
  }

  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&(?!(\w+|\#\d+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno){
  if (!filename) throw err;

  var context = 3
    , str = require('fs').readFileSync(filename, 'utf8')
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

  return exports;

})({});
jade.templates = {};
jade.templates['slider'] = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var __jade = [{ lineno: 1, filename: undefined }];
try {
var buf = [];
with (locals || {}) {
var interp;
__jade.unshift({ lineno: 1, filename: __jade[0].filename });
__jade.unshift({ lineno: 1, filename: __jade[0].filename });
buf.push('<div class="exterior">');
__jade.unshift({ lineno: undefined, filename: __jade[0].filename });
__jade.unshift({ lineno: 2, filename: __jade[0].filename });
buf.push('<div class="play cell">');
var __val__ = "Play"
buf.push(escape(null == __val__ ? "" : __val__));
__jade.unshift({ lineno: undefined, filename: __jade[0].filename });
__jade.shift();
buf.push('</div>');
__jade.shift();
__jade.unshift({ lineno: 3, filename: __jade[0].filename });
buf.push('<div class="slide cell">');
__jade.unshift({ lineno: undefined, filename: __jade[0].filename });
__jade.unshift({ lineno: 4, filename: __jade[0].filename });
buf.push('<div class="bar">');
__jade.unshift({ lineno: undefined, filename: __jade[0].filename });
__jade.shift();
buf.push('</div>');
__jade.shift();
__jade.shift();
buf.push('</div>');
__jade.shift();
__jade.unshift({ lineno: 5, filename: __jade[0].filename });
buf.push('<div class="step cell">');
var __val__ = step
buf.push(escape(null == __val__ ? "" : __val__));
__jade.unshift({ lineno: undefined, filename: __jade[0].filename });
__jade.shift();
buf.push('</div>');
__jade.shift();
__jade.shift();
buf.push('</div>');
__jade.shift();
__jade.shift();
}
return buf.join("");
} catch (err) {
  rethrow(err, __jade[0].filename, __jade[0].lineno);
}
};
var PI = 3.14159265;

var Mouse = {
    x: 0,
    y: 0
};

$ (document).mousemove (function (event) {
    Mouse.x = event.clientX;
    Mouse.y = event.clientY;
    Mouse.lastMove = new Date ().getTime ();
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
    for (var key in src)
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
    for (var key in src)
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
(function () {
    'use strict';
    var BASE_DIR = '';


var SliderModel = Backbone.Model.extend({
    initialize: function() {
        this.on('change:pos', function() {
            this.set('index', this.pos2Index());
        });
    },
    defaults: {
        attr: [],
        index: 0,
        offset: 0,
        playing: false,
        pos: 0,
        dragging: false
    },
    pos2Index: function() {
        var pos = this.get('pos');
        var units = this.get('attr').length;
        return Math.round(pos * (units - 1));
    }
});

var Slider = Backbone.View.extend({
    initialize: function(options) {
        var slider = this;

        this.model = new SliderModel(options);

        $ (window).on('mouseup', function() {
            slider.stopDrag();
        }).on('mousemove', function(event) {
            slider.doDrag(vect(event.pageX, event.pageY));
        });

        this.model.on('change:playing', function() {
            slider.toggleAnimation();
        }).on('change:pos', function() {
            slider.moveBar();
        }).on('change:index', function() {
            slider.changeLabel();
        });

        this.render();
    },
    className: 'slider',
    events: {
        'mousedown .bar': 'startDrag',
        'mousedown .play': 'togglePlay',
    },
    render: function() {
        this.$el.html(jade.templates['slider'] ({
            step: this.model.get('attr')[0]
        }));
        this.$bar = this.$el.find('.bar');
        return this;
    },
    change: function(callback) {
        var slider = this;
        this.model.on('change:index', function() {
            var index = this.get('index');
            callback(index);
        });
    },
    changeLabel: function() {
        var index = this.model.get('index');
        this.$el.find('.step').text(this.model.get('attr')[index]);
    },
    startDrag: function(event) {
        var p = vect(event.pageX, event.pageY)
        this.model.set('dragging', true);
        var offset = p.x - this.$bar.offset().left;
        this.model.set('offset', offset);
    },
    stopDrag: function() {
        this.model.set('dragging', false);
        var units = this.model.get('attr').length - 1;
    },
    doDrag: function(p) {
        if(this.model.get('dragging')) {
            var left = clamp(p.x - this.$bar.parent().offset().left - this.model.get('offset'), 0, this.$bar.parent().width() - this.$bar.width());
            this.model.set('pos', left / (this.$bar.parent().width() - this.$bar.width()));
        }
    },
    moveBar: function() {
        var left = this.model.get('pos') * (this.$bar.parent().width() - this.$bar.width())
        this.$bar.css('left', left);
    },
    togglePlay: function() {
        this.model.set('playing', !this.model.get('playing'));
    },
    interval: null,
    toggleAnimation: function() {
        var slider = this;
        var playing = this.model.get('playing');
        var bar = this.$el.find('.bar');
        if (playing) {
            this.$el.find('.play').text('Pause');
            this.interval = setInterval(function() {
                if (!slider.model.get('dragging')) {
                    var pos = slider.model.get('pos');
                    var newPos = pos + 1.0 / (slider.model.get('attr').length * 25);
                    if (newPos >= 1.0)
                        newPos -= 1;
                    slider.model.set('pos', newPos);
                }
            }, 40);
        }
        else {
            this.$el.find('.play').text('Play');
            clearInterval(this.interval);
        }
            
    }
});
wiggle.widget = {
    Slider: Slider
};
} ());
