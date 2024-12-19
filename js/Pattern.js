class Pattern {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.maxRadius = 15;
        this.currentRadius = 0;
        this.growthRate = random(3, 6);
        this.opacity = 100;
        this.fadeRate = 100 / this.maxRadius;
        
    }

    update() {
        // Grow the radius
        if (this.currentRadius < this.maxRadius)
            this.currentRadius += this.growthRate;
        
        
    }

    display() {
        // Set stroke with fading opacity
        stroke(0, 80, 90, this.opacity);
        noFill();
        strokeWeight(1);

        let subRadius = this.currentRadius * 1.4142; // sqrt(2)/2

        circle(
            this.x - this.currentRadius, 
            this.y, 
            subRadius
        );
        circle(
            this.x + this.currentRadius, 
            this.y, 
            subRadius
        );
        circle(
            this.x, 
            this.y - this.currentRadius, 
            subRadius
        );
        circle(
            this.x, 
            this.y + this.currentRadius, 
            subRadius
        );
    }

    isDead() {
        // Pattern dies when opacity reaches zero
        return false;
    }
}