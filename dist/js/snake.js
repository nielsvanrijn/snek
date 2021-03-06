var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Piece = (function () {
    function Piece(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
    }
    Piece.prototype.moveToPoint = function (p) {
        if (this.tail != null) {
            this.tail.moveToPoint(this);
        }
        this.x = p.x;
        this.y = p.y;
    };
    return Piece;
}());
var Food = (function (_super) {
    __extends(Food, _super);
    function Food(game) {
        _super.call(this, 0, 0);
        this.game = game;
    }
    return Food;
}(Piece));
var Snek = (function (_super) {
    __extends(Snek, _super);
    function Snek(game) {
        _super.call(this, 0, 0);
        this.snekColor = 0;
        this.game = game;
    }
    Snek.prototype.restart = function () {
        this.snekHead = new Piece(60, 30);
        this.snekHead.tail = new Piece(30, 30);
        this.snekHead.tail.tail = new Piece(0, 30);
        this.direction = Direction.Right;
    };
    Snek.prototype.move = function () {
        var xNew = this.snekHead.x;
        var yNew = this.snekHead.y;
        switch (this.direction) {
            case Direction.Left:
                xNew -= this.game.tileSize;
                break;
            case Direction.Right:
                xNew += this.game.tileSize;
                break;
            case Direction.Up:
                yNew -= this.game.tileSize;
                break;
            case Direction.Down:
                yNew += this.game.tileSize;
                break;
            default:
                break;
        }
        if (xNew == this.game.food.x &&
            yNew == this.game.food.y) {
            this.eat();
        }
        else {
            this.snekHead.tail.moveToPoint(this.snekHead);
            this.snekHead.x = xNew;
            this.snekHead.y = yNew;
        }
    };
    Snek.prototype.moveLeft = function () {
        if (this.direction != Direction.Right)
            this.direction = Direction.Left;
    };
    Snek.prototype.moveRight = function () {
        if (this.direction != Direction.Left)
            this.direction = Direction.Right;
    };
    Snek.prototype.moveUp = function () {
        if (this.direction != Direction.Down)
            this.direction = Direction.Up;
    };
    Snek.prototype.moveDown = function () {
        if (this.direction != Direction.Up)
            this.direction = Direction.Down;
    };
    Snek.prototype.eat = function () {
        this.game.food.tail = this.snekHead;
        this.snekHead = this.game.food;
        this.game.placeFood();
    };
    return Snek;
}(Piece));
var Direction;
(function (Direction) {
    Direction[Direction["Left"] = 0] = "Left";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Up"] = 2] = "Up";
    Direction[Direction["Down"] = 3] = "Down";
})(Direction || (Direction = {}));
var Game = (function () {
    function Game(canvas) {
        var _this = this;
        this.pauseDuration = 200;
        window.addEventListener("keydown", function (e) { return _this.keyboardListener(e); });
        this.canvas = canvas;
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        this.tileSize = 30;
        this.snek = new Snek(this);
        this.food = new Food(this);
        this.start();
    }
    Game.prototype.start = function () {
        this.restart();
        setInterval(function () { return game.loop(); }, this.pauseDuration);
    };
    Game.prototype.restart = function () {
        this.snek.restart();
        this.placeFood();
    };
    Game.prototype.loop = function () {
        this.snek.move();
        if (this.gameOver()) {
            this.restart();
        }
        this.draw();
    };
    Game.prototype.placeFood = function () {
        var noOfTiles = (this.canvas.width / this.tileSize) * (this.canvas.height / this.tileSize);
        var a = new Array(noOfTiles);
        for (var i = 0; i < noOfTiles; i++) {
            var x = (i % (this.canvas.width / this.tileSize)) * this.tileSize;
            var y = (Math.floor(i / (this.canvas.width / this.tileSize))) * this.tileSize;
            if (i == 799) {
                var b = i;
            }
            a[i] = new Piece(x, y);
        }
        var snekParts = new Array();
        var p = this.snek.snekHead;
        while (p != null) {
            snekParts.push(p);
            p = p.tail;
        }
        var validPoints = new Array();
        for (var i = 0; i < a.length; i++) {
            if (!Util.pointInArray(a[i], snekParts))
                validPoints.push(a[i]);
        }
        var newPointIndex = Util.randomInt(validPoints.length - 1, 0);
        this.food = validPoints[newPointIndex];
    };
    Game.prototype.gameOver = function () {
        return Util.snekOutsideBounds(this.snek, this.canvas) || Util.snekTouchingItself(this.snek);
    };
    Game.prototype.draw = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var p = this.snek.snekHead;
        while (p != null) {
            this.context.fillStyle = "hsl(" + this.snek.snekColor + ", 100%, 50%)";
            if (this.snek.snekColor < 360) {
                this.snek.snekColor = this.snek.snekColor + 0.5;
            }
            else {
                this.snek.snekColor = this.snek.snekColor - 360;
            }
            this.context.fillRect(p.x, p.y, p.width - 1, p.height - 1);
            p = p.tail;
            this.context.fillStyle = "hsl(" + (360 - this.snek.snekColor) + ", 100%, 50%)";
        }
        this.context.fillRect(this.food.x, this.food.y, this.food.width - 1, this.food.height - 1);
    };
    Game.prototype.keyboardListener = function (e) {
        if (e.keyCode == 37) {
            this.snek.moveLeft();
        }
        else if (e.keyCode == 39) {
            this.snek.moveRight();
        }
        else if (e.keyCode == 38) {
            this.snek.moveUp();
        }
        else if (e.keyCode == 40) {
            this.snek.moveDown();
        }
    };
    return Game;
}());
var game;
window.onload = function () {
    var el = document.getElementById('game-canvas');
    game = new Game(el);
};
var Util = (function () {
    function Util() {
    }
    Util.randomInt = function (upperRange, lowerRange) {
        return Math.round((Math.floor(Math.random() * (upperRange - lowerRange + 1)) + lowerRange));
    };
    Util.pointInArray = function (p, pieceArray) {
        for (var i = 0; i < pieceArray.length; i++) {
            var pieceAtIndex = pieceArray[i];
            if (pieceAtIndex.x == p.x && pieceAtIndex.y == p.y)
                return true;
        }
        return false;
    };
    Util.snekOutsideBounds = function (snek, canvas) {
        return (snek.snekHead.x < 0 ||
            snek.snekHead.y < 0 ||
            snek.snekHead.x + snek.snekHead.width > canvas.width ||
            snek.snekHead.y + snek.snekHead.height > canvas.height);
    };
    Util.snekTouchingItself = function (snek) {
        var p = snek.snekHead.tail;
        while (p != null) {
            if (p.x == snek.snekHead.x &&
                p.y == snek.snekHead.y)
                return true;
            p = p.tail;
        }
        return false;
    };
    return Util;
}());
//# sourceMappingURL=snake.js.map