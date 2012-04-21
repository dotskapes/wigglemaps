/* Copyright 2011, Zack Krejci
 * Licensed under the MIT License
 */

var DEBUG = true;

gl = null;


function setContext (canvas) {
    if (!DEBUG) 
	gl = canvas.get (0).getContext ('experimental-webgl', {
	    alpha: false,
	    antialias: true
	    //premultipliedAlpha: false
	});
    else {
	function throwOnGLError(err, funcName, args) {
	    throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to " + funcName;
	};
	gl = WebGLDebugUtils.makeDebugContext(canvas.get (0).getContext ('experimental-webgl', {
	    alpha: false,
	    antialias: true
	}), throwOnGLError);
    }
};

function rect (x, y, w, h) {
    var verts = [
        x - w, y + h,
        x - w, y - h,
        x + w, y + h,
	
        x - w, y - h,
        x + w, y - h,
        x + w, y + h
    ];
    return verts;
};

function rectv (p1, p2) {
    var verts = [
        p1.x, p2.y,
        p1.x, p1.y,
        p2.x, p2.y,
	
        p1.x, p1.y,
        p2.x, p1.y,
        p2.x, p2.y
    ];
    return verts;
};

function makeProgram (path) {
    var shader = gl.createProgram();

    var vert_shader = getShader (gl.VERTEX_SHADER, path + '/vert.glsl');
    var frag_shader = getShader (gl.FRAGMENT_SHADER, path + '/frag.glsl');

    gl.attachShader(shader, vert_shader);
    gl.attachShader(shader, frag_shader);
    gl.linkProgram(shader);

    addVars (shader, vert_shader, frag_shader);
    //addVars (gl, shader, frag, vert_shader, frag_shader);

    return shader;
};

function getShader (type, path) {
    console.log (path);
    var shader = gl.createShader (type);

    $.ajax ({
	async: false,
	url: path,
	dataType: 'text',
	success: function (data) {
	    gl.shaderSource (shader, data);
	    gl.compileShader (shader);
	    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw (gl.getShaderInfoLog(shader));
	    }
	    shader.source = data;
	},
	error: function (xhr) {
	    console.log ("Could not load " + path);
	}
    });
    return shader;
};

function addVars (shader, vert, frag) {
    var uniforms = {};
    var attr = {};

    var u = (vert.source + frag.source).match (/((uniform)|(attribute)) (\w+) (\w+)/mg);
    var tex_count = 0;
    gl.useProgram (shader);
    if (u) {
	for (var i = 0; i < u.length; i ++) {
	    var v = u[i].split (' ');
	    console.log (v);
	    uniforms[v[2]] = {
		u: v[0],
		type: v[1],
		loc: null //gl.getUniformLocation (shader, v[2])
	    };
	    if (v[0] == 'uniform') {
		uniforms[v[2]].loc = gl.getUniformLocation (shader, v[2]);
	    }
	    else {
		var loc = gl.getAttribLocation (shader, v[2]);
		uniforms[v[2]].loc = loc;
	    }
	    if (v[1] == 'sampler2D') {
		uniforms[v[2]].tex = tex_count;
		tex_count ++;
	    }
	    console.log (uniforms);
	}
	shader.get = function (name) {
	    console.log (uniforms);
	    return uniforms[name].loc;
	}
	shader.data = function (name, data) {
	    var d = uniforms[name];
	    if (!d)
		throw "Could not find shader variable " + name;
	    if (d.u == 'uniform') {
		if (d.type == 'float')
		    gl.uniform1f (d.loc, data);
		else if (d.type == 'vec2')
		    gl.uniform2fv (d.loc, data);
		else if (d.type == 'ivec2')
		    gl.uniform2iv (d.loc, data);
		else if (d.type == 'vec3')
		    gl.uniform3fv (d.loc, data);
		else if (d.type == 'ivec3')
		    gl.uniform3iv (d.loc, data);
		else if (d.type == 'vec4')
		    gl.uniform4fv (d.loc, data);
		else if (d.type == 'ivec4')
		    gl.uniform4iv (d.loc, data);
		else if (d.type == 'bool')
		    gl.uniform1i (d.loc, data);
		else if (d.type == 'mat4')
		    gl.uniformMatrix4fv (d.loc, false, data);	
		else if (d.type == 'mat3')
		    gl.uniformMatrix3fv (d.loc, false, data);	
		else if (d.type == 'sampler2D') {
		    gl.activeTexture (gl['TEXTURE' + d.tex]); 
		    gl.bindTexture (gl.TEXTURE_2D, data);
		    gl.uniform1i (d.loc, d.tex);
		}
		else if (d.type == 'int')
		    gl.uniform1i (d.loc, data);
		else
		    throw "Unsupported Type for Shader Helper: " + d.type;
	    }
	    else if (d.u == 'attribute') {
		gl.enableVertexAttribArray (d.loc);
		gl.bindBuffer (gl.ARRAY_BUFFER, data);
		gl.vertexAttribPointer (d.loc, data.itemSize, gl.FLOAT, false, 0, 0);
	    }
	    else 
		throw "Type: " + d.u + " Recieved";
	};
    }
};

function repeats (data, itemSize, count) {
    var buffer = gl.createBuffer ();
    buffer.itemSize = itemSize;
    buffer.numItems = count;
    var float_data = new Float32Array (data.length * count * itemSize);
    for (var i = 0; i < count; i ++) {
	for (var j = 0; j < data.length; j ++) {
	    float_data[i * data.length + j] = data[j];
	}
    }
    gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
    gl.bufferData (gl.ARRAY_BUFFER, float_data, gl.STATIC_DRAW);
    gl.bindBuffer (gl.ARRAY_BUFFER, null);
    return buffer;
};

function staticBuffer (data, itemSize) {
    var buffer = gl.createBuffer ();
    var float_data = new Float32Array (data);
    gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
    buffer.itemSize = itemSize;
    buffer.numItems = data.length / itemSize;
    
    gl.bufferData (gl.ARRAY_BUFFER, float_data, gl.STATIC_DRAW);
    gl.bindBuffer (gl.ARRAY_BUFFER, null);
    return buffer;
};

function staticBufferJoin (data, itemSize) {
    var buffer = gl.createBuffer ();
    var count = 0;
    for (var i = 0; i < data.length; i ++) {
	count += data[i].length;
    }
    var float_data = new Float32Array (count);
    var index = 0;
    for (var i = 0; i < data.length; i ++) {
	for (var j = 0; j < data[i].length; j ++) {
	    float_data[index] = data[i][j];
	    index ++;
	}
    }
    gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
    buffer.itemSize = itemSize;
    buffer.numItems = count / itemSize;
    
    gl.bufferData (gl.ARRAY_BUFFER, float_data, gl.STATIC_DRAW);
    gl.bindBuffer (gl.ARRAY_BUFFER, null);
    return buffer;
};

function dynamicBuffer (items, itemSize) {
    var buffer = gl.createBuffer ();
    gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
    var float_data = new Float32Array (items * itemSize);
    buffer.itemSize = itemSize;
    buffer.numItems = items;
    
    buffer.update = function (data, index) {
        var float_data = new Float32Array (data);
	gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
        gl.bufferSubData (gl.ARRAY_BUFFER, 4 * index, float_data);		
	gl.bindBuffer (gl.ARRAY_BUFFER, null);
    }
    
    gl.bufferData (gl.ARRAY_BUFFER, float_data, gl.DYNAMIC_DRAW);
    gl.bindBuffer (gl.ARRAY_BUFFER, null);
    return buffer;
};

function indexBuffer (items, itemSize) {
    var buffer = gl.createBuffer ();
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, buffer);
    var float_data = new Uint16Array (items);
    buffer.itemSize = itemSize;
    buffer.numItems = items / itemSize;
    
    buffer.update = function (data, index) {
        var float_data = new Uint16Array (data);
	gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferSubData (gl.ELEMENT_ARRAY_BUFFER, 2 * index, float_data);		
	gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, null);
    }
    
    gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, float_data, gl.DYNAMIC_DRAW);
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, null);
    return buffer;
};

var tex_count = 0;
function getTexture (path, callback) {
    var tex = gl.createTexture ();
    tex.id = tex_count;
    tex_count ++;
    var img = new Image ();
    img.onload = function () {
	gl.bindTexture(gl.TEXTURE_2D, tex);  
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);  
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);  
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);  
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.generateMipmap(gl.TEXTURE_2D);  
	gl.bindTexture(gl.TEXTURE_2D, null);
	if (callback)
	    callback ();
    };
    img.src = path;
    return tex;
};