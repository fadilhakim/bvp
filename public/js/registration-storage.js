'use strict';

angular
.module('homeApp.register',['ngCookies'])
.controller('registerController', ['$http', '$scope', '$cookies', function($http, $scope, $cookies){
    $scope.submitted = false;
    $scope.category = {};
    $scope.categories = {};
    $scope.businessName = null;
    $scope.emailVendor = null;
    $scope.password = null;
    $scope.emailValid = true;

    $scope.getCategories = function(){
        $http.get(configUrl.api + '/v2/categories').then(function(result){
            $scope.categories = result.data.category;
            $scope.category = $scope.categories[0];
        })
    }

    $scope.getCategories();

    $scope.submitRegistration = function() {
        $scope.submitted = true;
        if($scope.businessName && $scope.emailVendor && $scope.password && $scope.validateEmail($scope.emailVendor)){
            document.cookie = 'BS.registration-data=' + encodeURIComponent(JSON.stringify({'full_name' : $scope.businessName, 'email' : $scope.emailVendor, 'password' : $scope.password, 'category' : $scope.category})) + ';domain=.bridestory.com;path=/';
            window.location = configUrl.businessUrl + '/register/vendor';
        }   
    }

    $scope.validateEmail = function(email) {
        var rgx = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,10}(?:\.[a-z]{2})?)$/i;
        $scope.emailValid = rgx.test(email);
        return $scope.emailValid;
    }

    return {
        categories : function(){
            return $scope.categories;
        }
    }
}]);