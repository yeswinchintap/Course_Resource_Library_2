import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './SearchBooks.css'; // External CSS

const SearchBooks = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a search keyword.', { position: 'top-center' });
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await axios.get(`http://localhost:5000/api/books/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResults(res.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || 'Failed to search books!', { position: 'top-center' });
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/books/${bookId}/borrow`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message || 'Book borrowed!', { position: 'top-center' });
    } catch (error) {
      toast.error(error.response?.data || 'Borrowing failed!', { position: 'top-center' });
    }
  };
  

  return (
    <div className="search-books-container">
      <h2 className="search-books-title">🔎 Search Books</h2>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter title, author, or ISBN"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      <div className="search-results">
        {results.length === 0 ? (
          <p>🔍 No books found. Try another keyword.</p>
        ) : (
          results.map((book) => (
            <div className="search-card" key={book._id}>
              {book.imageLink && (
                <img src={book.imageLink} alt="Book" className="search-image" />
              )}
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>ISBN:</strong> {book.isbn}</p>
              <p><strong>Available:</strong> {book.available}</p>
              <p><strong>Location:</strong> {book.location}</p>

              {book.available > 0 && (
              <button
              className="borrow-button"
              onClick={() => handleBorrow(book._id)}
              >Borrow</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchBooks;
