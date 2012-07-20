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
    
    $.csv = function(data, options) {  
	var settings = $.extend ({
	    delim: ',',
	    header: true,
	    key: null
	}, options);

	data = data.replace (/\r/g, '');
	var rows = data.split ('\n');
	for (var i = 0; i < rows.length; i ++) {
	    rows[i] = rows[i].split (settings.delim);
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