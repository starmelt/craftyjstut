/**
 * A small exercise in parallax scrolling.
 * Pleas look at http://en.wikipedia.org/wiki/Parallax_scrolling for more information on the topic.
 * Wikipedia is also the source for the images used here.
 */
window.onload = (function() {
    var WIDTH = 640, HEIGHT = 480;
    var IMG_GROUND = "../img/Ground_front_layer.png",
        IMG_VEG = "../img/Vegetation_middle_layer.png",
        IMG_SKY = "../img/Sky_back_layer.png";
    Crafty.init(WIDTH, HEIGHT);
    
    /* Load the images and then create the Scroller */
    Crafty.load([IMG_GROUND, IMG_SKY, IMG_VEG], function() {
        
        Crafty.c("Scroller", {
            init: function() {
                /* Create an Entity for every image.
                 * The "repeat" is essential here as the Entity's width is 3x the canvas width (which equals
                 * the width of the original image).
                 */
                this._bgImage = Crafty.e("2D, DOM, Image").image(IMG_SKY, "repeat")
                                        .attr({x:0, y:0, w: WIDTH * 3, h:HEIGHT});
                this._mdImage = Crafty.e("2D, DOM, Image").image(IMG_VEG, "repeat")
                                        .attr({x:0, y:0, w: WIDTH * 3, h:HEIGHT});
                this._fgImage = Crafty.e("2D, DOM, Image").image(IMG_GROUND, "repeat")
                                        .attr({x:0, y:0, w: WIDTH * 3, h:HEIGHT});
                                        
                /* Move the image entities to the left (by different offsets) on every 'EnterFrame'
                 * Also, if we move them too far, adjust by adding one image width 
                 */
                this.bind("EnterFrame", function() {
                    this._bgImage.x -= 2;
                    this._mdImage.x -= 3;
                    this._fgImage.x -= 5;
                    if (this._bgImage.x < -WIDTH) this._bgImage.x += WIDTH;
                    if (this._mdImage.x < -WIDTH) this._mdImage.x += WIDTH;
                    if (this._fgImage.x < -WIDTH) this._fgImage.x += WIDTH;
                });
            }
        });
        
        
        Crafty.e("Scroller");
    });
});
