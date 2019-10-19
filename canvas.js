// gets the canvas element
var canvas = document.querySelector("canvas");

// set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// context
// used to draw on the canvas
var c = canvas.getContext("2d");

class Sun {
    constructor(mass, radius, colour) {
        // physics stuff (distance in m, mass in kg)
        this.phys_x = 0;
        this.phys_y = 0;

        this.mass = mass;

        // drawing stuff
        this.px = canvas.width / 2;
        this.py = canvas.height / 2;

        this.radius = radius;
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
    }
}

class Planet {
    constructor(phys_x, phys_y, mass, vx, vy, radius, colour, parent) {
        this.parent = parent;

        // physics stuff
        this.phys_x = phys_x;
        this.phys_y = phys_y;

        this.mass = mass;

        this.vx = vx;
        this.vy = vy;
        // this.vy = Math.sqrt(G * this.parent.mass / this.orbital_distance);

        // drawing stuff
        this.px = this.parent.px + (this.phys_x * pixels_per_m);
        this.py = this.parent.py + (this.phys_y * pixels_per_m);

        this.radius = radius;
        this.colour = colour;

        // for trails
        this.previous_positions = [];

        this.dead = false;
    }

    draw() {
        if (Math.abs(this.px - this.parent.px) + this.radius < this.parent.radius && Math.abs(this.py - this.parent.py) + this.radius < this.parent.radius) {
            this.dead = true;
            this.parent.mass += this.mass;
        }

        if (time_step % dot_timesteps == 0) {
            this.previous_positions.push([this.px, this.py]);
            if (this.previous_positions.length > num_trail_dots) {
                this.previous_positions.shift();
            }
        }

        this.px = this.parent.px + (this.phys_x * pixels_per_m);
        this.py = this.parent.py + (this.phys_y * pixels_per_m);

        c.strokeStyle = this.colour;
        c.fillStyle = this.colour;
        c.beginPath();
        c.arc(this.px, this.py, this.radius, 0, Math.PI * 2, false);
        c.stroke();
        c.fill();

        for (var i in this.previous_positions) {
            var x = this.previous_positions[i][0];
            var y = this.previous_positions[i][1];

            c.strokeStyle = this.colour;
            c.fillStyle = this.colour;
            c.beginPath();
            c.arc(x, y, dot_scale * i, 0, Math.PI * 2, false);
            c.stroke();
            c.fill();
        }
    }

    update() {
        if (!this.dead) {
            this.apply_physics();
            this.draw();
        }
    }

    apply_physics() {
        this.phys_x += this.vx * time_scale;
        this.phys_y += this.vy * time_scale;
        this.vx -= this.gravity_force * Math.cos(this.angle) * time_scale;
        this.vy -= this.gravity_force * Math.sin(this.angle) * time_scale;
    }

    log() {
        console.log("Sun", this.parent.px, this.parent.py);
        console.log("Planet", this.px, this.py);
        console.log("Orbital Distance", this.orbital_distance / AU);
        console.log("Gravity_force", this.gravity_force);
        console.log("Angle", this.angle);
    }

    // calculate the distance between the centers of the sun and planet
    get orbital_distance() {
        var squared_distance = (this.phys_x ** 2) + (this.phys_y ** 2);
        return Math.sqrt(squared_distance);
    }

    get gravity_force() {
        return G * this.parent.mass / (this.orbital_distance ** 2);
    }

    get angle() {
        return Math.atan2(this.phys_y, this.phys_x);
    }
}

function new_planet_radius(mass, angle, orbital_radius, radius, colour, parent) {
    // phys_x, phys_y, mass, vx, vy, radius, colour, parent)
    var phys_x = orbital_radius * Math.cos(angle);
    var phys_y = orbital_radius * Math.sin(angle);

    var v = Math.sqrt(G * parent.mass / orbital_radius);
    v *= (Math.random() * 2);
    var vx = v * Math.cos((Math.PI / 2) - angle);
    var vy = -v * Math.sin((Math.PI / 2) - angle);

    var mass_factor = mass / parent.mass;
    // var radius = mass_factor * 3000000;

    var planet = new Planet(phys_x, phys_y, mass, vx, vy, radius, colour, parent);
    return planet;
}

function new_planet_velocity(mass, angle, velocity, radius, colour, parent) {
    return NaN;
}

const num_trail_dots = 15;
const dot_timesteps = 5;
const dot_scale = 0.1;

// physics constancts
var time_step = 0;
const time_scale = 100000;

const G = 6.67408 * (10 ** -11);
const AU = 149597870700;    // meters

// canvas scaling
var width_m = 12 * AU;
var height_m = (canvas.height / canvas.width) * width_m;

var pixels_per_m = canvas.width / width_m;

// create planets
var planets = [];

var sun_mass = 2 * (10 ** 30);
var sun_radius = 40;
var sun_colour = "#FDB813";

var sun = new Sun(sun_mass, sun_radius, sun_colour);
// planets.push(sun);

// var planet = new Planet(10, "#6c3bd4", sun);
// planets.push(planet);

// var planet_mass = 5.972 * (10 ** 24);
// var planet_angle = 0;
// var planet_orbital_radius = 2 * AU;
// var planet_radius = 10;
// var planet_colour = "#6c3bd4";

var num_planets = 500;

// create planets
for (var i = 0; i < num_planets; i++) {
    var mass = (Math.random() * 10) * (10 ** (Math.round(Math.random() * 5) + 20));
    var angle = (Math.random() * 2) * Math.PI;
    var orbital_radius = ((Math.random() * 5) + 1) * AU;

    var radius = Math.round(Math.random() * 5) + 3;
    var colour = '#' + Math.random().toString(16).slice(2, 8).toUpperCase();

    var planet = new_planet_radius(mass, angle, orbital_radius, radius, colour, sun);
    planets.push(planet);
}

function animate() {
    // call animate in a loop for each frame
    requestAnimationFrame(animate);

    // clear the canvas
    c.clearRect(0, 0, innerWidth, innerHeight);

    drawGrid();

    // call update on every celestial body
    for (var i in planets) {
        planets[i].update();
    }
    sun.update();

    time_step += 1;
}

function drawGrid() {
    // draw a line
    for (let i = 0; i <= width_m; i += AU) {
        c.beginPath();
        // c.strokeStyle = "#fa34a3";
        c.strokeStyle = "rgba(255, 255, 255, 0.3)"
        c.moveTo(i * pixels_per_m, 0);
        c.lineTo(i * pixels_per_m, canvas.height);
        c.stroke();
    }
    for (let i = 0; i <= height_m; i += AU) {
        c.beginPath();
        // c.strokeStyle = "#fa34a3";
        c.strokeStyle = "rgba(255, 255, 255, 0.3)"
        c.moveTo(0, i * pixels_per_m);
        c.lineTo(canvas.width, i * pixels_per_m);
        c.stroke();
    }
}

// start the above loop
animate();

console.log(canvas);