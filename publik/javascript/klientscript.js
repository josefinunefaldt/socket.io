 
window.onload = () => { 
let dittSmeknamn = prompt("Hej och välkommen till chatten! Skriv ditt smeknamn för att ansluta");
    
    while (!dittSmeknamn){ 
        dittSmeknamn = prompt("Du måste skriva ett smeknamn för att komma till chatten!");
     }
     let socket = io();
     socket.emit("namn", dittSmeknamn);

    let utskrift = document.getElementById("output");
    let typing = document.getElementById("anvandareSkriver");
    let meddelandet = document.getElementById("input")   

    document.getElementById("form").addEventListener("submit", (evt) => {
        evt.preventDefault();
        let meddelande = document.getElementById("input").value;

        socket.emit("chat", meddelande,dittSmeknamn); 
        document.getElementById("input").value = ""; 
        let tid = new Date().toISOString().substr(0, 16);   
        let html = ` (${tid}) du skrev ${meddelande}`;
        utskrift.innerHTML = html; 
     
    });

    socket.on("chat", (data,nickname)  => {
        typing.innerHTML ="";
        let tid = new Date().toISOString().substr(0, 16); 
        let html = ` (${tid}): ${nickname} skrev ${data}`;
        utskrift.innerHTML = html;
    })

    socket.on("announcement", (inmat) => { 
        let html = ` ${inmat}`;
        utskrift.innerHTML = html;
    })
   
    meddelandet.addEventListener("keypress", function() { 
        socket.emit("typing", dittSmeknamn);
    })
 
    socket.on("typing", function(data) {
        typing.innerHTML ="💬" +" " + data + " skriver";

     }); 
     
     socket.on("uppdateraAnvandare", (data) => {
        let uppKoppling = document.getElementById("onlineLista");
        uppKoppling.innerHTML=" online just nu"+ " " + data;
   
    });
 
}