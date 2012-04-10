function Buffers (initial_size) {
    var data = {};
    
    var size;
    if (!initial_size)
	size = 256;
    else
	size = initial_size;

    var current = 0;

    var copy_array = function (dst, src, start, count) {
	if (!dst)
	    console.log ('ack');
	if (!start)
	    start = 0;
	if (!count)
	    count = src.length;
	for (var i = 0; i < count; i ++) {
	    dst[start + i] = src[i];
	}
    };

    var resize = function (min_expand) {
	var new_size = size;
	while (new_size < min_expand)
	    new_size *= 2;
	size = new_size;
	for (name in data) {
	    var new_array = new Float32Array (new_size * data[name].len);
	    var old_array = data[name].array;
	    var new_buffer = dynamicBuffer (size, data[name].len);
	    
	    copy_array (new_array, old_array);
	    data[name].array = new_array;
	    data[name].buffer = new_buffer;
	    data[name].dirty = true;
	}
    };

    this.create = function (name, len) {
	var array = new Float32Array (size * len);
	var buffer = dynamicBuffer (size, len);
	data[name] = {
	    array: array,
	    buffer: buffer,
	    len: len,
	    dirty: false
	};
    };

    this.alloc = function (num) {
	if ((current + num) >= size)
	    resize (current + num);
	var start = current;
	current += num;
	return start;
    };

    this.get = function (name) {
	return data[name].buffer;
    };

    this.write = function (name, array, start, count) {
	copy_array (data[name].array, array, start * data[name].len, count * data[name].len);
	data[name].dirty = true;
    };

    this.repeat = function (name, elem, start, count) {
	for (var i = 0; i < count; i ++) {
	    copy_array (data[name].array, elem, (start + i) * data[name].len, data[name].len);
	}
	data[name].dirty = true;	
    };

    this.count = function () {
	return current;
    };

    this.update = function (dt) {
	for (name in data) {
	    if (data[name].dirty) {
		data[name].buffer.update (data[name].array, 0);
		data[name].dirty = false;
	    }
	}
    };
};