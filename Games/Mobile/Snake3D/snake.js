/*************************[TEMPLATE]****************************/
const update_fps = () => {
    fps.innerHTML = Math.round(1000/(Date.now()-now))
    now = Date.now()
}

const init_fps = () => {
    fps = document.createElement("a")
    fps.style.color = "lime"
    fps.style.marginLeft = "1vw"
    fps.style.marginTop = "1vw"
    document.body.appendChild(fps)
    now = Date.now()
}

const init_canvas = () => {
    c   = document.getElementById("cvs")
    ctx = c.getContext("2d")
    c.width = window.innerWidth
    c.height = window.innerHeight
}

const main = () => {
    update_fps()
    update()
    clear()
    draw()
    requestAnimationFrame(main)
}


const clear = () => {
    c.width = c.width
}

window.onload = () => {
    init_fps()
    init_canvas()
    setup()
    requestAnimationFrame(main)
}
/***************************************************************/


viewport = {w: 1, h: window.innerHeight/window.innerWidth}


/**************************[CLASSES]****************************/

class Vertex {
    constructor(x,y,z) {
        this.x = x; this.y = y; this.z = z
    }
    
    get norm() {
        let l = this.length
        return new Vertex(this.x/l,this.y/l,this.z/l)
    }
    
    get length() {
        return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2)+
                         Math.pow(this.z,2))
    }
    
    get center() {return this}
    
    get copy() {return new Vertex(this.x,this.y,this.z)}
    
    get_angle_to(v) {
        return Math.acos((this.calc(".",v))/
        (this.length * v.length))
    }
    
    rotate(X,Y,Z,v) {
        if(v) {
            this.calc("-", v)
            this.rotate(X,Y,Z)
            this.calc("+", v)
        } else {
            var x = this.x; var y = this.y; var z = this.z
            this.x = x*cos(Z) - y*sin(Z)
            this.y = x*sin(Z) + y*cos(Z)
            x = this.x; y = this.y; z = this.z
            this.x =  x*cos(Y) + z*sin(Y)
            this.z = -x*sin(Y) + z*cos(Y)
            x = this.x; y = this.y; z = this.z
            this.y = y*cos(X) - z*sin(X)
            this.z = y*sin(X) + z*cos(X)
        }
    }
    
    calc(expr, v) {
        if(expr == "+") {
            this.x += v.x; this.y += v.y; this.z += v.z
        } else if(expr == "-") {
            this.x -= v.x; this.y -= v.y; this.z -= v.z
        } else if(expr == "*") {
            this.x *= v; this.y *= v; this.z *= v
        } else if(expr == "/") {
            this.x /= v; this.y /= v; this.z /= v
        } else if(expr == ".") {
            return this.x*v.x + this.y*v.y + this.z*v.z
        } else if(expr == "x") {
            return new Vertex(
                this.y*v.z - v.y-this.z,
                this.z*v.x - v.z*this.x,
                this.x*v.y - v.x*this.y)
        }
    }
    
    sub(v) {
        return new Vertex(this.x-v.x,this.y-v.y,this.z-v.z)
    }
    
    mult(a) {
        return new Vertex(this.x*a, this.y*a, this.z*a)
    }
    
    get viewport() {
        return new Vertex(this.x*c.width/viewport.w,
                          this.y*c.height/viewport.h)
    }
    
    get canvas() {
        return new Vertex(this.viewport.x+c.width/2,
                          c.height/2-this.viewport.y)
    }
    
    draw(color, r) {
        ctx.fillStyle = color || "white"
        ctx.beginPath()
        ctx.arc(this.canvas.x,this.canvas.y,r||1,0,2*Math.PI)
        ctx.closePath()
        ctx.fill()
    }
}






class Camera {
    constructor(pos, rot) {
        this.pos = pos
        this.rot = rot
    }
    
    get view() {
        let v = new Vertex(0,0,1)
        v.rotate(...this.rot)
        return v
    }
    
    get plane() {
        let p = this.pos.copy
        p.calc("+", this.view.norm)
        return new Plane(p, this.view)
    }
    
    project(v) {
        let p = this.plane.project(v, this.pos)
        p.calc("-", this.pos)
        p.rotate(-this.rot[0],-this.rot[1], -this.rot[2])
        return p
    }
}



class Plane {
    constructor(pos, norm) {
        this.pos = pos
        this.norm = norm
    }
    
    get d() {return this.norm.calc(".", this.pos)}
    
    project(p1, p2) { 
        let p_1 = p1.copy; let p_2 = p2.copy
        p_2.calc("-", p_1)
        let v = p_2.copy
        let r = (this.d-this.norm.calc(".", p_1))/
        this.norm.calc(".", v)
        v.calc("*", r)
        p_1.calc("+", v)
        return p_1
    }
}


class Surface {
    constructor(verts, color) {
        this.verts = verts
        this.color = color
    }
    
    get center() {
        let p = new Vertex(0,0,0)
        for(let v of this.verts)
            p.calc("+", v)
        p.calc("/", this.verts.length)
        return p
    }
    
    draw(color, width, lc) {
        if(!this.behind(cam)) {
            ctx.beginPath()
            ctx.moveTo(cam.project(this.verts[0]).
            canvas.x,cam.project(this.verts[0]).canvas.y)
            for(let v of this.verts.slice(1))
                ctx.lineTo(cam.project(v).canvas.x,
                cam.project(v).canvas.y)
            ctx.closePath()
            ctx.fillStyle = this.color || color
            ctx.strokeStyle = lc || "white"
            ctx.lineWidth = width || 0
            if(width) ctx.stroke()
            ctx.fill()
        }
    }
    
    behind(cam) {
        for(let v of this.verts) {
            if(v.sub(cam.pos).length <
            v.sub(cam.plane.pos).length)
                return true
        } /*Martin*/
        return false
    }
}








class Sphere {
    constructor(p,r,m,c,lw,lc) {
        this.pos = p
        this.r = r || 2
        this.m = m || 10
        this.color = c || "red"
        this.line_width = lw || 0
        this.line_color = lc || "black"
    }
    
    get verts() {
        var verts = []
        for(let r = 0; r <= 180; r += 180/this.m) {
            for(let a = 0; a <= 360; a += 360/this.m) {
                verts.push(new Vertex(
                    this.pos.x + sin(r)*cos(a)*this.r/2,
                    this.pos.y + sin(r)*sin(a)*this.r/2,
                    this.pos.z-cos(r)*this.r/2
                ))
            }
        } return verts
    }
    
    get surfs() {
        let surfs = []; let m = this.m
        for(let i = 1; i < m*m+m; i++) {
            surfs.push(new Surface([
                this.verts[i],
                this.verts[i+m+1],
                this.verts[i+m],
                this.verts[i-1]
                ], this.color)
            )
        }
        return surfs
    }
    
    rotate(X,Y,Z,v) {
        for(let vec of this.verts)
            vec.rotate(X,Y,Z,v)
    }
    
    get center() {return this.pos}
    
    draw() {
        for(let s of sort(this.surfs))
            s.draw(this.color,this.line_width,this.line_color)
    }
}








class Object {
    constructor(center_point, rel_surfs, color, lw, lc) {
        this.pos = center_point
        this.rel_surfs = rel_surfs
        this.surfs = this.get_surfs()
        this.color = color || "rgba(255,0,0,0.5)"
        this.line_width = lw
        this.line_color = lc || "black" 
    }
    
    get_surfs() {
        let surfs = []
        for(let surf of this.rel_surfs) {
            var verts = []
            for(let vert of surf.verts) {
                // print(vert)
                verts.push(new Vertex(this.pos.x+vert.x,
                this.pos.y+vert.y,this.pos.z+vert.z))
            }
            surfs.push(new Surface(verts, surf.color))
        } return surfs
    }
    
    draw() {
        for(let s of sort(this.get_surfs()))
            s.draw(this.color,this.line_width,this.line_color)
    }
    
    rotate_rel(X,Y,Z) {
        for(let s of this.rel_surfs) {
            for(let v of s.verts) v.rotate(X,Y,Z)
        }
    }
    
    rotate(X,Y,Z,p) {
        this.pos.rotate(X,Y,Z,p||new Vertex(0,0,0))
    }
    
    get center() {return this.pos}
    
}







/***********************************************************/









/********************[DRAW FUNCTIONS]********************/


const get_block = (pos, color, line_width, line_color) => {
    var A = new Vertex(-0.5, 0.5, 0.5)
    var B = new Vertex(0.5, 0.5, 0.5)
    var C = new Vertex(0.5, -0.5, 0.5)
    var D = new Vertex(-0.5, -0.5, 0.5)
    var E = new Vertex(-0.5, 0.5, -0.5)
    var F = new Vertex(0.5, 0.5, -0.5)
    var G = new Vertex(0.5, -0.5, -0.5)
    var H = new Vertex(-0.5, -0.5, -0.5)
    
    let obj = new Object(pos, [
        new Surface([A, B, C, D]),
        new Surface([A, B, F, E]),
        new Surface([A, D, H, E]),
        new Surface([E, F, G, H]),
        new Surface([C, D, H, G]),
        new Surface([B, C, G, F])
    ], color, line_width, line_color)
    
    return obj
}




const add_objects = () => {
    var z = 17
    var y = -2
    
    blocks = [
        get_block(new Vertex( 2,y,z),"rgba(0,255,0,"+alpha+")"),
        get_block(new Vertex( 1,y,z),"rgba(0,0,255,"+alpha+")"),
        get_block(new Vertex( 0,y,z),"rgba(0,0,255,"+alpha+")"),
        get_block(new Vertex(-1,y,z),"rgba(0,0,255,"+alpha+")"),
        get_block(new Vertex(-2,y,z),"rgba(0,0,255,"+alpha+")"),
    ]
}


const draw_box = () => {
    
}


const draw_arrows = () => {
    var up = "↑"
    var down = "↓"
    ctx.font = "30vw Verdana"
    ctx.fillStyle = "rgba(255,255,255,0.4)"
    ctx.save()
    ctx.translate(20, c.height-100)
    ctx.rotate(rad(30))
    ctx.translate(-20, -c.height+100)
    ctx.fillText(down, 20, c.height-100)
    ctx.restore()
    ctx.save()/*Martin*/
    ctx.translate(c.width-60, c.height-70)
    ctx.rotate(rad(-30))
    ctx.translate(-c.width+60, -c.height+70)
    ctx.fillText(up, c.width-60, c.height-70)
    ctx.restore()
}



/***************************************************************/















/**************************[MAIN]*******************************/

const setup = () => {
    score_ref = document.getElementById("score")
    snake_x_ref = document.getElementById("snake_x")
    snake_y_ref = document.getElementById("snake_y")
    snake_z_ref = document.getElementById("snake_z")
    food_x_ref = document.getElementById("food_x")
    food_y_ref = document.getElementById("food_y")
    food_z_ref = document.getElementById("food_z")
    highscore_ref = document.getElementById("highscore")
    restore()
    highscore_ref.innerHTML = "Highscore: "+(highscore||0)

    cam = new Camera(new Vertex(0,0,0), [0, 0, 0])
    touch = {x:0, y:0}
    
    alpha = 0.4
    add_objects()
    add_event_listeners()
    
    /*
    food = new Sphere(new Vertex(0,0,15), 1, 10,
    "rgba(255,0,0,0.5)") */ /*Martin*/
    food = get_block(new Vertex(0,0,15),
                     "rgba(255,0,0,"+alpha+")", 0.5, "white")
    
    snake_fps = 3
    init_snake_fps = 3
    
    snake_interval = setInterval(()=>{
        update_block_pos()
        save()
    }, 1000/snake_fps)
}

const update = () => {
    
}

const draw = () => {
    for(let block of sort(blocks.concat([food])))
        block.draw()
    // new Vertex(0,0,0).draw("lime")
    
    draw_arrows()
}

/***************************************************************/

















/*************************[FUNCTIONS]***************************/

const save = () => {
    try {
        localStorage.setItem("snake_3d_highscore", highscore)
    } catch(e) {}
}

const restore = () => {
    try {
        let v = localStorage.getItem("snake_3d_highscore")
        highscore = (v=="null" || v==null)?0:v
    } catch(e) {
        highscore = 0
    }
}






const deg = (rad) => rad*180/Math.PI
const rad = (deg) => deg*Math.PI/180
const cos = (deg) => Math.cos(rad(deg))
const sin = (deg) => Math.sin(rad(deg))
const print = (obj) => console.log(JSON.stringify(obj))
const vec = (x,y,z) => {
    let v = new Vertex(0,0,1)
    v.rotate(x,y,z)
    return v
}
const sort = (surfs) => {
    let ss = surfs.slice()
    ss.sort((a,b)=>{return a.center.length <
                           b.center.length?1:-1})
    return ss
}


const max = (a,b) => a>b?a:b
const min = (a,b) => a<b?a:b

const equals = (a,b) => {
    if(a.x == b.x && a.y == b.y && a.z == b.z)
        return true
    return false
}

const contains = (b,a) => {
    for(let e of b) {
        if(equals(a.pos,e.pos)) 
            return true
    } return false
}


/***************************************************************

/***************************************************************/


const add_event_listeners = () => {
    window.addEventListener("touchstart", (e)=>{
        touch.x = e.touches[e.touches.length-1].clientX
        touch.y = e.touches[e.touches.length-1].clientY
    })
    
    window.addEventListener("touchmove", (e)=>{
        let dx = (e.touches[e.touches.length-1].
                  clientX - touch.x)
        let dy = (e.touches[e.touches.length-1].
                  clientY - touch.y)
                  
        if(Math.abs(dx) > Math.abs(dy))
            (dx>0 && dir!="-x" && dir!="x")?right():
             (dx<0 && dir!="x" && dir!="-x")?left():null
        else (dy>0 && dir!="y" && dir!="-y")?backward():
            (dy<0 && dir!="-y" && dir!="y")?forward():null
    })
    
    window.addEventListener("click", (e)=>{
        (e.clientX < c.width/2 && dir!="z" && dir!="-z")?down():
        (e.clientX > c.width/2 && dir!="-z"&& dir!="z")?up():null
    })

    window.addEventListener("dblclick", pause_play)

}



const pause_play = () => {
    if(snake_interval) {
        clearInterval(snake_interval)
        snake_interval = false
    } else 
        snake_interval = setInterval(()=>{
            update_block_pos()
        }, 1000/snake_fps)
}



const info = () => {
    pause_play()
    let text = "Swipe to go up/left/down/right and "+
        "tap right to move away, tap left to go towards you."+
        "\nDouble click to pause/play".replace("\n","<br>")
    /*Martin*/
    let window = create_window(text)
    document.body.appendChild(window)
    
    let box = window.getBoundingClientRect()
    window.firstChild.style.height =
    (box.height-0.2*c.height)+"px"

}

const create_window = (text) => {
    let div = document.createElement("div")
    div.style.width = "80%"
    div.style.height = "60%"
    div.style.padding = "10% 0 10% 0"
    div.style.position = "absolute"
    div.style.left = "10%"
    div.style.top = "10%"
    div.style.background = "rgba(0,0,0,0.5)"
    div.style.borderRadius = "4vw"
    
    let exit = document.createElement("button")
    exit.style.width = "10vw"
    exit.style.height = "10vw"
    exit.style.position = "absolute"
    exit.style.right = "2vw"
    exit.style.top = "2vw"
    exit.style.borderRadius = "2vw"
    exit.style.outline = "none"
    exit.style.background = "rgba(255,0,0,0.5)"
    exit.innerHTML = "✖"
    exit.style.color = "white"
    exit.style.borderColor = "red"
    exit.style.fontSize = "5vw"
    exit.onclick = () => {
        document.body.removeChild(div)
        pause_play()
        setTimeout(()=>{dir = last_dir})
    }
    
    let text_div = document.createElement("div")
    text_div.style.width = "70%"
    text_div.style.height = "100%"
    text_div.style.padding = "5% 5% 5% 5%"
    text_div.style.position = "absolute"
    text_div.style.left = "10%"
    text_div.style.top = "10%"
    text_div.style.background = "rgba(0,0,0,0)"
    text_div.style.borderRadius = "4vw"
    text_div.style.color = "white"
    
    text_div.innerHTML = text
    
    div.appendChild(text_div)
    div.appendChild(exit)
    
    return div
}








score = 0
dir = "z" 
last_dir = "z"
next_dir = "z"

const up = (state, s) => {
    last_dir = dir
    next_dir = "z"
}
const down = (state, s) => {
    last_dir = dir
    next_dir = "-z"
}
const left = (state, s) => {
    last_dir = dir
    next_dir = "-x"
}
const right = (state, s) => {
    last_dir = dir
    next_dir = "x"
}
const forward = (state, s) => {
    last_dir = dir
    next_dir = "y"
}
const backward = (state, s) => {
    last_dir = dir
    next_dir = "-y"
}


const color_coords = () => {
    if(blocks[0].pos.x < food.pos.x)
        snake_x_ref.style.color = "red"
    else if(blocks[0].pos.x > food.pos.x)
        snake_x_ref.style.color = "yellow"
    else snake_x_ref.style.color = "lime"
    
    if(blocks[0].pos.y < food.pos.y)
        snake_y_ref.style.color = "red"
    else if(blocks[0].pos.y > food.pos.y)
        snake_y_ref.style.color = "yellow"
    else snake_y_ref.style.color = "lime"
    
    if(blocks[0].pos.z < food.pos.z)
        snake_z_ref.style.color = "red"
    else if(blocks[0].pos.z > food.pos.z)
        snake_z_ref.style.color = "yellow"
    else snake_z_ref.style.color = "lime"
}



const update_block_pos = () => { if(blocks.length) {
    let pos = []
    for(let b of blocks) pos.push(b.pos.copy)
    var last = blocks[blocks.length-1].pos.copy
    
    food_x_ref.innerHTML = "x: "+food.pos.x
    food_y_ref.innerHTML = ", y: "+food.pos.y
    food_z_ref.innerHTML = ", z: "+food.pos.z
    
    snake_x_ref.innerHTML = "x: "+blocks[0].pos.x
    snake_y_ref.innerHTML = ", y: "+blocks[0].pos.y
    snake_z_ref.innerHTML = ", z: "+blocks[0].pos.z
    
    color_coords()
    
    dir = next_dir
    if(dir == "x") blocks[0].pos.x += 1
    else if(dir == "-x") blocks[0].pos.x -= 1
    else if(dir == "y") blocks[0].pos.y += 1
    else if(dir == "-y") blocks[0].pos.y -= 1
    else if(dir == "z") blocks[0].pos.z += 1
    else if(dir == "-z") blocks[0].pos.z -= 1
    
    for(let i in blocks.slice(1)) {
        blocks[parseInt(i)+1].pos = pos[parseInt(i)]
    }
    
    eat(last)
    restart()
}}

const restart = () => {
    if(contains(blocks.slice(1), blocks[0])) {
        snake_fps = init_snake_fps
        score = 0/*Martin*/
        score_ref.innerHTML = "Score: "+score
        blocks = []; dir = "z"
        setTimeout(()=>{
            add_objects()
        }, 500)
    }
}



const eat = (last) => {
    if(equals(blocks[0].pos,food.pos)) {
        let x = Math.ceil(10*Math.random()-5)
        let y = Math.ceil(12*Math.random()-6)
        let z = Math.ceil(20*Math.random()+10)
        food.pos = new Vertex(x,y,z)
        food.color = "hsla("+360*Math.random()+",100%,50%,"+
        alpha+")"
        
        while(contains(blocks, food)) {
            let x = Math.ceil(10*Math.random()-5)
            let y = Math.ceil(12*Math.random()-6)
            let z = Math.ceil(20*Math.random()+10)
            food.pos = new Vertex(x,y,z)
        } blocks.push(get_block(last, "rgba(0,0,255,0.5)"))
        
        score_ref.innerHTML = "Score: "+ ++score
        highscore = max(score, highscore)
        highscore_ref.innerHTML = "Highscore: "+highscore
        
        if(score % 15 == 0) {
            snake_fps++
            pause_play()
            pause_play()
        }
    }
}
