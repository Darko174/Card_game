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
socket.on("playerturn", card => {
     playerturn(card);
     socket.emit("")
})
socket.on("takecard", data => {
    if(data == "aaa") {
        renderEnemyCards(1);
    } else {
        takeCard(data);
    }
}) 
function startgame(cards) {
    const myCards = cards.secondPlayerCards;
    renderEnemyCards(6);
    renderDeck();
    Game.prototype.renderCards(myCards, playerTwoCards);
}
function playerturn(card) {
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

document.addEventListener("click", e => {
    const target = e.target;
    const cardInTable = gameboard.querySelector(".card");
    if(target.closest(".card")) {
        if(!cardInTable || target.number == cardInTable.number || target.letter == cardInTable.letter) {
            gameboard.innerHTML = "";
            //Надо пересмотреть историю с id
            socket.emit("playerturn", {card : target, roomId : roomId});
            gameboard.appendChild(target);
        }
    }
    if(target.closest(".cardInDeck")) {
        socket.emit("takecard", roomId);
    }
})



