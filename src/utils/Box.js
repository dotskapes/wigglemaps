var Box = function (v1, v2) {
    this.min = v1.clone ();
    this.max = v2.clone ();
    this.contains = function (p) {
        return (v1.x <= p.x) && (v2.x >= p.x) && (v1.y <= p.y) && (v2.y >= p.y);
    };

    this.x_in = function (p) {
        return (v1.x <= p.x) && (v2.x >= p.x);
    };

    this.x_left = function (p) {
        return (v1.x >= p.x);
    };

    this.x_right = function (p) {
        return (v2.x <= p.x);
    };

    this.y_in = function (p) {
        return (v1.y <= p.y) && (v2.y >= p.y);
    };

    this.y_left = function (p) {
        return (v1.y >= p.y);
    };

    this.y_right = function (p) {
        return (v2.y <= p.y);
    };

    this.area = function () {
        return (this.max.x - this.min.x) * (this.max.y - this.min.y);
    };

    this.height = function () {
        return this.max.y - this.min.y;
    };

    this.width = function () {
        return this.max.x - this.min.x;
    };
    
    this.vertex = function (index) {
        switch (index) {
        case 0:
            return this.min.clone ();
        case 1:
            return new vect (this.max.x, this.min.y);
        case 2:
            return this.max.clone ();
        case 3:
            return new vect (this.min.x, this.max.y);
        default:
            throw "Index out of bounds: " + index ;
        }
    };

    this.intersects = function (box) {
        for (var i = 0; i < 4; i ++) {
            for (var j = 0; j < 4; j ++) {
                if (vect.intersects (this.vertex (i), this.vertex ((i + 1) % 4),
                                     box.vertex (j), box.vertex ((j + 1) % 4)))
                    return true;
            }
        }
        if (this.contains (box.min) &&
            this.contains (box.max) &&
            this.contains (new vect (box.min.x, box.max.y)) &&
            this.contains (new vect (box.max.x, box.min.y)))
            return true;
        if (box.contains (this.min) &&
            box.contains (this.max) &&
            box.contains (new vect (this.min.x, this.max.y)) &&
            box.contains (new vect (this.max.x, this.min.y)))
            return true;
        return false;
    };

    this.union = function (b) {
        this.min.x = Math.min (this.min.x, b.min.x);
        this.min.y = Math.min (this.min.y, b.min.y);

        this.max.x = Math.max (this.max.x, b.max.x);
        this.max.y = Math.max (this.max.y, b.max.y);
    };

    this.centroid = function () {
        return new vect ((this.max.x + this.min.x) / 2, (this.max.y + this.min.y) / 2);
    };

    this.clone = function () {
        return new Box (v1, v2);
    };
};
