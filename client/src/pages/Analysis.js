import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  Building2, 
  Target,
  CheckCircle,
  Zap,
  Clock,
  ArrowRight,
  Download
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Analysis = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    documentType: 'annual-report',
    text: ''
  });

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    await analyzeFile(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  const analyzeFile = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('companyName', formData.companyName || 'Unknown Company');
      formData.append('documentType', formData.documentType);

      const response = await axios.post('/api/analysis/document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalysis(response.data);
      toast.success('Document analyzed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze document');
    } finally {
      setLoading(false);
    }
  };

  const analyzeText = async () => {
    if (!formData.text.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/analysis/text', {
        text: formData.text,
        companyName: formData.companyName || 'Unknown Company',
        context: formData.documentType
      });

      setAnalysis(response.data);
      toast.success('Text analyzed successfully!');
    } catch (error) {
      console.error('Text analysis error:', error);
      toast.error('Failed to analyze text');
    } finally {
      setLoading(false);
    }
  };

  const createBusinessCase = async () => {
    if (!analysis) return;

    try {
      const response = await axios.post('/api/business-cases', {
        companyName: formData.companyName || 'Unknown Company',
        analysis: analysis.analysis,
        revenueOSMapping: analysis.revenueOSMapping,
        template: 'ceo' // Default template
      });

      toast.success('Business case created successfully!');
      // Redirect to business cases page
      window.location.href = '/business-cases';
    } catch (error) {
      console.error('Business case creation error:', error);
      toast.error('Failed to create business case');
    }
  };

  const getPillarColor = (pillar) => {
    const colors = {
      AIM: 'bg-revenueos-aim',
      ACT: 'bg-revenueos-act',
      ARRANGE: 'bg-revenueos-arrange',
      ANTICIPATE: 'bg-revenueos-anticipate'
    };
    return colors[pillar] || 'bg-gray-500';
  };

  const getPillarIcon = (pillar) => {
    const icons = {
      AIM: Target,
      ACT: CheckCircle,
      ARRANGE: Zap,
      ANTICIPATE: Clock
    };
    return icons[pillar] || FileText;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Document Analysis</h1>
        <p className="text-gray-600 mt-2">
          Upload documents or enter text to analyze and map to RevenueOS framework
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upload Document
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'text'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Enter Text
            </button>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          {activeTab === 'upload' ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="input-field"
                  placeholder="Enter company name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={formData.documentType}
                  onChange={(e) => setFormData({...formData, documentType: e.target.value})}
                  className="input-field"
                >
                  <option value="annual-report">Annual Report</option>
                  <option value="10-k">10-K Filing</option>
                  <option value="earnings-call">Earnings Call</option>
                  <option value="presentation">Investor Presentation</option>
                  <option value="notes">Meeting Notes</option>
                </select>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {isDragActive ? (
                  <p className="text-primary-600">Drop the file here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Drag and drop a file here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports PDF, Excel, and text files
                    </p>
                  </div>
                )}
              </div>

              {loading && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  <span className="text-gray-600">Analyzing document...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Enter Text</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="input-field"
                  placeholder="Enter company name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Context
                </label>
                <select
                  value={formData.documentType}
                  onChange={(e) => setFormData({...formData, documentType: e.target.value})}
                  className="input-field"
                >
                  <option value="notes">Meeting Notes</option>
                  <option value="interview">Interview Transcript</option>
                  <option value="research">Research Notes</option>
                  <option value="presentation">Presentation Notes</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Content
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  className="input-field h-32 resize-none"
                  placeholder="Paste or type your text here..."
                />
              </div>

              <button
                onClick={analyzeText}
                disabled={loading || !formData.text.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Text'}
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div>
          {analysis ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h2>
              
              {/* Company Info */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-2">Company Analysis</h3>
                <div className="space-y-2">
                  {analysis.analysis?.extractedInsights?.map((insight, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                      <span className="text-sm text-gray-700">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RevenueOS Mapping */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">RevenueOS Framework Mapping</h3>
                <div className="space-y-3">
                  {Object.entries(analysis.revenueOSMapping?.pillars || {}).map(([pillar, data]) => {
                    const Icon = getPillarIcon(pillar);
                    return (
                      <div key={pillar} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${getPillarColor(pillar)} mr-3`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-gray-900">{pillar}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {Math.round(data.relevance * 100)}% relevance
                          </span>
                        </div>
                        <div className="space-y-1">
                          {data.keyFindings?.map((finding, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-start">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2"></div>
                              {finding}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              {analysis.revenueOSMapping?.recommendations && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Recommendations</h3>
                  <div className="space-y-2">
                    {analysis.revenueOSMapping.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start">
                        <ArrowRight className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={createBusinessCase}
                  className="btn-success flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Create Business Case
                </button>
                <button
                  onClick={() => setAnalysis(null)}
                  className="btn-secondary"
                >
                  New Analysis
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h2>
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">
                  Upload a document or enter text to see analysis results here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analysis; 