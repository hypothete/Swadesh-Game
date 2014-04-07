(function() {
	/*global angular */
	'use strict';

	angular.module('myApp.services')
	.factory('player', [ function() {

		var player = {
			name: '',
			id: Math.round(Math.random()*1000),
			type: ''
		};


		return player;
	}]);

})();
