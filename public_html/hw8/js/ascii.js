"use strict";

/* global ANIMATIONS */
/* jslint plusplus: false */

(function () {
    var e = function (elemId) {
        return document.getElementById(elemId);
    };
        
    var f = function () {
        var timer = null,
            frames = [],
            currentFrame = 0,
            buffer = "",
            speed = 250;
        
        var setElementStates = function (start) {
            e("btnStart").disabled = start;
            e("btnStop").disabled = !start;
            e("selAnimation").disabled = start;
        };
        
        var stopAnimation = function () {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        };
        
        var startAnimation = function () {
            stopAnimation();
            timer = setInterval(function () {
                e("textView").value = frames[currentFrame++ % frames.length];
            }, speed);
        };
        
        return {
            start: function () {
                setElementStates(true);
                buffer = e("textView").value;
                frames = buffer.split("=====\n");
                currentFrame = 0;
                startAnimation();
            },
            
            stop: function () {
                stopAnimation();
                setElementStates(false);
                e("textView").value = buffer;
            },
            
            textChange: function () {
                e("selAnimation").value = "CUSTOM";
                ANIMATIONS["CUSTOM"] = e("textView").value;
            },
            
            animationChange: function () {
                e("textView").value = ANIMATIONS[e("selAnimation").value];
            },
            
            sizeChange: function () {
                e("textView").style.fontSize = e("selSize").value + 'pt';
            },
            
            speedChange: function () {
                speed = e("inputTurbo").checked ? 50 : 250;
                if (timer) {
                    startAnimation();
                }
            }
        };
    }();
    
    window.onload = function () {
        e("btnStart").onclick = f.start;
        e("btnStop").onclick = f.stop;
        e("selAnimation").onchange = f.animationChange;
        e("selSize").onchange = f.sizeChange;
        e("inputTurbo").onchange = f.speedChange;
        e("textView").onchange = f.textChange;
    };
})();
