/*global $, console*/

var appInit;

appInit = function () {
    
    'use strict';
    
    var clearCanvas, drawOuterCircle, drawInnerCircle,
        $canvas          = $('#myCanvas'),
        canvasCtx        = $canvas[0].getContext('2d'),
        
        startButton      = $('#startButton'),
        stopButton       = $('#stopButton'),
        
        center           = {x: canvasCtx.canvas.width / 2.0,
                            y: canvasCtx.canvas.height / 2.0},
        ocr              = canvasCtx.canvas.height / 2.2, // outer cercle radius ///
        icr              = 100,
        rad              = 0,
        array            = [],
        
        doDraw           = false
    ;
    
    clearCanvas = function () {
        
        canvasCtx.fillStyle = "rgb(255, 255, 255)";
        canvasCtx.fillRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
        
    }
    
    drawOuterCircle = function () {
        
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = "rgb(0, 0, 0)";
        canvasCtx.arc(center.x ,center.y, ocr, 0, 2 * Math.PI, true);
        canvasCtx.stroke();
        canvasCtx.closePath();
        
    };
    
    drawInnerCircle = function () {
        
        clearCanvas();
        drawOuterCircle();
        
        var icx = center.x + (ocr - icr) * Math.cos(rad / 180 * Math.PI); // inner center x
        var icy = center.y + (ocr - icr) * Math.sin(rad / 180 * Math.PI); // inner center y
        canvasCtx.beginPath();
        canvasCtx.arc(icx, icy, icr, 0, 2 * Math.PI, true);
        canvasCtx.stroke();
        canvasCtx.closePath();
        
        var px = icx + icr * Math.cos((ocr - icr) / icr * rad / 180 * Math.PI); // point x
        var py = icy - icr * Math.sin((ocr - icr) / icr * rad / 180 * Math.PI); // point y
        
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = "rgb(255, 0, 0)";
        canvasCtx.arc(px, py, 5, 0, 2 * Math.PI, true);
        canvasCtx.stroke();
        canvasCtx.closePath();
        
        var obj = {"x":px, "y":py};
        array.push(obj);
        
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = "rgb(255, 0, 0)";
        canvasCtx.moveTo(array[0].x, array[0].y);
        for(var i = 1; i < array.length; i++){
            canvasCtx.lineTo(array[i].x, array[i].y);
        }
        canvasCtx.stroke();
        
        rad+=10;
        
    };
    
    startButton.click(function () {
       
        if(!doDraw){
            doDraw = true;
            console.log("pushed startbutton");
        }
        
    });
    
    stopButton.click(function () {
       
        if(doDraw){
            doDraw = false;
            console.log("pushed stopbutton");
        }
    });

    var ddd = setInterval(function(){
        if(doDraw) drawInnerCircle();
    }, 50);
    
    (function init(){
        
        var frequencySlider  = $('#frequencySlider'),
            frequencyValue   = $('#frequencyValue')
        ;

        clearCanvas();
        drawOuterCircle();
        drawInnerCircle();
        frequencySlider.on('change mousemove mousedown', function(){
//            drawGraph($(this).val(), 0);
//            frequencyValue.text(String() + ($(this).val() * col) + 'Hz');
        });
    })();
};


$(function main(){ 
    'use strict';
    appInit();
});