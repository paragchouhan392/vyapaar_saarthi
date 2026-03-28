import React from "react";

const InvestmentModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">AI Investment Suggestions</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* Risk Profile */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Risk Profile</h3>
          <p>{data.riskProfile}</p>
        </div>

        {/* Summary */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Strategy Summary</h3>
          <p>{data.summary}</p>
        </div>

        {/* Recommendations */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2">Recommendations</h3>
          <div className="grid gap-4">
            {data.recommendations?.map((item, index) => (
              <div key={index} className="border rounded-xl p-4 shadow-sm">
                <h4 className="text-lg font-bold">{item.name}</h4>
                <p className="text-sm text-gray-600">
                  {item.assetClass} • {item.riskLevel}
                </p>

                <div className="mt-2">
                  <p>
                    <strong>Allocation:</strong> {item.allocation}
                  </p>
                  <p>
                    <strong>Expected Return:</strong> {item.expectedReturn}
                  </p>
                </div>

                <p className="mt-2 text-gray-700">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Diversification Tips */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Diversification Tips</h3>
          <p>{data.diversificationTips}</p>
        </div>

        {/* Indian Market Notes */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Indian Market Insights</h3>
          <p>{data.indianMarketNotes}</p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;
