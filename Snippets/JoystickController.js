"use-strict"
 
function Joystick(fdata,bdata) {
    this.data = {dx: 0, dy:0};
    var self = this;
    var front = {radius: 24, color: "lime"},
        back = {radius: 40, color: "#333"};
    if(fdata) front.radius = fdata.radius || front.radius;
    if(fdata) front.color = fdata.color || front.color;
    if(bdata) back.radius = bdata.radius || back.radius;
    if(bdata) back.color = bdata.color || back.color;
    var r = front.radius, R = back.radius,
        c = front.color, C = back.color,
        touch = {on: false}, front_div, back_div;
     
    var setup = function(e) {
        back_div = document.createElement("div");
        back_div.style.position = "absolute";
        back_div.style.width = 2*R+"px";
        back_div.style.height = 2*R+"px";
        back_div.style.borderRadius = "50%";
        back_div.style.background = C;
        front_div = document.createElement("div");
        front_div.style.position = "absolute";
        front_div.style.width = 2*r+"px";
        front_div.style.height = 2*r+"px";
        front_div.style.borderRadius = "50%";
        front_div.style.background = c;
         
        back_div.style.display = "none";
        front_div.style.display = "none";
         
        document.body.appendChild(back_div);
        document.body.appendChild(front_div);
    };
     
    try { setup(); } catch(e) {
        window.addEventListener("DOMContentLoaded", setup);
    }
     
     
    var start = function(e) {
        if(touch && !touch.on) {
            touch = {
                x:e.touches[0].clientX,
                y:e.touches[0].clientY,
                on:true
            };
            back_div.style.display = "block";
            front_div.style.display = "block";
             
            front_div.style.left = touch.x-r+"px";
            front_div.style.top = touch.y-r+"px";
            back_div.style.left = touch.x-R+"px";
            back_div.style.top = touch.y-R+"px";
        }
    }
     
    var stop = function(e) {
        var id = e.changedTouches[e.changedTouches.length-1]
                  .identifier;
        if(touch && touch.on && id === 0) {
            back_div.style.display = "none";
            front_div.style.display = "none";
            touch.on = false; 
            self.data = {dx:0, dy:0};
        }
    }
     
    var move = function(e) {
        var x = e.touches[0].clientX,
            y = e.touches[0].clientY;
        if(touch && touch.on) {
            var dx = x-touch.x;
            var dy = y-touch.y;
            var l = Math.hypot(dx,dy);
            var max = 4*R/5;
            if(l>max) {dx*=max/l; dy*=max/l}
            front_div.style.left = 
                parseFloat(back_div.style.left)+dx+r/2+"px";
            front_div.style.top = 
                parseFloat(back_div.style.top)+dy+r/2+"px";
            self.data = {dx:dx/max, dy:dy/max};
        }
    }
     
    document.addEventListener("touchstart", start);
    document.addEventListener("touchmove", move);
    document.addEventListener("touchend", stop);
    document.addEventListener("touchcancel", stop);
 
    this.back = back_div,
    this.front = front_div 
}
