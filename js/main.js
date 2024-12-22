/**
 * Controls all aspects of the game.
 */
const GAME_SETTING = {
    gameDifficulties: [
        { cards: 6, score: 100, moveCost: 25 },
        { cards: 8, score: 240, moveCost: 40 },
        { cards: 12, score: 500, moveCost: 50 }
    ],
    cardAssets: [
        "01", "02", "03", "04", "05", "06",
        "07", "08", "09", "10", "11", "12"
    ],
    cardBackPath: "/assets/images/cards/card-back.png",
    cardFrontPath: "/assets/images/cards/",
    fadeMaxDuration: 2000,
    flipInterval: 1000,
    peakInterval: 3000
}

/**
 * Contains storage utility to get and set game data.
 */
const storage = {

    setScore(value) {
        sessionStorage.setItem("score", value);
    },

    getScore() {
        return sessionStorage.getItem("score");
    },

    clearScore() {
        sessionStorage.removeItem("score");
    },

    setHighScore(value) {

        if (this.getHighScore() >= value) return;

        localStorage.setItem("highScore", value);
    },

    getHighScore() {
        return localStorage.getItem("highScore") || 0;
    },

    clearHighScore() {
        localStorage.removeItem("highScore");
    },

    setDifficulty(value) {
        localStorage.setItem("difficulty", value);
    },

    getDifficulty() {
        return localStorage.getItem("difficulty") || 0;
    }
}

/**
 * Contains helper methods to manipulate and update HTML content.
 */
const helpers = {

    /**
     * Navigate to home page.
     */
    navToHome() {
        window.location.href = "index.html";
    },

    /**
     * Navigate to game over page.
     */
    navToGameOver() {
        window.location.href = "game-over.html";
    },

    /**
     * Update game score in DOM.
     *
     * @param score
     */
    updateScore(score) {
        const scoreDiv = document.getElementById("score");
        scoreDiv.innerText = score;
    },

    /**
     * Set the current high score in DOM.
     */
    updateHighScore() {
        const highScoreDiv = document.getElementById("high-score");
        highScoreDiv.innerText = storage.getHighScore();
    }
}
