// invoked from p5js functions


class Scene {

    constructor() {
        // this.stick = new Stick();
    }

    update() {
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

        // display stick figure
        image(stickImg, window.innerWidth/2 - phoneW/4, window.innerHeight/2 - phoneH/7, newWidth*0.06, newHeight*0.17);
        
    }

    windowResized() {
        resizeCanvas(window.innerWidth, window.innerHeight);
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