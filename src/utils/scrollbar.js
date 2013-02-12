(function ($) {
    $.fn.scrollable = function (h) {
	var $this = this;
	var current_height = $this.children ().first ().innerHeight ();
	//var top_level = $('<div></div>');
	//var container = $('<div></div>').addClass ('scroll-container').height (h);
	var scrollbar = $('<div></div>').addClass ('scrollbar').height (h);	
	var scroll_ob = $('<div></div>').addClass ('scroll-ob');
	scroll_ob.css ({
	    position: 'absolute'
	});
	scrollbar.css ({
	    position: 'absolute',
	    top: $this.position ().top,
	    left: $this.position ().left + $this.innerWidth () - 10,
	    'z-index': 99
	});
	scrollbar.append (scroll_ob);
	/*scroll_ob.draggable ({
	    containment: 'parent',
	    axis: 'y'
	});*/
	//top_level.insertBefore ($this);
	//top_level.append (scrollbar).append (container);
	$ ('body').append (scrollbar);
	$this.css ({
	    height: h,
	    overflow: 'hidden'
	});
	//$this.remove ();
	//container.append ($this);
	
	var tracking = false;
	
	scroll_ob.bind ('mousedown', function (event) {
	    tracking = true;
	});
	
	$ (document).bind ('mouseup', function (event) {
	    tracking = false;
	});
	
	$ (document).bind ('mousemove', function (event) {
	    if (tracking) {
		var pos = event.pageY - scrollbar.position ().top;
		if (pos < 0)
		    pos = 0;
		if (pos > (h - scroll_ob.innerHeight ()))
		    pos = h - scroll_ob.innerHeight ();
		scroll_ob.css ({
		    top: pos
		});
		var per = (scroll_ob.position ().top - scrollbar.position ().top) / (scrollbar.innerHeight () - scroll_ob.innerHeight ());
		$this.children ().first ().css ('margin-top', -per * (current_height - h));
	    }
	});	
	return $this;
    };
}) (jQuery);

function unscroll (ob) {
    //ob.parent ().parent ().remove ();
}