const main = document.querySelector("main") 
var socket
var id

function render(pos) {
    main.innerHTML = ""
    Object.entries(pos)
        .map(p => p[1])
        .forEach(p => {
            const name = p.ang === 0 ? "mae" :
                        p.ang === 1 ? "hidari" :
                        p.ang === 2 ? "migi" :
                        p.ang === 3 ? "ushiro" : "mae"
            
            const img = document.createElement("img")
            img.style.position = "absolute"
            img.style.top = `${p.y}px`
            img.style.left = `${p.x}px`
            img.style.width = "100px"
            img.style.height = "100px"
            img.src = `img/wal-${name}.png`
            
            main.appendChild(img)
        })
}

document.addEventListener("DOMContentLoaded", () => {
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