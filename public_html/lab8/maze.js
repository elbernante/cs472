"use strict";

/* global $ */

$(document).ready(function () {
    var wallHit,
        enterEnd,
        didHit = false;

    wallHit = function () {
        didHit = true;
        $("#maze .boundary").addClass("youlose");
        enterEnd();
    };
    
    enterEnd = function () {
        var msg = didHit ? "Sorry, you lost. :[" : "You win :]";
        $("h2").text(msg);
        
        $("#maze").off("mouseleave", wallHit);
        $("#maze .boundary").off("mouseover", wallHit);
        $("#end").off("mouseover", enterEnd);
    };
    
    $("#start").on("click", function () {
        didHit = false;
        $("h2").text("Try not to hit a wall");
        $("#maze .boundary").removeClass("youlose");
        
        $("#maze").on("mouseleave", wallHit);
        $("#maze .boundary").on("mouseover", wallHit);
        $("#end").on("mouseover", enterEnd);
    });
});
