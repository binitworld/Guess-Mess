#include <iostream>
#include <vector>
#include <ctime>
#include <cstdlib>
#include <algorithm>
#include <bsoncxx/builder/stream/document.hpp>
#include <bsoncxx/json.hpp>
#include <mongocxx/client.hpp>
#include <mongocxx/instance.hpp>
#include <mongocxx/uri.hpp>

using namespace std;
using bsoncxx::builder::stream::document;
using bsoncxx::builder::stream::finalize;


mongocxx::uri mongodb_uri("mongodb+srv://admin:admin@cluster0.xstrq1b.mongodb.net/guessmess?retryWrites=true&w=majority"); 
mongocxx::client mongodb_client(mongodb_uri);
mongocxx::database mongodb_db = mongodb_client["gessmess"];
mongocxx::collection mongodb_collection = mongodb_db["genere"];


string chooseRandomWord() {
    auto cursor = mongodb_collection.find({});
    vector<string> words;

    for (auto&& doc : cursor) {
        words.push_back(doc["name"].get_utf8().value.to_string());
    }

    int randomIndex = rand() % words.size();
    return words[randomIndex];
}

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
    srand(static_cast<unsigned int>(time(nullptr))); 

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
