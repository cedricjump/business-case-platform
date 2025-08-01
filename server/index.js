const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// AGGRESSIVE RENDER PORT DETECTION
console.log('🚀 Starting server on port:', PORT);
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🔧 Render port detection:', process.env.PORT ? 'Using PORT env var' : 'Using default port');

if (process.env.PORT) {
  console.log(`🎯 Render detected PORT: ${process.env.PORT}`);
}

// Force port logging for Render
setInterval(() => {
  console.log(`🔍 Server listening on port: ${PORT}`);
  process.stdout.write(`RENDER_PORT_DETECTION:${PORT}\n`);
}, 2000);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

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

// Render-specific health check (must be before catch-all)
app.get('/render-health', (req, res) => {
  res.json({
    status: 'OK',
    port: PORT,
    message: 'Render health check successful'
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

// Serve React app for any non-API routes (must be last)
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    res.redirect('http://localhost:3000' + req.url);
  } else {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }
});

// Start server with explicit host binding for Render
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Business Case Platform server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend available at http://localhost:3000`);
  console.log(`🔗 Server bound to 0.0.0.0:${PORT}`);
  console.log(`🌐 Render will detect port: ${PORT}`);
  console.log(`🔍 Health check available at: http://0.0.0.0:${PORT}/api/health`);

  // AGGRESSIVE FORCE PORT DETECTION
  console.log(`🎯 RENDER_PORT_DETECTION: ${PORT}`);
  console.log(`🎯 RENDER_SERVER_READY: true`);
  process.stdout.write(`RENDER_PORT_DETECTED:${PORT}\n`);
  process.stdout.write(`RENDER_SERVER_STARTED:true\n`);
  process.stdout.write(`RENDER_HEALTH_ENDPOINT:/render-health\n`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
}); 