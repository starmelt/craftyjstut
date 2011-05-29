window.onload = (function() {
    var WIDTH = 800,
        HEIGHT = 640,
        BOX_WIDTH = 32,
        BOX_HEIGHT = 32,
        BOARD_TOP = 100,
        BOARD_LEFT = 160,
        BOARD_ROWS = 10,
        BOARD_COLS = 16,
        TWEEN_FRAMES = 15;

    var score = 0;

    Crafty.init(WIDTH, HEIGHT);
    Crafty.canvas();

    /*
     * Loads the Sprite PNG and create the only sprite 'crate' from it
     */
    Crafty.sprite(32, "../../img/crate.png", { crate: [0, 0]});

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

            this.bind("click", function(obj) {
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

    Crafty.c("Board", {
        /* The list of colors used for the game */
        COLORS: ["#F00", "#0F0", "#FF0", "#F0F", "#0FF"],
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
            this.scoreLabel = Crafty.e("2D, DOM, Text")
                                .attr({x: BOARD_LEFT, y: BOARD_TOP - 30, w: 50, h: 30}).text("Score: ");
            this.scoreEnt = Crafty.e("2D, DOM, Text")
                                .attr({x: BOARD_LEFT + 50, y: BOARD_TOP - 30, w: 100, h: 30});
            this.bind("enterframe", function(obj) {
                this.scoreEnt.text(""+score);
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
                    var color = this.COLORS[Crafty.randRange(0, 4)];
                    return Crafty.e("Box").makeBox(pos.x, pos.y, color, _.bind(this._clickHandler, this));
                }, this);
                return column;
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
            }
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
            var filter = function(el) { return !el._flagged };

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
            };
            flagInternal([aPos], this._board);
        }
    });
    
    Crafty.scene("Game", function() {

        // Create the board
        Crafty.e("Board");
    });

    Crafty.scene("PlayAgain", function() {
        var width = BOARD_COLS * BOX_WIDTH,
            height = BOARD_ROWS * BOX_HEIGHT
            bg = Crafty.e("2D, Canvas, Color, Mouse")
                .attr({x: BOARD_LEFT, y: BOARD_TOP, w: width, h: height})
                .color("#F7941E");
        
        bg.bind("draw", function(obj) {
            function drawTextCentered(ctx, text, y) {
                ctx.save();
                ctx.font = "20pt Helvetica";
                ctx.fillStyle = "#000";
                ctx.strokeStyle = "#f00";
                ctx.translate(BOARD_LEFT + width / 2, y);
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(text, 0, 0);
                ctx.restore();
                ctx.stroke();
            }
            var ctx = obj.ctx;
            var vcenter = BOARD_TOP + height / 2;
            drawTextCentered(ctx, "Your Score is", vcenter - 50); 
            drawTextCentered(ctx, "" + score, vcenter);
            drawTextCentered(ctx, "Click to Play Again!", vcenter + 80);
        });

        bg.bind("click", function() {
            Crafty.scene("Game");
        });
    });

    Crafty.scene("Game");
});

