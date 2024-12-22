const score = storage.getScore();

if (score === null) {
    helpers.navToHome();
} else {
    // Set game over message
    updateGameMessage(score);

    // Set latest score
    helpers.updateScore(score);

    // Remove the score entry to prevent invalid message when the page is visited manually
    storage.clearScore();

    // Set highest score
    helpers.updateHighScore();
}

/**
 * Display a status message when the game is over based on score.
 *
 * @param score
 */
function updateGameMessage(score) {
    const messageDiv = document.getElementById("message");
    messageDiv.innerText = score > 0 ? "Good game!" : "Better luck next time.";
}
