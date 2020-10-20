/* import express from "express"
import path from "path"

export default function router(app, __dirname) {
    app.use(express.static("./../public"));

    app.get("/serverbrowser", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "serverBrowser.html"));
    })
    app.get("/gamearea", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "gamearea.html"));
})
} */