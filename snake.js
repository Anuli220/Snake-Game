// we will store the whole board such that we can act upon it

const playBoard = document.querySelector(".playboard");
const score = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls");

// We are now creating the game state variable

let gameOver = false;
// foodX is the food on your horizontal basis, foodY is vertical.
let foodX, foodY;
let snakeX = 5, snakeY = 5;
// velocity is the word we use for direction (magnitude with direction)

let velocityX = 0;
let velocityY = 0;

// let's create an array to hold the position of the snake's body order.

let snakeBody = [];
let setIntervalID;

let initialScore = 0;

// retrieving the highscore from the local storage or setting it to 0 if not found

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${high-score}`;

// we are displaying the high score

const updateFoodPosition = ()=>{
    foodX = Math.floor(Math.random()*30)+1; // the random x position is between 1-30
     foodY = Math.floor(Math.random()*30)+1;
}

const handleGameOver = ()=>{
    clearInterval(setIntervalID); // the clear interval function helps us to stop the game loop with the ID we provided.
    alert("Game Over! Play OK to replay");
    location.reload(); // this particular line will help up to reload the page to let us restart the game
}

const changeDirection = (e)=>{
    // let's prevent the reversing direction directly

    if(e.key === "ArrowUp" && velocityY != 1){
        velocityX = 0; velocityY = -1;
    } else if(e.key ==="ArrowDown" && velocityY != 1){
        velocityX = 0; velocityY = 1;
    }
    else if(e.key ==="ArrowLeft" && velocityX != 1){
        velocityX = -1; velocityY = 0;
    }
    else if(e.key ==="ArrowRight" && velocityX != 1){
        velocityX = 1; velocityY = 0;
    }
}

controls.forEach(button => button.addEventListener("click", ()=> changeDirection({key:button.dataset.key})));

const mainGame =()=>{
    if(gameOver) return handleGameOver();
    // add the food to the playboard at the current position

    let html = `<div class="food" style ="grid-area:${foodY}/${foodX}"></div>`;

    // check if the snake eats the food

    if(snakeX === foodX && snakeY ===foodY){
        updateFoodPosition();
        snakeBody.push([foodY,foodX]);
        score++;
        highScore = score>=highScore? score:highScore;
        localStorage.setItem("high-score",highScore);
        score.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    // updating the snake's head position using the current direction

    snakeX+= velocityX;
    snakeY+= velocityY;

    // move the snake body forward by shifting positions.

    for(let i = snakeBody.length-1; i>0; i--){
        // each segment takes the place of the one before it.

        snakeBody[i] = snakeBody[i-1];
    }

    // the setting the head to the new position

    snakeBody[0]= [snakeX,snakeY];
    

    // if the snake hits the wall, the game is over

    if(snakeX<=0 || snakeX >30 || snakeY <= 0 || snakeY > 30){
        return gameOver = true;
    }

    // if the snake is looping through it's own body (self-collison) then it will bite its own tail

    for(let i = 0; i < snakeBody.length; i++){
        html += `<div class= "head" style="grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody [0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }
    // showing all the elements, food and snake on the playground

    playBoard.innerHTML = html;
}

// initialise food position when the game starts

updateFoodPosition();

// start the game loop to update the game's state every 100ms

setIntervalID = setInterval(mainGame,100);

// listen to the key pressers to change direction

document.addEventListener("keyup",changeDirection);

