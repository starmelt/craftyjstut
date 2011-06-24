/*
 * This is basically the same example as before, but the Box draws itself on the Canvas
 * instead of using a Bitmap Image.
 * Only the differences will be documented here. Please look at the previous example for
 * more detailed explanations.
 */
window.onload = (function() {
    var WIDTH = 800,
        HEIGHT = 640;
    Crafty.init(WIDTH, HEIGHT);

    Crafty.c("Box", {
        init: function() {
            this.addComponent("2D, Canvas, Color, Fourway, Mouse, Tween");

            this.w = 32;
            this.h = 32;
            this.fourway(10);

            /*
             * Define an event handler for the 'draw' event.
             * This is where we hook in our custom _draw() method.
             * The 'draw' event is triggered after the 'enterframe' event.
             */
            this.bind("Draw", function(obj) {
                // Pass the Canvas context and the drawing region.
                this._draw(obj.ctx, obj.pos);
            });
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
        /*
         * This is the method that gets called on 'draw' events.
         * It draws a Box on the Canvas context.
         *
         * Theoretically the method can draw anywhere on the Canvas context, but it
         * should only draw in the drawing region that is passed with the 'draw' event.
         *
         * @param ctx The Canvas context
         * @param po The drawing region
         */
        _draw: function(ctx, po) {
            var pos = {_x: po._x + 1, _y: po._y + 1, _w: po._w - 2, _h: po._h -2};

            ctx.fillStyle = this._color;
            ctx.fillRect(pos._x, pos._y, pos._w, pos._h);

            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgb(0,0,0)";
            ctx.beginPath();
            ctx.moveTo(pos._x, pos._y);
            ctx.lineTo(pos._x + pos._w, pos._y);
            ctx.lineTo(pos._x + pos._w, pos._y +  pos._h);
            ctx.lineTo(pos._x, pos._y +  pos._h);
            ctx.closePath();
            ctx.stroke();
            ctx.moveTo(pos._x, pos._y);
            ctx.lineTo(pos._x + pos._w, pos._y +  pos._h);
            ctx.stroke();
            ctx.moveTo(pos._x + pos._w, pos._y);
            ctx.lineTo(pos._x, pos._y +  pos._h);
            ctx.stroke();
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
