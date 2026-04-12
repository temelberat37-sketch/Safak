const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lanes = [canvas.width/4, canvas.width/2, canvas.width/4*3];

let player, coins, obstacles, score, running=false;

function init(){
 player = {x:lanes[1],y:canvas.height-150,lane:1};
 coins=[]; obstacles=[]; score=0;
}

function startGame(){
 document.getElementById("menu").style.display="none";
 document.getElementById("gameover").classList.add("hidden");
 canvas.style.display="block";
 init();
 running=true;
 gameLoop();
}

function gameOver(){
 running=false;
 canvas.style.display="none";
 document.getElementById("gameover").classList.remove("hidden");
 document.getElementById("finalScore").innerText=score;

 let hs = localStorage.getItem("hs")||0;
 if(score>hs){ localStorage.setItem("hs",score); }
 document.getElementById("highScore").innerText=localStorage.getItem("hs");
}

function restart(){
 startGame();
}

function spawn(){
 coins.push({x:lanes[Math.floor(Math.random()*3)],y:-20});
 obstacles.push({x:lanes[Math.floor(Math.random()*3)],y:-20});
}

function update(){
 coins.forEach(c=>c.y+=5);
 obstacles.forEach(o=>o.y+=6);

 coins = coins.filter(c=>{
  if(Math.abs(c.x-player.x)<40 && Math.abs(c.y-player.y)<40){
   score++; return false;
  }
  return true;
 });

 obstacles = obstacles.filter(o=>{
  if(Math.abs(o.x-player.x)<40 && Math.abs(o.y-player.y)<40){
   gameOver(); return false;
  }
  return true;
 });
}

function draw(){
 ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle="cyan";
 ctx.fillRect(player.x-25,player.y-25,50,50);

 ctx.fillStyle="yellow";
 coins.forEach(c=>ctx.fillRect(c.x,c.y,20,20));

 ctx.fillStyle="red";
 obstacles.forEach(o=>ctx.fillRect(o.x,o.y,30,30));

 ctx.fillStyle="white";
 ctx.fillText("Skor:"+score,20,40);
}

function gameLoop(){
 if(!running) return;
 update();
 draw();
 requestAnimationFrame(gameLoop);
}

setInterval(spawn,1000);

let startX=0;
document.addEventListener("touchstart",e=>startX=e.touches[0].clientX);
document.addEventListener("touchend",e=>{
 let endX=e.changedTouches[0].clientX;
 if(endX>startX+50) player.lane=Math.min(2,player.lane+1);
 if(endX<startX-50) player.lane=Math.max(0,player.lane-1);
 player.x=lanes[player.lane];
});

document.getElementById("highScore").innerText=localStorage.getItem("hs")||0;
