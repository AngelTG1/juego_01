let obstacle = { x: 500, y: 200, width: 20, height: 40 };
let speedY = 2;
let speedX = 3;

function moveObstacle() {
    obstacle.x += speedX;
    obstacle.y += speedY;
    
    if (obstacle.y > 400 || obstacle.y < 0) speedY *= -1;
    if (obstacle.x > 600 || obstacle.x < 0) speedX *= -1;
}

setInterval(() => {
    moveObstacle();
    postMessage(obstacle);
}, 30);
