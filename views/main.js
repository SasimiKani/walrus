const main = document.querySelector("main")
const chat = document.querySelector("input[name=chat]")
const send = document.querySelector("button[name=send]")
var socket
var id
var listener = []

const me = {x: 50, y: 50, ang: 0}

const imgs = []

function render(pos) {
    Object.entries(pos)
        .sort((a, b) => a[1].y - b[1].y)
        .forEach(p => {
            const img = document.createElement("img")
            img.id = `wal-${p[0]}`
            img.style.position = "absolute"
            img.style.width = "100px"
            img.style.height = "100px"
            if (p[0] === id) {
                var src = imgs[me.ang]
                img.style.top = `${me.y}px`
                img.style.left = `${me.x}px`
            } else {
                var src = imgs[p[1].ang]
                img.style.top = `${p[1].y}px`
                img.style.left = `${p[1].x}px`
            }
            img.src = src

            main.querySelector(`#wal-${p[0]}`)?.remove()
            main.appendChild(img)
        })
    
    if (Object.keys(pos).length > 1) {
        Array.from(main.querySelectorAll("img"))
            .filter(img => !Object.keys(pos).map(id => `wal-${id}`).includes(img.id))
            .forEach(img => img.remove())
    }
}
function viewChat(data) {
    const div = document.createElement("div")
    div.id = `msg-${data.id}`
    div.className = "message-box"
    div.textContent = data.msg
    div.style.position = "absolute"
    div.style.top = `${data.pos.y}px`
    div.style.left = `${data.pos.x}px`

    main.appendChild(div)

    setTimeout(() => {
        div.remove()
    }, 3000)
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetch("img/wal-mae.png").then(res => res.blob()).then(blob => imgs.push(URL.createObjectURL(blob)))
    await fetch("img/wal-hidari.png").then(res => res.blob()).then(blob => imgs.push(URL.createObjectURL(blob)))
    await fetch("img/wal-migi.png").then(res => res.blob()).then(blob => imgs.push(URL.createObjectURL(blob)))
    await fetch("img/wal-ushiro.png").then(res => res.blob()).then(blob => imgs.push(URL.createObjectURL(blob)))

    socket = io({
        query: {
            pos: JSON.stringify(me)
        }
    })
    socket.on("connect", () => {
        id = socket.id
        me.x = me.y = 50
        me.ang = 0

        main.innerHTML = ""

        listener.forEach(l =>  {
            removeEventListener("keydown", l)
        })

        listener.push(e => {
            switch (e.key) {
                case "ArrowLeft":
                    me.x -= 20
                    me.ang = 1
                    break
                case "ArrowRight":
                    me.x += 20
                    me.ang = 2
                    break
                case "ArrowUp":
                    me.y -= 20
                    me.ang = 3
                    break
                case "ArrowDown":
                    me.y += 20
                    me.ang = 0
                    break
            }
            const localPos = {}
            localPos[id] = me
            render(localPos)
            
            socket.emit("keydown", {
                id,
                key: e.key,
            })
        })
        listener.push(() => {
            const data = {
                id: id,
                msg: chat.value,
                pos: me
            }
            viewChat(data)
            
            socket.emit("send", data)

            chat.value = ""
        })
        addEventListener("keydown", listener[0])
        send.addEventListener("click", listener[1])
    })

    socket.on("updatePos", (pos) => {
        render(pos)
    })
    socket.on("popChat", (data) => {
        if (data.id !== id) {
            viewChat(data)
        }
    })
})