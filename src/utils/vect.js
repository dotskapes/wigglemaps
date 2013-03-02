function Vector2D (x, y) {
    this.x = x;
    this.y = y;

    this.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    this.sub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    this.scale = function (s) {
        this.x *= s;
        this.y *= s;
        return this;
    };
    this.length = function () {
        return Math.sqrt (this.x * this.x + this.y * this.y);
    };
    this.normalize = function () {
        var scale = this.length ();
        if (scale == 0)
            return this;
        this.x /= scale;
        this.y /= scale;
        return this;
    };
    this.div = function (v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    };
    this.floor = function () {
        this.x = Math.floor (this.x);
        this.y = Math.floor (this.y);
        return this;
    };
    this.zero = function () {
        return ((this.x + this.y) == 0);
    };
    this.dot = function (v) {
        return (this.x * v.x) + (this.y * v.y);
    };
    this.cross = function (v) {
        return (this.x * v.y) - (this.y * v.x);
    };
    this.rotate = function (omega) {
        var cos = Math.cos (omega);
        var sin = Math.sin (omega);
        xp = cos * this.x - sin * this.y;
        yp = sin * this.x + cos * this.y;
        this.x = xp;
        this.y = yp;
        return this;
    };
    this.clone = function () {
        return new Vector2D (this.x, this.y); 
    };

    this.array = function () {
        return [this.x, this.y];
    };
};

function vect (x, y) {
    return new Vector2D (x, y);
};

vect.scale = function (v, s) {
    return v.clone ().scale (s);
};

vect.add = function (v1, v2) {
    return v1.clone ().add (v2);
};

vect.sub = function (v1, v2) {
    return v1.clone ().sub (v2);
};

vect.dist = function (v1, v2) {
    return v1.clone ().sub (v2).length ();
};

vect.dir = function (v1, v2) {
    return v1.clone ().sub (v2).normalize ();
}

vect.dot = function (v1, v2) {
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

vect.intersects = function (a, b, c, d, tol) {
    if (!tol)
        tol = 0;
    return (vect.left (a, b, c, tol) != vect.left (a, b, d, tol) &&
            vect.left (c, d, b, tol) != vect.left (c, d, a, tol));
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

    /*var num_t = -(a.x * (c.y - b.y) +
                  b.x * (a.y - c.y) +
                  c.x * (b.y - a.y));
    var t = num_t / denom;*/
    
    var dir = vect.sub (b, a);
    dir.scale (s);
    return vect.add (a, dir);
};

vect.rotate = function (v, omega) {
    var cos = Math.cos (omega);
    var sin = Math.sin (omega);
    xp = cos * v.x - sin * v.y;
    yp = sin * v.x + cos * v.y;
    var v = new vect (xp, yp);
    return v;
};

vect.normalize = function (v) {
    return v.clone ().normalize ();
};
