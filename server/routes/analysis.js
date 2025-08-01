const express = require('express');
const multer = require('multer');
const router = express.Router();
const { analyzeDocument } = require('../services/analysisService');
const { mapToRevenueOS } = require('../services/revenueOSMapper');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Excel, and text files are allowed.'));
    }
  }
});

// Analyze uploaded document
router.post('/document', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { companyName, documentType } = req.body;
    
    // Analyze the document content
    const analysis = await analyzeDocument(req.file, documentType);
    
    // Map findings to RevenueOS pillars
    const revenueOSMapping = await mapToRevenueOS(analysis);
    
    res.json({
      success: true,
      analysis,
      revenueOSMapping,
      companyName,
      documentType
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze document',
      details: error.message 
    });
  }
});

// Analyze text input
router.post('/text', async (req, res) => {
  try {
    const { text, companyName, context } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    // Analyze the text content
    const analysis = await analyzeDocument({ 
      buffer: Buffer.from(text), 
      mimetype: 'text/plain' 
    }, 'notes');
    
    // Map findings to RevenueOS pillars
    const revenueOSMapping = await mapToRevenueOS(analysis);
    
    res.json({
      success: true,
      analysis,
      revenueOSMapping,
      companyName,
      context
    });
  } catch (error) {
    console.error('Text analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze text',
      details: error.message 
    });
  }
});

// Get analysis history
router.get('/history', async (req, res) => {
  try {
    // This would typically fetch from database
    res.json({
      success: true,
      history: []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analysis history' });
  }
});

module.exports = router; 