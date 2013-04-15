module.exports = function(grunt) {
    var exec = require('child_process').exec;
    var fs = require('fs');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jade: { 
            src: 'src/templates',
            dst: 'templates.js'
        },
        shell: {
            hint: {
                command: 'node_modules/jshint/bin/jshint --verbose --reporter=build/jshint.js src',
                options: {
                    stdout: true,
                    failOnError: true
                }
            }
        },
        build: {
            dst: 'wigglemaps.js',
            include: [
                'src/utils/vect.js',

                'src/start.js',

                'lib/jquery.hotkeys.js',
                'lib/jquery.mousewheel.js',
                'lib/requestAnimationFrame.js',

                'src/utils/utils.js',
                'src/utils/Color.js',
                'src/utils/Mouse.js',
                'src/utils/binary.js',
                'src/utils/shader-utils.js',
                'src/utils/Buffers.js',
                'src/utils/Texture.js',
                'src/utils/Box.js',
                'src/utils/trapezoid.js',

                'src/StyleManager.js',
                'src/Camera.js',
                'src/Scroller.js',
                'src/EventManager.js',

                'src/renderers/FeatureView.js',
                'src/renderers/FeatureRenderer.js',
                'src/renderers/PointRenderer.js',
                'src/renderers/LineRenderer.js',
                'src/renderers/PolygonRenderer.js',
                'src/renderers/TimeRenderer.js',
                'src/renderers/MultiRenderer.js',
                'src/renderers/TextRenderer.js',

                'src/query/Querier.js',
                'src/query/PointQuerier.js',
                'src/query/PolygonQuerier.js',
                'src/query/TimeSeriesQuerier.js',
                'src/query/LayerSelector.js',

                'src/controllers/LayerController.js',
                'src/controllers/TextController.js',

                'src/Engine.js',
                'src/Map.js',
                'src/TimeSeries.js',

                'src/SelectionBox.js',

                'src/range/RangeNode.js',
                'src/range/RangeTree.js',

                'src/geom/Feature.js',
                'src/geom/Point.js',
                'src/geom/Polygon.js',
                'src/geom/Line.js',

                'src/geom/Layer.js',

                'src/grid/Grid.js',

                'src/raster/Raster.js',
                'src/raster/Hillshade.js',
                'src/raster/Elevation.js',
                'src/raster/TileLayer.js',

                'src/io/WMS.js',
                'src/io/Geojson.js',
                'src/io/Shapefile.js',
                'src/io/AsciiGrid.js',
                'src/io/SparseGrid.js',
                'src/io/KML.js',

                'src/namespace.js',

                'src/end.js'
            ]
        },
        'build-widget': {
            dst: 'wigglemaps.widget.js',
            include: [
                'templates.js',
                'src/utils/utils.js',
                'src/start.js',
                'src/widget/Slider.js',
                'src/widget_namespace.js',
                'src/end.js'
            ]
        },
        uglify: {
            src: 'wigglemaps.js',
            dst: 'wigglemaps.min.js'
        },
        examples: {

        }
    });

    grunt.registerTask('examples', 'Build the examples page', function () {
        var task = this;
        var done = task.async ();
        exec ('node_modules/jade/bin/jade examples/index.jade', function (error, stdout, stderr) {
            if (error)
                grunt.log.write (stderr);
            done (error === null);
        });
    });

    var concat = function (task, config) {
        //var config = grunt.config.get ('build');
        var done = task.async ();
        var paths = config.include.join (' ');
        exec ('cat ' + paths, function (error, stdout, stderr) {
            if (error)
                grunt.log.write(stderr);
            fs.writeFileSync(config.dst, stdout);
            done (error === null);
        });
    };

    grunt.registerTask('build', 'Concat files together', function () {
        var config = grunt.config.get ('build');
        concat (this, config, 'wigglemaps.js');
    });

    grunt.registerTask('build-widget', "Build the widgets", function () {
        var config = grunt.config.get ('build-widget');
        concat (this, config, 'wigglemaps.widget.js');
    });

    grunt.registerTask('jade', 'Build the templates', function () {
        var config = grunt.config.get ('jade');
        jade = require ('jade');

        //var runtime = fs.readFileSync ('node_modules/jade/runtime.js');
        //fs.writeFileSync ('templates.js', runtime);

        var include = grunt.file.expand(config.src + "/*.jade");

        //fs.writeFileSync ('templates.js', 'var templates = {};\n');
        var task = this;

        fs.writeFileSync(config.dst,'\nif (jade.templates === undefined) jade.templates = {};\n;');

        include.forEach (function (filename, i) {
            var buffer = fs.readFileSync (filename);
            var fn = jade.compile (buffer, {
                client: true
            });
            var done = task.async ();
            
            exec ('basename ' + filename + ' .jade', function (error, stdout, stderr) {
                fs.appendFileSync (config.dst, 'jade.templates[\'' + stdout.trim () + '\'] = ' + fn.toString () + ';\n');
                done (error === null);
            });
        });
    });

    grunt.registerTask('uglify', "Minify the script", function () {
        var config = grunt.config.get ('uglify');
        var done = this.async ();
        exec ('./node_modules/uglify-js/bin/uglifyjs -o ' + config.dst + ' ' + config.src, function (error, stdout, stderr) {
            done (error === null);
        });
    });


    grunt.registerTask('widget', ['jade', 'build-widget']);
    grunt.registerTask('default', ['build', 'uglify']);

    grunt.loadNpmTasks('grunt-shell');
    grunt.registerTask('hint', ['shell:hint']);
};
