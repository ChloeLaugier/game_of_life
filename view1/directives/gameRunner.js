angular.module('myApp.directives', [])
    .directive('gameRunner', ['imageLoader', 'Cell',
        function (imageLoader, Cell) {
        "use strict";
        return {
            restrict : 'EAC',
            replace : true,
            scope :{
            },
            template: "<canvas width='800px' height='500px'></canvas>",
            link: function (scope, element, attribute) {
                var w, h, manifest, sky, cells, ground;
                var incr = 0;
                //var context;
                var ray = 10;
                var processing = false;
                drawGame();
                console.log(angular.element(document.querySelector('#main_container')).offsetHeight);
                function drawGame() {


                    //drawing the game canvas from scratch here
                    //In future we can pass stages as param and load indexes from arrays of background elements etc
                    if (scope.stage) {
                        scope.stage.autoClear = true;
                        scope.stage.removeAllChildren();
                        scope.stage.update();
                    } else {
                        scope.stage = new createjs.Stage(element[0]);
                    }
                    w = scope.stage.canvas.width;
                    h = scope.stage.canvas.height;
                    //imageLoader.getLoader().addEventListener("complete", handleComplete);
                    //imageLoader.loadAssets();
                    //context = scope.stage.canvas.getContext('2d');
                    handleComplete();


                }
                function handleComplete() {


                    cells = new Array();
                    for (var j=0; j<h/20;j++) {

                        for (var i=0; i<w/20; i++) {
                            var state = 0;
                            if (Math.random() < 0.4) {
                                state = 1;
                            }
                            var cell = new Cell({x:ray+i*ray*2, y:ray+j*ray*2, ray:ray, state:state});
                            cell.addToStage(scope.stage);
                            cells.push(cell);
                        }


                    }


                    //scope.stage.addEventListener("stagemousedown", handleNextStep);
                    createjs.Ticker.timingMode = createjs.Ticker.RAF;
                    createjs.Ticker.addEventListener("tick", tick);
                }

                function tick(event) {
                    if (!processing) {
                        drawNextStep();

                    }
                    scope.stage.update(event);
                }

                function handleNextStep() {

                    drawNextStep();
                }

                function drawNextStep() {
                    processing = true;
                    angular.forEach(cells, function(value, key) {

                        var score = calculateNeighboursScore(key);
                        calculateFutureState(value, score);

                    });
                    angular.forEach(cells, function(value, key) {
                        value.update();

                    });
                    processing = false;
                }

                function calculateNeighboursScore(cellkey) {

                    var sc = 0;

                    if (cellkey % (w/20) !=  (w/20)-1) {

                        //1 0
                        sc+=cells[cellkey+1].getCurrentState();
                        //1 1
                        if (cellkey+1+w/20 < cells.length) {
                            sc+=cells[cellkey+1+w/20].getCurrentState();
                        }
                        //1 -1
                        if (cellkey+1-w/20>0) {
                            sc+=cells[cellkey+1-w/20].getCurrentState();
                        }

                    }

                    if (cellkey % (w/20) !=  0) {

                        //-1 0
                        sc+=cells[cellkey-1].getCurrentState();
                        //-1 1
                        if (cellkey-1+w/20 < cells.length) {
                            sc+=cells[cellkey-1+w/20].getCurrentState();
                        }
                        //1 -1
                        if (cellkey-1-w/20>0) {
                            sc+=cells[cellkey-1-w/20].getCurrentState();
                        }

                    }

                    //0 1
                    if (cellkey+w/20 < cells.length) {
                        sc+=cells[cellkey+w/20].getCurrentState();
                    }
                    //0 -1
                    if (cellkey-w/20>0) {
                        sc+=cells[cellkey-w/20].getCurrentState();
                    }

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