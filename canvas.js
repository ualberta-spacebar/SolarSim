var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 20;

// context
// used to draw on the canvas
var c = canvas.getContext("2d");

class Sun {
    constructor() {
        this.phys_x = 0;
        this.phys_y = 0;

        // this.mass = 100;
        this.mass = 2 * (10 ** 30);

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
    constructor(radius, colour, sun) {
        this.phys_x = 1 * AU;
        this.phys_y = 0;

        // this.mass = 10;
        this.mass = 5.972 * (10 ** 24);

        this.radius = radius;
        this.sun = sun;

        this.px = this.sun.px + (this.phys_x * pixels_per_m);
        this.py = this.sun.py + (this.phys_y * pixels_per_m);

        this.vx = 0;
        this.vy = 0;
        this.colour = colour;
    }

    draw() {
        console.log("Sun", this.sun.px, this.sun.py);
        console.log("Planet", this.px, this.py);
        this.px = this.sun.px + (this.phys_x * pixels_per_m);
        this.py = this.sun.py + (this.phys_y * pixels_per_m);

        c.strokeStyle = this.colour;
        c.fillStyle = this.colour;
        c.beginPath();
        c.arc(this.px, this.py, this.radius, 0, Math.PI * 2, false);
        c.stroke();
        c.fill();
    }

    update() {
        this.apply_physics();
        this.draw();
    }

    apply_physics() {
        this.phys_x += this.vx;
        this.phys_y += this.vy;
        // this.vx += this.gravity * Math.cos(this.angle);
        // this.vy += this.gravity * Math.sin(this.angle);
    }

    // calculate the distance between the centers of the sun and planet
    get orbital_distance() {
        var squared_distance = ((this.px - this.sun.px) ** 2) + ((this.py - this.sun.py) ** 2);
        return Math.sqrt(squared_distance);
    }

    get gravity() {
        return G * this.sun.mass / this.orbital_distance;
        // return 10;
    }

    get angle() {
        return Math.atan2(this.sun.phys_y - this.phys_y, this.sun.phys_x - this.phys_x);
    }
}

const G = 6.67408 * (10 ** -11);
const AU = 1 / 149597870700;    // meters

var width_m = 6 * AU;
var height_m = (canvas.height / canvas.width) * width_m;

var pixels_per_m = canvas.width / width_m;

var objects = [];

var sun = new Sun();
objects.push(sun);

var planet = new Planet(10, "#6c3bd4", sun);
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
    drawGrid();
}

function drawGrid() {
    // draw a line
    c.beginPath();
    c.strokeStyle = "#fa34a3";
    c.moveTo(0, 0);
    c.lineTo(100, 100);
    c.stroke();
}

// start the above loop
animate();

console.log(canvas);