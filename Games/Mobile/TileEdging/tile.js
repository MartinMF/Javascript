'use strict';


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



var map;

var setup = function() {
    map = new Map(20,20,32);
};

var update = function() {
    
};

var draw = function() {
    map.draw();
};
/***************************************************************/

/***************************[CLASSES]***************************/

function Edge(sx,sy, ex,ey) {
    this.sx = sx, this.sy = sy,
    this.ex = ex, this.ey = ey;
    
    this.draw = function() {
        ctx.strokeStyle = "white";
        
        
        ctx.beginPath();
        ctx.moveTo(this.sx, this.sy);
        ctx.lineTo(this.ex, this.ey);
        ctx.closePath();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(this.sx, this.sy, 3, 0, 2*Math.PI); 
        ctx.closePath();
        ctx.fillStyle = "red";
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.ex, this.ey, 3, 0, 2*Math.PI); 
        ctx.closePath();
        ctx.fillStyle = "red";
        ctx.fill();
        
    };
}




function Tile() {
    var solid = false;
    
    Object.defineProperty(this, "is_solid", {
        get: function() {
            return solid;
        }, set: function(v) {
            solid = v;
        }
    });
    
    this.edges = {
        north:null, south:null,
        east:null, west:null
    };
    
}



function Map(width, height, tile_size) {
    
    this.edges = [];
    this.tiles = [];
    this.width = width;
    this.height = height;
    this.tile_size = tile_size;
    
    for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            this.tiles.push(new Tile());
        }
    }
    
    this.get_index = function(x,y) {
        y = Math.floor(y/tile_size);
        x = Math.floor(x/tile_size);
        return y*width+x;
    };
    
    this.get_coords = function(i) {
        var y = Math.floor(i/width) * tile_size;
        var x = (i % width) * tile_size;
        return {x:x, y:y};
    };
    
    this.draw = function() {
        ctx.fillStyle = "blue";
        this.edges = [];
        
        for(var i in this.tiles) {
            var y = Math.floor(i/width) * tile_size;
            var x = (i % width) * tile_size;
            if(this.tiles[i].is_solid) {
                ctx.fillRect(x,y,tile_size,tile_size);
            }
            
            this.tiles[i].edges = {
                north:null, south:null,
                east:null, west:null
            };
        }
        
        for(var y = 1; y < height-1; y++) {
            for(var x = 1; x < width-1; x++) {
                var i = this.get_index(x*tile_size,y*tile_size);
                 
                if(this.tiles[i].is_solid) {
                    this.assign_edges(i);
                }
                
            }
        }
        
        for(var j in this.edges) {
            this.edges[j].draw();
        }
    };
    
    
    this.assign_edges = function(i) {
        var tile = this.tiles[i],
            north = this.tiles[i-width],
            south = this.tiles[i+width],
            east = this.tiles[i+1],
            west = this.tiles[i-1],
            x,y;
        
        if(!north.is_solid) {
            if(!tile.edges.north) {
                if(west.edges.north !== null) {
                    this.edges[west.edges.north].ex += tile_size;
                    tile.edges.north = west.edges.north;
                } else {
                    x = this.get_coords(i).x;
                    y = this.get_coords(i).y;
                    tile.edges.north = this.edges.length;
                    this.edges.push(new Edge(x,y,x+tile_size,y));
                }
            }
        }
        
        if(!west.is_solid) {
            if(!tile.edges.west) {
                if(north.edges.west !== null) {
                    this.edges[north.edges.west].ey += tile_size;
                    tile.edges.west = north.edges.west;
                } else {
                    x = this.get_coords(i).x;
                    y = this.get_coords(i).y;
                    tile.edges.west = this.edges.length;
                    this.edges.push(new Edge(x,y,x,y+tile_size));
                }
            }
        }
        
        if(!east.is_solid) {
            if(!tile.edges.east) {
                if(north.edges.east !== null) {
                    this.edges[north.edges.east].ey += tile_size;
                    tile.edges.east = north.edges.east;
                } else {
                    x = this.get_coords(i).x;
                    y = this.get_coords(i).y;
                    tile.edges.east = this.edges.length;
                    this.edges.push(new Edge(x+tile_size,y,x+tile_size,y+tile_size));
                }
            }
        }
        
        if(!south.is_solid) {
            if(!tile.edges.south) {
                if(west.edges.south !== null) {
                    this.edges[west.edges.south].ex += tile_size;
                    tile.edges.south = west.edges.south;
                } else {
                    x = this.get_coords(i).x;
                    y = this.get_coords(i).y;
                    tile.edges.south = this.edges.length;
                    this.edges.push(new Edge(x,y+tile_size,x+tile_size,y+tile_size));
                }
            }
        }
    };
}




/***************************************************************/

/*************************[FUNCTIONS]***************************/
var start, delay = 200; //ms


window.onclick = function(e) {
    if(start && Date.now() - start > delay || start === null) {
        var x = e.clientX, y = e.clientY;
        if(x < map.width*map.tile_size-map.tile_size &&
           y < map.height*map.tile_size-map.tile_size &&
           x > map.tile_size && y > map.tile_size) {
            var index = map.get_index(x,y);
            map.tiles[index].is_solid =
            !map.tiles[index].is_solid;
        }
    }
};


window.ontouchstart = function(e) {
    start = Date.now();
    var x = e.touches[0].clientX, y = e.touches[0].clientY;
    if(x < map.width*map.tile_size-map.tile_size &&
       y < map.height*map.tile_size-map.tile_size &&
       x > map.tile_size && y > map.tile_size) {
        var index = map.get_index(x,y);
        map.tiles[index].is_solid =
        !map.tiles[index].is_solid;
    }
};



/***************************************************************/
var print = function(o) {console.log(JSON.stringify(o));};
/***************************************************************/
