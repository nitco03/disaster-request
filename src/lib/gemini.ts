
// Function to classify requests as urgent or not urgent using Gemini API
export const classifyRequest = async (description: string): Promise<boolean> => {
  try {
    const apiKey = "AIzaSyDp68C7YOwx9ld0TFUdC7YLRWcFfCw5Ilc"; // Gemini API key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const promptText = `
      You are an emergency request classifier for a disaster relief app. 
      Your task is to determine if the following request is urgent or not urgent.
      
      Request: "${description}"
      
      Classify this as either "URGENT" or "NOT_URGENT" based on these criteria:
      
      URGENT:
      - Immediate danger to life or safety
      - Critical medical needs
      - Lack of essential supplies (water, food, shelter in immediate timeframe)
      - Trapped individuals or immediate rescue needs
      - Severe structural damage with people at risk
      
      NOT_URGENT:
      - Information requests
      - Supply needs that are not immediate
      - Infrastructure damage reports without immediate danger
      - Non-emergency community support
      - Long-term recovery needs
      
      Respond with ONLY "URGENT" or "NOT_URGENT".
    `;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: promptText
              }
            ]
          }
        ]
      })
    });
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      const classification = data.candidates[0].content.parts[0].text.trim();
      console.log("Gemini classification:", classification);
      return classification.includes("URGENT");
    } else {
      console.error("Unexpected response format:", data);
      return false; // Default to non-urgent if there's an issue
    }
  } catch (error) {
    console.error("Error classifying request:", error);
    return false; // Default to non-urgent if there's an error
  }
};
