const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
app.use('/api/analysis', require('./routes/analysis'));
app.use('/api/business-cases', require('./routes/businessCases'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/companies', require('./routes/companies'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Business Case Platform is running' });
});

// Serve React app for any non-API routes
app.get('*', (req, res) => {
  // In development, redirect to React dev server
  if (process.env.NODE_ENV === 'development') {
    res.redirect('http://localhost:3000' + req.url);
  } else {
    // In production, serve the built React app
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Business Case Platform server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend available at http://localhost:3000`);
}); 