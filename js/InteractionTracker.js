class InteractionTracker {
    constructor() {
        // Tracks different interaction types and their sequences
        this.interactions = {
            clicks: [],          // Track click locations and timing
            drags: [],            // Track drag movements
            hoverPatterns: [],    // Track hover sequences
            timeBasedContext: {
                sessionStartTime: Date.now(),
                lastInteractionTime: null,
                totalInteractionDuration: 0
            }
        };
    }

    recordClick(x, y) {
        this.interactions.clicks.push({
            x, 
            y, 
            timestamp: Date.now()
        });

        // Prune old interactions to prevent memory bloat
        this.interactions.clicks = this.interactions.clicks.slice(-10);
    }

    recordDrag(startX, startY, endX, endY) {
        this.interactions.drags.push({
            startX, 
            startY, 
            endX, 
            endY,
            timestamp: Date.now()
        });

        this.interactions.drags = this.interactions.drags.slice(-5);
    }
}