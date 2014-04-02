(function(){

	/*global angular, io*/

	'use strict';

	angular.module('myApp.controllers', []).controller('ctrl', ['$scope', function($scope){

		var socket = io.connect();
		$scope.localLog =[];
		$scope.types = [
		'text',
		'image',
		'youtube'
		];

		socket.emit('needlog');

		socket.on('logrequest', function () {
			if($scope.localLog.length){
				socket.emit('logsubmit', {log: $scope.localLog});
			}
		});

		socket.on('log', function (data) {
			if(data.log && data.log.length > $scope.localLog.length){
				$scope.localLog = data.log;
				$scope.last = $scope.localLog[$scope.localLog.length-1];
				$scope.$apply();
			}
		});

		socket.on('message', function (data) {
			if(data.message && data.type) {
				$scope.localLog.push(data);
				$scope.last = $scope.localLog[$scope.localLog.length-1];
				$scope.$apply();
			}
		});

		$scope.postMessage = function(){
			if($scope.type && !$scope.type.length){
				return;
			}

			if($scope.type === 'youtube'){
				// https://www.youtube.com/watch?v=1bJ6LZjE09A
				// //www.youtube.com/embed/1bJ6LZjE09A

				$scope.message = 'http://www.youtube.com/embed/' + $scope.message.match(/v\=([\w0-9]+)/)[1] + '?autoplay=1&amp;loop=1';
			}

			socket.emit('send', {message: $scope.message, type: $scope.type });
			$scope.message = '';
		};
	}]);
})();