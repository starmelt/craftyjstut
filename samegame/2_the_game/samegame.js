window.onload = (function() {
    var WIDTH = 800,
        HEIGHT = 640,
        BOX_WIDTH = 32,
        BOX_HEIGHT = 32,
        BOARD_TOP = 100,
        BOARD_LEFT = 160,
        BOARD_ROWS = 10,
        BOARD_COLS = 16;
    Crafty.init(WIDTH, HEIGHT);

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
            this.addComponent("2D, Canvas, Color, Mouse, crate");

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
        },
        /**
         * Set up the board.
         * The board is an Array of columns, which again is an Array of Boxes.
         */
        _setupBoard: function(x, y, rows, cols, bw, bh) {
            this._board = [];
            for (var c = 0; c < cols; c++) {
                this._board[c] = [];
                for (var r = 0; r < rows; r++) {
                    var that = this;
                    var pos = this._computeBoxPos(x, y, c, r, BOX_WIDTH, BOX_HEIGHT);
                    var newBox = Crafty.e("Box").makeBox(pos.x
                                        , pos.y
                                        , this.COLORS[Crafty.randRange(0, 4)]
                                        , function () {
                                            // bind to 'this' context
                                            that._clickHandler.apply(that, arguments);
                                        });
                    this._board[c][r] = newBox;
                }
            }
        },
        /**
         * Computes the coordinates for a box.
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
            var aPos = this._translateToArrayPos(obj.x, obj.y);
            this._flagConnectedBoxes(aPos, obj.color);
            this._purgeColumns();
            this._moveBoxesToNewPositions();
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
            for (var c = 0; c < this._board.length; c++) {
                var column = this._board[c];
                for (var r = 0; r < column.length; r++) {
                    var el = column[r];
                    var pos = this._computeBoxPos(BOARD_LEFT, BOARD_TOP, c, r, BOX_WIDTH, BOX_HEIGHT);
                    el.x = pos.x;
                    el.y = pos.y;
                }
            }
        },
        /**
         * Remove flagged boxes from the columns and empty columns from the board
         */
        _purgeColumns: function() {
            var newBoard = []
            for (var c = 0; c < this._board.length; c++) {
                var column = this._board[c];
                var newCol = [];
                for (var r = 0; r < column.length; r++) {
                    var el = column[r];
                    if (el._flagged) {
                        el.destroy();
                    } else {
                        newCol.push(el);
                    }
                }
                if (newCol.length > 0) {
                    newBoard.push(newCol);
                }
            }
            this._board = newBoard;
        },
        /**
         * Flags the passed Box and all connected Boxes of the same color by adding a new property '_flagged = true'.
         * @param aPos Array position of clicked Box
         * @param color color of clicked Box
         */
        _flagConnectedBoxes: function(aPos, color) {
            function flagInternal(aPosList, board) {
                if (aPosList.length === 0) return;
                var head = aPosList[0], tail = aPosList.slice(1);
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

    // Create the board
    Crafty.e("Board");
});
