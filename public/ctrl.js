(function(){

	/*global angular, io, console*/

	'use strict';

	angular.module('myApp.controllers', []).controller('ctrl', ['$scope', 'player', function($scope, player){

		$scope.syncedWithServer = false;
		$scope.player = player;
		$scope.playerTypes = ['map', 'player'];
		$scope.players = [];

		var socket = io.connect();
		$scope.localLog =[];

		$scope.login = function(){
			if(player.name && player.type)
			socket.emit('typeConfirm', {type: player.type, name: player.name, id: player.id});
		};


		///socket events

		socket.on('playerConfirm', function(data){
			if(data.id && data.id === player.id){
				$scope.syncedWithServer = true;
				$scope.$apply();
			}
			
		});

		socket.on('error', function(data){
			if(data.id && data.id === player.id){
				window.alert(data.message);
			}
		});

		socket.on('mapData', function(data){
			if(player.type === 'player'){
				player.mapData = data;
				///FINISH
				//socket.emit('playerReady', data);
			}
		});

		socket.on('playerList', function(data){
			$scope.players = data.list;
			$scope.$apply();
		});

		///scope events

		$scope.$on('mapReady', function(data){
			socket.emit('mapReady', data);
		});

	}]);
})();