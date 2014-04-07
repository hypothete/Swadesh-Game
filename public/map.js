(function(){

	/*global angular*/

	'use strict';

	angular.module('myApp.directives')
	.directive('map',[function(){
		return {
			restrict: 'A',
			scope: {
				source: '='
			},
			templateUrl: 'map-partial.html',
			link: function(scope, elem){

				scope.mapComponents = [];
				scope.width = window.innerWidth;
				scope.height = window.innerHeight;
				elem.find('svg').attr('width', scope.width);
				elem.find('svg').attr('height', scope.height);

				//------------------------------------scope events

				scope.$on('rendering', function(data){
					var modData = data;
					modData.done = false;
					var elemIndex = scope.mapComponents.findIndex(function(element){
						return element.id == data.id;
					});
					if(elemIndex == -1){
						scope.mapComponents.push(modData);
					}
					else{
						scope.mapComponents[elemIndex].done = false;
					}
				});

				scope.$on('complete', function(data){
					var elemIndex = scope.mapComponents.findIndex(function(element){
						return element.id == data.id;
					});
					if(elemIndex == -1){
						var modData = data;
						modData.done = true;
						scope.mapComponents.push(modData);
					}
					else{
						scope.mapComponents[elemIndex].done = true;
					}
				});

				scope.$on('destroyed', function(data){
					scope.mapComponents.remove(function(element){
						return element.id == data.id;
					});
				});

				//------------------------------watchers


				//what's wrong with this?

				//scope.$watch('mapComponents', function(newval){
					// if(newval.length && !newval.any(function(el){return !el.done;})){
					// 	//if all components are done
					// 	//scope.$emit('mapReady', {width: scope.width, height: scope.height});
					// }
				//}, true);

				

			}
		};
	}]);

})();