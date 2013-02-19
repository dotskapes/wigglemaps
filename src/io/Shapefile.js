var SHP_HEADER_LEN = 8;

var SHP_NULL = 0;
var SHP_POINT = 1;
var SHP_POLYGON = 5;

var read_header = function (data) {
    var code = bint32 (data, 0);
    var length = bint32 (data, 24);
    var version = lint32 (data, 28);
    var shapetype = lint32 (data, 32);
    
    var xmin = ldbl64 (data, 36);
    var ymin = ldbl64 (data, 44);
    var xmax = ldbl64 (data, 52);
    var ymax = ldbl64 (data, 60);
    return {
	code: code,
	length: length,
	version: version,
	shapetype: shapetype,
	bounds: new Box (new vect (xmin, ymin), new (xmax, ymax))
    }
};

var load_shx = function (data) {
    var indices = [];
    var append_index = function (offset) {
	indices.push (2 * bint32 (data, offset))
	return offset + 8;
    };
    var offset = 100;
    while (offset < data.length) {
	offset = append_index (offset);
    }
    return indices;
};

var Shapefile = function (options) {
    var path = options.path;
    $.ajax ({
	url: path + '.shx',
	mimeType: 'text/plain; charset=x-user-defined',
	success: function (data) {
	    var indices = load_shx (data);

	    $.ajax ({
		url: path + '.shp',
		mimeType: 'text/plain; charset=x-user-defined',
		success: function (data) {
		    var layer = load_shp (data, indices, options);
		    options.success (layer);
		}
	    });
	}
    });
};

var load_shp = function (data, indices, options) {
    var points = [];
    var polys = [];

    var read_ring = function (offset, start, end) {
	var ring = [];
	for (var i = end - 1; i >= start; i --) {
	    var x = ldbl64 (data, offset + 16 * i);
	    var y = ldbl64 (data, offset + 16 * i + 8);
	    ring.push ([x, y]);
	}
        //if (ring.length <= 3)
        //    return [];
	return ring;
    };

    var read_record = function (offset) {
	var index = bint32 (data, offset);
	var record_length = bint32 (data, offset + 4);

	var record_offset = offset + 8;

	var geom_type = lint32 (data, record_offset);

	if (geom_type == SHP_NULL) {
	    console.log ("NULL Shape");
	    //return offset + 12;
	}
	else if (geom_type == SHP_POINT) {
	    var x = ldbl64 (data, record_offset + 4);
	    var y = ldbl64 (data, record_offset + 12);
	    
	    points.push ({
                type: 'Point',
		attr: {},
		geom: [[x, y]]
	    });
	}
	else if (geom_type == SHP_POLYGON) {
	    var num_parts = lint32 (data, record_offset + 36);
	    var num_points = lint32 (data, record_offset + 40);
	    
	    var parts_start = offset + 52;
	    var points_start = offset + 52 + 4 * num_parts;

	    var rings = []
	    for (var i = 0; i < num_parts; i ++) {
		var start = lint32 (data, parts_start + i * 4);
		var end;
		if (i + 1 < num_parts) {
		    end = lint32 (data, parts_start + (i + 1) * 4);
		}
		else {
		    end = num_points;
		}
		var ring = read_ring (points_start, start, end);
		rings.push (ring);
	    }
	    polys.push ({
                type: 'Polygon',
		attr: {},
		geom: [rings]
	    });
	}
	else {
	    throw "Not Implemented: " + geom_type;
	}
	//return offset + 2 * record_length + SHP_HEADER_LEN;
    };

    //var offset = 100;
    //while (offset < length * 2) {
    //    offset = read_record (offset);
    //}
    for (var i = 0; i < indices.length; i ++) {
	var offset = indices[i];
	read_record (offset);
    }

    if (points.length > 0) {
	var layer = new Layer (options);
	$.each (points, function (i, v) {
	    layer.append (v);
	});
	return layer;
    }
    else if (polys.length > 0) {
	var layer = new Layer (options);
	$.each (polys, function (i, v) {
	    layer.append (v);
	});
	return layer;	
    }
};
