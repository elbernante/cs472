"use strict";
/*
 * Peter James Bernante
 * CS472 - Project: WAP Online Dictionary
 * 14 Aug 2017
 * 
 * JS code for WAP Online Dictionary
 */

$(function () {
    
    // Initialize custom search input control
    (function () {
        var $s = $("input[data-role='search']").addClass("search"),
            $wrapper = $("<div>", {"class": "search-wrapper"}),
            $btn = $("<div>", {"class": "search-button",
                                role: "button",
                                tabindex: "0"}),
            $suggest = $("<ul>", {"class": "search-suggest"}),
            suggestions = [],
            selectedSuggestion = 0,
            suggestVisible = false;
                            
        var doSearch = function () {
            $s.trigger("search");
        };
        
        var showSuggestions = function () {
            suggestVisible = true;
            if (suggestions.length > 0) {
                $suggest.show();
            } else {
                $suggest.hide();
            }
        };
        
        var hideSuggestions = function () {
            suggestVisible = false;
            $suggest.hide();
        };
        
        var setSelected = function (i) {
            if (i > -1) {
                selectedSuggestion = i;
                showSuggestions();
                $s.parent().find(".search-suggest li.selected").removeClass("selected");
                $s.parent().find(".search-suggest li").eq(selectedSuggestion).addClass("selected");
                $s.val(suggestions[selectedSuggestion]);
            }
        };
        
        var updateSelected = function (i) {
            var n = selectedSuggestion + i,
                m = suggestions.length;
            i = (m > 0) ? ((n % m) + m) % m : -1;
            setSelected(i);
        };
        
        $s.data("suggest", function (items) {
            suggestions = items;
            selectedSuggestion = -1;
            $suggest.empty();
            suggestions.forEach(function (e, i) {
                $("<li>", {text: e}).on("mousedown", function () {
                    setSelected(i);
                    doSearch();
                }).appendTo($suggest);
            });
            if (suggestVisible) {
                showSuggestions();
            }
        });
        
        $s.on("keydown", function (e) {
            if (e.which === 13) { // enter key
                doSearch();
                hideSuggestions();
            } else if (e.which === 27) { // esc key
                hideSuggestions();
            } else if (e.which === 38 || e.which === 40) { // up and down keys
                updateSelected(e.which === 38 ? -1 : 1);
                e.preventDefault();
            } else {
                showSuggestions();
            }
        });
        
        $s.on("blur", function () {
            hideSuggestions();
        });
        
        $btn.on("click", doSearch);
        $btn.on("keydown", function (e) {
            if (e.which === 13 || e.which === 32) { // enter key or space bar
                doSearch();
            }
        });
        $wrapper.insertBefore($s).append($s).append($btn).append($suggest);
    })();
    
    $.fn.extend({
        suggest: function (items) {
            if (this.data("suggest")) {
                this.data("suggest")(items);
            }
            return this;
        }
    });
    
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

    // Handler for word suggestions
    $("#search").on("input", (function () {
        var seqId = 0,
            cache = {};
        
        var getWords = function ($s, qId) {
            var val = $s.val().toLowerCase();
            if (!cache[val]) {
                $.get($s.data("url"), {p: val}, function (data) {
                    cache[val] = data;
                    if (seqId === qId) {
                        $s.suggest(data);
                    }
                });
            } else {
                $s.suggest(cache[val]);
            }
        };
         
        return function () {
            var $s = $(this);
            if ($s.val().trim() === "") {
                $s.suggest([]);
            } else {
                seqId += 1;
                getWords($s, seqId);
            }
        };
    })());
    
    // Search event handler
    $("#search").on("search", function () {
        var $s = $(this),
            url = $s.data("url"),
            word = $s.val().trim();
        
        if (word.length === 0) {
            return;
        }
        
        $.get(url, {w: word}, function (data) {
            loader.show();
            $s.focus().blur();
            
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

                data.definitions.forEach(function (e) {
                    var $d = $("<li>", {text: e.d}),
                        $t = e.t ? $("<span>", {text: e.t}) : "";
                    $d.prepend($t).appendTo($list);
                });
                $r.empty().append($word).append($list);
            }
            $("body").scrollTop(0);
        }).fail(function () {
            alert("There was an error!");
        }).always(function () {
            loader.hide();
            $(".cover").removeClass("full");
            $s.select();
        });
    });
    
    (function () {
        $("#search").focus();
    })();
});