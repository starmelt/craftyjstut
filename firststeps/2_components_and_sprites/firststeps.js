window.onload = (function() {
    var WIDTH = 800,
        HEIGHT = 640;
    Crafty.init(WIDTH, HEIGHT);
    Crafty.canvas();

    /*
     * Create Sprites of size 32 from the PNG file.
     * There is only one Sprite in the file. It is mostly transparent
     * so the background color will shine through it.
     */
    Crafty.sprite(32, "../../img/crate.png", { crate: [0, 0]});

    /**
     * This is a simple component, a Box, which again gets capabilities from these 
     * other components:
     *  - 2D, Canvas: can be drawn on a Canvas
     *  - Color: has a Background Color
     *  - Fourway: can be moved with WASD and arrow keys
     *  - Mouse: reacts on mouse events, like click
     *  - Tween: simple animation, used here for fading out after mouse click
     *  - crate: That's the Sprite defined above, not really a JS component
     */
    Crafty.c("Box", {
        init: function() {
            this.addComponent("2D, Canvas, Color, Fourway, Mouse, Tween, crate");
            
            this.w = 32;    // width
            this.h = 32;    // height
            this.fourway(10);   // initalize 4-way movement
            
            /*
             * An 'enterframe' event is created by Crafty for every frame that is
             * created. Components should update their status in the phase.
             * Here we check if the alpha gradient is < 0.1, in which case the 
             * entity gets destroyed.
             * The alpha value gets changed by the Tween component.
             */
            this.bind("enterframe", function(e) {
                if (this._alpha < 0.1) {
                    this.destroy();
                }
            });
            /*
             * This defines the handler method for mouse clicks.
             * Here we tell the entity to gradually change its alpha gradient to 0.0.
             * This is done with the Tween component and it takes 50 frames from 1.0 to 0.0.
             */
            this.bind("click", function(e) {
                console.log(arguments);
                this.tween({alpha: 0.0}, 50);
            });
        },
        /**
         * Convenience method which sets the box position and color
         */
        makeBox: function(x, y, color) {
            this.attr({x: x, y: y}).color(color);
        }
    });
    
    // create 5 boxes of different colors and place them on the canvas
    Crafty.e("Box").makeBox(160, 96, "#F00");
    Crafty.e("Box").makeBox(240, 96, "#0F0");
    Crafty.e("Box").makeBox(320, 96, "#FF0");
    Crafty.e("Box").makeBox(400, 96, "#F0F");
    Crafty.e("Box").makeBox(480, 96, "#0FF");
});
