var SliderModel = Backbone.Model.extend({
    initialize: function() {
        this.on('change:pos', function() {
            this.set('index', this.pos2Index());
        });
    },
    defaults: {
        attr: [],
        index: 0,
        offset: 0,
        playing: false,
        pos: 0,
        dragging: false
    },
    pos2Index: function() {
        var pos = this.get('pos');
        var units = this.get('attr').length;
        return Math.round(pos * (units - 1));
    }
});

var Slider = Backbone.View.extend({
    initialize: function(options) {
        var slider = this;

        this.model = new SliderModel(options);

        $ (window).on('mouseup', function() {
            slider.stopDrag();
        }).on('mousemove', function(event) {
            slider.doDrag(vect(event.pageX, event.pageY));
        });

        this.model.on('change:playing', function() {
            slider.toggleAnimation();
        }).on('change:pos', function() {
            slider.moveBar();
        }).on('change:index', function() {
            slider.changeLabel();
        }).on('change:attr', function () {
            slider.changeLabel();
        });

        this.render();
    },
    className: 'slider',
    events: {
        'mousedown .bar': 'startDrag',
        'mousedown .play': 'togglePlay',
    },
    render: function() {
        this.$el.html(jade.templates['slider'] ({
            step: this.model.get('attr')[0]
        }));
        this.$bar = this.$el.find('.bar');
        return this;
    },
    change: function(callback) {
        var slider = this;
        this.model.on('change:index', function() {
            var index = this.get('index');
            callback(index);
        });
    },
    changeLabel: function() {
        var index = this.model.get('index');
        this.$el.find('.step').text(this.model.get('attr')[index]);
    },
    startDrag: function(event) {
        var p = vect(event.pageX, event.pageY)
        this.model.set('dragging', true);
        var offset = p.x - this.$bar.offset().left;
        this.model.set('offset', offset);
    },
    stopDrag: function() {
        this.model.set('dragging', false);
        var units = this.model.get('attr').length - 1;
    },
    doDrag: function(p) {
        if(this.model.get('dragging')) {
            var left = clamp(p.x - this.$bar.parent().offset().left - this.model.get('offset'), 0, this.$bar.parent().width() - this.$bar.width());
            this.model.set('pos', left / (this.$bar.parent().width() - this.$bar.width()));
        }
    },
    moveBar: function() {
        var left = this.model.get('pos') * (this.$bar.parent().width() - this.$bar.width())
        this.$bar.css('left', left);
    },
    togglePlay: function() {
        this.model.set('playing', !this.model.get('playing'));
    },
    interval: null,
    toggleAnimation: function() {
        var slider = this;
        var playing = this.model.get('playing');
        if (playing) {
            this.$el.find('.play').text('Pause');
            this.interval = setInterval(function() {
                if (!slider.model.get('dragging')) {
                    var pos = slider.model.get('pos');
                    var newPos = pos + 1.0 / (slider.model.get('attr').length * 25);
                    if (newPos >= 1.0)
                        newPos -= 1;
                    slider.model.set('pos', newPos);
                }
            }, 40);
        }
        else {
            this.$el.find('.play').text('Play');
            clearInterval(this.interval);
        }
            
    }
});
