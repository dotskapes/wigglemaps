var SLIDER_WIDTH = 20;

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

    var change_event = function (index) {};
    this.change = function (func) {
	change_event = func;
    };

    var release_event = function (index) {};
    this.release = function (func) {
	release_event = func;
    };

    this.dom.append (bar);
    
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