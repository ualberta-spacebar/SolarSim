var express = require('express');
var app = express();
var serv = require('http').Server(app);
 
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use('/',express.static(__dirname + '/'));
 
serv.listen(3000);
console.log("Server started.");
 
 
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    console.log('socket connection');
 
    socket.on('happy',function(data){
        console.log('happy because ' + data.reason);
    });
   
    socket.emit('serverMsg',{
        msg:'hello',
    });
   
});
 
// setInterval(function(){
//     var pack = [];
//     for(var i in SOCKET_LIST){
//         var socket = SOCKET_LIST[i];
//         socket.x++;
//         socket.y++;
//         pack.push({
//             x:socket.x,
//             y:socket.y,
//             number:socket.number
//         });    
//     }
//     for(var i in SOCKET_LIST){
//         var socket = SOCKET_LIST[i];
//         socket.emit('newPositions',pack);
//     }
   
   
   
   
// },1000/25);