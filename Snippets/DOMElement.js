function Element(design, text) {
    this.appendChild = function(element) {
        this.div.appendChild(element.div);
        this.children.push(element);
    };
    
    this.show = function() {
        if(!this.on_screen()) {
            document.body.appendChild(this.div);
        } this.div.style.opacity = "1";
    };
    
    this.hide = function() {
        this.div.style.opacity = "0";
        this.div.style.transition = "";
    };
    
    this.remove = function() {
        if(this.div.parentNode) {
            this.div.parentNode.removeChild(this.div);
        }
    };
     
    this.on_screen = function(node) {
        node = node || this.div;
        if(node.parentNode) {
            var a = node.parentNode == document.body;
            return a || this.on_screen(node.parentNode);
        }
        return false;
    };
     
    this.apply_design = function(design) {
        for(var i in design) {
            this.div.style[i] = design[i];
        }
    };
     
    this.fade_in = function(a) {
        a = a || 1;
        var div = this.div;
        // div.style.left = ""; div.style.right = "";
        this.apply_design({opacity:0, transition:a+"s"});
        this.show();
        setTimeout(function(){div.style.opacity = "1"});
    };
     
    this.fade_out = function(a) {
        a = a || 1;
        var div = this.div, elem = this;
        this.apply_design({opacity:1, transition:a+"s"});
        setTimeout(function(){div.style.opacity = "0"});
        setTimeout(function(){elem.hide();},a*1000);
    };
     
    this.slide_from_right = function(a) {
        a = a || 0.2;
        var div = this.div;
        div.style.left = ""; div.style.right = "";
        this.apply_design({
            left:"100vw",position:"absolute",transition: a+"s"});
        this.show();
        setTimeout(function(){div.style.left = "0"});
    };
     
    this.slide_to_right = function(a) {
        a = a || 0.2;
        var div = this.div, elem = this;
        div.style.left = ""; div.style.right = "";
        this.apply_design({
            left:"0",position:"absolute",transition: a+"s"});
        this.show();
        setTimeout(function(){div.style.left = "100vw"});
        setTimeout(function(){elem.hide();},a*1000);
    };
     
    this.slide_from_left = function(a) {
        a = a || 0.2;
        var div = this.div;
        div.style.left = ""; div.style.right = "";
        this.apply_design({
            right:"100vw",position:"absolute",transition:a+"s"});
        this.show();
        setTimeout(function(){div.style.right = "0"});
    };
     
    this.slide_to_left = function(a) {
        a = a || 0.2;
        var div = this.div; var elem = this;
        div.style.left = ""; div.style.right = "";
        this.apply_design({
            right:"0",position:"absolute",transition:a+"s"});
        this.show();
        setTimeout(function(){div.style.right = "100vw"});
        setTimeout(function(){elem.hide();},a*1000);
    };
     
    this.add_event_listener = function(event, listener) {
        this.div.addEventListener(event, function(e) {
            listener(e);
        });
    };
     
    this.copy_text = function(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text || this.text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    };
    
    
    this.div = document.createElement("div");
    this.apply_design(design);
    this.children = [];
    if(text) this.text = text;
    
    Object.defineProperty(this, "text", {
        get: function() {
            return this.div.innerHTML;
        }, set: function(value) {
            this.div.innerHTML = value;
        }
    });
}

 
var toast = new Element({
    background: "grey", color: "#fff",
    left: "50%", bottom: "10vh", position: "absolute",
    transform: "translate(-50%, 0)",
    padding: "5px 10px 5px 10px", borderRadius: "5px",
    zIndex: "100",
});

toast.makeToast = (text, duration) => {
    duration = duration || text.length*50;
    toast.text = text;
    toast.show();
    clearTimeout(toast.timeout);
    toast.timeout = setTimeout(()=>{
        toast.fade_out();
    }, duration);
};
