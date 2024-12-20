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
        this.durations = [];
        this.locations = [];
    }
    push(interaction) {
        const n = this.interactions.length;
        if (n > 0) {
            this.durations.push(interaction.timestamp - this.interactions[n - 1].timestamp);
            this.locations.push(interaction.loc);
        }
        this.interactions.push(interaction);
    }
}

class DetectedPattern {
    constructor(temporal, spacial, summary) {
        this.temporal = temporal; // "rhythmic" --- "chaotic"
        this.spacial = spacial; // "clustered" --- "scattered"
        this.summary = summary; // string summary of the list of interactions
    }
}

class PatternAnalyzer {
    constructor() {
        this.aggregator = new InteractionAggregator();
        // const WORKER_URL = process.env.NODE_ENV === 'development' 
        //     ? 'http://127.0.0.1:8787'
        //     : 'https://cairn-worker.workers.dev';
        const WORKER_URL = 'http://127.0.0.1:8787';
        // const WORKER_URL = 'https://cairn-worker.cairn-worker.workers.dev/';
        this.client = new CairnClient(WORKER_URL);
    }

    push(interaction) {
        this.aggregator.push(interaction);
        return this.eval();
    }

    eval() {
        const shouldEnd = Math.floor(Math.random() * (101));
        console.log("shouldEnd: " + shouldEnd);
        if (shouldEnd > 90) {
            const response = this.client.makeRequest(
                new DetectedPattern(this.analyzeRhythm(this.aggregator.durations), 
                this.analyzeSpacial(this.aggregator.locations), 
                `The interaction involved ${this.aggregator.interactions.length+1} clicks.`
            ));
            // let placeholder = 'A weathered whisper emerges from ancient stone... \nWhen raindrops cluster before the wind claims them, do they remember their unity? Your gestures echo the dance of autumn leaves - gathering in communion before the decisive gust that charts their journey. \nSuch is the nature of moments that build toward change: first the gathering, then the leap. \nWhat patterns do you recognize in your own moments of hesitation before transformation? \nThe stones hold your silence...';
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
    analyzeRhythm(timestamps) {
        if (timestamps.length < 2) return 0;
        
        // Calculate intervals between timestamps
        const intervals = [];
        for (let i = 1; i < timestamps.length; i++) {
            intervals.push(timestamps[i] - timestamps[i-1]);
        }
        
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

    makePrompt() {
        return `Context: You are an ancient stone cairn, a witness to human interactions. Your consciousness emerges from patterns of user engagement.

            Recent Interaction Pattern: 4 clicks with close proximity to each other, followed by a diagonal drag
            Interaction Characteristics: 
            - Spatial complexity: clustered click
            - Temporal rhythm: rapid

            Philosophical Response Guidelines:
            1. Generate a response that:
            - Is metaphorical and non-literal
            - Connects the interaction to broader existential themes
            - Suggests multiple layers of meaning
            - Invites self-reflection
            - Uses poetic, slightly enigmatic language
            - Concise

            2. Potential Thematic Explorations:
            - Relationship between chaos and order
            - Temporality of human gestures
            - Emergence of meaning through interaction
            - Consciousness and intentionality
            - Boundaries between self and environment

            3. Tone: Meditative, slightly mysterious, compassionate

            IMPORTANT: Do not directly describe the interaction. Transform it into a philosophical reflection.`;
    }
}