import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AddBook.css'; // External CSS

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [imageLink, setImageLink] = useState('');
  const navigate = useNavigate();

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      await axios.post('http://localhost:5000/api/books', 
        { title, author, isbn, quantity, location, imageLink },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Book added successfully!', { position: 'top-center' });
      navigate('/admin/view-books'); // Redirect to view books page (we will create soon)
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || 'Failed to add book!', { position: 'top-center' });
    }
  };

  return (
    <div className="add-book-container">
      <form onSubmit={handleAddBook} className="add-book-form">
        <h2 className="add-book-title">➕ Add New Book</h2>

        <input
          type="text"
          placeholder="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="add-book-input"
        />

        <input
          type="text"
          placeholder="Author"
          required
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="add-book-input"
        />

        <input
          type="text"
          placeholder="ISBN"
          required
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className="add-book-input"
        />

        <input
          type="number"
          placeholder="Quantity"
          required
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="add-book-input"
        />

        <input
          type="text"
          placeholder="Location"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="add-book-input"
        />

        <input
          type="text"
          placeholder="Image Link (optional)"
          value={imageLink}
          onChange={(e) => setImageLink(e.target.value)}
          className="add-book-input"
        />

        <button type="submit" className="add-book-button">
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
