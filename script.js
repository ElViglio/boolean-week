/* -----------------
FASE PRELIMINARE DEL GIOCO
--------------------*/
// Recupero degli elementi di interesse:

const scoreCounter = document.querySelector(".score-counter");
const grid = document.querySelector(".grid");
const endGameScreen = document.querySelector(".end-game-screen");
const endGameText = document.querySelector(".end-game-text");
const playAgainButton = document.querySelector("button");

// Informazioni utili alla logica di gioco:
const totalCells = 100;
const totalBombs = 16;
const maxScore = totalCells - totalBombs;
const bombsList = [];
let score = 0;

// Per generare le bombe in modo casuale:
while (bombsList.length < totalBombs) {
    const number = Math.floor(Math.random() * totalCells) + 1;
    if (!bombsList.includes(number)) bombsList.push(number);
}
console.log(bombsList);

// GRIGLIA E LOGICA DI GIOCO  

let isCellEven = false;
let isRowEven = false;

for (let i = 1; i <= totalCells; i++) {
    // Creo un elemento e li do classe cella:
    const cella = document.createElement('div');
    cella.classList.add('cella');
    //cella.innerText = i;

    isCellEven = i % 2 === 0;

    if (isRowEven && isCellEven) cella.classList.add('cella-dark');
    else if (!isRowEven && !isCellEven) cella.classList.add('cella-dark');

    //Quando fine della riga:
    if (i % 10 === 0) isRowEven = !isRowEven;

    // CLICK DELLA CELLA:
    cella.addEventListener('click', function () {
        // console.log('cliccata la cella', i)
        // Controllo cella cliccata:
        if (cella.classList.contains('cella-clicked')) return;

        if (bombsList.includes(i)) {
            cella.classList.add('cella-bomb');
            endGame(false);
        } else {
            cella.classList.add('cella-clicked');
            updateScore();
        }
    });

    // Metto in griglia:
    grid.appendChild(cella);
}

/* -------------------
FUNZIONI DEL GIOCO
----------------------*/
function updateScore() {
    score++;
    scoreCounter.innerText = String(score).padStart(5, 0);
    if (score === maxScore) endGame(true);
}
function endGame(isVictory) {
    if (isVictory === true) {
        endGameScreen.classList.add('win');
        endGameText.innerText = "YOU WIN";
    } else {
        revealAllBombs();
    }
    endGameScreen.classList.remove('hidden');
}

//BONUS
function revealAllBombs() {
    const cella = document.querySelectorAll('.cella');
    for (let i = 1; i <= cella.length; i++) {
        if (bombsList.includes(i)) {
            const cellToReveal = cella[i - 1];
            cellToReveal.classList.add('cella-bomb');
        }
    }
}


// CLICK DEL TRY AGAIN:
playAgainButton.addEventListener('click', function () {
    location.reload();
})

