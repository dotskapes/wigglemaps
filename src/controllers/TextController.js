var TextController = function(engine, settings) {
    var renderer = new TextRenderer(engine);

    this.append = function(string, options) {
        default_model (options, {
            priority: 0
        });

        renderer.append(string, options);

        //renderers.sort(function (a, b) {
        //    return b.priority - a.priority;
        //});
    };

    this.draw = function(engine, dt) {
        renderer.draw(engine, dt);
        /*var drawn = [];
        $.each(renderers, function(i, renderer) {
            var rbox = renderer.bbox();
            for (var i = 0; i < drawn.length; i ++) {
                if (drawn[i].bbox().intersects(rbox)) {
                    return false;
                }
            }
            renderer.draw(engine, dt);
            drawn.push(renderer);
        });*/
    };
};
