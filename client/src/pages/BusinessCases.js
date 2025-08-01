import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Calendar,
  Building2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PresentationViewer from '../components/PresentationViewer';

const BusinessCases = () => {
  const [businessCases, setBusinessCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    fetchBusinessCases();
  }, []);

  const fetchBusinessCases = async () => {
    try {
      const response = await axios.get('/api/business-cases');
      setBusinessCases(response.data.businessCases || []);
    } catch (error) {
      console.error('Error fetching business cases:', error);
      toast.error('Failed to load business cases');
    } finally {
      setLoading(false);
    }
  };

  const generatePresentation = async (businessCaseId) => {
    try {
      const response = await axios.post(`/api/business-cases/${businessCaseId}/generate`);
      toast.success('Presentation generated successfully!');
      return response.data.presentation;
    } catch (error) {
      console.error('Error generating presentation:', error);
      toast.error('Failed to generate presentation');
    }
  };

  const viewPresentation = async (businessCaseId) => {
    try {
      const response = await axios.get(`/api/business-cases/${businessCaseId}/view`);
      setSelectedPresentation(response.data.presentation);
      setIsViewerOpen(true);
      toast.success('Presentation loaded successfully!');
    } catch (error) {
      console.error('Error viewing presentation:', error);
      toast.error('Failed to view presentation');
    }
  };

  const exportPresentation = async (businessCaseId, format = 'pptx') => {
    try {
      const response = await axios.post(`/api/business-cases/${businessCaseId}/export`, {
        format
      });
      toast.success(`Presentation exported as ${format.toUpperCase()}`);
      return response.data.export;
    } catch (error) {
      console.error('Error exporting presentation:', error);
      toast.error('Failed to export presentation');
    }
  };

  const deleteBusinessCase = async (businessCaseId) => {
    if (!window.confirm('Are you sure you want to delete this business case?')) {
      return;
    }

    try {
      // In a real app, you'd call the delete API
      setBusinessCases(businessCases.filter(bc => bc.id !== businessCaseId));
      toast.success('Business case deleted successfully');
    } catch (error) {
      console.error('Error deleting business case:', error);
      toast.error('Failed to delete business case');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Business Cases</h1>
            <p className="text-gray-600 mt-2">
              Manage and export your generated business case presentations
            </p>
          </div>
          <button className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            New Business Case
          </button>
        </div>
      </div>

      {/* Business Cases List */}
      {businessCases.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No business cases yet</h3>
          <p className="text-gray-500 mb-6">
            Create your first business case by analyzing a company document
          </p>
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Business Case
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessCases.map((businessCase) => (
            <div key={businessCase.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {businessCase.companyName}
                    </h3>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    businessCase.status === 'draft' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {businessCase.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Created {formatDate(businessCase.createdAt)}
                  </div>
                  
                  {businessCase.revenueOSMapping?.confidence && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      {Math.round(businessCase.revenueOSMapping.confidence * 100)}% confidence
                    </div>
                  )}
                </div>

                {/* RevenueOS Pillars */}
                {businessCase.revenueOSMapping?.pillars && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">RevenueOS Mapping</h4>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(businessCase.revenueOSMapping.pillars)
                        .filter(([, data]) => data.relevance > 0.5)
                        .map(([pillar, data]) => (
                          <span
                            key={pillar}
                            className={`px-2 py-1 text-xs font-medium rounded-full text-white ${
                              pillar === 'AIM' ? 'bg-revenueos-aim' :
                              pillar === 'ACT' ? 'bg-revenueos-act' :
                              pillar === 'ARRANGE' ? 'bg-revenueos-arrange' :
                              'bg-revenueos-anticipate'
                            }`}
                          >
                            {pillar} ({Math.round(data.relevance * 100)}%)
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => viewPresentation(businessCase.id)}
                    className="flex-1 btn-primary text-sm py-2"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => exportPresentation(businessCase.id, 'pptx')}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </button>
                  <button
                    onClick={() => deleteBusinessCase(businessCase.id)}
                    className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sample Business Cases for Demo */}
      {businessCases.length === 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sample Business Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-revenueos-arrange">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Zoom Communications</h3>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Complete
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Created Jan 31, 2024
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-2" />
                  85% confidence
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">RevenueOS Mapping</h4>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 text-xs font-medium bg-revenueos-arrange text-white rounded-full">
                    ARRANGE (90%)
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-revenueos-act text-white rounded-full">
                    ACT (80%)
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 btn-primary text-sm py-2">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button className="flex-1 btn-secondary text-sm py-2">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-revenueos-aim">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Microsoft</h3>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Complete
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Created Dec 31, 2024
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-2" />
                  92% confidence
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">RevenueOS Mapping</h4>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 text-xs font-medium bg-revenueos-aim text-white rounded-full">
                    AIM (80%)
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-revenueos-arrange text-white rounded-full">
                    ARRANGE (90%)
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 btn-primary text-sm py-2">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button className="flex-1 btn-secondary text-sm py-2">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Presentation Viewer Modal */}
      <PresentationViewer
        presentation={selectedPresentation}
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedPresentation(null);
        }}
      />
    </div>
  );
};

export default BusinessCases; 