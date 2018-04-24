'use strict';

angular
.module('homeApp.login')
.controller('langController', ['$scope', function($scope){
	
	this.setPreferredLang = function (lang) {
        document.cookie = 'BS_PreferredLang=' + lang + ';domain=.bridestory.com;path=/';
	}

}]);