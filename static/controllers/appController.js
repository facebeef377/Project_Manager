var app = angular.module('app', ['ngRoute','ngStorage','simplePagination']);

app
  .controller(
    'appController',
    function ($rootScope, $scope, $http, $localStorage, Pagination) {

        $scope.initVars = function() {
            console.log("%cProject Manager Init!","color:orange; font-size: 72px;");
        }

    });