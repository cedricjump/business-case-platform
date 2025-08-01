const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Maps analysis findings to RevenueOS framework pillars
 * @param {Object} analysis - The analysis results
 * @returns {Object} RevenueOS mapping
 */
async function mapToRevenueOS(analysis) {
  try {
    const prompt = `
    Analyze the following business analysis and map the findings to the RevenueOS framework pillars:

    Analysis: ${JSON.stringify(analysis, null, 2)}

    Map the findings to these RevenueOS pillars:
    
    A. AIM - Strategic alignment and market positioning
    - ICP identification, competitive positioning, pricing strategy
    
    B. ACT - Execution excellence and capacity optimization  
    - KPI alignment, execution tracking, role optimization
    
    C. ARRANGE - Velocity and scalable growth
    - Pipeline modeling, sales velocity, narrative building
    
    D. ANTICIPATE - Future planning and revenue control
    - Forecasting, deal review, account planning

    Return a JSON object with this structure:
    {
      "aim": {
        "findings": ["list of relevant findings"],
        "priority": "high/medium/low",
        "recommendations": ["list of recommendations"]
      },
      "act": { same structure },
      "arrange": { same structure },
      "anticipate": { same structure }
    }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a business consultant specializing in RevenueOS framework analysis. Map business findings to the appropriate pillars."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    
    // Try to parse JSON response
    try {
      return JSON.parse(response);
    } catch (parseError) {
      // If parsing fails, return a structured fallback
      return {
        aim: {
          findings: ["Strategic positioning needs analysis"],
          priority: "medium",
          recommendations: ["Conduct ICP analysis", "Review competitive positioning"]
        },
        act: {
          findings: ["Execution processes require optimization"],
          priority: "high", 
          recommendations: ["Define clear KPIs", "Optimize team roles"]
        },
        arrange: {
          findings: ["Pipeline velocity needs improvement"],
          priority: "high",
          recommendations: ["Implement sales velocity tracking", "Build compelling narratives"]
        },
        anticipate: {
          findings: ["Forecasting accuracy needs improvement"],
          priority: "medium",
          recommendations: ["Implement deal review process", "Enhance account planning"]
        }
      };
    }
  } catch (error) {
    console.error('RevenueOS mapping error:', error);
    
    // Return fallback mapping
    return {
      aim: {
        findings: ["Analysis mapping failed"],
        priority: "medium",
        recommendations: ["Review analysis data"]
      },
      act: {
        findings: ["Execution analysis needed"],
        priority: "medium",
        recommendations: ["Assess current processes"]
      },
      arrange: {
        findings: ["Pipeline analysis required"],
        priority: "medium", 
        recommendations: ["Review sales processes"]
      },
      anticipate: {
        findings: ["Forecasting analysis needed"],
        priority: "medium",
        recommendations: ["Implement planning processes"]
      }
    };
  }
}

module.exports = {
  mapToRevenueOS
}; 