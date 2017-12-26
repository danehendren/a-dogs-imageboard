angular.module('app.nav', [])

.directive('gtNav', function(){
    return {
        templateUrl: 'app/nav/nav.html',
        restrict: 'E',
        controller: function($scope){
            $scope.showClick = function(e){
                console.log(e.currentTarget);
            }
        }
    }
});
