'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.version',
  'myApp.directives',
  'myApp.services',
  'myApp.uiClasses',

]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

var myServices = angular.module('myApp.services', []);
var uiClasses = angular.module('myApp.uiClasses', []);