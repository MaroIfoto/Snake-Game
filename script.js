// Define HTML elements 
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text')
const logo = document.getElementById('logo')
const score = document.getElementById('score')
const highScoreText = document.getElementById('highScore')

// Define game variables
const gridSize = 20
let snake = [{x: 10, y: 10}];           // snake is let instead of const because snake will change in size unlike board where it will be constant, [{x: 10, y: 10}] this position is where the snakewill start from(middle of the grid)      
let food = generateFood(); 
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Draw game map, snake ,food
function draw() {
    board.innerHTML = '';    //taking the event if game has started before we will need to reset board i.e everytime we draw board is reset 
    drawSnake();
    drawFood();
    updateScore();
}

// Draw snake 
function drawSnake() {
    snake.forEach((segment) => {            // here we are targetting the array with an array method(for each of it children objects in the array {}) 
        const snakeElement = createGameElement('div', 
        'snake');           // function createGameElement will be responsible for creating every snake element and giving it a class and div
        // here defining how our snake looks 
        setPosition(snakeElement, segment)
        board.appendChild(snakeElement)
    });
}

// create a snake or food cube/div 
function createGameElement(tag, className) {  // here we finally created the function createGameElement and assigned to it: tag and classname
    const element = document.createElement(tag); // inside the function we create const element and create the tag(div) for it
    element.className = className; // inside the element we are taking the snake from createGameElement and are adding it to the div element(tag)
    return element;
}

// set position of the snake or the food 
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
} // once made it will be set on the board 


// draw food function
function drawFood() {
        if (gameStarted) {
        const foodElement = createGameElement('div', 'food');         
        setPosition(foodElement, food)
        board.appendChild(foodElement)
        }
    };

// testing
// draw();

// generate food 
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;  // called const x because of position being on x, math.random will give you a random number between 0 & 1 but not up to 1 i.e 0.1 0.2 etc (math.floor to make it whole number and + so it can start genberating from 1 not 0)
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y}; 
}

// moving the snake
function move() {
    const head = {...snake[0]}
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    snake.unshift(head);

    //snake.pop();
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);  //clear past interval 
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw(); 
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

// test moving
// setInterval(() => {
//     move();
//     draw();
// }, 200);

// start game function
function startGame() {
    gameStarted = true;   //keep track of running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//keypress event listenr
function handleKeyPress(event) {
    if (
        (!gameStarted && event.code === 'Space') ||
        (!gameStarted && event.key === '')
        ) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

 document.addEventListener('keydown', handleKeyPress)

 function increaseSpeed() {
    // console.log(gameSpeedDelay)
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5
    }else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3
    }else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2
    }else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1
    }
 }

 function checkCollision() {
    const head = snake[0]
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
 }

 function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    food = generateFood;
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
 }

 function updateScore() {
    const currentScore = snake.length -1; 
    score.textContent =currentScore.toString().padStart(3, '0');
 }

 function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block'
 }

 function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block'
 }