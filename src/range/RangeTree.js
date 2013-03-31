var RangeTree = function (elem) {
    elem.sort (function (a, b) {
        return a.x - b.x;
    });
    if (elem.length > 0)
        this.root = new RangeNode (elem, 0, elem.length - 1, parseInt ((elem.length - 1) / 2, 10));
    else
        this.root = null;

    this.search = function (_box) {
        if (!this.root)
            return [];
        //var box = new Box (min, max);
        var box = _box.clone ();
        var result = [];
        this.root.search (result, box);
        return result;
    };
};
