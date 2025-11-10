import React from 'react';
import { BidSubcontractor } from '../types';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';

interface SubcontractorListProps {
  subcontractors: BidSubcontractor[];
  onRemove: (id: string) => void;
}

const SubcontractorList: React.FC<SubcontractorListProps> = ({ subcontractors, onRemove }) => {
  if (subcontractors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No subcontractors added yet. Add one using the form above.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Subcontractors</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {subcontractors.map((bidSub) => {
          const breakdown = bidSub.category_breakdown;

          return (
            <div key={bidSub.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {bidSub.subcontractor?.legal_name || 'Unknown'}
                    </h4>
                    {bidSub.counts_toward_mbe ? (
                      <CheckCircle className="w-4 h-4 text-green-500">
                          <title>Counts toward MBE</title>
                      </CheckCircle>
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-400">
                          <title>Does not count toward MBE</title>
                      </XCircle>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{bidSub.work_description}</p>

                  <div className="flex gap-4 text-sm text-gray-500 mb-2">
                    <span>
                      <strong>NAICS:</strong> {bidSub.naics_code}
                    </span>
                    <span>
                      <strong>Value:</strong> ${bidSub.subcontract_value.toLocaleString()}
                    </span>
                    {bidSub.subcontractor?.certification_number && (
                      <span>
                        <strong>Cert:</strong> {bidSub.subcontractor.certification_number}
                      </span>
                    )}
                  </div>

                  {/* Category Breakdown Display */}
                  {breakdown && breakdown.length > 0 && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-100">
                      <div className="text-xs font-medium text-gray-700 mb-1">Category Breakdown:</div>
                      <div className="flex flex-wrap gap-2">
                        {breakdown.map((item) => (
                          <span
                            key={item.category}
                            className="px-2 py-1 bg-white border border-blue-200 text-xs font-medium text-gray-700 rounded"
                          >
                            {item.category}: {item.percentage}%
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onRemove(bidSub.id)}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Remove subcontractor"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubcontractorList;