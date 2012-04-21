var Map = function (selector) {
    engine = new Engine (selector);

    this.center = function (x, y) {
	engine.camera.position (new vect (x, y));
    };

    this.append = function (layer) {
	engine.scene.push (layer);
    };

    this.select = function (func)  {
	if (!func)
	    engine.select (false);
	else {
	    engine.sel.select (func);
	    engine.select (true);
	}
    };

    this.resize = function () {
	engine.resize ();
    }
};