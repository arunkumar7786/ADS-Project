Tech Job Market Analyzer

A dynamic, AI-powered web application that provides real-time analysis of the tech job market. Users can enter a technology skill (e.g., "React", "Python") and receive an instant, AI-generated report on high-demand areas, essential related skills, and top learning resources.

This project features a unique, interactive 2D car game that acts as the primary user interface, allowing users to "drive" over UI elements to control the application.

Features

AI-Powered Analysis: Uses the Google Gemini 2.5 Flash model to generate dynamic, up-to-date insights on any tech skill.

Structured JSON Output: The backend server uses a strict JSON schema to force the AI to return clean, predictable data.

Comprehensive Reports: The analysis includes:

Top 3-5 high-demand cities or regions.

A list of essential related skills with explanations.

A curated list of learning resources with links.

Interactive Game UI: A 2D car, controlled by the arrow keys, acts as the primary user-facing element.

UI as a Controller:

Drive the car over the input field to focus it.

Drive over the "Analyze" button and press Enter or Space to submit a query.

Drive over the "Top 10 Skills" chart to hover and view tooltips, as if it were a mouse cursor.

Modern & Responsive: Built with Tailwind CSS for a clean, dark-mode-ready, and fully responsive design.

Tech Stack

This project is a full-stack application built with the "VAN" (Vanilla, Express, Node) stack, enhanced with AI.

Frontend (Client-Side)

HTML5: Semantic structure for the web page.

Tailwind CSS: For all styling and responsive design.

JavaScript (ES6+): Handles all user interaction, car physics, DOM manipulation, and API calls.

Chart.js: Used to render the "Top 10 In-Demand Skills" chart.

Backend (Server-Side)

Node.js: The JavaScript runtime environment.

Express.js: A minimal framework for creating the backend server and API endpoints.

Google Gemini 2.5 Flash: The core AI model used for generating the job market analysis.

node-fetch: Used to make API calls to the Gemini backend.

dotenv: For securely managing the Gemini API key.

cors: To allow the frontend and backend to communicate during development.

Setup and Installation

Follow these steps to get the project running on your local machine.

Prerequisites

Node.js: You must have Node.js (version 18 or higher) and npm installed. You can download it from nodejs.org.

Gemini API Key: You must have a valid API key for the Gemini API. You can get one from Google AI Studio.

1. Clone or Download the Project

First, get the project files onto your computer.

git clone https://your-repository-url/tech-job-analyzer.git
cd tech-job-analyzer


(Or, just use the index.html, style.css, script.js, etc. files you already have in your folder.)

2. Install Backend Dependencies

In your project folder, open a terminal and run npm install to download all the required packages for the server:

npm install express cors node-fetch@2 dotenv


(Note: We specify node-fetch@2 because it's compatible with the require() syntax used in server.js)

3. Create the Environment File

This is the most important step for security.

In the main project folder, create a new file named exactly .env

Inside this .env file, add the following line, replacing the placeholder with your actual API key:

GEMINI_API_KEY="PASTE_YOUR_ACTUAL_API_KEY_HERE"


(Optional but recommended) Create a .gitignore file and add .env to it to ensure you never accidentally commit your key to a repository.

4. Run the Application

You need to run two parts:

Start the Backend Server:
In your terminal, run:

node server.js


You should see a message: Server listening on port 3000

Open the Frontend:
In your file explorer, simply double-click the index.html file to open it in your default web browser.

You can now use the application! Type a skill, drive the car over the "Analyze" button, and press Enter to see the AI-generated results.