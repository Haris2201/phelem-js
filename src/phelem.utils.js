//// phelem.utils.js ////

// namespace
Phelem.utils = {};

Phelem.utils.round = function(number, to) {
    return Math.round(number * to) / to;
};

Phelem.utils.requestAnimationFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) { window.setTimeout(callback, 1000/60) }).bind(window);
