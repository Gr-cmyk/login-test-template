var express = require('express');

var app = express();
var server = app.listen('8000');

app.use(express.static('public'));

console.log("online server running");

var socket = require('socket.io');

var io = socket(server);

const fs = require('fs');

io.sockets.on('connection', newConnection);

function newConnection(socket) {
	console.log(socket.id);
	
	socket.on('loginRequest', function (data) {
		console.log(data);
		
		const path = 'users/' + data.user + '.txt';
		
		try {
			if (fs.existsSync(path)) {
				var file = fs.readFileSync(path, 'utf8');
				console.log(file);
			
				if (data.pass === JSON.parse(file).pass) {
					console.log('login succesful');
					io.sockets.emit('lgs', data.id);
				} else {
					console.log('wrong password');
					io.sockets.emit('lgw', data.id);
				}
			} else {	
				console.log('account doesnt exist');
				io.sockets.emit('lgn', data.id);
			}
		} catch(err) {
			console.error(err);
		}
	});
	
	socket.on('signupRequest', function (data) {
		console.log(data);
		
		const path = 'users/' + data.user + ".txt";

		try {
			if (fs.existsSync(path)) {
				io.sockets.emit('sun', data.id);
			} else {	
				fs.writeFile('users/' + data.user + '.txt', JSON.stringify(data), function (err) {
					if (err) throw err;
					console.log('Saved!');
					io.sockets.emit('sus', data.id);
				}); 
			}
		} catch(err) {
			console.error(err);
		}
	});
}
