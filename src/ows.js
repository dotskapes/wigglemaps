function WMS (options) {
    var settings = copy (options);
    require (settings, ['url', 'layer'])
    default_model (settings, {
	levels: 16,
	size: 256
    });
    force_model (settings, {
	source: 'wms'
    });

    var layer = new MultiTileLayer (settings);
    return layer;
};