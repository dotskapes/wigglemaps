var EXTENTS = 180.0;

function Camera (canvas) {
    this.mat3 = new Float32Array (9);
    //this.mat3[0] = 2.0 / canvas.width ();
    //this.mat3[5] = 2.0 / canvas.height ();
    var ratio = canvas.width () / canvas.height (); 
    this.mat3[0] = 2.0 / EXTENTS;
    this.mat3[4] = ratio * 2.0 / EXTENTS;
    this.mat3[8] = 1.0;
    
    this.mat3[6] = 0.0;
    this.mat3[7] = 0.0;
    
    this.level = 1.0;
    
    this.project = function (v) {
	var c = new vect (
            2.0 * (v.x - canvas.position ().left) / canvas.width () - 1.0,
		-(2.0 * (v.y - canvas.position ().top) / canvas.height () - 1.0));
        c.x = c.x / this.mat3[0] - this.mat3[6] / this.mat3[0];
        c.y = c.y / this.mat3[4] - this.mat3[7] / this.mat3[4];
	return c;
    };
    
    this.screen = function (v) {
        var c = new vect (
	    v.x * this.mat3[0] + this.mat3[6],
            v.y * this.mat3[4] + this.mat3[7]);
        c.x = canvas.position ().left + canvas.width () * (c.x + 1.0) / 2.0;
        c.y = canvas.position ().top + canvas.height () * (-c.y + 1.0) / 2.0;
        return c;
    };

    this.percent = function (v) {
	return new vect (
	    2 * ((v.x - canvas.position ().left) / canvas.width ()) - 1,
	    -(2 * ((v.y - canvas.position ().top) / canvas.height ()) - 1));
    };

    this.pixel = function (v) {
	return new vect (canvas.position ().left + ((v.x + 1) / 2) * canvas.width (),
			 canvas.position ().top + ((-v.y + 1) / 2) * canvas.height ());
    };
    
    this.move = function (v) {
        this.mat3[6] -= v.x * this.mat3[0];
        this.mat3[7] -= v.y * this.mat3[4];
    };
    
    this.position = function (v) {
	if (!v) {
	    return new vect (-this.mat3[6] / this.mat3[0], -this.mat3[7] / this.mat3[4]);
	}
        this.mat3[6] = -v.x * this.mat3[0];
        this.mat3[7] = -v.y * this.mat3[4];		
    };
    
    this.zoom = function (scale) {
	var pos = new vect (this.mat3[6] / this.mat3[0], this.mat3[7] / this.mat3[4]);
	this.mat3[0] *= scale;
	this.mat3[4] *= scale;
	this.mat3[6] = pos.x * this.mat3[0];
	this.mat3[7] = pos.y * this.mat3[4];
	this.level *= scale;
    };
    
    this.reset = function () {
	this.zoom (1.0 / this.level);
    };

    this.reconfigure = function () {
	var p = this.position ();
	this.mat3[4] /= ratio;
	ratio = canvas.width () / canvas.height (); 
	this.mat3[4] *= ratio;
	this.position (p);
    };
};