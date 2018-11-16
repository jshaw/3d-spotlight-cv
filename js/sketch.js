// Threshhold and trails tracking forked from Kyle McDonalds example
// https://kylemcdonald.github.io/cv-examples/

var capture;
var w = 640;
var h = 480;

var trailPointsLength = 100;
var trailPoints = [];
var targetColor = [255, 255, 255];

var sketch = function(p) {
    var capture;

    p.setup = function(){
        p.createCanvas(w, h);
        p.background(0);

        capture = p.createCapture({
            audio: false,
            video: {
                width: w,
                height: h
            }
        }, function() {
            console.log('capture ready.')
        });
        capture.elt.setAttribute('playsinline', '');
        capture.size(w, h);
        p.createCanvas(w, h);
        capture.hide();
    };

    p.drawTrail = function(nextPoint) {
        trailPoints.push(nextPoint);
        if (trailPoints.length > trailPointsLength) {
            trailPoints.shift();
        }
        p.beginShape();
        trailPoints.forEach(function (point) {
            p.vertex(point.x, point.y);
        })
        p.endShape();
    };

    p.draw = function(){

        capture.loadPixels();

        var sampling = false;
        var sumPosition = p.createVector(0, 0);

        if (capture.pixels.length > 0) { // don't forget this!

            if (p.mouseIsPressed &&
                p.mouseX > 0 && p.mouseX < p.width &&
                p.mouseY > 0 && p.mouseY < p.height) {

                targetColor = capture.get(p.mouseX, p.mouseY);
                sampling = true;
            }

            var cw = capture.width,
                ch = capture.height;
            var i = 0;
            var p_x_l_s = capture.pixels;
            var thresholdAmount = p.select('#thresholdAmount').value();            

            thresholdAmount /= 100.; // this is the slider range
            thresholdAmount *= 255 * 3; // this is the maximum value
            var total = 0;
            for (var y = 0; y < ch; y++) {
                for (var x = 0; x < cw; x++) {
                    var diff =
                        Math.abs(p_x_l_s[i + 0] - targetColor[0]) +
                        Math.abs(p_x_l_s[i + 1] - targetColor[1]) +
                        Math.abs(p_x_l_s[i + 2] - targetColor[2]);
                    var outputValue = 0;
                    if (diff < thresholdAmount) {
                        outputValue = 255;
                        sumPosition.x += x;
                        sumPosition.y += y;
                        total++;
                    }
                    p_x_l_s[i++] = outputValue; // set red
                    p_x_l_s[i++] = outputValue; // set green
                    p_x_l_s[i++] = outputValue; // set blue
                    i++; // skip alpha
                }
            }

            sumPosition.div(total);

            var n = w * h;
            var ratio = total / n;
            p.select('#percentWhite').elt.innerText = p.int(100 * ratio);
        }
        if (!sampling) {
            capture.updatePixels();
        }

        p.image(capture, 0, 0, w, h);

        p.noStroke();
        p.fill(targetColor);
        p.rect(20, 20, 40, 40);

        p.ellipse(sumPosition.x, sumPosition.y, 8, 8);
        global_pos = p.map(sumPosition.x, 0, 640, 0, 100);
        global_light_angle = p.map(sumPosition.y, 0, 480, 0, 1);

        
        p.noFill();
        p.stroke(targetColor);
        p.strokeWeight(8);
        p.drawTrail(sumPosition);
    };
};
