"use strict";
/*
 * Peter James Bernante
 * CS472 - Project: WAP Online Dictionary
 * 14 Aug 2017
 * 
 * JS code for WAP Online Dictionary
 */

$(function () {
    var WORDNIK_API_KEY = "dbe49202a9e4589c5840a01b6de0fb3a4f5b13b7c2c73ad7d";
    
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
                // ajax returns very fast
                setTimeout(function () {
                    if (!isComplete) {
                        $("body").addClass("no-scroll");
                        $loader.appendTo("body");
                    }
                }, 200);
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
                $.get($s.data("url") + "/words.json/search/" + val, {
                    caseSensitive: false,
                    minCorpusCount: 5,
                    maxCorpusCount: -1,
                    minDictionaryCount: 1,
                    maxDictionaryCount: -1,
                    minLength: 1,
                    maxLength: -1,
                    skip: 0,
                    limit: 7,
                    api_key: WORDNIK_API_KEY
                }, function (data) {
                    data = data.searchResults.map(function (e) {
                        return e.word;
                    });                    
                    data = Array.from(new Set(data));
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
        
        loader.show();
        $s.focus().blur();
        
        $.get(url + "/word.json/" + word + "/definitions", {
            limit: 200,
            includeRelated: false,
            useCanonical: false,
            includeTags: false,
            api_key: WORDNIK_API_KEY
        }, function (data) {
            var $r = $("#result");
            
            if (data.length === 0) {
                var $p = $("<p>", {
                    "class": "not-found",
                    html: 'The word <q></q> is not in the dictionary.'
                });
                $p.find("q").text(word);
                $r.empty().append($p);
            } else {
                var $word = $("<h2>", {"class": "word"}).text(word),
                    $list = $("<ol>", {"class": "definition"});

                data.forEach(function (e) {
                    var $d = $("<li>", {text: e.text}),
                        $t = e.partOfSpeech ? 
                             $("<span>", {text: e.partOfSpeech}) : "";
                    $d.prepend($t).appendTo($list);
                });
                $r.empty().append($word).append($list);
            }
            $("body").scrollTop(0);
            $(".cover").removeClass("full");
        }).fail(function () {
            alert("There was an error!");
        }).always(function () {
            loader.hide();
            $s.select();
        });
    });
    
    (function () {
        $("#search").focus();
    })();

    // Preload loading image
    (new Image()).src = "images/loading.gif";
});