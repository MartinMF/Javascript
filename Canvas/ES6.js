'use strict';

/* A Canvas Element of id 'cvs' must be in the html body
   The Canvas width/height is set to screen width/height
   by default
*/

/**************************[TEMPLATE]***************************/
const update_fps = () => {
    fps.innerHTML = Math.round(1000/(Date.now()-now));
    now = Date.now();
};

const init_fps = () => {
    fps = document.createElement("a");
    fps.style.color = "lime";
    document.body.appendChild(fps);
    now = Date.now();
};

const init_canvas = () => {
    c   = document.getElementById("cvs");
    ctx = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    W = window.innerWidth;
    H = window.innerHeight;
};

const main = () => {
    update_fps();
    update();
    clear();
    draw();
    requestAnimationFrame(main);
};


const clear = () => {
    c.width = c.width;
};

window.onload = () => {
    init_fps();
    init_canvas();
    setup();
    requestAnimationFrame(main);
};
/***************************************************************/

/***************************[MAIN]******************************/
var fps, now, c, ctx, W, H;


const setup = () => {
    
};

const update = () => {
    
};

const draw = () => {
    
};
/***************************************************************/

/***************************[CLASSES]***************************/



/***************************************************************/

/*************************[FUNCTIONS]***************************/


const print = o => console.log(JSON.stringify(o));
/***************************************************************/
