let obstacle = { x: 100, y: 0, width: 30, height: 30 };
let speedY = 3;

function moveObstacle() {
    obstacle.y += speedY;
    if (obstacle.y > 400 || obstacle.y < 0) {
        speedY *= -1;  // Cambia de dirección
    }
}

setInterval(() => {
    moveObstacle();
    postMessage(obstacle);
}, 30);
