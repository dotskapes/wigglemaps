$ (document).ready (function () {
    engine = new Engine ();

    var layers = {}

    //var p = new vect (-55, -10);
    //engine.camera.position (p);

    /*$.ajax ({
	url: 'static/temp/bio.kml',
	dataType: 'xml',
	async: false,			
	success: function (data) {
	    layers['bio'] = new KML (data);
	    engine.scene.push (layers['bio']);
	},
	error: function (jqXHR, textStatus, errorThrown) {
	    console.log (jqXHR, textStatus, errorThrown);
	}
    });

    $.ajax ({
	url: 'static/temp/br_pop.json',
	dataType: 'json',
   	async: false,			
	success: function (data) {
	    br_pop = new Layer (data);
	    engine.scene.push (br_pop);
	}
    });*/

    /*$.ajax ({
	url: 'static/temp/counties.json',
	dataType: 'json',
   	async: false,			
	success: function (data) {
	    counties = new Layer (data);
	    engine.scene.push (counties);
	}
    });*/

    /*$.ajax ({
	url: 'static/temp/br_precip.json',
	dataType: 'json',
	async: false,			
	success: function (data) {
	    br_precip = new Layer (data);
	    engine.scene.push (br_precip);
	}
    });*/

    /*$.ajax ({
	url: 'static/temp/test.json',
	dataType: 'json',
   	async: false,			
	success: function (data) {
	    console.log ('ok');
	    br_pop = new Layer (data);
	    engine.scene.push (br_pop);
	}
    });*/
});