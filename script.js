const grid = document.querySelector(".grid");
const StackButton = document.querySelector(".stack");
const scoreCounter = document.querySelector(".score-counter");

const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again')

const gridMatrix = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0],
]
//console.table(gridMatrix);

let currentRowIndex = gridMatrix.length - 1;
let barDirection = 'right';
let barSize = 3;
let time;
let isGameOver = false;
let score = 0;

//FUNZIONE PER DRAW:
function draw() {
    grid.innerHTML = '';

    gridMatrix.forEach(function (rowContent, rowIndex) {
        rowContent.forEach(function (cellContent, cellIndex) {
            const cell = document.createElement('div');
            cell.classList.add('cella');
            //cell.innerText = cellIndex;

            const isRowEven = rowIndex % 2 === 0;
            const isCellEven = cellIndex % 2 === 0;
            if ((isRowEven && isCellEven) || (!isRowEven && !isCellEven)) {
                cell.classList.add('cella-dark');
            }
            if (cellContent === 1) {
                cell.classList.add('cella-bar');
            }

            grid.appendChild(cell);
        })
    })
}

function moveRight(row) {
    row.pop();
    row.unshift(0);
}

function moveLeft(row) {
    row.shift();
    row.push(0);
}


function isRightEdge(row) {
    const lastElement = row[row.length - 1];
    return lastElement === 1;
}
function isLeftEdge(row) {
    const firstElement = row[0];
    return firstElement === 1;
}

function moveBar() {
    const currentRow = gridMatrix[currentRowIndex];

    if (barDirection === 'right') {
        moveRight(currentRow);
        if (isRightEdge(currentRow)) {
            barDirection = 'left';
        }
    } else if (barDirection === 'left') {
        moveLeft(currentRow);
        if (isLeftEdge(currentRow)) {
            barDirection = 'right';
        }
    }
}
draw();


function checkLose() {
    const currentRow = gridMatrix[currentRowIndex];
    const preRow = gridMatrix[currentRowIndex + 1];

    if (!preRow) return;

    for (let i = 0; i < currentRow.length; i++) {
        if (currentRow[i] === 1 && preRow[i] === 0) {
            currentRow[i] = 0;
            barSize--;
        }
    }
    if (barSize === 0) {
        isGameOver = true;
        clearInterval(time);
        //window.alert('you lose!');
        endGame(false);
    }
}

function checkWin() {
    if (currentRowIndex === 0) {
        isGameOver = true;
        clearInterval(time);
        //window.alert('you win!');
        endGame(true);
    }
}

function OnStack() {
    //check lose
    checkLose();
    //check win
    checkWin();
    // score
    updateScore();

    if (isGameOver) return;

    // change row
    currentRowIndex = currentRowIndex - 1;
    barDirection = 'right';
    for (let i = 0; i < barSize; i++) {
        gridMatrix[currentRowIndex][i] = 1;
    }
    //draw();
}

function updateScore() {
    //score++;
    //scoreCounter.innerText = score.toString().padStart(5, '0');

    //total score
    const finalBlock = document.querySelectorAll('.cella-bar');
    scoreCounter.innerText = finalBlock.length.toString().padStart(5, '0');
}

function endGame(isVictory) {
    if (isVictory) {
        endGameText.innerHTML = "You Win!";
        endGameScreen.classList.add('win');
    }
    endGameScreen.classList.remove('hidden');
}

function main() {
    moveBar();
    draw();
}

StackButton.addEventListener('click', OnStack);
playAgainButton.addEventListener('click', function () {
    location.reload();
});

time = setInterval(main, 600);