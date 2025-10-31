import React from 'react';
import { useNavigate } from 'react-router-dom';
import BidForm from '../components/BidForm';
import { ArrowLeft } from 'lucide-react';

const CreateBidPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (bidId: string) => {
    navigate(`/bid/${bidId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bids
        </button>

        <BidForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default CreateBidPage;