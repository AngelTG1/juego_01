let obstacle = { x: 300, y: 50, width: 50, height: 20 };
let speedX = 3;

function moveObstacle() {
    obstacle.x += speedX;
    if (obstacle.x > 600 || obstacle.x < 0) {
        speedX *= -1;  // Cambia de dirección
    }
}

setInterval(() => {
    moveObstacle();
    postMessage(obstacle);
}, 30);
