module.exports = function(grunt) {
    var exec = require('child_process').exec;
    var fs = require('fs');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        build: {
            include: [
                'src/utils/vect.js',

                'src/start.js',

                'lib/jquery.hotkeys.js',
                'lib/jquery.mousewheel.js',
                'lib/requestAnimationFrame.js',

                'src/util.js',
                'src/utils/binary.js',
                'src/utils/shader-utils.js',
                'src/utils/Buffers.js',
                'src/utils/texture.js',

                'src/style.js',
                'src/camera.js',
                'src/panner.js',
                'src/events.js',
                'src/range_bar.js',
                'src/widget/slider.js',

                'src/renderers/FeatureView.js',
                'src/renderers/FeatureRenderer.js',
                'src/renderers/PointRenderer.js',
                'src/renderers/LineRenderer.js',
                'src/renderers/PolygonRenderer.js',
                'src/renderers/TimeRenderer.js',
                'src/renderers/MultiRenderer.js',

                'src/query/Querier.js',
                'src/query/PointQuerier.js',
                'src/query/PolygonQuerier.js',
                'src/query/TimeSeriesQuerier.js',

                'src/LayerController.js',

                'src/Engine.js',
                'src/Map.js',
                'src/TimeSeries.js',

                'src/select.js',
                'src/trapezoid.js',
                'src/aabb.js',
                'src/range.js',

                'src/model/Feature.js',
                'src/model/Point.js',
                'src/model/Polygon.js',
                'src/model/Line.js',

                'src/model/Layer.js',

                'src/grid.js',
                'src/ascii.js',
                'src/sgrid.js',
                'src/selector.js',
                'src/raster.js',
                'src/hillshade.js',
                'src/tile.js',
                'src/ows.js',
                'src/io/Geojson.js',
                'src/io/Shapefile.js',

                'src/end.js'
            ],
        },
        uglify: {
            src: 'wigglemaps.js',
            dst: 'wigglemaps.min.js'
        }
    });

    grunt.registerTask('build', 'Build the script', function () {
        var config = grunt.config.get ('build');
        var done = this.async ();
        var paths = config.include.join (' ');
        exec ('cat ' + paths, function (error, stdout, stderr) {
            fs.writeFileSync('wigglemaps.js', stdout);
            done (error === null);
        });
    });

    grunt.registerTask('uglify', "Minify the script", function () {
        var config = grunt.config.get ('uglify');
        var done = this.async ();
        exec ('./node_modules/uglify-js/bin/uglifyjs -o ' + config.dst + ' ' + config.src, function (error, stdout, stderr) {
            done (error === null);
        });
    });

    
    grunt.registerTask('default', ['build', 'uglify']);
};
