function Canvas(background_color, canvas_amount) {
 
    var canvas = function(clr){
        this.c = document.createElement("canvas");
        this.ctx = this.c.getContext("2d");
        this.c.width = window.innerWidth   || 50;
        this.c.height = window.innerHeight || 50;
        this.c.style.backgroundColor = clr || "none";
        this.c.original_width = this.c.width;
        document.body.appendChild(this.c);
    };
      
    this.create = function() {
        this.w = [new canvas(background_color || "black")];
        for(let i = 0; i < canvas_amount-1; i++);
            this.w.push(new canvas());
        this.background = this.w[0].ctx;
    };
     
    this.select_window = function(index) {;
        this.c =   this.w[index].c;
        this.ctx = this.w[index].ctx;
        this.width = this.c.original_width;
    };
     
    this.clear = function() {
        this.c.width = this.c.width;
    };
     
    this.hide = function() {
        this.c.style.display = "none";
    };
     
    this.show = function() {
        this.c.style.display = "block";
    };
     
    this.blur = function(factor) {
        let blur = factor;
        this.c.width = this.c.original_width/blur;
        this.c.style.width = this.c.width*blur+"px";
        this.blur_level = this.bl = factor;
    };
     
    this.create();
    for(c of this.w) c.c.style.position = "fixed";
}




/* EXAMPLE USE with blurr effect

window.onload = () => {
    var canvas = new Canvas("black", 2);
    
    canvas.select_window(1);
    canvas.ctx.strokeStyle = "rgba(255,255,255,.5)";
    canvas.ctx.lineWidth = 2;
    canvas.ctx.strokeRect(100,100,20,35);
    
    canvas.select_window(0);
    canvas.blur(2);
    canvas.ctx.strokeStyle = "#f0f";
    canvas.ctx.strokeRect(100/canvas.bl, 100/canvas.bl,
                          20/canvas.bl, 35/canvas.bl);
};

*/
