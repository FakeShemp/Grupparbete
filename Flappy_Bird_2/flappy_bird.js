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
//Here I set the pipe gap variables so the pipes always render with a space to fly through.
var gap = 85;
var constant = pipeNorth.height+gap;
console.log(pipeNorth.height);
//Here I mark the birds head/heighest point and it's tails starting positions.
var bX = 10;
var bY = 150;
var gameOver = false

//Math
var gravity = 1.5;
var pipe = [];
var score = 0;

pipe[0] = {
    x : cvs.width,
    y : 0
};

//Audio
var fly = new Audio();
var scor = new Audio();

fly.src = "sound/fly.mp3";
scor.src = "sound/score.mp3";

//Events
document.addEventListener("keydown", moveUp);

//Functions
function moveUp(){
    bY -= 30;
    fly.play();
}

//Draw
function draw() {
    ctx.drawImage(bg,0,0);

    for(var i = 0; i < pipe.length; i++){

        constant = pipeNorth.height+gap;
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y+constant);

        pipe[i].x--;

        if(pipe[i].x == 75) {
            pipe.push({
                x : cvs.width,
                y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height+10
            });
        }

        //Detect a Crash or collision with the poles or ground.
        if ( bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width &&
            (bY <= pipe[i].y + pipeNorth.height || bY+bird.height >=
            pipe[i].y +constant) || bY +bird.height >= cvs.height - fg.height) {

        	switch(true) {
        		case (score <= 9):
        			alert("You crashed! Try again!")
              gameOver = true
              location.reload();//reload
        		break;
        		default:
        			alert("Congratulations, you have earned a key!")
              localStorage.setItem("pinkKey", 1)
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

if(Array.isArray(pipe)) {
	draw();
}
