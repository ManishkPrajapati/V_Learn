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

## Demo Screenshot

> _(add a screenshot/gif here of V_learn visualizing a topic)_

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

