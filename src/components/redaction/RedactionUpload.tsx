import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FileItem {
  name: string;
  status: string;
}

const RedactionUpload: React.FC = () => {
  const navigate = useNavigate();
  
  const [files] = useState<FileItem[]>([
    { name: 'Financial_Proposal.pdf', status: 'ready' },
    { name: 'Technical_Proposal.pdf', status: 'ready' },
    { name: 'Attachment_P.xlsx', status: 'ready' }
  ]);

  const [options, setOptions] = useState({
    autoDetect: true,
    dollarAmounts: true,
    taxIds: true,
    salaries: false
  });

  const handleAddDocuments = () => {
    alert('Demo feature - using sample documents for demonstration');
  };

  const handleStartRedaction = () => {
    navigate('/redaction/editor');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <button 
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Generate Redacted Versions for FOIA Compliance
            </h1>
            <p className="text-gray-600 mt-2">
              Maryland procurement requires both full and redacted versions of proposals. 
              Our AI-powered tool helps you create compliant redacted documents in minutes.
            </p>
          </div>

          {/* File List */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Documents:</h2>
            <div className="border-2 border-gray-200 rounded-lg p-4 space-y-3">
              {files.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <span className="font-medium text-gray-900">{file.name}</span>
                      <p className="text-sm text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-2 text-green-600 font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ready
                  </span>
                </div>
              ))}
            </div>
            <button 
              onClick={handleAddDocuments}
              className="mt-4 px-6 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              + Add Documents
            </button>
          </div>

          {/* Redaction Options */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Redaction Options:</h2>
            <div className="space-y-3 bg-gray-50 p-6 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={options.autoDetect}
                  onChange={(e) => setOptions({...options, autoDetect: e.target.checked})}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <span className="text-gray-900 font-medium group-hover:text-blue-600">
                    Auto-detect sensitive content (AI-powered)
                  </span>
                  <p className="text-sm text-gray-500">Uses machine learning to identify sensitive information</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={options.dollarAmounts}
                  onChange={(e) => setOptions({...options, dollarAmounts: e.target.checked})}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <span className="text-gray-900 font-medium group-hover:text-blue-600">
                    Dollar amounts and pricing
                  </span>
                  <p className="text-sm text-gray-500">Redact all monetary values and rates</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={options.taxIds}
                  onChange={(e) => setOptions({...options, taxIds: e.target.checked})}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <span className="text-gray-900 font-medium group-hover:text-blue-600">
                    Tax IDs and SSNs
                  </span>
                  <p className="text-sm text-gray-500">Protect identification numbers</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={options.salaries}
                  onChange={(e) => setOptions({...options, salaries: e.target.checked})}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <span className="text-gray-900 font-medium group-hover:text-blue-600">
                    Personnel salaries
                  </span>
                  <p className="text-sm text-gray-500">Redact employee compensation information</p>
                </div>
              </label>
            </div>
          </div>

          {/* Information Banner */}
          <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900">Why Redaction Matters</h3>
                <p className="text-sm text-blue-800 mt-1">
                  Maryland FOIA laws require redacted versions of proposals to protect proprietary pricing, 
                  trade secrets, and sensitive information. Failure to provide proper redactions can result 
                  in proposal rejection or legal compliance issues.
                </p>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button 
            onClick={handleStartRedaction}
            className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            Start Redaction Wizard
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedactionUpload;

