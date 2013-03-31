var PI = 3.14159265;

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

function str_contains (string, c) {
    return string.indexOf (c) != -1;
};
