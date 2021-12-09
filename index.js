const express = require("express");
const app = express();
app.use(express.static("publik"));
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

let anvandaren=0;
let inloggadeAnvandare = [];
io.on("connection", (socket) => { 

    socket.on("namn", (data) => {
        console.log("Användaren " + data + " anslöt sig till servern!");
        socket.anvandare = data;
        inloggadeAnvandare.push(data);
        console.log(inloggadeAnvandare);    

    console.log("Användaren " + socket.anvandare + "anslöt");
    console.log(inloggadeAnvandare);
    io.emit("uppdateraAnvandare", inloggadeAnvandare);
       
    anvandaren ++;
    let nyAnslutning =  "En klient anslöt sig till servern! Nu är ni" + " "+  "" +anvandaren;
    socket.broadcast.emit("announcement", nyAnslutning );
     
    socket.on('disconnect', function () {
    anvandaren--;
    let avslutad = "En klient lämnade nu är ni" + anvandaren;
    io.emit("announcement", avslutad );

    console.log( socket.anvandare + " avbröt kontakt med servern.");
    inloggadeAnvandare = inloggadeAnvandare.filter(item => item !== socket.anvandare);
    socket.broadcast.emit("uppdateraAnvandare", inloggadeAnvandare);
          
    });

    socket.on("chat", (data,nickname)  => {
    socket.broadcast.emit("chat", data,nickname);
    
    });
 
    socket.on("typing", function(data) { 
        socket.broadcast.emit("typing", data);
        });
   
    });
});

