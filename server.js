const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Make sure to install: npm install node-fetch@2

// Load environment variables from .env file at the very top
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allows your frontend to make requests to this server
app.use(express.json()); // Allows the server to parse JSON in request bodies

// --- This is the text-based JSON schema ---
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
        }
    },
    required: ["high_demand_areas", "related_skills", "learning_resources"]
};

// Main API endpoint
app.get('/api/skill/:skillName', async (req, res) => {
    const skillName = req.params.skillName;

    // Load the API key from the .env file
    const apiKey = process.env.GEMINI_API_KEY; 
    
    // Check if the API key is missing
    if (!apiKey || apiKey === "PASTE_YOUR_API_KEY_HERE" || apiKey === "") {
        console.error("API Key is missing. Please add your Gemini API key to .env file");
        return res.status(500).json({ error: "Server configuration error: API key is missing." });
    }

    // --- Prompts to ask for text-based lists ---
    const systemPrompt = `You are a world-class tech career analyst. The user will provide a technology skill, and you will analyze the current job market for it based on your internal knowledge. Provide your analysis in the required JSON format.`;
    const userQuery = `Analyze the job market for the skill: "${skillName}". Find:
1.  The top 3-5 cities or regions with high demand for this skill in india.
2.  A list of 3-5 essential related skills needed to master it, with a brief reason for each.
3.  A list of 3-5 recommended learning resources (e.g., official docs, popular courses, books) with their type and a URL.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema // Enforce the JSON output
        }
    };

    // --- API Call with Exponential Backoff Retry ---
    let response;
    let retries = 3;
    let delay = 1000; // 1 second

    for (let i = 0; i < retries; i++) {
        try {
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Success, exit the loop
                break;
            }

            if (response.status === 429 || response.status >= 500) {
                // Throttling or server error, wait and retry
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            } else {
                // Other client-side error (e.g., 400 Bad Request), don't retry
                const errorText = await response.text();
                throw new Error(`API request failed with status ${response.status}: ${errorText}`);
            }

        } catch (error) {
            if (i === retries - 1) {
                // Last retry failed, send error to client
                console.error("Error calling Gemini API after all retries:", error);
                return res.status(500).json({ error: "Failed to fetch analysis from AI. " + error.message });
            }
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }

    // --- Process the successful response ---
    try {
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            // Check for a "blocked" response
            if (result.candidates?.[0]?.finishReason === "SAFETY" || result.candidates?.[0]?.finishReason === "RECITATION") {
                 throw new Error("Response was blocked for safety or recitation reasons.");
            }
            throw new Error("Received an empty or invalid response from the AI.");
        }

        const jsonData = JSON.parse(text);
        res.json(jsonData); // Send the structured JSON to the frontend

    } catch (error) {
        console.error("Error parsing AI response:", error);
        res.status(500).json({ error: "Failed to parse AI response. " + error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`[dotenv@17.2.3] injecting env (1) from .env -- tip: 📡 add observability to secrets: https://dotenvx.com/ops`);
    console.log(`Server listening on port ${port}`);
});

