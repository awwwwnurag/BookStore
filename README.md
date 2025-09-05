# 📚 Book Store Application

A simple book store application built with MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- ✅ Add new books with title, author, price, category, and description
- ✅ View all books in a grid layout
- ✅ Edit existing books
- ✅ Delete books
- ✅ Simple and clean user interface
- ✅ Responsive design

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Styling**: Basic CSS (student-level styling)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Environment Setup

1. Copy the environment example file:
```bash
cp env.example .env
```

2. Update the `.env` file with your MongoDB URI and desired port (default is 6000).

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:6000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the React app:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

## Project Structure

```
bookstore-app/
├── server.js              # Express server
├── package.json           # Backend dependencies
├── client/                # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # App styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
└── README.md
```

## Usage

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Add books using the form
4. View, edit, or delete books from the grid

## Notes

This is a beginner-level project with simple styling and basic functionality. Perfect for learning MERN stack development!

## Author

Student Developer - Learning MERN Stack
