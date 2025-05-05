import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './StudentBooks.css'; // External CSS

const StudentBooks = () => {
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
      toast.error('Failed to fetch books!', { position: 'top-center' });
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/books/${bookId}/borrow`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message || 'Book borrowed successfully!', { position: 'top-center' });
      fetchBooks(); // refresh book list
    } catch (error) {
      toast.error(error.response?.data || 'Borrowing failed!', { position: 'top-center' });
    }
  };

  return (
    <div className="student-books-container">
      <h2 className="student-books-title">📚 Available Books</h2>

      <div className="student-books-grid">
        {books.length === 0 ? (
          <p>No books available.</p>
        ) : (
          books
            .filter(book => book.available > 0)
            .map((book) => (
              <div className="student-book-card" key={book._id}>
                {book.imageLink && (
                  <img src={book.imageLink} alt="Book" className="student-book-image" />
                )}
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>ISBN:</strong> {book.isbn}</p>
                <p><strong>Available:</strong> {book.available}</p>
                <p><strong>Location:</strong> {book.location}</p>
                <button className="borrow-button" onClick={() => handleBorrow(book._id)}>
                  Borrow
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default StudentBooks;
