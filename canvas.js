var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// context
// used to draw on the canvas
var c = canvas.getContext("2d");

class Sun {
    constructor() {
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
    constructor(orbital_radius, radius, colour, sun) {
        this.orbital_radius = orbital_radius;
        this.radius = radius;
        this.sun = sun;

        this.px = sun.px + this.orbital_radius;
        this.py = sun.py;

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

var objects = [];

var sun = new Sun();
objects.push(sun);

var planet = new Planet(400, 10, "#6c3bd4", sun);
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
