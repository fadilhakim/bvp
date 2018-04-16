'use strict';

angular
.module('homeApp.login',['ngCookies'])
.controller('loginController', ['$http', '$scope', '$cookies', function($http, $scope, $cookies){

	$scope.user = {};

	$scope.getUser = function(){
		if($cookies.get('BSID')) {
			$http({
				method: 'GET',
				url: configUrl.api + '/v2/me',
				headers: {
					'Session-Id' : $cookies.get('BSID')
				}
			}).then(function (response) {
				$scope.user = response.data.vendor || response.data.user;
			})
			.catch(function (error) {
				console.log(error);
			});
		}
	}

	$scope.setPreferredLang = function (lang) {
        document.cookie = 'BS_PreferredLang=' + lang + ';domain=.bridestory.com;path=/';
	}

	$scope.getUser();

	return {
		user: function() {
			return $scope.user;
		}
	}
}]);