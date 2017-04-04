'use strict';

angular.module('playground', ['ngRoute','playground.simple'])

.config(['$locationProvider','$routeProvider', function($locationProvider, $routeProvider) {
  // $locationProvider.hashPrefix('!');
  $locationProvider.html5Mode(true);
  $routeProvider.otherwise({redirectTo: '/simple/'});

}])

//Main Controller for index
.controller('appCtl', function($scope, $location){

  $scope.getClass = function (path) {
    return ($location.path().substr(0, path.length) === path) ? 'active' : '';
  }

})

;
