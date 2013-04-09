var Mouse = {
    x: 0,
    y: 0
};

$ (document).mousemove (function (event) {
    Mouse.x = event.clientX;
    Mouse.y = event.clientY;
    Mouse.lastMove = new Date ().getTime ();
});
