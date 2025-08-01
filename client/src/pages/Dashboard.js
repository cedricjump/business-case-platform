import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  Building2, 
  TrendingUp, 
  Target,
  Zap,
  Clock,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalBusinessCases: 0,
    recentAnalyses: 0,
    successRate: 0
  });

  const [recentCompanies, setRecentCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [companiesRes, businessCasesRes] = await Promise.all([
        axios.get('/api/companies'),
        axios.get('/api/business-cases')
      ]);

      const companies = companiesRes.data.companies || [];
      const businessCases = businessCasesRes.data.businessCases || [];

      setStats({
        totalCompanies: companies.length,
        totalBusinessCases: businessCases.length,
        recentAnalyses: companies.filter(c => {
          const daysSince = (new Date() - new Date(c.lastAnalysis)) / (1000 * 60 * 60 * 24);
          return daysSince <= 30;
        }).length,
        successRate: 85 // Mock data
      });

      setRecentCompanies(companies.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Upload Document',
      description: 'Analyze PDF, Excel, or text files',
      icon: Upload,
      href: '/analysis',
      color: 'bg-blue-500'
    },
    {
      title: 'Create Business Case',
      description: 'Generate new presentation',
      icon: FileText,
      href: '/business-cases',
      color: 'bg-green-500'
    },
    {
      title: 'View Companies',
      description: 'Browse analyzed companies',
      icon: Building2,
      href: '/companies',
      color: 'bg-purple-500'
    },
    {
      title: 'Templates',
      description: 'Browse presentation templates',
      icon: FileText,
      href: '/templates',
      color: 'bg-orange-500'
    }
  ];

  const revenueOSPillars = [
    {
      name: 'A. Aim',
      description: 'Alignment on True North across your sales org',
      icon: Target,
      color: 'bg-revenueos-aim',
      keyAreas: ['ICP identification', 'Market positioning', 'Pricing strategy']
    },
    {
      name: 'B. Act',
      description: 'Optimizing Capacity. Doing the right things, right',
      icon: CheckCircle,
      color: 'bg-revenueos-act',
      keyAreas: ['KPI alignment', 'Execution standards', 'Performance measurement']
    },
    {
      name: 'C. Arrange',
      description: 'Creating Velocity and enabling growth at scale',
      icon: Zap,
      color: 'bg-revenueos-arrange',
      keyAreas: ['Pipeline optimization', 'Sales velocity', 'Narrative development']
    },
    {
      name: 'D. Anticipate',
      description: 'Future thinking. Improve Pipeline, Forecast and Revenue Control',
      icon: Clock,
      color: 'bg-revenueos-anticipate',
      keyAreas: ['Forecasting', 'Deal review', 'Account planning']
    }
  ];

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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to your RevenueOS Business Case Platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Companies</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCompanies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Business Cases</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBusinessCases}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Analyses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recentAnalyses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.href}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* RevenueOS Framework */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">RevenueOS Framework</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {revenueOSPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${pillar.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{pillar.name}</h3>
                    <p className="text-sm text-gray-600">{pillar.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {pillar.keyAreas.map((area, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                      {area}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Companies */}
      {recentCompanies.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Companies</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {recentCompanies.map((company) => (
                <div key={company.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                      <p className="text-sm text-gray-600">Last analyzed: {company.lastAnalysis}</p>
                    </div>
                    <Link
                      to={`/companies/${company.id}`}
                      className="btn-primary text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 