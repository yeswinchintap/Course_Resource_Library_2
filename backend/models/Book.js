const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  isbn: { type: String, unique: true },
  quantity: { type: Number, required: true },
  available: { type: Number, required: true },
  location: { type: String },
  imageLink: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
