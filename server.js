var express = require('express');
var app = express();
var serv = require('http').Server(app);

 
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use('/',express.static(__dirname + '/'));
 
serv.listen(3000);
console.log("Server started.");
 
var SOCKET_LIST = {};
var connection_number = 0;
var pack = [];
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    console.log('socket connection', connection_number);

    socket.index = connection_number;
    connection_number++;
    SOCKET_LIST[socket.index] = socket;

    socket.on('happy',function(data){
        console.log('happy because ' + data.reason);
    });
   
    socket.emit('serverMsg',{
        msg:'hello',
    });

    socket.on('disconnect',function(){
        delete socket;
        console.log("socket disconnected");
        SOCKET_LIST[socket.index]
        
    });

    socket.on('constants', function(data) {
        
    });

    socket.on('sync', function(data) {
        for (var i =0; i < data.planets.length; i++) {
            // data.planets[i].px += 1;
            

            if (Math.abs(data.planets[i].px - data.planets[i].parent.px) + data.planets[i].radius < data.planets[i].parent.radius && Math.abs(data.planets[i].py - data.planets[i].parent.py) + data.planets[i].radius < data.planets[i].parent.radius) {
                data.planets[i].dead = true;
                data.planets[i].parent.mass += data.planets[i].mass;
            }

            // if (time_step % dot_timesteps == 0) {
            //     data.planets[i].previous_positions.push([data.planets[i].px, data.planets[i].py]);
            //     if (data.planets[i].previous_positions.length > num_trail_dots) {
            //         data.planets[i].previous_positions.shift();
            //     }
            // }

            data.planets[i].px = data.planets[i].parent.px + (data.planets[i].phys_x * pixels_per_m);
            data.planets[i].py = data.planets[i].parent.py + (data.planets[i].phys_y * pixels_per_m);

            c.strokeStyle = data.planets[i].colour;
            c.fillStyle = data.planets[i].colour;
            c.beginPath();
            c.arc(data.planets[i].px, data.planets[i].py, data.planets[i].radius, 0, Math.PI * 2, false);
            c.stroke();
            c.fill();

            for (var i in data.planets[i].previous_positions) {
                var x = data.planets[i].previous_positions[i][0];
                var y = data.planets[i].previous_positions[i][1];

                c.strokeStyle = data.planets[i].colour;
                c.fillStyle = data.planets[i].colour;
                c.beginPath();
                c.arc(x, y, i * radius * dot_scale, 0, Math.PI * 2, false);
                c.stroke();
                c.fill();
            }


        }
    });
    
   
});
 
