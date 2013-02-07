var Map = function (selector, options) {
    if (options === undefined)
        options = {};

    BaseEngine.call (this, selector, options);    

    this.Renderers = {
        'Point': PointRenderer,
        'Polygon': PolygonRenderer,
        'Line': LineRenderer,
    };
};
/*var Map = function (selector, options) {
    this.center = function (x, y) {
	engine.camera.position (new vect (x, y));
    };

    this.vcenter = function (v) {
	this.center (v.x, v.y);
    };

    this.extents = function (width) {
	engine.camera.extents (width);
    };

    this.append = function (layer) {
        layer.initialize (engine);
	engine.scene.push (layer);
    };

    this.remove = function (layer) {
	for (var i = 0; i < engine.scene.length; i ++) {
	    if (engine.scene[i] == layer) {
		engine.scene.splice (i, 1);
		return true;
	    }
	}
	return false;
    };

    this.shade = function (data) {
	var shade = new Hillshade (data);
	engine.shade = shade;
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

    this.attr = function (key, value) {
	engine.attr (key, value);
    };

    this.png = function () {
	var data = engine.canvas.get (0).toDataURL ();

	$.ajax ({
	    url: '../server/export.png',
	    type: 'POST',
	    data: data
	});
    };

    this.width = function () {
	return engine.canvas.innerWidth ();
    };

    this.height = function () {
	return engine.canvas.innerHeight ();
    };

    var click_func = null;
    this.click = function (func) {
	click_func = func;
    };

    engine = new Engine (selector, this, options);

    engine.canvas.click (function (event) {
	if (click_func) {
	    var v = new vect (event.pageX, event.pageY);
	    var p = engine.camera.project (v);
	    click_func (p);
	}
    });
};
*/
