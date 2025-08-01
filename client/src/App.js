import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import BusinessCases from './pages/BusinessCases';
import Companies from './pages/Companies';
import Templates from './pages/Templates';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/business-cases" element={<BusinessCases />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/templates" element={<Templates />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 