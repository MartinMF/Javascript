function Joystick() {
    
    var left_div, right_div, jump_div, shoot_div,
        change_div, pos, divs;
        
    this.left = false, this.right = false, this.jump = false,
    this.shoot = false, this.drag = false;
    
    
    var apply_design = function(e, s) {
        for(var i in s) e.style[i] = s[i];
    };
        
    
    var setup = function() {
        left_div = document.createElement("div");
        right_div = document.createElement("div");
        jump_div = document.createElement("div");
        shoot_div = document.createElement("div");
        change_div = document.createElement("div");
        
        left_div.setAttribute("name", "left");
        right_div.setAttribute("name", "right");
        jump_div.setAttribute("name", "jump");
        shoot_div.setAttribute("name", "shoot");
        change_div.setAttribute("name", "change");
        
        divs = [left_div, right_div, jump_div, shoot_div];
        
        var W = window.innerWidth, H = window.innerHeight;
        pos = {
            left: {
                x:"60px", y:"calc(100vh - 50px)", w:80, h:50,
                svg: "<svg width='80'height='50'"+
                     "style='background:rgba(0,0,0,0);'><path fill='rgba(0,0,0,0.6)' d='"+
                     "M22 25 l15 -15 l0 10 l20 0 l0 10 l-20 0 l0 10 z'></path></svg>",
            },
            right: {
                x:"150px", y:"calc(100vh - 50px)", w:80, h:50,
                svg: "<svg width='80'height='50'"+
                     "style='background:rgba(0,0,0,0);'><path fill='rgba(0,0,0,0.6)' d='"+
                     "M58 25 l-15 -15 l0 10 l-20 0 l0 10 l20 0 l0 10 z'></path></svg>"
            },
            jump: {
                x:"calc(100vw - 50px)", y:"calc(100vh - 50px)", w:50, h:50,
                svg: "<svg width='50'height='50'"+
                     "style='background:rgba(0,0,0,0);'><path fill='rgba(0,0,0,0.6)' d='"+
                     "M25 10 l15 15 l-10 0 l0 15 l-10 0 l0 -15 l-10 0 z'></path></svg>"
            },
            shoot: {
                x:"calc(100vw - 50px)", y:"calc(100vh - 110px)", w:50, h:50,
                svg: "<svg width='50'height='50'"+
                     "style='background:rgba(0,0,0,0);'><circle fill='rgba(128,0,255,0.6)'"+
                     " cx='25' cy='25', r='15'></circle></svg>"
            }
        };
        
        for(var i in divs) {
            var p = pos[divs[i].getAttribute("name")];
            apply_design(divs[i], {
                background: "rgba(255,255,255,0.1)",
                position: "absolute", left: p.x,
                top: p.y, width: p.w+"px", height: p.h+"px",
                borderRadius: "10px", border: "1px solid black",
                // boxSizing: "border-box"
            });
            
            divs[i].innerHTML = p.svg;
            document.body.appendChild(divs[i]);
            
            make_draggable(divs[i]);
        }
        
        var change_func = function(e) {
            if(is_targeted(e.target, change_div)) {
                self.drag = !self.drag;
                var color = change_div.style.background;
                if(color === "rgb(0, 0, 0)") {
                    // pause();
                    // toast.makeToast("Drag control buttons to reposition them");
                    change_div.style.background = "#fff";
                    for(var i in divs)
                        divs[i].style.background = "red";
                } else {
                    // resume();
                    change_div.style.background = "#000";
                    for(var i in divs)
                        divs[i].style.background = "rgba(255,255,255,0.1)";
                }
            }
        };
        
        var start = function(e) {
            var x, y;
            
            var trues = [];
            
            for(var i in e.touches) {
                if(!isNaN(i)) {
                    x = e.touches[i].clientX,
                    y = e.touches[i].clientY;
                    var elems = document.elementsFromPoint(x,y);
                    for(var i in elems) {
                        var elem = elems[i], name = elem.getAttribute("name");
                        if(name !== null && !self.drag && name !== "change") {
                            self[name] = true;
                            trues.push(name);
                        }
                    }
                }
            }
            
            
            
            for(var i in divs) {
                var elem = divs[i], name = elem.getAttribute("name");
                if(!trues.includes(name)) self[name] = false;
            } 
            
            
        };
        
        window.addEventListener("click", change_func);
        window.addEventListener("touchstart", start);
        window.addEventListener("touchmove", start);
        window.addEventListener("touchend", start);
        window.addEventListener("touchcancel", start);
        
        document.body.appendChild(change_div);
        
        change_div.style.width = "32px", change_div.style.height = "32px",
        change_div.style.position = "absolute",
        change_div.style.right = "80px", change_div.style.top = "40px",
        change_div.style.background = "#000";
        change_div.style.borderRadius = "10px";
        change_div.style.border = "1px solid black";
        
        
    };
    
    
    var self = this;
    var make_draggable = function(elem) {
        elem.style.transform = "translate(-50%, -50%)";
        elem.style.position = "absolute";
        window.addEventListener("touchmove", function(e) {
            if(self.drag && is_targeted(e.target, elem)) {
                elem.style.left = e.targetTouches[0].clientX+"px";
                elem.style.top = e.targetTouches[0].clientY+"px";
            }
        });
    };
    
    var is_targeted = function(elem, target) {
        return elem?(elem === target || is_targeted(elem.parentNode, target)):false;
    };
    
    // window.addEventListener("DOMContentLoaded", setup);
    setup();
}
