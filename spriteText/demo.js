window.onload = (function() {
    var WIDTH = 800,
        HEIGHT = 640;
    // Initialize Crafty
    Crafty.init(WIDTH, HEIGHT);
    var txt1 = "BlueBubble!";
    var ts1 = 16;
    var text = Crafty.e("2D, Canvas, Mouse, SpriteText")
                .attr({x: 0, y: 0, w: txt1.length*ts1, h: ts1})
                .registerFont("BlueBubble", ts1, "../img/BlueBubbleFont.png")
                .text(txt1);
                
    text.bind("Click", function (e) {
        text.text("clicked!");
    });
    
    var txt2 = "SyntaxTerror (Canvas)!";
    var ts2 = 32;
    var text2 = Crafty.e("2D, Canvas, Mouse, SpriteText")
                .attr({x: 0, y: 100, w: txt2.length*ts2, h: ts2})
                .registerFont("SyntaxTerror", ts2, "../img/OSDM_Fnt32x32_SyntaxTerror-Copy2.png")
                .text(txt2);
                
    text2.bind("Click", function (e) {
        text2.text("clicked!");
    });
        
    var txt3 = "SyntaxTerror again (DOM)!";
    var ts3 = 32;
    var text3 = Crafty.e("2D, DOM, Mouse, SpriteText")
                .attr({x: 0, y: 200, w: txt3.length*ts3, h: ts3})
                .registerFont("SyntaxTerror", ts3, "../img/OSDM_Fnt32x32_SyntaxTerror-Copy2.png")
                .text(txt3);
                
    text3.bind("Click", function (e) {
        text3.text("clicked!");
    });
});