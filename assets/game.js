// Создаем движок и мир
const { Engine, Render, Runner, Bodies,Events, Composite, World } = Matter;
let world_bound_X  = 3000;
let world_bound_Y  = 3000;
let zoom           = 1;
let bounds_scale_target = {};
// Инициализация движка и рендеринга
var canvas_id = 'canvas';   
const engine = Engine.create();
const render = Render.create({
    element: document.getElementById('canvas'),
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false, // Выключаем каркасный режим
        background: '#e2c9b1', // Цвет фона марсианской поверхности
        wireframes: false,
        showVelocity: true,
        showCollisions: true,
        hasBounds: true
    }
});
engine.gravity.y = 0.02
Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// Создаем посадочный модуль
let lander = Bodies.rectangle(400, 100, 30, 50, {
    restitution: 0.5, // Отскок
    density: 0.01, // Плотность
    frictionAir: 0.001, // Сопротивление воздуха
});
const keyHandlers = {
    KeyD: () => {
      Matter.Body.setVelocity(lander, {x: lander.velocity.x+0.01, y: lander.velocity.y})
    },
    KeyA: () => {
      Matter.Body.setVelocity(lander, {x: lander.velocity.x-0.01, y: lander.velocity.y})
    },
    KeyW: () => {
        Matter.Body.setVelocity(lander, {x: lander.velocity.x, y: lander.velocity.y-0.02})
    },
    KeyQ: () => {
        Matter.Body.setAngularVelocity(lander, lander.angularVelocity-0.0004)
    },
    KeyE: () => {
        Matter.Body.setAngularVelocity(lander, lander.angularVelocity+0.0004)
    },
  };
  
  const keysDown = new Set();
  document.addEventListener("keydown", event => {
    keysDown.add(event.code);
  });
  document.addEventListener("keyup", event => {
    keysDown.delete(event.code);
  });
  
  Matter.Events.on(engine, "beforeUpdate", event => {
    [...keysDown].forEach(k => {
      keyHandlers[k]?.();
    });
  });




World.add(engine.world, lander);

// Создаем поверхность
const ground = Bodies.rectangle(400, 580, 810, 60, { isStatic: true });
World.add(engine.world, ground);

// Создаем массив для хранения камней
let rocks = [];

// Генерация камней
function createRocks() {
    for (let x = 0; x < 800; x += 50) {
        let rock = Bodies.circle(x, Math.random() * 100 + 300, Math.random() * 10 + 5, { isStatic: true });
        rocks.push(rock);
        World.add(engine.world, rock);
    }
}
createRocks();






let noiseScale = 0.009;
let octaves = 6;
let persistence = 0.4;
function perlin(x){
    return perlinOctave((x) * noiseScale, octaves, persistence) * 100 + 300
}


// Генерация марсианской поверхности с шумом Перлина


Events.on(engine, 'beforeTick', function() {
        
    // apply zoom
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");
    ctx.translate(window.innerWidth/2, window.innerHeight/2);
    ctx.scale(zoom, zoom);
    ctx.translate(-window.innerWidth/2, -window.innerHeight/2);  

    // center view at player 
    this.Bounds.shift(this.render.bounds,
    {
        x: lander.position.x - window.innerWidth / 2,
        y: lander.position.y - window.innerHeight / 2
    });

}.bind(this));

window.onresize = function() {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;

}.bind(this);



//function drawLander() {
//    ctx.fillStyle = "white";
//    ctx.fillRect(lander.x - cameraX, lander.y - cameraY, lander.width, lander.height);
//}






//    if (event.code === "KeyQ") {
//        lander.angularVelocity -= 0.05; // Увеличиваем угловую скорость для поворота влево
 //   }
//    if (event.code === "KeyE") {
//        lander.angularVelocity += 0.05; // Вращаем вправо


function gameLoop() {
    // Здесь можно добавлять логику игры, если это необходимо
    requestAnimationFrame(gameLoop);
}
gameLoop();