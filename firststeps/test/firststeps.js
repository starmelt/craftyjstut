window.onload = (function() {
    var WIDTH = 800,
        HEIGHT = 640;
    Crafty.init(WIDTH, HEIGHT);

    Crafty.c("Box", {
        init: function() {
            this.addComponent("2D, Canvas, Color, Fourway, Mouse, Tween");

            this.w = 32;    // width
            this.h = 32;    // height
            this.fourway(10);   // initalize 4-way movement

            this.bind("EnterFrame", function(e) {
                if (this._alpha < 0.1) {
                    this.destroy();
                }
            });

            this.bind("Click", function(e) {
                console.log(arguments);
                this.tween({alpha: 0.0}, 50);
            });
        },

        makeBox: function(x, y, color) {
            this.attr({x: x, y: y}).color(color);
        }
    });


    Crafty.e("Box").makeBox(160, 96, "#F00");
});
