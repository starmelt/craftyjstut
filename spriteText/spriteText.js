

    /**@
     * A Component that draws Text on a Canvas.
     */
    Crafty.c("SpriteText", {
        _defaultMapping: " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_´" +
                            "abcdefghijklmnopqrstuvwxyz{|}~", // ASCII Characters 32-126
                            
        init: function() {
            this._registeredSpriteFonts = {};
            this.bind("EnterFrame", function(obj) {
                var txt = this._text.split(""), // String to Array
                    tileSize = this._registeredSpriteFonts[this._font],
                    l, pos, type, e, ch;
                if (tileSize && this._oldText !== this._text) {
                    this._oldText = this._text;
                    for (i in this._entities) {
                        this._entities[i].destroy();
                    }
                    this._entities = [];
                    for (i in txt) {
                        l = txt[i];
                        posx = this.x + i * tileSize;
                        type = obj.type === "DOM" ? "DOM" : "Canvas";
                        ch = Crafty.e(this.charName(this._font, l))._image ? l : l.toUpperCase();
                        e = Crafty.e("2D, " + type + ", " + this.charName(this._font, ch))
                                .attr({x: posx, y: this.y, w: tileSize, h: tileSize});
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
            var img = Crafty.e("Image").image(url),
                w = Math.floor(img.img.naturalWidth / tileSize),
                h = Math.floor(img.img.naturalHeight / tileSize),
                mapping = charMapping || this._defaultMapping,
                spriteMap = {},
                currentChar,
                x, y;
            img.destroy(); // was only created to get width and height
            for (x = 0; x < w; x++) {
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

