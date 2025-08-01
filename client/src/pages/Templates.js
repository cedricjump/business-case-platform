import React, { useState, useEffect } from 'react';
import { 
  LayoutTemplate, 
  User, 
  Settings, 
  TrendingUp,
  Eye,
  Download,
  Copy
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/templates');
      setTemplates(response.data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const getPersonaIcon = (templateId) => {
    const icons = {
      ceo: User,
      coo: Settings,
      vpSales: TrendingUp
    };
    return icons[templateId] || LayoutTemplate;
  };

  const getPersonaColor = (templateId) => {
    const colors = {
      ceo: 'bg-blue-500',
      coo: 'bg-green-500',
      vpSales: 'bg-purple-500'
    };
    return colors[templateId] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Presentation Templates</h1>
        <p className="text-gray-600 mt-2">
          Choose from persona-driven templates for different stakeholders
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const Icon = getPersonaIcon(template.id);
          return (
            <div key={template.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${getPersonaColor(template.id)} mr-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>

                {/* Slide Preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Slide Structure</h4>
                  <div className="space-y-1">
                    {template.slides?.slice(0, 4).map((slide, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                        {slide.title}
                      </div>
                    ))}
                    {template.slides?.length > 4 && (
                      <div className="text-xs text-gray-500">
                        +{template.slides.length - 4} more slides
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 btn-primary text-sm py-2">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </button>
                  <button className="flex-1 btn-secondary text-sm py-2">
                    <Copy className="w-4 h-4 mr-1" />
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sample Templates for Demo */}
      {templates.length === 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-500 mr-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">CEO Template</h3>
                  <p className="text-sm text-gray-600">Focus on revenue growth, market expansion, competitive advantage</p>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Slide Structure</h4>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    Strategic Growth Opportunity
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    Executive Summary
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    RevenueOS: A. Aim
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    Financial Impact
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 btn-primary text-sm py-2">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </button>
                <button className="flex-1 btn-secondary text-sm py-2">
                  <Copy className="w-4 h-4 mr-1" />
                  Use Template
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-green-500 mr-4">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">COO Template</h3>
                  <p className="text-sm text-gray-600">Operational efficiency, cost reduction, process optimization</p>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Slide Structure</h4>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    Operational Excellence Initiative
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    Current State Analysis
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    RevenueOS: B. Act
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    Operational Metrics
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 btn-primary text-sm py-2">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </button>
                <button className="flex-1 btn-secondary text-sm py-2">
                  <Copy className="w-4 h-4 mr-1" />
                  Use Template
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-purple-500 mr-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">VP Sales Template</h3>
                  <p className="text-sm text-gray-600">Revenue acceleration, pipeline improvement, sales productivity</p>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Slide Structure</h4>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    Sales Excellence Program
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    Sales Performance Analysis
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    RevenueOS: C. Arrange
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    Pipeline Optimization
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 btn-primary text-sm py-2">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </button>
                <button className="flex-1 btn-secondary text-sm py-2">
                  <Copy className="w-4 h-4 mr-1" />
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Usage Guide */}
      <div className="mt-12 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Use Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-lg">1</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Choose Template</h3>
            <p className="text-sm text-gray-600">
              Select the appropriate template based on your target audience (CEO, COO, VP Sales)
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold text-lg">2</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Customize Content</h3>
            <p className="text-sm text-gray-600">
              The system automatically maps your analysis to the relevant RevenueOS pillars
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold text-lg">3</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Export & Present</h3>
            <p className="text-sm text-gray-600">
              Download as PowerPoint, PDF, or Google Slides for your client presentation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates; 