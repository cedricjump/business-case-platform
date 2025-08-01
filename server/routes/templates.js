const express = require('express');
const router = express.Router();

// Pre-defined templates for different personas
const templates = {
  ceo: {
    id: 'ceo',
    name: 'CEO Template',
    description: 'Focus on revenue growth, market expansion, competitive advantage, shareholder value',
    slides: [
      {
        type: 'title',
        title: 'Strategic Growth Opportunity',
        subtitle: 'RevenueOS Framework Analysis'
      },
      {
        type: 'overview',
        title: 'Executive Summary',
        content: ['Market opportunity', 'Growth potential', 'Strategic alignment']
      },
      {
        type: 'pillar',
        title: 'RevenueOS: A. Aim',
        content: ['Market positioning', 'ICP identification', 'Pricing strategy']
      },
      {
        type: 'pillar',
        title: 'RevenueOS: C. Arrange',
        content: ['Pipeline optimization', 'Sales velocity', 'Scalable growth']
      },
      {
        type: 'financial',
        title: 'Financial Impact',
        content: ['Revenue projection', 'ROI analysis', 'Investment timeline']
      },
      {
        type: 'next-steps',
        title: 'Implementation Roadmap',
        content: ['Phase 1: Assessment', 'Phase 2: Optimization', 'Phase 3: Scale']
      }
    ]
  },
  coo: {
    id: 'coo',
    name: 'COO Template',
    description: 'Operational efficiency, cost reduction, process optimization, scalability',
    slides: [
      {
        type: 'title',
        title: 'Operational Excellence Initiative',
        subtitle: 'RevenueOS Framework Analysis'
      },
      {
        type: 'overview',
        title: 'Current State Analysis',
        content: ['Process inefficiencies', 'Cost drivers', 'Scalability challenges']
      },
      {
        type: 'pillar',
        title: 'RevenueOS: B. Act',
        content: ['KPI framework', 'Execution standards', 'Capacity optimization']
      },
      {
        type: 'pillar',
        title: 'RevenueOS: D. Anticipate',
        content: ['Forecasting', 'Risk management', 'Resource planning']
      },
      {
        type: 'metrics',
        title: 'Operational Metrics',
        content: ['Efficiency gains', 'Cost savings', 'Productivity improvements']
      },
      {
        type: 'next-steps',
        title: 'Implementation Plan',
        content: ['Process mapping', 'KPI implementation', 'Team training']
      }
    ]
  },
  vpSales: {
    id: 'vpSales',
    name: 'VP Sales Template',
    description: 'Revenue acceleration, pipeline improvement, sales productivity, market penetration',
    slides: [
      {
        type: 'title',
        title: 'Sales Excellence Program',
        subtitle: 'RevenueOS Framework Analysis'
      },
      {
        type: 'overview',
        title: 'Sales Performance Analysis',
        content: ['Pipeline health', 'Conversion rates', 'Sales velocity']
      },
      {
        type: 'pillar',
        title: 'RevenueOS: C. Arrange',
        content: ['Pipeline optimization', 'Sales narrative', 'Velocity tools']
      },
      {
        type: 'pillar',
        title: 'RevenueOS: B. Act',
        content: ['Sales enablement', 'Performance tracking', 'Team optimization']
      },
      {
        type: 'pipeline',
        title: 'Pipeline Optimization',
        content: ['Lead generation', 'Qualification process', 'Deal acceleration']
      },
      {
        type: 'next-steps',
        title: 'Sales Transformation',
        content: ['Team assessment', 'Process redesign', 'Enablement implementation']
      }
    ]
  }
};

// Get all templates
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      templates: Object.values(templates)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get specific template
router.get('/:id', async (req, res) => {
  try {
    const template = templates[req.params.id];
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({
      success: true,
      template
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// Get template recommendations based on analysis
router.post('/recommend', async (req, res) => {
  try {
    const { analysis, revenueOSMapping } = req.body;
    
    // Simple recommendation logic based on RevenueOS pillars
    const recommendations = [];
    
    if (revenueOSMapping.pillars.ARRANGE.relevance > 0.7) {
      recommendations.push(templates.vpSales);
    }
    
    if (revenueOSMapping.pillars.ACT.relevance > 0.7) {
      recommendations.push(templates.coo);
    }
    
    if (revenueOSMapping.pillars.AIM.relevance > 0.7) {
      recommendations.push(templates.ceo);
    }
    
    // Default to CEO template if no strong matches
    if (recommendations.length === 0) {
      recommendations.push(templates.ceo);
    }

    res.json({
      success: true,
      recommendations,
      reasoning: 'Based on RevenueOS pillar relevance scores'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

module.exports = router; 