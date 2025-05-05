const Book = require('../models/Book');
const { sendConfirmationEmail } = require('../utils/sendEmail');
const BookController = {
  // Admin: Add a new Book
  addBook: async (req, res) => {
    try {
      const { title, author, isbn, quantity, location, imageLink } = req.body;

      const existing = await Book.findOne({ isbn });
      if (existing) {
        return res.status(409).json({ message: "Book with this ISBN already exists" });
      }

      const newBook = new Book({
        title,
        author,
        isbn,
        quantity,
        available: quantity, // initial available = quantity
        location,
        imageLink
      });

      await newBook.save();
      res.status(201).json({ message: "Book added successfully", book: newBook });
    } catch (error) {
      res.status(500).json({ message: "Failed to add book", error: error.message });
    }
  },

  searchBooks: async (req, res) => {
    try {
      const keyword = req.query.q;
  
      if (!keyword) {
        return res.status(400).json({ message: "Missing search keyword" });
      }
  
      const books = await Book.find({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { author: { $regex: keyword, $options: 'i' } },
          { isbn: { $regex: keyword, $options: 'i' } }
        ]
      });
  
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: "Error searching books", error: error.message });
    }
  },

  borrowBook: async (req, res) => {
    try {
      const userEmail = req.user.email; // From decoded JWT
      const courseId = req.params.id;
  
      const book = await Book.findById(courseId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      if (book.available <= 0) {
        return res.status(400).json({ message: "No copies available for borrowing" });
      }
  
      // Decrease available count
      book.available -= 1;
      await book.save();
  
      // Send Email (we will build sendEmail function separately)
      await sendConfirmationEmail(userEmail, book.title, book.location);
  
      res.status(200).json({ message: `Book borrowed successfully. Confirmation sent to ${userEmail}.`, book });
    } catch (error) {
      res.status(500).json({ message: "Borrowing failed", error: error.message });
    }
  },

  viewAllBooks: async (req, res) => {
    try {
      const books = await Book.find();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  },

  restockBook: async (req, res) => {
    try {
      const { quantity } = req.body;
      const bookId = req.params.id;
  
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      const difference = quantity - book.quantity;
      book.quantity = quantity;
      book.available += difference;
  
      await book.save();
  
      res.status(200).json({ message: "Book restocked successfully", book });
    } catch (error) {
      res.status(500).json({ message: "Error restocking book", error: error.message });
    }
  },
  
  
};


module.exports = BookController;
