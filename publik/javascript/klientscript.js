 
window.onload = () => { 
let dittSmeknamn = prompt("Hej och välkommen till chatten! Skriv ditt smeknamn för att ansluta");// sparar smeknamnet i prompt
    
    while (!dittSmeknamn){  // så länge användaren inte skriver in ett smeknamn
        dittSmeknamn = prompt("Du måste skriva ett smeknamn för att komma till chatten!");
     }
     let socket = io(); // kallar socket konstruktorn
     socket.emit("namn", dittSmeknamn);// skickar smeknamnet till servern

    let utskrift = document.getElementById("output"); // hämtar id för att skriva ut chatmeddelanden
    let typing = document.getElementById("anvandareSkriver");//hämtar id för att skriva ut vem som som skriver
    let meddelandet = document.getElementById("input"); // hämtar id för chatrutan 

    document.getElementById("form").addEventListener("submit", (evt) => { //händelselyssnare, när användaren klickar på "skicka-knappen"
        evt.preventDefault();// hindrar sidan från att laddas om
        let meddelande = document.getElementById("input").value; // hämtar värdet från användarens chatmeddelande

        socket.emit("chat", meddelande,dittSmeknamn);// tar första steget för händelser i chatten. "skickar" meddelande och smeknamn
        document.getElementById("input").value = ""; //återställer användarens chatmeddelande
        let tid = new Date().toISOString().substr(0, 16);   //sparar datum samt timmar och minuter i en variabel  
        let html = ` (${tid}) du skrev ${meddelande}`; // sparar tid och användarens inmatning i en textsträng
        utskrift.innerHTML = html; //skriver ut textsträngen
     
    });

    socket.on("chat", (data,nickname)  => {
        typing.innerHTML =""; //återställer typing när användaren har klickat på skickat
        let tid = new Date().toISOString().substr(0, 16); //sparar datum samt timmar och minuter i en variabel 
        let html = ` (${tid}): ${nickname} skrev ${data}`; //sparar datum, smeknamn och data i en textsträng
        utskrift.innerHTML = html;// skriver ut textsträngen
    })

    socket.on("besked", (inmat) => { //funktion som väntar på att någonting händer på servern. när någon disconnect startar den här funktionen
        let html = ` ${inmat}`; // sparar den skickade textsträngen från index i en variabel
        utskrift.innerHTML = html; // skriver ut textsträngen ovan, att en klient lämnade och hur många som är anslutna
    })
   
    meddelandet.addEventListener("keypress", function() { // en funktion som startar när användaren börjar skriva i chatrutan
        socket.emit("typing", dittSmeknamn); //skickar smeknamnet till servern
    })
 
    socket.on("typing", function(data) { 
        typing.innerHTML ="💬" +" " + data + " skriver"; //skriver ut det sparade smeknamnet skriver

     }); 
     
     socket.on("onlineAnvandare", (data) => { //triggas när servern skickar anslutna
        let uppKoppling = document.getElementById("onlineLista"); //hämtar id för att skriva ut inloggade
        uppKoppling.innerHTML=  data; //skriver ut alla anslutna
   
    });
 
}