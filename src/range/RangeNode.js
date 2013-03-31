var RangeNode = function (elem, start, end, current) {
    this.data = elem[current];
    this.left = null;
    this.right = null;
    if (start != current)
        this.left = new RangeNode (elem, start, current - 1, parseInt ((start + (current - 1)) / 2, 10));
    if (end != current)
        this.right = new RangeNode (elem, current + 1, end, parseInt ((end + (current + 1)) / 2, 10));
    this.subtree = [];
    for (var i = start; i <= end; i ++) {
        this.subtree.push (elem[i]);
    }
    this.subtree.sort (function (a, b) {
        return a.y - b.y;
    });

    var xrange = function (b) {
        return (b.x_in (elem[start]) && b.x_in (elem[end]));
    };

    this.yrange = function (b, start, end) {
        return (b.y_in (this.subtree[start]) && b.y_in (this.subtree[end]));
    };

    this.subquery = function (result, box, start, end, current) {
        if (this.yrange (box, start, end)) {
            for (var i = start; i <= end; i ++) {
                result.push (this.subtree[i]);
            }
            return;
        }
        if (box.y_in (this.subtree[current]))
            result.push (this.subtree[current]);
        if (box.y_left (this.subtree[current])){
            if (current != end)
                this.subquery (result, box, current + 1, end, parseInt ((end + (current + 1)) / 2, 10));
        }
        else if (box.x_right (this.subtree[current])) {
            if (current != start)
                this.subquery (result, box, start, current - 1, parseInt ((start + (current - 1)) / 2, 10));
        }
        else {
            if (current != end)
                this.subquery (result, box, current + 1, end, parseInt ((end + (current + 1)) / 2, 10));
            if (current != start)
                this.subquery (result, box, start, current - 1, parseInt ((start + (current - 1)) / 2));
        }
    };
    
    this.search = function (result, box) {
        if (xrange (box)) {
            this.subquery (result, box, 0, this.subtree.length - 1, parseInt ((this.subtree.length - 1) / 2, 10));
            return;
        }
        else {
            if (box.contains (this.data))
                result.push (this.data);
            if (box.x_left (this.data)) {
                if (this.right)
                    this.right.search (result, box);
            }
            else if (box.x_right (this.data)) {
                if (this.left)
                    this.left.search (result, box);
            }
            else {
                if (this.left)
                    this.left.search (result, box);
                if (this.right)
                    this.right.search (result, box);
            }
        }
    };
};
