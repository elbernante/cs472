"use strict";

$(function () {
    var B_WIDTH = 4,
        blank_idx = 15,
        tileClick;
    
    // Converts an index to a(x, y) coordinate or point
    var toXY = function (i, toPoint) {
        var f = toPoint ? 100 : 1;
        return {x: (i % B_WIDTH) * f, 
                y: Math.floor(i / B_WIDTH) * f};
    };
    
    // Converts an (x, y) coordinate to index;
    var toIndex = function (p) {
        return p.x + p.y * B_WIDTH;
    };
    
    // Moves a tile to correct location based on index
    var moveTo = function ($e, idx) {
        var p = toXY(idx, true);
        $e.attr("data-idx", idx).css({left: p.x + "px", top: p.y + "px"});        
    };
    
    // Returns the indexes movable tiles
    var getMovables = function () {
        var p = toXY(blank_idx),
            n = [{x: p.x, y: p.y - 1},
                 {x: p.x - 1, y: p.y}, 
                 {x: p.x + 1, y: p.y},
                 {x: p.x, y: p.y + 1}];

        return n.filter(function (o) {
            return o.x >= 0 && o.y >= 0 && o.x < B_WIDTH && o.y < B_WIDTH;
        }).map(toIndex);  
    };
    
    // Updates the movable tiles
    var updateMovables = function () {
        $(".movablepiece").removeClass("movablepiece").off("click", tileClick);
        getMovables().forEach(function (idx) {
            var $e = $(".puzzlepiece[data-idx=" + idx + "]");
            $e.addClass("movablepiece").on("click", tileClick);
        });
    };
    
    // Checks if the puzzle is solved
    var isSolved = function () {
        return $(".puzzlepiece").get().every(function (e) {
            return $(e).data("value") === parseInt($(e).attr("data-idx"), 10) + 1;
        });
    };
    
    // Click event handler of tiles
    var tileClick = function () {
        var idx = $(this).attr("data-idx");
        moveTo($(this), blank_idx);
        blank_idx = idx;
        updateMovables();
        if (isSolved()) {
            setTimeout(function () {
                alert("Congratulations! You solved the puzzle!");
            }, 150);
        }
    };

    // Checks if a puzzle board arrangement is solvable based
    // inversions and polarity
    var isSolvable = function (tiles) {
        var blankTile = tiles.findIndex(function (e) {
            return e.val === 0;
        });
        
        var inversions = tiles.reduce(function (acc, e, i, a) {
            return acc + a.slice(i + 1).reduce(function (cnt, e2) {
                return cnt + ((e2.val > 0 && e2.val < e.val) ? 1 : 0);
            }, 0);
        }, 0);
        
        return (inversions - toXY(blankTile).y + 1) % 2 === 0;
    };
    
    // Shuffles the tiles in the puzzle board
    var shuffle = function () {
        var tiles = [],
            swap = function (arr, i, j) {
                var tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            };
        // Get current tile locations
        $("#puzzlearea div").each(function () {
            tiles[$(this).attr("data-idx")] = {val: $(this).data("value"),
                                               e: $(this)};
        });
        tiles[blank_idx] = {val: 0, e: null};
        
        // Randomly shuffle tiles
        var j = tiles.length;
        while (j-- > 1) {
            swap(tiles, j, Math.floor(Math.random() * (j + 1)));
        }
        
        // Apply correction if tile arrangement is not solvable
        if (!isSolvable(tiles)) {
            var i = (tiles[0].val && tiles[1].val) ? 0 : tiles.length - 2;
            swap(tiles, i, i + 1);
        }
        
        // Update new location of tiles
        tiles.forEach(function (e, i) {
            if (e.val) {
                moveTo(e.e, i);
            } else {
                blank_idx = i;
            }
        });
        
        updateMovables();
    };
    
    // Initilize puzzle board
    (function () {
        $("#puzzlearea div").each(function (i, e) {
            var p = toXY(i, true);
            $(e).data("value", i + 1).addClass("puzzlepiece");
            $(e).css("background-position", -p.x + "px " + -p.y + "px");
            moveTo($(e), i);
        });
        updateMovables();
    })();
    
    $("#shufflebutton").on("click", shuffle);
});
