import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Play,
  Pause,
  Target,
  CheckCircle,
  Zap,
  Clock,
  TrendingUp,
  Building2
} from 'lucide-react';

const PresentationViewer = ({ presentation, isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen || !presentation) return null;

  const { slides, metadata } = presentation;
  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
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

  const renderSlide = (slide, index) => {
    switch (slide.type) {
      case 'title':
        return (
          <div className="h-full flex flex-col justify-center items-center text-center p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{slide.title}</h1>
            <p className="text-xl text-gray-600 mb-8">{slide.subtitle}</p>
            <div className="max-w-2xl">
              <p className="text-lg text-gray-700 leading-relaxed">{slide.content}</p>
            </div>
          </div>
        );

      case 'overview':
        return (
          <div className="h-full p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{slide.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Key Insights</h3>
                <ul className="space-y-2">
                  {slide.content.insights?.map((insight, i) => (
                    <li key={i} className="text-blue-800 flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">Challenges</h3>
                <ul className="space-y-2">
                  {slide.content.challenges?.map((challenge, i) => (
                    <li key={i} className="text-orange-800 flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Growth Goals</h3>
                <ul className="space-y-2">
                  {slide.content.goals?.map((goal, i) => (
                    <li key={i} className="text-green-800 flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case 'pillar':
        const Icon = getPillarIcon(slide.pillar);
        return (
          <div className="h-full p-8">
            <div className="flex items-center mb-6">
              <div className={`p-3 rounded-lg ${getPillarColor(slide.pillar)} mr-4`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{slide.title}</h2>
                <p className="text-lg text-gray-600">RevenueOS Framework</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Findings</h3>
                <ul className="space-y-3">
                  {slide.content.findings?.map((finding, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                      <span className="text-gray-700">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended Services</h3>
                <div className="space-y-3">
                  {slide.content.services?.map((service, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg">
                      <span className="font-medium text-gray-900">{service}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Relevance Score</span>
                    <span className="text-lg font-bold text-gray-900">
                      {Math.round(slide.content.relevance * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${getPillarColor(slide.pillar).replace('bg-', 'bg-')}`}
                      style={{ width: `${slide.content.relevance * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'recommendations':
        return (
          <div className="h-full p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{slide.title}</h2>
            <div className="space-y-4">
              {slide.content?.map((rec, i) => (
                <div key={i} className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-white font-bold">{i + 1}</span>
                    </div>
                    <p className="text-lg text-gray-800">{rec}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'next-steps':
        return (
          <div className="h-full p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{slide.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {slide.content?.map((step, i) => (
                <div key={i} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">{i + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Phase {i + 1}</h3>
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{slide.title}</h2>
              <p className="text-gray-600">{slide.content}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {metadata?.companyName || 'Business Case'} - Presentation
            </h2>
            <span className="text-sm text-gray-500">
              Slide {currentSlide + 1} of {totalSlides}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={() => {/* Export functionality */}}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Content */}
        <div className="flex-1 relative overflow-hidden">
          <div className="h-full">
            {renderSlide(slides[currentSlide], currentSlide)}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentationViewer; 