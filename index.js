const path = require("path")

const express = require("express")
const app = express()
const PORT = 3000

const http = require("http")
const { Server } = require("socket.io");

const cors = require("cors")

const server = http.createServer(app)
const io = new Server(server)

let pos = {}

io.on("connection", (socket) => {
    let id = socket.id
    console.log(`${id} 接続⚡️`)

    let query = socket.handshake.query

    console.log(query.pos)
    pos[`${id}`] = JSON.parse(query.pos)

    console.log(pos)
    io.emit("updatePos", pos)

    socket.on("keydown", data => {
        const {id, key} = data

        switch (key) {
            case "ArrowLeft":
                pos[id].x -= 20
                pos[id].ang = 1
                break
            case "ArrowRight":
                pos[id].x += 20
                pos[id].ang = 2
                break
            case "ArrowUp":
                pos[id].y -= 20
                pos[id].ang = 3
                break
            case "ArrowDown":
                pos[id].y += 20
                pos[id].ang = 0
                break
        }

        console.log(pos)
        io.emit("updatePos", pos)
    })
    socket.on("send", data => {
        console.log(data)
        io.emit("popChat", data)
    })
    socket.on("disconnect", () => {
        console.log(`${id} 切断✂️`)
        
        delete(pos[`${id}`])
        console.log(pos)
        io.emit("remove", id)
    })
})

app.use(express.static(path.join(__dirname, "views")))
app.use(express.json())

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
        optionsSuccessStatus: 204
    })
)

app.get("/", (req, res) => {
    res.send("index.html")
})

server.listen(PORT, "0.0.0.0", () => {
    console.log(`start server http://localhost:${3000}/`)
})