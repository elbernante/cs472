
var didScrollMonitor = function () {
    var isAnimationInQueue = false;
    var banner = document.getElementsByClassName("banner")[0];
    var firstPoint = 50;
    var secondPoint = 200;
    
    var updateDisplay = function () {
         var scrollPoint = document.body.scrollTop || document.documentElement.scrollTop || 0;
         
        if (scrollPoint > secondPoint) {
            banner.classList.add("shrink");
            banner.classList.add("side");
        } else if (scrollPoint > firstPoint) {
            banner.classList.add("shrink");
            banner.classList.remove("side");
        } else {
            banner.classList.remove("shrink");
            banner.classList.remove("side");
        }
        isAnimationInQueue = false;
    };
    
    return function () {
        if (!isAnimationInQueue) {
            isAnimationInQueue = true;
            setTimeout(function () {
                updateDisplay();
            }, 250);
        }
    };
}();


window.onscroll = function() {
    didScrollMonitor();
};
