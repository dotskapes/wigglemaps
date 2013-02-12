function SparseGrid (data, options) {
    var xmin = lfloat32 (data, 0);
    var ymin = lfloat32 (data, 4);

    var cols = lint32 (data, 8);
    var rows = lint32 (data, 12);
    var cellsize = lfloat32 (data, 16);

    var records_start = 20;

    var settings = {};
    for (key in options)
	settings[key] = options[key];
    settings.lower = new vect (xmin, ymin);
    settings.upper = new vect (xmin + cellsize * cols, ymin + cellsize * rows);
    settings.rows = rows;
    settings.cols = cols;

    var grid = new Grid (settings);

    var read_cells = function (start, index, count) {
	for (var i = 0; i < count; i ++) {
	    var val = lfloat32 (data, start + i * 4);
	    grid.raw_set (index + i, val);
	}
    };
    
    var offset = records_start;
    while (offset < data.length) {
	var index = lint32 (data, offset);
	var count = lint32 (data, offset + 4);
	read_cells (offset + 4, index, count);
	offset += 8 + count * 4;
    }
    
    return grid;
};