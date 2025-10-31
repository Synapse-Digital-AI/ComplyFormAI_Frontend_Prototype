import React, { useState, useEffect } from 'react';
import { subcontractorsApi, bidsApi } from '../api/client';
import { Subcontractor } from '../types';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';

interface SubcontractorFormProps {
  bidId: string;
  onSuccess: () => void;
}

const SubcontractorForm: React.FC<SubcontractorFormProps> = ({ bidId, onSuccess }) => {
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    subcontractor_id: '',
    work_description: '',
    naics_code: '',
    subcontract_value: '',
    counts_toward_mbe: false,
  });

  useEffect(() => {
    loadSubcontractors();
  }, []);

  const loadSubcontractors = async () => {
    try {
      const response = await subcontractorsApi.getAll();
      setSubcontractors(response.data);
    } catch (err) {
      console.error('Failed to load subcontractors:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadSubcontractors();
      return;
    }

    try {
      const response = await subcontractorsApi.search(searchQuery);
      setSubcontractors(response.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await bidsApi.addSubcontractor(bidId, {
        subcontractor_id: formData.subcontractor_id,
        work_description: formData.work_description,
        naics_code: formData.naics_code,
        subcontract_value: parseFloat(formData.subcontract_value),
        counts_toward_mbe: formData.counts_toward_mbe,
      });

      setSuccess(true);
      setFormData({
        subcontractor_id: '',
        work_description: '',
        naics_code: '',
        subcontract_value: '',
        counts_toward_mbe: false,
      });

      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add subcontractor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Add Subcontractor</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-start">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-green-700 text-sm">Subcontractor added successfully!</p>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search Subcontractors
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by name or certification..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subcontractor
          </label>
          <select
            value={formData.subcontractor_id}
            onChange={(e) => {
              const selected = subcontractors.find(s => s.id === e.target.value);
              setFormData({
                ...formData,
                subcontractor_id: e.target.value,
                counts_toward_mbe: selected?.is_mbe || false,
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Subcontractor</option>
            {subcontractors.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.legal_name} {sub.is_mbe && '(MBE)'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Description
          </label>
          <textarea
            value={formData.work_description}
            onChange={(e) => setFormData({ ...formData, work_description: e.target.value })}
            rows={3}
            placeholder="Describe the work to be performed..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NAICS Code
          </label>
          <input
            type="text"
            value={formData.naics_code}
            onChange={(e) => setFormData({ ...formData, naics_code: e.target.value })}
            placeholder="e.g., 236220"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subcontract Value ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.subcontract_value}
            onChange={(e) => setFormData({ ...formData, subcontract_value: e.target.value })}
            placeholder="e.g., 50000.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.counts_toward_mbe}
            onChange={(e) => setFormData({ ...formData, counts_toward_mbe: e.target.checked })}
            className="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-gray-700">
            Count toward MBE goal
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.subcontractor_id}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Adding...' : 'Add Subcontractor'}
        </button>
      </form>
    </div>
  );
};

export default SubcontractorForm;