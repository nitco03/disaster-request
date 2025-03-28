
// Function to classify requests as urgent or not urgent using Gemini API
export const classifyRequest = async (description: string): Promise<boolean> => {
  try {
    const apiKey = "AIzaSyDp68C7YOwx9ld0TFUdC7YLRWcFfCw5Ilc"; // Gemini API key
    // Updated to use the v1 API endpoint instead of v1beta
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const promptText = `
      You are an emergency request classifier for a disaster relief app. 
      Your task is to determine if the following request is urgent or not urgent.
      
      Request: "${description}"
      
      Classify this as either "URGENT" or "NOT_URGENT" based on these criteria:
      
      URGENT:
      - Trapped persons or people unable to move
      - Drowning or water-related emergencies
      - Collapsed buildings or structural damage with people inside
      - First aid or medical emergencies
      - "Help us" or similar critical distress calls
      - Situations where people are unable to move/evacuate
      - Immediate danger to life or safety of any kind
      
      NOT_URGENT:
      - Food or water requests without immediate life threat
      - Utility outages (power, water) without medical dependencies
      - Information requests
      - Long-term recovery needs
      - Supply needs that are not immediate life-saving
      - Non-emergency community support
      
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
    } else if (data.error) {
      // Enhanced error handling
      console.error("Gemini API error:", data.error);
      // Fall back to basic keyword analysis if the API fails
      return fallbackClassification(description);
    } else {
      console.error("Unexpected response format:", data);
      return fallbackClassification(description);
    }
  } catch (error) {
    console.error("Error classifying request:", error);
    // Use fallback classification mechanism
    return fallbackClassification(description);
  }
};

// Simple fallback classification based on keywords if the API fails
const fallbackClassification = (description: string): boolean => {
  const urgentKeywords = [
    'trap', 'stuck', 'hurt', 'injury', 'emergency', 'medical', 
    'bleeding', 'flood', 'collapsed', 'drowning', 'fire', 'help', 
    'urgent', 'dying', 'death', 'severe', 'critical', 'immediate',
    'rescue', 'danger', 'unsafe', 'life', 'threatening'
  ];
  
  const descriptionLower = description.toLowerCase();
  return urgentKeywords.some(keyword => descriptionLower.includes(keyword));
};
