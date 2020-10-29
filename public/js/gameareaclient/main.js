import Game from "./../game/main.js"
const container = document.querySelector(".container");
const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('id');
const username = localStorage.getItem("userName");
const playerTwoCards = document.querySelector(".playerTwoCards"); 
const gameboard = document.querySelector(".gameboard");

socket.on("joingame", name => {
    container.insertAdjacentHTML("beforeend", `<p>${ name } joined game</p>`);

    //Говорим серверу что клиент онлайн и игра началась
    socket.emit("startgame", roomId);
})
socket.emit("joingame", {
    roomId : roomId,
    clientName: username
});
socket.on("startgame", cards => {
    const myCards = cards.secondPlayerCards;
    //_ROOMID = cards.roomId;
    Game.prototype.renderCards(myCards, playerTwoCards);
    console.log(myCards);
})
socket.on("playerturn", card => {
    gameboard.innerHTML = "";
    gameboard.append(Game.prototype.createCard(card));
})

document.addEventListener("click", e => {
    const target = e.target;
    const cardInTable = gameboard.querySelector(".card");
    if(target.closest(".card")) {
        if(!cardInTable || target.number == cardInTable.number || target.letter == cardInTable.letter) {
            gameboard.innerHTML = "";
            //Надо пересмотреть истоию с id
            socket.emit("playerturn", {card : target, roomId : roomId});
            gameboard.appendChild(target);
        }
    }
})



