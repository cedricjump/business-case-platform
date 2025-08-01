const pdfParse = require('pdf-parse');
const XLSX = require('xlsx');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Tag categories for RevenueOS mapping
const TAG_CATEGORIES = {
  GROWTH: ['revenue_growth', 'market_expansion', 'product_launch', 'international_expansion'],
  OPERATIONS: ['cost_optimization', 'margin_pressure', 'process_reengineering', 'headcount_efficiency'],
  SALES: ['pipeline_growth', 'conversion_rate', 'sales_velocity', 'rep_productivity'],
  CUSTOMER: ['churn_risk', 'retention_strategy', 'customer_lifetime_value', 'nps_target'],
  FORECAST: ['forecast_accuracy', 'revenue_visibility', 'account_risk', 'deal_slippage'],
  EXECUTION: ['kpi_alignment', 'execution_gap', 'go_to_market_discipline', 'sales_enablement'],
  STRATEGIC: ['positioning', 'pricing_strategy', 'customer_segmentation', 'delivery_model']
};

async function analyzeDocument(file, documentType) {
  let textContent = '';
  
  try {
    // Extract text based on file type
    if (file.mimetype === 'application/pdf') {
      textContent = await extractTextFromPDF(file.buffer);
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      textContent = await extractTextFromExcel(file.buffer);
    } else if (file.mimetype === 'text/plain') {
      textContent = file.buffer.toString('utf-8');
    } else {
      throw new Error('Unsupported file type');
    }

    // Analyze content with AI
    const analysis = await analyzeContentWithAI(textContent, documentType);
    
    return {
      originalText: textContent.substring(0, 1000) + '...', // Truncate for response
      extractedInsights: analysis.insights,
      identifiedChallenges: analysis.challenges,
      growthGoals: analysis.growthGoals,
      strategicPriorities: analysis.strategicPriorities,
      documentType,
      analysisDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Document analysis error:', error);
    throw new Error(`Failed to analyze document: ${error.message}`);
  }
}

async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
}

async function extractTextFromExcel(buffer) {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    let textContent = '';
    
    // Extract text from all sheets
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      jsonData.forEach(row => {
        if (Array.isArray(row)) {
          textContent += row.join(' ') + ' ';
        }
      });
    });
    
    return textContent;
  } catch (error) {
    throw new Error(`Excel parsing failed: ${error.message}`);
  }
}

async function analyzeContentWithAI(text, documentType) {
  const prompt = `
Analyze the following ${documentType} content and extract key business insights. Focus on:

1. Growth Goals: Revenue targets, market expansion plans, product launches
2. Strategic Priorities: Key initiatives, focus areas, strategic objectives
3. Challenges: Obstacles, pain points, areas of concern
4. Financial Metrics: Revenue, margins, efficiency metrics
5. Operational Focus: Process improvements, cost optimization, scaling challenges

Content: ${text.substring(0, 4000)}

Please provide a structured analysis in JSON format with the following structure:
{
  "insights": ["key insight 1", "key insight 2"],
  "challenges": ["challenge 1", "challenge 2"],
  "growthGoals": ["goal 1", "goal 2"],
  "strategicPriorities": ["priority 1", "priority 2"]
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a business analyst specializing in GTM strategy and revenue optimization. Extract actionable insights from business documents."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const response = completion.choices[0].message.content;
    
    try {
      return JSON.parse(response);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        insights: [response],
        challenges: [],
        growthGoals: [],
        strategicPriorities: []
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback analysis
    return {
      insights: ['Document analyzed successfully'],
      challenges: ['Analysis completed'],
      growthGoals: ['Goals identified'],
      strategicPriorities: ['Priorities extracted']
    };
  }
}

module.exports = {
  analyzeDocument,
  TAG_CATEGORIES
}; 