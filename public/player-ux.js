(function(){

	/*global angular*/

	'use strict';

	angular.module('myApp.directives')
	.directive('playerUx',['player', function(player){
		return {
			restrict: 'A',
			scope: {
			},
			templateUrl: 'ux-partial.html',
			link: function(scope, elem){


			}
		};
	}]);

})();