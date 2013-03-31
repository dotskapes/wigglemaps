var triangulate_polygon = function (elem) {
    var poly = [];
    var tri = [];
    for (var k = 0; k < elem.length; k++) {
        var p = [];
        //for (var i = elem[k].length - 1; i >= 1; i --) {
        if (elem[k].length <= 3) {
            tri.push (elem[k]);
        }
        else {
            for (var i = 1; i < elem[k].length; i ++) {
                p.push (rand_map (elem[k][i][0], elem[k][i][1]));
            }
        }
        p.push (poly[0]);
        poly.push (p);
    }
    var triangles = trapezoid_polygon (poly);
    for (var i = 0; i < tri.length; i ++) {
        triangles.push (tri[i][0][0]);
        triangles.push (tri[i][0][1]);

        triangles.push (tri[i][1][0]);
        triangles.push (tri[i][1][1]);

        triangles.push (tri[i][2][0]);
        triangles.push (tri[i][2][1]);
    }
    return triangles;
};

function circle (index, length) {
    while (index >= length)
        index -= length;
    while (index < 0)
        index += length;
    return index
};

function Vertex (current, upper, lower, index) {
    this.current = current;
    this.upper = upper;
    this.lower = lower;
    this.index = index;
};

function xsearch (sweep, poly, index) {
    var upper = sweep.length - 1;
    var lower = 0;
    var current = parseInt ((sweep.length - 1) / 2);
    if (sweep.length == 0) {
        return 0;
    }
    while (true) {
        if (upper < 0 || lower >= sweep.length) {
            console.log (upper, lower, current, sweep.length);
            throw "Index Out of Bounds";
        }
        if (sweep[current] == index) {
            return current;
        }
        if (upper == lower) {
            if (poly[sweep[current]].x > poly[index].x) {
                return current;
            }
            else {
                return current + 1;
            }
        }
        if (poly[sweep[current]].x > poly[index].x) {
            upper = current;
        }
        else if (poly[sweep[current]].x < poly[index].x) {
            lower = current + 1;
        }
        else {
            if (poly[sweep[current]].y > poly[index].y) {
                if (lower == current)
                    return lower;
                upper = current - 1;
            }
            else {
                if (upper == current)
                    return current;
                lower = current + 1;
            }
        }
        current = parseInt ((upper + lower) / 2);
    }
};

function set_contains (sweep, index) {
    for (var i = 0; i < sweep.length; i ++) {
        if (sweep[i] == index)
            return true;
    }
    return false;
};

function solvex (poly, index, slice) {
    if (index == undefined)
        throw "whoa";
    if ((poly[index + 1].y - poly[index].y) == 0)
        return Math.min (poly[index].x, poly[index + 1].x);
    var t = (slice - poly[index].y) / (poly[index + 1].y - poly[index].y);
    //console.log ('t', slice, poly[index + 1].y,  poly[index].y, t);
    return poly[index].x + (poly[index + 1].x - poly[index].x) * t;
};

function find_index (sweep, index) {
    for (var i = 0; i < sweep.length; i ++) {
        if (sweep[i] == index)
            return i;
    }
    return false;
};

function sorted_index (sweep, poly, xpos, slice) {
    for (var i = 0; i < sweep.length; i ++) {
        var sxpos = solvex (poly, sweep[i], slice);
        //console.log (sweep[i], index, xpos, sxpos);
        if (sxpos > xpos)
            return i;
        if (sxpos - xpos == 0) {
            //console.log ('same', sweep[i], index, poly[sweep[i]].y, poly[index].y);
            if (poly[sweep[i]].y > poly[index].y)
                return i;
        }
    }
    //console.log ('biggest');
    return sweep.length;
};
    
function intersect (v, poly, index) {
    return new vect (solvex (poly, index, poly[v].y), poly[v].y);
};

function add_point (trap, a) {
    if (!a)
        throw "eek";
    trap.push (a.x);
    trap.push (a.y);
    //trap.push (1.0);
}

function add_trap (trap, bottom, top) {
    if (!bottom || !top || ((top.length + bottom.length != 3) && (top.length + bottom.length != 4)))
        throw "ahh";
    if ((bottom.length + top.length) == 3) {
        for (var i = 0; i < bottom.length; i ++) {
            add_point (trap, bottom[i]);
        }
        for (var i = 0; i < top.length; i ++) {
            add_point (trap, top[i]);
        }
    }
    else {
        if (bottom[1].x < bottom[0].x) {
            var tmp = bottom[0];
            bottom[0] = bottom[1];
            bottom[1] = tmp;
        }
        if (top[1].x < top[0].x) {
            var tmp = top[0];
            top[0] = top[1];
            top[1] = tmp;
        }
        
        add_point (trap, bottom[0]);
        add_point (trap, bottom[1]);
        add_point (trap, top[1]);

        add_point (trap, top[0]);
        add_point (trap, top[1]);
        add_point (trap, bottom[0]);
    }
};

function trapezoid_polygon (poly_in) {
    var vertices = [];
    var count = 0;
    var poly = [];
    for (var k = 0; k < poly_in.length; k ++) {
        for (var i = 0; i < poly_in[k].length - 1; i ++) {
            var j = circle (i + 1, poly_in[k].length - 1);
            var h = circle (i - 1, poly_in[k].length - 1);
            vertices.push (new Vertex (i + count, j + count, h + count, k));
            poly.push (poly_in[k][i]);
        }
        poly.push (poly_in[k][0]);
        count += poly_in[k].length;
    }
    vertices.sort (function (a, b) {
        return poly[a.current].y - poly[b.current].y;
    });
    var sweep = [];
    var state = [];
    var lower = new vect (-200, 0);
    var upper = new vect (200, 0);
    var count = 0
    var pairs = [];
    var change = 0;
    var trap = [];
    for (var i = 0; i < vertices.length; i ++) {
        var v = vertices[i];
        var l_in = set_contains (sweep, v.lower);
        var u_in = set_contains (sweep, v.current);

        var l_pos, u_pos;
        if (l_in && !u_in) {
            l_pos = find_index (sweep, v.lower);
            u_pos = l_pos;
        }
        else if (u_in && !l_in) {
            u_pos = find_index (sweep, v.current);
            l_pos = u_pos;
        }
        else if (l_in && u_in) {
            l_pos = find_index (sweep, v.lower);
            u_pos = find_index (sweep, v.current);
        }
        else if (!l_in && !u_in) {
            u_pos = sorted_index (sweep, poly, poly[v.current].x, poly[v.current].y);
            l_pos = u_pos;
        }

        if (Math.abs (l_pos - u_pos) > 1) {
            for (var j = 0; j < sweep.length; j ++) {
                //console.log (solvex (poly, sweep[j], poly[v.current].y));
            }
            //console.log ('prev', solvex (poly, v.lower, poly[v.current].y));
            //console.log ('current', solvex (poly, v.current, poly[v.current].y));
            throw "Bad";
        }

        //var above_in = poly[v.upper].x >= poly[v.current].x;
        var above_in = vect.left (poly[v.lower], poly[v.current], poly[v.upper]);
        //console.log (above_in, poly[v.upper].x - poly[v.current].x);

        var s_index = Math.floor (Math.min (l_pos, u_pos) / 2);

        if (!above_in && !l_in && !u_in) {
            //console.log ('pos1', v.current, u_pos, l_pos);
            add_trap (trap, state[s_index], [intersect (v.current, poly, sweep[u_pos - 1]), intersect (v.current, poly, sweep[u_pos])]);
            state.splice (s_index, 1, [intersect (v.current, poly, sweep[u_pos - 1]), poly[v.current]], 
                          [poly[v.current], intersect (v.current, poly, sweep[l_pos])]);            
        }
        else if (above_in && !l_in && !u_in) {
            state.splice (s_index, 0, [poly[v.current]]);
        }
        else if (l_in && !u_in) {
            add_trap (trap, state[s_index], [intersect (v.current, poly, sweep[Math.max (l_pos, u_pos) - 1]), poly[v.current]]);
            state[s_index] = [intersect (v.current, poly, sweep[Math.min (l_pos, u_pos) - 1]), poly[v.current]];
        }
        else if (!l_in && u_in) {
            add_trap (trap, state[s_index], [poly[v.current], intersect (v.current, poly, sweep[Math.min (u_pos, l_pos) + 1])]);
            state[s_index] = [poly[v.current], intersect (v.current, poly, sweep[Math.max (u_pos, l_pos) + 1])];
        }
        else if (!above_in && l_in && u_in) {
            
            add_trap (trap, state[s_index], [intersect (v.current, poly, sweep[Math.min (l_pos, u_pos) - 1]), poly[v.current]]);
            add_trap (trap, state[s_index + 1], [intersect (v.current, poly, sweep[Math.max (l_pos, u_pos) + 1]), poly[v.current]]);

            state.splice (s_index, 2, [intersect (v.current, poly, sweep[Math.min (l_pos, u_pos) - 1]), intersect (v.current, poly, sweep[Math.max (l_pos, u_pos) + 1])]);
        }
        else if (above_in && l_in && u_in) {
            //console.log ('pos6', u_pos, l_pos);
            add_trap (trap, state[s_index], [poly[v.current]]);
            state.splice (s_index, 1);      
        }

        if (l_in && !u_in) {
            sweep[l_pos] = v.current;
        }
        else if (u_in && !l_in) {
            sweep[u_pos] = v.lower;
        }
        else if (l_in && u_in) {
            sweep.splice (find_index (sweep, v.lower), 1);
            sweep.splice (find_index (sweep, v.current), 1);
        }
        else if (!l_in && !u_in) {
            //if (poly[v.lower].x > poly[v.upper].x)
            if (!above_in)
                sweep.splice (l_pos, 0, v.current, v.lower);
            else
                sweep.splice (l_pos, 0, v.lower, v.current);
        }

        for (var j = 0; j < sweep.length - 1; j ++) {
            if (solvex (poly, sweep[j], poly[v.current].y) > solvex (poly, sweep[j + 1], poly[v.current].y)) {
                //console.log (solvex (poly, sweep[j], poly[v.current].y), solvex (poly, sweep[j + 1], poly[v.current].y));
                console.log ('Misplaced Sweep');
                throw "Misplace!";
            }
        }

    }
    if (sweep.length > 0) {
        console.log (sweep);
        throw "Bad " + sweep.length;
    }
    //console.log (change);
    if (pairs.length > 0) {
        console.log (pairs);
        throw "Wrong";
    }
    return trap;
    
};
