import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bidsApi } from '../api/client';
import { Bid } from '../types';
import { Plus, FileText, DollarSign, Target } from 'lucide-react';const HomePage: React.FC = () => {
const navigate = useNavigate();
const [bids, setBids] = useState<Bid[]>([]);
const [loading, setLoading] = useState(true);useEffect(() => {
loadBids();
}, []);const loadBids = async () => {
try {
const response = await bidsApi.getAll();
setBids(response.data);
} catch (err) {
console.error('Failed to load bids:', err);
} finally {
setLoading(false);
}
};return (
<div className="min-h-screen bg-gray-50">
<div className="max-w-7xl mx-auto px-4 py-8">
{/* Header */}
<div className="mb-8">
<h1 className="text-4xl font-bold text-gray-900 mb-2">ComplyFormAI</h1>
<p className="text-gray-600">Automated validation for Maryland construction bids</p>
</div>    {/* Create New Bid Button */}
    <div className="mb-8">
      <button
        onClick={() => navigate('/create-bid')}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
      >
        <Plus className="w-5 h-5" />
        Create New Bid
      </button>
    </div>    {/* Bids List */}
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Bids</h2>      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading bids...</p>
        </div>
      ) : bids.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No bids yet</h3>
          <p className="text-gray-500 mb-6">Create your first bid to get started</p>
          <button
            onClick={() => navigate('/create-bid')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Bid
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bids.map((bid) => (
            <div
              key={bid.id}
              onClick={() => navigate(`/bid/${bid.id}`)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {bid.solicitation_number}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {bid.bid_subcontractors?.length || 0} subcontractors
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    Total: ${bid.total_amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    MBE Goal: {bid.mbe_goal}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>
);
};
export default HomePage;