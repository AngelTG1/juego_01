let x = Math.random() * 550;
let y = Math.random() * 350;
const width = 30;
const height = 30;
let speed = 2; // Velocidad de movimiento

function moveObstacle() {
    y += speed;
    if (y + height > 400 || y < 0) {
        speed = -speed; // Invertir dirección al chocar con los bordes
    }
    postMessage({ x, y, width, height });
}

setInterval(moveObstacle, 30);
