
// Starts the Memory game. The eventhandler is on the #memory element.

function startGame() {

    var answer;

    //var itemChoice;
    console.log("My page: " + itemChoiceG);
    
    if (itemChoiceG == "yes") {
        var answer;
        while (answer != "rose" && answer != "skull" && answer != "dragon") {
            var answer = prompt("You come across dusty old cards. One of them is blank. Which image should it have? (Choose: skull, rose, dragon)");
            console.log(answer)
        }

        if (answer == "skull") {
            document.getElementById('wildskull').style.display = "block";
        } else if (answer == "rose") {
            document.getElementById('wildrose').style.display = "block";
        } else if (answer == "dragon") {
            document.getElementById('wilddragon').style.display = "block";
        }
     }

    document.getElementById('game').style.display = "flex";
    document.getElementById('fade').style.display = "block";
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

var playerMoves = 0;

function checkForMatch() {

    let isMatch = cardOne.dataset.name === cardTwo.dataset.name;
    // isMatch ? disableCards() : unflipCards();
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

function unflipCards() {
    setTimeout(() => {
        cardOne.classList.remove('flip');
        cardTwo.classList.remove('flip');

        resetBoard();
    }, 1500);
}

function resetBoard() {
    flippedCard = false;
    locked = false;
    cardOne = null;
    cardTwo = null;
}

(function shuffle() {
    cards.forEach(card => {
        let ramdomPos = Math.ceil(Math.random() * 8);
        card.style.order = ramdomPos;
    });
})();

cards.forEach(card => card.addEventListener('click', flipCard));
cards.forEach(card => card.addEventListener('mouseenter', soundEffect));

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

function showFinishPopup(match) {

    // Handles Matching
    if (match == 8) {
        setTimeout(function () {

            document.getElementById('win').style.display = "block";
            document.getElementById('winfade').style.display = "block";
            addGoldKey();

            document.getElementById('okay').onclick = function () {

                document.getElementById("memory").outerHTML = "";

                let removeGame = document.getElementsByClassName("phase2");

                Object.entries(removeGame).map((object) => {
                    object[1].style.display = "none";
                });
            }

        }, 1000);
    };
}

var playerMoves = 0;

function playerCount() {
    playerMoves++;
    console.log("Player moves: " + playerMoves);


    let gameFinished = document.getElementById("win");
    setTimeout(function () {
        if (gameFinished.style.display === 'block') {

            document.getElementById('moves').style.display = "block";

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

// Mouseenter Effect

function soundEffect() {
    var soundEffectHover = new Audio('ding-3.wav');
    soundEffectHover.play();
    soundEffectHover.volume = 0.1;
}

// KEY HANDLING SCRIPTS

// Global var with empty key array.

var playerKeys = [];
var keySuccess = ["gold key", "red key", "purple key", "pink key"];

// Key from Memory game function.

function addGoldKey() {
    let goldKey = "gold key";
    playerKeys.push(goldKey);
    console.log(playerKeys);
}

// Handles checking if the player has all the keys in order to open the door.

function checkKeys() {

    var success = keySuccess.every(function (val) {
        return playerKeys.indexOf(val) !== -1;
    });

    if (success == true) {
        alert("you win!")
    } else {
        alert("you need more keys. you have the following keys: " + playerKeys.join(", ") + ".")
    }

};