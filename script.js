document.addEventListener("DOMContentLoaded", function () {
    const words = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon"];
    let wordToGuess = "";
    const maxAttempts = 6;
    let attempts = 0;
    let index = 0;
    let guessedLetters = [];

    function chooseRandomWord() {
       // index=0;
        index = Math.floor(Math.random() * words.length);
        return words[index];
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
        const wordDisplay = document.getElementById("word-display");
        wordDisplay.innerHTML = "";

        for (let letter of displayWord()) {
            const letterBox = document.createElement("span");
            letterBox.className = "letter-box";
            letterBox.textContent = letter;
            wordDisplay.appendChild(letterBox);
        }

        const guessedLettersDisplay = document.getElementById("guessed-letters");
        guessedLettersDisplay.innerHTML = "";

        for (let letter of guessedLetters) {
            const guessedLetterBox = document.createElement("div");
            guessedLetterBox.className = "guessed-letter-box";
            guessedLetterBox.textContent = letter.toUpperCase();
            guessedLettersDisplay.appendChild(guessedLetterBox);
        }

        document.getElementById("guesses").textContent = "Guessed letters: " + guessedLetters.join(", ");
        document.getElementById("message").textContent = "";
    }

    function checkWin() {
        if (displayWord() === wordToGuess) {
            const celebrationPopup = document.getElementById("celebration-popup");
            celebrationPopup.style.display = "block";

            document.getElementById("guess-input").disabled = true;
            document.getElementById("guess-button").disabled = true;

            const winningAudio = document.getElementById("winning-audio");
            winningAudio.play();
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
        document.getElementById("hangman-image").innerHTML = "<img src= 'img/"+ words[index]+".png' alt='Invalid Image'>";
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
                document.getElementById("hangman-image").innerHTML = "<img src= 'img/"+ words[index]+".png' alt='Invalid Image'>";
            }

            updateDisplay();
            checkWin();
        } else {
            document.getElementById("message").textContent = "You already guessed that letter.";
        }

        guessInput.value = "";
    });

    resetGame();

    document.getElementById("new-game-button").addEventListener("click", function () {
        document.getElementById("celebration-popup").style.display = "none";
        document.getElementById("guess-input").disabled = false;
        document.getElementById("guess-button").disabled = false;
        resetGame();
    });
});
