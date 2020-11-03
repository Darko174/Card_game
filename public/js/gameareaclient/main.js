import Game from "./../game/main.js"
const container = document.querySelector(".container");
const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('id');
const username = localStorage.getItem("userName");
const playerTwoCards = document.querySelector(".playerTwoCards"); 
const playerOneCards = document.querySelector(".playerOneCards"); 
const gameboard = document.querySelector(".gameboard");
const deck = document.querySelector(".deck");


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
    startgame(cards);
})
socket.on("enemyturn", card => {
    enemyturn(card);

    createNotification("Ваш ход");
    document.addEventListener("click", event);
})
socket.on("takecard", data => {
    if(data == "aaa") {
        renderEnemyCards(1);

        createNotification("Ваш ход");
        document.addEventListener("click", event);
    } else {
        takeCard(data);
    }
}) 
//Создание оповещения о подключении игрока
function createNotification(data){
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = data;
    container.append(notification);
    setTimeout(() => notification.remove(), 1000);
}
function startgame(cards) {
    const myCards = cards.secondPlayerCards;
    renderEnemyCards(6);
    renderDeck();
    Game.prototype.renderCards(myCards, playerTwoCards);
}
function enemyturn(card) {
    gameboard.innerHTML = "";
    gameboard.append(Game.prototype.createCard(card));
    playerOneCards.querySelector(".enemyCard").remove();
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
function renderEnemyCards(quantity) {
    for(let i = 0; i < quantity; i++) 
        playerOneCards.insertAdjacentHTML("beforeend", hiddenCard("enemyCard"));
}
function renderDeck() {
    deck.insertAdjacentHTML("beforeend", hiddenCard("cardInDeck"));
}
function hiddenCard(prop) {
    return `<div class=${prop}></div>`
}

function event(e) {
    const target = e.target;
    const cardInTable = gameboard.querySelector(".card");
    if(target.closest(".card")) {
        if(!cardInTable || target.number == cardInTable.number || target.letter == cardInTable.letter) {
            gameboard.innerHTML = "";
            gameboard.appendChild(target);
            socket.emit("enemyturn", {card : target, roomId : roomId});

            document.removeEventListener("click", event);
            createNotification("Ход соперника");
        }
    }
    if(target.closest(".cardInDeck")) {
        socket.emit("takecard", roomId);

        document.removeEventListener("click", event);
        createNotification("Ход соперника");
    }
}



