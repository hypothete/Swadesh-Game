(function(){

	/*global angular, $*/

	'use strict';

	angular.module('myApp.directives')
	.directive('terrain',[function(){
		return {
			restrict: 'A',
			scope: {
				parentWidth: '@',
				parentHeight: '@'
			},
			link: function(scope, elem){

				scope.$emit('rendering', {id: scope.id, name: 'terrain'});

				var can = document.createElement('canvas'),
					ctx = can.getContext('2d'),
					canData;

				function fractalNoise(levels, cvs, ctx){
					var stage = document.createElement('canvas'),
							stx = stage.getContext('2d');
					stage.width=cvs.width;
					stage.height=cvs.height;

					function noise2D(iData, x,y, w, h){
						for(var i=x; i<w; i++){
							for(var j=y; j<h; j++){
								var k = (j*w+i)*4;
								var val = Math.round(Math.random()*255);
								iData.data[k] = val;
								iData.data[k+1] = val;
								iData.data[k+2] = val;
								iData.data[k+3] = 255;
							}
						}
						return iData;
					}

					var imageData = stx.getImageData(0,0,cvs.width,cvs.height);
					stx.putImageData(noise2D(imageData,0,0,cvs.width,cvs.height),0,0);
					ctx.drawImage(stage,0,0);

					for(var l=0; l<levels; l++){
						ctx.globalAlpha *= 1-1/levels;
						stx.putImageData(noise2D(imageData,0,0,cvs.width/Math.pow(2,l), cvs.height/Math.pow(2,l)),0,0);
						ctx.drawImage(stage,0,0,cvs.width/Math.pow(2,l), cvs.height/Math.pow(2,l),0,0,cvs.width,cvs.height);
					}
					ctx.globalAlpha = 1;
				}

				function addWater(level){
					canData = ctx.getImageData(0,0,can.width,can.height);
					for(var m=0; m<canData.data.length; m+=4){
						if(canData.data[m] < level){
							canData.data[m] = 0;
							canData.data[m+1] = 0;
							canData.data[m+2] = 255;
						}
						else{
							canData.data[m] = (canData.data[m] - level)*255/(255 - level);
							canData.data[m+1] = (canData.data[m+1] - level)*255/(255 - level);
							canData.data[m+2] = (canData.data[m+2] - level)*255/(255 - level);
						}
					}

					ctx.putImageData(canData,0,0);
					canData = ctx.getImageData(0,0,can.width,can.height);
				}

				function getLocationType(point){
					//point format: {x:n,y:n}
					var px = {
						r: canData.data[4*(point.y*can.width+point.x)],
						b: canData.data[4*(point.y*can.width+point.x)+2]
					};
					return px.b == 255 ? 'water' : 'land';
				}

				scope.$watch('parentWidth', function(newval){
					if(newval){
						can.width = scope.parentWidth;
						can.height = scope.parentHeight;

						fractalNoise(8,can,ctx);
						addWater(112); //updates canData as well

						var img = new Image(),
							svgImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');

						img.onload = function(){
							scope.$emit('complete', {id: scope.id, name: 'terrain'});
						};

						img.src = can.toDataURL();
						svgImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', img.src);
						$(svgImage).attr({
							width: scope.parentWidth,
							height: scope.parentHeight,
							x:0,
							y:0
						});
						elem.append(svgImage);
					}
				});

				scope.$on('destroy', function(){
					scope.$emit('destroyed', {id: scope.id, name: 'terrain'});
				});

				elem.bind('click', function(e){
					console.log(getLocationType({x:e.clientX, y:e.clientY}));
				});

			}
		};
	}]);

})();