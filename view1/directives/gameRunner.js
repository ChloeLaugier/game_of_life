angular.module('myApp.directives', [])
    .directive('gameRunner', ['imageLoader', 'Cell','$parse',
        function (imageLoader, Cell, $parse) {
        "use strict";
        return {
            restrict : 'EAC',
            replace : true,
            scope :{
            },
            template: "<canvas width='"+Math.min(1000, angular.element(document.querySelector('#main'))[0].offsetWidth)+"px' height='"+Math.min(500, angular.element(document.querySelector('#main'))[0].offsetHeight)+"px'></canvas>",
            link: function (scope, element, attribute) {
                var w, h, cells;
                var ncellx, ncelly;
                var start = false;
                //var context;
                var ray = 5;
                var processing = false;
                drawGame();
                //console.log();
                function drawGame() {
                    attribute.$observe('state', function(val){

                        if (val === "start") {
                            scope.stage.removeEventListener("stagemousedown", drawCells);
                            start = true;

                        }
                        else if (val === "stop") {
                            start = false;
                            scope.stage.addEventListener("stagemousedown", drawCells);
                        }
                        else if (val === "clear") {
                            start = false;
                            clear(false);
                            scope.stage.addEventListener("stagemousedown", drawCells);

                        }
                        else if (val === "rand") {
                            start = false;
                            clear(true);
                            scope.stage.addEventListener("stagemousedown", drawCells);

                        }
                    });

                    if (scope.stage) {
                        scope.stage.autoClear = true;
                        scope.stage.removeAllChildren();
                        scope.stage.update();
                    } else {
                        scope.stage = new createjs.Stage(element[0]);
                    }
                    w = scope.stage.canvas.width/2;
                    h = scope.stage.canvas.height/2;
                    ncellx = Math.round(w/10);
                    ncelly = Math.round(h/10);

                    handleComplete();


                }
                function handleComplete() {


                    cells = new Array();
                    for (var j=0; j<ncelly;j++) {

                        for (var i=0; i<ncellx; i++) {
                            var state = 0;
                            if (Math.random() < 0.3) {
                                state = 1;
                            }
                            var cell = new Cell({x:ray+i*ray*2, y:ray+j*ray*2, ray:ray, state:state, w:w, h:h});
                            cell.addToStage(scope.stage);
                            cells.push(cell);
                        }


                    }

                    scope.stage.addEventListener("stagemousedown", drawCells);
                    createjs.Ticker.timingMode = createjs.Ticker.RAF;
                    createjs.Ticker.addEventListener("tick", tick);
                }

                function clear(withRand) {

                    for (var i=0;i<ncelly;i++) {
                        for (var j=0;j<ncellx;j++) {

                            var index = i*ncellx+j;
                            cells[index].setCurrentState(0);
                            if (withRand) {
                                if (Math.random()<0.3) {
                                    cells[index].setCurrentState(1);
                                }
                            }

                            cells[index].setFutureState(0);
                            cells[index].draw();
                        }
                    }

                }

                function tick(event) {

                    if (!processing && start) {

                        drawNextStep();

                    }
                    scope.stage.update(event);
                }

                function drawCells(event) {


                    var px = event.stageX;
                    var py = event.stageY;

                    if (px > w) {
                        px = w*2-px;

                    }
                    if (py>h) {
                        py = h*2 - py;
                    }

                    px = Math.round(px/10);
                    py = Math.round(py/10);

                    var cell = cells[py*ncellx+px];
                    cell.setCurrentState(1);
                    cell.setFutureState(0);
                    cell.fill();


                }

                function drawNextStep() {
                    processing = true;

                    for (var i=1;i<ncelly-1;i++) {
                        for (var j=1;j<ncellx-1;j++) {

                            var index = i*ncellx+j;
                            var score = calculateNeighboursScore(index);
                            calculateFutureState(cells[index], score);
                        }
                    }
                    angular.forEach(cells, function(value, key) {

                        value.update();

                    });
                    processing = false;
                }

                function calculateNeighboursScore(cellkey) {

                    var sc = 0;

                    //if (cellkey % ncellx !=  ncellx-1) {//except right
                        //1 0
                        sc+=cells[cellkey+1].getCurrentState();
                        //1 1
                        sc+=cells[cellkey+1+ncellx].getCurrentState();
                        //1 -1
                        sc+=cells[cellkey+1-ncellx].getCurrentState();

                    //}

                    //if (cellkey % ncellx !=  0) {//execpt left

                        //-1 0
                        sc+=cells[cellkey-1].getCurrentState();
                        //-1 1
                        sc+=cells[cellkey-1+ncellx].getCurrentState();
                        //1 -1
                        sc+=cells[cellkey-1-ncellx].getCurrentState();

                    //}
                    //0 1
                    //if (cellkey+ncellx < cells.length) {
                        sc+=cells[cellkey+ncellx].getCurrentState();
                    //}
                    //0 -1
                    //if (cellkey-ncellx>0) {
                        sc+=cells[cellkey-ncellx].getCurrentState();
                    //}

                    return sc;

                }

                function calculateFutureState(cell, sc) {

                    if (cell.getCurrentState()==1 ) {
                        if (sc<2 || sc>3) {
                            cell.setFutureState(0);
                        }
                        else {
                            cell.setFutureState(1);
                        }

                    }
                    else if (cell.getCurrentState()==0 ) {
                        if (sc==3) {
                            cell.setFutureState(1);
                        }
                        else {
                            cell.setFutureState(0);
                        }
                    }


                }
            }
        }
    }]);