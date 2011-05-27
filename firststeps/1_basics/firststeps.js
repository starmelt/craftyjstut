window.onload = (function() {
    var WIDTH = 800,
        HEIGHT = 640;
    Crafty.init(WIDTH, HEIGHT);
    Crafty.canvas();
    
    var pl = Crafty.e("2D, DOM, Color, Fourway")
                .attr({x: 160, y: 96, w: 32, h: 32})
                .color("#FF0000")
                .fourway(10);
    console.log(pl);
});
