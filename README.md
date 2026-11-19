# Expense Tracker – MERN Stack

A browser-based Expense Tracker application built using React, Node.js, Express.js, and MongoDB.

## Project Details

- **Developer:** Dulla Jahnavi Sirivalli
- **Project:** Expense Tracker
- **Track:** MERN Stack Development

## Features

- Add, view, edit, and delete expenses.
- Filter expenses by category.
- Automatically update the total amount based on selected category.
- Frontend and backend validation.
- Store expense data in MongoDB.
- Responsive dashboard interface.

## Technologies Used

- **Frontend:** React.js, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Tools:** VS Code, Git, GitHub

## Requirements

- Node.js and npm
- MongoDB local installation or MongoDB Atlas account
- VS Code (recommended)

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jahnavidulla08-kitty/expense-tracker-mern.git
cd expense-tracker-mern
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example`.

Add your MongoDB connection details:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

**Note:** Keep your `.env` file private. Never upload it to GitHub.

### 3. Start the Backend

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

### 4. Start the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/expenses` | Create an expense |
| GET | `/api/expenses` | Get all expenses |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

The GET endpoint supports category filtering using `?category=Food`.

### Example Request Body

```json
{
  "title": "Lunch",
  "amount": 150,
  "category": "Food",
  "date": "2026-11-12"
}
```

## Project Structure

```text
expense-tracker-mern/
├── backend/
│   ├── models/
│   │   └── Expense.js
│   ├── routes/
│   │   └── expenseRoutes.js
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

## GitHub Repository

https://github.com/jahnavidulla08-kitty/expense-tracker-mern