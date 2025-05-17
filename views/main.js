const main = document.querySelector("main") 
var socket
var id

const imgs = []

function render(pos) {
    main.innerHTML = ""
    Object.entries(pos)
        .map(p => p[1])
        .forEach(p => {
            const src = imgs[p.ang]
            
            const img = document.createElement("img")
            img.style.position = "absolute"
            img.style.top = `${p.y}px`
            img.style.left = `${p.x}px`
            img.style.width = "100px"
            img.style.height = "100px"
            img.src = src
            
            main.appendChild(img)
        })
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
    })

    socket.on("updatePos", (pos) => {
        render(pos)
    })

    addEventListener("keydown", e => {
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