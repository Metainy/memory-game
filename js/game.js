let isGameReady = false;
let difficulty = null;
let score = null;
let visibleCards = [];
let matchedCards = [];

/**
 * Avoiding loading from cache issues.
 */
window.addEventListener("pageshow", (event) => {
    if (event.persisted) initGame();
});

// Start the game
initGame();

/**
 * Click handler for restart button.
 */
function restartHandler() {
    initGame();
}

/**
 * Start the game with a certain difficulty.
 */
function initGame() {

    // Get game difficulty
    const storedDifficulty = storage.getDifficulty();
    difficulty = GAME_SETTING.gameDifficulties[storedDifficulty];

    // Reset records
    isGameReady = false;
    visibleCards = [];
    matchedCards = [];

    // Set initial score based on difficulty
    score = difficulty.score
    helpers.updateScore(score);

    // Generate cards based on difficulty
    generateCards(difficulty.cards);
}

/**
 * Generate and display cards based on the game difficulty.
 *
 * @param {number} cardsCount
 */
function generateCards(cardsCount) {

    // Get a number of cards based on the difficulty
    const cards = GAME_SETTING.cardAssets.slice(0, cardsCount);

    // Create pairs and randomize the order
    const cardPairs = randomizeCards([...cards, ...cards]);

    // Parent card grid
    const cardGrid = document.getElementById("card-grid");
    cardGrid.innerHTML = "";

    // Add cards to the grid
    cardPairs.forEach((card, index) => {

        const cardDiv = document.createElement("div");
        cardDiv.classList.add("cell", "card-container", "nes-pointer");
        cardDiv.setAttribute("data-value", card);
        cardDiv.style.animationDelay = `${index * (GAME_SETTING.fadeMaxDuration / 1000 / cardPairs.length)}s`;

        cardDiv.innerHTML = `
            <div class="card-content">
                <div class="card-back">
                    <img src="${GAME_SETTING.cardBackPath}" alt="Card Back">
                </div>

                <div class="card-front">
                    <img src="${GAME_SETTING.cardFrontPath}${card}.png" alt="Card Front">
                </div>
            </div>
        `;

        cardDiv.addEventListener("click", () => cardClickHandler(cardDiv));

        cardGrid.appendChild(cardDiv);
    });

    // Show card fronts when listing animation is completed
    setTimeout(() => flipAllToggle(), GAME_SETTING.fadeMaxDuration);

    // Flip cards on back and mark the game as ready
    setTimeout(() => {
        flipAllToggle();
        isGameReady = true;
    }, GAME_SETTING.fadeMaxDuration + GAME_SETTING.peakInterval)
}

/**
 * Toggle card faces.
 */
function flipAllToggle() {

    const innerElements = document.querySelectorAll(".card-content");
    innerElements.forEach((card) => {
        card.style.transform = card.style.transform === "rotateY(180deg)" ? "rotateY(0deg)" : "rotateY(180deg)";
    });
}

/**
 * Randomize the cards and return a new random set.
 *
 * @param {array} array
 */
function randomizeCards(array) {
    return [...array].sort(() => 0.5 - Math.random());
}

/**
 * Handle click on a given card.
 *
 * @param {Element} card
 */
function cardClickHandler(card) {

    /*
     Don't start if game is not ready.
     Don't show any cards if 2 cards are visible, wait for timeout to clear them first.
     Skip cards that already marked as matched.
     Avoid registering the same card as a match if the card is clicked twice.
     */
    if (!isGameReady || visibleCards.length === 2 || matchedCards.includes(card) || visibleCards.includes(card)) return;

    flipToFront(card);

    // Keep a record of flipped cards
    visibleCards.push(card);

    if (visibleCards.length === 2) checkPairs();
}

/**
 * Flips a single card to the front side.
 *
 * @param {HTMLElement} cardDiv
 */
function flipToFront(cardDiv) {
    const cardContent = cardDiv.querySelector(".card-content");
    cardContent.style.transform = "rotateY(180deg)";
}

/**
 * Flips a single card to the back side.
 *
 * @param {HTMLElement} cardDiv
 */
function flipToBack(cardDiv) {
    const cardContent = cardDiv.querySelector(".card-content");
    cardContent.style.transform = "rotateY(0deg)";
}

/**
 * Check if 2 cards are a match and check game status for a win or lose.
 */
function checkPairs() {

    const [cardOne, cardTwo] = visibleCards;
    const cardOneValue = cardOne.getAttribute("data-value");
    const cardTwoValue = cardTwo.getAttribute("data-value");

    // Save matched cards and remove them from visible cards
    if (cardOneValue === cardTwoValue) {

        matchedCards.push(cardOne, cardTwo);
        visibleCards = [];
    } else {

        // Update score
        score -= difficulty.moveCost;
        helpers.updateScore(score);

        setTimeout(() => {
            flipToBack(cardOne);
            flipToBack(cardTwo);

            visibleCards = [];
        }, GAME_SETTING.flipInterval);
    }

    checkGameStatus();
}

/**
 * Check if a game is over by winning or losing, save the last scores and redirect.
 */
function checkGameStatus() {

    if (score <= 0 || (matchedCards.length / 2) === difficulty.cards) {

        storage.setScore(score);
        storage.setHighScore(score);

        setTimeout(() => helpers.navToGameOver(), 800);
    }
}
