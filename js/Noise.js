class Noise {
    constructor() {
        this.noiseScale = 100;  // Made noise scale larger
        this.timeOffset = 0;
        this.particles = [];
        this.numParticles = 1000;  // Number of particles


        // Initialize particles
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push({
                x: random(width),
                y: random(height),
                size: 2
            });
        }
    }

    update() {}

    display() {
        // Update and draw particles
        this.particles.forEach(particle => {
            // Get noise value for this particle
            let noiseValue = noise(
                particle.x * this.noiseScale, 
                particle.y * this.noiseScale, 
                this.timeOffset
            );

            // Move particle based on noise
            particle.x += map(noiseValue, 0, 1, -2, 2);
            particle.y += map(noiseValue, 0, 1, -2, 2);

            // Wrap particles around edges
            if (particle.x < 0) particle.x = width;
            if (particle.x > width) particle.x = 0;
            if (particle.y < 0) particle.y = height;
            if (particle.y > height) particle.y = 0;

            // Draw particle
            let hue = map(this.noiseValue, 0, 1, 180, 240);  // Blue range
            fill(hue, 80, 90, 0.7);
            noStroke();
            circle(particle.x, particle.y, particle.size);
        });

        this.timeOffset += 0.2;
    }
}