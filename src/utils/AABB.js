var AABBNode = function (feature, bounds, first, second) {
    this.bounds = bounds;
    this.feature = feature;

    this.first = null;
    this.second = null;

    this.dist = function (node) {
        return vect.dist (this.bounds.centroid (), node.bounds.centroid ());
    };
    
    this.join = function (node) {
        return new AABBNode (null, this.bounds.union (node.bounds), this, node);
    };
};

var AABBTree = function (features) {
    var nodes = [];
    
    for (var key in features) {
        var node = new AABBNode (features[key], features[key].bounds, null, null);
        nodes.push (node);
    }

    var join_nearest = function () {
        var min_dist = Infinity;
        var min_i = -1;
        var min_j = -1;
        for (var i = 0; i < nodes.length; i ++) {
            for (var j = 0; j < i; j ++) {
                var dist = nodes[i].dist (nodes[j]);
                if (dist < min_dist) {
                    min_dist = dist;
                    min_i = i;
                    min_j = j;
                }
            }
        }
        var new_box = nodes[min_i].join (nodes[min_j]);
        nodes.splice (min_i, 1);
        nodes.splice (min_j, 1);
        nodes.push (new_box);
    };

    while (nodes.length > 2) {
        join_nearest ();
    }

    console.log (nodes[0]);
    
};
