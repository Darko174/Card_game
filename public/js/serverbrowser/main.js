const socket = io();
const username = localStorage.getItem("userName");
const browserWindow = document.querySelector(".browserWindow");

//Принимаем игры
socket.on("findgame", games => {
    //Исправить
    browserWindow.innerHTML = "";
    Object.values(games).forEach(game => {
        const { roomId, host } = game;
        browserWindow.insertAdjacentHTML("beforeend", `<div class="game" id=${ roomId }>${ host.name }<a href="/gameAreaClient?id=${ roomId }">Join</a></div>`)
    })
})
socket.on("removegame", game => {
    let removingGame = document.getElementById(`${ game }`);
    if(removingGame){
        removingGame.remove()
    }
});
//Отправляем собsnbt поиска игры
socket.emit("findgame", username);

