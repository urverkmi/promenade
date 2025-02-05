class ResponseProcessor {
    constructor() {
        this.gpp = new GraphicProcessor();
        this.displaying = false;
    }

    async display(response) {
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

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        this.displaying = true;

        const messages = splitResponse(response);
        for (let i = 0; i < messages.length; i++) {
            // display plain text
            if (!messages[i].includes("[")) {
                const element = createElement('text', messages[i]);
                // Position the text
                element.style.left = window.innerWidth/2 - window.innerWidth/5 + 'px';
                element.style.top =  window.innerHeight/2 - window.innerHeight/3 + 'px';

                await delay(6000);
            }
        }

        this.displaying = false;
        this.gpp.setShapes([]);
    }

    isDisplaying() {
        return this.displaying;
    }

    draw() {
        this.gpp.draw();
    }

    setShapes(response) {
        function parseGraphicsText(text) {
            // Step 1: Extract content between brackets
            const bracketContent = text.match(/\[(.*)\]/);
            if (!bracketContent) {
                throw new Error("Invalid format: Missing square brackets");
            }
            
            // Step 2: Split into individual object strings
            const objects = bracketContent[1]
                .split('},')
                .map(str => str.trim().replace(/}$/, '')); // Clean up trailing }
            
            // Step 3: Parse each object
            const graphicsArray = objects.map(objStr => {
                // Remove curly braces and split into key-value pairs
                const pairs = objStr
                    .replace(/[{}]/g, '')
                    .split(',')
                    .map(pair => pair.trim());
                
                // Convert to object with only shape and color
                const properties = {};
                pairs.forEach(pair => {
                    const [key, value] = pair.split(':').map(str => 
                        str.trim().replace(/"/g, '')  // Remove quotes
                    );
                    
                    // Only include shape and color properties
                    if (key === 'shape' || key === 'color') {
                        properties[key] = value;
                    }
                });

                // generate random coordinates within a range
                let xPos = windowWidth*2/3 + Math.floor(Math.random() * (windowWidth/8));
                let yPos = windowHeight/3 - Math.floor(Math.random() * (windowHeight/8));
                let width = windowWidth/28 + Math.floor(Math.random() * (windowWidth/30));
                let height = windowHeight/28 + Math.floor(Math.random() * (windowHeight/30))
                
                return new GraphicShape(properties.shape, properties.color, xPos, yPos, width, height);
            });
            
            return graphicsArray;
        }

        this.gpp.setShapes(parseGraphicsText(response));
    }
}

// Class to hold shape properties
class GraphicShape {
    constructor(shape, color, xPos, yPos, width, height) {
        this.shape = shape;
        this.color = color;
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
    }
}

class GraphicProcessor {
    constructor() {
        this.shapes = [];
    }

    setShapes(shapes) {
        this.shapes = shapes;
    }

    draw() {

        function drawPolygon(x, y, radius, npoints) {
            let angle = TWO_PI / npoints;
            beginShape();
            for (let a = 0; a < TWO_PI; a += angle) {
                let sx = x + cos(a) * radius;
                let sy = y + sin(a) * radius;
                vertex(sx, sy);
            }
            endShape(CLOSE);
        }

        // Draw shapes
        this.shapes.forEach((shape) => {
            
            push();

            fill(shape.color);
            
            if (shape.shape === 'ellipse') {
                noStroke();
                fill(shape.color);
                ellipse(shape.xPos, shape.yPos, shape.width, shape.height);
            } else if (shape.shape === 'polygon') {
                // Draw a pentagon for polygon
                noStroke();
                fill(shape.color);
                drawPolygon(shape.xPos, shape.yPos, 50, 5);
            } else if (shape.shape === "line") {
                stroke(shape.color);
                line(shape.xPos, shape.yPos, shape.xPos + shape.width, shape.yPos + shape.height);
            }

            pop();
        });


    }
}