"use strict";
/*
 * Peter James Bernante
 * CS472 - Project: WAP Online Dictionary
 * 14 Aug 2017
 * 
 * JS code for WAP Online Dictionary
 */

$(function () {
    
    // Initialize custon search input control
    (function () {
        var $s = $("input[data-role='search']").addClass("search"),
            $wrapper = $("<div>", {"class": "search-wrapper"}),
            $btn = $("<div>", {"class": "search-button",
                                role: "button",
                                tabindex: "0"});
                            
        var doSearch = function () {
            $s.trigger("search");
        };
        
        $s.on("keydown", function (e) {
            if (e.which === 13) {
                doSearch();
            }
        });
        $btn.on("click", doSearch);
        $btn.on("keydown", function (e) {
            if (e.which === 13 || e.which === 32) {
                doSearch();
            }
        });
        $wrapper.insertBefore($s).append($s).append($btn);
    })();
    
    // Ajax loading UI handler
    var loader = (function () {
        var isComplete = true,
            $loader = $("<div>", {"class": "loader"});
        return {
            show: function () {
                isComplete = false;
                
                // Allow short delay to prevent ugly glitch when
                // ajax returns very
                setTimeout(function () {
                    if (!isComplete) {
                        $("body").addClass("no-scroll");
                        $loader.appendTo("body");
                    }
                }, 100);
            },
            hide: function () {
                isComplete = true;
                $("body").removeClass("no-scroll");
                $loader.remove();
            }
        };
    })();
    
    // Show loading image while ajax request is on progress
    $(document).ajaxStart(function () {
        loader.show();
        $("#search").focus().blur();
    }).ajaxComplete(function () {
        loader.hide();
        $(".cover").removeClass("full");
        $("#search").select();
    });
    

    // Search event handler
    $("#search").on("search", function () {
        var $s = $(this),
            url = $s.data("url"),
            word = $s.val().trim();
        
        if (word.length === 0) {
            return;
        }
        
        $.get(url, {w: word}, function (data) {
            var $r = $("#result");
            
            if (data.definitions.length === 0) {
                var $p = $("<p>", {
                    "class": "not-found",
                    html: 'The word <q></q> is not in the dictionary.'
                });
                $p.find("q").text(data.word);
                $r.empty().append($p);
            } else {
                var $word = $("<h2>", {"class": "word"}).text(data.word),
                    $list = $("<ol>", {"class": "definition"});

                data.definitions.forEach(function (e, i) {
                    var $d = $("<li>", {text: e.d}),
                        $t = $("<span>", {text: e.t});
                    $d.prepend($t).appendTo($list);
                });
                $r.empty().append($word).append($list);
            }
        }).fail(function () {
            alert("There was an error!");
        });
    });
    
    (function () {
        $("#search").focus();
    })();
});