const cvs = document.getElementById('ping-pong');
const ctx = cvs.getContext("2d");
let c = 0;
const Col_Array = ["Black","White","Black","Red","White","Pink","White","#990011FF","#101820FF","White"];
const Stroke_Array = ["White","Black","Red","White","Purple","White","Blue","#FCF6F5FF","#006B38FF","Orange"]; 
const user = {
    x : 0,
    y : cvs.height/2 - 100/2,
    width : 12,
    height : 100,
    color : Col_Array[c],
    stroke : Stroke_Array[c],
    score : 0
}
const com = {
    x : cvs.width - 10,
    y : cvs.height/2 - 100/2,
    width : 14,
    height : 100,
    color : Col_Array[c],
    stroke : Stroke_Array[c],
    score : 0
}
const ball = {
    x : cvs.width/2,
    y : cvs.height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : Col_Array[c],
    stroke : Stroke_Array[c]
}
const net = {
    x : cvs.width/2,
    y : 0,
    width : 2,
    height : 10,
    color : Stroke_Array[c]
}

function drawNet(){
    for(let i = 0;i <= cvs.height;i += 15){
        drawRect(net.x,net.y + i,net.width,net.height,2,net.color);
    }
}

function drawRect(x,y,w,h,linewidth,color,strokecolor){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h,color);
    ctx.strokeStyle = strokecolor;
    ctx.lineWidth = linewidth;
    ctx.strokeRect(x,y,w,h);
}
function drawCircle(x,y,r,color,linewidth,strokecolor){
    ctx.fillStyle = color;
    ctx.strokeStyle = strokecolor;
    ctx.lineWidth = linewidth;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.stroke();
    ctx.closePath();
    ctx.fill();
}
function drawText(text,x,y,color,linewidth,strokecolor){
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text,x,y);
    ctx.lineWidth = linewidth;
    ctx.strokeStyle = strokecolor;
    ctx.strokeText(text,x,y);
}
function render(){
    drawRect(0,0,600,400,9,Col_Array[c],Stroke_Array[c]);
    drawNet();
    drawText(user.score,cvs.width/4,cvs.height/5,user.color,2,user.stroke);
    drawText(com.score,3*cvs.width/4,cvs.height/5,user.color,2,user.stroke);

    drawRect(user.x,user.y,user.width,user.height,5,user.color,user.stroke);
    drawRect(com.x,com.y,com.width,com.height,5,com.color,com.stroke);

    drawCircle(ball.x,ball.y,ball.radius,ball.color,12,ball.stroke)
}
cvs.addEventListener("mousemove", movePaddle);

function movePaddle(evt){
    let rect = cvs.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height/2
}

function collision(b,p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2

    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

function Update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    let CPUlevel = 0.1;
    com.y += (ball.y - (com.y + com.height/2)) * CPUlevel;

    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < cvs.width/2) ? user : com;

    if(collision(ball,player)){
        let collidepoint = ball.y - (player.y + player.height/2);

        collidepoint = collidepoint/(player.height/2);

        let angleRad = collidepoint * Math.PI/4;

        let direction = (ball.x < cvs.width/2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.5;
    }

    if(ball.x - ball.radius < 0){
        com.score++;
        resetBall();
    }else if(ball.x + ball.radius > cvs.width){
        user.score++;
        resetBall();
    }
}
function game(){
    render();
    Update();
    c++;
}
let FPS = 60;
setInterval(game,1000/FPS);