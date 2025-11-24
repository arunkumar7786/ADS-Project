# 🚀 AI-Powered Tech Job Market Analyzer

![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini API](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![HTML5 Canvas](https://img.shields.io/badge/Canvas-Gamified-orange?style=for-the-badge)

## 📖 Abstract

A full-stack web application designed to help Computer Science students navigate the complex tech job market. Instead of browsing hundreds of job postings, users can simply type a skill (e.g., "React", "Python") and receive a real-time, AI-generated market report.

This project features a **Gamified UI** where the user controls a 2D car to interact with the application, and it utilizes **Static RAG (Retrieval-Augmented Generation)** to inject fresh market context into the AI's analysis.

---

## ✨ Key Features

* **🧠 Static RAG Implementation:**
    * Overcomes the "training data cutoff" of standard LLMs.
    * Injects a custom "Market Context" layer (November 2025 trends) into the backend prompt to ensure analysis is based on current hiring realities.
* **🏎️ Gamified UI (HTML Canvas):**
    * Interactive 2D car controller written in Vanilla JS physics.
    * Users "drive" the car to focus inputs and trigger analysis buttons.
    * Collision detection logic integrated with DOM elements.
* **🛡️ Structured JSON Output:**
    * Enforces a strict JSON Schema on the Gemini API to guarantee predictable, error-free data parsing.
* **📺 Smart YouTube Integration:**
    * Auto-generates "Safe Search" links for recommended tutorials to prevent broken/hallucinated URLs.
* **🎨 Dark Mode Design:**
    * Built with Tailwind CSS for a modern, responsive, slate-themed aesthetic.

---

## 🛠️ Tech Stack

### Frontend (Client-Side)
* **HTML5 & CSS3**
* **Tailwind CSS** (Styling & Dark Mode)
* **Vanilla JavaScript** (DOM Manipulation, API Calls, Game Physics)
* **Chart.js** (Data Visualization)
* **HTML Canvas** (2D Car Rendering)

### Backend (Server-Side)
* **Node.js** (Runtime Environment)
* **Express.js** (API Framework)
* **Dotenv** (Security/Environment Variables)
* **Node-Fetch** (External API Requests)

### AI Services
* **Google Gemini 2.5 Flash API** (Generative Intelligence)

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/tech-job-analyzer.git](https://github.com/your-username/tech-job-analyzer.git)
cd tech-job-analyzer