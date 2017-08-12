"use strict";

$(function () {
    var toXY = function (i) {
        return {x: i % 4, y: Math.floor(i / 4)}; 
    }; 
    
    var toI = function (p) {
        return p.x + p.y * 4;
    };
    
    // Tile class - represents a single tile in the puzzle board
    var Tile = function (idx, val, elem, callback) {
        this.val = val;
        this.elem = elem;
        this.idx = idx;
        this.movable = false;

        if (this.elem) {
            var p = this.getXY();
            this.elem.addClass("puzzlepiece");
            this.elem.css("background-position", -p.x + "px " + (-p.y) + "px");
            this.updateDisplay();
            
            var self = this;
            this.elem.on("click", function () {
                callback(self);
            });
        }
    };
    
    // Sets or returns the current index of this tile
    Tile.prototype.index = function (index) {
        if (index === undefined) {
            return this.idx;
        }
        this.idx = index;
        this.updateDisplay();
    };
    
    // Sets or returns the movable state of this tile
    Tile.prototype.isMovable = function (canMove) {
        if (canMove === undefined) {
            return this.movable;
        }
        this.movable = canMove;
        this.elem.toggleClass("movablepiece", canMove);
    };
    
    // Returns the (x, y) coordinate of this tile
    Tile.prototype.getXY = function () {
        var p = toXY(this.idx);
        return { x: p.x * 100, y: p.y * 100 };
    };
    
    // Updates the position of the tile in the screen
    Tile.prototype.updateDisplay = function () {
        if (this.elem) {
            var p = this.getXY();
            this.elem.css({left: p.x + "px", top: p.y + "px"});
        }
    };
    
    
    // Puzzle class - represent the puzzle board
    var Puzzle = function (boardId) {
        this.boardId = boardId;
        this.tiles = [];
        this.movables = [];
        
        var self = this;
        $(this.boardId).find("div").each(function (i) {
            self.tiles.push(new Tile(i, i + 1, $(this), function (e) {
                self.tileClick(e);
            }));
        });
        
        this.space = new Tile(this.tiles.length, 0);
        this.tiles.push(this.space);
        this.updateMovables();
    };

    // Swaps the positions of 2 tiles
    Puzzle.prototype.swap = function (i, j) {
        var t = this.tiles,
            m = t[i].index(),
            n = t[j].index(),
            temp = t[i];
    
        t[i] = t[j];
        t[j] = temp;
        t[i].index(m);
        t[j].index(n);
    };
    
    
    // Shuffles the tiles
    Puzzle.prototype.shuffle = function () {
        var c = this.tiles.length;
        while (c-- > 1) {
            this.swap(c, Math.floor(Math.random() * (c + 1)));
        }

        if (!this.isSolvable()) {
            var t = this.tiles,
                i = (t[0].val && t[1].val) ? 0 : t.length - 2;
            this.swap(i, i + 1);
        }

        this.updateMovables();
    };
    
    // Sets/Removes movable states of tiles around the blank tile
    Puzzle.prototype.updateMovables = function () {
        var self = this,
            i = this.space.index(),
            setM = function (v) {
                self.movables.forEach(function (e) {
                    e.isMovable(v);
                });        
            };
        
        
        setM(false);
        this.movables = this.getNeighbors(i).map(function (idx) {
            return self.tiles[idx];
        });
        setM(true);
    };
    
    // Checks if the board is solvable by determining
    // its total iversions and polarity
    Puzzle.prototype.isSolvable = function () {
        var inversions = this.tiles.reduce(function (acc, e, i, a) {
            return acc + a.slice(i + 1).reduce(function (acc2, e2) {
                return acc2 + (e2.val > 0 && e2.val < e.val) ? 1 : 0;
            } , 0);
        }, 0);
        
        var h = Math.sqrt(this.tiles.length),
            r = toXY(this.space.index()).y + 1;

        return (inversions + h - r) % 2 === 0;
    };
    
    // Checks if the board is solved
    Puzzle.prototype.isSolved = function () {
        return this.tiles.every(function (e, i) {
            return !e.val || i + 1 === e.val;
        });
    };
    
    // Returns the top, left, right, and down adjacent tiles
    Puzzle.prototype.getNeighbors = function (i) {
        var p = toXY(i),
            w = Math.sqrt(this.tiles.length),
            n = [{x: p.x, y: p.y - 1},
                 {x: p.x - 1, y: p.y}, 
                 {x: p.x + 1, y: p.y},
                 {x: p.x, y: p.y + 1}];

        return n.filter(function (o) {
            return o.x >= 0 && o.y >= 0 && o.x < w && o.y < w;
        }).map(toI);
    };
    
    // Event handler when a tile is clicked
    Puzzle.prototype.tileClick = function (e) {
        if (e.isMovable()) {
            this.swap(this.space.index(), e.index());
            this.updateMovables();
            
            if (this.isSolved()) {
                setTimeout(function () {
                    alert("Congratulations! You solved the puzzle!");
                }, 150);
            }
        }
    };
    
    var puzzle = new Puzzle("#puzzlearea");
    
    $("#shufflebutton").on("click", function () {
        puzzle.shuffle();
    });
});
