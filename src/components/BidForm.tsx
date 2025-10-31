import React, { useState, useEffect } from 'react';
import { organizationsApi, bidsApi } from '../api/client';
import { Organization } from '../types';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface BidFormProps {
  onSuccess: (bidId: string) => void;
}

const BidForm: React.FC<BidFormProps> = ({ onSuccess }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    organization_id: '',
    solicitation_number: '',
    total_amount: '',
    mbe_goal: '25',
  });

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const response = await organizationsApi.getAll();
      setOrganizations(response.data);
      if (response.data.length > 0) {
        setFormData(prev => ({ ...prev, organization_id: response.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to load organizations:', err);
      setError('Failed to load organizations');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await bidsApi.create({
        organization_id: formData.organization_id,
        solicitation_number: formData.solicitation_number,
        total_amount: parseFloat(formData.total_amount),
        mbe_goal: parseFloat(formData.mbe_goal),
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess(response.data.id);
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create bid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Bid</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-green-700 text-sm">Bid created successfully! Redirecting...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization
          </label>
          <select
            value={formData.organization_id}
            onChange={(e) => setFormData({ ...formData, organization_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Solicitation Number
          </label>
          <input
            type="text"
            value={formData.solicitation_number}
            onChange={(e) => setFormData({ ...formData, solicitation_number: e.target.value })}
            placeholder="e.g., DOT-2025-12345"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.total_amount}
            onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
            placeholder="e.g., 1000000.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            MBE Goal (%)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.mbe_goal}
            onChange={(e) => setFormData({ ...formData, mbe_goal: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !formData.organization_id}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : 'Create Bid'}
        </button>
      </form>
    </div>
  );
};

export default BidForm;