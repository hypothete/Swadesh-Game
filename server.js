/*global require, __dirname, console*/

'use strict';

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(8123));

// Collections

var collections = {
	players: [],
	maps: [],
	cards: []
};

var gamestates = [
	'setup',
	'play',
	'end'
];

var currentState = 'setup';

console.log('Listening on port 8123');

io.sockets.on('connection', function (socket) {

	io.sockets.emit('playerList', {list:collections.players});

	//throw out players that join late
	if(currentState !== 'setup'){
		io.sockets.emit('error', {message: 'play has begun, no more players.'});
		return;
	}

	///-----------------Setup events

	socket.on('typeConfirm', function (type) {

		//type should come back with a type, name, and ID

		if(type.name && type.id && type.type){
			if(type.type === 'map' && collections.maps.length){
				io.sockets.emit('error', {id: type.id, message: 'only one map per game'});
			}
			else{
				collections[type.type + 's'].push({id:type.id, name: type.name, socket: socket.id});
				io.sockets.emit('playerConfirm', {id: type.id});
				io.sockets.emit('playerList', {list:collections.players});
			}
		}
	});

	socket.on('mapReady', function (data) {
		//clients need to know the map size & their positions
		io.sockets.emit('mapSize', data);
	});

	socket.on('disconnect', function(){
		for(var i=0; i<collections.players.length; i++){
			if(collections.players[i].socket === socket.id){
				collections.players.splice(i,1);
			}
		}
		for(var j=0; j<collections.maps.length; j++){
			if(collections.maps[j].socket === socket.id){
				collections.maps.splice(j,1);
			}
		}
		io.sockets.emit('playerList', {list:collections.players});
	});

});

