class Cairn {
    constructor() {
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max-min)) + min;
        }
        this.cairnHeight = getRandomInt(3, 8);
        this.params = [];
        for (let i = 0; i < this.cairnHeight; i++) {
            // Random ellipse parameters
            const width = getRandomInt(50, 200);
            const height = getRandomInt(30, 100);
            const rotation = Math.random() * Math.PI / 2 - Math.PI / 4; // Random rotation
            this.params.push({
                width: width,
                height: height,
                rotation: rotation
            });
        }
        this.spacing = window.innerHeight/16;
        this.ellipseY = window.innerHeight-this.spacing;
    }

    update() {}

    // texture
    // const stoneTexture = new Image;
    // stoneTexture.src = "/textures/stone.jpg"; 

    // stoneTexture.onload = function() {
    //     // Create a pattern from the image
    //     const pattern = ctx.createPattern(stoneTexture, 'repeat');
    //     // Set the fill style to the pattern
    //     ctx.fillStyle = pattern;
    // }


    display() {
        function drawEllipse(ellipseY, param) {
            // Save canvas state
            ctx.save();
    
            // Translate to click position
            ctx.translate(window.innerWidth/2, ellipseY-param.height/2);
            ellipseY -= param.height;
            
            // Rotate
            ctx.rotate(param.rotation);
    
            // Set fill color
            ctx.fillStyle = '#ffffff';
    
            // Draw ellipse
            ctx.beginPath();
            ctx.ellipse(0, 0, param.width / 2, param.height / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Restore canvas state
            ctx.restore();
            return ellipseY;
        }
        // draw cairn character
        for (let i = 0; i < this.cairnHeight; i++) {
            this.ellipseY = drawEllipse(this.ellipseY, this.params[i]);
        }
    }

    async talk() {
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        function createElement(className, textContent) {
            const element = document.createElement('div');
            element.className = className;
            element.textContent = textContent;
            element.style.top = 100;

            document.body.appendChild(element);

            element.addEventListener('animationend', (event) => {
                if (event.animationName === 'fadeOut') {
                    element.remove();
                }
            });
            return element;
        }
        let response = 'A weathered whisper emerges from ancient stone... \nWhen raindrops cluster before the wind claims them, do they remember their unity? Your gestures echo the dance of autumn leaves - gathering in communion before the decisive gust that charts their journey. \nSuch is the nature of moments that build toward change: first the gathering, then the leap. \nWhat patterns do you recognize in your own moments of hesitation before transformation? \nThe stones hold your silence...';
        let messages = response.split("\n");
        for (let i = 0; i < messages.length; i++) {
            if (i > 0 && i < messages.length-1) {
                const element = createElement('speech-bubble', messages[i]);
                // Position bubble above click point
                element.style.left = window.innerWidth/2 - 40 + 'px';
                element.style.top = (this.ellipseY - (this.params[this.params.length-1].height + this.params[this.params.length-1].width + this.spacing)/2.5) + 'px';
            } else {
                createElement('non-dialogue-text', messages[i]);
            }

            await delay(6000);
        }
    }
}