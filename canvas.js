//======= INITIAL CANVAS STUFF ======
// gets the canvas element
var canvas = document.querySelector("canvas");

// set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// canvas context
// used to draw on the canvas
var c = canvas.getContext("2d");



//======= INITIAL HTML STUFF ======
var time_slider = document.getElementById("time");
var zoom_slider = document.getElementById("zoom");

function on_time_change(value) {
    // console.log(time_slider.value);
}

function on_zoom_change(value) {
    // console.log(zoom_slider.value);
    rescale(value * AU);
}

function on_click_stars(value) {
    console.log(value);
    show_stars = value;
}

function on_click_trails(value) {
    show_trails = value;
}

function on_click_grid(value) {
    show_grid = value;
}



//======= HELPER FUNCTIONS ======
function map_radius(mass) {
    var factor = mass;
    while (factor > 1) {
        factor /= 10;
    }
    factor *= 2;
    radius = factor;
    if (mass < 1e23) {
        radius += Math.random() * (4 - 2) + 2;
    } else if (1e23 < mass && mass < 1e24) {
        radius += Math.random() * (6 - 4) + 4;
    } else if (1e24 < mass && mass < 1e25) {
        radius += Math.random() * (8 - 6) + 6;
    } else if (1e25 < mass && mass < 1e26) {
        radius += Math.random() * (10 - 8) + 8;
    } else if (1e26 < mass && mass < 1e27) {
        radius += Math.random() * (12 - 10) + 10;
    } else if (1e27 < mass && mass < 1e28) {
        radius += Math.random() * (14 - 12) + 12;
    } else if (mass > 1e28) {
        radius += Math.random() * (16 - 14) + 14;
    }
    return radius * planet_scale;
}

function rescale(width) {
    width_m = width;
    height_m = (canvas.height / canvas.width) * width_m;
    
    pixels_per_m = canvas.width / width_m;
}



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

        if (show_stars) {
            this.draw();
        }
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
        this.glow();
        c.strokeStyle = this.colour;
        c.fillStyle = this.colour;
        c.beginPath();
        c.arc(this.px, this.py, this.radius, 0, Math.PI * 2, false);
        c.stroke();
        c.fill();
    }

    glow() {
        let glow = this.radius * 2.5;
        // Create gradient
        var grd = c.createRadialGradient(this.px, this.py, 0, this.px, this.py, glow);
        grd.addColorStop(0, this.colour);
        grd.addColorStop(1, "rgba(0, 0, 0, 0)");

        // Fill with gradient
        c.fillStyle = grd;
        c.fillRect(this.px - glow, this.py - glow, this.px + glow, this.px + glow);
    }

    update() {
        this.px = canvas.width / 2;
        this.py = canvas.height / 2;

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
            this.previous_positions.push([this.phys_x, this.phys_y]);
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

        if (show_trails) {
            this.draw_trails();
        }
    }

    draw_trails() {
        for (var i in this.previous_positions) {
            var x = this.parent.px + (this.previous_positions[i][0] * pixels_per_m);
            var y = this.parent.py + (this.previous_positions[i][1] * pixels_per_m);

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

// create a planet with orbital radius, solve for velocity
function new_planet_radius(mass, angle, orbital_radius, radius, colour, parent, stable) {
    var phys_x = orbital_radius * Math.cos(angle);
    var phys_y = orbital_radius * Math.sin(angle);

    var v = Math.sqrt(G * parent.mass / orbital_radius);

    if (!stable) {
        v += v * (Math.random() - 0.5) * orbit_instability;
    }

    var vx = v * Math.cos((Math.PI / 2) - angle);
    var vy = -v * Math.sin((Math.PI / 2) - angle);

    var planet = new Planet(phys_x, phys_y, mass, vx, vy, radius, colour, parent);
    return planet;
}

// create a planet with velocity, solve for orbital radius
function new_planet_velocity(mass, angle, v, radius, colour, parent, stable) {
    var orbital_radius = (G * parent.mass) / (v ** 2);

    var phys_x = orbital_radius * Math.cos(angle);
    var phys_y = orbital_radius * Math.sin(angle);

    if (!stable) {
        v += v * (Math.random() - 0.5) * orbit_instability;
    }

    var vx = v * Math.cos((Math.PI / 2) - angle);
    var vy = -v * Math.sin((Math.PI / 2) - angle);

    var planet = new Planet(phys_x, phys_y, mass, vx, vy, radius, colour, parent);
    return planet;
}



//======= PARAMETERS ======
var running = true;

var show_stars = true;
var show_trails = true;
var show_grid = true;

// planet trail parameters
const num_trail_dots = 12;
const dot_timesteps = 7;    // # of frames between trail dots
const dot_radius_fraction = 1 / 3;  // fraction of the planet's radius for biggest dot
const dot_scale = (1 / num_trail_dots) * dot_radius_fraction;

// physics parameters
var time_step = 0;
const time_scale = 100000;  // higher = faster simulation

const G = 6.67408 * (10 ** -11);    // gravitational constant
const AU = 149597870700;    // astronomical unit constant

const orbit_instability = 0.4;  // how messed up orbits are when created

// canvas scaling
var initial_width_AU = 12;
var width_m;  // width of the canvas in meters
var height_m;    // height of the canvas in meters
var pixels_per_m;  // # of pixels per meter
rescale(initial_width_AU * AU);
zoom_slider.value = initial_width_AU;



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
var sun_radius = 40;
var sun_colour = "#FDB813";

var sun = new Sun(sun_mass, sun_radius, sun_colour);



//======= PLANET STUFF ======
const planet_scale = 0.6;
var num_planets = 30;

var planets = [];

for (var i = 0; i < num_planets; i++) {
    var stable_orbit = false;

    var mass = (Math.random() * 10) * (10 ** (Math.round(Math.random() * 5) + 23));
    var angle = (Math.random() * 2) * Math.PI;

    var orbital_radius = ((Math.random() * 5) + 1) * AU;
    // var velocity = Math.random() * (10 ** 5);

    var radius = map_radius(mass);
    var colour = '#' + Math.random().toString(16).slice(2, 8).toUpperCase();

    var planet = new_planet_radius(mass, angle, orbital_radius, radius, colour, sun, stable_orbit);
    // var planet = new_planet_velocity(mass, angle, velocity, radius, colour, sun, stable_orbit);

    planets.push(planet);
}



//======= CANVAS STUFF ======
function pause() {
    running = !running;
    if (running) {
        animate();
    }
}

function draw_grid() {
    var pixels_per_AU = AU * pixels_per_m;

    var i1 = sun.px;
    var i2 = sun.px;
    // draw vertical lines
    while (i1 < canvas.width || i2 > 0) {
        // right
        c.beginPath();
        c.strokeStyle = "#2e2e2e"
        c.moveTo(i1, 0);
        c.lineTo(i1, canvas.height);
        c.stroke();

        // left
        c.beginPath();
        c.strokeStyle = "#2e2e2e"
        c.moveTo(i2, 0);
        c.lineTo(i2, canvas.height);
        c.stroke();

        i1 += pixels_per_AU;
        i2 -= pixels_per_AU;
    }

    i1 = sun.py;
    i2 = sun.py;
    // draw horizontal lines
    while (i1 < canvas.height || i2 > 0) {
        // right
        c.beginPath();
        c.strokeStyle = "#2e2e2e"
        c.moveTo(0, i1);
        c.lineTo(canvas.width, i1);
        c.stroke();

        // left
        c.beginPath();
        c.strokeStyle = "#2e2e2e"
        c.moveTo(0, i2);
        c.lineTo(canvas.width, i2);
        c.stroke();

        i1 += pixels_per_AU;
        i2 -= pixels_per_AU;
    }
}

function animate() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // call animate in a loop for each frame
    if (running) {
        requestAnimationFrame(animate);
    }

    // clear the canvas
    c.clearRect(0, 0, innerWidth, innerHeight);

    if (show_grid) {
        draw_grid();
    }

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
