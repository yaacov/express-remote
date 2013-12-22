/**
* Remote control your totem player
* Author: Yaacov Zamir (2013)
*/

var express = require('express');
var http = require('http');
var spawn = require('child_process').spawn;
var fs = require('fs');

// Get totem binary file
var totem_bin = 'totem';

// Get mp4 files
var path = process.env['HOME'] + '/Downloads/';
var ls = fs.readdirSync(path);
var file_list = ls.filter(function(v) {return v.match(".mp4$") == ".mp4";});

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');

// UI web page
app.get('/', function(req, res) {
  res.render('index');
});

// Socket commands
io.sockets.on('connection', function (socket) {  
  socket.on('ls', function (data) {
    console.log(data);
    socket.emit('ls', file_list);
  });
  
  socket.on('open', function (data) {
    spawn(totem_bin, [
      '--replace', 
      '--fullscreen', 
      path + file_list[data.file]
    ]);
  });
  
  socket.on('cmd', function (data) {
    spawn(totem_bin, ['--' + data.cmd]);
  });
});

