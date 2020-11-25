const SelectMode = (() => {

    let form = document.querySelector('.form'); 
    let gameContainer = document.querySelector('.game-container');
    let selectModeDiv = document.querySelector('.select-mode');
    selectModeDiv.style.display = 'block'
    form.style.display = 'none';
    gameContainer.style.display = 'none';

    let singlePlayerBtn = document.querySelector('.single-player-btn');
    let multiPlayerBtn = document.querySelector('.multi-player-btn');
    

    singlePlayerBtn.addEventListener('click', function() {
        Module('singlePlayer');
    })
    
    multiPlayerBtn.addEventListener('click',function() {
        Module('multiPlayer');
    })

})();



const Module = ((mode) => {

    let cellElements = document.querySelectorAll('.cell');
    let boardContainer = document.querySelector('.board-container');


    console.log(mode);
    
    let form = document.querySelector('.form'); 
    form.style.display = 'block';

    if (mode === 'singlePlayer') {
        let player2InputField = document.querySelector('.player2-input-field');
        player2InputField.style.display = 'none'
    } else if (mode = 'multiPlayer') {
        let player2InputField = document.querySelector('.player2-input-field');
        player2InputField.style.display = 'block'
    }

    let gameContainer = document.querySelector('.game-container');
    gameContainer.style.display = 'none'

    let statusDisplay = document.querySelector('.game-status');

    let gameActive = false;

    let playerArr = {};

    
    let currentPlayer, currentSymbol;

    let boardArray = (function() {
        let arr = [];
        for (let i = 0; i < 9; i++) {
            arr.push("");
        }
        return arr;
    })();

    console.log(boardArray)

    const winningMessage = () => `${currentPlayer} is the winner!`;
    const drawMessage = () => `It's a tie.`;
    const currentPlayerTurn = () => `${currentPlayer}'s turn`;

    // statusDisplay.innerHTML = currentPlayerTurn();

    const handleCellPlayed = (boardArray) => {
        
        handleCheckResult(boardArray) 
        // handlePlayerChange();

        if(gameActive === true) {
            
            if (mode === 'multiPlayer') {
                handlePlayerChange();
            } else {
                handlePlayerChange();
                handleCpuMove();
            }
        }
    }

    const handlePlayerChange = () => {
        if (gameActive === true) {    
            if (currentSymbol === playerArr.player1Symbol) {
                currentSymbol = playerArr.player2Symbol;
                currentPlayer = playerArr.player2
                boardContainer.classList.remove('x');
                boardContainer.classList.add('circle');
            } else {
                currentSymbol = playerArr.player1Symbol;
                currentPlayer = playerArr.player1
                boardContainer.classList.remove('circle')
                boardContainer.classList.add('x');
            } 
            statusDisplay.innerHTML = currentPlayerTurn();
        }
        
    }

    const handleCpuMove = () => {

        let generateRandomIndex = function() {
            return Math.floor(Math.random() * Math.floor(9))
        }

        let randomIndex = generateRandomIndex();

        do  {
            randomIndex = generateRandomIndex();
        } while (boardArray[randomIndex] != '')

        boardArray[randomIndex] = currentSymbol;

        let cell = document.querySelector(`[data-cell-index = "${randomIndex}"]`);

        if (currentSymbol === 'X') {
            cell.classList.add('x');
        } else {
            cell.classList.add('circle')
        }

        handleCheckResult(boardArray);

        if (gameActive === true) {
            handlePlayerChange();
        }
    }

    const handleCheckResult = (boardArray) => {
            
        let winningCombinations = [[0,1,2],[3,4,5],[6,7,8],
                                [0,3,6],[1,4,7],[2,5,8],
                                [0,4,8],[2,4,6]];

        let player1Selections = [];
        let player2Selections = [];

        for (let i = 0; i < boardArray.length; i++){
            if (boardArray[i] === playerArr.player1Symbol) {
                player1Selections.push(i);
            } else if (boardArray[i] === playerArr.player2Symbol) {
                player2Selections.push(i);
            }
        }    

        for (let i = 0; i < winningCombinations.length; i++) {
            if (winningCombinations[i].every(index => player1Selections.includes(index))) {
                statusDisplay.innerHTML = winningMessage();
                gameActive = false;
                return;
            } else if (winningCombinations[i].every(index => player2Selections.includes(index))) {
                statusDisplay.innerHTML = winningMessage();
                gameActive = false;
                return;
            }
        }

        if (!boardArray.includes('')) {
            statusDisplay.innerHTML = drawMessage();
            gameActive = false;
            return
        }
    }

    const handleCellClick = (e) => {
        e.preventDefault();
        let cellIndex = parseInt(e.target.getAttribute('data-cell-index'));

        if (gameActive === true && boardArray[cellIndex] === '') {
            boardArray[cellIndex] = currentSymbol;
            let cell = document.querySelector(`[data-cell-index = "${cellIndex}"]`);

            if (currentSymbol === 'X') {
                cell.classList.add('x');
            } else {
                cell.classList.add('circle')
            }
            handleCellPlayed(boardArray);
        }  
        
        
    }

    const handleRestart = () => {
        let cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.innerHTML = '')
        
        for (let i = 0; i < boardArray.length; i++) {
            boardArray[i] = '';
        }

        gameActive = true;

        if (currentPlayer === playerArr.player2) {
            handlePlayerChange();
        }
        statusDisplay.innerHTML = currentPlayerTurn();
    }

    const handleChangeMode = () => {
        // let cells = document.querySelectorAll('.cell');
        // cells.forEach(cell => cell.innerHTML = '')

        // // for (let i = 0; i < boardArray.length; i++) {
        // //     boardArray[i] = '';
        // // }

        // delete playerArr;
        // delete boardArray;

        // // gameActive = false;

        // form.elements.player1.value = '';
        // form.elements.player2.value = '';

        // SelectMode();

        location.reload();
    }

    const handlePlayerInput = (e) => {
        e.preventDefault();
        form.style.display = 'none'
        let selectModeDiv = document.querySelector('.select-mode');
        selectModeDiv.style.display = 'none'
        playerArr.player1 = form.elements.player1.value;
        if (mode === 'multiPlayer') {
            playerArr.player2 = form.elements.player2.value;
        } else {
            playerArr.player2 = 'CPU';
        }
        playerArr.player1Symbol = 'X';
        playerArr.player2Symbol = 'O';
        gameContainer.style.display = 'block';
        gameActive = true;
        currentPlayer = playerArr.player1;
        currentSymbol = playerArr.player1Symbol;
        boardContainer.classList.add('x');
        statusDisplay.innerHTML = currentPlayerTurn();
    }

    cellElements.forEach(cell => cell.addEventListener('click',handleCellClick));
    document.querySelector('.restart-button').addEventListener('click',handleRestart);
    document.querySelector('.start-game').addEventListener('click',handlePlayerInput);
    document.querySelector('.mode-change-btn').addEventListener('click', handleChangeMode);
});

// SelectMode();




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////