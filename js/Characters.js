// invoked from p5js functions

class Characters {
    constructor() {
        textAlign(CENTER, CENTER);
        textSize(10);
        this.size = window.innerWidth * window.innerHeight / 4500;
        this.chars = []
        for (let i = 0; i < this.size; i++) {
            this.chars.push({
                x: random(width),
                y: random(height),
                char: char(int(random(33, 126))),
                // color: color(random(255), random(255), random(255))
                color: color(0, 0, 0)
            });
        }
    }

    update() {}

    display() {
        this.chars.forEach(char => {
            fill(char.color);
            text(char.char, char.x + random(1.5), char.y + random(1.5));
        });
    }
}