'use strict';

// Enemies to avoid
class Enemy{
    constructor({x = 0, y = 50, max_speed = 300} = {}) {

        // The image/sprite for our enemies,
        // this.sprite = 'images/enemy-bug.png';
        this.sprite = 'images/shark2.png';
        this.x = x;
        this.y = y;
        this.speed = this._speed(max_speed);
        this.buf = 35;
        this.canvas = 500;
    }

    _speed(max_speed) {
        // console.log('set speed');
        return Math.floor(Math.random() * (max_speed - 100)) + 100;
    }

    update(dt) {
        // dt ensure the game runs at the same speed for all computers.
        this.x = this.x + (this.speed * dt);

        //reset enemy position at the end of the screen
        ( this.x >= this.canvas ) ? this.x = -100 : '';

        // collision detection
        if (player.x >= this.x - this.buf && player.x <= this.x + this.buf) {
            if (player.y >= this.y - this.buf && player.y <= this.y + this.buf) {
                player.reset();
            }
        }
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

}

// player class
// requires an update(), render(), handleInput() methods.
class Player{
    constructor() {
        this.sprite = 'images/char-pengiun.png';
        this.maxX = 400;
        this.maxY = 400;
        this.initX = this.maxX / 2;
        this.initY = this.maxY;
        this.stepX = this.maxX / 10;
        this.stepY = this.maxY / 10;
        this.x = this.initX;
        this.y = this.initY;
    }
    update(dt) {
        // What if win
        // console.log(this.y);
        if (this.y <= 0 && modal.is_open === false) {
            // setTimeout(() => {
                console.log ('win win');
                //window.openModal();
                modal.open();
                // this.reset();
        // }, 0);
        }
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    handleInput(key) {
        // console.log(this.y);
        (key === 'left')  ? (this.x > 0 ? this.x -= this.stepX : this.x = this.maxX) : '';
        (key === 'right') ? (this.x < this.maxX ? this.x += this.stepX : this.x = 0) : '';
        (key === 'up') && (this.y > 0) ? this.y -= this.stepY : '';
        (key === 'down') && (this.y < this.maxY) ? this.y += this.stepY : '';
        // console.log(this.y);
    }
    reset() {
        this.x = this.initX;
        this.y = this.initY;
    }

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
class Enemies{
    constructor() {
        this.nr = 0;
        this.all = [];
        this.set = [
            {x: 0,    y: 50,  speed: 350},
            {x: 0,    y: 140, speed: 250},
            {x: 0,    y: 220, speed: 120},
            {x: -100, y: 70,  speed: 300},
            {x: -250, y: 155, speed: 200},
            {x: -200, y: 250, speed: 100},
        ];
    }

    add(x = 1) {
        for(var i=0; i<x; i++) {
            this.all.push(new Enemy(this.set[this.nr]));
            this.nr += 1;
        }
        return this.all;
        // console.log(this.all);
    }

    // get() {
    //     return this.all;
    // }

    reset() {
        this.nr = 0;
        this.all = [];
        this.add(3); // inital enemies
        return this.all;
    }
}

const enemies = new Enemies();
let allEnemies = enemies.reset(); //enemies.get();

const player = new Player();
// console.log(player);

// Modal to show scores between levels
class Modal{
    constructor(overlay) {
        this.overlay = overlay;
        this.is_open = false;

        this.restartBt = overlay.querySelector('.restart');
        this.nextBt = overlay.querySelector('.next');

        this.restartBt.addEventListener('click', e => {
            this._restart();
        });
        this.nextBt.addEventListener('click', e => {
            this._next();
        });
    }

    _restart() {
        console.log('restart');

        //level information reset
        level.reset();
        document.querySelector('.level').textContent = 1;

        allEnemies = enemies.reset();
        player.reset();
        this.close();
    }

    _next() {
        console.log('next');

        // level information update
        level.add();
        document.querySelector('.level').textContent = level.counter_cur;

        enemies.add();
        player.reset();
        this.close();
    }

    open() {
        // console.log('open');

        this.is_open = true;
        this.overlay.querySelector('.modal_level').textContent = level.counter_cur;

        setTimeout( () => {
            this.overlay.classList.remove('hidden');
            this.nextBt.focus();
        }, 500);
    }

    close() {
        console.log('close');
        this.is_open = false;
        this.overlay.classList.add('hidden');
    }
}

const modal = new Modal(document.querySelector('.overlay'));
window.openModal = modal.open.bind(modal);

// ----------------------- scores -----------------------
class Counter{
    constructor({node, step = 1}) {
        this.step = step;
        this.node = node;
        this.counter_cur = 1;
    }

    get() {
        return this.counter_cur;
    }

    add() {
        this.counter_cur += this.step;
        this.set();
        return this.counter_cur;
    };

    reset() {
        this.counter_cur = 0;
        this.set();
        return this.counter_cur;
    };

    set() {
        this.node.textContent = this.counter_cur;
    };
};
const level = new Counter({node: document.querySelector('.level')});



// ----------------------- input -----------------------

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    // console.log(allowedKeys[e.keyCode]);
});


window.addEventListener('swipeleft', function(e) {
    console.log('left');
    player.handleInput('left');
});
