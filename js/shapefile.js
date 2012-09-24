var SHP_HEADER_LEN = 8;

var SHP_NULL = 0;
var SHP_POINT = 1;
var SHP_POLYGON = 5;

function Shapefile (data, options) {
    var points = [];
    var polys = [];

    var read_ring = function (offset, start, end) {
	var ring = [];
	for (var i = end - 1; i >= start; i --) {
	    var x = ldbl64 (data, offset + 16 * i);
	    var y = ldbl64 (data, offset + 16 * i + 8);
	    ring.push ([x, y]);
	}
	return ring;
    };

    var read_record = function (offset) {
	var index = bint32 (data, offset);
	var record_length = bint32 (data, offset + 4);

	var record_offset = offset + 8;

	var geom_type = lint32 (data, record_offset);
	if (geom_type == SHP_NULL) {
	    console.log ("NULL Shape");
	    return offset + 12;
	}
	else if (geom_type == SHP_POINT) {
	    var x = ldbl64 (data, record_offset + 4);
	    var y = ldbl64 (data, record_offset + 12);
	    
	    points.push ({
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
		attr: {},
		geom: [rings]
	    });
	}
	else {
	    throw "Not Implemented: " + geom_type;
	}
	return offset + 2 * record_length + SHP_HEADER_LEN;
    };
    
    var code = bint32 (data, 0);
    var length = bint32 (data, 24);
    var version = lint32 (data, 28);
    var shapetype = lint32 (data, 32);
    console.log ('meta', length, version, shapetype);

    var xmin = ldbl64 (data, 36);
    var ymin = ldbl64 (data, 44);
    var xmax = ldbl64 (data, 52);
    var ymax = ldbl64 (data, 60);
    console.log ('bounds', xmin, ymin, xmax, ymax);

    var offset = 100;
    while (offset < length * 2) {
	offset = read_record (offset);
    }

    if (points.length > 0) {
	console.log (points);
	var p_layer = new PointLayer (points.length);
	$.each (points, function (i, v) {
	    p_layer.append (v);
	});
	return p_layer;
    }
    else if (polys.length > 0) {
	var p_layer = new PolygonLayer (options);
	$.each (polys, function (i, v) {
	    var count = 0;
	    while (count < 100) {
		try {
		    p_layer.append (v);
		    count = 101;
		} catch (e) {
		    count ++;
		}
	    }
	    if (count == 100)
		console.log ('rendering polygon failed')
	});
	return p_layer;	
    }
};