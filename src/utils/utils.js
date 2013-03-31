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
