// server/utils/vision.js
const { ImageAnnotatorClient } = require('@google-cloud/vision');

const visionClient = new ImageAnnotatorClient();

/**
 * Analyzes an image for relevance, now incorporating a text context/prompt.
 * @param {string} filePath - Path to the local image file.
 * @param {string} contextPrompt - The task description/title for contextual verification.
 * @returns {object} An object containing the AI score and potentially other data.
 */
exports.analyzeImage = async (filePath, contextPrompt) => {
    try {
        const [result] = await visionClient.labelDetection(filePath);
        const labels = result.labelAnnotations || [];
        
        let maxRelevanceScore = 0;
        let foundRelevantLabel = false;
        
        // Define relevant keywords (Base set for general blight)
        const relevantKeywords = ['debris', 'trash', 'damage', 'graffiti', 'broken', 'pavement'];
        
        // Contextual Boost: Prioritize keywords based on the task prompt
        if (contextPrompt.toLowerCase().includes('fire')) {
            relevantKeywords.push('flame', 'smoke', 'fire');
        } else if (contextPrompt.toLowerCase().includes('dumping')) {
            relevantKeywords.push('garbage', 'dump', 'waste');
        }
        // ... (You can add more context checks here)

        // Find the highest confidence score for any relevant match
        for (const label of labels) {
            const labelText = label.description.toLowerCase();
            
            if (relevantKeywords.some(keyword => labelText.includes(keyword))) {
                maxRelevanceScore = Math.max(maxRelevanceScore, label.score);
                foundRelevantLabel = true;
            }
        }
        
        // Return a low score if nothing relevant was found, otherwise the max score.
        const finalScore = foundRelevantLabel ? maxRelevanceScore : 0.05;

        console.log(`AI Analysis Complete. Context: "${contextPrompt.substring(0, 30)}..." Score: ${finalScore}`);
        
        return { 
            score: finalScore,
            labels: labels.map(l => l.description).join(', ')
        };

    } catch (error) {
        console.error("Vision Analysis Error (Fallback to Neutral Score):", error);
        // Fallback to a neutral score if the AI service fails
        return { score: 0.5, labels: 'Analysis Failed' }; 
    }
};
