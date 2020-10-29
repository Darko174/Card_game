import Game from "./../game/main.js"
const socket = io();
const username = localStorage.getItem("userName");
const container = document.querySelector(".container");
const playerTwoCards = document.querySelector(".playerTwoCards"); 
const gameboard = document.querySelector(".gameboard");
let _ROOMID = "";

socket.emit("newgame", username);

socket.on("joingame", clientName => {
    createNotification(container, clientName);
})
socket.on("startgame", cards => {
    const myCards = cards.firstPlayerCards;
    //Подумать как переделать
    _ROOMID = cards.roomId;
    Game.prototype.renderCards(myCards, playerTwoCards);
})
socket.on("playerturn", card => {
    gameboard.innerHTML = "";
    gameboard.append(Game.prototype.createCard(card));
})

//Создание оповещения о подключении игрока
function createNotification(target, data){
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = `<p>${ data } вошел в игру</p>`;
    target.append(notification);
    setTimeout(() => notification.remove(), 1500);
}

document.addEventListener("click", e => {
    const target = e.target;
    const cardInTable = gameboard.querySelector(".card");
    if(target.closest(".card")) {
        if(!cardInTable || target.number == cardInTable.number || target.letter == cardInTable.letter) {
            gameboard.innerHTML = "";
            gameboard.appendChild(target);
            socket.emit("playerturn", {card : target, roomId : _ROOMID});
        }
    }
})