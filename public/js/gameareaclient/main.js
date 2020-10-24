const container = document.querySelector(".container");
const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const hostid = urlParams.get('id');
const username = localStorage.getItem("userName");

socket.on("joingame", name => {
    container.insertAdjacentHTML("beforeend", `<p>${name} joined game</p>`)
})
socket.emit("joingame", {
    hostid : hostid,
    clientName: username});


