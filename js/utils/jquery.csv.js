(function ($){
    function isQuoted (value) {
	var char = value[0];
	if (char == '"' || char == "'") {
	    if (value[value.length - 1] == char)
		return true;
	}
	return false
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

    function replace_quotes (string) {
	var i = 0;
	var repl = {};
	while (true) {
	    var m = string.match (/\"[^\"]+\"/);
	    if (m) {
		repl['_quote' + i] = m[0]
		string = string.replace (/\"[^\"]*\"/, "_quote" + i);
	    }
	    else {
		return {
		    string: string,
		    repl: repl
		};
	    }
	    i ++;
	}
    };

    function unreplace_quotes (array, repl) {
	for (var i = 0; i < array.length; i ++) {
	    if (array[i] in repl)
		array[i] = repl[array[i]];
	}
	return array;
    };
    
    $.csv = function(data, options) {  
	var settings = $.extend ({
	    delim: ',',
	    header: true,
	    key: null
	}, options);

	data = data.replace (/\r/g, '');
	var rows = data.split ('\n');
	if (rows[rows.length - 1].length == 0)
	    rows.splice (rows.length - 1);
	for (var i = 0; i < rows.length; i ++) {
	    var repl = replace_quotes (rows[i]);
	    rows[i] = repl.string;
	    rows[i] = rows[i].split (settings.delim);
	    rows[i] = unreplace_quotes (rows[i], repl.repl);
	    for (var j = 0; j < rows[i].length; j ++) {
		var value = rows[i][j]
		if (isQuoted (value)) {
		    rows[i][j] = value.slice (1, value.length - 1);
		}
		else if (isFloat (value)) {
		    rows[i][j] = parseFloat (value);
		}
		else if (isInt (value)) {
		    rows[i][j] = parseInt (value);
		}
	    }
	}
	if (settings.header) {
	    var header = rows.splice (0, 1)[0];
	    $.each (rows, function (i, row) {
		var item = {};
		$.each (header, function (j, key) {
		    item[key] = row[j];
		});
		rows[i] = item;
	    });
	};
	if (settings.key) {
	    var results = {};
	    $.each (rows, function (i, row) {
		results[row[settings.key]] = row;
	    });
	    rows = results;
	}
	return rows
    };
}) (jQuery);