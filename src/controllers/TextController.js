var TextController = function(engine, settings) {
    var renderers = [];

    this.append = function(string, options) {
        default_model (options, {
            priority: 0
        });

        var renderer = new TextRenderer(engine, string, options);
        renderers.push(renderer);

        renderers.sort(function (a, b) {
            return b.priority - a.priority;
        });
    };

    this.draw = function(engine, dt) {
        //var drawn = [];
        $.each(renderers, function(i, renderer) {
            /*var rbox = renderer.bbox();
            for (var i = 0; i < drawn.length; i ++) {
                if (drawn[i].bbox().intersects(rbox)) {
                    return false;
                }
            }*/
            renderer.draw(engine, dt);
            //drawn.push(renderer);
        });
    };
};
