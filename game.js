
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");

let bird;
let pipes;
let score;
let gameOver;
let frame;

function resetGame() {
    bird = {
        x: 80,
        y: 250,
        velocity: 0,
        size: 18
    };

    pipes = [];
    score = 0;
    gameOver = false;
    frame = 0;

    restartButton.style.display = "none";
}

function flap() {
    if (gameOver) return;
    bird.velocity = -7;
}

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault();
        flap();
    }
});

canvas.addEventListener("click", flap);

restartButton.addEventListener("click", resetGame);

function createPipe() {
    const gap = 160;
    const top = Math.random() * 250 + 50;

    pipes.push({
        x: canvas.width,
        top: top,
        bottom: top + gap,
        scored: false
    });
}

function update() {
    if (gameOver) return;

    frame++;

    bird.velocity += 0.35;
    bird.y += bird.velocity;

    if (frame % 100 === 0) {
        createPipe();
    }

    pipes.forEach(pipe => {
        pipe.x -= 3;

        if (
            bird.x + bird.size > pipe.x &&
            bird.x - bird.size < pipe.x + 55 &&
            (
                bird.y - bird.size < pipe.top ||
                bird.y + bird.size > pipe.bottom
            )
        ) {
            gameOver = true;
            restartButton.style.display = "block";
        }

        if (!pipe.scored && pipe.x + 55 < bird.x) {
            score++;
            pipe.scored = true;
        }
    });

    pipes = pipes.filter(pipe => pipe.x > -60);

    if (
        bird.y + bird.size > canvas.height ||
        bird.y - bird.size < 0
    ) {
        gameOver = true;
        restartButton.style.display = "block";
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Hintergrund
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Wolken
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(280, 100, 20, 0, Math.PI * 2);
    ctx.arc(305, 100, 25, 0, Math.PI * 2);
    ctx.arc(330, 100, 18, 0, Math.PI * 2);
    ctx.fill();

    // Kerem
    ctx.fillStyle = "#ffcc00";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
    ctx.fill();

    // Auge
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(bird.x + 7, bird.y - 6, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(bird.x + 9, bird.y - 6, 3, 0, Math.PI * 2);
    ctx.fill();

    // Schnabel
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.moveTo(bird.x + 16, bird.y);
    ctx.lineTo(bird.x + 30, bird.y + 5);
    ctx.lineTo(bird.x + 16, bird.y + 10);
    ctx.fill();

    // Rohre
    pipes.forEach(pipe => {
        ctx.fillStyle = "#228B22";

        ctx.fillRect(pipe.x, 0, 55, pipe.top);
        ctx.fillRect(
            pipe.x,
            pipe.bottom,
            55,
            canvas.height - pipe.bottom
        );
    });

    // Punktestand
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Arial";
    ctx.fillText("Score: " + score, 15, 40);

    // Game Over
    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "bold 35px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", 200, 280);
        ctx.textAlign = "left";
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

resetGame();
gameLoop();
