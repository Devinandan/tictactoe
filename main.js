// Gameboard Module (IIFE)
const Gameboard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
    const getBoard = () => board;
    const updateCell = (index, marker) => {
        if (board[index] === "") board[index] = marker;
    };
    const resetBoard = () => board.fill("");
    return { getBoard, updateCell, resetBoard };
})();

// Player Factory
const Player = (name, marker) => {
    return { name, marker };
};

// Game Controller Module
const GameController = (() => {
    let player1, player2, currentPlayer;
    let gameOver = false;

    const initializeGame = (name1 = "Player 1", name2 = "Player 2") => {
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        currentPlayer = player1;
        gameOver = false;
        Gameboard.resetBoard();
        DisplayController.updateGameboard();
        DisplayController.updateStatus(`${currentPlayer.name}'s turn`);
    };

    const playTurn = (index) => {
        if (gameOver || Gameboard.getBoard()[index] !== "") return;

        Gameboard.updateCell(index, currentPlayer.marker);
        if (checkWin()) {
            gameOver = true;
            DisplayController.updateStatus(`${currentPlayer.name} wins!`);
        } else if (checkTie()) {
            gameOver = true;
            DisplayController.updateStatus("It's a tie!");
        } else {
            currentPlayer = currentPlayer === player1 ? player2 : player1;
            DisplayController.updateStatus(`${currentPlayer.name}'s turn`);
        }
        DisplayController.updateGameboard();
    };

    const checkWin = () => {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        return winConditions.some(condition =>
            condition.every(index => Gameboard.getBoard()[index] === currentPlayer.marker)
        );
    };

    const checkTie = () => Gameboard.getBoard().every(cell => cell !== "");

    return { initializeGame, playTurn };
})();

// Display Controller Module
const DisplayController = (() => {
    const gameboardDiv = document.getElementById("gameboard");
    const statusDiv = document.getElementById("status");
    const restartButton = document.getElementById("restart");

    const updateGameboard = () => {
        gameboardDiv.innerHTML = "";
        Gameboard.getBoard().forEach((cell, index) => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            cellDiv.textContent = cell;
            cellDiv.addEventListener("click", () => GameController.playTurn(index));
            gameboardDiv.appendChild(cellDiv);
        });
    };

    const updateStatus = (message) => {
        statusDiv.textContent = message;
    };

    restartButton.addEventListener("click", () => GameController.initializeGame());

    return { updateGameboard, updateStatus };
})();

// Initialize the game
GameController.initializeGame();





