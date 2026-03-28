import React from "react";
import InvestmentSuggestion from "./InvestmentSuggestion";

const TestModal = () => {
  const mockData = {
    riskProfile: "Moderate",
    summary: "Balanced growth with stability",
    diversificationTips: "Spread across sectors like banking, IT, FMCG",
    indianMarketNotes: "Market slightly volatile but long-term growth strong",
    recommendations: [
      {
        assetClass: "Stock",
        name: "HDFC Bank (NSE: HDFCBANK)",
        allocation: "30%",
        expectedReturn: "10-12%",
        riskLevel: "Medium",
        reason: "Strong fundamentals and consistent growth",
      },
      {
        assetClass: "ETF",
        name: "Nifty 50 ETF",
        allocation: "40%",
        expectedReturn: "8-10%",
        riskLevel: "Low",
        reason: "Diversified exposure to top Indian companies",
      },
    ],
  };

  return (
    <InvestmentSuggestion
      isOpen={true} // 👈 FORCE OPEN
      onClose={() => {}}
      data={mockData}
    />
  );
};

export default TestModal;
