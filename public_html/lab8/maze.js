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
        $("#status").text(msg);
        
        $("#maze").off("mouseleave", wallHit);
        $("#maze .boundary").off("mouseover", wallHit);
        $("#end").off("mouseover", enterEnd);
    };
    
    $("#start").on("click", function () {
        didHit = false;
        $("#status").text("Try not to hit a wall");
        $("#maze .boundary").removeClass("youlose");
        
        $("#maze").on("mouseleave", wallHit);
        $("#maze .boundary").on("mouseover", wallHit);
        $("#end").on("mouseover", enterEnd);
    });
});
