import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface FileItemProps {
  name: string;
  fullPath: string;
  redactedPath?: string;
  isRedacted?: boolean;
}

const FileItem: React.FC<FileItemProps> = ({ name, fullPath, redactedPath, isRedacted }) => {
  const downloadFile = (path: string) => {
    const link = document.createElement('a');
    link.href = path;
    link.download = path.split('/').pop() || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const previewFile = (path: string) => {
    window.open(path, '_blank');
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${
      isRedacted ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center gap-3">
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div>
          <span className={`font-semibold ${isRedacted ? 'text-yellow-900' : 'text-gray-900'}`}>
            {name}
          </span>
          {isRedacted && (
            <span className="ml-2 px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs rounded font-medium">
              REDACTED
            </span>
          )}
          <p className="text-sm text-gray-500">PDF Document</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => downloadFile(isRedacted ? (redactedPath || fullPath) : fullPath)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
        >
          Download
        </button>
        <button 
          onClick={() => previewFile(isRedacted ? (redactedPath || fullPath) : fullPath)}
          className="px-4 py-2 text-sm border-2 border-gray-300 rounded hover:bg-gray-50 transition font-medium"
        >
          Preview
        </button>
      </div>
    </div>
  );
};

const RedactionPackage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate processing with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 300);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const downloadZip = () => {
    alert('Demo: In production, this would download a ZIP file containing:\n\n• All full versions\n• All redacted versions\n• Verification certificate\n• Redaction audit log\n\nFor this demo, please download files individually.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="animate-spin w-32 h-32 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Redacted Versions...</h2>
          <p className="text-gray-600 mb-4">Processing 3 documents with AI-powered redaction</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">{progress}% complete</p>
          
          <div className="mt-6 text-left bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-700 mb-2">✓ Analyzing document structure...</p>
            <p className="text-sm text-gray-700 mb-2">✓ Detecting sensitive information...</p>
            <p className="text-sm text-gray-700 mb-2">✓ Applying redactions...</p>
            <p className="text-sm text-gray-700">✓ Scrubbing metadata...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Success Banner */}
        <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h1 className="text-2xl font-bold text-green-900">Redaction Complete!</h1>
              <p className="text-green-800 mt-1">Your submission package is ready for download</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Navigation */}
          <div className="flex items-center justify-between pb-6 border-b">
            <button 
              onClick={() => navigate('/redaction/editor')}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Editor
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Return to Dashboard
            </button>
          </div>

          {/* Full Versions */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900">FULL VERSIONS (Confidential)</h2>
            </div>
            <p className="text-gray-600 mb-4">Original documents with all information intact. Upload to secure DGS portal.</p>
            <div className="space-y-3">
              <FileItem 
                name="Financial_Proposal_FULL.pdf"
                fullPath="/Financial_Proposal_FULL.pdf"
                isRedacted={false}
              />
              <FileItem 
                name="Technical_Proposal_FULL.pdf"
                fullPath="/Financial_Proposal_FULL.pdf"
                isRedacted={false}
              />
              <FileItem 
                name="Attachment_P_FULL.xlsx"
                fullPath="/Financial_Proposal_FULL.pdf"
                isRedacted={false}
              />
            </div>
          </div>

          {/* Redacted Versions */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900">REDACTED VERSIONS (For FOIA)</h2>
            </div>
            <p className="text-gray-600 mb-4">Redacted documents with sensitive information protected. For public record.</p>
            <div className="space-y-3">
              <FileItem 
                name="Financial_Proposal_REDACTED.pdf"
                fullPath="/Financial_Proposal_FULL.pdf"
                redactedPath="/Financial_Proposal_REDACTED.pdf"
                isRedacted={true}
              />
              <FileItem 
                name="Technical_Proposal_REDACTED.pdf"
                fullPath="/Financial_Proposal_FULL.pdf"
                redactedPath="/Financial_Proposal_REDACTED.pdf"
                isRedacted={true}
              />
              <FileItem 
                name="Attachment_P_REDACTED.xlsx"
                fullPath="/Financial_Proposal_FULL.pdf"
                redactedPath="/Financial_Proposal_REDACTED.pdf"
                isRedacted={true}
              />
            </div>
          </div>

          {/* Verification Report */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900">VERIFICATION REPORT</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg font-semibold text-gray-900">47 items redacted</span>
                </div>
                <p className="text-sm text-gray-600">All sensitive content identified and redacted</p>
              </div>
              
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg font-semibold text-gray-900">Metadata scrubbed</span>
                </div>
                <p className="text-sm text-gray-600">All document metadata removed for privacy</p>
              </div>
              
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg font-semibold text-gray-900">Redactions permanent</span>
                </div>
                <p className="text-sm text-gray-600">All redacted text is unrecoverable</p>
              </div>
              
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg font-semibold text-gray-900">Certificate generated</span>
                </div>
                <p className="text-sm text-gray-600">Compliance certificate included in package</p>
              </div>
            </div>
          </div>

          {/* Download Package Button */}
          <div>
            <button 
              onClick={downloadZip}
              className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Full Package (ZIP)
            </button>
            <p className="text-center text-sm text-gray-500 mt-2">
              Includes all files, verification report, and compliance certificate
            </p>
          </div>

          {/* Submission Checklist */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-bold text-yellow-900 mb-3">Maryland Submission Reminder</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-yellow-900">
                    <input type="checkbox" className="w-5 h-5 text-yellow-600 rounded" />
                    <span>Upload FULL version to secure DGS portal (confidential section)</span>
                  </label>
                  <label className="flex items-center gap-3 text-yellow-900">
                    <input type="checkbox" className="w-5 h-5 text-yellow-600 rounded" />
                    <span>Upload REDACTED version for public record (FOIA section)</span>
                  </label>
                  <label className="flex items-center gap-3 text-yellow-900">
                    <input type="checkbox" className="w-5 h-5 text-yellow-600 rounded" />
                    <span>Include redaction certificate with submission</span>
                  </label>
                  <label className="flex items-center gap-3 text-yellow-900">
                    <input type="checkbox" className="w-5 h-5 text-yellow-600 rounded" />
                    <span>Verify all pricing information is properly redacted</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600 mt-1">Documents Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">47</div>
              <div className="text-sm text-gray-600 mt-1">Items Redacted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">98.5%</div>
              <div className="text-sm text-gray-600 mt-1">Accuracy Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedactionPackage;

