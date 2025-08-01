const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage for demo (replace with database in production)
let businessCases = [];

// Create new business case
router.post('/', async (req, res) => {
  try {
    const { 
      companyName, 
      analysis, 
      revenueOSMapping, 
      template, 
      customizations 
    } = req.body;

    const businessCase = {
      id: uuidv4(),
      companyName,
      analysis,
      revenueOSMapping,
      template,
      customizations,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    businessCases.push(businessCase);

    res.json({
      success: true,
      businessCase,
      message: 'Business case created successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create business case' });
  }
});

// Get all business cases
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      businessCases: businessCases.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch business cases' });
  }
});

// Get specific business case
router.get('/:id', async (req, res) => {
  try {
    const businessCase = businessCases.find(bc => bc.id === req.params.id);
    
    if (!businessCase) {
      return res.status(404).json({ error: 'Business case not found' });
    }

    res.json({
      success: true,
      businessCase
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch business case' });
  }
});

// Update business case
router.put('/:id', async (req, res) => {
  try {
    const index = businessCases.findIndex(bc => bc.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Business case not found' });
    }

    businessCases[index] = {
      ...businessCases[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      businessCase: businessCases[index],
      message: 'Business case updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update business case' });
  }
});

// Generate presentation
router.post('/:id/generate', async (req, res) => {
  try {
    const businessCase = businessCases.find(bc => bc.id === req.params.id);
    
    if (!businessCase) {
      return res.status(404).json({ error: 'Business case not found' });
    }

    // Generate presentation content based on RevenueOS mapping
    const presentation = await generatePresentation(businessCase);

    res.json({
      success: true,
      presentation,
      message: 'Presentation generated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate presentation' });
  }
});

// View presentation (returns presentation data)
router.get('/:id/view', async (req, res) => {
  try {
    const businessCase = businessCases.find(bc => bc.id === req.params.id);
    
    if (!businessCase) {
      return res.status(404).json({ error: 'Business case not found' });
    }

    // Generate presentation content
    const presentation = await generatePresentation(businessCase);

    res.json({
      success: true,
      presentation,
      businessCase
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to view presentation' });
  }
});

// Export presentation
router.post('/:id/export', async (req, res) => {
  try {
    const { format } = req.body; // 'pptx', 'pdf', 'google-slides'
    const businessCase = businessCases.find(bc => bc.id === req.params.id);
    
    if (!businessCase) {
      return res.status(404).json({ error: 'Business case not found' });
    }

    // Mock export functionality
    const exportResult = {
      format,
      downloadUrl: `/api/business-cases/${businessCase.id}/download`,
      filename: `${businessCase.companyName}-business-case.${format}`,
      generatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      export: exportResult,
      message: 'Presentation exported successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to export presentation' });
  }
});

async function generatePresentation(businessCase) {
  const { revenueOSMapping, companyName, analysis } = businessCase;
  
  // Generate slides based on RevenueOS pillars
  const slides = [];
  
  // Title slide
  slides.push({
    type: 'title',
    title: `${companyName} - Business Case`,
    subtitle: 'RevenueOS Framework Analysis',
    content: revenueOSMapping.businessCase
  });

  // Company overview slide
  slides.push({
    type: 'overview',
    title: 'Company Analysis',
    content: {
      insights: analysis.extractedInsights,
      challenges: analysis.identifiedChallenges,
      goals: analysis.growthGoals
    }
  });

  // RevenueOS pillars slides
  Object.entries(revenueOSMapping.pillars).forEach(([pillar, data]) => {
    if (data.relevance > 0.5) { // Only show relevant pillars
      slides.push({
        type: 'pillar',
        pillar,
        title: `RevenueOS: ${pillar}`,
        content: {
          relevance: data.relevance,
          findings: data.keyFindings,
          services: data.services
        }
      });
    }
  });

  // Recommendations slide
  slides.push({
    type: 'recommendations',
    title: 'Strategic Recommendations',
    content: revenueOSMapping.recommendations
  });

  // Next steps slide
  slides.push({
    type: 'next-steps',
    title: 'Implementation Roadmap',
    content: [
      'Phase 1: Assessment & Alignment',
      'Phase 2: Process Optimization', 
      'Phase 3: Scale & Monitor'
    ]
  });

  return {
    slides,
    metadata: {
      companyName,
      generatedAt: new Date().toISOString(),
      confidence: revenueOSMapping.confidence
    }
  };
}

module.exports = router; 