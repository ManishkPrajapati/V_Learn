# V_learn

**V_learn** is a full-stack educational visualization platform. Enter any topic and instantly see a process-oriented visualization — flowcharts, animated GIFs, or diagrams—generated using free AI APIs. This project demonstrates how AI + modern web frameworks can bring concepts to life, focusing on learning through *seeing*.

## Features

- **Instant Visualizations**: Type any process/topic—see a custom, AI-generated flowchart, GIF, or diagram appear.
- **Multi-tool Workflow**: Combines OpenAI image APIs and Google Data Studio API for dynamic content.
- **Modern Stack**: Flask (Python) backend, React + Vite frontend, MongoDB for storage.
- **Not just lists or quizzes**: Every visualization is process-first, not bulleted notes.

## Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Backend    | Flask, OpenAI API, pymongo|
| Frontend   | React, Vite, D3.js or React-Flow|
| Database   | MongoDB                   |
| Visualization APIs | OpenAI, Google Data Studio|

## Quick Start

1. `git clone https://github.com/yourusername/V_learn.git`
2. Backend:
   - `cd backend`
   - `python3 -m venv venv && source venv/bin/activate`
   - `pip install -r requirements.txt`
   - Create a `.env` file with your API keys (OpenAI, Google).
   - `flask run`
3. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
4. Open `http://localhost:5173`

## Folder Structure
V_learn/
├── backend/
│ ├── app.py
│ ├── requirements.txt
│ └── ...
├── frontend/
│ ├── src/
│ │ └── App.jsx
│ ├── vite.config.js
│ └── ...
├── .gitignore
├── README.md
└── ...



## How It Works

- **User inputs topic** (e.g., "https").
- **Backend** triggers OpenAI API to generate a process diagram or GIF for that topic; if charts/statistics needed, calls Google Data Studio API.
- **Visualization or animation** returned to **frontend** and displayed inside a clean, white-background card.

