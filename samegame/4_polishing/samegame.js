window.onload = (function() {
    var WIDTH = 800,
        HEIGHT = 640,
        BOX_WIDTH = 32,
        BOX_HEIGHT = 32,
        BOARD_TOP = 100,
        BOARD_LEFT = 160,
        BOARD_ROWS = 10,
        BOARD_COLS = 16,
        TWEEN_FRAMES = 15,
        FONT = "24px sans-serif";

    var score = 0;

    Crafty.init(WIDTH, HEIGHT);

    /*
     * Loads the Sprite PNG and create the only sprite 'crate' from it
     */
    Crafty.sprite(32, "../../img/crate.png", { crate: [0, 0]});

    /**@
     * A Component that draws Text on a Canvas.
     */
    Crafty.c("CanvasText", {
        _align: "left",
        /* Setting ready = true is necessary! It will not be drawn at all otherwise! */
        ready: true,
        /*
         * CanvasText depends on 2D and Canvas, so add them here in `init`.
         * Also add a handler for the 'draw' element which does the actual drawing
         * of the Text.
         */
        init: function() {
            this.addComponent("2D, Canvas");

            this.bind("Draw", function(obj) {
                var ctx = obj.ctx;
                var tx = this.x;
                if (this._align === "right") tx += this.w;
                if (this._align === "center") tx += this.w / 2;
                ctx.save();
                ctx.font = this._font;
                ctx.fillStyle = "#000";
                ctx.translate(tx, this.y + this.h);
                ctx.textAlign = this._align;
                ctx.textBaseline = "bottom";
                ctx.fillText(this._text, 0, 0);
                ctx.restore();
                ctx.stroke();
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
        /**@
         * Sets the Alignment.
         * @param align the Alignment (left, right, center). Default is left.
         */
        align: function(align) {
            this._align = align;
            this.trigger("Change");
            return this;
        }
    });

    /**
     * The 'Box' component.
     * The component defines how to draw itself: 2D, Canvas, Color, use the sprite 'create'.
     * It also binds the mouse click (using the 'Mouse' component) and calls the onClickCallback function when clicked
     */
    Crafty.c("Box", {
        /**
         * Initialisation. Adds components, sets positions, binds mouse click handler
         */
        init: function() {
            this.addComponent("2D, Canvas, Color, Mouse, Tween, crate");

            this.w = BOX_WIDTH;
            this.h = BOX_HEIGHT;

            this.bind("Click", function(obj) {
                if (this._onClickCallback) this._onClickCallback({
                    x: obj.realX,
                    y: obj.realY,
                    color: this._color
                });
            });
        },
        /**
         * Convenience method for creating new boxes
         * @param x position on the x axis
         * @param y position on the y axis
         * @param color background color
         * @param onClickCallback a callback function that is called for mouse click events
         */
        makeBox: function(x, y, color, onClickCallback) {
            this.attr({x: x, y: y}).color(color);
            this._onClickCallback = onClickCallback;
            return this;
        }
    });

    /**
     * The Game 'Board' Component that includes the game logic.
     */
    Crafty.c("Board", {
        /* The list of colors used for the game */
        COLORS: ["#F00", "#0F0", "#FF0", "#F0F"],
        /**
         * Initialisation. Adds components, sets positions, creates the board
         */
        init: function() {
            this.addComponent("2D, Canvas, Color");
            this.x = BOARD_LEFT;
            this.y = BOARD_TOP;
            this.w = BOX_WIDTH * BOARD_COLS;
            this.h = BOX_HEIGHT * BOARD_ROWS;
            this.color("#888");
            this._setupBoard(BOARD_LEFT, BOARD_TOP, BOARD_ROWS, BOARD_COLS, BOX_WIDTH, BOX_HEIGHT);

            score = 0;
            this.scoreLabel = Crafty.e("CanvasText")
                                .attr({x: BOARD_LEFT, y: BOARD_TOP - 30, w: 100, h: 30})
                                .font(FONT)
                                .text("Score: ");
            this.scoreEnt = Crafty.e("CanvasText")
                                .attr({x: BOARD_LEFT + 100, y: BOARD_TOP - 30, w: 60, h: 30})
                                .font(FONT)
                                .align("right");
            this.bind("EnterFrame", function(obj) {
                this.scoreEnt.text(score);
            });
        },
        /**
         * Set up the board.
         * The board is an Array of columns, which again is an Array of Boxes.
         */
        _setupBoard: function(x, y, rows, cols, bw, bh) {
            this._board = _.range(cols).map(function(c) {
                return _.range(rows).map(function(r) {
                    var pos = this._computeBoxPos(x, y, c, r, BOX_WIDTH, BOX_HEIGHT);
                    var color = this.COLORS[Crafty.randRange(0, this.COLORS.length - 1)];
                    return Crafty.e("Box").makeBox(pos.x, pos.y, color, _.bind(this._clickHandler, this));
                }, this);
            }, this);
        },
        /**
         * Computes the coordinates for a box.<F5>
         * @param x the left side of the board
         * @param y the top of the board
         * @param col the column of the box
         * @param row the row of the box
         * @param bw box width
         * @param bh box height
         */
        _computeBoxPos: function(x, y, col, row, bw, bh) {
            return {
                x: x + col * bh,
                y: y + (bh * BOARD_ROWS - (row + 1) * bh)
            };
        },
        /**
         * The callback click handler that is passed to the boxes
         */
        _clickHandler: function(obj) {
            var frame = Crafty.frame();
            if (!this._blockUntil || this._blockUntil < frame) {
                var aPos = this._translateToArrayPos(obj.x, obj.y);
                this._flagConnectedBoxes(aPos, obj.color);
                this._purgeColumns();
                this._moveBoxesToNewPositions();
            }
        },
        /**
         * Convert mouse coordinates into board position.
         * Box (0,0) is in the left bottom corner, while coordinate (0,0) is in the left top!!
         */
        _translateToArrayPos: function(x, y) {
            return {
                x: Math.floor((x - BOARD_LEFT) / BOX_WIDTH),
                y: (BOARD_ROWS - 1) - Math.floor((y - BOARD_TOP) / BOX_HEIGHT)
            };
        },
        /**
         * Iterate through all boxes and set new coordinates
         */
        _moveBoxesToNewPositions: function() {
            _(this._board).each(function(column, c) {
                _(column).each(function(box, r) {
                    var pos = this._computeBoxPos(BOARD_LEFT, BOARD_TOP, c, r, BOX_WIDTH, BOX_HEIGHT);
                    this._blockUntil = Crafty.frame() + TWEEN_FRAMES;
                    box.tween({x: pos.x, y: pos.y}, TWEEN_FRAMES);
                }, this);
            }, this);
        },
        /**
         * Remove flagged boxes from the columns and empty columns from the board
         */
        _purgeColumns: function() {
            var filter = function(el) { return !el._flagged; };

            var count =_(this._board).chain().flatten().reject(filter).value().length;
            score += (count === 1) ? -1000 : (count * count * 10);

            _(this._board).each(function(column, c) {
                _(column).chain().reject(filter, this).each(function (el) {
                    el.destroy()
                }, this);
            }, this);

            this._board = _(this._board).chain().map(function(column, c) {
                return _(column).select(filter);
            }, this).reject(function(column) {
                return _(column).isEmpty();
            }, this).value();

            if (_(this._board).isEmpty()) Crafty.scene("PlayAgain");
        },
        /**
         * Flags the passed Box and all connected Boxes of the same color by adding a new property '_flagged = true'.
         * @param aPos Array position of clicked Box
         * @param color color of clicked Box
         */
        _flagConnectedBoxes: function(aPos, color) {
            function flagInternal(aPosList, board) {
                if (_(aPosList).isEmpty()) return;
                var head = _(aPosList).head(),
                    tail = _(aPosList).rest();
                if (board[head.x]) {
                    var currentBox = board[head.x][head.y];
                    if (currentBox && !currentBox._flagged && currentBox._color === color) {
                        currentBox._flagged = true;
                        tail.push({ x: head.x, y: head.y - 1 });
                        tail.push({ x: head.x, y: head.y + 1 });
                        tail.push({ x: head.x - 1, y: head.y});
                        tail.push({ x: head.x + 1, y: head.y});
                    }
                }
                flagInternal(tail, board);
            }
            flagInternal([aPos], this._board);
        }
    });

    /*
     * We are using two Scenes:
     *  - the first one is the Game itself and is displayed when loading the page
     *  - the second one is the 'Play Again?' Scene, that shows the score and
     *    restarts the game on mouse click
     */
    Crafty.scene("Game", function() {
        Crafty.e("Board");
    });

    /*
     * The PlayAgain scene looks pretty ugly, sorry. :)
     */
    Crafty.scene("PlayAgain", function() {
        var width = BOARD_COLS * BOX_WIDTH,
            height = BOARD_ROWS * BOX_HEIGHT,
            vcenter = BOARD_TOP + height / 2,
            bg = Crafty.e("2D, Canvas, Color, Mouse")
                .attr({x: BOARD_LEFT, y: BOARD_TOP, w: width, h: height})
                .color("#F7941E");

        Crafty.e("CanvasText")
                        .attr({x: BOARD_LEFT, y: vcenter - 70, w: width, h: 30})
                        .font(FONT)
                        .align("center")
                        .text("Your Score is");
        Crafty.e("CanvasText")
                        .attr({x: BOARD_LEFT, y: vcenter, w: width, h: 30})
                        .font(FONT)
                        .align("center")
                        .text(score);
        Crafty.e("CanvasText")
                        .attr({x: BOARD_LEFT, y: vcenter + 80, w: width, h: 30})
                        .font(FONT)
                        .align("center")
                        .text("Click to Play Again!");

        bg.bind("Click", function() {
            Crafty.scene("Game");
        });
    });

    // start with the Game scene
    Crafty.scene("Game");
});
