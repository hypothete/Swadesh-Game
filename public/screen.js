(function(){

	/*global angular*/

	'use strict';

	angular.module('myApp.directives')
	.directive('screen',['$sce', function($sce){
		return {
			restrict: 'A',
			scope: {
				source: '='
			},
			templateUrl: 'screen-partial.html',
			link: function(scope){
				scope.text=false;
				scope.image = false;
				scope.youtube = false;
				scope.vimeo = false;

				scope.$watch('source',function(newval){
					if(newval && newval.message && typeof newval.message === 'string'){
						scope.text=false;
						scope.image = false;
						scope.youtube = false;
						scope.vimeo = false;
						scope[newval.type] = true;
						if(!scope.text && typeof newval.message === 'string'){
							$sce.trustAsUrl(newval.message);
						}
					}
				},true);

			}
		};
	}]);

})();