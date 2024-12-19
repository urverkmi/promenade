class Cairn {
    constructor() {
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max-min+1)) + min;
        }
        this.cairnHeight = getRandomInt(3, 8);
        this.spacing = window.innerHeight/16;
        this.params = [];
        this.ellipseY = [window.innerHeight-this.spacing];
        this.isTalking = false;
        for (let i = 0; i < this.cairnHeight; i++) {
            // Random ellipse parameters
            let height = getRandomInt(30, 100);
            this.params.push({
                width: getRandomInt(50, 200),
                height: height,
                rotation: Math.random() * Math.PI / 2 - Math.PI / 4,
                texture: getRandomInt(1, 3),
            });
            if (i > 0) {
                this.ellipseY.push(this.ellipseY[i-1]-height/1.2);
            }
        }
    }

    update() {}

    display() {
        function draw(ctx, pattern, texture, ellipseY, param) {
            ctx.save();

                // Translate to click position
                ctx.translate(window.innerWidth/2, ellipseY-param.height/2);
                
                // Rotate
                ctx.rotate(param.rotation);

                // Create clipping path for ellipse
                ctx.beginPath();
                ctx.ellipse(0, 0, param.width / 2, param.height / 2, 0, 0, Math.PI * 2);
                ctx.clip();

                ctx.save();

                // Calculate scaling factors to fit texture to ellipse bounds
                const scaleX = param.width / texture.width;
                const scaleY = param.height / texture.height;

                // Scale texture to fit exactly in the ellipse bounds
                ctx.scale(scaleX, scaleY);
                
                // Calculate pattern bounds
                const patternX = -texture.width/2;
                const patternY = -texture.height/2;

                // Set pattern as fill style
                ctx.fillStyle = pattern;

                // Draw pattern-filled rectangle
                ctx.fillRect(patternX, patternY, texture.width, texture.height);

                ctx.restore();
                ctx.restore();
        }
        // create and load the texture images outside the function
        const texture1 = new Image();
        const texture2 = new Image();
        const texture3 = new Image();

        texture1.src = './assets/textures/marble.jpg';
        texture2.src = './assets/textures/stone.jpg';
        texture3.src = './assets/textures/terrazo.jpg';

        let cairn = this;

        // Wait for texture to load before drawing
        texture1.onload = function() {
            // Create pattern once texture is loaded
            const pattern = ctx.createPattern(texture1, 'repeat');
            for (let i = 0; i < cairn.cairnHeight; i++) {
                if (cairn.params[i].texture == 1) {
                    draw(ctx, pattern, texture1, cairn.ellipseY[i], cairn.params[i]);
                }
            }
        };
        // Handle potential texture loading errors
        texture1.onerror = function() {
            console.error('Error loading texture image');
        };

        // repeat for all the textures
        texture2.onload = function() {
            const pattern = ctx.createPattern(texture2, 'repeat');
            for (let i = 0; i < cairn.cairnHeight; i++) {
                if (cairn.params[i].texture == 2) {
                    draw(ctx, pattern, texture2, cairn.ellipseY[i], cairn.params[i]);
                }
            }
        };
        texture2.onerror = function() {
            console.error('Error loading texture image');
        };

        texture3.onload = function() {
            const pattern = ctx.createPattern(texture3, 'repeat');
            for (let i = 0; i < cairn.cairnHeight; i++) {
                if (cairn.params[i].texture == 3) {
                    draw(ctx, pattern, texture3, cairn.ellipseY[i], cairn.params[i]);
                }
            }
        };
        texture3.onerror = function() {
            console.error('Error loading texture image');
        };
    }

    async talk() {
        function splitResponse(response) {
            // Split into initial segments
            const segments = response.split(/\n|\?|\. /g);

            // Restore the proper endings
            return segments.map((segment, i) => {
                segment = segment.trim();
                
                // Skip empty segments
                if (!segment) return '';
                
                // Check original text to determine proper ending
                const nextFewChars = response.slice(response.indexOf(segment) + segment.length, response.indexOf(segment) + segment.length + 4);
                
                if (nextFewChars.startsWith('...')) {
                    return segment + '...';
                } else if (nextFewChars.startsWith('?')) {
                    return segment + '?';
                } else if (nextFewChars.startsWith('. ')) {
                    return segment + '.';
                }
                return segment;
            }).filter(s => s); // Remove empty strings
        }
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        function createElement(className, textContent) {
            const element = document.createElement('div');
            element.className = className;
            element.textContent = textContent;

            document.body.appendChild(element);

            element.addEventListener('animationend', (event) => {
                if (event.animationName === 'fadeOut') {
                    element.remove();
                }
            });
            return element;
        }
        if (!this.isTalking) {
            this.isTalking = true;
            let response = 'A weathered whisper emerges from ancient stone... \nWhen raindrops cluster before the wind claims them, do they remember their unity? Your gestures echo the dance of autumn leaves - gathering in communion before the decisive gust that charts their journey. \nSuch is the nature of moments that build toward change: first the gathering, then the leap. \nWhat patterns do you recognize in your own moments of hesitation before transformation? \nThe stones hold your silence...';
            const messages = splitResponse(response);
            for (let i = 0; i < messages.length; i++) {
                if (i > 0 && i < messages.length-1) {
                    const element = createElement('speech-bubble', messages[i]);
                    // Position bubble above click point
                    element.style.left = window.innerWidth/2 + 'px';
                    element.style.right = window.innerWidth/20 + 'px';
                    element.style.top = (this.ellipseY[this.ellipseY.length-1] - (this.params[this.params.length-1].height + this.params[this.params.length-1].width + this.spacing)/1.5) + 'px';
                } else {
                    createElement('non-dialogue-text', messages[i]);
                }

                await delay(6000);
            }
            this.isTalking = false;
        }
    }
}