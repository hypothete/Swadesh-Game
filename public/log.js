(function(){

	/*global angular*/

	'use strict';

	angular.module('myApp.directives')
	.directive('log',[function(){
		return {
			restrict: 'A',
			scope: {
				log: '='
			},
			template: '<div ng-repeat="item in log">{{item.message}}</div>',
			link: function(scope, elem){

				scope.$watch('log',function(newval){
					if(newval){
						elem[0].scrollTop = elem[0].scrollHeight;
					}
				},true);

			}
		};
	}]);

})();