#include <iostream>
#include <string>
#include <vector>
#include <ctime>
#include <cstdlib>
#include <algorithm> // Include the <algorithm> header for std::find

using namespace std;

// Function to choose a random word from a list
string chooseRandomWord() {
    vector<string> words = {"apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon"};
    int randomIndex = rand() % words.size();
    return words[randomIndex];
}

// Function to display the current state of the word with underscores for unrevealed letters
string displayWord(const string& word, const vector<char>& guessedLetters) {
    string display;
    for (char letter : word) {
        if (find(guessedLetters.begin(), guessedLetters.end(), letter) != guessedLetters.end()) {
            display += letter;
        } else {
            display += '_';
        }
    }
    return display;
}

int main() {
    srand(static_cast<unsigned int>(time(nullptr))); // Seed the random number generator

    string wordToGuess = chooseRandomWord();
    const int maxAttempts = 6;
    int attempts = 0;
    vector<char> guessedLetters;

    cout << "Welcome to Hangman!" << endl;

    while (attempts < maxAttempts) {
        cout << "Word: " << displayWord(wordToGuess, guessedLetters) << endl;
        cout << "Attempts left: " << maxAttempts - attempts << endl;
        cout << "Guessed letters: ";
        for (char letter : guessedLetters) {
            cout << letter << " ";
        }
        cout << endl;

        char guess;
        cout << "Guess a letter: ";
        cin >> guess;

        if (find(guessedLetters.begin(), guessedLetters.end(), guess) != guessedLetters.end()) {
            cout << "You already guessed that letter." << endl;
            continue;
        }

        guessedLetters.push_back(guess);

        if (wordToGuess.find(guess) != string::npos) {
            cout << "Correct guess!" << endl;
        } else {
            cout << "Incorrect guess." << endl;
            attempts++;
        }

        string currentDisplay = displayWord(wordToGuess, guessedLetters);
        if (currentDisplay == wordToGuess) {
            cout << "Congratulations! You guessed the word: " << wordToGuess << endl;
            break;
        }
    }

    if (attempts >= maxAttempts) {
        cout << "You ran out of attempts. The word was: " << wordToGuess << endl;
    }

    return 0;
}