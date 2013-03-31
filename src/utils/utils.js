var PI = 3.14159265;

var make_url = function (base, vars) {
    var items = [];
    for (var key in vars) {
        items.push (key + '=' + vars[key]);
    }
    return base + '?' + items.join ('&');
};

var default_model = function (options, model) {
    for (var key in model) {
        if (!(key in options))
            options[key] = model[key];
    }
};

var force_model = function (options, model) {
    for (var key in model) {
        options[key] = model[key];
    }
};

var copy = function (src) {
    var dst = {};
    for (var key in src)
        dst[key] = src[key];
    return dst;
};

var require = function (src, fields) {
    for (var i = 0; i < fields.length; i ++) {
        var key = fields[i];
        if (!(key in src))
            throw "Key " + key + " not found";
    }
};

var copy_to = function (dst, src) {
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

var isQuoted = function (value) {
    var c = value[0];
    if (c == '"' || c == "'") {
        if (value[value.length - 1] == c)
            return true;
    }
    return false;
};

var isRGB = function (value) {
    if (value.match (/^rgb\(\d+,\d+,\d+\)$/))
        return true;
    else
        return false;
};

var isFloat = function (value) {
    if (value.match (/^(\+|\-)?\d*\.\d*$/) && value.length > 1)
        return true;
    else if (value.match (/^(\+|\-)?\d*\.\d*e(\+|\-)?\d+$/) && value.length > 1)
        return true;
    else
        return false;
};

var isInt = function (value) {
    if (value.length == 1)
        return value.match (/^\d$/);
    else {
        return value.match (/^(\+|\-)?\d+$/);
    }
};

var str_contains = function (string, c) {
    return string.indexOf (c) != -1;
};
