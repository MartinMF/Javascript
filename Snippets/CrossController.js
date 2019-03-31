function Controller(size, pos) {
    var anchor = document.createElement("div");
    var jumper = document.createElement("div");
    var up = document.createElement("div");
    var down = document.createElement("div");
    var left = document.createElement("div");
    var right = document.createElement("div");
    var self = this;
    this.events = {};
    var apply_design = function(e, s) {
        for(var i in s) e.style[i] = s[i];
    };
 
    var create_elements = function() {
        apply_design(arrow, {
            width: "0", height: "0",
            borderLeft: 2*size/7+"px solid transparent",
            borderRight: 2*size/7+"px solid transparent",
            borderBottom: 4*size/7+"px solid rgba(0,0,0,0.3)",
            position: "relative", left: size/7+"px",
            top: size/7+"px",
        });
 
        apply_design(up, {
            width: size+"px", height: size+"px",
            background: "rgba(255,255,255,0.3)",
            position: "fixed",
            top: pos.y-1.6*size+"px",
            left: pos.x-0.5*size+"px",
            borderTop: size/14+"px solid rgba(255,255,255,0.2)",
            borderLeft: size/14+"px solid rgba(255,255,255,0.2)",
            borderBottom: size/14+"px solid rgba(255,255,255,0.1)",
            borderRight: size/14+"px solid rgba(255,255,255,0.1)",
            boxSizing: "border-box",
            borderRadius: size/14+"px",
        });
 
        apply_design(down, {
            width: size+"px", height: size+"px",
            background: "rgba(255,255,255,0.3)",
            transform: "rotate(180deg)",
            position: "fixed",
            top: pos.y+0.6*size+"px",
            left: pos.x-0.5*size+"px",
            borderTop: size/14+"px solid rgba(255,255,255,0.1)",
            borderLeft: size/14+"px solid rgba(255,255,255,0.1)",
            borderBottom: size/14+"px solid rgba(255,255,255,0.2)",
            borderRight: size/14+"px solid rgba(255,255,255,0.2)",
            boxSizing: "border-box",
            borderRadius: size/14+"px",
        });
 
        apply_design(right, {
            width: size+"px", height: size+"px",
            background: "rgba(255,255,255,0.3)",
            transform: "rotate(90deg)",
            position: "fixed",
            top: pos.y-0.5*size+"px",
            left: pos.x+0.6*size+"px",
            borderTop: size/14+"px solid rgba(255,255,255,0.1)",
            borderLeft: size/14+"px solid rgba(255,255,255,0.2)",
            borderBottom: size/14+"px solid rgba(255,255,255,0.2)",
            borderRight: size/14+"px solid rgba(255,255,255,0.1)",
            boxSizing: "border-box",
            borderRadius: size/14+"px",
        });
 
        apply_design(left, {
            width: size+"px", height: size+"px",
            background: "rgba(255,255,255,0.3)",
            transform: "rotate(270deg)",
            position: "fixed",
            top: pos.y-0.5*size+"px",
            left: pos.x-1.6*size+"px",
            borderTop: size/14+"px solid rgba(255,255,255,0.2)",
            borderLeft: size/14+"px solid rgba(255,255,255,0.1)",
            borderBottom: size/14+"px solid rgba(255,255,255,0.1)",
            borderRight: size/14+"px solid rgba(255,255,255,0.2)",
            boxSizing: "border-box",
            borderRadius: size/14+"px",
        });
 
        apply_design(anchor, {
            width: size+"px", height: size+"px",
            background: "rgba(255,255,255,0.3)",
            position: "fixed",
            top: pos.y-size/2+"px",
            left: pos.x-size/2+"px",
            borderTop: size/14+"px solid rgba(255,255,255,0.2)",
            borderLeft: size/14+"px solid rgba(255,255,255,0.2)",
            borderBottom: size/14+"px solid rgba(255,255,255,0.1)",
            borderRight: size/14+"px solid rgba(255,255,255,0.1)",
            boxSizing: "border-box",
            borderRadius: size/14+"px",
        });
    };
    var arrow = document.createElement("div");
    create_elements();
 
    up.appendChild(arrow.cloneNode(true));
    down.appendChild(arrow.cloneNode(true));
    right.appendChild(arrow.cloneNode(true));
    left.appendChild(arrow.cloneNode(true));
 
    up.setAttribute("name", "up");
    down.setAttribute("name", "down");
    right.setAttribute("name", "right");
    left.setAttribute("name", "left");
    anchor.setAttribute("name", "anchor");
 
    up.childNodes[0].setAttribute("name", "up");
    down.childNodes[0].setAttribute("name", "down");
    right.childNodes[0].setAttribute("name", "right");
    left.childNodes[0].setAttribute("name", "left");
 
    document.body.appendChild(up);
    document.body.appendChild(down);
    document.body.appendChild(right);
    document.body.appendChild(left);
    document.body.appendChild(anchor);
 
    /* Anchor element for dragging */
    anchor.addEventListener("touchstart", function(e) {
        self.events.anchor = true;
    });
 
    anchor.addEventListener("touchmove", function(e) {
        if(e.targetTouches.length === 1) {
            pos.x = e.targetTouches[0].clientX;
            pos.y = e.targetTouches[0].clientY;
            create_elements();
            self.events.anchor = true;
            anchor_id = e.targetTouches[0].identifier;
        }
    });
     
    var anchor_end = function(e) {
        if(e.targetTouches.length === 0)
            delete self.events.anchor;
    };
     
    anchor.addEventListener("touchend", anchor_end);
    anchor.addEventListener("touchcancel", anchor_end);
 
 
    /* up */
    var up_id;
    var up_start = function(e) {
        self.events.up = true;
        up_id = e.targetTouches[0].identifier;
    };
 
    var up_end = function(e) {
        delete self.events.up;
        up_id = null;
    };
 
    var up_move = function(e) {
        if(up_id !== null) {
            var name = up.getAttribute("name");
            controller_event = name; var x, y;
            try {
                x = e.touches[up_id].clientX;
                y = e.touches[up_id].clientY;
            } catch(e) {up_end(); return;}
            var elem = document.elementFromPoint(x,y);
            if(elem.getAttribute("name") !== name) up_end();
        } else up_end();
    };
 
    up.addEventListener("touchstart", up_start);
    up.childNodes[0].addEventListener("touchstart",
    up_start);
    up.addEventListener("touchend", up_end);
    up.childNodes[0].addEventListener("touchend",
    up_end);
    up.addEventListener("touchcancel", up_end);
    up.childNodes[0].addEventListener("touchcancel",
    up_end);
    up.addEventListener("touchmove", up_move);
    up.childNodes[0].addEventListener("touchmove",
    up_move);
 
 
 
    /* right */
    var right_id;
    var right_start = function(e) {
        self.events.right = true;
        right_id = e.targetTouches[0].identifier;
    };
 
    var right_end = function(e) {
        delete self.events.right;
        right_id = null;
    };
 
    var right_move = function(e) {
        if(right_id !== null) {
            var name = right.getAttribute("name");
            controller_event = name; var x, y;
            try {
                x = e.touches[right_id].clientX;
                y = e.touches[right_id].clientY;
            } catch(e) {right_end(); return;}
            var elem = document.elementFromPoint(x,y);
            if(elem.getAttribute("name") !== name) right_end();
        } else right_end();
    };
 
    right.addEventListener("touchstart", right_start);
    right.childNodes[0].addEventListener("touchstart",
    right_start);
    right.addEventListener("touchend", right_end);
    right.childNodes[0].addEventListener("touchend",
    right_end);
    right.addEventListener("touchcancel", right_end);
    right.childNodes[0].addEventListener("touchcancel",
    right_end);
    right.addEventListener("touchmove", right_move);
    right.childNodes[0].addEventListener("touchmove",
    right_move);
 
 
 
    /* left */
    var left_id;
    var left_start = function(e) {
        self.events.left = true;
        left_id = e.targetTouches[0].identifier;
    };
 
    var left_end = function(e) {
        delete self.events.left;
        left_id = null;
    };
 
    var left_move = function(e) {
        if(left_id !== null) {
            var name = left.getAttribute("name");
            controller_event = name; var x, y;
            try {
                x = e.touches[left_id].clientX;
                y = e.touches[left_id].clientY;
            } catch(e) {left_end(); return;}
            var elem = document.elementFromPoint(x,y);
            if(elem.getAttribute("name") !== name) left_end();
        } else left_end();
    };
 
    left.addEventListener("touchstart", left_start);
    left.childNodes[0].addEventListener("touchstart",
    left_start);
    left.addEventListener("touchend", left_end);
    left.childNodes[0].addEventListener("touchend",
    left_end);
    left.addEventListener("touchcancel", left_end);
    left.childNodes[0].addEventListener("touchcancel",
    left_end);
    left.addEventListener("touchmove", left_move);
    left.childNodes[0].addEventListener("touchmove",
    left_move);
 
 
 
    /* down */
    var down_id;
    var down_start = function(e) {
        self.events.down = true;
        down_id = e.targetTouches[0].identifier;
    };
 
    var down_end = function(e) {
        delete self.events.down;
        down_id = null;
    };
 
    var down_move = function(e) {
        if(down_id !== null) {
            var name = down.getAttribute("name");
            controller_event = name; var x, y;
            try {
                x = e.touches[down_id].clientX;
                y = e.touches[down_id].clientY;
            } catch(e) {left_end(); return;}
            var elem = document.elementFromPoint(x,y);
            if(elem.getAttribute("name") !== name)
                down_end();
        } else down_end();
    };
 
    down.addEventListener("touchstart", down_start);
    down.childNodes[0].addEventListener("touchstart",
    down_start);
    down.addEventListener("touchend", down_end);
    down.childNodes[0].addEventListener("touchend",
    down_end);
    down.addEventListener("touchcancel", down_end);
    down.childNodes[0].addEventListener("touchcancel",
    down_end);
    down.addEventListener("touchmove", down_move);
    down.childNodes[0].addEventListener("touchmove",
    down_move);
 
 
 
    /* screen */
    var names = [up.getAttribute("name"),
                 down.getAttribute("name"),
                 right.getAttribute("name"),
                 left.getAttribute("name"),
                 anchor.getAttribute("name")];
 
    window.addEventListener("touchstart", function(e) {
        if(!names.includes(e.target.getAttribute("name"))) {
            if(!self.events.screen)
                self.events.screen = {};
            self.events.screen[e.touches.length-1] = {
                start: Date.now(),
                x: e.touches[e.touches.length-1].clientX,
                y: e.touches[e.touches.length-1].clientY,
                dx: 0, dy: 0,
            };
        }
    });
     
    var touch_end = function(e) {
        if(self.events.screen && !name.includes(e.target.getAttribute("name"))) {
            delete self.events.screen[e.changedTouches[0].identifier];
            if(Object.keys(self.events.screen).length === 0)
                delete self.events.screen;
        }
    };
 
    window.addEventListener("touchend", touch_end);
    window.addEventListener("touchcancel", touch_end);
 
    window.addEventListener("touchmove", function(e) {
        for(var i in e.changedTouches) {
            var id = e.changedTouches[i].identifier;
            id = !isNaN(id)?id.toString():null;
            if(self.events.screen && Object.keys(self.events.screen).includes(id)) {
               var o = self.events.screen[id];
               var x = e.changedTouches[i].clientX;
               var y = e.changedTouches[i].clientY;
               o.dx = x - o.x; o.dy = y - o.y;
            }
        }
    });
     
     
    /* for styling */
    this.apply_design = apply_design;
    this.up = up; this.up_arrow = up.childNodes[0];
    this.down = down; this.down_arrow = down.childNodes[0];
    this.right = right; this.right_arrow = right.childNodes[0];
    this.left = left; this.left_arrow = left.childNodes[0];
     
    /* controller.[dir]_arrow.style.borderBottomColor = [color]
       borderBottomColor is the arrow background color!
       NOT controller.[dir]_arrow.style.background
    */
};


/* EXAMPLE USE

window.onload = function() {
    document.body.style.background = "black";
    var a = new Controller(40, {x:100, y:100});
};

*/
