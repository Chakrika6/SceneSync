// server/utils/vision.js (HACKATHON MOCK MODE)

// You only need axios and dotenv for the structure, but the core logic is bypassed.
const axios = require('axios'); 
require('dotenv').config();

exports.analyzeImage = async (fileBuffer) => {
    // ⚠️ WARNING: The real Google AI is DISABLED due to API Key issues (403 error).
    console.log("⚠️ FAKING AI SCORE: Returning a high relevance score to unblock the dashboard.");
    
    // Simulate a network delay (1 second) so the UI doesn't look instant/buggy
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return the required structure with a high, stable score
    return {
        aiScore: 97, // Always return a high score (The Mock Value)
        labels: [],
        safeSearch: {},
    };
};
// This function name MUST match your export in the controller!
