var animalBall;
var obsticle;
var cheese;
var minValue = 0.01;
var pointerSpeed = 0.2;
var maxSpeed = 5;

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
        var nearest = this.nearestPoint(circle, rectangle);
        if (nearest.x > rectangle.position.x) {
            if (nearest.y > rectangle.position.y) {
                if (nearest.y == rectangle.position.y + rectangle.height) {
                    console.log("mmmm");
                    return rectangle.lineBottom();
                }
                else {
                    return rectangle.lineLeft();
                }
            }
        }
        else if (nearest.x == rectangle.position.x) {
            return rectangle.lineRight();
        }
        return rectangle.lineTop();
    },
    circleRectangle: function (circle, rectangle) {
        var point = this.nearestPoint(circle, rectangle);
        return this.circlePoint(circle, point);
    }
}

function startGame() {
    animalBall = new circle(50, 50, 20);
    obsticle = new rectangle(200, 200, 50, 200);
    cheese = new drawImage("assets/cheese.svg", 900, 500, 10, 10)
    gameArea.start();
}

var gameArea = {
    canvas: document.getElementById("maze"),
    mouseHold: false,
    start: function () {
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
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function circle(x, y, rad) {
    this.previousPosition = new vec2(x - minValue, y - minValue);
    this.position = new vec2(x, y);
    this.radius = rad;
    this.color = "blue";
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
        ctx.fillStyle = this.color;
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
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

function drawImage(url, x, y, width, height) {
    this.url = url;
    this.position = new vec2(x, y);
    this.width = width;
    this.height = height;
    this.img = new Image;
    this.img.src = url;
    this.midpoint = function () {
        return new vec2(this.position.x + this.width / 2, this.position.y + this.height / 2);
    }
    this.update = function () {
        ctx = gameArea.context;
        ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
    }
}

function updateGame() {
    gameArea.clear();
    if (gameArea.mouseX && gameArea.mouseY) {
        // Current vector of moving ball
        var ballVector = animalBall.direction().multiplyI(animalBall.speed());

        if (gameArea.mouseHold) {
            var ball2mouseVec = points2vec(animalBall.position, new vec2(gameArea.mouseX, gameArea.mouseY));

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

        var newPos = animalBall.position.add(newBallVector);
        if (intersection.circleRectangle(animalBall, obsticle)) {
            var line = intersection.nearestLine(animalBall, obsticle);
            var refl = line.reflection(animalBall.direction());
            animalBall.color = "green";
            animalBall.position = animalBall.previousPosition;
            animalBall.newPosition(animalBall.position.add(refl.multiplyI(newBallVector.magnitude() * 0.75)));
        }
        else {
            animalBall.color = "blue";
            animalBall.newPosition(newPos);
        }
    }

    obsticle.update();
    animalBall.update();
    cheese.update();
}

window.onload = startGame();
