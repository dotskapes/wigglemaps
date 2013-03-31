var Color = function (r, g, b, a) {
    if (r <= 1 && g <= 1 && b <= 1 && a <= 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    else {
        this.r = r / 255;
        this.g = g / 255;
        this.b = b / 255;
        this.a = a / 255;
    }
    
    this.array = [this.r, this.g, this.b, this.a];

    this.vect = function () {
        return this.array;
    };
    
    this.rgb = function () {
        return 'rgb(' + parseInt (this.r * 255) + ',' + parseInt (this.g * 255) + ',' + parseInt (this.b * 255) + ')';
    };
};

function as_rgb (array) {
    return 'rgb(' + Math.round (array[0] * 255) + ',' + Math.round (array[1] * 255) + ',' + Math.round (array[2] * 255) + ')'
};

function clamp (val, min, max) {
    return Math.min (Math.max (val, min), max);
}

function icolor (r, g, b, a) {
    return new Color (clamp (r / 255, 0, 1), clamp (g / 255, 0, 1), clamp (b / 255, 0, 1), clamp (a / 255, 0, 1));
}

function fcolor (r, g, b, a) {
    return new Color (clamp (r, 0, 1), clamp (g, 0, 1), clamp (b, 0, 1), clamp (a, 0, 1));
}

function hex_to_color (hex) {
    var r = parseInt (hex.slice (1, 3), 16);
    var g = parseInt (hex.slice (3, 5), 16);
    var b = parseInt (hex.slice (5, 7), 16);
    return new Color (r, g, b, 255);
};

function parseRGB (value) {
    var color_match = value.match (/^rgb\((\d+),(\d+),(\d+)\)$/);
    if (!color_match)
        return null;
    else
        return new Color (color_match[1], color_match[2], color_match[3], 255);
};
