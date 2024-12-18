const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

let stars = [];
let starDensity = 0.0003; // Процент звёзд на площади экрана

// Set canvas size to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
function getRandomColor() {
    const temperature = Math.random(); // Случайное значение температуры от 0 до 1
    
    // Определяем цвет в зависимости от температуры: 0 (голубой), 0.5 (белый), 1 (красный)
    let r, g, b;
    
    if (temperature < 0.5) {
        // От голубого до белого (чем ниже значение temperature, тем голубее)
        r = Math.floor(55 * (temperature * 2) + 200); // Увеличиваем красный цвет по мере нагрева
        g = Math.floor(55 * (temperature * 2) + 200); // Увеличиваем зелёный цвет
        b = 255; // Постоянный голубой
    } else {
        // От белого до красного (чем выше значение temperature, тем краснее)
        r = 255; // Постоянный красный
        g = Math.floor(200 * ((1 - temperature) * 2)+55); // Уменьшаем зелёный цвет
        b = Math.floor(200 * ((1 - temperature) * 2)+55); // Уменьшаем голубой цвет
    }

    return `rgb(${r}, ${g}, ${b})`;
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateStars();
}

function generateStars() {
    stars = []; // Очищаем массив звёзд
    const starCount = Math.floor(window.innerWidth * window.innerHeight * starDensity); // Количество звёзд в зависимости от размера экрана

    for (let i = 0; i < starCount; i++) {
        let size = (0.1**Math.random())*1.3 +0.5;
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: size, // Размер звезды
            color: getRandomColor(),
            velocityX: Math.random() * 0.1, // Скорость звезды по X (слегка движется)
            velocityY: ((0.5-Math.random()) * 0.01+1) * size * 1.8 + 0.25  // Скорость звезды по Y
        });
    }
}

function updateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст

    stars.forEach(star => {
        star.x += star.velocityX;
        star.y += star.velocityY;

        // Перемещаем звёзды на противоположную сторону, если они выходят за экран
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) {star.y = 0;
            star.x = Math.random() * canvas.width}

        // Рисуем звезду
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
    });
}

function animate() {
    updateStars();
    requestAnimationFrame(animate);
}

// Слушаем изменения размеров окна
window.addEventListener("resize", resizeCanvas);

// Первоначальная настройка
resizeCanvas();
animate();