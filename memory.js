
// Starts the Memory game. The eventhandler is on the mapped SVG, on the #memory element.
// Defines global variable itemChoice. If the player said "yes" to taking the orb, the player
// has a choice to change the face of one of the cards.

var itemChoice;
console.log("My page: " + itemChoice);

function startMemoryGame() {

    var answer;

// Depending on what the player chooses (yes or no), the face of one card changes depending
// on what they choose in the following function.
    if (itemChoice == "yes") {
        while (answer != "rose" && answer != "skull" && answer != "dragon") {
            var answer = prompt("You come across dusty old cards. One of them is blank. Which image should it have? (Choose: skull, rose, dragon)");
            console.log(answer)
        }
// If the player chose a skull or a rose or a dragon, one of the cards changes via the following
// if statement.
        if (answer == "skull") {
            document.getElementById('wildskull').style.display = "block";
        } else if (answer == "rose") {
            document.getElementById('wildrose').style.display = "block";
        } else if (answer == "dragon") {
            document.getElementById('wilddragon').style.display = "block";
        }
     }
// The game loads.
    document.getElementById('game').style.display = "flex";
    document.getElementById('fade').style.display = "block";
    document.getElementById('wildrose').style.display = "block";

};

// Selects the cards and sets the default states for cards and board.

const cards = document.querySelectorAll('.card');

let flippedCard = false;
let locked = false;
let cardOne, cardTwo;

// Handles flipping a card and invokes the checkForMatch function.

function flipCard() {

    if (locked) return;
    if (this === cardOne) return;

    this.classList.add('flip');

    if (!flippedCard) {
        flippedCard = true;
        cardOne = this;
        return;
    }

    cardTwo = this;
    locked = true;

    checkForMatch();
}

// If the cards are NOT a match, invokes unflipCards function.
// If they ARE a match, invokes disableCards function.
// Each time cards are flipped, the complete function is invoked to see if all matches have been made.
// This counts as a player move and all player moves are recorded.

var playerMoves = 0;

function checkForMatch() {

    let isMatch = cardOne.dataset.name === cardTwo.dataset.name;

    if (isMatch == true) {
        disableCards();
        playerCount();
    } else {
        unflipCards();
        playerCount();
    }
    completeGame();
}

// Removes events listeners on matched cards and adds a class called 'match'.
// ('Match' is used by the complete function to see if all matches have been made.)
// The board then resets.

function disableCards() {
    cardOne.removeEventListener('click', flipCard);
    cardTwo.removeEventListener('click', flipCard);

    cardOne.classList.add('match');
    cardTwo.classList.add('match');

    resetBoard();
}

// The cards are unflipped, classes are removed and the resetBoard function is invoked.

function unflipCards() {
    setTimeout(() => {
        cardOne.classList.remove('flip');
        cardTwo.classList.remove('flip');

        resetBoard();
    }, 1500);
}

// Resets the board.

function resetBoard() {
    flippedCard = false;
    locked = false;
    cardOne = null;
    cardTwo = null;
}

// Shuffles the cards at the start of the game.

(function shuffle() {
    cards.forEach(card => {
        let ramdomPos = Math.ceil(Math.random() * 8);
        card.style.order = ramdomPos;
    });
})();

// Adds event listeners to cards. Click and mouseenter are used.

cards.forEach(card => card.addEventListener('click', flipCard));
cards.forEach(card => card.addEventListener('mouseenter', soundEffect));

// This function records all matches. Every time a match is made, showFinishPopup is invoked and
// is sent the number of matches made.

function completeGame() {
    let match = 0;
    cards.forEach(card => {
        if (card.classList.contains('match')) {
            match++;
            showFinishPopup(match);
            console.log("Matches: " + match);
        }
    }
    )
};

// There are only 8 possible matches. Once 8 matches are made, the rest of the function works.
// See comments inside the function.

function showFinishPopup(match) {

    // Handles Matching
    if (match == 8) {
        setTimeout(function () {
            // Shows the win popup and fades out the background. The gold key function is invoked.
            document.getElementById('win').style.display = "block";
            document.getElementById('winfade').style.display = "block";
            addGoldKey();

            // When the okay button is clicked, the various windows are hidden, this removing the game.
            document.getElementById('okay').onclick = function () {

                // The memory onclick node is removed to prevent the player from playing again.
                document.getElementById("memory").outerHTML = "";

                let removeGame = document.getElementsByClassName("phase2");

                Object.entries(removeGame).map((object) => {
                    object[1].style.display = "none";
                });
            }

        }, 1000);
    };
}

// Global variable for playerMoves, which tallies at the end of the game.
var playerMoves = 0;

function playerCount() {
    playerMoves++;
    console.log("Player moves: " + playerMoves);

// Checks to see if the win popup is visible. If it is, playerMoves is checked and the player
// is awarded a gold/silver/bronze star depending on the criteria.
    let gameFinished = document.getElementById("win");
    setTimeout(function () {
        if (gameFinished.style.display === 'block') {

            document.getElementById('moves').style.display = "block";

            // Handles showing the star and the appropriate message.
            switch (true) {
                case (playerMoves <= 8):
                    document.getElementById('goldstar').style.display = "block";
                    document.getElementById('goldstarimg').style.display = "block";
                    break;

                case (playerMoves > 8 && playerMoves <= 11):
                    document.getElementById('silverstar').style.display = "block";
                    document.getElementById('silverstarimg').style.display = "block";
                    break;

                case (playerMoves >= 12):
                    document.getElementById('bronzestar').style.display = "block";
                    document.getElementById('bronzestarimg').style.display = "block";
                    break;
            }
        } else {
            console.log("element not visible yet.");
        }
    }, 1020);
}

// Mouseenter Effect: Plays a soft sound.

function soundEffect() {
    var soundEffectHover = new Audio('ding-3.wav');
    soundEffectHover.play();
    soundEffectHover.volume = 0.1;
}

// KEY HANDLING SCRIPTS

// Global var with empty key array.

var playerKeys = [];
var keySuccess = ["gold key", "red key", "purple key", "pink key"];


// Add the gold from winning the Memory game.

function addGoldKey() {
    let goldKey = "gold key";
    playerKeys.push(goldKey);
    console.log(playerKeys);
}

// Add the pink key from winning the Snake game.
function addPinkKey() {
  console.log(localStorage.getItem('pinkKey'));
    if(localStorage.getItem('pinkKey')) {
        playerKeys.push(localStorage.getItem('pinkKey'));
    }
}

// Add the red key from winning the typing game.
function addRedKey() {
    if(localStorage.getItem('redKey')) {
        playerKeys.push(localStorage.getItem('redKey'));
    }
}

// Handles checking if the player has all the keys in order to open the door.

var playerName;

function checkKeys() {
    //If pink key exists in local storage, from popup, add it to the array.If not do nothing.
    if (playerKeys.indexOf("pink key") == -1) {
      addPinkKey();
    }
    //If red key exists in local storage, from popup, add it to the array.If not do nothing.
    if (playerKeys.indexOf("red key") == -1) {
      addRedKey();
    }

    var success = keySuccess.every(function (val) {
        return playerKeys.indexOf(val) !== -1;
    });

    if (success == true) {
        window.location.replace("escape.html");
    } else {
        alert("You need more keys, " +playerName + ". You have the following keys: " + playerKeys.join(", ") + ".")
    }

};
