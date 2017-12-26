angular.module('app.routes', ['ui.router'])

.config(function($stateProvider){
    $stateProvider
    .state('home',{
        url: '/',
        views: {
            'main':
            {
                templateUrl: 'views/main.html',
                controller: function($scope, $http) {

                    refreshTheImagePage();

                    function refreshTheImagePage() {
                        $http.get('/images').then(function(resp) {
                            $scope.images = resp.data;
                        });
                        // console.log('inside the home controller', $scope);
                        $scope.title = ''
                        $scope.user = ''
                        $scope.file = {}
                        $scope.description = ''

                        $scope.limit = 7;
                        $scope.moreImagesFn = () => {
                            $scope.limit += 7
                        }
                    }

                    $scope.submit = function() {
                        // console.log('running submit', $scope);
                        var file = $('input[type="file"]').get(0).files[0];
                        var title = $scope.title
                        var username = $scope.username
                        var description = $scope.description


                        var formData = new FormData()

                        formData.append('file', file)
                        formData.append('title', title)
                        formData.append('username', username)
                        formData.append('description',description)
                        // console.log("these are params i'm checking", file);
                        $http({
                            url: '/upload-image',
                            method: 'POST',
                            data: formData,
                            headers: { 'Content-Type': undefined },
                            transformRequest: angular.identity
                        })
                        .then(() => {
                            refreshTheImagePage();
                            console.log('it workededed');
                        })
                    }

                }
            }
        }
    })

    .state('singleImage',{
        url: '/singleImage/:imageId',
        views: {
            'main':
            {
                templateUrl: 'views/singleImage.html',
                controller: function($stateParams, $scope, $http) {
                    $scope.comment = ''
                    $http.get('/getSingleImage/' + $stateParams.imageId).then((resp) => {
                        //   console.log('loggin results from get single image', resp);
                        $scope.photo = resp.data;
                    });

                    $scope.submitComment = function() {
                        
                        var comment = $scope.comment
                        var username = $scope.username

                        $http({
                            url: '/add-comment/' + $stateParams.imageId,
                            method: 'POST',
                            data: { "comment": comment, "username": username }
                        })
                        .then(() => {
                        })
                    }
                    $http.get('/add-comment/' + $stateParams.imageId).then((resp) => {
                        $scope.comments = resp.data;
                        $scope.limit = 1;
                        $scope.moreComments = () => {
                            $scope.limit += 1
                        }
                    });
                }
            },
            '@about': {
                template: '<p>I targeted the unnamed view in about.html</p>'
            }
        }
    });
});
