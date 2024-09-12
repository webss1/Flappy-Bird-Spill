const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Last inn bilder
const bird = new Image();
const bg = new Image();
const fg = new Image();
const pipeNorth = new Image();
const pipeSouth = new Image();

bird.src = "https://raw.githubusercontent.com/Polycode-Fiction/flappy-bird-assets/main/bird.png";
bg.src = "https://raw.githubusercontent.com/Polycode-Fiction/flappy-bird-assets/main/bg.png";
fg.src = "https://raw.githubusercontent.com/Polycode-Fiction/flappy-bird-assets/main/fg.png";
pipeNorth.src = "https://raw.githubusercontent.com/Polycode-Fiction/flappy-bird-assets/main/pipeNorth.png";
pipeSouth.src = "https://raw.githubusercontent.com/Polycode-Fiction/flappy-bird-assets/main/pipeSouth.png";

// Lydfiler
const fly = new Audio();
const scoreSound = new Audio();

fly.src = "https://raw.githubusercontent.com/Polycode-Fiction/flappy-bird-assets/main/fly.mp3";
scoreSound.src = "https://raw.githubusercontent.com/Polycode-Fiction/flappy-bird-assets/main/score.mp3";

// Variabler
let gap = 85;
let constant = pipeNorth.height + gap;
let birdX = 10;
let birdY = 150;
let gravity = 1.5;
let score = 0;

// Fly-funksjon
document.addEventListener("keydown", flyUp);
document.addEventListener("touchstart", flyUp);

function flyUp() {
    birdY -= 25;
    fly.play();
}

// Pipe-koordinater
let pipe = [];

pipe[0] = {
    x: canvas.width,
    y: 0
};

// Tegn elementer på canvas
function draw() {
    ctx.drawImage(bg, 0, 0);

    for (let i = 0; i < pipe.length; i++) {
        constant = pipeNorth.height + gap;
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

        pipe[i].x--;

        if (pipe[i].x == 125) {
            pipe.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
            });
        }

        // Kollisjon
        if (birdX + bird.width >= pipe[i].x && birdX <= pipe[i].x + pipeNorth.width &&
            (birdY <= pipe[i].y + pipeNorth.height || birdY + bird.height >= pipe[i].y + constant) || birdY + bird.height >= canvas.height - fg.height) {
            location.reload(); // Last inn siden på nytt hvis kollisjon
        }

        if (pipe[i].x == 5) {
            score++;
            scoreSound.play();
        }
    }

    ctx.drawImage(fg, 0, canvas.height - fg.height);
    ctx.drawImage(bird, birdX, birdY);

    birdY += gravity;

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, canvas.height - 20);

    requestAnimationFrame(draw);
}

draw();
