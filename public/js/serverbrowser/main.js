const socket = io();
const username = localStorage.getItem("userName");
const browserWindow = document.querySelector(".browserWindow");

socket.on("findgame", games => {
    browserWindow.innerHTML = "";
    Object.keys(games)
    .forEach(hostname => {
        browserWindow.insertAdjacentHTML("beforeend", `<div class="game" id=${hostname}>${hostname}</div>`)
    })
})
socket.on("removegame", game => document.getElementById(`${game}`).remove());
socket.emit("findgame", username);
