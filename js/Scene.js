// invoked from p5js functions


class Scene {

    constructor() {
        this.stick_y = -1;
        this.interval = 30;
        this.delta = 5;
        this.counter = 0;
        this.area = document.getElementById('scene');
    }

    update() {
        this.counter = this.counter + 1;
        if (this.stick_y > 0 && this.counter > this.interval) {
            this.stick_y = this.stick_y + this.delta;
            this.delta = this.delta * -1;
            this.counter = 0;
        }
    }

    display(img, stickImg) {
        background(255);
        
        // Calculate aspect ratio of the image
        let imgAspectRatio = img.width / img.height;
        let windowAspectRatio = window.innerWidth / window.innerHeight;
        
        let newWidth, newHeight;
        let ratio = 0.6;
        
        // Determine dimensions while maintaining aspect ratio
        if (windowAspectRatio > imgAspectRatio) {
            // Window is wider than image
            newHeight = window.innerHeight * ratio;
            newWidth = window.innerHeight * imgAspectRatio * ratio;
        } else {
            // Window is taller than image
            newWidth = window.innerWidth * ratio;
            newHeight = window.innerWidth / imgAspectRatio * ratio;
        }

        // Center the image
        imageMode(CENTER);
        image(img, window.innerWidth/2, window.innerHeight/2, newWidth, newHeight);

        // display phone screen
        let phoneW = newWidth*0.25;
        let phoneH = newHeight*0.65;
        push();
        rect(window.innerWidth/2 - phoneW/2, window.innerHeight/2 - phoneH/2*1.2, phoneW, phoneH); 
        pop();

        if (this.stick_y < 0) {
            this.stick_y = window.innerHeight/2 - phoneH/7;
        } 

        // display stick figure
        image(stickImg, window.innerWidth/2 - phoneW/4, this.stick_y, newWidth*0.06, newHeight*0.17);
        
    }

    windowResized() {
        resizeCanvas(window.innerWidth, window.innerHeight);
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