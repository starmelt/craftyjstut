window.onload = (function() {
    var WIDTH = 800,
        HEIGHT = 640;
    Crafty.init(WIDTH, HEIGHT);
    Crafty.canvas();

    Crafty.c("Box", {
        init: function() {
            this.addComponent("2D, Canvas, Color, Fourway, Mouse, Tween");
            
            this.w = 32;
            this.h = 32;
            this.fourway(10);
            
            this.bind("draw", function(obj) {
                this._draw(obj.ctx, obj.pos);
            });
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
