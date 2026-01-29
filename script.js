const player = document.getElementById('player');
const scoreText = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');
const obstaclesContainer = document.getElementById('obstaclesContainer');

let isJumping = false;
let isGameOver = false;
let score = 0;
let playerPosition = 50; // Starting position of the player
let obstacleInterval;

// Create the initial obstacle
function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.right = '0px'; // Start from the right side
    obstaclesContainer.appendChild(obstacle);
    
    // Move the obstacle
    let obstacleMoveInterval = setInterval(() => {
        let obstacleRight = parseInt(window.getComputedStyle(obstacle).getPropertyValue('right'));
        obstacleRight += 2;

        if (obstacleRight > 600) {
            clearInterval(obstacleMoveInterval);
            obstaclesContainer.removeChild(obstacle); // Remove the obstacle when it goes out of bounds
            score++; // Increment score for avoiding the obstacle
            scoreText.innerText = `Score: ${score}`; // Update score display
        } else {
            obstacle.style.right = `${obstacleRight}px`;
        }

        checkCollision(obstacle, obstacleMoveInterval);
    }, 20);
}

// Jump functionality
function jump() {
    if (isJumping) return;
    isJumping = true;

    let jumpHeight = 0;
    const jumpInterval = setInterval(() => {
        if (jumpHeight >= 100) {
            clearInterval(jumpInterval);
            fall();
        } else {
            jumpHeight += 5;
            player.style.bottom = `${20 + jumpHeight}px`;
        }
    }, 20);
}

// Falling functionality
function fall() {
    let fallHeight = 100;
    const fallInterval = setInterval(() => {
        if (fallHeight <= 0) {
            clearInterval(fallInterval);
            isJumping = false;
        } else {
            fallHeight -= 5;
            player.style.bottom = `${20 + fallHeight}px`;
        }
    }, 20);
}

// Check collision with obstacle
function checkCollision(obstacle, obstacleMoveInterval) {
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
        playerRect.x < obstacleRect.x + obstacleRect.width &&
        playerRect.x + playerRect.width > obstacleRect.x &&
        playerRect.y < obstacleRect.y + obstacleRect.height &&
        playerRect.y + playerRect.height > obstacleRect.y
    ) {
        alert('Game Over!');
        clearInterval(obstacleMoveInterval);
        clearInterval(obstacleInterval);
        isGameOver = true;
        restartBtn.classList.remove('hidden'); // Show the restart button
    }
}

// Player move ahead
function moveAhead() {
    if (isGameOver) return; // Don't let player move if game is over
    playerPosition += 5; // Define how far the player moves ahead
    player.style.left = `${playerPosition}px`;
}

// Restart game functionality
function restartGame() {
    isGameOver = false;
    score = 0;
    scoreText.innerText = `Score: 0`; // Reset score display
    playerPosition = 50; // Reset player position
    player.style.left = `${playerPosition}px`; // Reset position in style
    obstaclesContainer.innerHTML = ''; // Clear obstacles
    restartBtn.classList.add('hidden'); // Hide the restart button

    // Start creating obstacles again
    obstacleInterval = setInterval(createObstacle, 2000); // Create a new obstacle every 2 seconds
}

// Event listeners for key actions
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
    if (event.code === 'ArrowRight') {
        moveAhead();
    }
});