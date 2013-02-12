(function ($) {
    $.fn.scrollable = function (h) {
	var $this = this;
	var current_height = $this.innerHeight ();
	var top_level = $('<div></div>');
	var container = $('<div></div>').addClass ('scroll-container').height (h);
	var scrollbar = $('<div></div>').addClass ('scrollbar').height (h);	
	var scroll_ob = $('<div></div>').addClass ('scroll-ob');
	scrollbar.append (scroll_ob);
	scroll_ob.draggable ({
	    containment: 'parent',
	    axis: 'y'
	});
	top_level.insertBefore ($this);
	top_level.append (scrollbar).append (container);
	$this.remove ();
	container.append ($this);
	
	var tracking = false;
	
	scroll_ob.mousedown (function (event) {
	    tracking = true;
	});
	
	$ (document).bind ('mouseup', function (event) {
	    tracking = false;
	});
	
	$ (document).bind ('mousemove', function (event) {
	    if (tracking) {
		var per = (scroll_ob.position ().top - scrollbar.position ().top) / (scrollbar.innerHeight () - scroll_ob.innerHeight ());
		$this.css ('margin-top', -per * (current_height - h));
	    }
	});	
	return $this;
    };
}) (jQuery);

function unscroll (ob) {
	ob.parent ().parent ().remove ();
}