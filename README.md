# Expense Tracker – MERN Stack

A browser-based expense tracker built with React, Node.js, Express and MongoDB.

## Features
- Add, view, edit and delete expenses
- Filter expenses by category
- Total amount updates based on the selected category
- Frontend and backend validation
- MongoDB persistence
- Responsive dashboard UI

## Requirements
- Node.js LTS and npm
- MongoDB local installation or MongoDB Atlas connection
- VS Code (recommended)

## 1. Start MongoDB
Use a local MongoDB server, or create a MongoDB Atlas cluster and copy its connection string.

## 2. Configure the backend
Open a terminal in the `backend` folder:

```bash
npm install
```

Copy `.env.example` to `.env`, then set your MongoDB connection string:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
```

For MongoDB Atlas, replace the value with your Atlas connection string. Keep `.env` private; do not upload it to GitHub.

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## 3. Start the frontend
Open a second terminal in the `frontend` folder:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/expenses` | Create an expense |
| GET | `/api/expenses` | List expenses; optional `?category=Food` |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

Example request body:

```json
{
  "title": "Lunch",
  "amount": 150,
  "category": "Food",
  "date": "2026-11-12"
}
```

## Project structure

```text
expense-tracker/
├── backend/
│   ├── models/Expense.js
│   ├── routes/expenseRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── index.html
    └── package.json
```
