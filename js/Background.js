// invoked from p5js functions

class Background {
    constructor() {
        this.characters = new Characters();
        // Array to store all radial patterns
        this.patterns = [];
        this.noise = new Noise();
    }

    update() {
        this.characters.update();
        this.noise.update();
    }

    display() {
        this.characters.display();
        // this.noise.display();

        // draw patterns
        for (let i = this.patterns.length - 1; i >= 0; i--) {
            this.patterns[i].update();
            this.patterns[i].display();

            // Remove pattern if it's fully faded
            if (this.patterns[i].isDead()) {
                this.patterns.splice(i, 1);
            }
        }
    }

    mousePressed(mouseX, mouseY) {
        // Create a new radial pattern at mouse click location
        // this.patterns.push(new Pattern(mouseX, mouseY));
    }
}