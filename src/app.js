'use strict'


angular.module('myApp', [
  'ngResource',
  'ngRoute',
  'app.game'

])
.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!')

  $routeProvider.otherwise({redirectTo: '/game'})


}])
