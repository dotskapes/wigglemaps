var TIMEOUT = 1000;

var z_base = 0;

var NUM_TILES = 8;

var total_drawn = 0;
var total_calls = 0;

var MultiTileLayer = function (options) {
    var tile_shader = null;

    var layers = [];
    var available = [];

    var engine = null;
    var gl = null;

    this.id = new_feature_id ();

    for (var i = 0; i < options.levels; i ++) {
        var settings = copy (options);
        if (settings.source == 'file')
            settings.url += '/' + options.size * Math.pow (2, (i + 1));
        settings.min = new vect (-180, -90);
        settings.rows = Math.pow (2, i);
        settings.cols = settings.rows * 2;
        settings.cellsize = 180 / settings.rows;
        settings.z_index = 1.0 - z_base - i / 1000;
        settings.available = available;

        var layer = new TileLayer (settings);
        layers.push (layer);
    }
    var z_top = 1.0 - z_base - options.levels / 1000;
    z_base += (options.levels + 2) / 1000;

    var buffers = null;

    var initialized = false;
    this.initialize = function (_engine) {
        engine = _engine;
        if (!tile_shader)
            tile_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/tile');

        gl = engine.gl;

        buffers = new Buffers (engine, NUM_TILES * 6);
        buffers.create ('vert', 3);
        buffers.create ('tex', 2);
        buffers.create ('lookup', 1);
        buffers.alloc (NUM_TILES * 6);

        for (var i = 0; i < 25; i ++) {
            available.push (new Texture (engine));
        }

        for (var i = 0; i < layers.length; i ++) {
            layers[i].initialize (engine);
        }

        layers[0].fetch_all ();
        layers[0].noexpire (true);
        
        initialized = true;
    };

    this.draw = function (engine, dt) {
        if (!initialized)
            this.initialize (engine);
        
        gl.useProgram (tile_shader);
        tile_shader.data ('screen', engine.camera.mat3);

        total_drawn = 0;
        total_calls = 0;
        var min = Infinity;
        var current = layers[0];

        var max_layer, min_layer;

        for (var i  = 0; i < layers.length; i ++) {
            //var ratio = Math.abs (layers[i].size ().x / (levels[i].cols * levels[i].size));
            var ratio = (options.size * layers[i].cols) / layers[i].size (engine).x;
            if (ratio < 1)
                ratio = 1 / ratio;
            //ratio -= 1;
            if (ratio < min) {
                min = ratio;
                current = layers[i];
                max_layer = i;
            }
        }
        for (var i = max_layer; i >= 0; i --) {
            layers[i].fetch ();
        }
        //current.fetch ();
        /*for (var i = max_layer; i >= 0; i --) {
          min_layer = i;
          if (layers[i].ready ())
          break;
          }*/
        //layers[min_layer].draw (engine, dt);

        if (current.ready ()) {
            current.draw (engine, dt, buffers, 0, true);
        }
        else {    
            engine.enableZ ();
            //current.draw (engine, dt, z_top);
            var count = 0;
            for (var i = max_layer; i >= 0; i --) {
                count = layers[i].draw (engine, dt, buffers, count, i === 0);
                //if (layers[i].ready ())
                //    break;
            }
            engine.disableZ ();
        }
        $.each (layers, function (i, layer) {
            layer.cull ();
        });
        //console.log (total_drawn, total_calls);
    };

    function TileLayer (options) {
        if (!options)
            options = {};
        if (!options.desaturate)
            options.desaturate = 0.0;
        if (!options.darken)
            options.darken = 0.0;
        if (!options.hue)
            options.hue = 0.0;
        if (!options.hue_color)
            options.hue_color = fcolor (0.0, 0.0, 0.0, 1.0);
        /*if (!options.available) {
          options.available = [];
          for (var i = 0; i < 8; i ++)
          options.available.push (new Texture (gl));
          }*/

        /*var gl = null;
          var change_context = function (_engine) {
          engine = _engine;
          gl = engine.gl;
          };*/
        
        var url = options.url;
        var min = options.min;
        var rows = options.rows;
        var cols = options.cols;
        var cellsize = options.cellsize;

        this.rows = rows;
        this.cols = cols;

        var tile_ids = {};
        var tiles = {};

        var create_tile = function (i, j) {
            var rmin = new vect (min.x + i * cellsize, min.y + j * cellsize);
            var rmax = new vect (min.x + (i + 1) * cellsize, min.y + (j + 1) * cellsize);
            //var start = buffers.alloc (6);
            var tile = {
                vert: rectv (rmin, rmax, options.z_index),
                tex: null,
                i: i,
                j: j,
                id: (i + cols * j),
                ready: false,
                min: rmin,
                max: rmax
            };
            tiles[i][j] = tile;
            tile_ids[tile.id] = tile;
        };

        for (var i = 0; i < cols; i ++) {
            tiles[i] = {};
        }

        this.size = function (engine) {
            var smin = engine.camera.screen (min);
            var smax = engine.camera.screen (vect.add (min, new vect (cellsize * cols, cellsize * rows)));
            var v = vect.sub (smax, smin);
            v.y = Math.abs (v.y);
            return v;
        }

        var noexpire = false;
        this.noexpire = function (flag) {
            noexpire = flag;
        };

        this.cull = function () {
            if (!noexpire) {
                var time = new Date().getTime ();
                for (var key in current) {
                    if (time - current[key] > TIMEOUT) {
                        var tile = tile_ids[key];
                        delete tile_ids[key];

                        delete tiles[tile.i][tile.j];
                        
                        options.available.push (tile.tex);
                        tile.tex = null;
                        tile.ready = false;
                        
                        delete current[key];
                    }
                }
            }
        };

        var get_bounds = function () {
            var smin = engine.camera.project (new vect (engine.canvas.offset ().left, engine.canvas.offset ().top + engine.canvas.height ()));
            var smax = engine.camera.project (new vect (engine.canvas.offset ().left + engine.canvas.width (), engine.canvas.offset ().top));
            var min_col = Math.floor ((smin.x - min.x) / cellsize);
            var max_col = Math.ceil ((smax.x - min.x) / cellsize);

            var min_row = Math.floor ((smin.y - min.y) / cellsize);
            var max_row = Math.ceil ((smax.y - min.y) / cellsize);

            return {
                min_col: min_col,
                max_col: max_col,
                min_row: min_row,
                max_row: max_row
            };
        };

        var current = {};

        this.ready = function () {

            var bounds = get_bounds ();

            for (var i = Math.max (0, bounds.min_col); i < Math.min (cols, bounds.max_col); i ++) {
                for (var j = Math.max (0, bounds.min_row); j < Math.min (rows,bounds. max_row); j ++) {
                    if (!tiles[i][j])
                        return false;
                    if (!tiles[i][j].ready)
                        return false;
                }
            }
            return true;
        };

        var get_tex = function (i, j) {
            if (!tiles[i][j].tex) {
                var path;
                if (options.source == 'file') {
                    var index = tiles[i][j].id;
                    path = url + '/' + index + '.png';
                }
                else if (options.source == 'wms') {
                    path = make_url (url, {
                        service: 'wms',
                        version: '1.1.0',
                        request: 'GetMap',
                        layers: options.layer,
                        bbox: [tiles[i][j].min.x, tiles[i][j].min.y, tiles[i][j].max.x, tiles[i][j].max.y].join (','),
                        width: options.size,
                        height: options.size,
                        srs: 'EPSG:4326',
                        format: 'image/png',
                        transparent: 'true'
                    });
                }
                /*tiles[i][j].tex = getTexture (path, (function (tile) {
                  return function () {
                  tile.ready = true;
                  };
                  });
                  }) (tiles[i][j]))*/
                tiles[i][j].tex = options.available.pop ();
                if (!tiles[i][j].tex)
                    tiles[i][j].tex = new Texture (engine);
                getImage (path, (function (tile) {
                    return function (img) {
                        if (tile.tex) {
                            tile.tex.image (img);
                            tile.ready = true;
                        }
                    };
                }) (tiles[i][j]));
                
            }
        };

        this.fetch_all = function () {
            var time = new Date().getTime ();
            for (var i = 0; i < cols; i ++) {
                for (var j = 0; j < rows; j ++) {
                    if (!tiles[i][j])
                        create_tile (i, j);
                    if (!tiles[i][j].tex)
                        get_tex (i, j);
                    current[tiles[i][j].id] = time;
                }
            }
        };

        this.fetch = function () {
            var bounds = get_bounds ();

            var time = new Date().getTime ();
            for (var i = Math.max (0, bounds.min_col - 1); i < Math.min (cols, bounds.max_col + 1); i ++) {
                for (var j = Math.max (0, bounds.min_row - 1); j < Math.min (rows,bounds. max_row + 1); j ++) {
                    if (!tiles[i][j])
                        create_tile (i, j);
                    if (!tiles[i][j].tex)
                        get_tex (i, j);
                    current[tiles[i][j].id] = time;
                }
            }
        };

        var initialized = false;
        this.initialize = function (engine) {
            if (initialized)
                throw "Not Implemented: Migrating Tile Layers to New Map";

            if (!tile_shader)
                tile_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/tile');

            //change_context (engine);
            initialized = true;
        };

        this.draw = function (engine, dt, buffers, count, flush) {
            //gl = engine.gl;

            if (!initialized)
                this.initialize (engine);

            var do_draw = function () {
                total_calls ++;
                buffers.update ();

                tile_shader.data ('pos', buffers.get ('vert'));
                tile_shader.data ('tex_in', buffers.get ('tex'));
                tile_shader.data ('lookup_in', buffers.get ('lookup'));
                tile_shader.data ('desaturate', options.desaturate);
                tile_shader.data ('darken', options.darken);
                tile_shader.data ('hue', options.hue);
                tile_shader.data ('hue_color', options.hue_color.array);
                
                gl.drawArrays (gl.TRIANGLES, 0, count * 6);
            };

            var bounds = get_bounds ();
            
            var time = new Date().getTime ();
            for (var i = Math.max (0, bounds.min_col); i < Math.min (cols, bounds.max_col); i ++) {
                for (var j = Math.max (0, bounds.min_row); j < Math.min (rows, bounds.max_row); j ++) {
                    if (tiles[i][j] && tiles[i][j].ready && tiles[i][j].tex) {
                        
                        buffers.write ('vert', tiles[i][j].vert, count * 6, 6);
                        buffers.write ('tex', rectv (new vect (0, 0), new vect (1, 1)), count * 6, 6);
                        buffers.repeat ('lookup', [count / NUM_TILES + 1 / (NUM_TILES * 2)], count * 6, 6);
                        current[tiles[i][j].id] = time; 

                        tile_shader.data ('sampler' + count, tiles[i][j].tex);
                        if (tiles[i][j].tex === null)
                            throw "badness";
                        count ++;
                        total_drawn ++;

                        if (count >= NUM_TILES) {
                            do_draw ();
                            count = 0;
                        }
                    }
                }
            }
            if (flush)
                do_draw ();
            return count;
        };
    };
};
