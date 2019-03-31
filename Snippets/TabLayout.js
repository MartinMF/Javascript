function TabLayout(tab_captions) {
    var colors = {
        primary: "#673bb7",
        primary_dark: "#6530bb",
        orange: "#ff5521",
        chat_background: "#eee",
        white: "#fff",
        black: "#000",
        grey: "#666",
    };
     
    var container = document.createElement("div");
    container.style.scrollSnapType = "x mandatory";
    container.style.overflowY = "hidden";
    container.style.overflowX = "scroll";
    container.style.height = "calc(100vh - 40px)";
    container.style.scrollBehavior = "smooth";
     
    var header_container = document.createElement("div");
    header_container.style.scrollSnapType = "x mandatory";
    header_container.style.overflowY = "hidden";
    header_container.style.overflowX = "hidden";
    header_container.style.height = "40px";
    header_container.style.background = colors.primary;
     
    var tabs = {}, headers = {};
    for(var i = 0; i < tab_captions.length; i++) {
        var caption = tab_captions[i];
        var tab = document.createElement("div");
        container.appendChild(tab);
        tab.style.width = "100vw";
        tab.style.height = "calc(100vh - 40px)";
        tab.style.background = colors.white;
        tab.style.borderLeft = "1px solid "+colors.black;
        tab.style.borderRight = "1px solid "+colors.black;
        tab.style.scrollSnapAlign = "start";
        tab.style.marginLeft = (i*100)+"vw";
        if(i!==0) tab.style.marginTop = "calc(-100vh + 40px)";
        tab.style.color = "#fff";
         
        var header =  document.createElement("div");
        header_container.appendChild(header);
        header.style.width = "50vw";
        header.style.height = "40px";
        header.style.background = colors.primary;
        header.style.scrollSnapAlign = "center";
        header.style.borderLeft = "1px solid "+colors.white;
        header.style.borderRight = "1px solid "+colors.white;
        header.style.textAlign = "center";
        header.style.lineHeight = "40px";
        header.style.color = "#fff";
        header.style.marginLeft = (i*50)+25+"vw";
        if(i!==0) header.style.marginTop = "-40px";
        header.innerHTML = caption;
        header.setAttribute("i", i);
         
        header.onclick = function(e) {
            var i = e.target.getAttribute("i");
            container.scrollLeft = i*window.innerWidth;
        };
         
        tabs[caption] = tab; headers[caption] = header;
    }
     
     
    var last_caption =
    headers[tab_captions[tab_captions.length-1]];
     
     
    last_caption.style.background = "linear-gradient(to right, #fff, #fff)"+
    "50vw 0/1px 40px no-repeat";
    last_caption.style.border = "none";
    last_caption.style.paddingRight = "25vw";
    headers[tab_captions[0]].style.marginLeft = "25vw";
     
    document.body.appendChild(header_container);
    document.body.appendChild(container);
     
    var scroll_container = function(e) {
        var s = container.scrollLeft;
        header_container.style.scrollSnapType = "none";
        header_container.scrollLeft = s/2;
    };
     
    container.addEventListener("scroll", scroll_container);
     
     
    this.go_to = function(index) {
        container.scrollLeft = index*window.innerWidth;
        header_container.scrollLeft =
        (2*index-1)*0.25*window.innerWidth;
    };
     
    this.tabs = tabs;
    this.headers = headers;
    this.tab_container = container;
    this.header_container = header_container;
}


/* USAGE EXAMPLE

window.onload = function() {
    var a = new TabLayout(['Hello', 'World', '!']);
};

*/
