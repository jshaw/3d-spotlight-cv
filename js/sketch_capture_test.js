
var w = 640;
var h = 480;

var trailPointsLength = 100;
var trailPoints = [];
var targetColor = [255, 255, 255];


var sketch = function(p) {
    var capture;

    p.setup = function(){
        p.createCanvas(640, 480);
        capture = p.createCapture(p.VIDEO);
        capture.hide();
        p.imageMode(p.CENTER);
    };

    p.draw = function(){
        //  image(capture, 0, 0, 640, 480);
        //    filter('INVERT');
        p.background(66);
        p.noStroke();
        //fill(255, 0, 0, 255);
        capture.loadPixels();
        for (var cy = 0; cy < capture.height; cy += 10) {
            for (var cx = 0; cx < capture.width; cx += 10) {
                var offset = ((cy*capture.width)+cx)*4;
                var xpos = (cx / capture.width) * p.width;
                var ypos = (cy / capture.height) * p.height;
                p.rect(xpos, ypos, 100 * (capture.pixels[offset+1]/2550),
                    100 * (capture.pixels[offset-1]/2550));
            }
        }
        //filter(POSTERIZE,2);
    };
};


// var capture;

// function setup() {
//   createCanvas(640, 480);
//  capture = createCapture(VIDEO);
//   capture.hide();
//   imageMode(CENTER);
// }
// function draw() {
// //  image(capture, 0, 0, 640, 480);
// //    filter('INVERT');
//    background(66);
//     noStroke();
//     //fill(255, 0, 0, 255);
//   capture.loadPixels();
//   for (var cy = 0; cy < capture.height; cy += 10) {
//     for (var cx = 0; cx < capture.width; cx += 10) {
//       var offset = ((cy*capture.width)+cx)*4;
//       var xpos = (cx / capture.width) * width;
//       var ypos = (cy / capture.height) * height;
//       rect(xpos, ypos, 100 * (capture.pixels[offset+1]/2550),
//         100 * (capture.pixels[offset-1]/2550));
//     }
//   }
// //filter(POSTERIZE,2);
// }
