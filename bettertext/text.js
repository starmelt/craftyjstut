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
        _defaultMapping: " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_´" +
                            "abcdefghijklmnopqrstuvwxyz{|}~", // ASCII Characters 32-126
        _entities: [],
        _oldText: "",
                            
        init: function() {
            this.bind("EnterFrame", function(obj) {
                var txt = this._text.split(""), // String to Array
                    tileSize = this._registeredSpriteFonts[this._font],
                    l, pos, type, e, ch;
                if (tileSize && this._oldText !== this._text) {
                    this._oldText = this._text;
                    for (i in this._entities) {
                        this._entities[i].destroy();
                    }
                    for (i in txt) {
                        l = txt[i];
                        pos = {x: this.x + i * tileSize, y: this.y + tileSize};
                        type = obj.type === "DOM" ? "DOM" : "Canvas";
                        ch = Crafty.e(this.charName(this._font, l))._image ? l : l.toUpperCase();
                        console.log(ch + ", " + pos.x);
                        e = Crafty.e("2D, " + type + ", " + this.charName(this._font, ch))
                                .attr({x: pos.x, y: pos.y, w: tileSize, h: tileSize});
                        //console.log(e);
                        this._entities.push(e);
                    }
                }
            });
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
            for (x = 0; x < w; x++) {
                for (y = 0; y < h; y++) {
                    currentChar = mapping.charAt(x + y * w);
                    spriteMap[this.charName(fontName, currentChar)] = [x, y];
                }
            }
            console.log(spriteMap);
            Crafty.sprite(tileSize, url, spriteMap);
            this._registeredSpriteFonts[fontName] = tileSize;
            return this.font(fontName);
        },
        charName: function(font, ch) {
            return "_" + font + "_" + ch;
        }
        
    });
    
    var text = Crafty.e("2D, Canvas, Image, Mouse, SpriteText")
                .attr({x: 160, y: 96, w: 32, h: 32})
                .registerFont("BlueBubble", 16, "../img/BlueBubbleFont.png")
                .text("Hello World!");
                
    text.bind("Click", function (e) {
        console.log("!!");
        text.text("clicked!");
    });
});
