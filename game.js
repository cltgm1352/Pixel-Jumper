const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('gameOver');

// 画像の読み込み
const obstacleImg = new Image();
obstacleImg.src = 'doku_green.png'; // ブロックの画像
const playerImg = new Image();
playerImg.src = 'character_darkknight_02.png'; // プレイヤーの画像

let player = {
    x: 50,
    y: canvas.height - 50,
    width: 32,
    height: 32,
    speed: 5,
    dy: 0,
    gravity: 0.5,
    jumpPower: -15,
    grounded: false
};

let obstacles = [];
let score = 0;
let gameOver = false;
let frameCount = 0;

function drawPlayer() {
    if (playerImg.complete && playerImg.naturalHeight !== 0) {
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
    } else {
        // フォールバック: 緑の矩形
        ctx.fillStyle = '#0f0';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        if (obstacleImg.complete && obstacleImg.naturalHeight !== 0) {
            ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else {
            // フォールバック: 赤の矩形
            ctx.fillStyle = '#f00';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
    });
}

function updatePlayer() {
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y > canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function createObstacle() {
    let randomY = Math.random() * 70 + (canvas.height - 100); // ランダムY: canvas.height - 100 ～ canvas.height - 30
    let randomWidth = Math.random() * 20 + 20; // ランダム幅: 20-40
    let randomHeight = Math.random() * 20 + 20; // ランダム高さ: 20-40
    let obstacle = {
        x: canvas.width,
        y: randomY,
        width: randomWidth,
        height: randomHeight,
        speed: 3
    };
    obstacles.push(obstacle);
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= obstacle.speed;
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            gameOver = true;
            gameOverDisplay.style.display = 'block';
        }
    });
}

function updateScore() {
    if (!gameOver) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
    }
}

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawObstacles();
    updatePlayer();
    updateObstacles();
    checkCollision();
    updateScore();

    if (frameCount % 60 === 0) {
        createObstacle();
    }

    frameCount++;
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') player.x -= player.speed;
    if (e.code === 'ArrowRight') player.x += player.speed;
    if (e.code === 'Space' && player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }
    if (e.code === 'KeyR' && gameOver) {
        player.x = 50;
        player.y = canvas.height - 50;
        player.dy = 0;
        player.grounded = true;
        obstacles = [];
        score = 0;
        gameOver = false;
        gameOverDisplay.style.display = 'none';
        scoreDisplay.textContent = `Score: ${score}`;
        frameCount = 0;
        gameLoop();
    }
});

gameLoop();
