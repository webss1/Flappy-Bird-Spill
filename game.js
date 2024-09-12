const canvas = document.getElementById('gameCanvas'); 
const ctx = canvas.getContext('2d');

// Last inn bilder
const bird = new Image();
const bg = new Image();
const fg = new Image();
const pipeNorth = new Image();
const pipeSouth = new Image();

bird.src = "bird.png";
bg.src = "bg.png";
pipeNorth.src = "pipeNorth.png";
pipeSouth.src = "pipeSouth.png";

// Lydfiler
const fly = new Audio();
const scoreSound = new Audio();

fly.src = "https://raw.githubusercontent.com/Polycode-Fiction/flappy-bird-assets/main/fly.mp3";
scoreSound.src = "https://raw.githubusercontent.com/Polycode-Fiction/flappy-bird-assets/main/score.mp3";

// Variabler
let gap = 85;
let constant;
let birdX = 10;
let birdY = 150;
let gravity = 1.5;
let score = 0;

// Størrelse på pipene
const pipeWidth = 50; // Sett ønsket bredde på pipene her
const pipeHeight = 300; // Sett ønsket høyde på pipene her

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

// Når bildene er lastet inn, kan du begynne å tegne
function startDrawing() {
    // Oppdaterer konstanten basert på ny pipe høyde
    constant = pipeHeight + gap;
    draw();
}

// Tegn elementer på canvas
function draw() {
    if (!bg.complete || !fg.complete || !pipeNorth.complete || !pipeSouth.complete || !bird.complete) {
        // Sjekk at alle bilder er lastet
        console.error("En eller flere bilder er ikke lastet korrekt.");
        return;
    }

    ctx.drawImage(bg, 0, 0);

    for (let i = 0; i < pipe.length; i++) {
        constant = pipeHeight + gap;
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y, pipeWidth, pipeHeight);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant, pipeWidth, canvas.height - (pipe[i].y + constant) - fg.height);

        pipe[i].x--;

        if (pipe[i].x == 125) {
            pipe.push({
                x: canvas.width,
                y: Math.floor(Math.random() * (pipeHeight - (canvas.height - fg.height - constant)))
            });
        }

        // Kollisjon
        if (birdX + bird.width >= pipe[i].x && birdX <= pipe[i].x + pipeWidth &&
            (birdY <= pipe[i].y + pipeHeight || birdY + bird.height >= pipe[i].y + constant) || birdY + bird.height >= canvas.height - fg.height) {
            location.reload(); // Last inn siden på nytt hvis kollisjon
        }

        if (pipe[i].x == 5) {
            score++;
            scoreSound.play();
        }
    }

    ctx.drawImage(fg, 0, canvas.height - fg.height);
    ctx.drawImage(bird, birdX, birdY, bird.width, bird.height);

    birdY += gravity;

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, canvas.height - 20);

    requestAnimationFrame(draw);
}

// Når alle bildene er lastet inn, starter tegningen
bg.onload = () => {
    fg.onload = () => {
        pipeNorth.onload = () => {
            pipeSouth.onload = () => {
                bird.onload = startDrawing;
            }
        }
    }
};

// Feilhåndtering for bilder som ikke laster
bg.onerror = () => console.error("Feil ved lasting av bg-bildet");
fg.onerror = () => console.error("Feil ved lasting av fg-bildet");
pipeNorth.onerror = () => console.error("Feil ved lasting av pipeNorth-bildet");
pipeSouth.onerror = () => console.error("Feil ved lasting av pipeSouth-bildet");
bird.onerror = () => console.error("Feil ved lasting av bird-bildet");


