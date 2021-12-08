
let socket = io();
 
window.onload = () => { 
let dittSmeknamn = prompt("Hej och välkommen till chatten! Skriv ditt smeknamn för att ansluta");
    
    while (!dittSmeknamn){ 
        dittSmeknamn = prompt("Du måste skriva ett smeknamn för att komma till chatten!");
     }

    let output = document.getElementById("output");
    let typing = document.getElementById("meddelande");
    let meddelandet = document.getElementById("input")   

    document.getElementById("form").addEventListener("submit", (evt) => {
        evt.preventDefault();
        let meddelande = document.getElementById("input").value;

        socket.emit("chat", meddelande,dittSmeknamn); 
        document.getElementById("input").value = ""; 
        let tid = new Date().toISOString().substr(0, 16);   
        let html = `<p>  (${tid}) du skrev ${meddelande}</p>`;
        output.innerHTML = html; 
     
    });

    socket.on("chat", (data,nickname)  => {
        typing.innerHTML ="";
        let tid = new Date().toISOString().substr(0, 16); 
        let html = `<p> (${tid}): ${nickname} skrev ${data}</p>`;
        output.innerHTML = html;
    })

    socket.on("announcement", (inmat) => {
        let tid = new Date().toISOString().substr(0, 16); 
        let html = `<p> ${inmat}</p>`;
        output.innerHTML = html;
    })
   
    meddelandet.addEventListener("keypress", function() { 
        socket.emit("typing", dittSmeknamn);
    })
 
    socket.on("typing", function(data) {
        typing.innerHTML ="💬" +" " + data + " skriver";

     });       
 
}