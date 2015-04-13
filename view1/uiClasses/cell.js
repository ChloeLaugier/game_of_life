uiClasses.factory("Cell",
    function () {
        function Cell(obj) {



            this.cell = new createjs.Shape();
            this.cell.ray = obj.ray;
            this.cell.x = obj.x;
            this.cell.y = obj.y;
            this.cell.currentState =obj.state;
            this.cell.futureState = 0;

            this.draw();


        }

        Cell.prototype = {
            addToStage: function (stage) {
                stage.addChild(this.cell);
            },
            removeFromStage: function (stage) {
                stage.removeChild(this.cell);
            },
            getX: function () {
                return this.cell.x;
            },
            getY: function () {
                return this.cell.y;
            },
            getColor:function () {
                return this.cell.color;
            },
            getCurrentState: function() {
                return this.cell.currentState;
            },
            getFutureState: function() {
                return this.cell.futureState;
            },
            setCurrentState:function(state) {
                this.cell.currentState = state;
            },
            setFutureState:function(fstate) {
                this.cell.futureState = fstate;
            },
            update:function() {
                if ( this.cell.currentState != this.cell.futureState) {

                    this.cell.currentState = this.cell.futureState;
                    this.draw();


                }

            },
            draw:function() {

                if (this.cell.currentState == 1) {
                    this.cell.graphics.beginFill("#BB6688").drawCircle(0, 0, this.cell.ray-1);
                }
                else {
                    this.cell.graphics.beginFill("#F3F5F7").drawCircle(0, 0, this.cell.ray);
                }
            }



        };
        return (Cell);
    });