const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const statusText = document.getElementById('status');
const timerText = document.getElementById('timer');
canvas.width = 600;
canvas.height = 400;

// Variables del jugador y la meta
let player = { x: 50, y: 350, radius: 10 };
const goal = { x: 550, y: 50, radius: 15 };

// Obstáculos gestionados por workers
let obstacles = [];

// Workers para los tres obstáculos iniciales
const worker1 = new Worker('worker1.js');
const worker2 = new Worker('worker2.js');
const worker3 = new Worker('worker3.js');

// Workers para los obstáculos móviles adicionales
const movingObstacleWorker1 = new Worker('movingObstacle1.js');
const movingObstacleWorker2 = new Worker('movingObstacle2.js');

// Inicializar la posición de los obstáculos cuando se recibe data de los workers
worker1.onmessage = (e) => { obstacles[0] = e.data; };
worker2.onmessage = (e) => { obstacles[1] = e.data; };
worker3.onmessage = (e) => { obstacles[2] = e.data; };
movingObstacleWorker1.onmessage = (e) => { obstacles[3] = e.data; }; // Obstáculo móvil 1
movingObstacleWorker2.onmessage = (e) => { obstacles[4] = e.data; }; // Obstáculo móvil 2

// Variables para el temporizador y control del juego
let gameRunning = false;
let timeLeft = 20;
let timerInterval;
let newObstacleWorkers = []; // Almacenar workers de nuevos obstáculos

// Mover el jugador con el mouse
canvas.addEventListener('mousemove', (event) => {
    if (gameRunning) {
        const rect = canvas.getBoundingClientRect();
        player.x = event.clientX - rect.left;
        player.y = event.clientY - rect.top;
    }
});

// Dibujar al jugador
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#00FF00';
    ctx.fill();
    ctx.closePath();
}

// Dibujar la meta
function drawGoal() {
    ctx.beginPath();
    ctx.arc(goal.x, goal.y, goal.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.closePath();
}

// Dibujar los obstáculos
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.beginPath();
        ctx.rect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        ctx.fillStyle = '#FF0000';
        ctx.fill();
        ctx.closePath();
    });
}

// Detectar colisiones
function detectCollisions() {
    // Colisión con obstáculos
    for (let obstacle of obstacles) {
        if (player.x + player.radius > obstacle.x &&
            player.x - player.radius < obstacle.x + obstacle.width &&
            player.y + player.radius > obstacle.y &&
            player.y - player.radius < obstacle.y + obstacle.height) {
            resetGame();
            return; // Terminar la función si colisiona
        }
    }

    // Colisión con la meta
    const dx = player.x - goal.x;
    const dy = player.y - goal.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < player.radius + goal.radius) {
        statusText.textContent = '¡Ganaste!';
        stopGame();
    }
}

// Iniciar el temporizador
function startTimer() {
    timeLeft = 20;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.textContent = `Tiempo restante: ${timeLeft}s`;

        // Agregar nuevos obstáculos cuando el tiempo disminuye
        if (timeLeft === 15 || timeLeft === 10 || timeLeft === 5) {
            addNewObstacle();
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            statusText.textContent = '¡Ganaste por tiempo!';
            stopGame();
        }
    }, 1000);
}

// Función para agregar nuevos obstáculos
function addNewObstacle() {
    const newWorker = new Worker('obstacleWorker.js');
    newWorker.onmessage = (e) => {
        obstacles.push(e.data);
    };
    newObstacleWorkers.push(newWorker); // Guardar el nuevo worker
}

// Reiniciar el juego
function resetGame() {
    clearInterval(timerInterval); // Parar el temporizador
    player.x = 50;
    player.y = 350;
    obstacles = obstacles.slice(0, 5); // Reiniciar a los cinco obstáculos iniciales (incluyendo los móviles)
    newObstacleWorkers.forEach(worker => worker.terminate()); // Terminar los workers adicionales
    newObstacleWorkers = []; // Limpiar los nuevos workers
    statusText.textContent = 'Reiniciando...';
    gameRunning = false; // Parar el juego
    startBtn.style.display = 'block'; // Mostrar el botón de nuevo
    setTimeout(() => {
        statusText.textContent = 'Llega al objetivo sin tocar los obstáculos';
        timerText.textContent = 'Tiempo restante: 20s'; // Reiniciar el temporizador visualmente
    }, 1000);
}

// Detener el juego
function stopGame() {
    gameRunning = false;
    clearInterval(timerInterval);
    startBtn.style.display = 'block'; // Mostrar el botón de nuevo
}

// Bucle del juego
function gameLoop() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawGoal();
        drawObstacles();
        detectCollisions();
    }
    requestAnimationFrame(gameLoop);
}

// Iniciar el juego al hacer clic en el botón de inicio
startBtn.addEventListener('click', () => {
    startGame();
});

// Función para iniciar el juego
function startGame() {
    gameRunning = true;
    startBtn.style.display = 'none'; // Ocultar el botón de inicio
    statusText.textContent = 'Llega al objetivo sin tocar los obstáculos';
    startTimer(); // Iniciar el temporizador
}

// Iniciar el bucle del juego
gameLoop();
