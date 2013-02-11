var Querier = function (engine, layer) {
    queryTypes = {
        'Point': PointQuerier,
        //'Polygon': PolygonQuerier,
        //'Line': lineQuerier
    };

    var queriers = {};
    $.each (queryTypes, function (geomType, GeomQuerier) {
        queriers[geomType] = new GeomQuerier (engine, layer, layer.features ().type (geomType));
    });

     this.boxSearch = function (box) {
        var results = new LayerSelector ([]);
        for (var key in queriers) {
            var search_results = queriers[key].boxSearch (box);
            results = results.join (search_results);
        }
        return results;
    };

    this.pointSearch = function (engine, p) {
        var results = new LayerSelector ([]);
        for (var key in queriers) {
            var search_results = queriers[key].pointSearch (p);
            results = results.join (search_results);
        }
        return results;
    };
};
