function vect (x, y, z) {
    this.x = x;
    this.y = y;
    if (!z)
	this.z = 0.0;
    else
	this.z = z;
    this.add = function (v) {
	this.x += v.x;
	this.y += v.y;
	this.z += v.z;
    };
    this.sub = function (v) {
	this.x -= v.x;
	this.y -= v.y;
	this.z -= v.z;
    };
    this.scale = function (s) {
	this.x *= s;
	this.y *= s;
	this.z *= s;
    };
    this.length = function () {
	return Math.sqrt (this.x * this.x + this.y * this.y + this.z * this.z);
    };
    this.normalize = function () {
	var scale = Math.sqrt (this.x * this.x + this.y * this.y + this.z * this.z);
	if (scale == 0)
	    return;
	this.x /= scale;
	this.y /= scale;
	this.z /= scale;
    };
    this.div = function (v) {
	this.x /= v.x;
	this.y /= v.y;
	this.z /= v.z;
    };
    this.floor = function () {
	this.x = Math.floor (this.x);
	this.y = Math.floor (this.y);
	this.z = Math.floor (this.z);
    };
    this.zero = function () {
	return ((this.x + this.y + this.z) == 0);
    };
    this.dot = function (v) {
	return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
    };
    this.cross = function (v) {
	throw 'Need to reimplement';
	//return (this.x * v.y) - (this.y * v.x);
    };
    this.rotateZ = function (omega) {
	var cos = Math.cos (omega);
	var sin = Math.sin (omega);
	xp = cos * this.x - sin * this.y;
	yp = sin * this.x + cos * this.y;
	this.x = xp;
	this.y = yp;
    };
    this.clone = function () {
        return new vect (this.x, this.y, this.z); 
    };
};

vect.scale = function (v, s) {
    return new vect (v.x * s, v.y * s, v.z * s);
};

vect.add = function (v1, v2) {
    return new vect (v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
};

vect.sub = function (v1, v2) {
    if (!v1 || !v2) {
	throw "Bad Vector";
    }
    return new vect (v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
};

vect.dist = function (v1, v2) {
    var x = v2.x - v1.x;
    var y = v2.y - v1.y;
    var z = v2.z - v1.z;
    return Math.sqrt (x * x + y * y + z * z);
};

vect.dir = function (v1, v2) {
    var v = vect.sub (v1, v2);
    v.normalize ();
    return v;
}
    
vect.dot2d = function (v1, v2) {
    return (v1.x * v2.x) + (v1.y * v2.y);
};

vect.cross = function (v1, v2) {
    return (v1.x * v2.y) - (v1.y * v2.x);
};

vect.left = function (a, b, c, tol) {
    if (!tol)
	tol = 0;
    var v1 = vect.sub (b, a);
    var v2 = vect.sub (c, a);
    return (vect.cross (v1, v2) >= -tol);
};

vect.intersect2d = function (a, b, c, d, tol) {
    if (!tol)
	tol = 0;
    return (vect.left2d (a, b, c, tol) != vect.left2d (a, b, d, tol) &&
	    vect.left2d (c, d, b, tol) != vect.left2d (c, d, a, tol));
};

vect.intersect2dt = function (a, b, c, d) {
    var denom = a.x * (d.y - c.y) +
                b.x * (c.y - d.y) +
                d.x * (b.y - a.y) +
                c.x * (a.y - b.y);

    if (denom == 0)
	return Infinity;
    
    var num_s = a.x * (d.y - c.y) +
                c.x * (a.y - d.y) +
                d.x * (c.y - a.y);
    var s = num_s / denom;

    var num_t = -(a.x * (c.y - b.y) +
                 b.x * (a.y - c.y) +
		  c.x * (b.y - a.y));
    var t = num_t / denom;
    
    return t;
};

vect.intersect2dpos = function (a, b, c, d) {
    var denom = a.x * (d.y - c.y) +
                b.x * (c.y - d.y) +
                d.x * (b.y - a.y) +
                c.x * (a.y - b.y);

    if (denom == 0)
	return Infinity;
    
    var num_s = a.x * (d.y - c.y) +
                c.x * (a.y - d.y) +
                d.x * (c.y - a.y);
    var s = num_s / denom;

    var num_t = -(a.x * (c.y - b.y) +
                 b.x * (a.y - c.y) +
		  c.x * (b.y - a.y));
    var t = num_t / denom;
    
    var next = vect.sub (b, a);
    next.scale (s);
    return vect.add (a, next);
};

vect.rotateZ = function (v, omega) {
    var cos = Math.cos (omega);
    var sin = Math.sin (omega);
    xp = cos * v.x - sin * v.y;
    yp = sin * v.x + cos * v.y;
    var v = new vect (xp, yp, v.z);
    return v;
};