var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 20;

// context
// used to draw on the canvas
var c = canvas.getContext("2d");

class Sun {
    constructor() {
        this.mass = 100;
        this.px = canvas.width / 2;
        this.py = canvas.height / 2;

        this.radius = 30;

        this.colour = "#FDB813";
    }

    draw() {
        c.strokeStyle = this.colour;
        c.fillStyle = this.colour;
        c.beginPath();
        c.arc(this.px, this.py, this.radius, 0, Math.PI * 2, false);
        c.stroke();
        c.fill();
    }

    update() {
        this.draw();
    }
}

class Planet {
    constructor(orbital_radius, speed, radius, colour, sun) {
        this.mass = 10;
        this.orbital_radius = orbital_radius;
        this.radius = radius;
        this.sun = sun;

        this.px = sun.px + this.orbital_radius;
        this.py = sun.py;
        this.vx = 0;
        this.vy = speed;
        this.colour = colour;
    }

    draw() {
        c.strokeStyle = this.colour;
        c.fillStyle = this.colour;
        c.beginPath();
        c.arc(this.px, this.py, this.radius, 0, Math.PI * 2, false);
        c.stroke();
        c.fill();
    }

    update() {
        this.draw();
        console.log(this.px, this.vx);
        this.px += this.vx;
        this.py += this.vy;
        this.vx += this.gravity() * Math.cos(this.angle);
        this.vy += this.gravity() * Math.sin(this.angle);
    }

    gravity() {
        const G = 10;
        var r = Math.sqrt(Math.pow(this.px - this.sun.px, 2) + Math.pow(this.py - this.sun.py, 2));
        return G*this.sun.mass/(Math.pow(r, 2));
    }

    get angle() {
        return Math.atan2(this.sun.py - this.py, this.sun.px - this.px);
    }
}

var objects = [];

var sun = new Sun();
objects.push(sun);

var planet = new Planet(200, 1, 10, "#6c3bd4", sun);
objects.push(planet);

function animate() {
    // call animate in a loop for each frame
    requestAnimationFrame(animate);

    // clear the canvas
    c.clearRect(0, 0, innerWidth, innerHeight);

    // call update on every celestial body
    for (var i in objects) {
        objects[i].update();
    }
}

// start the above loop
animate();

console.log(canvas);