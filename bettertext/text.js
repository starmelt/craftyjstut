window.onload = (function() {
    var WIDTH = 800,
        HEIGHT = 640;
    // Initialize Crafty
    Crafty.init(WIDTH, HEIGHT);

    /**@
     * A Component that draws Text on a Canvas.
     */
    Crafty.c("SpriteText", {
        _registeredSpriteFonts: {},
        _defaultMapping: " !\"#$%&#'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_´" +
                            "abcdefghijklmnopqrstuvwxyz{|}~", // ASCII Characters 32-126
                            
        init: function() {  
        }, 
        /**@
         * Sets the Text.
         * @param text the Text
         */
        text: function(text) {
            if(text === null || text === undefined) return this._text;
            this._text = text;
            this.trigger("Change");
            return this;
        },
        /**@
         * Sets the Font.
         * @param font the Font
         */
        font: function(font) {
            this._font = font;
            this.trigger("Change");
            return this;
        },
        registerFont: function(fontName, tileSize, url, charMapping) {
            var img = this.image(url),
                w = Math.floor(img.img.naturalWidth / tileSize),
                h = Math.floor(img.img.naturalHeight / tileSize),
                mapping = charMapping || this._defaultMapping,
                spriteMap = {},
                currentChar,
                x, y;
            for (x = 0; x <= w; x++) {
                for (y = 0; y < h; y++) {
                    currentChar = mapping.charAt(x + y * w);
                    spriteMap[this.charName(fontName, currentChar)] = [x, y];
                }
            }
            Crafty.sprite(tileSize, url, spriteMap);
            this._registeredSpriteFonts[fontName] = tileSize;
            return this.font(fontName);
        },
        charName: function(font, ch) {
            return "_" + font + "_" + ch;
        }
        
    });
    
    var text = Crafty.e("2D, Canvas, Image, SpriteText")
                .attr({x: 160, y: 96, w: 32, h: 32})
                .registerFont("BlueBubble", 16, "../img/BlueBubbleFont.png")
                .text("Hello World!");
});
