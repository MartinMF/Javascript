
/****************************[ROVER]****************************/

function Rover() {
    this.angle = 90
    this.vel = new Vector(12,0)
    this.vel.set_angle(this.angle-90)
    this.width = 18
    this.height = 35
    this.rocks = []
    this.photos = []
    this.get_arc = function() {
        let v = this.vel
        return this.pos.add(v.set_magnitude(3*12))
    }
    this.analyse_radius = 23 // collect range
    this.draw = function(redraw_rover) {
        ctx.beginPath()
        ctx.strokeStyle = this.scan(world) &&
        this.rocks.length < 5? "green": "red"
        ctx.arc(this.get_arc().x, this.get_arc().y,
                this.analyse_radius,0,2*Math.PI)
        ctx.stroke()
        ctx.closePath()
        ctx.save()
        ctx.translate(this.pos.x, this.pos.y)
        ctx.rotate(this.angle*Math.PI/180)
        draw_rover(-this.width/2,-4*this.height/5,20,40,28,10,
        this.rocks.length,redraw_rover)
        ctx.restore()
        
    }
    this.set_pos = function(x,y) {
        this.pos = new Vector(x, y)
    }
    this.drive = function(d,i) {
        if(d == "f") { for(let n = 0; n < i; n++) {
            world.s()
            for(let j = 0; j < 400; j+=10) {
                setTimeout(()=> {
                let v = this.vel
                this.pos= this.pos.add(v.set_magnitude(12/40))
                update()
                },j)
            }
            let cv = get_canvas_value()
            setTimeout(()=>{world.c()
                if(cv-get_canvas_value()>1e5)
                    log(0,"!! Warning almost of range !!")
                    },390)
            log("f")
        }}
        else { for(let n = 0; n < i; n++) {
            world.s()
            for(let j = 0; j < 400; j+=10) {
                setTimeout(()=> {
                let v = this.vel
                this.pos= this.pos.sub(v.set_magnitude(12/40))
                update()
                },j)
            }
            let cv = get_canvas_value()
            setTimeout(()=>{world.c()
                if(cv-get_canvas_value()>1e5)
                    log(0,"!! Warning almost of range !!")
                    },390)
            log("b")
        }}
    }
    this.turn = function(deg) {
        world.s()
        for(let d = 0; d < Math.abs(deg); d++) {
            setTimeout(()=>{
                this.angle += deg > 0? 1: -1
                this.vel.set_angle(this.angle-90)
                update()
            },d*25)
        }
        setTimeout(()=>{world.c()},360)
        deg > 0? log("r"): log("l")
    }
    this.scan = function(world) {
        for(let rock of world.rocks) {
            let v = this.get_arc().sub(rock.pos)
            var ar = this.analyse_radius
            if(distance(v.x,v.y)<ar+rock.size/2) {
                if(this.rocks.length < 5)
                    pick_up_button.disabled = 0
                return rock
            }
        } pick_up_button.disabled = 1
    }
    this.analyse = function() {
        if(this.rocks.length) {
            log(0,"Analysed last rock: "+
            this.rocks[this.rocks.length-1].value+
            "% "+this.rocks[this.rocks.length-1].chemical+
            " found")
        }
        
    }
    this.pick_up = function() {
        var rock = this.scan(world)
        if(rock) {
            if(this.rocks.length < 5) {
                release_button.disabled = 0
                analyse_button.disabled = 0
                this.rocks.push(rock)
                let i = world.rocks.indexOf(rock)
                world.rocks.splice(i,1)
                log(0,"Picked up nearby rock")
            }
            else log(0,"Can't pick up more rocks, storage full")
        }
    }
    this.release = function(i) { for(let n = 0; n < i; n++) {
        if(this.rocks.length) {
            world.add(this.rocks[this.rocks.length-1],
                      this.get_arc().x, this.get_arc().y)
            this.rocks.splice(-1,1)
            if(this.rocks.length == 0)
                analyse_button.disabled = 1
            log("c","Disposed last collected rock")
        } else log("c")
    }}
}


/* Returns the color values near the rover.
   Used to detect rover going off the canvas */
function get_canvas_value() {
    var w = 50
    var h = 50
    var x = world.rover.pos.x
    var y = world.rover.pos.y
    var img = ctx.getImageData(x-w/2,y-h/2,w,h)
    return sum(img.data)
}



function draw_rover(x,y,width,height,w,h,i,redraw) {
    let r = rover.rocks 
    ctx.fillStyle = "black"
    ctx.fillRect(x-(w-width)/2,y-h/2,(w-width),h)
    ctx.fillRect(x+width-(w-width)/2,y-h/2,(w-width),h)
    ctx.fillRect(x-(w-width)/2,y+height-h/2,(w-width),h)
    ctx.fillRect(x+width-(w-width)/2,y+height-h/2,(w-width),h)
    
    ctx.fillRect(x-(w-width)/2,y+height/2-h/2,w,h)
    ctx.fillStyle = "#ccc"
    ctx.fillRect(x,y,width,height)
    if(i == 1) draw_stone(x+width/2,y+2*height/3,r[0])
    if(i == 2) {
        draw_stone(x+width/2,y+height/2,r[1])
        draw_stone(x+width/2,y+5*height/6,r[0])
    } if(i == 3) {
        draw_stone(x+width/2,y+height/2,r[1])
        draw_stone(x+2*width/3,y+5*height/6,r[0])
        draw_stone(x+width/3,y+5*height/6,r[2])
    } if(i == 4) {
        draw_stone(x+2*width/3,y+height/2,r[1])
        draw_stone(x+2*width/3,y+5*height/6,r[0])
        draw_stone(x+width/3,y+5*height/6,r[2])
        draw_stone(x+width/3,y+height/2,r[3])
    } if(i == 5) {
        draw_stone(x+2*width/3,y+height/2,r[1])
        draw_stone(x+2*width/3,y+5*height/6,r[0])
        draw_stone(x+width/3,y+5*height/6,r[2])
        draw_stone(x+width/3,y+height/2,r[3])
        draw_stone(x+width/2,y+2*height/3,r[4])
    }
    
    if(redraw != 0) {
        ctx.fillStyle = "black"
        ctx.fillRect(x+width/6,y+width/6,2*width/3,height/5)
    } else {
        ctx.fillStyle = "yellow"
        ctx.fillRect(x+width/6,y+width/6,2*width/3,height/5)
    }

    if(world.rover.flash) {
        world.rover.flash = 0
        ctx.fillStyle = "yellow"
        ctx.fillRect(x+3*width/12,y+3*width/12,
                 width/2,height/5-width/6)
        setTimeout(()=>{
            ctx.fillStyle = "black"
            ctx.fillRect(x+width/6,y+width/6,2*width/3,height/5)
            update(0)
        },200)
        setTimeout(()=>{
            ctx.fillStyle = "black"
            ctx.fillRect(x+width/6,y+width/6,2*width/3,height/5)
            update()
        },300)
    }
    
}

/***************************************************************/








/****************************[ROCK]****************************/

var rocks = ["https://i.ibb.co/TPKYSQ4/rock-1.png",
             "https://i.ibb.co/cxbKzQC/rock-2.png",
             "https://i.ibb.co/w0R9n4S/rock-3.png"]

function Rock() {
    let chems = ["Water", "Copper", "Ice", "Calcium", "Iridium",
                 "Cobalt", "Iron", "Lead", "Silver"]
    this.chemical = chems[Math.floor(chems.length*Math.random())]
    this.value = Math.ceil(40*Math.random())+10
    this.size = Math.ceil(2*Math.random()+4)*2
    this.img = new Image()
    let srcs = rocks
    this.img.crossOrigin = "Anonymous"
    this.img.src = srcs[Math.floor(srcs.length*Math.random())]
    this.draw = function() {
        ctx.drawImage(this.img, this.pos.x-this.size/2,
                                this.pos.y-this.size/2,
                                this.size,this.size)
    }
    this.set_pos = function(x,y) {
        this.pos = new Vector(x,y)
    }
}

function draw_stone(x,y,rock) {
    ctx.drawImage(rock.img,x-rock.size/2,y-rock.size/2,
                  rock.size,rock.size)
}

/***************************************************************/








/****************************[WORLD]****************************/


mars_surface = "https://i.ibb.co/FsGDGN6/mars.jpg"
mars_image = new Image()
mars_image.crossOrigin = "Anonymous"
mars_image.src = mars_surface


function World(width, height) {
    init_canvas(width, height)
    this.width = width
    this.height = height
    this.rocks = []
    this.rover = null
    this.busy = 0
    this.c = function() {this.busy = 0;enable_buttons()}
    this.s = function() {this.busy = 1;disable_buttons()}
    this.add = function(object, x, y) {
        object.set_pos(x,y)
        if(object instanceof Rock) 
            this.rocks.push(object)
        if(object instanceof Rover)
            this.rover = object
    }
    this.draw = function(redraw_rover) {
        ctx.drawImage(mars_image,100,200,this.width,this.height,
        0,0,this.width,this.height)
        for(let rock of this.rocks) rock.draw()
        this.rover.draw(redraw_rover)
    }
    pick_up_button.disabled = 1
    analyse_button.disabled = 1
    review_button.disabled = 1
}


function add_rocks(i) {
    for(let j = 0; j < i; j++) {
        world.add(new Rock(),(world.width-40)*Math.random()+20,
                             (world.height-40)*Math.random()+20)
    }
}

/***************************************************************/











/***************************[VECTOR]***************************/

function Vector(dx, dy) {
    this.x = dx
    this.y = dy
    this.angle = 0
    this.get_magnitude = () => distance(this.x, this.y)
    this.add = (other) => {
        if(other instanceof Vector) {
            return new Vector(this.x+other.x,
            this.y+other.y)
        } 
    }
    this.sub = (other) => {
        if(other instanceof Vector) {
            return new Vector(this.x-other.x, this.y-
            other.y)
        }
    }
    this.mult = (n) => {
        this.x *= n; this.y *= n; 
        return new Vector(this.x, this.y)
    }
    this.set_magnitude = (m) => this.mult(m/this.get_magnitude())
    this.set_angle = function(degree) {
        this.angle = degree
        m = this.get_magnitude()
        this.x = Math.cos(this.angle*Math.PI/180)
        this.y = Math.sin(this.angle*Math.PI/180)
        this.set_magnitude(m)
    }
}

/***************************************************************/








/****************************[PHOTO]****************************/

function Photo() {
    this.i = c.toDataURL("image/png").replace("image/png",
                                      "image/octet-stream"); 
    this.image_width = 150
    this.image_height = 150
    this.new_width = 250
    this.new_height = 250
    this.sx = world.rover.get_arc().x-this.image_width/2
    this.sy = world.rover.get_arc().y-this.image_height/2
    this.img = new Image()
    this.img.src = this.i
    this.draw = function() {
        let x = c.width/2-this.new_width/2
        let y = c.height/2-this.new_height/2
        ctx.fillStyle = "black"
        ctx.beginPath()
        ctx.rect(x-5,y-5,this.new_width+10,
                     this.new_height+10)
        ctx.fill()
        ctx.strokeStyle = "#aaa"
        ctx.lineWidth = 10
        ctx.stroke()
        ctx.lineWidth = 0
        ctx.closePath()
        ctx.drawImage(this.img,this.sx,this.sy,
                      this.image_width,this.image_height,
                      x,y,this.new_width,this.new_height)
    }
}

/***************************************************************/









/*****************************[LOG]*****************************/

function Log() {
    this.types = ["f", "b", "l", "r","c"]
    this.calls = 0
    this.counter = 0
    this.last = 0
    this.text = ""
}

log = function(type, text) {
    if(text) last_log.innerHTML = text
    else {
        if(type == "f") last_log.innerHTML = "Drove forward"
        if(type == "b") last_log.innerHTML = "Drove backwards"
        if(type == "r") last_log.innerHTML = "Turned 15° right"
        if(type == "l") last_log.innerHTML = "Turned 15° left"
    }
    if(logs.types.indexOf(type) >= 0 && type == logs.last) {
        logs.counter++
        if(text) logs.text += text+"\n"
        if(type == "c" && logs.counter == 5) {
            logs.counter = 1
            logs.text += "Cleaned rock container\n"
            last_log.innerHTML = "Cleaned rock container"
        }
    } else {
        if(logs.last == "f") {
            logs.text += "Drove forward "+convert(logs.counter)
            logs.text += "\n"}
        if(logs.last == "b") {   
            logs.text += "Drove backwards "+convert(logs.counter)
            logs.text += "\n"}
        if(logs.last == "r") {
            logs.text += "Turned by 15° right "+
            convert(logs.counter); logs.text += "\n"}
        if(logs.last == "l") {
            logs.text += "Turned by 15° left "+
            convert(logs.counter); logs.text += "\n"}
        if(logs.types.indexOf(type) >= 0) {
            logs.last = type; logs.counter = 1
            if(text) logs.text += text+"\n"
        } else {
            logs.text += text+"\n"
            logs.counter = 0
            logs.last = 0
        }
    }
}



function convert(counter) {
    if(counter == 1) return "once"
    if(counter == 2) return "twice"
    if(counter == 3) return "thrice"
    if(counter >  3) return counter+" times"
}

/***************************************************************/








/**************************[TERMINAL]***************************/

function Terminal(commands) {
    this.info_text = "\n\n"+
        "RCK [n]: Collect n nearby rocks\n"+
        "ANL: Analyse last collected rock\n"+
        "RLS [n]: Release last n rocks, n = 5 => clean "+
        "container\n"+
        "PIC: Take a picture\n"+
        "LOG: Open log book with all unread commands\n"+
        "MOV F [n]: Move forward n times\n"+
        "MOV B [n]: Move backwards n times\n"+
        "TRN L [n]: Turn 15° left n times\n"+
        "TRN R [n]: Turn 15° right n times\n"
    this.default_text = "MOV F 6\nTRN R 6\nMOV F 3\n"+
                  "RCK\nANL\nRLS 5\nPIC\nLOG"
    
    this.commands = commands
    this.execute = function() { try{
        var a = 0
        var l = 450
        for(let c of this.commands) {
            let n = parseInt(c.replace(/[^\d.]/g,''))
            if(isNaN(n)) n = 1
            setTimeout(()=> {
                for(let i = 0; i < n; i++) {
                    if(c.toUpperCase().includes("MOV F"))
                        setTimeout(up,l*i)
                    if(c.toUpperCase().includes("MOV B"))
                        setTimeout(down,l*i)
                    if(c.toUpperCase().includes("TRN L"))
                        setTimeout(left,l*i)
                    if(c.toUpperCase().includes("TRN R"))
                        setTimeout(right,l*i)
                    if(c.toUpperCase().includes("ANL"))
                        setTimeout(analyse,l*i)
                    if(c.toUpperCase().includes("RLS"))
                        setTimeout(release,l*i)
                    if(c.toUpperCase().includes("RCK"))
                        setTimeout(pick_up,l*i)
                    if(c.toUpperCase().includes("PIC"))
                        setTimeout(snap,l*i)
                    if(c.toUpperCase().includes("LOG"))
                        setTimeout(view_log,l*i)
                }
            },l*a)
            a += n
        }}
        catch(e) {
            log(0,"Terminal failure")
        }
    }
}



function create_terminal(i) {
    var div = document.createElement("div")
    var terminal_input = document.createElement("textarea")
    var terminal_execute = document.createElement("button")
    var info_div = document.createElement("div")
    div.style.position = "absolute"
    div.style.right = "0"
    div.style.top = "0"
    div.style.width = window.innerWidth+"px"
    div.style.height = "245px"
    
    let text = new Terminal().info_text
    info_div.innerHTML = text.replace(/(?:\r\n|\r|\n)/g, '<br>')
    info_div.style.width = window.innerWidth-100+"px"
    info_div.style.paddingLeft = "20px"
    info_div.style.paddingRight = "20px"
    info_div.style.color = "lime"
    info_div.style.backgroundColor = "black"
    info_div.style.height = "100%"
    if(i) terminal_input.style.textTransform = "uppercase"
    terminal_input.style.position = "absolute"
    terminal_input.style.right = 0
    terminal_input.cols = 10
    terminal_input.rows = 15
    terminal_input.value = new Terminal().default_text
    terminal_input.style.backgroundColor =
                                    i?"black":"rgba(0,0,0,0.7)"
    terminal_input.style.color = "lime"
    terminal_input.style.border = "1px solid lime"
    terminal_input.style.outline = "none"
    terminal_execute.style.position = "absolute"
    terminal_execute.style.right = 0
    terminal_execute.style.bottom = 0
    terminal_execute.style.width = "75px"
    terminal_execute.style.height = "40px"
    terminal_execute.style.border = "2px solid lime"
    terminal_execute.style.boxShadow = "none"
    terminal_execute.innerHTML = "Exec"
    terminal_execute.style.color = "lime"
    terminal_execute.style.borderRadius = 0
    
    exit_terminal = create_exit_button()
    exit_terminal.style.width = "40px"
    exit_terminal.style.height = "40px"
    exit_terminal.onclick = () => {
        document.body.removeChild(div)
    }
    
    terminal_execute.onclick = function() {
        var commands = terminal_input.value.split("\n")
        terminal_input.value = ""
        document.body.removeChild(div)
        setTimeout(()=>{
            new Terminal(commands).execute()
        },1000)
    }
    div.appendChild(terminal_input)
    div.appendChild(terminal_execute)
    if(i) div.appendChild(exit_terminal)
    if(i) div.appendChild(info_div)
    div.terminal_input = terminal_input
    div.terminal_execute = terminal_execute
    return div
}

function create_exit_button(size) {
    var exit_button = document.createElement("button")
    exit_button.style.position = "absolute"
    exit_button.style.bottom = 0
    exit_button.style.right = "76px"
    exit_button.style.width = "30px"
    exit_button.style.height = "30px"
    exit_button.style.fontSize = "24px"
    exit_button.style.color = "red"
    exit_button.style.borderColor = "red"
    exit_button.style.borderRadius = 0
    exit_button.style.boxShadow = "none"
    exit_button.innerHTML = "x"
    return exit_button
}

/***************************************************************/









/**************************[COMMANDS]***************************/


function up() { if(!world.busy) {
    world.rover.drive("f", 1)
    update()
}}

function down() { if(!world.busy) {
    world.rover.drive("r", 1)
    update()
}}

function right() { if(!world.busy) {
    world.rover.turn(15)
    update()
}}

function left() { if(!world.busy) {
    world.rover.turn(-15)
    update()
}}

function analyse() {
    world.rover.analyse()
    update()
}

function pick_up() { if(!world.busy) {
    world.rover.pick_up()
    update()
    release_button.innerHTML = world.rover.rocks.length?
    "RLS ("+world.rover.rocks.length+")": "RLS"
}}

function release() {
    world.rover.release(1)
    update()
    release_button.innerHTML = world.rover.rocks.length?
    "RLS ("+world.rover.rocks.length+")": "RLS"
}

function snap() { if(!world.busy) {
    world.rover.flash = 1
    world.s()
    update()
    world.rover.photos.push(new Photo())
    if(world.rover.photos.length > 10)
        world.rover.photos.splice(0,1)
    log(0,"Taking photo #"+rover.photos.length)
    review_button.disabled = 0
    snap_button.disabled = 1
    review_button.innerHTML = "See Photo ("+
    world.rover.photos.length+")"
    setTimeout(()=>{world.c()},500)
}}

function review() {
    let l = world.rover.photos.length
    i = parseInt(prompt("Which photo do you want to review?" +
    " [1-"+l+"]",l))
    try {
        world.rover.photos[i-1].draw()
        log(0,"Reviewing photo #"+i)
        snap_button.disabled = 1
        var exit_button = create_exit_button()
        exit_button.style.top = world.height-42+"px"
        exit_button.style.width = "75px"
        exit_button.innerHTML = "close"
        exit_button.style.right = "43px"
        exit_button.onclick = () => {
            update()
            document.body.removeChild(exit_button)
        }
        document.body.appendChild(exit_button)
    } catch(e) {}
    
}

function view_log() {
    logs.last_text = "Reviewing Log #"+ ++logs.calls+"\n"
    logs.text = logs.text.slice(0,-1)
    logs.last_text += "\n"+logs.text+"\n";logs.text = ""
    if(logs.counter != 0) {
        if(logs.last_text == "Reviewing Log #"+
        logs.calls+"\n\n\n") 
            logs.last_text = "Reviewing Log #"+
            logs.calls+"\n\n"
        if(logs.last == "f")
            logs.last_text +=
            "Drove forward "+convert(logs.counter)
        if(logs.last == "b")   
            logs.last_text +=
            "Drove backwards "+convert(logs.counter)
        if(logs.last == "r")
            logs.last_text += "Turned by 15° right "+
            convert(logs.counter)
        if(logs.last == "l")
            logs.last_text += "Turned by 15° left "+
            convert(logs.counter)
        logs.last = 0
    }
    var view = create_terminal()
    view.terminal_input.value = logs.last_text
    logs.last_text = ""
    view.style.left = 0
    view.style.height = "205px"
    view.style.width = "275px"
    view.style.transform = "translate(45px,30px)"
    view.terminal_input.style.width = "100%"
    view.terminal_input.style.height = "100%"
    view.terminal_execute.style.position = "absolute"
    view.terminal_execute.style.top = 0
    view.terminal_execute.style.left = "245px"
    view.terminal_execute.style.width = "30px"
    view.terminal_execute.style.height = "30px"
    view.terminal_execute.style.fontSize = "24px"
    view.terminal_execute.style.color = "red"
    view.terminal_execute.style.borderColor = "red"
    view.terminal_execute.innerHTML = "x"
    view.terminal_execute.onclick = function() {
        document.body.removeChild(view)
    }
    view.terminal_input.readOnly = 1
    document.body.appendChild(view)
}


function terminal() {
    document.body.appendChild(create_terminal(1))
}

/***************************************************************/










/***********************[OTHER FUNCTIONS]***********************/


function update(redraw_rover) {
    clear()
    world.draw(redraw_rover)
    snap_button.disabled = 0
}


function distance(x,y) {
    return Math.sqrt(Math.pow(x,2)+Math.pow(y,2))
}

function sum(iterable) {
    var s = 0
    for(let i of iterable) s += i
    return s
}

function init_canvas(w,h) {
    c   = document.getElementById("cvs")
    ctx = c.getContext("2d")
    c.width = w
    c.height = h
}


function clear() {
    c.width = c.width
}

function disable_buttons() {
    for(button of buttons) button.disabled = 1
}

function enable_buttons() {
    for(button of buttons) button.disabled = 0
}


/***************************************************************/






/*****************************[MAIN]****************************/

window.onload = () => {

    analyse_button = document.getElementById("analyse")
    release_button = document.getElementById("release")
    snap_button = document.getElementById("snap")
    review_button = document.getElementById("review")
    pick_up_button = document.getElementById("pick")
    up_button = document.getElementById("up")
    right_button = document.getElementById("right")
    left_button = document.getElementById("left")
    down_button = document.getElementById("down")
    last_log = document.getElementById("last_log")
    buttons = [up_button, right_button, left_button, down_button]
    
    last_log.onclick = view_log

    logs = new Log()
    world = new World(340,300) 
    rover = new Rover()
    rock = new Rock()

    world.add(rover, 50,50)
    world.add(rock, 120,130)
    add_rocks(19)
    world.draw()
    
    setTimeout(()=> {
    document.body.removeChild(document.getElementById("splash"))
    update()
    },2000*Math.random()+3000)
}

/***************************************************************/
