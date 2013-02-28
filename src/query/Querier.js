var Querier = function (engine, layer, options) {
    var queriers = {};
    $.each (engine.Queriers, function (geomType, GeomQuerier) {
        queriers[geomType] = new GeomQuerier (engine, layer, options);
    });

     this.boxSearch = function (box) {
        var results = new LayerSelector ([]);
        for (var key in queriers) {
            var search_results = queriers[key].boxSearch (box);
            results = results.join (search_results);
        }
        return results;
    };

    this.pointSearch = function (p) {
        var results = new LayerSelector ([]);
        for (var key in queriers) {
            var search_results = queriers[key].pointSearch (p);
            results = results.join (search_results);
        }
        return results;
    };
};
