// server/controllers/verificationController.js
const vision = require('../utils/vision'); // We will make sure this exists in a second

exports.verifyImage = async (fileBuffer) => {
    try {
        console.log("🧠 AI: Sending image to Google Vision...");
        
        // 1. Call Google Vision API
        // This function will define in Step 3
        const labels = await vision.analyzeImage(fileBuffer);
        
        console.log("🤖 AI Raw Labels:", labels); 

        // 2. The "Danger List" (Rubric)
        const dangerKeywords = [
            'fire', 'flame', 'smoke', 'crash', 'accident', 
            'disaster', 'flood', 'weapon', 'injury', 'blood', 
            'police', 'emergency', 'collapsed', 'pothole', 'garbage',
            'car', 'vehicle' // Added generic terms for testing
        ];

        // 3. Calculate Score
        let highestScore = 0;
        let matchedKeyword = null;

        if (labels && labels.length > 0) {
            labels.forEach(label => {
                const name = label.description.toLowerCase();
                
                // If label matches our Danger List
                if (dangerKeywords.some(keyword => name.includes(keyword))) {
                    const confidence = Math.round(label.score * 100);
                    if (confidence > highestScore) {
                        highestScore = confidence;
                        matchedKeyword = name;
                    }
                }
            });
        }

        console.log(`✅ AI Verdict: Found '${matchedKeyword}' with Trust Score: ${highestScore}`);
        return highestScore;

    } catch (error) {
        console.error("❌ AI Verification Failed:", error);
        return 0; // Don't crash, just give 0 score
    }
};