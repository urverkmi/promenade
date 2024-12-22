class CairnClient {

    constructor(workerUrl) {
        this.workerUrl = workerUrl;
        this.sessionToken = this.generateSessionToken();
    }

    generateSessionToken() {
        return crypto.randomUUID();
    }

    async makeRequest(requestBody) {
        try {
          const response = await fetch(this.workerUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              pattern: requestBody,
              sessionToken: this.sessionToken
            })
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          
          // Access the content from Anthropic's response structure
          const message = data.content[0].text;
          // let message = "testing";
          console.log("Retrieved response:", message);
          return message;
      
        } catch (error) {
          console.error('Failed to send:', error);
          throw error;
        }
    }
}