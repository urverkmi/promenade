class Loc {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Interaction {
    constructor(type, duration, loc, shape) {
        this.type = type;
        this.duration = duration;
        this.loc = loc;
        this.shape = shape;
        this.timestamp = Date.now();
    }
}

class InteractionAggregator {
    constructor() {
        this.interactions = [];
        this.intervals = [];
        this.locations = [];
    }
    push(interaction) {
        const n = this.interactions.length;
        if (n > 0) {
            this.intervals.push(interaction.timestamp - this.interactions[n - 1].timestamp);
            this.locations.push(interaction.loc);
        }
        this.interactions.push(interaction);
    }
}

class DetectedPattern {
    constructor(temporal, spacial, summary) {
        this.type = 'promenade';
        this.temporal = temporal; // "rhythmic" --- "chaotic"
        this.spacial = spacial; // "clustered" --- "scattered"
        this.summary = summary; // string summary of the list of interactions
    }
}

class PatternAnalyzer {
    constructor() {
        this.aggregator = new InteractionAggregator();
        // const WORKER_URL = 'http://127.0.0.1:8787';
        const WORKER_URL = 'https://cairn-worker.cairn-worker.workers.dev/';
        this.client = new Client(WORKER_URL);
    }

    async push(interaction, processor) {
        this.aggregator.push(interaction);
        const response = await this.eval();
        if (response.length > 0) {
            processor.display(response);
            processor.setShapes(response);
        }
    }

    eval() {
        const shouldEnd = Math.floor(Math.random() * (101));
        console.log("shouldEnd: " + shouldEnd);
        if (shouldEnd > 80) {
            const response = this.client.makeRequest(
                new DetectedPattern(
                    this.analyzeRhythm(this.aggregator.intervals), 
                    this.analyzeSpacial(this.aggregator.locations), 
                    `The interaction involved ${this.aggregator.interactions.length+1} ${this.analyzeClickingSpeed(this.aggregator.intervals)} clicks.`
            ));
            this.aggregator = new InteractionAggregator(); // reset
            return response;
        } else {
            return "";
        }
    }

    /**
     * Analyzes the rhythmic pattern of timestamps
     * @param {number[]} timestamps - Array of timestamps in milliseconds
     * @returns {number} Score between 0 (rhythmic) and 1 (chaotic)
     */
    analyzeRhythm(intervals) {
        if (intervals.length < 1) return 0;
        
        // Calculate mean interval
        const meanInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        
        // Calculate variance of intervals
        const variance = intervals.reduce((acc, interval) => {
            return acc + Math.pow(interval - meanInterval, 2);
        }, 0) / intervals.length;
        
        // Calculate coefficient of variation (standardized measure of dispersion)
        const coefficientOfVariation = Math.sqrt(variance) / meanInterval;
        
        // Normalize to 0-1 range
        // Using a sigmoid function to map CV to 0-1
        const normalizedScore = 1 / (1 + Math.exp(-coefficientOfVariation + 2));
        
        return Math.min(Math.max(normalizedScore, 0), 1);
    }

    /**
     * Analyzes spatial clustering of points
     * @param {Array<{x: number, y: number}>} points - Array of point coordinates
     * @returns {number} Score between 0 (clustered) and 1 (scattered)
     */
    analyzeSpacial(points) {
        if (points.length < 2) return 0;
        
        // Calculate diagonal length of window for normalization
        const windowDiagonal = Math.sqrt(window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight);
        
        // Calculate centroid
        const centroid = {
            x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
            y: points.reduce((sum, p) => sum + p.y, 0) / points.length
        };
        
        // Calculate average distance from centroid
        const avgDistance = points.reduce((sum, point) => {
            const dx = point.x - centroid.x;
            const dy = point.y - centroid.y;
            return sum + Math.sqrt(dx * dx + dy * dy);
        }, 0) / points.length;
        
        // Normalize by window diagonal
        // A perfectly scattered distribution would have points evenly distributed,
        // with average distance approximately windowDiagonal/4
        const normalizedScore = Math.min(avgDistance / (windowDiagonal / 4), 1);
        
        return normalizedScore;
    }

    /**
     * Analyzes clicking speed based on intervals between clicks
     * @param {number[]} intervals - Array of intervals between clicks in milliseconds
     * @returns {string} Description of clicking speed
     */
    analyzeClickingSpeed(intervals) {
        if (intervals.length === 0) return "moderate";
        
        // Calculate average interval
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        
        // Define thresholds (in milliseconds)
        if (avgInterval < 150) return "frantic";      // Faster than 6.67 clicks per second
        if (avgInterval < 300) return "rapid";        // Faster than 3.33 clicks per second
        if (avgInterval < 800) return "quick";     // Faster than 1.25 clicks per second
        if (avgInterval < 2000) return "relaxed";     // Faster than 0.5 clicks per second
        return "sluggish";                            // Slower than 0.5 clicks per second
    }

}