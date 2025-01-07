// invoked from p5js functions

class Curve {
    constructor() {
        this.points = [];
        this.noiseOffset = random(1000);
        this.color = color(random(200, 255), random(200, 255), 255, 50);
        this.yStart = random(height);
        this.amplitude = random(30, 80);
        this.speed = random(0.001, 0.003);
    }

    update() {
        this.points = [];
        for (let x = 0; x < width; x += 20) {
            let y = this.yStart + 
                sin(x * 0.01 + frameCount * this.speed) * this.amplitude +
                noise(x * 0.01, this.noiseOffset + frameCount * 0.01) * this.amplitude;
            this.points.push(createVector(x, y));
        }
    }

    draw() {
        noFill();
        stroke(this.color);
        strokeWeight(2);
        beginShape();
        for (let point of this.points) {
            curveVertex(point.x, point.y);
        }
        endShape();
    }
}

class Scene {
    constructor() {
        this.characters = new Characters();
        this.area = document.getElementById('scene');
        this.isDragging = false;
        this.lastMoveTime = Date.now();
        this.curves = [];
        // Initialize curves
        for (let i = 0; i < 5; i++) {
            this.curves.push(new Curve());
        }
    }

    update() {
        this.characters.update();
        // Update and draw curves
        this.curves.forEach(curve => {
            curve.update();
        });
    }

    display() {
        this.characters.display();
        this.curves.forEach(curve => {
            curve.draw();
        });
    }

    createParticles(x, y) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            const angle = (Math.PI * 2 * i) / 8;
            const distance = 50 + Math.random() * 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            this.area.appendChild(particle);
            particle.addEventListener('animationend', () => particle.remove());
        }
    }

    createTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'trail';
        trail.style.left = `${x - 5}px`;
        trail.style.top = `${y - 5}px`;
        trail.style.background = `hsl(${Math.random() * 360}, 70%, 50%)`;
        this.area.appendChild(trail);
        trail.addEventListener('animationend', () => trail.remove());
    }

    handlePressed(mouseX, mouseY) {
        const effects = [
            () => this.createParticles(mouseX, mouseY)
        ];
        effects[Math.floor(Math.random() * effects.length)]();
        console.log("dragging true");
        this.isDragging = true;
    }

    handleReleased() {
        console.log("dragging false");
        this.isDragging = false;
    }

    handleMoved(mouseX, mouseY) {
        const now = Date.now();
        if (now - this.lastMoveTime < this.moveThrottle) return;
        
        this.lastMoveTime = now;
        
        if (this.isDragging) {
            this.createTrail(mouseX, mouseY);
        }
    }
}