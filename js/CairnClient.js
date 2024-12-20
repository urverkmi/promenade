class CairnClient {

    constructor(workerUrl) {
        this.workerUrl = workerUrl;
        this.sessionToken = this.generateSessionToken();
    }

    generateSessionToken() {
        return crypto.randomUUID();
    }

    async makeRequest(requestBody) {
        async function readStream(stream) {
            let result = "";
            for await (const chunk of stream) {
              result += new TextDecoder().decode(chunk);
            }
            return result;
        }
        try {
            return await fetch(this.workerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pattern: requestBody,
                    sessionToken: this.sessionToken
                })
            })
            .then(result => {
                if (!result.ok) {
                    throw new Error(`HTTP error! status: ${result.status}`);
                } else {
                    return result.body;
                }
            }) // Get the ReadableStream from the response
            .then(readStream)
            .then(data => {
                let message = JSON.parse(data).content[0].text;
                console.log("retrieved response: " + message);
                return message;
            });
        } catch (error) {
            console.error('Failed to send:', error);
            throw error;
        }
    }
}