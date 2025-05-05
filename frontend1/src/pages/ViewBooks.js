import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ViewBooks.css'; // External CSS

const ViewBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get('http://localhost:5000/api/books', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBooks(res.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || 'Failed to fetch books!', { position: 'top-center' });
    }
  };

  return (
    <div className="view-books-container">
      <h2 className="view-books-title">📚 All Available Books</h2>

      <div className="books-grid">
        {books.length === 0 ? (
          <p>No books found!</p>
        ) : (
          books.map((book) => (
            <div className="book-card" key={book._id}>
              {book.imageLink && (
                <img src={book.imageLink} alt="Book" className="book-image" />
              )}
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>ISBN:</strong> {book.isbn}</p>
              <p><strong>Quantity:</strong> {book.quantity}</p>
              <p><strong>Location:</strong> {book.location}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewBooks;
