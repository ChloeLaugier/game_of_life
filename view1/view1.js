'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {


      $scope.start = "stop";
      $scope.startgol = function() {
        $scope.start = "start";
      };

      $scope.gol = function(val) {
        //$scope.swipeTo = swipeTo;
        $scope.start = val;
      };


}]);