# Business Case Platform

An integrated platform for building intelligent business cases using the RevenueOS framework. This tool helps consultants and sales teams create compelling business cases by analyzing company data and mapping it to strategic GTM consulting services.

**🚀 Ready for deployment on Render!**

## 🎯 What This Platform Does

1. **Data Ingestion**: Upload PDFs (annual reports, 10-Ks), Excel files, and notes
2. **Intelligent Analysis**: Extract growth goals, challenges, and strategic priorities
3. **RevenueOS Mapping**: Automatically map findings to your 4-pillar framework:
   - **A. Aim**: Alignment on True North, ICP identification, positioning, pricing
   - **B. Act**: Optimizing capacity, KPIs, execution standards
   - **C. Arrange**: Creating velocity, pipeline optimization, sales narrative
   - **D. Anticipate**: Future thinking, forecasting, deal review, account planning
4. **Business Case Generation**: Create slide decks showing the path from company goals to your services

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API key

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   PORT=3001
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
business-case-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── services/      # API calls
│   │   └── utils/         # Helper functions
├── server/                 # Node.js backend
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   └── models/            # Data models
├── data/                  # Sample data and templates
└── docs/                  # Documentation
```

## 🎨 Features

### 1. Data Upload & Processing
- **PDF Upload**: Parse annual reports, 10-Ks, earnings calls
- **Excel Import**: Process financial data, KPIs, metrics
- **Text Notes**: Manual input for interviews, meetings, research

### 2. Intelligent Tagging System
The platform automatically tags content with categories like:
- `revenue_growth` → Maps to **C. Arrange**
- `positioning` → Maps to **A. Aim**
- `kpi_alignment` → Maps to **B. Act**
- `forecast_accuracy` → Maps to **D. Anticipate**

### 3. Business Case Builder
- **Visual Mapping**: Drag-and-drop interface connecting problems to solutions
- **Template System**: Pre-built slides for different personas (CEO, COO, VP Sales)
- **Financial Modeling**: ROI calculators and impact projections
- **Export Options**: PowerPoint, PDF, Google Slides

### 4. Learning System
- **Case History**: Track all business cases and iterations
- **Success Patterns**: Identify what drives meetings and deals
- **Team Collaboration**: Share insights and templates

## 🔧 Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI/ML**: OpenAI GPT-4 for text analysis
- **File Processing**: PDF.js, Excel.js
- **Export**: python-pptx, Puppeteer

## 📊 Example Workflow

1. **Upload Company Data**: Upload Zoom's 10-K showing 3% revenue growth
2. **Automatic Analysis**: System extracts growth goals, identifies challenges
3. **RevenueOS Mapping**: Maps to C. Arrange (pipeline velocity) and B. Act (execution)
4. **Business Case Creation**: Generates slides showing how GTM consulting addresses gaps
5. **Export**: Download presentation ready for client meeting

## 🎯 RevenueOS Framework Integration

The platform is built around your 4-pillar RevenueOS framework:

### A. Aim
- **Purpose**: Strategic alignment and market positioning
- **Key Questions**: Who is your ICP? How do you position? What's your pricing strategy?
- **Platform Features**: ICP analysis, competitive positioning, pricing optimization

### B. Act
- **Purpose**: Execution excellence and capacity optimization
- **Key Questions**: What are your KPIs? How do you measure success? Who does what?
- **Platform Features**: KPI dashboard, execution tracking, role optimization

### C. Arrange
- **Purpose**: Velocity and scalable growth
- **Key Questions**: How do you build pipeline? What's your sales narrative?
- **Platform Features**: Pipeline modeling, sales velocity tools, narrative builder

### D. Anticipate
- **Purpose**: Future planning and revenue control
- **Key Questions**: How do you forecast? What's your deal review process?
- **Platform Features**: Forecasting tools, deal review templates, account planning

## 🚀 Next Steps

1. **Set up your environment** (see Quick Start above)
2. **Upload sample data** to test the system
3. **Customize templates** for your specific services
4. **Train the AI** on your past successful business cases
5. **Integrate with your CRM** for seamless workflow

## 🤝 Contributing

This is a learning platform designed to help you understand how to build business case tools. Feel free to modify and extend based on your specific needs.

## 📞 Support

For questions or issues, please refer to the documentation in the `/docs` folder or create an issue in the repository. 