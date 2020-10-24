const socket = io();
const username = localStorage.getItem("userName");
const browserWindow = document.querySelector(".browserWindow");
let hostId = "";

socket.on("findgame", games => {
    //Исправить
    browserWindow.innerHTML = "";
    Object.values(games).forEach(host => {
        browserWindow.insertAdjacentHTML("beforeend", `<div class="game" id=${host.hostRoomId}>${host.name}<a href="/gameAreaClient?id=${host.hostRoomId}">Join</a></div>`)
    })
})
socket.on("removegame", game => {
    let removingGame = document.getElementById(`${game}`);
    if(removingGame){
        removingGame.remove()
    }
});
socket.emit("findgame", username);

document.addEventListener("click", event => {
    const target = event.target;
    if(target.closest(".game")) {
        hostId = target.id;
    }
})
