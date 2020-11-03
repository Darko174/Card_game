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
    createNotification(`<p>${ clientName } вошел в игру</p>`);
})
socket.on("startgame", cards => {
    startGame(cards);

    //Хост первым начинает игру
    createNotification("Ваш ход");
    document.addEventListener("click", event);
})
socket.on("enemyturn", card => {
    enemyturn(card);

    createNotification("Ваш ход");
    document.addEventListener("click", event);
})
socket.on("takecard", data => {     ///
    if(data == "aaa") {
        renderEnemyCards(1);

        createNotification("Ваш ход");
        document.addEventListener("click", event);
    } else {
        takeCard(data);
    }
}) 

//functions
function startGame(cards) {
    const myCards = cards.firstPlayerCards;
    renderEnemyCards(6);
    renderDeck();
    //Подумать как переделать
    _ROOMID = cards.roomId;
    Game.prototype.renderCards(myCards, playerTwoCards);
}

//Создание оповещения о подключении игрока
function createNotification(data){
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = data;
    container.append(notification);
    setTimeout(() => notification.remove(), 1000);
}
//Рендерим скрытые карты соперника и колоду
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
function enemyturn(card) {
    gameboard.innerHTML = "";
    gameboard.append(Game.prototype.createCard(card));
    playerOneCards.querySelector(".enemyCard").remove();
}
function event(e) {
    const target = e.target;
    const cardInTable = gameboard.querySelector(".card");
    if(target.closest(".card")) {
        if(!cardInTable || target.number == cardInTable.number || target.letter == cardInTable.letter) {
            gameboard.innerHTML = "";
            gameboard.appendChild(target);
            socket.emit("enemyturn", {card : target, roomId : _ROOMID});

            document.removeEventListener("click", event);
            createNotification("Ход соперника");
        }
    }
    if(target.closest(".cardInDeck")) {
        socket.emit("takecard", _ROOMID);

        document.removeEventListener("click", event);
        createNotification("Ход соперника");
    }
}
