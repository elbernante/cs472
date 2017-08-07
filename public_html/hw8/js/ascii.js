"use strict";

/* global ANIMATIONS */
/* jslint plusplus: false */

/*
 * Peter James Bernante
 * CS472 - W3D1 - JavaScript and ASCII Animation Webpage
 * 07 Aug 2017
 * 
 * Set of function for animations
 */
(function () {
    /**
     * Returns DOM element with a specified ID.
     * 
     * @param {string} elemId - ID of the target element
     * @returns {Element}
     */
    var e = function (elemId) {
        return document.getElementById(elemId);
    };
        
    var f = function () {
        var timer = null,
            frames = [],
            currentFrame = 0,
            buffer = "",
            speed = 250;
        
        /**
         * Set the appropriate disabled sates of control elements.
         * 
         * @param {boolean} start - Indicates animation state.
         */
        var setElementStates = function (start) {
            e("btnStart").disabled = start;
            e("btnStop").disabled = !start;
            e("selAnimation").disabled = start;
        };
        
        /**
         * Stops the animation
         */
        var stopAnimation = function () {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        };
        
        /**
         * Starts the animation
         */
        var startAnimation = function () {
            stopAnimation();
            timer = setInterval(function () {
                e("textView").value = frames[currentFrame++ % frames.length];
            }, speed);
        };
        
        return {
            /**
             * Event handler for onclick start button
             */
            start: function () {
                setElementStates(true);
                buffer = e("textView").value;
                frames = buffer.split("=====\n");
                currentFrame = 0;
                startAnimation();
            },
            
            /**
             * Event handler for onclick stop button
             */
            stop: function () {
                stopAnimation();
                setElementStates(false);
                e("textView").value = buffer;
            },
            
            /**
             * Event handler for onchange event of the textarea.
             */
            textChange: function () {
                e("selAnimation").value = "CUSTOM";
                ANIMATIONS["CUSTOM"] = e("textView").value;
            },
            
            /**
             * Event handler for onchange event of select animation
             */
            animationChange: function () {
                e("textView").value = ANIMATIONS[e("selAnimation").value];
            },
            
            /**
             * Event handler for onchange event of select size
             */
            sizeChange: function () {
                e("textView").style.fontSize = e("selSize").value + 'pt';
            },
            
            /**
             * Event handler for onchange event of speed checkbox
             */
            speedChange: function () {
                speed = e("inputTurbo").checked ? 50 : 250;
                if (timer) {
                    startAnimation();
                }
            }
        };
    }();
    
    /**
     * Register control event handlers
     */
    window.onload = function () {
        e("btnStart").onclick = f.start;
        e("btnStop").onclick = f.stop;
        e("selAnimation").onchange = f.animationChange;
        e("selSize").onchange = f.sizeChange;
        e("inputTurbo").onchange = f.speedChange;
        e("textView").onchange = f.textChange;
    };
})();
