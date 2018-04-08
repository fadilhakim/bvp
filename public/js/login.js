'use strict';

angular
.module('loginApp',['ngCookies'])
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

	$scope.getUser();

	return {
		user: function() {
			return $scope.user;
		}
	}
}]);