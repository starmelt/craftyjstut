/*!
* SpriteText Component for CraftyJS
* https://github.com/starmelt/craftyjstut
*
* Copyright 2011 by starmelt. 
* Dual licensed under the MIT or GPL Version 2 licenses.
*/

/**@
 * #SpriteText
 * @category Graphics
 * A Component that draws Text using a SpriteFont. Works on Canvas and DOM!
 */
Crafty.c("SpriteText", {
    _defaultMapping: " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_´" +
                        "abcdefghijklmnopqrstuvwxyz{|}~", // ASCII Characters 32-126
    _registeredSpriteFonts: {},
    
    init: function() {
        this.bind("Change", function(obj) {
            var tileSize = this._registeredSpriteFonts[this._font],
                txt, l, pos, type, e, chExists, ch, startx, textwidth;
            if (tileSize && this._text && this._changed) {
                txt = this._text.split(""); // String to Array
                // destroy entities from previous rendering
                for (i in this._entities) {
                    this._entities[i].destroy();
                }
                this._entities = [];
                
                // create new entities
                startx = this.x;
                textwidth = this._text.length * tileSize;
                if (this._align === "center") startx += (this.w - textwidth) / 2;
                if (this._align === "right") startx += (this.w - textwidth);
                for (i in txt) {
                    l = txt[i];
                    posx = startx + i * tileSize;
                    type = this.has("DOM") ? "DOM" : "Canvas";
                    chExists = this.charName(this._font, l) in Crafty.components(); // check if letter exists in Sprite
                    ch = chExists ? l : l.toUpperCase(); // if letter does not exist, try uppercase
                    e = Crafty.e("2D, " + type + ", " + this.charName(this._font, ch)) // create entity for the letter
                            .attr({x: posx, y: this.y, z: this.z , w: tileSize, h: tileSize});
                    this._entities.push(e);
                }
            }
        });
    }, 
    /**@
     * Sets the Text.
     * @param text the Text
     * @return entity, if parameter was passed, current value otherwise
     */
    text: function(text) {
        if(text === undefined) return this._text;
        if (this._text != text) {
            this._text = "" + text;
            this.trigger("Change");
        }
        return this;
    },
    /**@
     * Sets the Font.
     * @param font the Font
     * @return entity, if parameter was passed, current value otherwise
     */
    font: function(font) {
        if(font === undefined) return this._font;
        if (this._font != font) {
            this._font = font;
            this.trigger("Change");
        }
        return this;
    },
    /**@
     * Sets the Alignment (left, center, right)
     * @param align the Alignment
     * @return entity, if parameter was passed, current value otherwise
     */
    align: function(align) {
        if(align === undefined) return this._align;
        if (this._align != align) {
            this._align = align;
            this.trigger("Change");
        }
        return this;
    },
    /**@
     * Registers and sets a new Font so it can be used in the SpriteText component.
     * Fonts are only registered once and are then usably from every SpriteText entity.
     * @param fontName The name of the Font
     * @param tileSize The tile size of the font. Both height and width of the font.
     * @param url The image URL for the font sprite
     * @param charMapping If the characters in the Image are not in ASCII order, use a custom charMapping (optional)
     */
    registerFont: function(fontName, tileSize, url, charMapping) {
        if (!this._registeredSpriteFonts[fontName]) {
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
        }
        return this.font(fontName);
    },
    /**@
     * Creates the name of the Sprite entity from Font name and Char name
     * @param font name of the font
     * @param ch the character
     * @returns name of the Sprite
     */
    charName: function(font, ch) {
        return "_" + font + "_" + ch;
    }
});

