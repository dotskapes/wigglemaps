function Grid (lower, upper, rows, cols) {
    var xres = (upper.x - lower.x) / cols;
    var yres = (upper.y - lower.y) / rows;

    var data = [];
    for (var i = 0; i < rows * cols; i ++) {
	data.push (0);
    }

    var index = function (i, j) {
	return cols * i + j;
    };

    this.lower = function () {
	return lower.clone ();
    };

    this.upper = function () {
	return upper.clone ();
    };

    this.rows = function () {
	return rows;
    };

    this.cols = function () {
	return cols;
    };
    
    this.centroid = function (i, j) {
	return new vect (lower.x + xres * j, lower.y + yres * i);
    };

    this.get = function (i, j) {
	return data[index (i, j)];
    };

    this.set = function (i, j, val) {
	data[index (i, j)] = val;
    };
};