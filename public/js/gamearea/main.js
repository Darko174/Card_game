const socket = io();
const username = localStorage.getItem("userName");

//socket.on("newgame", username);
socket.emit("newgame", username);