
var rules = false;
while(rules == false) {
  var rules = confirm("You will need to get a score of 10 to earn a pink key. Use the space bar to move up, gravity will take you down, don't hit the ground or the pipes! *Hint* Think of the snake image as a square.")
}//while loop


var array2DIsNotNeededForMyGameAndICantMakeItDoAnythingUseful = [
  [1,2,3],
  [4,5,6],
  [7,8,9]
];
console.log(array2DIsNotNeededForMyGameAndICantMakeItDoAnythingUseful);

//Here I set the canvas up to be used later in the code.
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

//Create the images and load in the pictures to the new html created.
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeSouth = new Image();
var pipeNorth = new Image();

bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";

//Variables
var gameOver = false
//Here I set the pipe gap variables so the pipes always render with a space to fly through.
var gap = 85;
var constant = pipeNorth.height+gap;

//Here I mark the birds head/heighest point and it's tails starting positions.
var bX = 10;
var bY = 150;


//Math
var gravity = 1.5;
var pipe = [];//array
var score = 0;

//check for item
if (localStorage.getItem('yes')) {
  score = 5;
  alert("The silver orb grants you 5 points!")
}

pipe[0] = {
    x : cvs.width,
    y : 0
};//object literal

//Audio
var fly = new Audio();
var scor = new Audio();
var crash = new Audio();

fly.src = "sound/fly.mp3";
scor.src = "sound/score.mp3";
crash.src = "sound/crash.wav";

//Events
document.addEventListener("keydown", moveUp);//eventlistener 1
document.addEventListener("click", moveUp);//eventlistener 2

//Functions
function moveUp(){
    bY -= 30;
    fly.play();
}

//Draw
function draw() {
    ctx.drawImage(bg,0,0);

    for(var i = 0; i < pipe.length; i++){ //array method 1

        constant = pipeNorth.height+gap;
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);//object mehtods
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y+constant);

        pipe[i].x--;

        if(pipe[i].x == 75) {
            pipe.push({//array method 2
                x : cvs.width,
                y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height+10
            });
        }

        //Detect a Crash or collision with the poles or ground.
        if ( bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width &&
            (bY <= pipe[i].y + pipeNorth.height || bY+bird.height >=
            pipe[i].y +constant) || bY +bird.height >= cvs.height - fg.height) {
          crash.play();
        	switch(true) {
        		case (score <= 9):
        			alert("You crashed! Try again!");
              gameOver = true;
              location.reload();//reload
        		break;
        		default:
        			alert("Congratulations, you have earned a pink key!");
              localStorage.setItem("pinkKey", 'pink key');
              gameOver = true;
              close();
        		break;
        	}
        }

        if (pipe[i].x == 5) {
            score++;
            scor.play();
        }

    }

    ctx.drawImage(fg, 0, cvs.height - fg.height);

    ctx.drawImage(bird, bX, bY)

    bY += gravity

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : "+score,10,cvs.height-20);

    if(!gameOver) {
      requestAnimationFrame(draw);
    }
};

if(Array.isArray(pipe)) {//array method 3
	draw();
}
