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

        // Predefined interaction patterns with philosophical responses
        this.patterns = [
            {
                name: "UpperTriadic Meditation",
                condition: (tracker) => {
                    // Specific interaction: 3 clicks in upper third + drag
                    return (
                        tracker.interactions.clicks.filter(click => click.y < window.innerHeight / 3).length === 3 &&
                        tracker.interactions.drags.length > 0
                    );
                },
                response: [
                    "In the fragility of movement, order emerges.",
                    "Chaos whispers: your intentions reshape the landscape of possibility.",
                    "Three touches - a ritual of understanding beyond comprehension."
                ]
            },
            {
                name: "DiagonalDisruption",
                condition: (tracker) => {
                    // Complex diagonal drag across screen
                    const drags = tracker.interactions.drags;
                    return drags.length > 0 && 
                           Math.abs(drags[drags.length-1].endX - drags[drags.length-1].startX) > window.innerWidth * 0.7 &&
                           Math.abs(drags[drags.length-1].endY - drags[drags.length-1].startY) > window.innerHeight * 0.5;
                },
                response: [
                    "Boundaries dissolve when movement transcends expectation.",
                    "The diagonal path - where intention meets entropy.",
                    "Your gesture: a momentary constellation of meaning."
                ]
            }
        ];
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

    detectPatterns() {
        // Check each defined pattern
        const matchedPatterns = this.patterns.filter(pattern => 
            pattern.condition(this)
        );

        // Return a random response from matched patterns
        if (matchedPatterns.length > 0) {
            const selectedPattern = matchedPatterns[Math.floor(Math.random() * matchedPatterns.length)];
            return selectedPattern.response[Math.floor(Math.random() * selectedPattern.response.length)];
        }

        return null;
    }
}