function EventManager (engine) {
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
    var set_id_color = function (layer, feature, array) {
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
	return key;
    };

    this.register = function (layer, elements, id_array) {
	for (var i = 0; i < elements.length; i ++) {
	    var f = elements[i];
	    var key = set_id_color (layer, f, id_array);
	    callers[key] = layer;
	    features[key] = f;
	}
	for (key in events) {
	    events[key][layer.id] = [];
	}
	
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
	console.log (pixel);
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