//======= INITIAL CANVAS STUFF ======
// gets the canvas element
var canvas = document.querySelector("canvas");

// set canvas size
canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 30;

// canvas context
// used to draw on the canvas
var c = canvas.getContext("2d");



//======= CLASS DEFINITIONS ======
class BgStar {
    constructor() {
        this.px = Math.random() * canvas.width;
        this.py = Math.random() * canvas.height;
        this.radius = Math.random() * 1.6;

        this.r = 220 + Math.round(Math.random() * 30);
        this.g = 220;
        this.b = 220 + Math.round(Math.random() * 30);
        this.alpha = Math.random();
    }

    update() {
        if (this.alpha < 0.05) {
            this.px = Math.random() * canvas.width;
            this.py = Math.random() * canvas.height;
        }

        this.alpha += ((Math.random() - 0.5) * 2) * twinkliness;
        this.alpha = Math.max(0, Math.min(1.0, this.alpha));
        this.draw();
    }

    draw() {
        c.beginPath();
        c.arc(this.px, this.py, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.colour;
        c.fill();
    }

    get colour() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.alpha + ")";
    }
}

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
            c.arc(x, y, i * this.radius * dot_scale, 0, Math.PI * 2, false);
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



//======= PLANET CREATION FUNCTIONS ======
function new_planet_radius(mass, angle, orbital_radius, radius, colour, parent) {
    var phys_x = orbital_radius * Math.cos(angle);
    var phys_y = orbital_radius * Math.sin(angle);

    var v = Math.sqrt(G * parent.mass / orbital_radius);
    v += v * (Math.random() - 0.5) * .4;
    var vx = v * Math.cos((Math.PI / 2) - angle);
    var vy = -v * Math.sin((Math.PI / 2) - angle);

    var planet = new Planet(phys_x, phys_y, mass, vx, vy, radius, colour, parent);
    return planet;
}

function new_planet_velocity(mass, angle, velocity, radius, colour, parent) {
    return NaN;
}



//======= PARAMETERS ======
var running = true;

// planet trail parameters
const num_trail_dots = 10;
const dot_timesteps = 5;    // # of frames between trail dots
const dot_radius_fraction = 1 / 3;  // fraction of the planet's radius for biggest dot
const dot_scale = (1 / num_trail_dots) * dot_radius_fraction;

// physics parameters
var time_step = 0;
const time_scale = 100000;  // higher = faster simulation

const G = 6.67408 * (10 ** -11);    // gravitational constant
const AU = 149597870700;    // astronomical unit constant

// canvas scaling
var width_m = 12 * AU;  // width of the canvas in meters
var height_m = (canvas.height / canvas.width) * width_m;    // height of the canvas in meters

var pixels_per_m = canvas.width / width_m;  // # of pixels per meter



//======= BACKGROUND STAR STUFF ======
const twinkliness = 0.1;    // higher = more twinkly
var num_stars = 1500;

var bg_stars = [];

// create stars
for (var i = 0; i < num_stars; i++) {
    bg_stars.push(new BgStar());
}



//======= SUN STUFF ======
var sun_mass = 2 * (10 ** 30);
var sun_radius = 35;
var sun_colour = "#FDB813";

var sun = new Sun(sun_mass, sun_radius, sun_colour);



//======= PLANET STUFF ======
var planets = [];

var num_planets = 30;

for (var i = 0; i < num_planets; i++) {
    var mass = (Math.random() * 10) * (10 ** (Math.round(Math.random() * 5) + 20));
    var angle = (Math.random() * 2) * Math.PI;
    var orbital_radius = ((Math.random() * 5) + 1) * AU;

    var radius = Math.round(Math.random() * 5) + 3;
    var colour = '#' + Math.random().toString(16).slice(2, 8).toUpperCase();

    var planet = new_planet_radius(mass, angle, orbital_radius, radius, colour, sun);
    planets.push(planet);
}



//======= CANVAS STUFF ======
function pause() {
    running = !running;
    if (running) {
        animate();
    }
}

function drawGrid() {
    // draw vertical lines
    for (let i = 0; i <= width_m; i += AU) {
        c.beginPath();
        c.strokeStyle = "#2e2e2e"
        c.moveTo(i * pixels_per_m, 0);
        c.lineTo(i * pixels_per_m, canvas.height);
        c.stroke();
    }
    // draw horizontal lines
    for (let i = 0; i <= height_m; i += AU) {
        c.beginPath();
        c.strokeStyle = "#2e2e2e"
        c.moveTo(0, i * pixels_per_m);
        c.lineTo(canvas.width, i * pixels_per_m);
        c.stroke();
    }
}

function animate() {
    // call animate in a loop for each frame
    if (running) {
        requestAnimationFrame(animate);
    }

    // clear the canvas
    c.clearRect(0, 0, innerWidth, innerHeight);

    // drawGrid();

    for (var i in bg_stars) {
        bg_stars[i].update();
    }

    for (var i in planets) {
        planets[i].update();
    }
    sun.update();

    time_step += 1;
}


// start the above loop
animate();
