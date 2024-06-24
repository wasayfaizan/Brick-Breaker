const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Set canvas background color
canvas.style.backgroundColor = "#2c3e50"; // Matte dark blue

// Ball properties
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 4; // Horizontal speed of the ball
let dy = -4; // Vertical speed of the ball
const ballRadius = 10; // Radius of the ball

// Paddle properties
const paddleHeight = 10; // Height of the paddle
const paddleWidth = 100; // Width of the paddle
let paddleX = (canvas.width - paddleWidth) / 2; // Starting x position of the paddle

// Brick properties
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = []; // Array to hold the bricks
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }; // Initialize each brick
    }
}

// Paddle movement control
let rightPressed = false;
let leftPressed = false;

// Score tracking
let score = 0;

// Game status tracking
let gameWon = false;

// Event listeners for paddle movement
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Handles key down events
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

// Handles key up events
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Draws the ball on the canvas
function drawBall() {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = "#e74c3c"; // Matte red
    context.fill();
    context.closePath();
}

// Draws the paddle on the canvas
function drawPaddle() {
    context.beginPath();
    context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    context.fillStyle = "#3498db"; // Matte blue
    context.fill();
    context.closePath();
}

// Draws the bricks on the canvas
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = "#1abc9c"; // Matte green
                context.fill();
                context.closePath();
            }
        }
    }
}

// Draws the score on the canvas
function drawScore() {
    context.font = "16px Arial";
    context.fillStyle = "#ecf0f1"; // Light matte color
    context.fillText("Score: " + score, 8, 20);
}

// Checks if all bricks are broken
function checkGameStatus() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                return false;
            }
        }
    }
    return true;
}

// Draws the winning message on the canvas
function drawWinningMessage() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "32px Arial";
    context.fillStyle = "#ecf0f1";
    context.fillText("Congratulations, You Won!", 70, canvas.height / 2);
}

// Draws the game over message and displays a play again button
function drawGameOverMessage() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "32px Arial";
    context.fillStyle = "#ecf0f1";
    context.fillText("Game Over!", canvas.width / 2 - context.measureText("Game Over!").width / 2, canvas.height / 2 - 40);
    context.fillText("Score: " + score, canvas.width / 2 - context.measureText("Score: " + score).width / 2, canvas.height / 2);

    let playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Play Again";
    playAgainButton.style.position = "absolute";
    playAgainButton.style.left = (canvas.width / 2 - 70) + "px";
    playAgainButton.style.top = (canvas.height / 2 + 40) + "px";
    playAgainButton.style.width = "140px";
    playAgainButton.style.height = "40px";
    playAgainButton.style.backgroundColor = "#34495e"; // Matte dark grey
    playAgainButton.style.color = "#ecf0f1"; // Light matte color
    playAgainButton.style.border = "none";
    playAgainButton.style.cursor = "pointer";
    playAgainButton.onclick = function () {
        document.location.reload(); // Reload the page to restart the game
    };
    document.body.appendChild(playAgainButton);
}

// Detects collision between the ball and the bricks
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let brick = bricks[c][r];
            if (brick.status === 1) {
                if (x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight) {
                    dy = -dy; // Reverse the ball direction
                    brick.status = 0; // Break the brick
                    score += 10; // Increment score by 10 for each brick broken
                }
            }
        }
    }
}

// Updates the game state and redraws the canvas
function update() {
    if (!gameWon) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        collisionDetection();

        if (checkGameStatus()) {
            gameWon = true;
            drawWinningMessage();
            return;
        }

        // Bounce off the walls
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                // Game over condition when the ball misses the paddle
                drawGameOverMessage();
                return;
            }
        }

        x += dx;
        y += dy;

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        requestAnimationFrame(update);
    }
}

update();
