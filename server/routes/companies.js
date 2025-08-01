const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage for demo (replace with database in production)
let companies = [];

// Sample company data for demonstration
const sampleCompanies = [
  {
    id: 'zoom-2024',
    name: 'Zoom Communications',
    industry: 'Technology',
    lastAnalysis: '2024-01-31',
    revenueOSMapping: {
      pillars: {
        AIM: { relevance: 0.6, keyFindings: ['Market positioning needs refinement'] },
        ACT: { relevance: 0.8, keyFindings: ['Execution optimization required'] },
        ARRANGE: { relevance: 0.9, keyFindings: ['Pipeline velocity critical for growth'] },
        ANTICIPATE: { relevance: 0.7, keyFindings: ['Forecasting improvements needed'] }
      },
      recommendations: [
        'Focus on pipeline optimization and sales velocity',
        'Implement KPI framework for better execution',
        'Develop clear market positioning strategy'
      ]
    },
    analysis: {
      extractedInsights: ['3% revenue growth year-over-year', 'Operating income doubled'],
      identifiedChallenges: ['Growth plateau', 'Retention risks'],
      growthGoals: ['Accelerate enterprise growth', 'Improve retention rates'],
      strategicPriorities: ['Market expansion', 'Product innovation']
    }
  },
  {
    id: 'microsoft-2024',
    name: 'Microsoft',
    industry: 'Technology',
    lastAnalysis: '2024-12-31',
    revenueOSMapping: {
      pillars: {
        AIM: { relevance: 0.8, keyFindings: ['Strong market positioning'] },
        ACT: { relevance: 0.7, keyFindings: ['Execution excellence'] },
        ARRANGE: { relevance: 0.9, keyFindings: ['Cloud growth momentum'] },
        ANTICIPATE: { relevance: 0.8, keyFindings: ['Forecasting accuracy'] }
      },
      recommendations: [
        'Maintain Cloud growth momentum',
        'Optimize cross-category sales',
        'Enhance forecasting capabilities'
      ]
    },
    analysis: {
      extractedInsights: ['14% total growth', 'Cloud segment +31% growth'],
      identifiedChallenges: ['Competition intensity', 'Scaling challenges'],
      growthGoals: ['Sustain Cloud momentum', 'Cross-category expansion'],
      strategicPriorities: ['Cloud leadership', 'AI integration']
    }
  }
];

// Initialize with sample data
companies = [...sampleCompanies];

// Get all companies
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      companies: companies.sort((a, b) => 
        new Date(b.lastAnalysis) - new Date(a.lastAnalysis)
      )
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get specific company
router.get('/:id', async (req, res) => {
  try {
    const company = companies.find(c => c.id === req.params.id);
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({
      success: true,
      company
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// Create new company analysis
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      industry, 
      analysis, 
      revenueOSMapping 
    } = req.body;

    const company = {
      id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name,
      industry,
      lastAnalysis: new Date().toISOString().split('T')[0],
      analysis,
      revenueOSMapping,
      createdAt: new Date().toISOString()
    };

    companies.push(company);

    res.json({
      success: true,
      company,
      message: 'Company analysis created successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create company analysis' });
  }
});

// Update company analysis
router.put('/:id', async (req, res) => {
  try {
    const index = companies.findIndex(c => c.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Company not found' });
    }

    companies[index] = {
      ...companies[index],
      ...req.body,
      lastAnalysis: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      company: companies[index],
      message: 'Company analysis updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update company analysis' });
  }
});

// Get company insights (aggregated analysis)
router.get('/:id/insights', async (req, res) => {
  try {
    const company = companies.find(c => c.id === req.params.id);
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Generate insights based on RevenueOS mapping
    const insights = {
      topPillars: Object.entries(company.revenueOSMapping.pillars)
        .sort(([,a], [,b]) => b.relevance - a.relevance)
        .slice(0, 2)
        .map(([pillar, data]) => ({
          pillar,
          relevance: data.relevance,
          findings: data.keyFindings
        })),
      recommendations: company.revenueOSMapping.recommendations,
      growthPotential: calculateGrowthPotential(company.revenueOSMapping),
      implementationPriority: determineImplementationPriority(company.revenueOSMapping)
    };

    res.json({
      success: true,
      insights
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// Helper function to calculate growth potential
function calculateGrowthPotential(revenueOSMapping) {
  const scores = Object.values(revenueOSMapping.pillars).map(pillar => pillar.relevance);
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  if (averageScore > 0.8) return 'High';
  if (averageScore > 0.6) return 'Medium';
  return 'Low';
}

// Helper function to determine implementation priority
function determineImplementationPriority(revenueOSMapping) {
  const priorities = [];
  
  if (revenueOSMapping.pillars.AIM.relevance > 0.7) {
    priorities.push('Strategic alignment (A. Aim)');
  }
  
  if (revenueOSMapping.pillars.ACT.relevance > 0.7) {
    priorities.push('Execution optimization (B. Act)');
  }
  
  if (revenueOSMapping.pillars.ARRANGE.relevance > 0.7) {
    priorities.push('Pipeline acceleration (C. Arrange)');
  }
  
  if (revenueOSMapping.pillars.ANTICIPATE.relevance > 0.7) {
    priorities.push('Forecasting improvement (D. Anticipate)');
  }
  
  return priorities;
}

module.exports = router; 