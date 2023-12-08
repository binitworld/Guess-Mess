document.addEventListener("DOMContentLoaded", function () {
    const maxAttempts = 6;
    let attempts = 0;
    let guessedLetters = [];
    let wordToGuess = "";

    async function chooseRandomWord() {
        try {
            const response = await fetch('http://localhost:3000/fetchWord');
            const data = await response.json();
            console.log("data", data);
            if (response.ok) {
                return data;
            } else {
                console.error('Error fetching word:', data.error);
                return "default"; 
            }
        } catch (error) {
            console.error('Error fetching word:', error);
            return "default"; 
        }
    }

    function displayWord() {
        let display = "";
        for (let letter of wordToGuess.name.toLowerCase()) {
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
        if (!displayWord().includes("_")) {
            const celebrationPopup = document.getElementById("celebration-popup");
            celebrationPopup.style.display = "block";
    
            document.getElementById("guess-input").disabled = true;
            document.getElementById("guess-button").disabled = true;
    
            const winningAudio = document.getElementById("winning-audio");
            winningAudio.play();
        } else if (attempts >= maxAttempts) {
            document.getElementById("message").textContent = "You ran out of attempts. The word was: " + wordToGuess.name.toLowerCase();
            document.getElementById("guess-input").disabled = true;
            document.getElementById("guess-button").disabled = true;
        }
    }

    async function resetGame() {
        wordToGuess = await chooseRandomWord();
        attempts = 0;
        guessedLetters = [];
        document.getElementById("hangman-image").innerHTML = "<img src= '"+ wordToGuess.imagePath +"' alt='Invalid Image'>";
        document.getElementById("guess-input").disabled = false;
        document.getElementById("guess-button").disabled = false;
        updateDisplay();
    }


    document.getElementById("guess-button").addEventListener("click", function () {
        const guessInput = document.getElementById("guess-input");
        const guess = guessInput.value.toLowerCase();
        console.log("guess",guess);
        if (!guessedLetters.includes(guess)) {
        guessedLetters.push(guess);
    
        if (!wordToGuess.name.toLowerCase().includes(guess)) {
            attempts++;
            document.getElementById("hangman-image").innerHTML = "<img src= '" + wordToGuess.imagePath+ "' alt='Invalid Image'>";
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
