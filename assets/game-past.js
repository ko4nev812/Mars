import { perlinOctave } from './perlin.js';


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
    thrust: 0.2,
    isThrusting: false,
    angle: 0,  // угол наклона корабля
    angularVelocity: 0,  // угловая скорость
    vertices: []  // вершины многоугольника
};
//--------------------------------------------------------------
//Эксперементальный код объекта физики
class PolygonObject {
    constructor(mass, vertices) {
        this.mass = mass;
        this.vertices = vertices; // Список вершин: [{x, y}, ...]
        this.velocity = { x: 0, y: 0 };
        this.angularVelocity = 0;
        this.position = this.calculateCenter();
        this.momentOfInertia = mass * 50;
    }

    calculateCenter() {
        let centerX = 0, centerY = 0;
        for (const vertex of this.vertices) {
            centerX += vertex.x;
            centerY += vertex.y;
        }
        return { x: centerX / this.vertices.length, y: centerY / this.vertices.length };
    }

    // Проверка столкновения с функцией perlin
    checkCollisionWithSurface(perlinFunc) {
        for (const vertex of this.vertices) {
            const surfaceY = perlinFunc(vertex.x);
            if (vertex.y <= surfaceY) {
                this.resolveSurfaceCollision(vertex, perlinFunc);
            }
        }
    }

    resolveSurfaceCollision(vertex, perlinFunc) {
        const dx = 0.01;
        const slope = (perlinFunc(vertex.x + dx) - perlinFunc(vertex.x - dx)) / (2 * dx);
        const normalAngle = Math.atan(slope);
        
        const normal = {
            x: Math.cos(normalAngle),
            y: Math.sin(normalAngle)
        };

        // Сила нормали
        const normalForce = 0.5; 

        // Применение импульса к скорости объекта
        this.velocity.x -= normal.x * normalForce / this.mass;
        this.velocity.y -= normal.y * normalForce / this.mass;

        // Применение крутящего момента для вращения
        const distanceX = vertex.x - this.position.x;
        const distanceY = vertex.y - this.position.y;
        const torque = distanceX * normal.y - distanceY * normal.x;
        this.angularVelocity += torque / this.momentOfInertia;
    }

    update() {
        // Добавляем гравитацию к вертикальной скорости
        this.velocity.y += lander.gravity;
        
        // Обновление позиции и вращения
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        const angle = this.angularVelocity;
        
        // Обновляем координаты вершин
        for (let vertex of this.vertices) {
            const dx = vertex.x - this.position.x;
            const dy = vertex.y - this.position.y;
            vertex.x = this.position.x + dx * Math.cos(angle) - dy * Math.sin(angle);
            vertex.y = this.position.y + dx * Math.sin(angle) + dy * Math.cos(angle);
        }
    }
    draw(){
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x-cameraX, this.vertices[0].y-cameraY);
        for (let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x-cameraX, this.vertices[i].y-cameraY);
        }
        ctx.closePath();
        ctx.strokeStyle = "white";
        ctx.stroke();
    }
}
//----------------------------------------------------




// Функция для вычисления вершин на основе положения и угла
function calculateVertices(lander) {
    let halfWidth = lander.width / 2;
    let halfHeight = lander.height / 2;

    // Вершины относительно центра корабля (до поворота)
    let localVertices = [
        { x: -halfWidth, y: -halfHeight },
        { x: halfWidth, y: -halfHeight },
        { x: halfWidth, y: halfHeight },
        { x: -halfWidth, y: halfHeight }
    ];

    // Поворачиваем вершины в зависимости от угла lander.angle
    lander.vertices = localVertices.map(v => {
        let rotatedX = v.x * Math.cos(lander.angle) - v.y * Math.sin(lander.angle);
        let rotatedY = v.x * Math.sin(lander.angle) + v.y * Math.cos(lander.angle);
        return {
            x: lander.x + rotatedX,
            y: lander.y + rotatedY
        };
    });
}

let particles = [];
const surfaceColor = "#C25C28"; // Марсианский цвет поверхности
let cameraY = 0; // Положение камеры по Y
let cameraX = 0; // Положение камеры по X
const rocks = []; // Массив для хранения координат камней
const seed = 42; // Сид для генерации камней






let noiseScale = 0.009;
let octaves = 6;
let persistence = 0.4;
function perlin(x){
    return perlinOctave((x) * noiseScale, octaves, persistence) * 100 + 300
}


// Генерация марсианской поверхности с шумом Перлина


function drawTerrain() {
    ctx.fillStyle = "#D2691E"; // Цвет марсианской поверхности
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);


    
    // Отрисовка поверхности с шумом
    for (let x = 0; x < canvas.width; x++) {
        let noiseValue =perlin(x+cameraX) // Генерация шума Перлина для каждой координаты X
        ctx.lineTo(x, noiseValue-cameraY);
    }

    ctx.lineTo(canvas.width, canvas.height); // Замыкаем нижнюю часть поверхности
    ctx.closePath();
    ctx.fill();
}
function checkCollision(lander) {
    for (let vertex of lander.vertices) {
        let terrainHeightAtX = perlin(Math.floor(vertex.x));
        if (vertex.y >= terrainHeightAtX) {
            return true;  // Если вершина пересекает поверхность
        }
    }
    return false;
}
function handleCollision(lander) {
    if (checkCollision(lander)) {
        // Уменьшаем вертикальную и угловую скорость при столкновении
        lander.velocityY = 0;
        lander.angularVelocity = 0;
        
        // Корректируем положение корабля так, чтобы вершины не пересекали поверхность
        let correction = 1;  // шаг коррекции
        while (checkCollision(lander)) {
            lander.y -= correction;
            calculateVertices(lander);
        }
    }

}

// Обновляем физику корабля
function updateLanderPhysics() {
    // Обновляем угловую скорость и угол корабля
    lander.angle += lander.angularVelocity;

    // Применяем гравитацию и движение
    lander.velocityY += lander.gravity;
    lander.y += lander.velocityY;
    lander.x += lander.velocityX;

    // Пересчитываем вершины
    calculateVertices(lander);
    
    // Проверяем коллизию
    handleCollision(lander);
}
const polygon = new PolygonObject(3, [
    { x: 100, y: 200 },
    { x: 120, y: 220 },
    { x: 100, y: 240 },
    { x: 80, y: 220 }
]);


function update() {
     // Цвет текста
    ctx.font = "16px Arial"; // Шрифт текста

    // Выводим информацию на экран
    
    /** 

    // Обновляем положение посадочного модуля
    if (lander.isThrusting) {
        lander.velocityY -= lander.thrust; // Уменьшаем скорость при движении вверх
        createParticles();
    }
    updateLanderPhysics()
    lander.velocityY += lander.gravity; // Применяем гравитацию
    lander.y += lander.velocityY;
    lander.x += lander.velocityX; // Обновляем положение по X

    // Проверка на столкновение с землей
    if (lander.y + lander.height >= canvas.height - 50) { // Проверка на землю
        lander.y = canvas.height - 50 - lander.height;
        lander.velocityY = 0; // Останавливаем модуль при приземлении
    }

    */

    // Перемещаем камеру вместе с модулем
    cameraY = polygon.position.y - canvas.height / 2;
    cameraX = polygon.position.x - canvas.width / 2;
    

    updateParticles();

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем поверхносв
    ctx.fillStyle = surfaceColor;
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50); // Рисуем землю

    

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем поверхность
    drawTerrain();
    
    polygon.update();
    polygon.checkCollisionWithSurface(perlin);
    polygon.draw();
    // Рисуем частицы
    drawParticles();
    ctx.fillStyle = "white";
    ctx.fillText("Позиция: (" + polygon.position.x.toFixed(2) + ", " + polygon.position.y.toFixed(2) + ")", 10, 40);
    ctx.fillText("скорость: " + polygon.velocity.x.toFixed(2)+ "; "+polygon.velocity.y.toFixed(2), 10, 60);

}

//function drawLander() {
//    ctx.fillStyle = "white";
//    ctx.fillRect(lander.x - cameraX, lander.y - cameraY, lander.width, lander.height);
//}

function drawLander() {
    ctx.beginPath();
    ctx.moveTo(lander.vertices[0].x-cameraX, lander.vertices[0].y-cameraY);
    for (let i = 1; i < lander.vertices.length; i++) {
        ctx.lineTo(lander.vertices[i].x-cameraX, lander.vertices[i].y-cameraY);
    }
    ctx.closePath();
    ctx.strokeStyle = "white";
    ctx.stroke();
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
        particle.y -= particle.velocityY;
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
        ctx.arc(particle.x-cameraX, particle.y - cameraY, particle.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function handleKeyDown(event) {
    if (event.code === "KeyW") {
        lander.isThrusting = true; // Запускаем двигатель при нажатии вверх
    }
    if (event.code === "KeyA") {
        lander.velocityX -=1; // Перемещение влево
    }
    if (event.code === "KeyD") {
        lander.velocityX +=1; // Перемещение вправо
    }
    if (event.code === "KeyQ") {
        lander.angularVelocity = -0.05; // Вращаем влево
    }
    if (event.code === "KeyE") {
        lander.angularVelocity = 0.05; // Вращаем вправо
    }
}

function handleKeyUp(event) {
    if (event.code === "KeyW") {
        lander.isThrusting = false; // Останавливаем двигатель
    }
    if (event.code === "KeyQ" || event.code === "E") {
        lander.angularVelocity = 0; // Останавливаем вращение
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