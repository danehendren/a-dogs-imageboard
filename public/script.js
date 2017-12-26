(function() {
    var myApp = angular.module('myApp', ['app.routes', 'ui.router'] );
    //empty array to have other app that depends on this app so in this ARRAY that's empty, you'd list that.

    myApp.controller('imagesController', function($scope, $http) {
        $scope.message = "By doing what you love you inspire and awaken the hearts of others." ;

    });
//==================================Image Main Controller
    myApp.controller('displayImageController', function($scope, $http, $location) {

    });
//==================================Main Controller
    myApp.controller('mainController', ($scope, $http) => {

    })



})()
