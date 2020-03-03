import express, {Errback} from "express";
import {Server} from "http";
import SocketIO from "socket.io";

const app = express();
const port = process.env.PORT || 8080;
const http = new Server(app);
const io = SocketIO(http);

app.get("/static/:filename", function (req, res) {
    res.sendFile(__dirname + "/static/" + req.params.filename);
    console.log("req.params.filename:", req.params.filename);
});

app.get("/:tagId", function (req, res) {
    res.sendFile(__dirname + "/index2.html");
    console.log("req.params.tagId:", req.params.tagId);
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
    console.log(socket.id);
    
    socket.on("control", function (msg) {
        console.log(msg);
        if(io.sockets.connected[msg.id]){
            io.sockets.connected[msg.id].emit("move", msg.command);
        }
    });
    
    socket.on("mobileStart", function (msg) {
        if(io.sockets.connected[msg.id]){
            io.sockets.connected[msg.id].emit("start", true);          
        }
    });
});

http.listen(port, function () {
    console.log("listening on *:" + port);
});
