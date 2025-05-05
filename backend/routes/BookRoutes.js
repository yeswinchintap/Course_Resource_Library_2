const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const BookController = require('../controllers/BookController');

// Authentication required for all book routes
router.use(auth);

// Admin only: Add book
router.post('/', checkRole('admin'), BookController.addBook);
router.put('/:id/restock', checkRole('admin'), BookController.restockBook);
router.get('/search', BookController.searchBooks);
router.post('/:id/borrow', BookController.borrowBook);
router.get('/', BookController.viewAllBooks);


module.exports = router;
