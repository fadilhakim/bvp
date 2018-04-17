'use strict';

angular
.module('homeApp.pricing',[])
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
    $scope.category = [
		{
			'name' : null,
			'id' : null
		},
		{
			'name' : null,
			'id' : null
		}
	];
    $scope.categories = [
        {   
            'id' : null,
            'name' : 'Service Category'
        }
    ];
    $scope.memberships = {};
    $scope.submitted = false;

    $scope.getCategories = function(){
        $http.get(configUrl.api + '/v2/categories').then(function(result){
            result.data.category.map(function(val, key){
                $scope.categories.push(val);
            });
            $scope.category[0] = $scope.categories[0];
            $scope.category[1] = $scope.categories[0];
        })
    }

    $scope.getCategories();

	$scope.searchCity = function(idx) {
		$scope.city[idx].cities = [];
		$scope.removeOther(idx);
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

	$scope.removeOther = function(idx) {
		if(idx == 1) $scope.city[0] = {'name' : null, 'cities' : []};
	}

	$scope.selectCity = function(idx, city) {
		$scope.city[idx].name = city.name
		$scope.city[idx].id = city.id
		$scope.city[idx].cities = [];

		if(idx == 0) $scope.city[1] = {'name' : city.name, 'id': city.id, 'cities' : []};

		if(idx == 1) $scope.checkPrice(idx);
	}

	$scope.numberFormat = function(number) {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	$scope.checkPrice = function(idx){
		if(idx == 0) $scope.category[1] = $scope.category[0];
		$scope.submitted = true;
		if ($scope.city[idx].id && $scope.category[idx].id) {
			$http.get(configUrl.api + '/v2/subscribes/prices?budgetId=48&cityId='+ $scope.city[idx].id + '&categoryId=' + $scope.category[idx].id + '&include=basePrice')
			.then(function (response) {
				console.log(response);
				var membershipsList = response.data.planCombination.vendorMemberships[0].membershipsList;
				membershipsList.map(function(val, idx){
					if (val.id == 194) $scope.memberships.gold = val;
					if (val.id == 196) $scope.memberships.silver = val;
				});
			})
			.catch(function (error) {
				console.log(error);
			});
		}
	}

    return {
        categories : function(){
            return $scope.categories;
        }
    }
}]);