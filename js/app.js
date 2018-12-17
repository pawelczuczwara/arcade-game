'use strict';
// global nodes
const titleRestart = document.querySelector('.title_restart');

// ----------------------- enemies -----------------------
class Enemy{
    constructor({x = 0, y = 50, max_speed = 300} = {}) {

        // The image/sprite for our enemies,
        // this.sprite = 'images/enemy-bug.png';
        this.sprite = 'images/shark2.png';
        this.x      = x;
        this.y      = y;
        this.speed  = this._speed(max_speed);
        this.buf    = 35;
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
                main.collision();
            }
        }
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

}

class Enemies{
    constructor() {
        this.nr  = 0;
        this.all = [];
        this.set = [
            //initial position and MAX speed of enemies
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

    reset() {
        this.nr = 0;
        this.all = [];
        this.add(3); // inital 3 enemies
        return this.all;
    }
}

const enemies = new Enemies();
let allEnemies = enemies.reset();

// player class
// requires an update(), render(), handleInput() methods.
class Player{
    constructor() {
        this.sprite = 'images/char-pengiun.png';
        this.maxX   = 400;
        this.maxY   = 400;
        this.initX  = this.maxX / 2;
        this.initY  = this.maxY;
        this.stepX  = this.maxX / 10;
        this.stepY  = this.maxY / 10;
        this.x      = this.initX;
        this.y      = this.initY;
    }

    update(dt) {
        // What if win
        // console.log(this.y);
        if (this.y <= 0 && modal.is_open === false) {
            console.log ('win win');
            main.openModal();
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
        console.log(this.x, this.y);
    }

    reset() {
        this.x = this.initX;
        this.y = this.initY;
    }

}

const player = new Player();
// console.log(player);

// ----------------------- collect -----------------------
class GameObject{
    constructor({x = 0, y = 50} = {}) {

        // The image/sprite for our enemies,
        // this.sprite = 'images/enemy-bug.png';
        this.sprite = 'images/wave.png';
        this.x      = x;
        this.y      = y;
        this.buf    = 20;
        // this.canvas = 400;
    }

    _set(max) {
        // console.log('set speed');
        return Math.floor(Math.random() * (max - 50)) + 50;
    }

    add() {
        this.x = this._set(450);
        this.y = this._set(300);
        // console.log(this.x, this.y);

    }

    update(dt) {
        // collision detection
        if (player.x >= this.x - this.buf && player.x <= this.x + this.buf) {
            if (player.y >= this.y - this.buf && player.y <= this.y + this.buf) {
                this.x = -100;
                main.scoresAdd(50);
            }
        }
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

}
const gameObject = new GameObject();



// Modal to show scores between levels
class Modal{
    constructor(overlay) {
        this.overlay      = overlay;
        this.is_open      = false;

        this.modalLevel   = this.overlay.querySelector('.modal_level');
        this.modalTime    = this.overlay.querySelector('.modal_time');
        this.modalScores  = this.overlay.querySelector('.modal_scores');
        this.restartBt    = overlay.querySelector('.restart');
        this.nextBt       = overlay.querySelector('.next');

        this.restartBt.addEventListener('click', e => {
            this.restart();
        });
        this.nextBt.addEventListener('click', e => {
            this._next();
        });
    }

    restart() {
        main.restart();
        this.close();
    }

    _next() {
        main.next();
        this.close();
    }

    _nodeUpdate() {
        this.modalLevel.textContent = level.get();
        this.modalTime.textContent = timer.get();
        this.modalScores.textContent = scores.get();
    }

    open() {
        this.is_open = true;
        this._nodeUpdate();

        setTimeout( () => {
            this.overlay.classList.remove('hidden');
            this.nextBt.focus();
        }, 500);
    }

    close() {
        // console.log('close');
        this.is_open = false;
        this.overlay.classList.add('hidden');
    }
}

const modal = new Modal(document.querySelector('.overlay'));
window.openModal = modal.open.bind(modal);

// ----------------------- scores -----------------------
class Counter{
    constructor({node, step = 1, start = 1, pop_step = 10}) {
        this.node        = node;
        this.step        = step;
        this.pop_step    = pop_step;
        this.counter_cur = start;
    }

    get() {
        return this.counter_cur;
    }

    add(step = this.step) {
        this.counter_cur += step;
        this.set();
        return this.counter_cur;
    };

    reset() {
        this.counter_cur = 1;
        this.set();
        return this.counter_cur;
    };

    set() {
        this.node.textContent = this.counter_cur;
    };
};
const level = new Counter({node: document.querySelector('.info_level')});
const scores = new Counter({step: 100, node: document.querySelector('.info_scores'), start: 0, pop_step: 25});

// ----------------------- timer -----------------------
class Timer{
    constructor({node}) {
        this.time_node      = node;
        this.time_sec       = 0;
        this.time_min       = 0;
        this.time_started   = false;
        this.time_interval  = '';
    }
    _s_pref() {
        return (this.time_sec < 10) ? "0" : "";
    }

    _m_pref() {
        return (this.time_min < 10) ? "0" : "";
    }

    _HTML() {
        this.time_node.innerHTML = this._m_pref() + this.time_min + ":" + this._s_pref() + this.time_sec;
    }

    _tick() {
        this.time_sec++;
        if (this.time_sec == 60) {
            this.time_min++;
            this.time_sec = 0;
        }
    }

    get() {
        return this.time_node.textContent;
    }

    start() {
        this.time_started = true;
        this.time_interval = setInterval(() => {
            this._HTML();
            this._tick();
        }, 1000);
    }

    pause() {
        clearInterval(this.time_interval);
    }

    reset() {
        clearInterval(this.time_interval);
        this.time_started = false;
        this.time_min = 0;
        this.time_sec = 0;
        this._HTML();
    }


}
const timer = new Timer({node: document.querySelector('.info_time')});

// ----------------------- Main functionality -----------------------

const main = {
    infoLevel    : document.querySelector('.info_level'),
    infoScores   : document.querySelector('.info_scores'),

    restart: function restart() {
        level.reset();
        scores.reset();
        this._nodeUpdate();

        allEnemies = enemies.reset();
        player.reset();
        gameObject.add();
        timer.reset();
    },

    _nodeUpdate: function _nodeUpdate() {
        this.infoLevel.textContent = level.get();
        this.infoScores.textContent = scores.get();
    },

    next: function next() {
        level.add();
        this._nodeUpdate();

        enemies.add();
        gameObject.add();
        player.reset();
        timer.start();
    },

    openModal: function openModal() {
        timer.pause();

        scores.add();
        this._nodeUpdate();

        // modal.open();
        window.openModal();
    },

    scoresAdd: function scoresAdd(score) {
        scores.add(score);
    },

    collision: function colission() {
        player.reset();
        scores.add(-25);
    }
}

// ----------------------- input -----------------------

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    (timer.time_started) ? '' : timer.start();
    player.handleInput(allowedKeys[e.keyCode]);
    // console.log(allowedKeys[e.keyCode]);
});


window.addEventListener('swipeleft', function(e) {
    console.log('left');
    player.handleInput('left');
});

titleRestart.addEventListener('click', function() {
    modal.restart();
});
