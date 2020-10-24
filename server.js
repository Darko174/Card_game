import express from "express"
import socket from "socket.io"
import chalk from "chalk"
import path from "path"
//import router from "./router/router.js"

const PORT = 8080;
const IP = "192.168.1.101";
const __dirname = path.resolve(".");

const app = express();
const server = app.listen(PORT, IP, () => console.log(chalk.green(`Server started on ${IP}:${PORT}`)));
const io = socket(server);

const rooms = {};
const roomsInGame = {};

app.use(express.static("public"));

app.get("/serverbrowser", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "serverBrowser.html"));
    })
app.get("/gamearea", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "gamearea.html"));
})
app.get("/gameAreaClient", (req, res) => {
    //res.header = ("host_name", `${req.query.id}`);
    res.sendFile(path.join(__dirname, "public", "gameAreaClient.html"));
})

io.on("connection", socket => {
    socket.on("disconnect", () => {
        delete rooms[`${socket.id}`];
        io.sockets.emit("removegame", socket.id);
    })
    ///
    socket.on("newgame", hostname => {
        let room = socket.id;

        socket.join(createRoom(hostname, room));
        io.sockets.emit("findgame", rooms);
    })
    socket.on("findgame", () => {
        io.sockets.emit("findgame", rooms);
    })
    socket.on("joingame", clientInfo => {
        const {hostid : room, clientName} = clientInfo;
        const roomMembers = io.sockets.adapter.rooms[room];
        socket.join(room);
        io.to(room).emit("joingame", clientName);

        if(roomMembers.length >= 2) {
            roomsInGame.room = rooms[room];
            delete rooms[room];
            console.log(rooms);
            io.sockets.emit("findgame", rooms);
        }
    })
})







function createRoom(hostname,room) {
        rooms[`${room}`] = {
            name : hostname,
            hostRoomId: room
        }
        return room
}