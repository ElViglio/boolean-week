const grid = document.querySelector(".grid");
const scoreCounter = document.querySelector(".score-counter");
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again')

// matrice per grid://
const gridMatrix = [
    ['', '', '', '', '', '', '', '', ''],
    ['river', 'wood', 'wood', 'river', 'wood', 'river', 'river', 'river', 'river'],
    ['river', 'river', 'river', 'wood', 'wood', 'river', 'wood', 'wood', 'river'],
    ['', '', '', '', '', '', '', '', ''],
    ['road', 'bus', 'road', 'road', 'road', 'car', 'road', 'road', 'road'],
    ['road', 'road', 'road', 'car', 'road', 'road', 'road', 'road', 'bus'],
    ['road', 'road', 'car', 'road', 'road', 'road', 'bus', 'road', 'road'],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '']
];
//console.table(gridMatrix)

const victoryRow = 0;
const riverRows = [1, 2];
const roadRows = [4, 5, 6]
//ObJ L
const duckPosition = { y: 8, x: 4 };
let contentBeforeDuck = '';
let time = 15;

//---------------FUNZIONI------------//

//x disegno di gioco://
function drawGrid() {
    // ricordare di ripulire i contenuti precedenti x game loop corretto
    grid.innerHTML = '';
    // Per ogni riga
    gridMatrix.forEach(function (rowCells, rowIndex) {
        //Per ogni cella della riga
        rowCells.forEach(function (cellContent, cellIndex) {
            //Creo cella da mettere per ogni riga 
            const cell = document.createElement('div');
            cell.classList.add('cell');
            //Inserisco classe con lo stesso nome del contenuto della cella
            if (cellContent !== '') cell.classList.add(cellContent);
            //Inserisco background sotto contenuto della cella con classe river
            if (riverRows.includes(rowIndex)) {
                cell.classList.add('river');
            }
            //Stessa cosa per cella con classe road
            if (roadRows.includes(rowIndex)) {
                cell.classList.add('road');
            }
            // Inserisco cella in griglia
            grid.appendChild(cell);
        })
    })
}

//x start papera
function placeDuck() {
    //prima di mettere papera segno cosa c'era in cella
    contentBeforeDuck = gridMatrix[duckPosition.y][duckPosition.x];
    //Dopo ci metto la papera
    gridMatrix[duckPosition.y][duckPosition.x] = 'duck';
}
//x muovere papera
function moveDuck(event) {
    //Nella cella prima rimetto il valore originale dopo che la papera si è mossa 
    gridMatrix[duckPosition.y][duckPosition.x] = contentBeforeDuck;

    switch (event.key) {
        case 'ArrowUp':
            if (duckPosition.y > 0) duckPosition.y--;
            break;
        case 'ArrowDown':
            if (duckPosition.y < 8) duckPosition.y++;
            break;
        case 'ArrowLeft':
            if (duckPosition.x > 0) duckPosition.x--;
            break;
        case 'ArrowRight':
            if (duckPosition.x < 8) duckPosition.x++;
            break;
        //blocco la funzione ed altri tasti che premo diversi da quelli detti sopra
        // default: return;
    }
    drawElements();
}
//per disegnare ogni volta la griglia e papera
function drawElements() {
    placeDuck();
    checkDuckPosition();
    drawGrid();
    //console.table(gridMatrix);
    //console.log ('appunto:' , contentBeforeDuck);
}

//per fine gioco
function endGame(reason) {
    //console.log('fine gioco')
    if (reason === 'duck-arrived') {
        endGameScreen.classList.add('win');
        endGameText.innerHTML = "You Win";
    }
    //Blocco lo spostamento degli elementi
    clearInterval(renderingLoop);
    //Blocco time
    clearInterval(countdown);
    //Blocco tasti 
    document.removeEventListener('keyup', moveDuck)
    //Assegno classe
    gridMatrix[duckPosition.y][duckPosition.x] = reason;
    //Mostro fine gioco
    endGameScreen.classList.remove('hidden');
    //Focus su bottone try again
    playAgainButton.focus();
}

//x controllare la posizione della papera / casistiche
function checkDuckPosition() {
    // 1 caso: se vinco
    if (duckPosition.y === victoryRow) endGame('duck-arrived');
    // 2 caso: se perdo
    else if (contentBeforeDuck === 'river') endGame('duck-drowned');
    else if (contentBeforeDuck === 'bus' || contentBeforeDuck === 'car') endGame('duck-hit');
}

//x muovere bus,car ecc / una riga
function moveRow(rowIndex) {
    // recupero tutte le celle di una riga
    const rowCells = gridMatrix[rowIndex];

    // tolgo ultima cella e la metto da parte
    const lastCell = rowCells.pop();
    //la metto poi all'inizio
    rowCells.unshift(lastCell);
}

//x muovere una riga al contrario (riga wood)
function moveRowBack(rowIndex) {
    // recupero tutte le celle di una riga
    const rowCells = gridMatrix[rowIndex];
    // tolgo ultima cella e la metto da parte
    const firstCell = rowCells.shift();
    //la metto poi alla fine
    rowCells.push(firstCell);
}

//x time
function reduceTime() {
    time--;
    scoreCounter.innerText = String(time).padStart(5, 0);
    if (time === 0) endGame('time.up');
}


// -------SVOLGIMENTO GIOCO----------//
const renderingLoop = setInterval(function () {
    gridMatrix[duckPosition.y][duckPosition.x] = contentBeforeDuck;
    //Galleggiamento papera
    if (contentBeforeDuck === 'wood') {
        //Se è in prima riga e non alla fine, sposta a destra
        if (duckPosition.y === 1 && duckPosition.x < 8) duckPosition.x++;
        //Se è in ultima riga e non all'inizio, sposta a sinistra
        else if (duckPosition.y === 2 && duckPosition.x > 0) duckPosition.x--;
        contentBeforeDuck = gridMatrix[duckPosition.y][duckPosition.x];
    }
    moveRow(1);
    moveRowBack(2);
    moveRow(4);
    moveRow(5);
    moveRow(6);
    drawElements();
}, 600)
const countdown = setInterval(reduceTime, 1000);
//placeDuck();
//drawGrid();

//-------EVENTI GIOCO----------//
document.addEventListener('keyup', moveDuck)

//x bottone try again 
playAgainButton.addEventListener('click', function () {
    window.location.reload();
})




