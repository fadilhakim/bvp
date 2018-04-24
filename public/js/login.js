'use strict';

angular
.module('homeApp.login',['ngCookies'])
.controller('loginController', ['$http', '$scope', '$cookies', '$window', function($http, $scope, $cookies, $window){

	$scope.user = null;
	$scope.trialVendor = null;
	$scope.goldMembership = null;
	$scope.membership = null;
	$scope.secondary = null;
	$scope.processMembership = false;
	$scope.isLoading = true;

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

				if ($scope.user.type == 'vendor') {
					$http({
						method: 'GET',
						url: configUrl.api + '/v2/vendors/' + $scope.user.id + '?include=memberships,points,mainService',
						headers: {
							'Session-Id' : $cookies.get('BSID')
						}
					}).then(function (response) {
						if(response.data.vendor.memberships != undefined){
							if(response.data.vendor.memberships.length == 1 && response.data.vendor.memberships[0].status == 'expired'){
								$scope.trialVendor = true;
							}else{
								angular.forEach(response.data.vendor.memberships.data, function(membership){

									if(membership.membershipType.data.name == 'Free' && membership.vendorsServiceId == response.data.vendor.mainService.data.id){
										$scope.trialVendor = true;
									}else{
										if(membership.status == 'active' && membership.membershipType.data.name != 'Free'){
											$scope.trialVendor = false;
											if(membership.membershipType.data.name == 'Gold') $scope.goldMembership = membership;
											else $scope.membership = membership;
										}
									}
								})
							}
						}
					});

					$http({
						method: 'GET',
						url: configUrl.api + '/ms/rewards/v1/me/rewards',
						headers: {
							'Session-Id' : $cookies.get('BSID')
						}
					}).then(function (response) {
						if (response.data.data) {
							$scope.totalPoint = response.data.data.total_point;
						}
					})
					
					$scope.isLoading = false;
				}
			})
			.catch(function (error) {
				console.log(error);
			});
		}else {
			$scope.isLoading = false;
		}
	}
	
	$scope.getUser();

	return {
		user: function() {
			return $scope.user;
		},
		isLoading: function() {
			return $scope.isLoading;
		},
		isPublished: function() {
			return $scope.user && $scope.user.status == 1;
		},
		trialVendor: function() {
			return !$scope.isLoading ? $scope.trialVendor : null;
		},
		membership: function() {
			return !$scope.isLoading ? $scope.goldMembership || $scope.membership : null;
		},
		totalPoint: function() {
			return $scope.totalPoint;
		},
		numberWithCommas: function(x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		logout: function() {
			document.cookie = 'BSID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;;domain=.bridestory.com;path=/';
			document.cookie = 'BS.userOrigin=;expires=Thu, 01 Jan 1970 00:00:01 GMT;;domain=.bridestory.com;path=/';
			$scope.user = null;
		}
	}
}]);