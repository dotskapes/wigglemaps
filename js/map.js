var Map = function (selector, options) {
    engine = new Engine (selector, options);

    this.center = function (x, y) {
	engine.camera.position (new vect (x, y));
    };

    this.extents = function (width) {
	engine.camera.extents (width);
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

    this.attr = function (key, value) {
	engine.attr (key, value);
    };

    this.export = function () {
	var data = engine.canvas.get (0).toDataURL ();
	/*var form = $ ('<form method="POST" action="http://skapes.org/app_in/geodata/export.png"></form>')
	var data_input = $ ('<input name="data" type="text" />');
	data_input.val (data);
	form.append (data_input);
	form.submit ();*/
	$.ajax ({
	    url: '../server/export.png',
	    type: 'POST',
	    data: data
	});
    };
};