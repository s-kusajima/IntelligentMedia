// HTML5 Canvas を利用し，sin 波を描画するプログラムです．
// canvas とはブラウザでビットマップイメージを描画するために策定された仕様です．
// 参考: http://yoppa.org/taumedia10/2065.html

/*global $, console*/

var appInit;

appInit = function () {
    
    'use strict';
    
//    drawGridChart: 座標軸を描画　drawGraph: sin波を描画
    var drawGridChart, drawGraph,
        $canvas          = $('#myCanvas'),              // html 上の canvas 要素を id を指定して取得．
        canvasCtx        = $canvas[0].getContext('2d'), // canvas を利用する際はコンテキストを取得する必要があります．             
                                                        // この書き方はお決まりなので，覚えてしまって良いです．
        row              = 3,  // 座標の y 軸の目盛りの数
        col              = 1,  // 座標の x 軸の目盛りの数
        MARGIN           = 15, // 目盛りを描画する際の余白
        AXIS_Y_MARGIN    = 50, // y 軸左側の余白
        gridProp         = (function () { // 座標系の描画位置を計算

            var prop = {
                x: {
                    start : MARGIN,                          // x 軸の始点
                    end   : canvasCtx.canvas.width - MARGIN, // x 軸の終点
                    length: null,                            // x 軸の長さ
                    center: canvasCtx.canvas.height / 2,     // x 軸の高さ (中心位置)
                    plotPoint:[]                             // x 軸目盛りの x, y 座標．plotPoint[0] には 1つめの目盛りの x, y 座標が格納されている
                },
                y: {
                    start : MARGIN,                          // canvas の y 座標は上下が反転していることにご注意を! 
                                                             // 参考: http://www.html5.jp/canvas/how.html
                    end   : canvasCtx.canvas.height - MARGIN,
                    length: null,
                    center: AXIS_Y_MARGIN,
                    plotPoint:[]
                }
            };

            prop.x.length = Math.abs(prop.x.end - prop.x.start);
            prop.y.length = Math.abs(prop.y.end - prop.y.start);

            for(var i = 0; i < col; i++){
                prop.x.plotPoint[i] = {x:prop.x.start + (prop.x.length / col) * (i + 1), y:prop.x.center + MARGIN};
            }

            for(var i = 0; i < row; i++){
                prop.y.plotPoint[i] = {x:AXIS_Y_MARGIN - MARGIN, y:prop.x.center - (((prop.y.length / 2) / row) * (i + 1) )};
            }

            return prop;
        })()
    ;
    
    // gridProp に基づき座標系を描画
    drawGridChart = function () {

        // canvas を黒色で塗りつぶす．
        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

        canvasCtx.lineWidth   = 1;
        canvasCtx.strokeStyle = 'rgba(255,255,255, 1.0)';

        // canvas で線を描画する
        // 参考... http://www.htmq.com/canvas/lineTo.shtml
        
        // y 軸を描画
        canvasCtx.beginPath(); 
        canvasCtx.moveTo(gridProp.y.center, gridProp.y.start); // 線の始点を指定
        canvasCtx.lineTo(gridProp.y.center, gridProp.y.end  ); // 線の終点を指定
        canvasCtx.stroke();　//  パスを描写．
        canvasCtx.closePath();

        // x 軸を描画
        canvasCtx.beginPath();
        canvasCtx.moveTo(gridProp.x.start, gridProp.x.center);
        canvasCtx.lineTo(gridProp.x.end  , gridProp.x.center);
        canvasCtx.stroke();
        canvasCtx.closePath();

        canvasCtx.fillStyle = 'rgb(255, 255, 255)';
        canvasCtx.font      = '15px "Arial"';

        // x 軸の目盛りを描画．
        for (var i in gridProp.x.plotPoint) {
            var label;
            label = parseInt(i, 10) + 1;
            label = String() + label + 's';
            canvasCtx.fillText(label, gridProp.x.plotPoint[i].x, gridProp.x.plotPoint[i].y);
        }

        // y 軸の目盛りを描画．
        for (var i in gridProp.y.plotPoint) {
            var label;                
            label = parseInt(i, 10) + 1;
            canvasCtx.fillText(label , gridProp.y.plotPoint[i].x, gridProp.y.plotPoint[i].y);  // x 軸より上の y 軸目盛りを描画
        }
    };

    // sin 波を描画．    
    drawGraph = function (frequency, mode) {

        var degree   = 0.0,
            radian   = 0.0,
            // サインはを線で描画するために，1つ前の plot 位置を befPlotX, befPlotY に保存しています．
            befPlotX = ((degree　/ frequency) / col) + gridProp.y.center,
            befPlotY = -Math.sin(radian) *  (gridProp.y.length / 2) + gridProp.x.center
        ;

        drawGridChart();

        canvasCtx.lineWidth   = 1;
        canvasCtx.lineCap     = 'round'; // ペン先の形状
        canvasCtx.strokeStyle = 'rgb(56, 148, 255)';

        canvasCtx.beginPath();

        while (radian < Math.PI * 2 * frequency * col) {

            var plotX = ((degree　/ frequency) / col) + gridProp.y.center,
                plotY = -Math.sin(radian) * (gridProp.y.length / 2) + gridProp.x.center
            ;
            canvasCtx.moveTo(befPlotX, befPlotY);
            canvasCtx.lineTo(plotX, plotY);
            canvasCtx.stroke();

            befPlotX  = plotX;
            befPlotY  = plotY;

            degree += 10;
            radian = degree * Math.PI / ((gridProp.x.length / 2) - MARGIN); // degree を radian に変換
            
            canvasCtx.moveTo(plotX, plotY);
            canvasCtx.lineTo(plotX, (canvasCtx.canvas.height)/2);
            canvasCtx.stroke();
            
        }

        canvasCtx.closePath();    

    };

    
    (function init(){
        
        var frequencySlider  = $('#frequencySlider'),
            frequencyValue   = $('#frequencyValue')
        ;

        drawGridChart();
        frequencySlider.on('change mousemove mousedown', function(){
            drawGraph($(this).val(), 0);
            frequencyValue.text(String() + ($(this).val() * col) + 'Hz');
        });
    })();
};


$(function main(){ 
    'use strict' 
    appInit();
});