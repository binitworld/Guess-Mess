document.addEventListener("DOMContentLoaded", function () {
    const words = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon"];
    let wordToGuess = "";
    const maxAttempts = 6;
    let attempts = 0;
    let guessedLetters = [];

    function chooseRandomWord() {
        return words[Math.floor(Math.random() * words.length)];
    }

    function displayWord() {
        let display = "";
        for (let letter of wordToGuess) {
            if (guessedLetters.includes(letter)) {
                display += letter;
            } else {
                display += "_";
            }
        }
        return display;
    }

    function updateDisplay() {
        document.getElementById("word-display").textContent = displayWord();
        document.getElementById("guesses").textContent = "Guessed letters: " + guessedLetters.join(", ");
        document.getElementById("message").textContent = "";
    }

    function checkWin() {
        if (displayWord() === wordToGuess) {
            document.getElementById("message").textContent = "Congratulations! You guessed the word: " + wordToGuess;
            document.getElementById("guess-input").disabled = true;
            document.getElementById("guess-button").disabled = true;
        } else if (attempts >= maxAttempts) {
            document.getElementById("message").textContent = "You ran out of attempts. The word was: " + wordToGuess;
            document.getElementById("guess-input").disabled = true;
            document.getElementById("guess-button").disabled = true;
        }
    }

    function resetGame() {
        wordToGuess = chooseRandomWord();
        attempts = 0;
        guessedLetters = [];
        document.getElementById("hangman-image").innerHTML = "<img src='hangman0.png' alt='Hangman'>";
        document.getElementById("guess-input").disabled = false;
        document.getElementById("guess-button").disabled = false;
        updateDisplay();
    }

    document.getElementById("guess-button").addEventListener("click", function () {
        const guessInput = document.getElementById("guess-input");
        const guess = guessInput.value.toLowerCase();

        if (!guessedLetters.includes(guess)) {
            guessedLetters.push(guess);

            if (!wordToGuess.includes(guess)) {
                attempts++;
                document.getElementById("hangman-image").innerHTML = "<img src='hangman" + attempts + ".png' alt='Hangman'>";
            }

            updateDisplay();
            checkWin();
        } else {
            document.getElementById("message").textContent = "You already guessed that letter.";
        }

        guessInput.value = "";
    });

    resetGame(); // Start a new game when the page loads

    document.getElementById("new-game-button").addEventListener("click", resetGame);
});
