const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://bookstore:jrfulQbDeiTB8F8S@clusterr.h9zkgdm.mongodb.net/?retryWrites=true&w=majority&appName=Clusterr';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB successfully');
}).catch((error) => {
  console.error('MongoDB connection error:', error.message);
  console.log('Please make sure MongoDB is running or update MONGODB_URI in your environment');
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'General'
  }
}, {
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

let booksInMemory = [
  {
    _id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 12.99,
    description: 'A classic American novel',
    category: 'Fiction'
  },
  {
    _id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    price: 14.99,
    description: 'A story of racial injustice and childhood innocence',
    category: 'Fiction'
  }
];

let nextId = 3;

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Book Store API' });
});

app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    console.log('Using in-memory fallback data');
    res.json(booksInMemory);
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/books', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    console.log('Using in-memory fallback for creating book');
    const newBook = {
      _id: nextId.toString(),
      ...req.body,
      price: parseFloat(req.body.price)
    };
    booksInMemory.push(newBook);
    nextId++;
    res.status(201).json(newBook);
  }
});

app.put('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    console.log('Using in-memory fallback for updating book');
    const bookIndex = booksInMemory.findIndex(book => book._id === req.params.id);
    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }
    booksInMemory[bookIndex] = { ...booksInMemory[bookIndex], ...req.body };
    res.json(booksInMemory[bookIndex]);
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    console.log('Using in-memory fallback for deleting book');
    const bookIndex = booksInMemory.findIndex(book => book._id === req.params.id);
    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }
    booksInMemory.splice(bookIndex, 1);
    res.json({ message: 'Book deleted successfully' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
