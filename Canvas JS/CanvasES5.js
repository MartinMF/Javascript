'use strict';

/* A Canvas Element of id 'cvs' must be in the html body
   The Canvas width/height is set to screen width/height
   by default
*/

/**************************[TEMPLATE]***************************/
var update_fps = function() {
    fps.innerHTML = Math.round(1000/(Date.now()-now));
    now = Date.now();
};

var init_fps = function() {
    fps = document.createElement("a");
    fps.style.color = "lime";
    document.body.appendChild(fps);
    now = Date.now();
};

var init_canvas = function() {
    c   = document.getElementById("cvs");
    ctx = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    W = window.innerWidth;
    H = window.innerHeight;
};

var main = function() {
    update_fps();
    update();
    clear();
    draw();
    requestAnimationFrame(main);
};


var clear = function() {
    c.width = c.width;
};

window.onload = function() {
    init_fps();
    init_canvas();
    setup();
    requestAnimationFrame(main);
};
/***************************************************************/

/***************************[MAIN]******************************/
var fps, now, c, ctx, W, H;


var setup = function() {
    
};

var update = function() {
    
};

var draw = function() {
    
};
/***************************************************************/

/***************************[CLASSES]***************************/



/***************************************************************/

/*************************[FUNCTIONS]***************************/


var print = function(o) {console.log(JSON.stringify(o));};
/***************************************************************/
