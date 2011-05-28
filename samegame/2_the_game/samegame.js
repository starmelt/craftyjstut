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
    Crafty.canvas();

    Crafty.sprite(32, "../../img/crate.png", { crate: [0, 0]});

    Crafty.c("Box", {
        init: function() {
            this.addComponent("2D, Canvas, Color, Mouse, crate");
            
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
        makeBox: function(x, y, color, onClickCallback) {
            this.attr({x: x, y: y}).color(color);
            this._onClickCallback = onClickCallback;
            return this;
        }
    });

    Crafty.c("Board", {
        COLORS: ["#F00", "#0F0", "#FF0", "#F0F", "#0FF"],
        init: function() {
            this.addComponent("2D, Canvas, Color");
            this.x = BOARD_LEFT;
            this.y = BOARD_TOP;
            this.w = BOX_WIDTH * BOARD_COLS;
            this.h = BOX_HEIGHT * BOARD_ROWS;
            this.color("#888");
            this._setupBoard(BOARD_LEFT, BOARD_TOP, BOARD_ROWS, BOARD_COLS, BOX_WIDTH, BOX_HEIGHT);

            this.bind("enterframe", function(e) {
                if (this._board._dirty === true) {
                    this._board._dirty = false;
                }
            });
        },
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
        _computeBoxPos: function(x, y, col, row, bw, bh) {
            return {
                x: x + col * bh,
                y: y + (bh * BOARD_ROWS - (row + 1) * bh)
            }
        },
        _clickHandler: function(obj) {
            var aPos = this._translateToArrayPos(obj.x, obj.y);
            this._flagConnectedBoxes(aPos, obj.color);
            this._purgeColumns();
            this._moveBoxesToNewPositions();
        },
        _translateToArrayPos: function(x, y) {
            return {
                x: Math.floor((x - BOARD_LEFT) / BOX_WIDTH),
                y: (BOARD_ROWS - 1) - Math.floor((y - BOARD_TOP) / BOX_HEIGHT)
            };
        },
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
        _flagConnectedBoxes: function(aPos, color) {
            function flagInternal(aPosList, board) {
                if (aPosList.length === 0) return;
                var head = aPosList[0], tail = aPosList.slice(1);
                var currentBox = board[head.x][head.y];
                if (currentBox && !currentBox._flagged && currentBox._color === color) {
                    currentBox._flagged = true;
                    board._dirty = true;
                    if (head.y > 0) 
                        tail.push({ x: head.x, y: head.y - 1 });
                    if (head.y < (board[head.x].length - 1)) 
                        tail.push({ x: head.x, y: head.y + 1 });
                    if (head.x > 0) 
                        tail.push({ x: head.x - 1, y: head.y});
                    if (head.x < (board.length - 1)) 
                        tail.push({ x: head.x + 1, y: head.y});
                }
                flagInternal(tail, board);
            };
            flagInternal([aPos], this._board);
        }
    });
    
    Crafty.e("Board");
});

