var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;



app.get('/js/:filename', function (req, res) {
    res.sendFile(__dirname + '/js/' + req.params.filename);
    console.log("req.params.filename:", req.params.filename);
});

app.get('/:tagId', function (req, res) {
    res.sendFile(__dirname + '/index2.html');
    console.log("req.params.tagId:", req.params.tagId);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

io.on('connection', function (socket) {
    console.log(socket.id);
    
    socket.on('control', function (msg) {
        console.log(msg);
        if(io.sockets.connected[msg.id]){
            io.sockets.connected[msg.id].emit("move", msg.command);
        }

        //console.log(io.sockets.connected);
    });
    
    socket.on('mobileStart', function (msg) {
        if(io.sockets.connected[msg.id]){
            io.sockets.connected[msg.id].emit("start", true);          
        }
    });
    
    socket.on('getControlID', function(msg, callback) {
        console.log(msg);
        callback(socket.id);
    });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});