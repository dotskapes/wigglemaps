function Scroller (engine, options) {
    var drag = false;
    var start = new vect (0, 0);
    var pos = new vect (0, 0);
    var dir = null;
    var speed = 0;
    
    engine.canvas.mousedown (function (event) {
        //console.log (event);
        start = new vect (event.clientX, event.clientY);
        drag = true;
        //console.log ('pos', engine.camera.project (new vect (event.clientX, event.clientY)));
    });
    
    $ (window).bind ('mouseup', function () {
        drag = false;
    });
    
    /*engine.canvas.mousemove (function (event) {
      pos = new vect (event.clientX, event.clientY);
      });*/
    
    $ (document).bind ('keypress', '+', function (event) {
        engine.camera.zoom (1.1);
    });
    
    $ (document).bind ('keypress', '-', function (event) {
        engine.camera.zoom (10 / 11);
    });
    
    $ (document).bind ('keypress', '0', function (event) {
        engine.camera.reset ();
    });
    
    engine.canvas.bind ('mousewheel', function (event, delta) {
        delta *= .5;
        if (delta < 0) {
            delta *= -1;
            delta += 1.0;
            delta = 1.0 / delta;
        }
        else {
            delta += 1.0;
        }
        var zoom = engine.camera.zoom ();
        engine.camera.zoom (zoom * delta);
        readjustWorld ();
        event.preventDefault ();
    });
    
    var enabled = true;
    this.disable = function () {
        enabled = false;
    };

    this.enable = function () {
        enabled = true;
    };

    this.update = function (dt) {
        pos = new vect (Mouse.x, Mouse.y);
        var change = false;
        var newPos;
        if (drag && enabled) {
            var m = vect.sub (engine.camera.project (start), engine.camera.project (pos));
            var currentPos = engine.camera.position ();
            newPos = vect.add (currentPos, m);
            engine.camera.position (newPos);

            start = pos;
            speed = m.length () / dt;
            dir = m;
            dir.normalize ();
            change = true;
        }
        else if (speed > .01) {
            if (dir) {
                var m = vect.scale (dir, speed * dt);
                var currentPos = engine.camera.position ();
                newPos = vect.add (currentPos, m);
                engine.camera.position (newPos);
                speed -= 3.0 * dt * speed;
                change = true;
            }
        }

        if (change)
            readjustWorld ();
    };

    var readjustWorld = function () {
        if (options.worldMin && options.worldMax) {
            var newPos = engine.camera.position ();
            var size = engine.camera.size ();
            var worldMaxWidth = options.worldMax.x - options.worldMin.x;

            if (size.x > worldMaxWidth) {
                var worldWidth = size.x * engine.camera.zoom ();
                engine.camera.zoom (worldMaxWidth / worldWidth);
            }

            newPos = engine.camera.position ();
            size = engine.camera.size ();
            var worldMaxHeight = options.worldMax.y - options.worldMin.y;
            if (size.y > worldMaxHeight) {
                var worldHeight = size.y * engine.camera.zoom ();
                engine.camera.zoom (worldMaxHeight / worldHeight);
            }
        }
        var newPos = engine.camera.position ();
        var halfSize = engine.camera.size ().scale (.5);
        var change = false;
        if (options.worldMin) {
            if (newPos.x - halfSize.x < options.worldMin.x)
                newPos.x = options.worldMin.x + halfSize.x;
            if (newPos.y - halfSize.y < options.worldMin.y)
                newPos.y = options.worldMin.y + halfSize.y;
            change = true;
        }
        if (options.worldMax) {
            if (newPos.x + halfSize.x > options.worldMax.x)
                newPos.x = options.worldMax.x - halfSize.x;
            if (newPos.y + halfSize.y > options.worldMax.y)
                newPos.y = options.worldMax.y - halfSize.y;
            change = true;
        }
        if (change)
            engine.camera.position (newPos);
    }
};
