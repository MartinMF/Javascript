/* TODOs
    - Info button in game screen
    - Power-Ups ingame             || -- WIP -- || -- done -- ||
    - Power-Ups in shop            || -- WIP -- ||
        - smaller player
        - faster radius change
    - Color options in menu
    - pause button
*/


/*
Power-Ups
    Red: One extra heart
    Orange: Slowmotion (5s)
    Yellow: Double Money (10s)
    Pink: Shrinks Player to 1/3 initial size (10s)
    Blue: Double Radius in-/decrement (10s)
*/


/* <var initialization> */

window.onload = function() {
     orbit = {
         vars: {
             fps: create_fps_counter(),
             now: Date.now(),
             mainframe: Date.now(),
             w: window.innerWidth,
             h: window.innerHeight,
             vec_color: "rgb(0,100,0)",
             money: 0,
             start_lifes: 1,
             lifes: 1,
             screens: {
                 money: create_money_counter(),
                 lifes: create_lifes_screen(),
                 main: {
                     button_width_percentage: 0.8,
                     button_height_percentage: 0.25,
                     background_color: "rgba(0,0,0)",
                     button_color: "#0a0",
                     button_font_size: "50px"
                 },
                 game: {
                     ctx: false,
                     joystick: false,
                     score: create_score_counter(),
                     high_score: create_high_score_counter(),
                     pause: create_pause_button()
                 },
                 back: {
                     width: 52,
                     height: 26,
                     border_radius: 12,
                     margin_top: 5,
                     margin_left: 5,
                     background_color: "red",
                     font_size: "18px"
                 },
                 shop_buttons: {
                     plus_one: {
                         price: 40,
                         button: false,
                         effect: ()=> {
                             let p = orbit.vars.screens
                             .shop_buttons.plus_one.price
                             if(orbit.vars.money >= p) {
                                 orbit.vars.lifes += 1
                                 orbit.vars.money -= p
                                 save()
                             }
                         }
                     },
                     add_one: {
                         price: 150,
                         button: false,
                         effect: ()=> {
                             let p = orbit.vars.screens
                             .shop_buttons.add_one.price
                             if(orbit.vars.money >= p) {
                                 orbit.vars.lifes += 1
                                 orbit.vars.start_lifes += 1
                                 orbit.vars.money -= p
                                 save()
                             }
                         }
                     },
                     double_money_next: {
                         price: 150,
                         button: false,
                         effect: ()=> {
                             let p = orbit.vars.screens
                           .shop_buttons.double_money_next.price
                             if(orbit.vars.money >= p) {
                                 orbit.vars.money -= p
                                 double_money_next_buy()
                                 save()
                             }
                         }
                     },
                     always_double: {
                         price: 1000,
                         button: false,
                         effect: ()=> {
                             let p = orbit.vars.screens
                           .shop_buttons.always_double.price
                             if(orbit.vars.money >= p &&
                             orbit.game.vars
                            .constant_money_multiplier == 1) {
                                 orbit.vars.money -= p
                                 always_double_buy()
                                 save()
                             }
                         }
                     },
                 }
             }
         },
         game: {
             player: {
                 x: 0,
                 y: 0,
                 can_shoot: true,
                 invincible: false,
                 color: "rgb(0,0,255)",
                 radius: 7.5,
                 image: new Image(),
                 src: "http://media.openclipart.org/"+
                 "people/roboxel/1080px-1510167593.png",
                 speed: {
                     clockwise: true,
                     actual: 0.02,
                     change: 0.0000008
                 },
                 angle_rad: 0,
                 circle: {
                     radius: {
                         min: window.innerWidth/10,
                         actual: window.innerWidth/3,
                         max: window.innerWidth/2-12,
                         vec_div_change: 40
                     },
                     thickness: 1,
                     center: [window.innerWidth/2,
                     window.innerHeight-window.innerWidth/2],
                     color: "rgb(0,0,255)",
                     visible: true
                 },
                 guide_lines: {
                     visible: true,
                     thickness: 3,
                     color: "rgba(0,0,255,0.2)"
                 }
             },
             laser: {
                 color: "rgb(255,255,255)",
                 shadow_color: "rgb(255,0,0)",
                 width: 5,
                 height: 15,
                 speed: 3
             },
             rock: {
                 width: [15,30],
                 height: [15,30],
                 spawns_per_second: 0.6,
                 spawns_at_player_percentage: 90,
                 types:["unhittable","one_hit",
                        "two_hit","three_hit"],
                 hit_points: {
                     unhittable : 1,
                    one_hit : 1,
                    two_hit: 2,
                     three_hit: 3
                 },
                 color: {
                     unhittable : "rgb(255,200,200)",
                     one_hit : "rgb(200,255,200)",
                     two_hit: "rgb(200,200,255)",
                     three_hit: "rgb(255,200,255)"
                 },
                 shadow_color: {
                     unhittable : "rgba(255,0,0,1)",
                     one_hit : "rgba(0,255,0,1)",
                     two_hit: "rgba(0,0,255,1)",
                     three_hit: "rgba(255,0,255,1)"
                 },
                 speed: {
                     unhittable : function(w) {return 2-w/30},
                     one_hit : function(w) {return 2-w/30},
                     two_hit: function(w) {return 2-w/30},
                     three_hit: function(w) {return 2-w/30}
                 },
                 spawn_rate_percentage: {
                     unhittable : 10,
                     one_hit : 70,
                     two_hit: 10,
                     three_hit: 10
                 }
             },
             bonus: {
                 radius: 5,
                 spawns_per_second: 0.2, // 0.1
                 spawns_at_player_percentage: 10,
                 types: ["slomo","extra_life","speed_radius",
                         "small_player", "double_money",
                         "double_shot"],
                 speed: 1,
                 color: {
                     "slomo": "#ffa500",
                  // "extra_life": "#f00",
                     "extra_life": "https://purepng.com/"+
                     "public/uploads/large/purepng"+
                     ".com-red-heartheartoxygen-an"+
                     "d-nutrientshumanclipartlove"+
                     "-1421526551727hgguv.png",
                     "speed_radius": "#00f",
                     "small_player": "#f0f",
                     "double_money": "https://rpelm.com/"+
                     "images/coin-clipart-transparent-"+
                     "background-11.png",
                     "double_shot": "#0ff",
                 },
                 spawn_rate_percentage: {
                     "slomo": 14,
                     "extra_life": 25,
                     "speed_radius": 15,
                     "small_player": 15,
                     "double_money": 16,
                     "double_shot": 15
                 },
                 effect: { // [[effects], [clear_effects]]
                    "slomo":[
                        [()=>orbit.game.rock.speed
                         .unhittable=.3,
                         ()=>orbit.game.rock.speed
                         .one_hit=.3,
                         ()=>orbit.game.rock.speed
                         .two_hit=.3,
                         ()=>orbit.game.rock.speed
                         .three_hit=.3],
                        [()=>{orbit.game.rock.speed
                         .unhittable=(w)=>2-w/30},
                         ()=>{orbit.game.rock.speed
                         .one_hit=(w)=>2-w/30},
                         ()=>{orbit.game.rock.speed
                         .two_hit=(w)=>2-w/30},
                         ()=>{orbit.game.rock.speed
                         .three_hit=(w)=>2-w/30}]],
                    "extra_life": [[
                        ()=>orbit.vars.lifes += 1],
                        [()=>{}]],
                    "speed_radius": [
                        [()=>orbit.game.player.circle.radius
                             .vec_div_change/=2],
                        [()=>orbit.game.player.circle.radius
                             .vec_div_change*=2]
                    ],
                    "small_player": [
                        [()=>orbit.game.player.radius /= 3],
                        [()=>orbit.game.player.radius *= 3]
                    ],
                    "double_money": [
                        [()=>{orbit.game.vars
                         .money_multiplier *= 2}],
                        [()=>orbit.game.vars
                         .money_multiplier /= 2]
                    ],
                    "double_shot": [
                        [()=>orbit.game.vars.double_shot = 1],
                        [()=>{
                            if(!orbit.game.vars
                            .bought_double_sit)
                                orbit.game.vars.double_shot = 0
                        }]
                    ],
                 },
                 duration: {
                     "slomo": 5,
                     "extra_life": 1,
                     "speed_radius": 10,
                     "small_player": 10,
                     "double_money": 10,
                     "double_shot": 15,
                 }
             },
             vars: {
                 player: false,
                 paused: false,
                 in_game: false,
                 game_started: false,
                 game_over: false,
                 score: 0,
                 high_score: 0,
                 bonus_frame: 0,
                 rock_frame: 0,
                 frame: 0,
                 lasers: [],
                 rocks: [],
                 boni: [],
                 level: 1,
                 constant_money_multiplier: 1,
                 money_multiplier: 2,
                 double_shot: 0,
                 bought_double_shot: 0,
             }
         }
     }


    orbit.screens = {
        main: create_main_screen(),
        game: create_game_screen(),
        menu: create_menu_screen(),
        shop: create_shop_screen()
    }
    
    orbit.game.vars.player = new Player()

     
     setTimeout(()=> {
         document.body.innerHTML = ""
         add(orbit.screens.main)
         restore()
     },3000)
}

/* </var initialization> */









/***************************[SCREENS]***************************/
// orbit has not been created when below functions are called

// TODO: generalize the back divs to one function to not make
//       it 3 times seperatly

/* <screen creators> */

function create_money_counter() {
    let money = document.createElement("p")
    money.style.position = "absolute"
    money.style.top = "0"
    money.style.left = "25%"
    money.style.transform = "translate(-50%,-50%)"
    money.style.color = "#fff"
    money.style.userSelect = "none"
    money.innerHTML = "0 &#128171"
    return money
}


function create_lifes_screen() {
    let lifes = document.createElement("p")
    lifes.style.position = "absolute"
    lifes.style.top = "0"
    lifes.style.left = "75%"
    lifes.style.transform = "translate(-50%,-50%)"
    lifes.style.color = "#fff"
    lifes.style.userSelect = "none"
    lifes.innerHTML = "\u2665"
    return lifes
}


function create_main_screen() {
    var main_div = document.createElement("div")
    main_div.style.width = orbit.vars.w+"px"
    main_div.style.height = 8/8*orbit.vars.h+"px" // 7/8
    //main_div.style.paddingTop = orbit.vars.h/16+"px"
    //main_div.style.paddingBottom = orbit.vars.h/16+"px"
    main_div.style.backgroundColor = orbit.vars.screens.main
                                     .background_color
                                     
    var game_div = document.createElement("div")
    game_div.style.position = "relative"
    game_div.style.top = 1/16*orbit.vars.h+"px"
    game_div.style.width = orbit.vars.screens.main
                      .button_width_percentage*orbit.vars.w+"px"
    game_div.style.height = orbit.vars.screens.main
                     .button_height_percentage*orbit.vars.h+"px"
    game_div.style.backgroundColor = orbit.vars.screens.main
                           .button_color
    game_div.style.borderRadius = orbit.vars.screens.main
                   .button_height_percentage*orbit.vars.h/2+"px"
    game_div.style.marginLeft = (1-orbit.vars.screens.main
                   .button_width_percentage)/2*orbit.vars.w+"px"

    game_div_text = create_centered_text(game_div, "Start")
    game_div_text.style.fontSize =
    orbit.vars.screens.main.button_font_size
    
    
    
    var menu_div = document.createElement("div")
    menu_div.style.position = "relative"
    menu_div.style.top = 1/16*orbit.vars.h+"px"
    menu_div.style.width = orbit.vars.screens.main
                      .button_width_percentage*orbit.vars.w+"px"
    menu_div.style.height = orbit.vars.screens.main
                     .button_height_percentage*orbit.vars.h+"px"
    menu_div.style.backgroundColor = orbit.vars.screens.main
                            .button_color
    menu_div.style.borderRadius = orbit.vars.screens.main
                   .button_height_percentage*orbit.vars.h/2+"px"
    menu_div.style.marginLeft = (1-orbit.vars.screens.main
                   .button_width_percentage)/2*orbit.vars.w+"px"
    menu_div.style.marginTop = orbit.vars.h/16+"px"
    
    menu_div_text = create_centered_text(menu_div, "Menu")
    menu_div_text.style.fontSize =
    orbit.vars.screens.main.button_font_size
    

    var shop_div = document.createElement("div")
    shop_div.style.position = "relative"
    shop_div.style.top = 1/16*orbit.vars.h+"px"
    shop_div.style.width = orbit.vars.screens.main
                      .button_width_percentage*orbit.vars.w+"px"
    shop_div.style.height = orbit.vars.screens.main
                     .button_height_percentage*orbit.vars.h+"px"
    shop_div.style.backgroundColor = orbit.vars.screens.main
                            .button_color
    shop_div.style.borderRadius = orbit.vars.screens.main
                   .button_height_percentage*orbit.vars.h/2+"px"
    shop_div.style.marginLeft = (1-orbit.vars.screens.main
                   .button_width_percentage)/2*orbit.vars.w+"px"
    shop_div.style.marginTop = orbit.vars.h/16+"px"
    
    shop_div_text = create_centered_text(shop_div, "Shop")
    shop_div_text.style.fontSize =
    orbit.vars.screens.main.button_font_size
    

    main_div.appendChild(game_div)
    main_div.appendChild(menu_div)
    main_div.appendChild(shop_div)
    game_div.onclick = start_game_button
    menu_div.onclick = open_menu_button
    shop_div.onclick = open_shop_button
    return main_div
}

function create_game_screen() {
    var c = document.createElement("canvas")
    c.width = orbit.vars.w; c.height = orbit.vars.h
    c.style.width = orbit.vars.w+"px"
    c.style.height = orbit.vars.h+"px"
    c.style.backgroundColor = "black"
    c.addEventListener("touchstart", on_touch_start)
    c.addEventListener("touchmove", on_touch_move)
    c.addEventListener("touchend", on_touch_end)
    c.addEventListener("touchcancel", on_touch_cancel)
    c.addEventListener("click", on_click)
    
    var div = document.createElement("div")
    div.style.width = orbit.vars.w
    div.style.height = orbit.vars.h
    
    var back = document.createElement("div")
    back.style.width = orbit.vars.screens.back.width+"px"
    back.style.height = orbit.vars.screens.back.height+"px"
    back.style.borderRadius =
    orbit.vars.screens.back.border_radius+"px"
    back.style.position = "absolute"
    back.style.left = orbit.vars.screens.back.margin_left+"px"
    back.style.top = orbit.vars.screens.back.margin_top+"px"
    back.style.backgroundColor =
    orbit.vars.screens.back.background_color
    back.onclick = back_to_main
    
    back_div_text = create_centered_text(back, "back")
    back_div_text.style.userSelect = "none"
    back_div_text.style.fontSize =
    orbit.vars.screens.back.font_size
    orbit.vars.screens.game.ctx = c.getContext("2d")
    
    div.appendChild(c)
    div.appendChild(back)
    addTo(orbit.vars.fps,div)
    addTo(orbit.vars.screens.game.score,div)
    div.appendChild(orbit.vars.screens.game.pause)
    
    return div
}



function create_menu_screen() {
    var div = document.createElement("div")
    div.style.width = orbit.vars.w
    div.style.height = orbit.vars.h
    
    var back = document.createElement("div")
    back.style.width = orbit.vars.screens.back.width+"px"
    back.style.height = orbit.vars.screens.back.height+"px"
    back.style.borderRadius =
    orbit.vars.screens.back.border_radius+"px"
    back.style.position = "absolute"
    back.style.left = orbit.vars.screens.back.margin_left+"px"
    back.style.top = orbit.vars.screens.back.margin_top+"px"
    back.style.backgroundColor =
    orbit.vars.screens.back.background_color
    back.onclick = back_to_main
    
    back_div_text = create_centered_text(back, "back")
    back_div_text.style.userSelect = "none"
    back_div_text.style.fontSize =
    orbit.vars.screens.back.font_size
    
    div.appendChild(back)
    
    
    
    return div
}


function create_shop_screen() {
    var div = document.createElement("div")
    div.style.width = orbit.vars.w
    div.style.height = orbit.vars.h
    
    var back = document.createElement("div")
    back.style.width = orbit.vars.screens.back.width+"px"
    back.style.height = orbit.vars.screens.back.height+"px"
    back.style.borderRadius =
    orbit.vars.screens.back.border_radius+"px"
    back.style.position = "absolute"
    back.style.left = orbit.vars.screens.back.margin_left+"px"
    back.style.top = orbit.vars.screens.back.margin_top+"px"
    back.style.backgroundColor =
    orbit.vars.screens.back.background_color
    back.onclick = back_to_main
    
    back_div_text = create_centered_text(back, "back")
    back_div_text.style.userSelect = "none"
    back_div_text.style.fontSize =
    orbit.vars.screens.back.font_size
    
    div.appendChild(back)
    
    
    // shop buttons
    orbit.vars.screens.shop_buttons.plus_one.button = 
    create_shop_button(
    orbit.vars.screens.shop_buttons.plus_one.effect)
    addTo(orbit.vars.screens.shop_buttons.plus_one.button,div)
    
    orbit.vars.screens.shop_buttons.add_one.button = 
    create_shop_button(
    orbit.vars.screens.shop_buttons.add_one.effect)
    addTo(orbit.vars.screens.shop_buttons.add_one.button,div)

    orbit.vars.screens.shop_buttons.double_money_next.button = 
    create_shop_button(
    orbit.vars.screens.shop_buttons.double_money_next.effect)
    addTo(orbit.vars.screens.shop_buttons.double_money_next
    .button,div)

    orbit.vars.screens.shop_buttons.always_double.button = 
    create_shop_button(
    orbit.vars.screens.shop_buttons.always_double.effect)
    addTo(orbit.vars.screens.shop_buttons.always_double.button,
    div)
    
    
    return div
}
/* </screen creators> */


/****************************[SHOP]****************************/


/* <update functions> */

// price updates
function price_updates() {
    update_shop_one()
    update_shop_two()
    update_shop_three()
    update_shop_four()
    
    requestAnimationFrame(price_updates)
}

function update_shop_one() {
    orbit.vars.screens.shop_buttons.plus_one.price =
    40+10*(orbit.vars.lifes-1)
    orbit.vars.screens.shop_buttons.plus_one.button.innerHTML =
    "Buy +1 \u2665 for next round</br>"+
    orbit.vars.screens.shop_buttons.plus_one.price+" &#128171"
}

function update_shop_two() {
    orbit.vars.screens.shop_buttons.add_one.price =
    150+100*(orbit.vars.lifes-1)
    orbit.vars.screens.shop_buttons.add_one.button.innerHTML =
    "Buy +1 \u2665 for every round</br>"+
    orbit.vars.screens.shop_buttons.add_one.price+" &#128171"
}

function update_shop_three() {
    orbit.vars.screens.shop_buttons.double_money_next
    .button.innerHTML =
    "Buy x2 &#128171 for next round</br>"+
   orbit.vars.screens.shop_buttons.double_money_next.price+" &#128171"
}

function update_shop_four() {
    if(orbit.game.vars.constant_money_multiplier == 2)
    always_double_buy()
    orbit.vars.screens.shop_buttons.always_double
    .button.innerHTML =
    "Buy x2 &#128171 for every round</br>"+
     orbit.vars.screens.shop_buttons.always_double.price+
    " &#128171"
}

/* </update functions> */



/***************************[HELPER]***************************/


/* <utility functions> */


bool_to_num = (s) => s == "true" ? 1 : 0

function always_double_buy() {
    orbit.game.vars.constant_money_multiplier = 2
    orbit.vars.screens.shop_buttons
    .always_double.button.style.backgroundColor = "green"
    orbit.vars.screens.shop_buttons
    .always_double.button.style.borderColor = "green"
    orbit.vars.screens.shop_buttons
    .always_double.button.disabled = true
}

function double_money_next_buy() {
    orbit.game.vars.money_multiplier = 2
    orbit.vars.screens.shop_buttons
    .double_money_next.button.style.backgroundColor = "green"
    orbit.vars.screens.shop_buttons
    .double_money_next.button.style.borderColor = "green"
    orbit.vars.screens.shop_buttons
    .double_money_next.button.disabled = true
}



function create_pause_button() {
    let button = document.createElement("button")
    button.style.width = "50px"
    button.style.height = "50px"
    button.style.position = "absolute"
    button.style.left = "5px"
    button.style.bottom = "0"
    button.style.borderRadius = "5px"
    button.style.backgroundColor = "#000"
    button.style.color = "white"
    button.style.outline = "none"
    button.style.borderColor = "#00f"
    button.style.fontSize = "35px"
    button.style.paddingBottom = "0"
    button.style.fontWeight = "bolder"
    button.style.userSelect = "none"
    button.innerHTML = "II"
    button.onclick = () => {
        button.innerHTML = button.innerHTML == "\u25B6" ?
        "II" : "\u25B6"
        if(orbit.game.vars.paused) {
            orbit.game.vars.paused = false
            requestAnimationFrame(animate)
        } else {
            orbit.game.vars.paused = true
        }
    }
    return button
}


function create_shop_button(click) {
    let button = document.createElement("button")
    button.style.width = 2*window.innerWidth/3+"px"
    button.style.position = "relative"
    button.style.left = "50%"
    button.style.transform = "translate(-50%, 100%)"
    button.style.height = "60px"
    button.style.borderRadius = "20px"
    button.style.backgroundColor = "#5f5"
    button.style.outline = "none"
    button.style.borderColor = "#0a0"
    button.style.color = "black"
    button.style.fontSize = "1.2em"
    button.style.marginBottom = "20px"
    button.style.fontWeight = "bolder"
    button.style.userSelect = "none"
    button.style.borderWidth = ".2em"
    button.onclick = click
    return button
}


function add(e) {document.body.appendChild(e)}
function del(e) {document.body.removeChild(e)}
function addTo(e,p) {
    if(e.parentNode) e.parentNode.removeChild(e)
    p.appendChild(e)
}

function create_centered_text(div, text) {
    var div_text = document.createElement("p")
    div.appendChild(div_text)
    div_text.style.position = "absolute"
    div_text.innerHTML = text
    div_text.style.margin = "0"
    div_text.style.top = "50%"
    div_text.style.transform = "translate(-50%, -50%)"
    div_text.style.left = "50%"
    div_text.style.color = "#fff"
    div_text.style.userSelect = "none"
    return div_text
}


distance = (x, y) => Math.sqrt(x**2 + y**2)
clear = () =>  {
    orbit.vars.screens.game.ctx.fillStyle = "#000"
    orbit.vars.screens.game.ctx.fillRect(0,0,orbit.vars.w,
                                             orbit.vars.h)
}

function draw_circle(x,y,r = 30, lw = 6) {
    orbit.vars.screens.game.ctx.beginPath()
    orbit.vars.screens.game.ctx.arc(x,y,r,0,2*Math.PI,0)
    orbit.vars.screens.game.ctx.strokeStyle = "rgba(0,100,0)"
    orbit.vars.screens.game.ctx.lineWidth = lw
    orbit.vars.screens.game.ctx.stroke()
    orbit.vars.screens.game.ctx.closePath()
}


max = (a,b) => a > b ? a : b

/* </utility functions> */

/**************************[BUTTONS]***************************/

/* <button functions> */

start_game_button = function() {
    del(orbit.screens.main)
    add(orbit.screens.game)
    addTo(orbit.vars.screens.game.high_score,orbit.screens.game)
    addTo(orbit.vars.screens.money,orbit.screens.game)
    addTo(orbit.vars.screens.lifes,orbit.screens.game)
    requestAnimationFrame(animate)
}

open_menu_button = function() {
    del(orbit.screens.main)
    add(orbit.screens.menu)
    addTo(orbit.vars.screens.game.high_score,orbit.screens.menu)
    addTo(orbit.vars.screens.money,orbit.screens.menu)
    addTo(orbit.vars.screens.lifes,orbit.screens.menu)
    requestAnimationFrame(update)
}

open_shop_button = function() {
    del(orbit.screens.main)
    add(orbit.screens.shop)
    addTo(orbit.vars.screens.game.high_score,orbit.screens.shop)
    addTo(orbit.vars.screens.money,orbit.screens.shop)
    addTo(orbit.vars.screens.lifes,orbit.screens.shop)
    requestAnimationFrame(update)
    requestAnimationFrame(price_updates)
    restore()
}

back_to_main = function() {
    if(document.body.contains(orbit.screens.game)) end_game()
    document.body.innerHTML = ""
    add(orbit.screens.main)
    orbit.vars.mainframe = Date.now()
    requestAnimationFrame(update)
    addTo(orbit.vars.screens.game.high_score,orbit.screens.main)
    addTo(orbit.vars.screens.money,orbit.screens.main)
    addTo(orbit.vars.screens.lifes,orbit.screens.main)
}

/* </button functions> */


/**************************[TOUCHES]***************************/

/* <touch functions> */

function on_touch_start(e) {
    if(!orbit.vars.screens.game.joystick){
        i = e.touches.length-1
        orbit.vars.screens.game.joystick =
                   new Joystick(e.touches[i].clientX,
                                e.touches[i].clientY)
        orbit.vars.screens.game.joystick.vector =
        new Vector(0.1,0.1)
        orbit.vars.screens.game.joystick.id =
        e.touches[i].identifier
    } else {
        on_click()
    }
}

function on_touch_move(e) {
    e.preventDefault() // prevents scrolling when swiping
    if(orbit.vars.screens.game.joystick)
        orbit.vars.screens.game.joystick.update(e)
}

function on_touch_end(e) {
    if(!e.touches.length) {
        orbit.vars.screens.game.joystick = false
    }
}

function on_touch_cancel(e) {
    on_touch_end(e)
}

function on_click() {
    if(!orbit.game.vars.paused) {
        orbit.game.vars.player.shoot()
        if(orbit.game.vars.double_shot)
            setTimeout(orbit.game.vars.player.shoot, 75)
        }
}

/* </touch functions> */


/**************************[EXTRAS]****************************/

/* <counter elements> */

function create_fps_counter() {
    fps = document.createElement("a")
    fps.style.color = "#fff"
    fps.style.position = "absolute"
    fps.style.top = "5px"
    fps.style.right = "5px"
    fps.style.userSelect = "none"
    return fps
}


function create_score_counter() {
    let score = document.createElement("p")
    score.style.position = "absolute"
    score.style.bottom = window.innerWidth/2+"px"
    score.style.left = "50%"
    score.style.transform = "translate(-50%,150%)"
    score.style.color = "#fff"
    score.style.userSelect = "none"
    score.innerHTML = "0"
    return score
}


function create_high_score_counter() {
    let high_score = document.createElement("p")
    high_score.style.position = "absolute"
    high_score.style.top = "0"
    high_score.style.left = "50%"
    high_score.style.transform = "translate(-50%,-50%)"
    high_score.style.color = "#fff"
    high_score.style.userSelect = "none"
    high_score.innerHTML = "Highscore: 0"
    return high_score
}

/* </counter elements> */



/************************[GAME CLASSES]************************/

/* <Player class> */

function Player() {
    this.update = function() {
        if(orbit.game.player.speed.clockwise) {
            orbit.game.player.angle_rad +=
            orbit.game.player.speed.actual
        } else {
            orbit.game.player.angle_rad -=
            orbit.game.player.speed.actual
        }
       orbit.game.player.x = orbit.game.player.circle.center[0]+
       orbit.game.player.circle.radius.actual*
       Math.cos(orbit.game.player.angle_rad)
       orbit.game.player.y =orbit.game.player.circle.center[1]+
       orbit.game.player.circle.radius.actual*
       Math.sin(orbit.game.player.angle_rad)
       this.draw()
    }
    this.shoot = function() {
        orbit.game.vars.lasers.push(new Laser())
    }
    this.change_circle = function(v) {
    var r = orbit.game.player.circle.radius.actual
    var c = orbit.game.player.circle.radius.vec_div_change
    var min = orbit.game.player.circle.radius.min
    var max = orbit.game.player.circle.radius.max
    var diff = v.dx
        if(diff < 0) { // joystick left
            if(r > min) {
                orbit.game.player.circle.radius.actual +=
                (diff/c)
                orbit.game.player.speed.actual -=
                orbit.game.player.speed.change*diff
            }
        } else {
            if(r < max) {
                orbit.game.player.circle.radius.actual +=
                (diff/c)
                orbit.game.player.speed.actual -=
                orbit.game.player.speed.change*diff
            }
        }
    }
    this.draw = function() {
    /*
        orbit.vars.screens.game.ctx.beginPath()
        orbit.vars.screens.game.ctx.arc(
        orbit.game.player.x,orbit.game.player.y,
                orbit.game.player.radius,0,Math.PI*2)
        orbit.vars.screens.game.ctx.fillStyle =
        orbit.game.player.color
        orbit.vars.screens.game.ctx.strokeStyle =
        orbit.game.player.color
        orbit.vars.screens.game.ctx.fill() 
        // orbit.vars.screens.game.ctx.stroke()
        orbit.vars.screens.game.ctx.closePath() */
        if(orbit.game.player.circle.visible) {
            orbit.vars.screens.game.ctx.beginPath()
            orbit.vars.screens.game.ctx.arc(
                    orbit.game.player.circle.center[0],
                    orbit.game.player.circle.center[1],
                    orbit.game.player.circle.radius.actual,
                    0,Math.PI*2)
            orbit.vars.screens.game.ctx.strokeStyle =
            orbit.game.player.circle.color
            orbit.vars.screens.game.ctx.lineWidth =
            orbit.game.player.circle.thickness
            orbit.vars.screens.game.ctx.stroke()
            orbit.vars.screens.game.ctx.closePath()
        } if(orbit.game.player.guide_lines.visible) {
            orbit.vars.screens.game.ctx.beginPath()
            orbit.vars.screens.game.ctx.arc(
                    orbit.game.player.circle.center[0],
                    orbit.game.player.circle.center[1],
                    orbit.game.player.circle.radius.min,
                    0,Math.PI*2)
            orbit.vars.screens.game.ctx.strokeStyle =
            orbit.game.player.guide_lines.color
            orbit.vars.screens.game.ctx.lineWidth =
            orbit.game.player.guide_lines.thickness
            orbit.vars.screens.game.ctx.stroke()
            orbit.vars.screens.game.ctx.closePath()
            orbit.vars.screens.game.ctx.beginPath()
            orbit.vars.screens.game.ctx.arc(
                    orbit.game.player.circle.center[0],
                    orbit.game.player.circle.center[1],
                    orbit.game.player.circle.radius.max,
                    0,Math.PI*2)
            orbit.vars.screens.game.ctx.strokeStyle =
            orbit.game.player.guide_lines.color
            orbit.vars.screens.game.ctx.lineWidth =
            orbit.game.player.guide_lines.thickness
            orbit.vars.screens.game.ctx.stroke()
            orbit.vars.screens.game.ctx.closePath()
        }
        orbit.game.player.image.src = orbit.game.player.src
        orbit.vars.screens.game.ctx.drawImage(
        orbit.game.player.image,
        orbit.game.player.x-orbit.game.player.radius*1.5,
        orbit.game.player.y-orbit.game.player.radius*1.5,
        orbit.game.player.radius*3, orbit.game.player.radius*3)
        orbit.vars.screens.game.ctx.save()
        draw_circle(orbit.game.player.x,orbit.game.player.y,
        orbit.game.player.radius, 1)
        orbit.vars.screens.game.ctx.restore()
    }
}

/* </Player class> */


/* <Laser class> */

function Laser() {
    this.x = orbit.game.player.x-orbit.game.laser.width/2
    this.y = orbit.game.player.y-orbit.game.laser.height
    this.update = function() {
        this.y -= orbit.game.laser.speed
        this.draw()
    }
    this.draw = function() {
        this.fill()
    }
    this.fill = function() {
        orbit.vars.screens.game.ctx.fillRect(this.x,this.y,
        orbit.game.laser.width,orbit.game.laser.height)
        orbit.vars.screens.game.ctx.fillStyle =
        orbit.game.laser.color
        orbit.vars.screens.game.ctx.shadowColor =
        orbit.game.laser.shadow_color
        orbit.vars.screens.game.ctx.shadowBlur = 7.5
        orbit.vars.screens.game.ctx.fillRect(this.x,this.y,
        orbit.game.laser.width,orbit.game.laser.height)
        orbit.vars.screens.game.ctx.fillRect(this.x,this.y,
        orbit.game.laser.width,orbit.game.laser.height)
        orbit.vars.screens.game.ctx.shadowBlur = 0
    }
}

/* </Laser class> */



/* <Rock class> */

function Rock() {
    this.get_type = function() {
        var types = orbit.game.rock.types
        var all_types = []
        for(let type of types) {
            l = orbit.game.rock.spawn_rate_percentage[type]
            for(let i=0;i<l;i++){
                all_types.push(type)
            }
        }
        let type = all_types[Math.floor(Math.random()*
                   all_types.length)]
        return type
    }
    this.t = this.get_type()
    this.hp = orbit.game.rock.hit_points[this.t]
    var sap = orbit.game.rock.spawns_at_player_percentage
    if(Math.floor(Math.random()*100) > sap) {
        this.x = Math.random()*orbit.vars.w
    } else {
       this.x =
       2*Math.random()*orbit.game.player.circle.radius.actual+
                (orbit.vars.w/2-
                 orbit.game.player.circle.radius.actual)
    }
    this.y = -orbit.game.rock.height[1]
    this.w = Math.random()*
            (orbit.game.rock.width[1]-orbit.game.rock.width[0])+
              orbit.game.rock.width[0]
    this.h = Math.random()*
             (orbit.game.rock.height[1]-
              orbit.game.rock.height[0])+
              orbit.game.rock.height[0]
    this.update = function() {
        try{this.y += orbit.game.rock.speed[this.t](this.w)}
        catch(e) {this.y += orbit.game.rock.speed[this.t]}
        this.draw()
    }
    this.draw = function() {
        this.fill()
    }
    
    this.fill = function() {
        orbit.vars.screens.game.ctx.beginPath()
        orbit.vars.screens.game.ctx.strokeStyle =
        orbit.game.rock.color[this.t]
        orbit.vars.screens.game.ctx.lineWidth = "2px"
        orbit.vars.screens.game.ctx.shadowBlur = 10
        orbit.vars.screens.game.ctx.shadowColor =
        orbit.game.rock.shadow_color[this.t]
        orbit.vars.screens.game.ctx.rect(
        this.x,this.y,this.w,this.h)
        orbit.vars.screens.game.ctx.stroke()
        /*
        orbit.vars.screens.game.ctx.fillRect(
        this.x,this.y,this.w,this.h)
        orbit.vars.screens.game.ctx.fillRect(
        this.x,this.y,this.w,this.h)
        */
        orbit.vars.screens.game.ctx.closePath()
        orbit.vars.screens.game.ctx.shadowBlur = 0
    }
    
    this.collide_lasers = function() {
        for(var laser of orbit.game.vars.lasers) {
            if(this.x < laser.x+orbit.game.laser.width &&
               this.x+this.w > laser.x &&
               this.y+this.h > laser.y &&
               this.y < laser.y) {
                   orbit.game.vars.lasers.shift()
                   // © Martin
                   if(this.t != "unhittable") {
                       this.hp -= 1
                       if(this.hp == 0) {
                           i =
                           orbit.game.vars.rocks.indexOf(this)
                       orbit.game.vars.rocks.splice(i,1)
                       } else {
                           this.t =
                           orbit.game.rock.types[this.hp]
                       }
                   }
               }
        }
    }
    this.collide_player = function() {
        var p = orbit.game.player
        var r = orbit.game.player.radius
        if(p.x-r < this.x+this.w &&
           p.x+r > this.x &&
           p.y-r < this.y+this.h &&
           p.y+r > this.y &&
           !orbit.game.player.invincible) {
            orbit.vars.lifes -= 1
            if(orbit.vars.lifes == 0) {
               if(orbit.vars.money >= 50) {
                  if(confirm("Revive for 50 ?\nScore: "
                   +orbit.game.vars.score)) {
                       orbit.vars.money -= 50
                       orbit.game.vars.rocks = []
                       orbit.vars.lifes = 1
                   } else {
                       end_game()
                   }
               } else {
                   end_game()
               }
           } else {
               let i = orbit.game.vars.rocks.indexOf(this)
               orbit.game.vars.rocks.splice(i,1)
           }
          }
    }
}


/* </Rock class> */


/* <Vector class> */

function Vector(dx, dy) {
    this.dx = dx
    this.dy = dy
    this.get_magnitude = () => distance(this.dx, this.dy)
    this.add = (other) => {
        if(other instanceof Vector) {
            return new Vector(this.dx+other.dx,
            this.dy+other.dy)
        } 
    }
    this.sub = (other) => {
        if(other instanceof Vector) {
            return new Vector(this.dx-other.dx, this.dy-
            other.dy)
        }
    }
    this.mult = (n) => {this.dx *= n; this.dy *= n; return this}
    this.set_magnitude = (m) => this.mult(m/
    this.get_magnitude())
    this.dot = (v) =>  this.dx*v.dx+this.dy*v.dy
    this.draw = (point, color, mult) => {
        orbit.vars.screens.game.ctx.beginPath()
        orbit.vars.screens.game.ctx.moveTo(point.x, point.y)
        if(mult) m = mult
        else m = 1
        orbit.vars.screens.game.ctx.lineTo(m*this.dx+point.x,
                                           m*this.dy+point.y)
        if(color) orbit.vars.screens.game.ctx.strokeStyle =
        color
        else orbit.vars.screens.game.ctx.strokeStyle =
        orbit.vars.vec_color
        orbit.vars.screens.game.ctx.lineWidth = 1
        orbit.vars.screens.game.ctx.stroke()
        orbit.vars.screens.game.ctx.closePath()
    }
}



function Point(x, y) {
    this.x = x
    this.y = y
    this.vector = new Vector(x, y)
}

/* </Vector class> */


/* <Joystick class> */

function Joystick(x,y) {
    this.root = new Point(x,y)
    this.position = new Point(x,y)
    this.vector = new Vector(0,0)
    this.id == 0
    this.draw = function() {
        draw_circle(this.root.x,this.root.y,25,5)
        draw_circle(this.root.x,this.root.y,40,3)
        draw_circle(this.position.x,this.position.y,25,5)
        this.vector.draw(this.root)
    }
    this.update = function(e) {
        for(var t of e.touches) {
            if(t.identifier == this.id) {
                d = distance(t.clientX-this.root.x,
                           t.clientY-this.root.y)              
                this.vector = new Vector(t.clientX-this.root.x,
                                         t.clientY-this.root.y)
                if(d > 100) this.vector.set_magnitude(100)
                this.position = new Point(
                this.root.x+this.vector.dx,
                this.root.y+this.vector.dy)              
            }
        }
    }
}

/* </Joystick class> */




/* <Powerup class> */

function Bonus() {
    this.r = orbit.game.bonus.radius
    this.hit = false
    this.get_type = function() {
        var types = orbit.game.bonus.types
        var all_types = []
        for(let type of types) {
            l = orbit.game.bonus.spawn_rate_percentage[type]
            for(let i=0;i<l;i++){
                all_types.push(type)
            }
        }
        let type = all_types[Math.floor(Math.random()*
                   all_types.length)]
        return type
    }
    this.type = this.get_type()
    var sap = orbit.game.bonus.spawns_at_player_percentage
    if(Math.floor(Math.random()*100) > sap) {
        this.x = Math.random()*orbit.vars.w
    } else {
       this.x = 2*Math.random()*
                 orbit.game.player.circle.radius.actual+
      (orbit.vars.w/2-orbit.game.player.circle.radius.actual)
    }
    this.y = -2*orbit.game.bonus.radius
    
    this.update = function() {
        if((this.collide_player() || this.collide_lasers())
            && !this.hit) {
            this.start_frame = orbit.game.vars.frame
            for(effect of orbit.game.bonus.effect[this.type][0])
                effect()
            this.hit = true
        }
        if(!this.hit) {
            this.draw()
            this.y += orbit.game.bonus.speed
        }
        else if(orbit.game.vars.frame - this.start_frame ==
                this.duration*60){
                for(effect of
                orbit.game.bonus.effect[this.type][1]){
                    effect()
                }
                let i = orbit.game.vars.boni.indexOf(this)
                orbit.game.vars.boni.splice(i,1)
                return false
        } if(this.y > orbit.vars.h) {
            let i = orbit.game.vars.boni.indexOf(this)
            orbit.game.vars.boni.splice(i,1)
            return false
        }
    }
    
    this.duration = orbit.game.bonus.duration[this.type]
    this.draw = function() {
        orbit.vars.screens.game.ctx.save()
        if(orbit.game.bonus.color[this.type].length > 7) {
            let image = new Image()
            image.src = orbit.game.bonus.color[this.type]
            orbit.vars.screens.game.ctx.drawImage(image,
                this.x-orbit.game.bonus.radius*1.5,
                this.y-orbit.game.bonus.radius*1.5,
                orbit.game.bonus.radius*3,
                orbit.game.bonus.radius*3)
        } else {
        orbit.vars.screens.game.ctx.beginPath()
        orbit.vars.screens.game.ctx.arc(
        this.x,this.y,orbit.game.bonus.radius,0,2*Math.PI)
        orbit.vars.screens.game.ctx.fillStyle =
        orbit.game.bonus.color[this.type]
        orbit.vars.screens.game.ctx.strokeStyle =
        orbit.game.bonus.color[this.type]
        orbit.vars.screens.game.ctx.stroke()
        orbit.vars.screens.game.ctx.fill()
        orbit.vars.screens.game.ctx.closePath() }
        orbit.vars.screens.game.ctx.restore()
    }
    this.collide_player = function() {
        var p = orbit.game.player
        var r = orbit.game.player.radius
        if(p.x-r < this.x+this.r &&
           p.x+r > this.x-this.r &&
           p.y-r < this.y+this.r &&
           p.y+r > this.y) {
               return true
           }
    }
    this.collide_lasers = function() {
        for(var laser of orbit.game.vars.lasers) {
            if(this.x-this.r < laser.x+orbit.game.laser.width &&
               this.x+this.r > laser.x &&
               this.y+this.r > laser.y &&
               this.y-this.r < laser.y) {
                   i = orbit.game.vars.lasers.indexOf(laser)
                   orbit.game.vars.lasers.splice(i,1)
                   return true
               }
        }
    }
}

/* </Powerup class> */


/***********************[STATS UPDATES]************************/

/* <stats updates> */

function update() {
    // money
    orbit.vars.screens.money.innerHTML =
    orbit.vars.money + " &#128171"
    
    // lifes
    orbit.vars.screens.lifes.innerHTML = ""
    l = orbit.vars.lifes
    blue = Math.floor(orbit.vars.lifes/27)
    green = Math.floor((l-blue*27)/9)
    yellow = Math.floor((l-blue*27-green*9)/3)
    red = l-(blue*27)-(green*9)-(yellow*3)
    
    orbit.vars.screens.lifes.innerHTML +=
    "&#128153;".repeat(blue)
    orbit.vars.screens.lifes.innerHTML +=
    "&#128154;".repeat(green)
    orbit.vars.screens.lifes.innerHTML +=
    "&#128155;".repeat(yellow)
    orbit.vars.screens.lifes.innerHTML +=
    "&hearts;".repeat(red)
    
    // console.log(orbit.vars.mainframe - Date.now())
    if(Date.now() - orbit.vars.mainframe > 3000) {
        save()
        orbit.vars.mainframe = Date.now()
    }
    requestAnimationFrame(update)
}

/* </stats updates> */


/***********************[GAME FUNCTIONS]***********************/

/* <game states> */


function end_game() {
    // boni reset
    for(bonus of orbit.game.vars.boni) {
        for(clear_effect of
        orbit.game.bonus.effect[bonus.type][1]) {
            if(bonus.hit) clear_effect()
        }
    }
    orbit.game.vars.boni = []
    
    orbit.game.vars.score = 0
    orbit.game.rock.spawns_per_second = 0.6
    orbit.game.vars.rocks = []
    orbit.game.vars.lasers = []
    orbit.vars.lifes = orbit.vars.start_lifes
    orbit.game.vars.money_multiplier = 1
    orbit.game.vars.level = 1
    
    // shop reset
    if(orbit.vars.screens.shop_buttons
   .double_money_next.button) {
        orbit.vars.screens.shop_buttons
        .double_money_next.button.style.backgroundColor = "#0f0"
        orbit.vars.screens.shop_buttons
        .double_money_next.button.style.borderColor = "#0f0"
        orbit.vars.screens.shop_buttons
        .double_money_next.button.disabled = false
    }

    
    save()
}



function save() {
    try {
        localStorage.setItem("orbit_high_score",
        orbit.game.vars.high_score)
        
        localStorage.setItem("orbit_money",
        orbit.vars.money)
        
        localStorage.setItem("orbit_start_lifes",
        orbit.vars.start_lifes)
        
        localStorage.setItem("orbit_const_mon_mul",
        orbit.game.vars.constant_money_multiplier)
        
        localStorage.setItem("orbit_mon_mul",
        orbit.game.vars.money_multiplier)
        
        localStorage.setItem("orbit_lifes",
        orbit.vars.lifes)
        
        let a = orbit.game.vars.money_multiplier == 2 ? "true" : "false"
        localStorage.setItem("orbit_double_next",a)
        
        let b = orbit.game.vars.constant_money_multiplier == 2 ? "true" : "false"
        localStorage.setItem("orbit_always_double",b)
    } catch(e) {
        // alert(e)
    }
}

function restore() {
    try {
        var v = [localStorage.getItem("orbit_high_score"),
                    localStorage.getItem("orbit_money"),
                    localStorage.getItem("orbit_start_lifes"),
                    localStorage.getItem("orbit_const_mon_mul"),
                    localStorage.getItem("orbit_mon_mul"),
                    localStorage.getItem("orbit_lifes"),
                    localStorage.getItem("orbit_double_next"),
                    localStorage.getItem("orbit_always_double")]
        
        if(v[0] != null && v[1] != null && v[2] != null &&
           v[3] != null && v[4] != null && v[5] != null) {
            orbit.game.vars.high_score = parseInt(v[0])
            orbit.vars.money = parseInt(v[1])
            orbit.vars.start_lifes = parseInt(v[2])
            orbit.game.vars.constant_money_multiplier =
            parseInt(v[3])
            orbit.game.vars.money_multiplier = parseInt(v[4])
            orbit.vars.lifes = parseInt(v[5])
            if(v[6] == "true" || v[6] && v[6] != "false")
                double_money_next_buy()
                
            
            if(v[7] == "true" || v[7] && v[7] != "false") always_double_buy()
        }
    } catch(e) {
        // alert(e)
    }
}

/* </game states> */


/*************************[GAME LOOP]**************************/


/* <game loop> */


function animate() {
    clear()

    // frames
    srps = orbit.game.rock.spawns_per_second
    sbps = orbit.game.bonus.spawns_per_second 
    orbit.game.vars.rock_frame += 1
    orbit.game.vars.bonus_frame += 1
    orbit.game.vars.frame += 1
    
    // player
    orbit.game.vars.player.update()
    
    // lasers
    for(laser of orbit.game.vars.lasers) {
        laser.update()
        if(laser.y < -orbit.game.laser.height) {
            let i = orbit.game.vars.lasers.indexOf(laser)
            orbit.game.vars.lasers.splice(i,1)
        }
    }
    
    // rocks
    for(let rock of orbit.game.vars.rocks) {
        rock.update()
        rock.collide_lasers()
        rock.collide_player()
        if(rock.y > orbit.vars.h) {
            let i = orbit.game.vars.rocks.indexOf(rock)
            orbit.game.vars.rocks.splice(i,1)
            let m = orbit.game.vars.money_multiplier
            let cm = orbit.game.vars.constant_money_multiplier
            orbit.game.vars.score += rock.hp
            orbit.vars.money += rock.hp*m*cm
        }
    }
    if(orbit.game.vars.rock_frame >= 60/srps) {
        orbit.game.vars.rock_frame = 0
        orbit.game.vars.rocks.push(new Rock())
    }
    
    
    // boni
    for(bonus of orbit.game.vars.boni) {
        bonus.update()
    }
    if(orbit.game.vars.bonus_frame >= 60/sbps) {
        orbit.game.vars.bonus_frame = 0
        orbit.game.vars.boni.push(new Bonus())
    }
    
    // score
    orbit.vars.screens.game.score.innerHTML =
    orbit.game.vars.score
    orbit.game.vars.high_score =
    max(orbit.game.vars.score,orbit.game.vars.high_score)
    orbit.vars.screens.game.high_score.innerHTML =
    "Highscore: "+ orbit.game.vars.high_score
    if(orbit.game.vars.score >= 10*orbit.game.vars.level) {
        orbit.game.rock.spawns_per_second += 0.2
        orbit.game.vars.level += 1
    }
    
    // money
    orbit.vars.screens.money.innerHTML =
    orbit.vars.money + " &#128171"
    
    // lifes
    orbit.vars.screens.lifes.innerHTML = ""
    l = orbit.vars.lifes
    blue = Math.floor(orbit.vars.lifes/27)
    green = Math.floor((l-blue*27)/9)
    yellow = Math.floor((l-blue*27-green*9)/3)
    red = l-(blue*27)-(green*9)-(yellow*3)
    
    orbit.vars.screens.lifes.innerHTML +=
    "&#128153;".repeat(blue)
    orbit.vars.screens.lifes.innerHTML +=
    "&#128154;".repeat(green)
    orbit.vars.screens.lifes.innerHTML +=
    "&#128155;".repeat(yellow)
    orbit.vars.screens.lifes.innerHTML +=
    "&hearts;".repeat(red)

    
    // joystick
    if(orbit.vars.screens.game.joystick) {
        orbit.vars.screens.game.joystick.draw()
        orbit.game.vars.player.change_circle(
        orbit.vars.screens.game.joystick.vector)
    }
    
    // fps
    orbit.vars.fps.innerHTML =
    Math.round(1000/(Date.now()-orbit.vars.now))
    orbit.vars.now = Date.now()
    
    // animation
    if(document.contains(orbit.screens.game) &&
    !orbit.game.vars.paused) {
        requestAnimationFrame(animate)
    }
}

/* </game loop> */
