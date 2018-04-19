'use strict';

angular.module('homeApp', [
    'homeApp.login',
    'homeApp.pricing',
    'homeApp.register'
]).config([function() {

	if(BS__lang == 'id' && location.pathname.indexOf(BS__lang) == -1)
		location.pathname = BS__lang + location.pathname;
	else if (BS__lang == 'en' && location.pathname.indexOf('id') > -1)
		location.pathname = location.pathname.replace('id/', '');

}]);