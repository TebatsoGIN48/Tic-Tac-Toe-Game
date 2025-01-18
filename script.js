const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const LINE_COLOR = "#FFFFFF";
const X_COLOR = "#00FF00";
const O_COLOR = "#FF0000";

const cellSize = canvas.width / 3;
let board = [["", "", ""], ["", "", ""], ["", "", ""]];
let currentPlayer = "X";
let gameActive = true;

// Draw grid
function drawGrid() {
    ctx.strokeStyle = LINE_COLOR;
    ctx.lineWidth = 5;

    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(cellSize, 0);
    ctx.lineTo(cellSize, canvas.height);
    ctx.moveTo(2 * cellSize, 0);
    ctx.lineTo(2 * cellSize, canvas.height);

    // Horizontal lines
    ctx.moveTo(0, cellSize);
    ctx.lineTo(canvas.width, cellSize);
    ctx.moveTo(0, 2 * cellSize);
    ctx.lineTo(canvas.width, 2 * cellSize);
    ctx.stroke();
}

// Draw X or O
function drawMark(row, col, mark) {
    const centerX = col * cellSize + cellSize / 2;
    const centerY = row * cellSize + cellSize / 2;

    ctx.strokeStyle = mark === "X" ? X_COLOR : O_COLOR;
    ctx.lineWidth = 10;

    if (mark === "X") {
        ctx.beginPath();
        ctx.moveTo(centerX - 50, centerY - 50);
        ctx.lineTo(centerX + 50, centerY + 50);
        ctx.moveTo(centerX + 50, centerY - 50);
        ctx.lineTo(centerX - 50, centerY + 50);
        ctx.stroke();
    } else if (mark === "O") {
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

// Check for winner
function checkWinner() {
    // Rows, columns, diagonals
    const lines = [
        // Rows
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Columns
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // Diagonals
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]],
    ];

    for (const line of lines) {
        const [a, b, c] = line;
        if (
            board[a[0]][a[1]] &&
            board[a[0]][a[1]] === board[b[0]][b[1]] &&
            board[a[0]][a[1]] === board[c[0]][c[1]]
        ) {
            return board[a[0]][a[1]];
        }
    }
    return null;
}

// Check for draw
function isDraw() {
    return board.flat().every(cell => cell !== "");
}

// Handle click
canvas.addEventListener("click", (event) => {
    if (!gameActive) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (board[row][col] === "") {
        board[row][col] = currentPlayer;
        drawMark(row, col, currentPlayer);

        const winner = checkWinner();
        if (winner) {
            document.getElementById("message").textContent = `Player ${winner} wins!`;
            gameActive = false;
            document.getElementById("replayBtn").style.display = "block";
            return;
        }

        if (isDraw()) {
            document.getElementById("message").textContent = "It's a draw!";
            gameActive = false;
            document.getElementById("replayBtn").style.display = "block";
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
});

// Replay button
document.getElementById("replayBtn").addEventListener("click", () => {
    board = [["", "", ""], ["", "", ""], ["", "", ""]];
    currentPlayer = "X";
    gameActive = true;
    document.getElementById("message").textContent = "";
    document.getElementById("replayBtn").style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
});

// Initialize game
drawGrid();

// Load sound effects with relative paths
const winSound = new Audio("sounds/win.wav");
const drawSound = new Audio("sounds/draw.wav");
const tapSound = new Audio("sounds/tap.wav");

// Default sound volumes (adjustable for accessibility)
winSound.volume = 0.7;
drawSound.volume = 0.7;
tapSound.volume = 0.7;