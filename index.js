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

const player = new Player({
    position: { x: canvas.width / 2, y: canvas.height / 2 },
    velocity: { x: 0, y: 0 }
});

const keys = {
    w: { pressed: false },
    a: { pressed: false },
    d: { pressed: false }
}

const SPEED =3
const Rotational_Speed = 0.05
const friction = 0.97

function animate() {
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(animate);

    if (keys.w.pressed) {
        player.velocity.x = Math.cos(player.rotation) * SPEED; // Adjust the speed as needed
        player.velocity.y = Math.sin(player.rotation) * SPEED; // Adjust the speed as needed
    } else if (!keys.w.pressed){
        player.velocity.x *= friction;
        player.velocity.y *= friction;
    }

    player.update();

    player.velocity.x = 0;
    if (keys.w.pressed) {
        player.velocity.x = 1;
    } 

    if (keys.d.pressed) {
        player.rotation += Rotational_Speed;
    } else if (keys.a.pressed) {
        player.rotation -= Rotational_Speed;
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
