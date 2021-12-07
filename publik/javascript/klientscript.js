let socket = io();  
window.onload = () => { 
    let output = document.getElementById("output");

    document.getElementById("form").addEventListener("submit", (evt) => {
        evt.preventDefault();
        let meddelande = document.getElementById("input").value;
        let anvandare = document.getElementById("namnet").value;

        socket.emit("chat", meddelande,anvandare); 
        document.getElementById("input").value = ""; 
        document.getElementById("namnet").value = ""; 
        let tid = new Date().toISOString().substr(0, 16);   
        let html = `<p>  (${tid}) du skrev ${meddelande}</p>`;
        output.innerHTML = html;
    });

    socket.on("chat", (data,nickname)  => {
    let tid = new Date().toISOString().substr(0, 16); 
    let html = `<p> (${tid}): ${nickname} skrev ${data}</p>`;
    output.innerHTML = html;
    })

    socket.on("announcement", (inmat) => {
    let tid = new Date().toISOString().substr(0, 16); 
    let html = `<p> ${inmat}</p>`;
    output.innerHTML = html;
    })

}