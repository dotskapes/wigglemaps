var StyleManager = new function () {
    // The structure of style lookup is: Engine ids, then feature and layer ids
    // Layers and features coexist on the same level. The cascade is looked up
    // at runtime
    //
    // 'default' is used for feature's styles specified sans Engine
    // Engine's define their own default styles, which they must will registered the
    // first time that Engine is seen
    this.styles = {};

    this.derivedStyle = function (feature, layer, engine, key) {
        // It makes no sense to talk about the derived style without an engine
        if (!engine)
            throw "Undefined operation";
        var value;
        // First precxidence is an engine's feature style
        value = this.getStyle (feature, engine, key);
        // Second is an orphaned feature style
        if (value === null) {
            value = this.getStyle (feature, null, key);
            // Third is ane engine's layer style
            if (value === null) {
                value = this.getStyle (layer, engine, key);                
                // Fourth is an  orphaned layer style
                if (value === null) {
                    value = this.getStyle (layer, engine, key);     
                    // Fifth is the engine type default
                    if (value === null) {
                        value = engine.defaultStyle (feature.type, key);
                    }
                }
            }
        }
        return value;
    };

    /*var callbacks = {};
    this.registerCallback = function (engine, object, func) {
        if (!callbacks[engine.id])
            callbacks[engine.id] = {};
        callbacks[engine.id][object.id] = func;
    };*/

    var lookupEngine = function (engine) {
        if (!engine) { 
            return 'default';
        }
        else {
            return engine.id;
        }
    }

    var initializeStyle = function (object, engine) {
        var engine_id = lookupEngine (engine);
        if (!(engine_id in StyleManager.styles))
            StyleManager.styles[engine_id] = {};
        if (!(object.id in StyleManager.styles[engine_id]))
            StyleManager.styles[engine_id][object.id] = {};
    };

    // object is a layer or feature
    this.getStyle = function (object, engine, key) {
        initializeStyle (object, engine);
        var value;
        var engine_id = lookupEngine (engine);
        value = this.styles[engine_id][object.id][key];
        if (value === undefined)
            return null;
        else
            return value;
    };

    // object is a layer or feature
    this.setStyle = function (object, engine, key, value) {
        initializeStyle (object, engine);
        var engine_id = lookupEngine (engine);
        this.styles[engine_id][object.id][key] = value;
        EventManager.trigger (object, 'style', [object, key]);
        /*if (engine) {
            if (callbacks[engine.id]) {
                if (callbacks[engine.id][object.id]) {
                    callbacks[engine.id][object.id] (object, key);
                }
            }
        }
        else {
            $.each (callbacks, function (engine_id, ob_callback) {
                if (ob_callback[object.id]) {
                    ob_callback[object.id] (object, key);
                }
            });
        }*/
    };

} ();



/*
// Cascading style lookup
function derived_style (engine, feature, layer, key) {
    var value = feature.style (engine, key); 
    if (value === null) {
        value = layer.style (engine, key);
        if (value === null) {
            value = default_style[feature.type][key];
        }
    }
    return value;
};*/

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
