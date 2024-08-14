const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c.fillStyle = 'black';
c.fillRect(0, 0, canvas.width, canvas.height);

class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.rotation = 0;
    }

    draw() {
        c.save();
        c.translate(this.position.x, this.position.y);
        c.rotate(this.rotation);
        c.translate(-this.position.x, -this.position.y);
        c.beginPath();
        // Draw circle
        c.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
        c.fillStyle = '#b7c7a5';
        c.fill();

        // Draw triangle
        c.beginPath();
        c.moveTo(this.position.x + 30, this.position.y);
        c.lineTo(this.position.x - 10, this.position.y - 10);
        c.lineTo(this.position.x - 10, this.position.y + 10);
        c.closePath();
        c.strokeStyle = 'white';
        c.stroke();
        c.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Projectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 5;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        c.closePath();
        c.fillStyle = 'white';
        c.fill();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Asteroid {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = Math.random() * 30 + 10; // Random radius between 10 and 40
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        c.closePath();
        c.strokeStyle = 'white';
        c.stroke();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

const player = new Player({
    position: { x: canvas.width / 2, y: canvas.height / 2 },
    velocity: { x: 0, y: 0 }
});

const keys = {
    w: { pressed: false },
    a: { pressed: false },
    d: { pressed: false }
}

const SPEED = 3;
const ROTATIONAL_SPEED = 0.05;
const FRICTION = 0.97;
const PROJECTILE_SPEED = 5;

const projectiles = [];
const asteroids = []; // Initialize the asteroids array

// Add a new asteroid every 3 seconds
window.setInterval(() => {

    
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const vx = (Math.random() - 0.5) * 4; // Random velocity between -1 and 1
    const vy = (Math.random() - 0.5) * 4; // Random velocity between -1 and 1

    asteroids.push(
        new Asteroid({
            position: { x, y },
            velocity: { x: vx, y: vy }
        })
    );
}, 3000);

function animate() {
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(animate);

    player.update();

    // Update and draw projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        projectile.update();

        // Remove projectile if it goes off-screen
        if (
            projectile.position.x < 0 ||
            projectile.position.x > canvas.width ||
            projectile.position.y < 0 ||
            projectile.position.y > canvas.height
        ) {
            projectiles.splice(i, 1);
        }
    }

    // Update and draw asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];
        asteroid.update();

        // Remove asteroid if it goes off-screen
        if (
            asteroid.position.x < 0 ||
            asteroid.position.x > canvas.width ||
            asteroid.position.y < 0 ||
            asteroid.position.y > canvas.height
        ) {
            asteroids.splice(i, 1);
        }
    }

    // Handle player movement
    if (keys.w.pressed) {
        player.velocity.x = Math.cos(player.rotation) * SPEED;
        player.velocity.y = Math.sin(player.rotation) * SPEED;
    } else {
        player.velocity.x *= FRICTION;
        player.velocity.y *= FRICTION;
    }

    if (keys.a.pressed) {
        player.rotation -= ROTATIONAL_SPEED;
    } 
    if (keys.d.pressed) {
        player.rotation += ROTATIONAL_SPEED;
    }
}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW':
            keys.w.pressed = true;
            break;
        case 'KeyA':
            keys.a.pressed = true;
            break;
        case 'KeyD':
            keys.d.pressed = true;
            break;
        case 'Space':
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + Math.cos(player.rotation) * PROJECTILE_SPEED,
                    y: player.position.y + Math.sin(player.rotation) * PROJECTILE_SPEED
                },
                velocity: {
                    x: Math.cos(player.rotation) * PROJECTILE_SPEED,
                    y: Math.sin(player.rotation) * PROJECTILE_SPEED
                }
            }));
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW':
            keys.w.pressed = false;
            break;
        case 'KeyA':
            keys.a.pressed = false;
            break;
        case 'KeyD':
            keys.d.pressed = false;
            break;
    }
});
