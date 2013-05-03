var AsciiGrid = function (data, options) {
    var vals = data.split ('\n');
    var meta = vals.splice (0, 6);
    var cols = parseInt (meta[0].slice (5).trim(), 10);
    var rows = parseInt (meta[1].slice (5).trim(), 10);
    var xllcorner = parseFloat (meta[2].slice (9).trim());
    var yllcorner = parseFloat (meta[3].slice (9).trim());
    var cellsize =  parseFloat (meta[4].slice (8).trim());
    var nodata_value = meta[5].slice (12).trim();
    var max_val = -Infinity;
    var min_val = Infinity;

    var index = function (i, j) {
        return cols * i + j;
    };

    var settings = {};
    for (var key in options)
        settings[key] = options[key];
    settings.lower = new vect (xllcorner, yllcorner);
    settings.upper = new vect (xllcorner + cellsize * cols, yllcorner + cellsize * rows);
    settings.rows = rows;
    settings.cols = cols;
    
    var grid = new Grid (settings);

    for (var i = 0; i < rows; i ++) {
        var r = vals[i].split (' ');
        for (var j = 0; j < cols; j ++) {
            if (r[j] == nodata_value) {
                grid.set (rows - 1 - i, j, NaN);
            }
            else {
                grid.set (rows - 1 - i, j, parseFloat (r[j]));
            }
        }
    }
    return grid;
};
