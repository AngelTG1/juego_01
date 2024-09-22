function getRandomPosition() {
    const x = Math.random() * 550; // Posición aleatoria en el rango del canvas
    const y = Math.random() * 350;
    const width = Math.random() * 50 + 20; // Ancho aleatorio
    const height = Math.random() * 50 + 20; // Alto aleatorio
    return { x, y, width, height };
}

setInterval(() => {
    const newObstacle = getRandomPosition();
    postMessage(newObstacle); // Enviar nuevo obstáculo al main thread
}, 2000); // Obstáculo nuevo cada 2 segundos
