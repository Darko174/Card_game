import express from "express"
import socket from "socket.io"
import chalk from "chalk"

const PORT = 8080;
const IP = "192.168.1.101";

const app = express();
const server = app.listen(PORT, IP, () => console.log(chalk.green(`Server started on ${IP}:${PORT}`)));
const io = socket(server);

app.use(express.static("./public"));