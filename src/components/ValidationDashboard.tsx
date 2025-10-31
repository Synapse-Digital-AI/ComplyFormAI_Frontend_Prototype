import React, { useState } from 'react';
import { bidsApi } from '../api/client';
import { ValidationResponse } from '../types';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface ValidationDashboardProps {
  bidId: string;
}

const ValidationDashboard: React.FC<ValidationDashboardProps> = ({ bidId }) => {
  const [results, setResults] = useState<ValidationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runValidation = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await bidsApi.validate(bidId);
      setResults(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Validation failed');
      console.error('Validation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FAIL':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'FAIL':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'WARNING':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Validation Results</h3>
        <button
          onClick={runValidation}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Validating...' : 'Run Validation'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!results && !error && (
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>Click "Run Validation" to check your bid for errors</p>
        </div>
      )}

      {results && (
        <div className="space-y-4">
          {/* Summary */}
          <div className={`p-4 rounded-lg border-2 ${getStatusColor(results.overall_status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(results.overall_status)}
                <div>
                  <h4 className="font-semibold text-lg">
                    Overall Status: {results.overall_status}
                  </h4>
                  <p className="text-sm mt-1">
                    {results.passed} passed • {results.failed} failed • {results.warnings} warnings
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Results */}
          <div className="space-y-3">
            {results.validations.map((validation) => (
              <div
                key={validation.id}
                className={`p-4 rounded-lg border ${getStatusColor(validation.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(validation.status)}
<div className="flex-1">
<h5 className="font-semibold mb-1">{validation.rule_name}</h5>
<p className="text-sm">{validation.error_message}</p>
</div>
</div>
</div>
))}
</div>
</div>
)}
</div>
);
};

export default ValidationDashboard;