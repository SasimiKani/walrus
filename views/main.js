const main = document.querySelector("main") 
var socket
var id

const me = {x: 0, y: 0, ang: 0}

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

document.addEventListener("DOMContentLoaded", async () => {
    await fetch("img/wal-mae.png").then(res => res.blob()).then(blob => imgs.push(URL.createObjectURL(blob)))
    await fetch("img/wal-hidari.png").then(res => res.blob()).then(blob => imgs.push(URL.createObjectURL(blob)))
    await fetch("img/wal-migi.png").then(res => res.blob()).then(blob => imgs.push(URL.createObjectURL(blob)))
    await fetch("img/wal-ushiro.png").then(res => res.blob()).then(blob => imgs.push(URL.createObjectURL(blob)))

    socket = io({
        query: {
            pos: JSON.stringify({x: 0, y: 0, ang: 0})
        }
    })
    socket.on("connect", () => {
        id = socket.id
        me.x = me.y = me.ang = 0
    })

    socket.on("updatePos", (pos) => {
        render(pos)
    })

    addEventListener("keydown", e => {
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
        
        fetch("/keydown", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id,
                key: e.key,
            })
        })
    })
})