var SliderModel = Backbone.Model.extend ({
    defaults: {
        attr: [],
        index: 0
    },
    setIndex: function (index) {
        this.set ({
            index: index 
        });
    }
});

var Slider = Backbone.View.extend ({
    initialize: function (options) {
        var slider = this;

        this.model = new SliderModel (options);

        $ (window).on ('mouseup', function () {
            slider.stopDrag ();
        }).on ('mousemove', function (event) {
            slider.doDrag (vect (event.pageX, event.pageY));
        });

        this.render ();
    },
    className: 'slider',
    events: {
        'mousedown .bar': 'startDrag',
        //'mouseup .bar': 'stopDrag'
    },
    render: function () {
        this.$el.html ('<div class="exterior"><div class="bar"></div></div>');
        return this;
    },
    change: function (callback) {
        var slider = this;
        this.model.on ('change:index', function () {
            callback (slider.model.get ('index'));
            slider.moveBar ();
        });
    },
    dragging: false,
    startDrag: function () {
        this.dragging = true;
    },
    stopDrag: function () {
        this.dragging = false;
    },
    doDrag: function (p) {
        if (this.dragging) {
	    var index = this.sliderIndex (p.x);
            this.model.set ('index', index);
        }
    },
    sliderIndex: function (px) {
        var pos = vect (this.$el.offset ().left, this.$el.offset ().top + this.$el.height ());
        var units = this.model.get ('attr').length;
        var bar = this.$el.find ('.bar');
        var barWidth = bar.width ();
        var width = this.$el.find ('.exterior').width () - barWidth / 2;
	if (px <= pos.x)
	    return 0;
	if (px >= pos.x + width)
	    return units - 1;
	return Math.round (((px - pos.x) / width) * (units - 1));        
    },
    moveBar: function () {
        var bar = this.$el.find ('.bar');
        var barWidth = bar.width ();
        var width = this.$el.find ('.exterior').width () - barWidth;
        var units = this.model.get ('attr').length;
        var px = (width / (units - 1)) * this.model.get ('index');
        bar.css ('left', px);
    }
});
