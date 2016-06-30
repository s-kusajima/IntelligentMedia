/*global $, console*/

var appInit;

appInit = function () {
    
    'use strict';
    
    var clearCanvas, drawOuterCircle, drawInnerCircle,
        $canvas          = $('#myCanvas'),
        canvasCtx        = $canvas[0].getContext('2d'),
        
        startButton      = $('#startButton'),
        clearButton      = $('#clearButton'),
        
        center           = {x: canvasCtx.canvas.width / 2.0,
                            y: canvasCtx.canvas.height / 2.0},
        ocr              = 180, // outer cercle radius
        icr              = 100, // inner center radius
        rad              = 0, // radians
        array            = [],
        lineColor        = "rgb(255, 0, 0)",
        
        doDraw           = false;
    
    clearCanvas = function () {
        
        canvasCtx.fillStyle = "rgb(255, 255, 255)";
        canvasCtx.fillRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
    };
    
    drawOuterCircle = function () {
        
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = "rgb(0, 0, 0)";
        canvasCtx.arc(center.x, center.y, ocr, 0, 2 * Math.PI, true);
        canvasCtx.stroke();
        canvasCtx.closePath();
    };
    
    drawInnerCircle = function () {
        
        clearCanvas();
        drawOuterCircle();
        
        var icx = center.x + (ocr - icr) * Math.cos(rad / 180 * Math.PI), // inner center x
            icy = center.y + (ocr - icr) * Math.sin(rad / 180 * Math.PI); // inner center y
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = "rgb(0, 0, 0)";
        canvasCtx.arc(icx, icy, icr, 0, 2 * Math.PI, true);
        canvasCtx.stroke();
        canvasCtx.closePath();
        
        var px = icx + icr * Math.cos((ocr - icr) / icr * rad / 180 * Math.PI), // point x
            py = icy - icr * Math.sin((ocr - icr) / icr * rad / 180 * Math.PI); // point y
        
        var c = $('input[name=color]:checked').val();
        switch (c) {
            case "red":
                lineColor = "rgb(255, 0, 0)";
                break;
            case "green":
                lineColor = "rgb(0, 255, 0)";
                break;
            case "blue":
                lineColor = "rgb(0, 0, 255)";
                break;
        }
        
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = lineColor;
        canvasCtx.arc(px, py, 5, 0, 2 * Math.PI, true);
        canvasCtx.stroke();
        canvasCtx.closePath();
        
        var obj = {"x":px, "y":py, "r":icr, "c":lineColor};
        array.push(obj);
        
        /*
        for (var i = 1; i < array.length; i++) {
            
            if (array[i - 1].r != array[i].r) continue;
            
            canvasCtx.beginPath();
            canvasCtx.strokeStyle = array[i].c;
            canvasCtx.moveTo(array[i - 1].x, array[i - 1].y);
            canvasCtx.lineTo(array[i].x, array[i].y);
            canvasCtx.stroke();
            canvasCtx.closePath();
        }
        */
        
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = array[0].c;
        canvasCtx.moveTo(array[0].x, array[0].y);
        for (var i = 1; i < array.length; i++) {
            if (array[i - 1].r == array[i].r) {
                if (array[i - 1].c == array[i].c) {
                    canvasCtx.lineTo(array[i].x, array[i].y);
                } else {
                    canvasCtx.stroke();
                    canvasCtx.closePath();
                    canvasCtx.beginPath();
                    canvasCtx.strokeStyle = array[i].c;
                    canvasCtx.moveTo(array[i - 1].x, array[i - 1].y);
                    canvasCtx.lineTo(array[i].x, array[i].y);
                }
            } else {
                canvasCtx.stroke();
                canvasCtx.closePath();
                canvasCtx.beginPath();
                canvasCtx.moveTo(array[i].x, array[i].y);
            }
        }
        canvasCtx.stroke();
        canvasCtx.closePath();
        
        rad += 5;
    };
    
    startButton.click(function () {
       
        if (!doDraw) {   
            doDraw = true;
            startButton.text("描画停止");
        } else {
            doDraw = false;
            startButton.text("描画開始");
        }
    });
    
    clearButton.click(function () {
        
        if (doDraw) {
            doDraw = false;
            startButton.text("描画開始");
        }
        
        rad = 0.0;
        array = [];
                
        drawInnerCircle();
    });

    setInterval(function () {
        if (doDraw) drawInnerCircle();
    }, 20);
    // request animation frame
    
    (function init () {
        
        var frequencySlider  = $('#frequencySlider'),
            frequencyValue   = $('#frequencyValue')
        ;
        
        drawInnerCircle();
        frequencySlider.on('change', function () {
            frequencyValue.text(String() + $(this).val());
            icr = $(this).val();
            rad = 0.0;
            drawInnerCircle();
        });
        
    })();
};

$(function main () { 
    'use strict';
    appInit();
});