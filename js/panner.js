function Scroller (engine) {
    var drag = false;
    var start = new vect (0, 0);
    var pos = new vect (0, 0);
    var dir = null;
    var speed = 0;
    
    engine.canvas.mousedown (function (event) {
	console.log (event);
	start = new vect (event.clientX, event.clientY);
	drag = true;
	//console.log ('pos', engine.camera.project (new vect (event.clientX, event.clientY)));
    });
    
    engine.canvas.mouseup (function () {
       drag = false;
   });
    
    engine.canvas.mousemove (function (event) {
       pos = new vect (event.clientX, event.clientY);
   });
    
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
       engine.camera.zoom (delta);
    });

    var enabled = true;
    this.disable = function () {
	enabled = false;
    };

    this.enable = function () {
	enabled = true;
    };

    this.update = function (dt) {
	if (drag && enabled) {
	    var m = vect.sub (engine.camera.project (start), engine.camera.project (pos));
	    engine.camera.move (m);
	    start = pos;
	    speed = m.length () / dt;
	    dir = m;
	    dir.normalize ();
	}
	else if (speed > .1) {
	    if (dir) {
		engine.camera.move (vect.scale (dir, speed * dt));
		speed -= 3.0 * dt * speed;
            }
	}
    };
};