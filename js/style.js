// Default style properties
var default_style = {
    'fill': new Color (.02, .44, .69, 1),
    'opacity': 1.0,
    'radius': 5.0
};

// Cascading style lookup
function derived_style (feature, layer, key) {
    var value = feature.style (key); 
    if (value === null) {
        value = layer.style (key);
        if (value === null) {
            value = default_style[key];
        }
    }
    return value;
};

// function StyleManager () {
//     var matches = {};

//     var strip_whitespace = function (arg) {
// 	var val = arg.match (/^\s*([^\s]+)\s*$/);
// 	if (!val.length)
// 	    return null;
// 	return val[1];
//     };

//     var is_geometry = function (val) {
// 	return (val == 'polygon' || val == 'point' || val == 'line' || val == '*');
//     };

//     var parse_selector = function (arg) {
// 	var is_id = str_contains (arg, '#');
// 	var is_class = str_contains (arg, '.');
// 	if (is_id && is_class)
// 	    return null;
// 	//if (is_id || is_class) {
// 	var selector_match = arg.match (/^(\w*)([\.\#](\w+))?$/)
// 	if (!selector_match)
// 	    return null;
// 	var sel_type = selector_match[1];
// 	if (!sel_type)
// 	    sel_type = '*';
// 	if (!is_geometry (sel_type))
// 	    return null;
// 	console.log ('found', sel_type);
// 	//var name_match = arg.match (/^(\w*)[\.\#](\w+)/);
// 	var name = selector_match[2];
// 	if (!name)
// 	    name = '*';
// 	return {
// 	    type: sel_type,
// 	    name: name
// 	};
// 	//}
//     };

//     var split_arg = function (arg) {
// 	arg = arg.replace (/\s*([,()])\s*/g, '$1');
// 	var vals = arg.split (' ');
// 	var result = [];
// 	$.each (vals, function (i, v) {
// 	    if (v.length > 0)
// 		result.push (v);
// 	});
// 	return result;
//     };

//     var convert_type = function (name, val) {
// 	var results = [];
// 	$.each (val, function (i, v) {
// 	    if (isRGB (v)) {
// 		results.push (parseRGB (v));
// 	    }
// 	    else if (isInt (v)) {
// 		results.push (parseInt (v));
// 	    }
// 	    else if (isFloat (v)) {
// 		results.push (parseFloat (v));
// 	    }
// 	    else {
// 		results.push (v);
// 	    }
// 	});
// 	return results;
//     };

//     var parse_prop = function (prop, string) {
// 	args = string.split (':');
// 	if (args.length != 2) {
// 	    if (string != ' ' && string != '')
// 		console.log ('Error parsing css string:', string);
// 	    return;
// 	}
// 	var name = strip_whitespace (args[0]);
// 	var val = split_arg (args[1]);
// 	if (!name || !val)
// 	    return;
// 	prop[name] = convert_type (name, val);
//     };

//     $.each (document.styleSheets, function (i, sheet) {
// 	$.each (sheet.rules || sheet.cssRules, function (j, rule) {
// 	    var selector_ob = parse_selector (rule.selectorText);
// 	    if (!selector_ob)
// 		return;
// 	    var prop_raw = rule.style.cssText.split (';')
// 	    console.log (prop_raw);
// 	    var prop = {};
// 	    $.each (prop_raw, function (k, string) {
// 		parse_prop (prop, string);
// 	    });
// 	    if (!(selector_ob.type in matches))
// 		matches[selector_ob.type] = {}
// 	    matches[selector_ob.type][selector_ob.name] = prop;
// 	    //if (!(rule.selectorText in matches))
// 	    //    matches[rule.selectorText] = prop;
// 	    //else
// 	    //    matches.concat (prop)
// 	});
//     });
//     console.log ('css', matches);
//     // var pages = $ ('link[rel="stylesheet"]')
//     var defaults = {};
//     var layers = {};
//     var features = {};
//     this.register = function (feature) {
	
//     };
// };
