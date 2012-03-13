if (! ('requestAnimationFrame' in window)) {
  if ('mozRequestAnimationFrame' in window)
    requestAnimationFrame = mozRequestAnimationFrame;
  else if ('webkitRequestAnimationFrame' in window)
    requestAnimationFrame = webkitRequestAnimationFrame;
}

function as_rgb (array) {
	console.log (array);
	return 'rgb(' + Math.round (array[0] * 255) + ',' + Math.round (array[1] * 255) + ',' + Math.round (array[2] * 255) + ')'
}

function Color (r, g, b, a) {
    if (r <= 1) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
    }
    else {
	this.r = r / 255;
	this.g = g / 255;
	this.b = b / 255;
	this.a = a / 255;
    }

    this.vect = function () {
	return [this.r, this.g, this.b, this.a];
    };
};
