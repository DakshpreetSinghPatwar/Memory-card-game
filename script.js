const emojis = [
    "🍎",
    "🍌",
    "🍇",
    "🍉",
    "🍓",
    "🍒",
    "🥝",
    "🍍",
    "🥭",
    "🍑",
    "🍋",
    "🥥"
];

const difficulties = {
    easy: {
        pairs: 4,
        time: 60
    },

    medium: {
        pairs: 8,
        time: 90
    },

    hard: {
        pairs: 12,
        time: 120
    }
};

let currentDifficulty = "medium";

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timeLeft = 90;
let timerInterval;
let gameStarted = false;


// Start the game
function startGame(difficulty = "medium") {

    currentDifficulty = difficulty;

    clearInterval(timerInterval);

    const settings = difficulties[difficulty];

    matchedPairs = 0;
    moves = 0;
    timeLeft = settings.time;

    flippedCards = [];
    gameStarted = false;

    updateInfo();

    createBoard();

    updateDifficultyButtons();
}


// Create cards
function createBoard() {

    const board = document.getElementById("game-board");

    board.innerHTML = "";

    const pairEmojis = emojis.slice(
        0,
        difficulties[currentDifficulty].pairs
    );

    cards = [...pairEmojis, ...pairEmojis];

    shuffle(cards);

    cards.forEach((emoji, index) => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.dataset.emoji = emoji;

        card.innerHTML = `
            <div class="card-inner">

                <div class="card-front">
                    ?
                </div>

                <div class="card-back">
                    ${emoji}
                </div>

            </div>
        `;

        card.addEventListener("click", () => flipCard(card));

        board.appendChild(card);
    });

    updateGrid();
}


// Shuffle cards
function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
}


// Flip card
function flipCard(card) {

    if (
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) {
        return;
    }

    if (flippedCards.length === 2) {
        return;
    }

    if (!gameStarted) {

        gameStarted = true;

        startTimer();
    }

    card.classList.add("flipped");

    flippedCards.push(card);

    if (flippedCards.length === 2) {

        moves++;

        updateInfo();

        checkMatch();
    }
}


// Check matching cards
function checkMatch() {

    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {

        card1.classList.add("matched");

        card2.classList.add("matched");

        matchedPairs++;

        flippedCards = [];

        updateInfo();

        if (
            matchedPairs ===
            difficulties[currentDifficulty].pairs
        ) {

            clearInterval(timerInterval);

            setTimeout(() => {

                alert(
                    `🎉 You won!\n\n` +
                    `Moves: ${moves}\n` +
                    `Time left: ${timeLeft} seconds`
                );

            }, 300);
        }

    } else {

        setTimeout(() => {

            card1.classList.remove("flipped");

            card2.classList.remove("flipped");

            flippedCards = [];

        }, 800);
    }
}


// Timer
function startTimer() {

    timerInterval = setInterval(() => {

        timeLeft--;

        updateInfo();

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            gameOver();
        }

    }, 1000);
}


// Game over
function gameOver() {

    const board = document.getElementById("game-board");

    const cardsOnBoard =
        board.querySelectorAll(".card");

    cardsOnBoard.forEach(card => {

        card.style.pointerEvents = "none";
    });

    setTimeout(() => {

        alert(
            "⏰ Time's up!\n\n" +
            "Try again and match all the pairs."
        );

    }, 300);
}


// Update information
function updateInfo() {

    document.getElementById("timer").textContent =
        timeLeft;

    document.getElementById("moves").textContent =
        moves;

    document.getElementById("pairs").textContent =
        `${matchedPairs} / ${
            difficulties[currentDifficulty].pairs
        }`;
}


// Update difficulty buttons
function updateDifficultyButtons() {

    const buttons =
        document.querySelectorAll(".difficulty button");

    buttons.forEach(button => {

        button.classList.remove("active");

        if (
            button.textContent.toLowerCase() ===
            currentDifficulty
        ) {

            button.classList.add("active");
        }
    });
}


// Change grid size
function updateGrid() {

    const board =
        document.getElementById("game-board");

    const pairs =
        difficulties[currentDifficulty].pairs;

    if (pairs === 4) {

        board.style.gridTemplateColumns =
            "repeat(4, 1fr)";

    } else if (pairs === 8) {

        board.style.gridTemplateColumns =
            "repeat(4, 1fr)";

    } else {

        board.style.gridTemplateColumns =
            "repeat(6, 1fr)";
    }
}


// Start game when page loads
startGame("medium");