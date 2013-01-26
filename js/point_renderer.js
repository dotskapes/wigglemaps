var point_shader = null;

function PointRenderer (engine, ayer_style) {
    if (!point_shader) {
	point_shader = makeProgram (BASE_DIR + 'shaders/point');
    }

    var buffers = new Buffers (initial_points);
    buffers.create ('vert', 2);
    buffers.create ('unit', 2);
    buffers.create ('color', 3);
    buffers.create ('alpha', 1);

    var default_style = {
        'fill': new Color (.02, .44, .69, 1),
        'opacity': 1.0
    };

    var PointView = function (feature_geom, feature_style) {
        
        var style_map = {
            'fill': function () {
                
            }
        };

        this.update = function () {

        };
        
        this.update_all = function () {

        };
    };

    this.create = function (feature_geom, feature_style) {
        return new PointView (feature_geom, feature_style);
    };

    this.draw = function () {

    };

};
