const express = require("express");
const app = express();
app.use(express.static("publik"));
const bodyParser = require("body-parser");
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/sockets.html");
});

const http = require("http");
const { disconnect } = require("process");
const server = http.createServer(app);
server.listen(3000);
console.log("Kör servern på localhost:3000");
const { Server } = require("socket.io");
const io = new Server(server);

let anvandare=0;
io.on("connection", (socket) => { 
    anvandare ++;
    let nyAnslutning = "En klient anslöt sig till servern! nu är ni" + anvandare;
    socket.broadcast.emit("announcement", nyAnslutning );
    
    socket.on('disconnect', function () {
    anvandare--;
    let avslutad = "En klient lämnade nu är ni" + anvandare;
    socket.broadcast.emit("announcement", avslutad );        
    });

    socket.on("chat", (data,nickname)  => {
    console.log(data);
    socket.broadcast.emit("chat", data,nickname);
    });

});