import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  TrendingUp, 
  Target,
  CheckCircle,
  Zap,
  Clock,
  Eye,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('/api/companies');
      setCompanies(response.data.companies || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const getPillarIcon = (pillar) => {
    const icons = {
      AIM: Target,
      ACT: CheckCircle,
      ARRANGE: Zap,
      ANTICIPATE: Clock
    };
    return icons[pillar] || Building2;
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
        <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
        <p className="text-gray-600 mt-2">
          View analyzed companies and their RevenueOS insights
        </p>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                </div>
                <span className="text-sm text-gray-500">{company.industry}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last analyzed: {company.lastAnalysis}
                </div>
              </div>

              {/* RevenueOS Mapping */}
              {company.revenueOSMapping?.pillars && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">RevenueOS Insights</h4>
                  <div className="space-y-2">
                    {Object.entries(company.revenueOSMapping.pillars)
                      .filter(([, data]) => data.relevance > 0.5)
                      .sort(([,a], [,b]) => b.relevance - a.relevance)
                      .map(([pillar, data]) => {
                        const Icon = getPillarIcon(pillar);
                        return (
                          <div key={pillar} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`p-1 rounded ${getPillarColor(pillar)} mr-2`}>
                                <Icon className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">{pillar}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {Math.round(data.relevance * 100)}%
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Key Insights */}
              {company.analysis?.extractedInsights && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Key Insights</h4>
                  <div className="space-y-1">
                    {company.analysis.extractedInsights.slice(0, 2).map((insight, index) => (
                      <div key={index} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2"></div>
                        <span className="line-clamp-2">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 btn-primary text-sm py-2">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
                <button className="flex-1 btn-secondary text-sm py-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Create Case
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sample Companies for Demo */}
      {companies.length === 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sample Companies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-revenueos-arrange">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Zoom Communications</h3>
                <span className="text-sm text-gray-500">Technology</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last analyzed: Jan 31, 2024
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">RevenueOS Insights</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-1 rounded bg-revenueos-arrange mr-2">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">ARRANGE</span>
                    </div>
                    <span className="text-sm text-gray-500">90%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-1 rounded bg-revenueos-act mr-2">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">ACT</span>
                    </div>
                    <span className="text-sm text-gray-500">80%</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 btn-primary text-sm py-2">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
                <button className="flex-1 btn-secondary text-sm py-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Create Case
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-revenueos-aim">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Microsoft</h3>
                <span className="text-sm text-gray-500">Technology</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last analyzed: Dec 31, 2024
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">RevenueOS Insights</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-1 rounded bg-revenueos-aim mr-2">
                        <Target className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">AIM</span>
                    </div>
                    <span className="text-sm text-gray-500">80%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-1 rounded bg-revenueos-arrange mr-2">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">ARRANGE</span>
                    </div>
                    <span className="text-sm text-gray-500">90%</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 btn-primary text-sm py-2">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
                <button className="flex-1 btn-secondary text-sm py-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Create Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies; 