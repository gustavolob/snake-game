"use strict";

let snake = [{ x: 150, y: 150 }, { x: 140, y: 150 }, { x: 130, y: 150 }, { x: 120, y: 150 }, { x: 110, y: 150 },];

// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;

let foodX;
let foodY;

let score = 0;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function main() {  
    setTimeout(function onTick() {
    if (didGameEnd()){
        if (score > document.getElementById('highcount').innerHTML){
            document.getElementById('highcount').innerHTML = score;
        }
        ctx.font = "2.2em Tiny5";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", 150, 140);

        ctx.font = "1em Cultive Mono";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.fillText("press space to restart", 150, 160);

        return;
    }
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    main();  }, 100);
}

function clearCanvas() {  
    ctx.fillStyle = "#606c38";  
    //ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawFood() { ctx.fillStyle = '#bc4749';
    ctx.strokeStyle = 'darkred';
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
};

function randomTen(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

function createFood() {  
    foodX = randomTen(0, gameCanvas.width - 10);
    foodY = randomTen(0, gameCanvas.height - 10);

    snake.forEach(function isFoodOnSnake(part) {
    const foodIsOnSnake = part.x == foodX && part.y == foodY;
    if (foodIsOnSnake) {
        createFood();
        }
    }); 
}

function drawSnake() { snake.forEach(drawSnakePart); }

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen'; 
    ctx.strokeStyle = 'darkgreen';
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

let isDirectionChanging = false

function advanceSnake() {  

    isDirectionChanging = false

    const head = {x: snake[0].x + dx, y: snake[0].y + dy};   
    snake.unshift(head);
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        createFood();
        score += 10;    
        document.getElementById('score').innerHTML = score;
    }else{ 
        snake.pop();  
    }   

}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {

    if (isDirectionChanging) return;

    isDirectionChanging = true;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const A_KEY = 65;
    const D_KEY = 68;
    const W_KEY = 87;
    const S_KEY = 83;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if ((keyPressed === LEFT_KEY || keyPressed === A_KEY) && !goingRight) {    
        dx = -10;
        dy = 0;  
    }

    if ((keyPressed === RIGHT_KEY || keyPressed === D_KEY) && !goingLeft) {
        dx = 10;    
        dy = 0; 
    }

    if ((keyPressed === UP_KEY || keyPressed === W_KEY) && !goingDown) {
        dx = 0;    
        dy = -10; 
    }

    if ((keyPressed === DOWN_KEY || keyPressed === S_KEY) && !goingUp) {
        dx = 0;    
        dy = 10; 
    }
}

let gameOver = false;

document.addEventListener("keydown", restartGame);

function restartGame (event) {
    const SPACEBAR_KEY = 32;
    const keyPressed = event.keyCode;

    if (keyPressed === SPACEBAR_KEY && gameOver === true) {
        snake = [{ x: 150, y: 150 }, { x: 140, y: 150 }, { x: 130, y: 150 }, { x: 120, y: 150 }, { x: 110, y: 150 },];

        dx = 10;
        dy = 0;

        score = 0;
        gameOver = false;
        document.getElementById('score').innerHTML = score;
        main();
    }
}

function didGameEnd() {
    for(let i = 4; i < snake.length; i++){
        const collide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (collide) {
            gameOver = true;
            return true;
        }
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;

    if (hitLeftWall == true || hitRightWall == true || hitToptWall == true || hitBottomWall == true){
        gameOver = true;
    }

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

createFood();
main();