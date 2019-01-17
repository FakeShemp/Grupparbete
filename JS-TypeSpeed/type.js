
if(localStorage.itemChoice == 'yes') {
  $('body').css({'background': 'silver'})
}
// Variabler som kommer användas i spelet
let level = 0 // Håller reda på vilken nivå spelaren är på.
let round = 0 // Håller reda på vilken runda inom nivån.
let countdown // Håller reda på nedräkning
let timer // hr-timer, visuell nedräkning
let time = 0
let words = [  // Ord i spelet
    "structure",
    "according",
    "eloquent",
    "flabbergasted",
    "arctic",
    "impeccable",
    "cemetery",
    "accommodate",
    "maintenance"
]



// Svårighetsgrad via prompt
// Sekunderna skiljer sig beroende på vilken siffta man tar.
let difficulty = 0

while (difficulty != 1 && difficulty != 2 && difficulty != 3) {
    difficulty = prompt('Type 1 if you are a Rookie, type 2 if you are a Pro, type 3 if you are an Expert')
}

difficulties = [5000, 6000, 7000]
difficulties.reverse()
difficulty = difficulties[difficulty - 1]

let levels = []



for (let i = 0; i < words.length; i++) {
    let word1 = words.pop() // plockar ut sista ordet
    let word2 = words.pop() // plockar ut sista ordet
    let word3 = words.pop() // plockar ut sista ordet
    let level = [
        word1,
        word2,
        word3,
        {
            levelName: 'Level: ' + (i + 1),
            timeLimit: difficulty - i * 1000   // Gör varje level lite svårare
        }
    ]
    levels.push(level)
}


let frysObj = Object.freeze(levels);


// Kontrollerar matchning
function checkWord() {

    let currentWord = levels[level][round]
    let enteredWord = $('#textinput').val()

    // Om spelaren har skrivit rätt går spelet vidare
    if (enteredWord === currentWord) {
        switch (round) {
            case 2: // spelaren har klarat av sista rundan
                round = 0
                if (level < 2) {
                    level++
                    start(level, round)
                } else { // spelaren har vunnit spelet
                    endGame(true)
                }
                break
            default: // spelaren har en eller fler rundor kvar inom samma level
                round++
                start(level, round)
                break
        }

    }
}

// Kontrollera om spelaren har skrivit rätt
$('#textinput').on('keyup', checkWord)


function endGame(winner) {
    clearTimeout(countdown)
    if (winner) {
        $('#gamewin').show()
        localStorage.redKey = 'red key'

    }
    else {
        $('#gameover').show()

    }
    $('#gamescreen').hide()
}



// Starta ny runda i spelet
function start(startLevel, startRound) {


    // Sätt nuvarande nivå och runda
    level = startLevel
    round = startRound

    // Visa bara spelskärmen
    $('#startscreen').hide()
    $('#gamescreen').show()
    $('#gamewin').hide()
    $('#gameover').hide()

    // Uppdatera information på spelskärmen
    $('.playername').text(localStorage.playerName)
    $('#level').text(levels[level][3].levelName)
    $('#round').text(`Round ${round + 1} of 3`)
    $('#currentword').text(levels[level][round])
    $('#countdown').text(levels[level][3].timeLimit / 1000 + ' sekunder')
    $('#textinput').val('') // töm textfältet

    // Starta om nedräkningen
    if (countdown) {
        clearTimeout(countdown) // ta bort gamla timern
        clearInterval(timer)
    }

    // starta ny timer
    time = levels[level][3].timeLimit
    countdown = setTimeout(endGame, levels[level][3].timeLimit + 500)


    // starta ny interval
    timer = setInterval(function () {
        time -= 250
        let width = 100 / levels[level][3].timeLimit * time
        $('#timer').css({ 'width': width + '%' })
    }, 250)

}




