"use strict";

var decorateText = function () {
    var textArea = document.getElementById("inputText");
    var currentSize = parseInt(window.getComputedStyle(textArea).fontSize);
    textArea.style.fontSize = (currentSize + 2) + "px";
};

var growText = function() {
    var interval = null;

    return function() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        } else {
            interval = setInterval(decorateText, 500);
        }
    };
}();

function applyBling() {
    var checkBox = document.getElementById("inputBling");
    var textArea = document.getElementById("inputText");
    var body = document.getElementsByTagName("body")[0];
    
    if (checkBox.checked) {
        textArea.style.fontWeight = "bold";
        textArea.style.color = "green";
        textArea.style.textDecoration = "underline";
        body.style.backgroundImage = "url(http://www.cs.washington.edu/education/courses/190m/CurrentQtr/labs/6/hundred-dollar-bill.jpg)";
    } else {
        textArea.style.fontWeight = "normal";
        textArea.style.color = "black";
        textArea.style.textDecoration = "none";
        body.style.backgroundImage = "none";
    }
}

function pigLatin() {
    var textArea = document.getElementById("inputText");
    var words = textArea.value.split(/([\s,\.?!])/);
    textArea.value = words.map(function(w) {
        return !w.match(/[a-zA-Z]/) ? w :
                w.match(/^[aeiouAEIOU]/) ? w + "ay" :
                w.split(/(^.)/).reverse().join("") + "ay";
    }).join("");
}

function malkovitch() {
    var textArea = document.getElementById("inputText");
    var words = textArea.value.split(/([\s,\.?!])/);
    textArea.value = words.map(function(w) {
        return w.length >= 5 ? "Malkovich" : w;
    }).join("");
}

window.onload = function () {
    document.getElementById("btnDecorate").onclick = growText;
    document.getElementById("inputBling").onchange = applyBling;
    document.getElementById("pigLatin").onclick = pigLatin;
    document.getElementById("malkovitch").onclick = malkovitch;
};