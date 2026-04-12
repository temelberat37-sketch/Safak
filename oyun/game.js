const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lanes = [
    canvas.width / 4,
    canvas.width / 2,
    (canvas.width / 4) * 3
];

let player = {
    x: lanes[1],
    y: canvas.height - 150,
    lane: 1,
    hasShield: false,
    magnet: false
};

let coins = [];
let obstacles = [];
let powerUps = [];
let score = 0;

function spawnCoin() {
    coins.push({
        x: lanes[Math.floor(Math.random()*3)],
        y: -50
    });
}

function spawnObstacle() {
    obstacles.push({
        x: lanes[Math.floor(Math.random()*3)],
        y: -50
    });
}

function spawnPowerUp(){
    let type = Math.random() > 0.5 ? "magnet" : "shield";
    powerUps.push({
        x: lanes[Math.floor(Math.random()*3)],
        y: -50,
        type: type
    });
}

function update() {
    coins.forEach(c => {
        if(player.magnet){
            c.x += (player.x - c.x) * 0.1;
        }
        c.y += 5;
    });

    obstacles.forEach(o => o.y += 6);
    powerUps.forEach(p => p.y += 5);

    coins = coins.filter(c => {
        if(Math.abs(c.x - player.x) < 40 && Math.abs(c.y - player.y) < 40){
            score++;
            return false;
        }
        return true;
    });

    obstacles = obstacles.filter(o => {
        if(Math.abs(o.x - player.x) < 40 && Math.abs(o.y - player.y) < 40){
            if(player.hasShield){
                player.hasShield = false;
                return false;
            } else {
                alert("Game Over! Skor: " + score);
                location.reload();
            }
        }
        return true;
    });

    powerUps = powerUps.filter(p => {
        if(Math.abs(p.x - player.x) < 40 && Math.abs(p.y - player.y) < 40){
            if(p.type === "shield") player.hasShield = true;
            if(p.type === "magnet"){
                player.magnet = true;
                setTimeout(()=> player.magnet = false, 5000);
            }
            return false;
        }
        return true;
    });
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = player.hasShield ? "blue" : "cyan";
    ctx.fillRect(player.x-25, player.y-25, 50, 50);

    ctx.fillStyle = "yellow";
    coins.forEach(c => ctx.fillRect(c.x-10, c.y-10, 20, 20));

    ctx.fillStyle = "red";
    obstacles.forEach(o => ctx.fillRect(o.x-20, o.y-20, 40, 40));

    powerUps.forEach(p => {
        ctx.fillStyle = p.type === "shield" ? "green" : "purple";
        ctx.fillRect(p.x-15, p.y-15, 30, 30);
    });

    ctx.fillStyle = "white";
    ctx.fillText("Skor: " + score, 20, 40);
}

function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

setInterval(spawnCoin, 1000);
setInterval(spawnObstacle, 1500);
setInterval(spawnPowerUp, 5000);

let startX = 0;

document.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;

    if(endX > startX + 50){
        player.lane = Math.min(2, player.lane + 1);
    } else if(endX < startX - 50){
        player.lane = Math.max(0, player.lane - 1);
    }

    player.x = lanes[player.lane];
});

gameLoop();
