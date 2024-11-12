const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Установка размера канваса


let lander = {
    x: canvas.width / 2,
    y: 50,
    width: 30,
    height: 50,
    velocityY: 0,
    velocityX: 0,
    gravity: 0.1,
    thrust: 0.15,
    isThrusting: false
};

let particles = [];
const surfaceColor = "#C25C28"; // Марсианский цвет поверхности
let cameraY = 0; // Положение камеры по Y
let cameraX = 0; // Положение камеры по X
const rocks = []; // Массив для хранения координат камней
const seed = 42; // Сид для генерации камней

function random(seed) {
    return (seed * 9301 + 49297) % 233280 / 233280;
}

// Генератор камней
function generateRocks(seed) {
    for (let x = 0; x < canvas.width; x += 50) { // Генерируем камни каждые 50 пикселей
        const randomHeight = Math.floor(random(seed + x) * 30) + 10; // Высота камня от 10 до 40 пикселей
        rocks.push({ x: x, y: canvas.height - randomHeight - 50, width: 20, height: randomHeight });
    }
}

function update() {
    // Обновляем положение посадочного модуля
    if (lander.isThrusting) {
        lander.velocityY -= lander.thrust; // Уменьшаем скорость при движении вверх
        createParticles();
    }
    lander.velocityY += lander.gravity; // Применяем гравитацию
    lander.y += lander.velocityY;
    lander.x += lander.velocityX; // Обновляем положение по X

    // Проверка на столкновение с землей
    if (lander.y + lander.height >= canvas.height - 50) { // Проверка на землю
        lander.y = canvas.height - 50 - lander.height;
        lander.velocityY = 0; // Останавливаем модуль при приземлении
    }

    // Проверка на границы экрана
    if (lander.x < 0) {
        lander.x = 0; // Не даем выходить за левую границу
    } else if (lander.x + lander.width > canvas.width) {
        lander.x = canvas.width - lander.width; // Не даем выходить за правую границу
    }

    // Перемещаем камеру вместе с модулем
    cameraY = lander.y < canvas.height / 2 ? 0 : lander.y - canvas.height / 2;
    cameraX = lander.x < canvas.width / 2 ? 0 : lander.x - canvas.width / 2;

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем поверхность
    ctx.fillStyle = surfaceColor;
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50); // Рисуем землю

    // Рисуем камни
    drawRocks();

    // Рисуем посадочный модуль и частицы
    drawLander();
    drawParticles();
}

function drawLander() {
    ctx.fillStyle = "white";
    ctx.fillRect(lander.x - cameraX, lander.y - cameraY, lander.width, lander.height);
}

function drawRocks() {
    ctx.fillStyle = "gray";
    for (const rock of rocks) {
        ctx.fillRect(rock.x - cameraX, rock.y, rock.width, rock.height); // Рисуем камни
    }
}


function createParticles() {
    for (let i = 0; i < 5; i++) {
        particles.push({
            x: lander.x + lander.width / 2,
            y: lander.y + lander.height,
            radius: Math.random() * 3 + 1,
            color: "orange",
            velocityY: Math.random() * -2 - 1,
            lifespan: Math.random() * 50 + 50 // Время жизни частицы
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.y -= particle.velocityY; // Двигаем частицу вверх
        particle.x += (Math.random()-0.5)*3
        particle.lifespan -= 1; // Уменьшаем время жизни частицы
        if (particle.lifespan <= 0) {
            particles.splice(i, 1); // Удаляем частицу, если время жизни закончилось
        }
    }
}

function drawParticles() {
    for (const particle of particles) {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y - cameraY, particle.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function handleKeyDown(event) {
    if (event.code === "ArrowUp") {
        lander.isThrusting = true; // Запускаем двигатель при нажатии вверх
    }
    if (event.code === "ArrowLeft") {
        lander.velocityX -=2; // Перемещение влево
    }
    if (event.code === "ArrowRight") {
        lander.velocityX +=2; // Перемещение вправо
    }
}

function handleKeyUp(event) {
    if (event.code === "ArrowUp") {
        lander.isThrusting = false; // Останавливаем двигатель
    }
}


document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Основной игровой цикл
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();