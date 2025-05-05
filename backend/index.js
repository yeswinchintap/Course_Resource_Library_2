const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));
  
// Routes
app.use('/api/courses', require('./routes/CourseRoutes'));
app.use('/api/users', require('./routes/UserRoutes'));
app.use('/api/books', require('./routes/BookRoutes'));


// Root
app.get('/', (req, res) => {
    res.send('Course Resource Library API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
