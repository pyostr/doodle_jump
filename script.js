const canvas = document.getElementById('game')
const context = canvas.getContext('2d')


let score = 0;


const platformWidth = 65;
const platformHeight = 20;
const platformStart = canvas.height - 50;


const gravity = 0.29;
const drag = 0.3;
const bounceVelocity = -12.5;

let minPlatformSpace = 150;
let maxPlatformSpace = 10;

let platforms = [
    {
        x: canvas.width / 2 - platformWidth / 2,
        y: platformStart,
        scored: false // Добавляем свойство для отслеживания учтенных блоков

    }
]

// Создаем платформы
function random(min, max) {
    return Math.random() * (max - min ) + min
}

let y = platformStart
while (y > 0){
    y -= platformHeight + random(minPlatformSpace, maxPlatformSpace)
    let x;

    do {
        x = random(25, canvas.width - 25 - platformWidth)
    } while (
         y > canvas.height / 2 &&
             x > canvas.width / 2 - platformWidth * 1.5 &&
             x < canvas.width / 2 + platformWidth / 2
        );
    platforms.push({x, y})
}

const doodle = {
    width: 20,
    height: 60,
    x: canvas.width / 2 - 20,
    y: platformStart - 60,

    dx: 0,
    dy: 0,
}


let playerDir = 0;
let keydown = false;
let prevDoodleY = doodle.y;

function loop(){
    let animationId = requestAnimationFrame(loop)
    context.clearRect(0,0,canvas.width, canvas.height)

    doodle.dy += gravity


    // Дудл упал
    if (doodle.y > 1500){
        console.log('Упал')
        cancelAnimationFrame(animationId);
    }
    if (doodle.y < canvas.height / 2 && doodle.dy < 0) {
        platforms.forEach(function (platform ){
            platform.y += -doodle.dy;
        });

        while (platforms[platforms.length - 1].y > 0){
            platforms.push({
                x: random(0, canvas.width - 0 - platformWidth),
                y:  platforms[platforms.length - 1].y - (platformHeight + random(minPlatformSpace, maxPlatformSpace))
            })

            minPlatformSpace += 0.5
            maxPlatformSpace += 0.5

            maxPlatformSpace = Math.min(maxPlatformSpace, canvas.height / 2)
        }

    } else {
        doodle.y += doodle.dy;
    }

    if (!keydown){
        if (playerDir < 0){
            doodle.dx += drag

            if (doodle.dx > 0){
                doodle.dx = 0;
                playerDir = 0;
            }
        }
        else if (playerDir > 0){
            doodle.dx -= drag
            if (doodle.dx < 0){
                doodle.dx = 0;
                playerDir = 0;
            }
        }

    }
    doodle.x += doodle.dx

    if (doodle.x + doodle.width < 0){
        doodle.x = canvas.width;
    }
    else if (doodle.x > canvas.width){
        doodle.x = -doodle.width;
    }

    context.fillStyle = 'green';
    platforms.forEach(function (platform){
        context.fillRect(platform.x, platform.y, platformWidth, platformHeight)

        // Генерация случайных красных точек
        const numDots = Math.floor(Math.random() * 3) + 1; // Случайное количество точек от 1 до 3
        context.fillStyle = 'red';
        for (let i = 0; i < numDots; i++) {
            const dotX = platform.x + Math.random() * platformWidth; // Случайная X-координата точки на платформе
            const dotY = platform.y - Math.random() * platformHeight; // Случайная Y-координата точки на платформе
            context.beginPath();
            context.arc(dotX, dotY, 3, 0, Math.PI * 2); // Рисование круглой точки
            context.fill();
        }
        if (
            doodle.dy > 0 &&

            prevDoodleY + doodle.height <= platform.y &&

            doodle.x < platform.x + platformWidth &&
            doodle.x + doodle.width > platform.x &&
            doodle.y < platform.y + platformHeight &&
            doodle.y + doodle.height > platform.y

        ) {
            doodle.y = platform.y - doodle.height;
            doodle.dy = bounceVelocity

            // Проверяем, был ли уже учтен этот блок
            if (!platform.scored) {
                // Увеличиваем счетчик очков
                score += 2;

                // Устанавливаем свойство scored в true, чтобы блок больше не учитывался
                platform.scored = true;
            }
        }

    });

    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('Очки: ' + score, 10, 30);

    context.fillStyle = 'red'
    context.width = '139px'
    context.fillRect(doodle.x, doodle.y, doodle.width, doodle.height)

    prevDoodleY = doodle.y

    platforms = platforms.filter(function (platform){
        return platform.y < canvas.height;
    })
}

document.addEventListener('keydown', function (e){
    if (e.which === 37 ){
        keydown = true;
        playerDir = -1;
        doodle.dx = -3;
    }
    else if (e.which === 39){
        keydown = true;
        playerDir = 1;
        doodle.dx = 3;
    }
})

document.addEventListener('keyup', function (e){
    keydown = false;
})


const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

// Добавляем обработчики событий для кнопок
leftBtn.addEventListener('mousedown', function() {
    keydown = true;
    playerDir = -1;
    doodle.dx = -3;
});

leftBtn.addEventListener('mouseup', function() {
    keydown = false;
});

rightBtn.addEventListener('mousedown', function() {
    keydown = true;
    playerDir = 1;
    doodle.dx = 3;
});

rightBtn.addEventListener('mouseup', function() {
    keydown = false;
});
requestAnimationFrame(loop);