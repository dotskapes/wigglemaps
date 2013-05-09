var WORLD_MODE = 0;
var SCREEN_MODE = 1;

var fonts = {};
var TextRenderer = function (engine, string, options) {
    if (!options)
        options = {};
    if (!options.style)
        options.style = {};

    default_model (options, {
        xmode: WORLD_MODE,
        ymode: WORLD_MODE,
        pos: vect(0, 0),
        height: 8,
        padding: vect(5, 3)
    });
    // Temp copy of options
    this.priority = options.priority;
    if (!engine.text_shader) {
        engine.text_shader = makeProgram (engine.gl, BASE_DIR + 'shaders/text');
    }
    if (!('OpenSans' in fonts)) {
        $.ajax ({
            url: BASE_DIR + '/fonts/OpenSans.svg',
            async: false,
            dataType: 'xml',
            success: function (data) {
                fonts.OpenSans = {};
                var glyphs = data.getElementsByTagName ('glyph');
                for (var i = 0 ; i < glyphs.length; i ++) {
                    var letter = glyphs[i].getAttribute ('unicode');
                    fonts.OpenSans[letter] = {
                        path: glyphs[i].getAttribute ('d'),
                        hor: parseFloat (glyphs[i].getAttribute ('horiz-adv-x'))
                    };
                }
            }
        });
    }
    var buffers = new Buffers (engine);
    buffers.create ('pos', 2);
    buffers.create ('tex', 2);
    buffers.create ('mode', 1);

    var ring_orientation = function (ring) {
        var total = 0;
        for (var i = 0; i < ring.length - 2; i ++) {
            total += (ring[i + 1][0] - ring[i][0]) * (ring[i + 1][1] + ring[i][1]);
        }
        return total > 0;
    };

    var path = function (letter, offset, symbol) {
        if (!letter)
            return;
        var current = [0 + offset, 0];
        var control = [0 + offset, 0];
        var re = /([A-Za-z])([^A-Za-z]*)/g;
        var match = null;
        var rings = [];
        var ring = [];
        while (match = re.exec (letter)) {
            var args = match[2].split (' ');
            var next;
            if (match[1].match ('[Zz]')) {
                next = [current[0], current[1]];
                ring.push (ring[0]);
                if (ring)
                    rings.push (ring);
                ring = [];
            }
            else if (match[1].match (/[M]/)) {
                next = [parseFloat (args[0]) + offset, parseFloat (args[1])];
                ring.push(next);
                current = next;
            }
            else if (match[1].match (/[Ll]/)) {
                if (match[1] == 'L')
                    next = [parseFloat (args[0]) + offset, parseFloat (args[1])];
                else if (match[1] == 'l')
                    next = [current[0] + parseFloat (args[0]), current[1] + parseFloat (args[1])];
                ring.push (next);
                current = next;
            }
            else if (match[1].match (/[Hh]/)) {
                if (match[1] == 'H')
                    next = [parseFloat (args[0]) + offset, current[1]];
                else if (match[1] == 'h')
                    next = [current[0] + parseFloat (args[0]), current[1]];
                ring.push (next);
                current = next;
            }
            else if (match[1].match (/[Vv]/)) {
                if (match[1] == 'V')            
                    next = [current[0], parseFloat (args[0])];
                else if (match[1] == 'v')
                    next = [current[0], current[1] + parseFloat (args[0])];
                ring.push (next);
                current = next;
            }
            else if (match[1].match (/[QqTt]/)) {
                if (match[1] == 'Q') {
                    control = [parseFloat (args[0]) + offset, parseFloat (args[1])];
                    next = [parseFloat (args[2]) + offset, parseFloat (args[3])];
                }
                else if (match[1] == 'q') {
                    control = [current[0] + parseFloat (args[0]), current[1] + parseFloat (args[1])];
                    next = [current[0] + parseFloat (args[2]), current[1] + parseFloat (args[3])];
                }
                else if (match[1] == 'T') {
                    control = [-(control[0] - current[0]) + current[0], -(control[1] - current[1]) + current[1]];
                    next = [parseFloat (args[0]) + offset, parseFloat (args[1])];
                }
                else if (match[1] == 't') {
                    control = [-(control[0] - current[0]) + current[0], -(control[1] - current[1]) + current[1]];
                    next = [current[0] + parseFloat (args[0]), current[1] + parseFloat (args[1])];
                }
                var mode;
                var v_next = new vect (next[0], next[1]);
                var v_current = new vect (current[0], current[1]);
                var v_control = new vect (control[0], control[1]);
                if (vect.left (v_next, v_current, v_control)) {
                    mode = 1.0;
                    ring.push (control);
                    ring.push (next);
                }
                else {
                    mode = 0.0;
                    ring.push (next);
                }
                var start_tri = buffers.alloc (3);
                buffers.write ('pos', [current[0], current[1], next[0], next[1], control[0], control[1]], start_tri, 3);
                buffers.write ('tex', [0, 0, 1, 1, .5, 0], start_tri, 3);
                buffers.repeat ('mode', [mode], start_tri, 3);
                current = next;
            }
            else
                throw 'Path error: ' + match[1];
        }

        var count = 0;
        for (var i = 0; i < rings.length; i ++) {
            rings[i].reverse ();
        }
        var poly;
        while (count < 100) {
            try {
                /*poly.append ({
                  geom: [rings]
                  });*/
                poly = triangulate_polygon (rings);
                count = 101;
            } catch (e) {
                count ++;
            }
        }
        if (count == 100)
            console.log ('rendering polygon failed on', symbol);

        var tri_len = poly.length / 2;
        var start = buffers.alloc (tri_len);
        buffers.write ('pos', poly, start, tri_len);
        buffers.repeat ('tex', [0, 0], start, tri_len);
        buffers.repeat ('mode', [.5], start, tri_len);

        var min_val = Infinity;
        var max_val = -Infinity;
        for (var i = 0; i < rings.length; i ++) {
            for (var j = 0; j < rings[i].length; j ++) {
                if (rings[i][j][0] < min_val)
                    min_val = rings[i][j][0];
                if (rings[i][j][0] > max_val)
                    max_val = rings[i][j][0];
            }
        }
        //return max_val - min_val;
    };

    var offset = 0;
    var letters = fonts.OpenSans;
    
    for (var i = 0; i < string.length; i ++) {
        if (string[i] != 'P')
            path (letters[string[i]].path, offset, string[i]);
        offset += (letters[string[i]].hor);
    }

    var width = options.height * offset / 1000;
    this.bbox = function() {
        var px_pos = engine.camera.screen(options.pos);
        var px_size = vect(width, options.height);
        var box = new Box(
            vect(px_pos.x - options.padding.x, px_pos.y - px_size.y - options.padding.y), 
            vect(px_pos.x + px_size.x + options.padding.x, px_pos.y + options.padding.y)
        );
        return box;
    };

    //var framebuffer = null;

    this.draw = function (engine, dt) {
        var gl = engine.gl;
        //if (!framebuffer)
        //    framebuffer = engine.framebuffer ();
        buffers.update ();

        //framebuffer.activate ({
        //    blend: false
        //});

        var text_shader = engine.text_shader;
        gl.useProgram (text_shader);    
        
        text_shader.data ('world', engine.camera.worldToPx);
        text_shader.data ('screen', engine.camera.pxToScreen);
        text_shader.data ('pos', buffers.get ('pos'));
        text_shader.data ('tex_in', buffers.get ('tex'));
        text_shader.data ('mode_in', buffers.get ('mode'));
        
        text_shader.data ('px', 2.0 / engine.canvas.width ());
        text_shader.data ('py', 2.0 / engine.canvas.height ());

        text_shader.data ('translate', [options.pos.x, options.pos.y]);
        text_shader.data ('height', options.height);
        text_shader.data ('aspect', engine.canvas.height () / engine.canvas.width ());
        text_shader.data ('one_px', 2.0 / engine.canvas.height ());     

        text_shader.data ('xmode', options.xmode);     
        text_shader.data ('ymode', options.ymode);

        gl.drawArrays (gl.TRIANGLES, 0, buffers.count ()); 

        //framebuffer.deactivate ();

        //engine.draw_blur (framebuffer.tex);
        //poly.draw (engine, dt);
    };
};
