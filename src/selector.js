var LayerSelector = function (elem) {

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
