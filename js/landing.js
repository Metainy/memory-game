initDifficulty();
helpers.updateHighScore();

/**
 * Click handler for difficulty buttons.
 */
function difficultyHandler() {
    storage.setDifficulty(event.target.value);
}

/**
 * Click handler for reset score button.
 */
function resetScoreHandler() {
    storage.clearHighScore();
    helpers.updateHighScore();
}

/**
 * Read the saved difficulty if it exists and set the buttons accordingly.
 */
function initDifficulty() {
    const selectedDifficulty = storage.getDifficulty();

    const radioButton = document.querySelector(`input[name="difficulty"][value="${selectedDifficulty}"]`);
    radioButton.checked = true;
}
