import Game from "./../game/main.js"
const socket = io();
const username = localStorage.getItem("userName");
const container = document.querySelector(".container");
const playerTwoCards = document.querySelector(".playerTwoCards"); 
const gameboard = document.querySelector(".gameboard");
const playerOneCards = document.querySelector(".playerOneCards");
const deck = document.querySelector(".deck");
let _ROOMID = "";

socket.emit("newgame", username);

socket.on("joingame", clientName => {
    createNotification(container, clientName);
})
socket.on("startgame", cards => {
    startGame(cards);
})
socket.on("playerturn", card => {
    playerturn(card);
})
socket.on("takecard", data => {     ///
    if(data == "aaa") {
        renderHiddenCards(playerOneCards, 1);
    } else {
        takeCard(data);
    }
}) 

//functions
function startGame(cards) {
    const myCards = cards.firstPlayerCards;
    renderHiddenCards(playerOneCards, 6);
    renderHiddenCards(deck, 1);
    //Подумать как переделать
    _ROOMID = cards.roomId;
    Game.prototype.renderCards(myCards, playerTwoCards);
}

//Создание оповещения о подключении игрока
function createNotification(target, data){
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = `<p>${ data } вошел в игру</p>`;
    target.append(notification);
    setTimeout(() => notification.remove(), 1500);
}
//Рендерим скрытые карты соперника и колоду
function renderHiddenCards(target, quantity) {
    if(quantity > 1) {
        for(let i = 0; i < quantity; i++) {
            target.insertAdjacentHTML("beforeend", hiddenCard("enemyCard"));
        }
    } else {
        target.insertAdjacentHTML("beforeend", hiddenCard("cardInDeck"));
    } 
}
function hiddenCard(prop) {
    return `<div class=${prop}></div>`
}
function takeCard(data) {
    if(data) {
        const cardInDeck = document.querySelector(".cardInDeck");
        if (typeof data == "object") {
            playerTwoCards.append(Game.prototype.createCard(data.card));
            data.deckIsOver ? cardInDeck.remove() : false;
        } else {
            cardInDeck.remove();
        }
    }
}
function playerturn(card) {
    gameboard.innerHTML = "";
    gameboard.append(Game.prototype.createCard(card));
    playerOneCards.querySelector(".enemyCard").remove();
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
    if(target.closest(".cardInDeck")) {
        socket.emit("takecard", _ROOMID);
    }
})