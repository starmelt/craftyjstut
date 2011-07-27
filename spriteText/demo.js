window.onload = (function() {
    var WIDTH = 800,
        HEIGHT = 640;
    // Initialize Crafty
    Crafty.init(WIDTH, HEIGHT);
    
    Crafty.load(["../img/BlueBubbleFont.png", "../img/OSDM_Fnt32x32_SyntaxTerror-Copy2.png"], // preload images
        function() {
            // Write some Text (Canvas) using the BlueBubble Font (16x16)
            var txt1 = "BlueBubble!";
            var ts1 = 16;
            var text1 = Crafty.e("2D, Canvas, SpriteText")
                        .attr({x: 0, y: 0, w: txt1.length*ts1, h: ts1})
                        .registerFont("BlueBubble", ts1, "../img/BlueBubbleFont.png")
                        .text(txt1);
            
            // Add the Mouse Component and change text on Click
            text1.addComponent("Mouse");
            text1.bind("Click", function (e) {
                text1.text("clicked!");
            });
            
            // Write some Text (Canvas) using the SyntaxTerror Font (32x32)
            var txt2 = "SyntaxTerror (Canvas)!";
            var ts2 = 32;
            var text2 = Crafty.e("2D, Canvas, SpriteText")
                        .attr({x: 0, y: 100, w: txt2.length*ts2, h: ts2})
                        .registerFont("SyntaxTerror", ts2, "../img/OSDM_Fnt32x32_SyntaxTerror-Copy2.png")
                        .text(txt2);
                        
            // Add the Mouse Component and change text on Click
            text2.addComponent("Mouse");
            text2.bind("Click", function (e) {
                text2.text("clicked!");
            });
                
            // Write some Text (DOM) using the SyntaxTerror Font (32x32)
            var txt3 = "SyntaxTerror again (DOM)!";
            var ts3 = 32;
            var text3 = Crafty.e("2D, DOM, SpriteText")
                        .attr({x: 0, y: 200, w: txt3.length*ts3, h: ts3})
                        .font("SyntaxTerror") // No need to register the Font again, just use it, it's there.
                        .text(txt3);
                        
            // Add the Mouse Component and change text and font on Click
            text3.addComponent("Mouse");
            text3.bind("Click", function (e) {
                text3.font("BlueBubble")
                text3.text("Clicked and Font changed!");
            });
        }
    );
});