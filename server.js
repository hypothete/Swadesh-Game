var express = require('express');
var app = express();
//app.use(express.directory(__dirname + '/public'))
app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(8123));

var serverLog = [];

console.log('Listening on port 8123');

io.sockets.on('connection', function (socket) {


	socket.on('send', function (data) {

		serverLog.push(data);

		io.sockets.emit('message', data);

	});


	socket.on('needlog', function () {

		io.sockets.emit('logrequest');

	});


	socket.on('logsubmit', function (data) {

		if(data.log && data.log.length >= serverLog.length){
			io.sockets.emit('log', data);
		}

		else{
			io.sockets.emit('log', {log: serverLog});
		}

	});


});