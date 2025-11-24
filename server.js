const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Ensure you have: npm install node-fetch@2
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- 1. FRESH DATA CONTEXT (The "Brain") ---
const MARKET_CONTEXT = `
Current Tech Job Market Trends (November 2025):
- AI Engineering and ML Ops are the highest growing fields.
- React is king, but Next.js 14+ is now mandatory for top roles.
- Python is the #1 language due to AI integration.
- Cyber Security and Cloud (AWS/Azure) are in very high demand.
- "Full Stack" is preferred over "Frontend Only" for juniors.
`;

// --- 2. UPDATED SCHEMA (Added "youtube_videos") ---
const responseSchema = {
    type: "OBJECT",
    properties: {
        "high_demand_areas": {
            type: "ARRAY",
            items: { type: "STRING" }
        },
        "related_skills": {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    "name": { type: "STRING" },
                    "reason": { type: "STRING" }
                }
            }
        },
        "learning_resources": {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    "name": { type: "STRING" },
                    "type": { type: "STRING" },
                    "url": { type: "STRING" }
                }
            }
        },
        // NEW SECTION FOR YOUTUBE
        "youtube_videos": {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    "title": { type: "STRING" },
                    "channelName": { type: "STRING" }
                }
            }
        }
    },
    required: ["high_demand_areas", "related_skills", "learning_resources", "youtube_videos"]
};

app.get('/api/skill/:skillName', async (req, res) => {
    const skillName = req.params.skillName;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "API Key is missing." });
    }

    const systemPrompt = `
    You are a tech career expert. 
    MARKET CONTEXT: ${MARKET_CONTEXT}
    
    INSTRUCTIONS:
    Analyze the user's skill.
    Provide 3 SPECIFIC, REAL, HIGHLY RATED YouTube video titles and channel names for learning this skill.
    Return data in the required JSON format.
    `;

    const userQuery = `Analyze the skill: "${skillName}". Find:
    1. Top 3-5 high demand regions in India.
    2. 3-5 Related skills with reasons.
    3. 3-5 General learning resources (docs/courses).
    4. 3 Best YouTube Video Tutorials (Title + Channel Name).`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema
        }
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error("API Error");

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        const jsonData = JSON.parse(text);
        
        res.json(jsonData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch analysis." });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});