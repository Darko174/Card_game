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

const games = {};

app.use(express.static("public"));

app.get("/serverbrowser", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "serverBrowser.html"));
    })
app.get("/gamearea", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "gamearea.html"));
})

io.on("connection", socket => {
    socket.on("disconnect", () => {
        delete games[`${socket.id}`];
        io.sockets.emit("removegame", socket.id);
        console.log(games);
    })
    ///
    socket.on("newgame", hostname => {
        console.log(`${hostname} created game`);
        games[`${socket.id}`] = hostname;
        io.sockets.emit("findgame", games);
    })
    socket.on("findgame", () => {
        io.sockets.emit("findgame", games);
    })
})
