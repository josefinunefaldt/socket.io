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

let anvandaren=0; // ger anvandaren ett värde 0
let inloggadeAnvandare = []; // initierar en tom array
io.on("connection", (socket) => { //tvåvägskommunikationen startas

    socket.on("namn", (data) => { // triggas när smeknamn skickas till servern
        console.log("Användaren " + data + " anslöt sig till servern!"); // skriver i consolen vem som anslöt till servern
        socket.anvandare = data; // sparar den anslutna användaren i en variabel
        inloggadeAnvandare.push(data);//pushar den sparade variabeln (användaren) i arrayen
      
    io.emit("onlineAnvandare", inloggadeAnvandare);//skickar inloggade användare till alla anslutna och funktionen på scriptet

    anvandaren ++; // lägger till användare för varje ny anslutning
    let nyAnslutning =  "En klient anslöt sig till servern! Nu är ni" + " "+  "" +anvandaren; // sparar textsträngen i en variabel
    socket.broadcast.emit("besked", nyAnslutning ); // skickar variabeln till alla utom sig själv
     
    socket.on('disconnect', function () { // triggas när någon lämnar chatten
    anvandaren--; // tar bort en användare
    let avslutad = "En klient lämnade nu är ni" + anvandaren; // sparar textsträng i en variabel
    io.emit("besked", avslutad );- // skickar textsträngen avslutad till alla anslutna

    console.log( socket.anvandare + " avbröt kontakt med servern."); // skriver vem som avbröt kontakten i consolen
    inloggadeAnvandare = inloggadeAnvandare.filter(item => item !== socket.anvandare);//uppdaterar vem som är online
    socket.broadcast.emit("onlineAnvandare", inloggadeAnvandare);
          
    });

    socket.on("chat", (data,nickname)  => { //tar emot meddelande och smeknamn
    socket.broadcast.emit("chat", data,nickname); //skickar tillbaka meddelande och smeknamn till alla förutom det egna fönstret
    
    });
 
    socket.on("typing", function(data) { //  
        socket.broadcast.emit("typing", data); // skickar smeknamnet till alla klienter utom sig själv
        });
   
    });
});

