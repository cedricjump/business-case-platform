const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting server on port:', PORT);
console.log('🌍 Environment:', process.env.NODE_ENV);

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
  res.json({ 
    status: 'OK', 
    message: 'Business Case Platform is running',
    port: PORT,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint for Render health checks
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Business Case Platform is running',
    port: PORT
  });
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

// Start server with explicit host binding for Render
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Business Case Platform server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend available at http://localhost:3000`);
  console.log(`🔗 Server bound to 0.0.0.0:${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
}); 