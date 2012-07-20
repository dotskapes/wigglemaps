var LayerSelector = function (elem) {

    var lookup = null;

    this.length = elem.length;

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
};