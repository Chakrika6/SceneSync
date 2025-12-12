const axios = require('axios');
require('dotenv').config();

const analyzeImage = async (buffer) => {
  try {
    const base64Image = buffer.toString('base64');

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_API_KEY}`,
      {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 10,
              },
              {
                type: 'SAFE_SEARCH_DETECTION',
              },
            ],
          },
        ],
      }
    );

    const result = response.data.responses[0];
    const safeSearch = result.safeSearchAnnotation || {};

    // Calculate AI trust score based on safe search
    let trustScore = 100;
    const likelyThreshold = { VERY_LIKELY: 20, LIKELY: 10, POSSIBLE: 5 };

    ['adult', 'spoof', 'medical', 'violence'].forEach((category) => {
      const likelihood = safeSearch[category] || 'UNKNOWN';
      trustScore -= likelyThreshold[likelihood] || 0;
    });

    trustScore = Math.max(0, Math.min(100, trustScore));

    return {
      aiScore: trustScore,
      labels: result.labelAnnotations || [],
      safeSearch: safeSearch,
    };
  } catch (error) {
    console.error('Vision API Error:', error.message);
    return {
      aiScore: 50,
      labels: [],
      safeSearch: {},
    };
  }
};

module.exports = { analyzeImage };
