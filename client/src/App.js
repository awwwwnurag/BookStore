import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingBook, setEditingBook] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    description: '',
    category: 'General'
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/books');
      setBooks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch books: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await axios.put(`/api/books/${editingBook._id}`, formData);
        setSuccess('Book updated successfully!');
      } else {
        await axios.post('/api/books', formData);
        setSuccess('Book added successfully!');
      }
      
      setFormData({
        title: '',
        author: '',
        price: '',
        description: '',
        category: 'General'
      });
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      setError('Failed to save book: ' + err.message);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price.toString(),
      description: book.description,
      category: book.category
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/api/books/${id}`);
        setSuccess('Book deleted successfully!');
        fetchBooks();
      } catch (err) {
        setError('Failed to delete book: ' + err.message);
      }
    }
  };

  const cancelEdit = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      price: '',
      description: '',
      category: 'General'
    });
  };

  return (
    <div className="App">
      <div className="header">
        <h1>📚 My Book Store</h1>
        <p>Simple book management system</p>
      </div>

      <div className="container">
        <div className="book-form">
          <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
          
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Book Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author:</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($):</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="General">General</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Biography">Biography</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter book description..."
              />
            </div>

            <div>
              <button type="submit" className="btn btn-success">
                {editingBook ? 'Update Book' : 'Add Book'}
              </button>
              {editingBook && (
                <button type="button" className="btn" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h2>📖 My Books ({books.length})</h2>
          
          {loading ? (
            <div className="loading">Loading books...</div>
          ) : books.length === 0 ? (
            <div className="loading">No books found. Add your first book above!</div>
          ) : (
            <div className="books-grid">
              {books.map((book) => (
                <div key={book._id} className="book-card">
                  <h3>{book.title}</h3>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Category:</strong> {book.category}</p>
                  <p className="book-price">${book.price}</p>
                  {book.description && (
                    <p><strong>Description:</strong> {book.description}</p>
                  )}
                  <div className="book-actions">
                    <button 
                      className="btn" 
                      onClick={() => handleEdit(book)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(book._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
