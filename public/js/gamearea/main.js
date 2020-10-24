const socket = io();
const username = localStorage.getItem("userName");
const container = document.querySelector(".container");

//socket.on("newgame", username);
socket.emit("newgame", username);

socket.on("joingame", clientName => {
    createNotification(container, clientName);
})





function createNotification(target, data){
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = `<p>${data} вошел в игру</p>`;
    target.append(notification);
    setTimeout(() => notification.remove(), 3000);
}