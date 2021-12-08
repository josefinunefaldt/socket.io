let socket = io();
 
window.onload = () => { 
    //variabel för promt användarnan, while loop not anvandarna promt

    let output = document.getElementById("output");
    let typing = document.getElementById("meddelande");
    let meddelandet = document.getElementById("input")   

    document.getElementById("form").addEventListener("submit", (evt) => {
        evt.preventDefault();
        let meddelande = document.getElementById("input").value;
        let anvandare = document.getElementById("namnet").value; //

        socket.emit("chat", meddelande,anvandare); 
        document.getElementById("input").value = ""; 
        document.getElementById("namnet").value = ""; 
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
        let smeknamn = document.getElementById("namnet");
        socket.emit("typing", smeknamn.value);
    });
   
 
    socket.on("typing", function(data) {
        typing.innerHTML ="💬" +" " + data + " skriver";

     });  
    
     
 
}