import express from "express"
import socket from "socket.io"
import chalk from "chalk"
import path from "path"
import Game from "./public/js/game/main.js"
import database from "./public/DB/DataBase.js"

const PORT = 8080;
const IP = "192.168.1.101";
const __dirname = path.resolve(".");

const app = express();
const server = app.listen(PORT, IP, () => console.log(chalk.green(`Server started on ${IP}:${PORT}`)));
const io = socket(server);

const rooms = {};
const roomsInGame = {};
const deck = database.cards;

app.use(express.static("public"));

app.get("/serverbrowser", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "serverBrowser.html"));
})
app.get("/gamearea", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "gamearea.html"));
})
app.get("/gameAreaClient", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "gameAreaClient.html"));
})

//Коннект сокета к серверу
io.on("connection", socket => {
    socket.on("disconnect", () => {
        delete rooms[`${socket.id}`];
        io.sockets.emit("removegame", socket.id);
    })
    //Создание игры хостом
    socket.on("newgame", hostname => {
        let room = Math.floor(Math.random() * 1000000);

        socket.join(createRoom(hostname, room, socket.id));
        io.sockets.emit("findgame", rooms);
    })
    //Поиск игры клиентом 
    socket.on("findgame", () => {
        io.sockets.emit("findgame", rooms);
    })
    //Присоединение к игре
    socket.on("joingame", clientInfo => {
        const { roomId: room, clientName } = clientInfo;
        const roomMembers = io.sockets.adapter.rooms[room];
        socket.join(room);
        io.to(room).emit("joingame", clientName);
        if (rooms[room]) {
            rooms[room].client = {
                name: clientName,
                id: socket.id,
                cards: []
            }
        } else {
            return
        }
        //Удаление комнаты из списка если она полная
        if (roomMembers.length >= 2) {
            roomsInGame[room] = rooms[room];
            delete rooms[room];
            io.sockets.emit("findgame", rooms);
        }
    })
    //Начало игры 
    socket.on("startgame", roomId => {
        const room = roomsInGame[roomId];
        //тут падение при перезагрузке
        const cards = room.cardsDeck.getCards(room.cardsDeck.deck);
        [room.host.cards, room.client.cards] = [cards.firstPlayerCards, cards.secondPlayerCards];
        io.to(roomId).emit("startgame", {
            firstPlayerCards: room.host.cards,
            secondPlayerCards: room.client.cards,
            roomId : roomId
        })
    })
    socket.on("playerturn", data => {
        const {card, roomId} = data;
        //Всем кроме отправителя
        socket.to(roomId).emit("playerturn", card);
    }) 
})

//Создание комнаты хостом
function createRoom(hostname, room, id) {
    rooms[room] = {
        roomId: room,
        host: {
            name: hostname,
            id: id,
            cards: []
            
        },
        cardsDeck: new Game(deck)
    }
    return room
}