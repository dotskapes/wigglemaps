// Color objects are used throughout the API as a fundemental type
var Color = function (r, g, b, a) {
    // Allow for colors to be specified as both floats and ints
    // The true representation is floats however
    if (r <= 1 && g <= 1 && b <= 1 && a <= 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    else {
        // Eventually, colors should only be specified as floats
        console.warn ('Specifying colors as ints is deprecated');
        this.r = r / 255;
        this.g = g / 255;
        this.b = b / 255;
        this.a = a / 255;
    }
    
    // A flat representation of the vector
    this.array = [this.r, this.g, this.b, this.a];

    // Covert the color to a WebGL format that can be sent to shaders
    this.vect = function () {
        return this.array;
    };
    
    // Convert the color to an SVG readable format
    this.rgb = function () {
        return 'rgb(' + parseInt (this.r * 255, 10) + ',' + parseInt (this.g * 255, 10) + ',' + parseInt (this.b * 255, 10) + ')';
    };
};

// Helper function to for specifying colors as integers
var icolor = function (r, g, b, a) {
    return new Color (clamp (r / 255, 0, 1), clamp (g / 255, 0, 1), clamp (b / 255, 0, 1), clamp (a / 255, 0, 1));
};

// Corresponding helper function for specifying colors as floats
var fcolor = function (r, g, b, a) {
    return new Color (clamp (r, 0, 1), clamp (g, 0, 1), clamp (b, 0, 1), clamp (a, 0, 1));
};

// Covert a flat floating point representation of color to an rgb string
var as_rgb = function (array) {
    conosole.warn('Deprecated: use parseRGB instead');
    return 'rgb(' + Math.round (array[0] * 255, 10) + ',' + Math.round (array[1] * 255, 10) + ',' + Math.round (array[2] * 255, 10) + ')';
};

// Convert a hex string to a color object
var hex_to_color = function (hex) {
    var r = parseInt (hex.slice (1, 3), 16);
    var g = parseInt (hex.slice (3, 5), 16);
    var b = parseInt (hex.slice (5, 7), 16);
    return icolor (r, g, b, 255);
};

// Convert an rgb string to a color object
var parseRGB = function (value) {
    var color_match = value.match (/^rgb\((\d+),(\d+),(\d+)\)$/);
    if (!color_match)
        return null;
    else
        return icolor (color_match[1], color_match[2], color_match[3], 255);
};
