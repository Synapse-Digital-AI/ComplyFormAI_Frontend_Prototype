import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Redaction {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  label: string;
}

interface Suggestion {
  type: string;
  count: number;
  label: string;
}

const RedactionEditor: React.FC = () => {
  const navigate = useNavigate();
  
  // Pre-defined redaction zones (positioned to match common financial document structure)
  const [redactions, setRedactions] = useState<Redaction[]>([
    { id: 1, x: 450, y: 180, width: 100, height: 20, active: true, label: 'Senior Dev Rate' },
    { id: 2, x: 620, y: 180, width: 120, height: 20, active: true, label: 'Senior Dev Total' },
    { id: 3, x: 450, y: 210, width: 100, height: 20, active: true, label: 'Mid Dev Rate' },
    { id: 4, x: 620, y: 210, width: 120, height: 20, active: true, label: 'Mid Dev Total' },
    { id: 5, x: 450, y: 240, width: 100, height: 20, active: true, label: 'Junior Dev Rate' },
    { id: 6, x: 620, y: 240, width: 120, height: 20, active: true, label: 'Junior Dev Total' },
    { id: 7, x: 620, y: 280, width: 120, height: 20, active: true, label: 'Total Labor' },
    { id: 8, x: 620, y: 360, width: 120, height: 20, active: true, label: 'Subcontractor 1' },
    { id: 9, x: 620, y: 390, width: 120, height: 20, active: true, label: 'Subcontractor 2' },
    { id: 10, x: 620, y: 430, width: 120, height: 20, active: true, label: 'Sub Total' },
    { id: 11, x: 620, y: 510, width: 120, height: 20, active: true, label: 'Overhead' },
    { id: 12, x: 620, y: 540, width: 120, height: 20, active: true, label: 'G&A' },
    { id: 13, x: 300, y: 650, width: 150, height: 20, active: true, label: 'Tax ID' },
    { id: 14, x: 300, y: 680, width: 180, height: 20, active: true, label: 'Phone Number' },
  ]);

  const [suggestions] = useState<Suggestion[]>([
    { type: 'dollar_amounts', count: 12, label: '12 dollar amounts detected' },
    { type: 'salaries', count: 3, label: '3 salary figures detected' },
    { type: 'tax_id', count: 1, label: '1 Tax ID detected' },
    { type: 'contact', count: 1, label: '1 phone number detected' }
  ]);

  const [tool, setTool] = useState<'select' | 'redact'>('redact');

  const toggleRedaction = (id: number) => {
    setRedactions(redactions.map(r => 
      r.id === id ? { ...r, active: !r.active } : r
    ));
  };

  const handleRedactAll = (type: string) => {
    alert(`Demo: Would automatically redact all ${type}. In production, this would apply all suggested redactions of this type.`);
  };

  const handleSave = () => {
    const activeCount = redactions.filter(r => r.active).length;
    if (activeCount === 0) {
      alert('Please select at least one area to redact.');
      return;
    }
    navigate('/redaction/package');
  };

  const activeRedactionCount = redactions.filter(r => r.active).length;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel: PDF Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/redaction/upload')}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <h1 className="text-xl font-bold text-gray-900">Redaction Editor - Financial_Proposal.pdf</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {activeRedactionCount} areas marked for redaction
              </span>
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="bg-white border-b border-gray-200 p-3 shadow-sm">
          <div className="flex gap-2 max-w-7xl mx-auto">
            <button 
              onClick={() => setTool('select')}
              className={`px-4 py-2 rounded transition ${
                tool === 'select' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                Select
              </div>
            </button>
            <button 
              onClick={() => setTool('redact')}
              className={`px-4 py-2 rounded transition ${
                tool === 'redact' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Redact Box
              </div>
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
              Undo
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
              Redo
            </button>
          </div>
        </div>

        {/* PDF Preview Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white shadow-2xl" style={{ width: '800px', height: '1000px' }}>
              {/* Background: Simulated PDF Content */}
              <div className="absolute inset-0 p-12 text-sm font-mono">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">ABC CONSTRUCTION COMPANY</h2>
                  <h3 className="text-lg">Financial Proposal - DGS Agile Resources</h3>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-bold mb-3">Labor Categories and Rates:</h3>
                  <div className="space-y-2 ml-4">
                    <div className="flex justify-between">
                      <span>Senior Developer</span>
                      <span>$175/hour</span>
                      <span>2,080 hours</span>
                      <span>$364,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mid-Level Developer</span>
                      <span>$125/hour</span>
                      <span>4,160 hours</span>
                      <span>$520,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Junior Developer</span>
                      <span>$85/hour</span>
                      <span>2,080 hours</span>
                      <span>$176,800</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total Labor:</span>
                      <span></span>
                      <span></span>
                      <span>$1,060,800</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold mb-3">Subcontractor Costs:</h3>
                  <div className="space-y-2 ml-4">
                    <div className="flex justify-between">
                      <span>Unisoft (MBE)</span>
                      <span>$450,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pinnacle (VSBE)</span>
                      <span>$150,000</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total Subcontractor:</span>
                      <span>$600,000</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold mb-3">Indirect Costs:</h3>
                  <div className="space-y-2 ml-4">
                    <div className="flex justify-between">
                      <span>Overhead (40%)</span>
                      <span>$424,320</span>
                    </div>
                    <div className="flex justify-between">
                      <span>G&A (15%)</span>
                      <span>$159,120</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profit (10%)</span>
                      <span>$106,080</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t-2">
                  <p className="mb-2">ABC Construction Company</p>
                  <p className="mb-2">Tax ID: 52-1234567</p>
                  <p>Contact: John Smith, (410) 555-0123</p>
                </div>
              </div>
              
              {/* Overlay: Redaction Boxes */}
              {redactions.map(redaction => (
                <div
                  key={redaction.id}
                  onClick={() => toggleRedaction(redaction.id)}
                  className={`absolute cursor-pointer transition-all ${
                    redaction.active 
                      ? 'bg-black bg-opacity-80 border-2 border-red-500' 
                      : 'bg-transparent border-2 border-gray-400 border-dashed'
                  }`}
                  style={{
                    left: redaction.x,
                    top: redaction.y,
                    width: redaction.width,
                    height: redaction.height
                  }}
                  title={`${redaction.label} - Click to ${redaction.active ? 'remove' : 'add'} redaction`}
                />
              ))}
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Click on black boxes to toggle redactions on/off</p>
              <p className="text-xs mt-1">Active = Black | Inactive = Dashed outline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: AI Suggestions */}
      <div className="w-96 bg-white shadow-xl border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">AI Suggestions</h2>
          <p className="text-sm text-gray-600 mt-1">Automatically detected sensitive content</p>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-4">
          {suggestions.map((suggestion, idx) => (
            <div key={idx} className="p-4 border-2 border-yellow-300 rounded-lg bg-yellow-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">{suggestion.label}</p>
                    <p className="text-xs text-gray-600 mt-1">Type: {suggestion.type.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
              <button 
                className="w-full mt-2 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
                onClick={() => handleRedactAll(suggestion.type)}
              >
                Redact All
              </button>
            </div>
          ))}

          {/* Statistics */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Detection Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-800">Total Detections:</span>
                <span className="font-semibold text-blue-900">17</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Active Redactions:</span>
                <span className="font-semibold text-blue-900">{activeRedactionCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Confidence:</span>
                <span className="font-semibold text-green-600">98.5%</span>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">How to Use</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Click black boxes to toggle redactions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Use "Redact All" for quick category-wide redaction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Review all redactions before continuing</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Save Button */}
        <div className="p-6 border-t border-gray-200">
          <button 
            onClick={handleSave}
            className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg shadow-lg flex items-center justify-center gap-2"
          >
            Save & Continue
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <p className="text-center text-xs text-gray-500 mt-2">
            Generate redacted version with {activeRedactionCount} redactions
          </p>
        </div>
      </div>
    </div>
  );
};

export default RedactionEditor;

