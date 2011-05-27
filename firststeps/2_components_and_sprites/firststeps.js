window.onload = (function() {
    var WIDTH = 800,
        HEIGHT = 640;
    Crafty.init(WIDTH, HEIGHT);
    Crafty.canvas();

    Crafty.sprite(32, "../../img/crate.png", { crate: [0, 0]});

    Crafty.c("Box", {
        init: function() {
            this.addComponent("2D, Canvas, Color, Fourway, Mouse, Tween, crate");
            
            this.w = 32;
            this.h = 32;
            this.fourway(10);
            
            this.bind("enterframe", function(e) {
                if (this._alpha < 0.1) {
                    this.destroy();
                }
            });
            this.bind("click", function(e) {
                console.log(arguments);
                this.tween({alpha: 0.0}, 50);
            });
        },
        makeBox: function(x, y, color) {
            this.attr({x: x, y: y}).color(color);
        }
    });
    
    Crafty.e("Box").makeBox(160, 96, "#F00");
    Crafty.e("Box").makeBox(240, 96, "#0F0");
    Crafty.e("Box").makeBox(320, 96, "#FF0");
    Crafty.e("Box").makeBox(400, 96, "#F0F");
    Crafty.e("Box").makeBox(480, 96, "#0FF");
});
