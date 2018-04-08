'use strict';

angular
.module('pricingApp',[])
.controller('pricingController', ['$http', '$scope', function($http, $scope){
	$scope.city = [
		{
			'name' : null,
			'id' : null,
			'cities' : []
		},
		{
			'name' : null,
			'id' : null,
			'cities' : []
		}
	];

	$scope.searchCity = function(idx) {
		$scope.city[idx].cities = [];
		$scope.removeOtherCity(idx);
		$http.get(configUrl.api + '/v2/cities/search?limit=10&keyword=' + $scope.city[idx].name)
		.then(function (response) {
			if(response.data.cities){
				response.data.cities.map(function(city, index){
					if(index < 10){
						var cityParam = {'id' : city.id, 'name' : city.name};
						$scope.city[idx].cities.push(cityParam);
					}
				})
			}
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	$scope.removeOtherCity = function(idx) {
		$scope.city.map(function(val, key){
			if(key != idx) $scope.city[key] = {'name' : null, 'cities' : []};
		})
	}

	$scope.selectCity = function(idx, city) {
		$scope.city[idx].name = city.name
		$scope.city[idx].id = city.id
		$scope.city[idx].cities = [];

		if(idx == 1) $scope.checkPrice(idx);
	}

	$scope.checkPrice = function(idx){
		$http.get(configUrl.api + '/v2/subscribes?cityIds='+ $scope.city[idx].id +'&include=basePrice')
		.then(function (response) {
			console.log(response);
		})
		.catch(function (error) {
			console.log(error);
		});
	}
}]);