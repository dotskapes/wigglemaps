
if (jade.templates === undefined) jade.templates = {};
;jade.templates['slider'] = function anonymous(locals, attrs, escape, rethrow, merge) {
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
        }).on('change:attr', function () {
            slider.changeLabel();
        });

        this.render();
    },
    className: 'slider',
    events: {
        'mousedown .bar': 'startDrag',
        'mousedown .play': 'togglePlay'
    },
    render: function() {
        this.$el.html(jade.templates.slider ({
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
        var p = vect(event.pageX, event.pageY);
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
        var left = this.model.get('pos') * (this.$bar.parent().width() - this.$bar.width());
        this.$bar.css('left', left);
    },
    togglePlay: function() {
        this.model.set('playing', !this.model.get('playing'));
    },
    interval: null,
    toggleAnimation: function() {
        var slider = this;
        var playing = this.model.get('playing');
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
