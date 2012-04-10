function PolygonLayer = function () {

    function Polygon (prop) {
	if (!prop)
	    prop = {};
	if (!prop.geom)
	    prop.geom = [];
	if (!prop.attr)
	    prop.attr = {};
	if (!prop.style)
	    prop.style = {};
	
	this.geom = geom;
	this.attr = prop.attr;
	this.id = null;
	
	var layer = null;
	var start_outline, count_outline;
	var start_main, count_main;
	var buffers = null;
    };	
};