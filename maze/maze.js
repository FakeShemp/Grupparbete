var _canvas;
var hamsterBall;
var hamsterVector = new vec2(0, -1);
var obsticle = new Array();
var screenWidth = 1024;
var screenHeight = 576;
var obsticleCoords = [
    [0, -10, 1024, 10],
    [0, 576, 1024, 10],
    [-10, 0, 10, 576],
    [1024, 0, 10, 576],
    [100, 0, 20, 500],
    [200, 100, 20, 476],
    [220, 100, 676, 20],
    [720, 220, 304, 20],
    [720, 240, 20, 200],
    [480, 420, 240, 20],
    [600, 120, 20, 200],
    [480, 240, 20, 200],
    [340, 240, 20, 336],
    [600, 440, 20, 50],
    [864, 340, 20, 236]
];
var cheese;
var hamster;
var minValue = 0.01;
var pointerSpeed = 0.2;
var maxSpeed = 7;
var lockInput = true;
var countDownTimer;
var interval;
var mazeItemChoice;
var hedge = new Image();
hedge.src = 'maze/assets/hedge.jpg';
var ground = new Image();
ground.src = 'maze/assets/ground.jpg';

if (mazeItemChoice[0] == "y") {
    maxSpeed = 4;
    console.log("Speed decreased");
}

function points2vec(v1, v2) {
    return new vec2(v1.x - v2.x, v1.y - v2.y);
}

function line(point1, point2) {
    this.start = point1;
    this.end = point2;
    this.normal = function () {
        var dx = this.end.x - this.start.x;
        var dy = this.end.y - this.start.y;

        return new vec2(-dy, dx);
    }
    this.reflection = function (d) {
        var n = this.normal().normalized();
        var dot = d.x * n.x + d.y * n.y;

        return d.subtract(n.multiplyI(2 * dot));
    }
}

function vec2(x, y) {
    this.x = x;
    this.y = y;
    this.magnitude = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    this.normalized = function () {
        var mag = this.magnitude();
        if (mag != 0) {
            return new vec2(this.x / mag, this.y / mag);
        }
        return new vec2(0, 0);
    }
    this.multiply = function (v) {
        return new vec2(this.x * v.x, this.y * v.y);
    }
    this.multiplyI = function (i) {
        return new vec2(this.x * i, this.y * i);
    }
    this.add = function (v) {
        return new vec2(this.x + v.x, this.y + v.y);
    }
    this.addI = function (i) {
        return new vec2(this.x + i, this.y + i);
    }
    this.subtract = function (v) {
        return new vec2(this.x - v.x, this.y - v.y);
    }
    this.subtractI = function (i) {
        return new vec2(this.x - i, this.y - i);
    }
    this.inverse = function () {
        return new vec2(-this.x, -this.y);
    }
    this.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    }
    this.determinant = function (v) {
        return this.x * v.y - this.y * v.x;
    }
}

var timer = {
    zero: "0:00:000",
    start: Date.now(),
    textObject: undefined,
    run: false,
    finalTime: 0,
    ellapsedTime: function () {
        return Date.now() - this.start;
    },
    formatTime: function (time) {
        // This is wrong math
        var m = Math.floor(time / 60000);
        var s = ((time % 60000) / 1000).toFixed(0);
        var ms = time.toString().slice(-3);

        return m + ':' + (s < 10 ? '0' : '') + s + ':' + ms;
    },
    update: function () {
        if (this.run) {
            this.finalTime = this.ellapsedTime();
            this.textObject.string = this.formatTime(this.finalTime);
        }
        this.textObject.update();
    }
}

var intersection = {
    circlePoint: function (circle, point) {
        var delta = circle.position.subtract(point);
        if ((delta.x * delta.x + delta.y * delta.y) < (circle.radius * circle.radius)) {
            return true;
        }
        return false;
    },
    nearestPoint: function (circle, rectangle) {
        var nearestX = Math.max(rectangle.position.x, Math.min(circle.position.x, rectangle.position.x + rectangle.width));
        var nearestY = Math.max(rectangle.position.y, Math.min(circle.position.y, rectangle.position.y + rectangle.height));

        return new vec2(nearestX, nearestY);
    },
    nearestLine: function (circle, rectangle) {
        var intrsct = "top";
        var nearest = this.nearestPoint(circle, rectangle);
        if (nearest.x > rectangle.position.x) {
            if (nearest.y > rectangle.position.y) {
                if (nearest.y == rectangle.position.y + rectangle.height) {
                    intrsct = "bottom";
                }
                else {
                    intrsct = "left";
                }
            }
        }
        else if (nearest.x == rectangle.position.x) {
            intrsct = "right";
        }

        switch (intrsct) {
            case "top":
                return rectangle.lineTop();
            case "bottom":
                return rectangle.lineBottom();
            case "left":
                return rectangle.lineLeft();
            case "right":
                return rectangle.lineRight();
        }
    },
    circleRectangle: function (circle, rectangle) {
        var point = this.nearestPoint(circle, rectangle);
        return this.circlePoint(circle, point);
    }
}

function startMazeGame() {
    var container = document.querySelector(".mazeContainer");
    _canvas = document.createElement("canvas");
    _canvas.setAttribute('id', "maizeMaze");
    _canvas.setAttribute('width', screenWidth);
    _canvas.setAttribute('height', screenHeight);
    container.appendChild(_canvas);

    hamsterBall = new circle(50, 50, 20);
    for (i in obsticleCoords) {
        obsticle.push(new rectangle(obsticleCoords[i][0], obsticleCoords[i][1], obsticleCoords[i][2], obsticleCoords[i][3]));
    }
    hamster = new graphics(0, 0, 25, 25, "maze/assets/hamster.svg", false);
    cheese = new graphics(screenWidth - 100, screenHeight - 100, 70, 70, "maze/assets/cheese.svg", true);
    // cheese = new graphics(50 - 15, 200, 30, 30, "maze/assets/cheese.svg", true);
    countDownTimer = new text(5, screenWidth / 2, screenHeight / 2, "Arial", 100);
    timer.textObject = new text(timer.zero, screenWidth - 130, 40, "Arial", 30);
    interval = setInterval(countDown, 1000);
    gameArea.start();
}

function removeCountDown() {
    countDownTimer = undefined;
    clearInterval(interval);
}

function countDown() {
    if (countDownTimer.string == 1) {
        countDownTimer.string = "Go!"
        timer.start = Date.now();
        setTimeout(removeCountDown, 1000);
        lockInput = false;
        timer.run = true;
        return;
    };
    countDownTimer.string = countDownTimer.string - 1;
}

var gameArea = {
    mouseHold: false,
    start: function () {
        this.canvas = _canvas;
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(updateGame, 20);

        var rect = this.canvas.getBoundingClientRect();
        window.addEventListener("mousemove", function (e) {
            gameArea.mouseX = e.clientX - rect.left;
            gameArea.mouseY = e.clientY - rect.top;
        }, false)
        window.addEventListener("mousedown", function (e) {
            gameArea.mouseHold = true;
        }, false)
        window.addEventListener("mouseup", function (e) {
            gameArea.mouseHold = false;
        }, false)
        window.addEventListener('keydown', function (e) {
            if (e.key == 'r') {
                hamsterBall.position = new vec2(50, 50);
                hamsterBall.previousPosition = new vec2(50 - minValue, 50 - minValue);
            }
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function circle(x, y, rad) {
    this.previousPosition = new vec2(x - minValue, y - minValue);
    this.position = new vec2(x, y);
    this.radius = rad;
    this.direction = function () {
        return points2vec(this.position, this.previousPosition).normalized();
    }
    this.speed = function () {
        return points2vec(this.position, this.previousPosition).magnitude();
    }
    this.update = function () {
        ctx = gameArea.context;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);

        var grad = ctx.createRadialGradient(this.position.x, this.position.y, 0, this.position.x, this.position.y, this.radius + 3);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, "white");

        ctx.fillStyle = grad;
        ctx.fill();
    }
    this.newPosition = function (p) {
        this.previousPosition = this.position;
        this.position = p;
    }
}

function rectangle(x, y, width, height) {
    this.position = new vec2(x, y);
    this.width = width;
    this.height = height;
    this.midpoint = function () {
        return new vec2(this.position.x + this.width / 2, this.position.y + this.height / 2);
    }
    this.lineRight = function () {
        return new line(new vec2(this.position.x, this.position.y), new vec2(this.position.x, this.position.y + this.height));
    }
    this.lineLeft = function () {
        return new line(new vec2(this.position.x + this.width, this.position.y), new vec2(this.position.x + this.width, this.position.y + this.height));
    }
    this.lineTop = function () {
        return new line(new vec2(this.position.x, this.position.y), new vec2(this.position.x + this.width, this.position.y));
    }
    this.lineBottom = function () {
        return new line(new vec2(this.position.x, this.position.y + this.height), new vec2(this.position.x + this.width, this.position.y + this.height));
    }
    this.update = function () {
        ctx = gameArea.context;

        var pattern = ctx.createPattern(hedge, "repeat");
        ctx.fillStyle = pattern;

        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

function graphics(x, y, width, height, url, fixed) {
    rectangle.call(this, x, y, width, height)

    this.img = new Image;
    this.img.src = url;
    this.fixed = fixed;
    this.update = function () {
        ctx = gameArea.context;
        ctx.save();
        if (!this.fixed) {
            this.position.x = hamsterBall.position.x - (this.width / 2) + (Math.random() * hamsterBall.speed() / 2);
            this.position.y = hamsterBall.position.y - (this.height / 2) + (Math.random() * hamsterBall.speed() / 2);
            ctx.translate(this.position.x, this.position.y);
            ctx.translate(this.width / 2, this.height / 2);

            var b2m = points2vec(hamsterBall.position, new vec2(gameArea.mouseX, gameArea.mouseY));
            var angle = Math.atan2(b2m.determinant(hamsterVector), b2m.dot(hamsterVector));

            ctx.rotate(-angle);
            ctx.translate(-(this.width / 2), -(this.height / 2));
            ctx.translate(-this.position.x, -this.position.y);
        }
        ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
        ctx.restore();
    }
}

function text(string, x, y, font, size) {
    this.position = new vec2(x, y);
    this.string = string;
    this.font = font;
    this.size = size;
    this.update = function () {
        ctx = gameArea.context;
        ctx.fillStyle = "purple";
        ctx.font = this.size + "px " + this.font;
        ctx.fillText(this.string, this.position.x, this.position.y);
    }
}

function updateGame() {
    var intersect = false;
    gameArea.clear();

    if (lockInput == false) {
        if (gameArea.mouseX && gameArea.mouseY) {
            // Current vector of moving ball
            var ballVector = hamsterBall.direction().multiplyI(hamsterBall.speed());

            if (gameArea.mouseHold) {
                var ball2mouseVec = points2vec(hamsterBall.position, new vec2(gameArea.mouseX, gameArea.mouseY));

                // The influence of the mouse cursor
                var influence = ball2mouseVec.normalized().multiplyI(pointerSpeed)
                var newBallVector = ballVector.subtract(influence);

                if (newBallVector.magnitude() > maxSpeed) {
                    newBallVector = newBallVector.normalized().multiplyI(maxSpeed);
                }
            }
            else {
                var newBallVector = ballVector.multiplyI(0.95);
            }

            for (i in obsticle) {
                if (intersection.circleRectangle(hamsterBall, obsticle[i])) {
                    var line = intersection.nearestLine(hamsterBall, obsticle[i]);
                    var refl = line.reflection(hamsterBall.direction());
                    hamsterBall.color = "green";
                    hamsterBall.position = hamsterBall.previousPosition;
                    hamsterBall.newPosition(hamsterBall.position.add(refl.multiplyI(newBallVector.magnitude() * 0.75)));
                    intersect = true;
                    break;
                }
            }

            if (cheese) {
                if (intersection.circleRectangle(hamsterBall, cheese)) {
                    cheese = undefined;
                    timer.run = false;
                    setTimeout(function () {
                        document.getElementById('win_maze').style.display = "block";
                        document.getElementById('winfade_maze').style.display = "block";
                        addPurpleKey();

                        document.getElementById('okay_maze').onclick = function () {
                            document.getElementById("maze").outerHTML = "";
                            _canvas.parentNode.removeChild(_canvas);
                            let removeGame = document.getElementsByClassName("maze2");

                            Object.entries(removeGame).map((object) => {
                                object[1].style.display = "none";
                            });
                        }
                    }, 1000);
                }
            }

            if (intersect != true) {
                hamsterBall.newPosition(hamsterBall.position.add(newBallVector));
            }
        }
    }

    var i = 0;
    while (true) {
        if (i >= obsticle.length) {
            break;
        }
        obsticle[i].update();
        i++;
    }
    if (cheese) {
        cheese.update();
    }

    if (hamsterBall) {
        hamsterBall.update();
    }
    if (hamster) {
        hamster.update();
    }
    if (countDownTimer) {
        countDownTimer.update();
    }
    if (timer) {
        timer.update()
    }
}

var playerKeys;
function addPurpleKey() {
    let purpleKey = "purple key";
    playerKeys.push(purpleKey);
    console.log(playerKeys);
}
