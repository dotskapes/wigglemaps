var GeoJSON = function (data, options) {
    if (options === undefined)
        options = {};
    var layer = new Layer (options);
    for (var i = 0; i < data.features.length; i ++) {
        var feature = data.features[i];
        if (feature.type == 'Feature') {
            if (feature.geometry.type == 'Point') {
                layer.append ({
                    type: 'Point',
                    geom: [feature.geometry.coordinates],
                    attr: feature.properties
                });
            }
            if (feature.geometry.type == 'MultiPoint') {
                layer.append ({
                    type: 'Point',
                    geom: feature.geometry.coordinates,
                    attr: feature.properties
                });
            }
            if (feature.geometry.type == 'Polygon') {
                var poly = feature.geometry.coordinates;
                var oriented = [];
                for (var k = 0; k <= poly.length - 1; k ++) {
                    var o_ring = [];
                    for (var j = poly[k].length - 1; j >= 0; j --) {
                        o_ring.push (poly[k][j]);
                    }
                    oriented.push (o_ring);
                }
                layer.append ({
                    type: 'Polygon',
                    geom: [oriented],
                    attr: feature.properties
                });
            }
            if (feature.geometry.type == 'MultiPolygon') {
                var rings = [];
                $.each (feature.geometry.coordinates, function (i, poly) {
                    var oriented = [];
                    for (var k = 0; k <= poly.length - 1; k ++) {
                        var o_ring = [];
                        for (var j = poly[k].length - 1; j >= 0; j --) {
                            o_ring.push (poly[k][j]);
                        }
                        oriented.push (o_ring);
                    }
                    rings.push (oriented);
                });
                layer.append ({
                    type: 'Polygon',
                    geom: rings,
                    attr: feature.properties
                });
            }
            if (feature.geometry.type == 'MultiLineString') {
                $.each (feature.geometry.coordinates, function (i, line) {
                    layer.append ({
                        type: 'Line',
                        geom: [[line]],
                        attr: feature.properties
                    });
                });
            }
        }
    }
    return layer;
};
