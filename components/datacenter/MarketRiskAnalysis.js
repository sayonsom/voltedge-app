import Card from '@/components/ui/Card';
import { AlertTriangle, Shield, Zap, GitMerge, Target } from 'lucide-react';

export default function MarketRiskAnalysis({ marketRisk }) {
  const { marketRisks, powerRequirements, integrationRisks, overallSuccess } = marketRisk;

  const riskCategories = [
    {
      title: 'Market Risks',
      icon: Target,
      color: 'blue',
      risks: marketRisks,
      description: 'Demand, competition, and market dynamics'
    },
    {
      title: 'Power Requirements',
      icon: Zap,
      color: 'yellow',
      risks: powerRequirements,
      description: 'Grid reliability and capacity'
    },
    {
      title: 'Integration Risks',
      icon: GitMerge,
      color: 'purple',
      risks: integrationRisks,
      description: 'Vendor coordination and construction'
    }
  ];

  const getProbabilityColor = (probability) => {
    if (probability.includes('Low')) return 'text-green-700 bg-green-100';
    if (probability.includes('Medium')) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  const getImpactColor = (impact) => {
    if (impact.includes('Low') || impact.includes('Moderate')) return 'text-blue-700 bg-blue-100';
    if (impact.includes('High')) return 'text-orange-700 bg-orange-100';
    return 'text-red-700 bg-red-100';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-900';
    if (score >= 70) return 'text-blue-900';
    if (score >= 60) return 'text-yellow-900';
    return 'text-red-900';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={24} className="text-gray-700" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Comprehensive Risk & Success Analysis
          </h2>
          <p className="text-sm text-gray-700 mt-1">
            2x2 Risk matrix assessment with mitigation strategies
          </p>
        </div>
      </div>

      {/* Overall Success Probability */}
      <Card className="p-6 bg-gray-50 border border-gray-300">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Overall Project Success Probability
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Based on comprehensive analysis of all risk factors and mitigation strategies
            </p>
            <div className="flex flex-wrap gap-2">
              {overallSuccess.keyDrivers.map((driver, idx) => (
                <span key={idx} className="text-xs px-3 py-1 bg-white rounded-full text-gray-700 border border-gray-300">
                  ✓ {driver}
                </span>
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="relative inline-block">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#f97316"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(overallSuccess.probability / 100) * 351.86} 351.86`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-orange-900">
                    {overallSuccess.probability}%
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm font-semibold text-orange-700 mt-2">
              {overallSuccess.confidenceLevel} Confidence
            </p>
          </div>
        </div>
      </Card>

      {/* Risk Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {riskCategories.map((category, catIndex) => {
          const Icon = category.icon;
          return (
            <Card key={catIndex} className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Icon size={20} className="text-[#0078d4]" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-xs text-gray-600">{category.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(category.risks).map(([key, risk], idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <div className={`text-2xl font-bold ${getScoreColor(risk.score)}`}>
                        {risk.score}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Probability:</span>
                        <span className={`text-xs px-2 py-1 rounded font-semibold ${getProbabilityColor(risk.probability)}`}>
                          {risk.probability}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Impact:</span>
                        <span className={`text-xs px-2 py-1 rounded font-semibold ${getImpactColor(risk.impact)}`}>
                          {risk.impact}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Mitigation:</p>
                        <p className="text-xs text-gray-700 leading-relaxed">{risk.mitigation}</p>
                      </div>

                      <div className="mt-3 bg-green-50 p-2 rounded">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-800 font-semibold">Success Rate:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-green-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${risk.successProbability}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-green-900">
                              {risk.successProbability}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* 2x2 Risk Matrix Visualization */}
      <Card className="p-6 border border-gray-300">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Risk Impact vs Probability Matrix
        </h3>
        <p className="text-sm text-gray-700 mb-6">
          2x2 quadrant analysis mapping identified risks by probability and impact
        </p>

        <div className="relative">
          {/* Y-axis label (Impact) */}
          <div className="absolute -left-16 top-1/2 -translate-y-1/2 -rotate-90">
            <span className="text-sm font-bold text-gray-700">IMPACT →</span>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-2 gap-0 border-2 border-gray-400">
            {/* Top Left: Low Probability, High Impact */}
            <div className="bg-yellow-50 border-r-2 border-b-2 border-gray-400 p-6 min-h-[200px]">
              <div className="mb-3">
                <p className="text-xs font-bold text-gray-600 uppercase">Low Probability</p>
                <p className="text-xs font-bold text-gray-600 uppercase">High Impact</p>
                <p className="text-lg font-bold text-yellow-800 mt-1">MONITOR</p>
              </div>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-start gap-1">
                  <span className="text-yellow-700">•</span>
                  <span>Major seismic event</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-yellow-700">•</span>
                  <span>Supply chain collapse</span>
                </li>
              </ul>
            </div>

            {/* Top Right: High Probability, High Impact */}
            <div className="bg-red-50 border-b-2 border-gray-400 p-6 min-h-[200px]">
              <div className="mb-3">
                <p className="text-xs font-bold text-gray-600 uppercase">High Probability</p>
                <p className="text-xs font-bold text-gray-600 uppercase">High Impact</p>
                <p className="text-lg font-bold text-red-800 mt-1">MITIGATE</p>
              </div>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-start gap-1">
                  <span className="text-red-700">•</span>
                  <span>None identified for this site</span>
                </li>
              </ul>
            </div>

            {/* Bottom Left: Low Probability, Low Impact */}
            <div className="bg-green-50 border-r-2 border-gray-400 p-6 min-h-[200px]">
              <div className="mb-3">
                <p className="text-xs font-bold text-gray-600 uppercase">Low Probability</p>
                <p className="text-xs font-bold text-gray-600 uppercase">Low Impact</p>
                <p className="text-lg font-bold text-green-800 mt-1">ACCEPT</p>
              </div>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-start gap-1">
                  <span className="text-green-700">•</span>
                  <span>Minor permitting delays</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-700">•</span>
                  <span>Weather-related slowdowns</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-700">•</span>
                  <span>Vendor coordination issues</span>
                </li>
              </ul>
            </div>

            {/* Bottom Right: High Probability, Low Impact */}
            <div className="bg-blue-50 p-6 min-h-[200px]">
              <div className="mb-3">
                <p className="text-xs font-bold text-gray-600 uppercase">High Probability</p>
                <p className="text-xs font-bold text-gray-600 uppercase">Low Impact</p>
                <p className="text-lg font-bold text-blue-800 mt-1">MANAGE</p>
              </div>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-start gap-1">
                  <span className="text-blue-700">•</span>
                  <span>Minor cost overruns</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-blue-700">•</span>
                  <span>Schedule adjustments</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-blue-700">•</span>
                  <span>Material price fluctuations</span>
                </li>
              </ul>
            </div>
          </div>

          {/* X-axis label (Probability) */}
          <div className="text-center mt-3">
            <span className="text-sm font-bold text-gray-700">PROBABILITY →</span>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded border border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-bold">Risk Assessment Summary:</span> All identified risks for this project fall within
            acceptable zones (green and blue quadrants) with appropriate mitigation strategies in place. No high-priority
            risks (red quadrant) have been identified.
          </p>
        </div>
      </Card>

      {/* Risk Management Strategy */}
      <Card className="p-6 bg-gray-50 border border-gray-300">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={20} className="text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">
            Risk Management Framework
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Proactive Measures</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-0.5">▸</span>
                <span>Continuous market intelligence and demand forecasting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-0.5">▸</span>
                <span>Pre-qualified vendor network with backup options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-0.5">▸</span>
                <span>Utility partnerships secured before project start</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-0.5">▸</span>
                <span>Modular design allowing phased deployment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-0.5">▸</span>
                <span>Weather buffers and contingency timelines built in</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Reactive Capabilities</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-0.5">▸</span>
                <span>Real-time risk monitoring and early warning systems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-0.5">▸</span>
                <span>Rapid response protocols for supply chain disruptions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-0.5">▸</span>
                <span>Financial reserves for unforeseen circumstances</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-0.5">▸</span>
                <span>Alternative technology and vendor substitution plans</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-0.5">▸</span>
                <span>Expedited procurement channels for critical equipment</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Bottom Line */}
      <Card className="p-6 bg-gray-50 border border-gray-300">
        <h3 className="text-xl font-bold text-gray-900 mb-3">The Bottom Line</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          This comprehensive risk analysis demonstrates that the proposed data center development has a
          <span className="font-bold text-gray-900"> {overallSuccess.probability}% probability of success</span> with
          <span className="font-bold text-gray-900"> high confidence</span>. All identified risks are manageable with
          appropriate mitigation strategies in place. Our proven development approach, established vendor
          relationships, and risk management framework significantly reduce the likelihood and impact of potential issues.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-4 rounded border border-gray-300">
            <p className="text-xs text-gray-600 mb-1">Lowest Risk Score</p>
            <p className="text-2xl font-bold text-gray-900">60/100</p>
            <p className="text-xs text-gray-600 mt-1">Construction Delays</p>
          </div>
          <div className="bg-white p-4 rounded border border-gray-300">
            <p className="text-xs text-gray-600 mb-1">Average Risk Score</p>
            <p className="text-2xl font-bold text-gray-900">72/100</p>
            <p className="text-xs text-gray-600 mt-1">Across all categories</p>
          </div>
          <div className="bg-white p-4 rounded border border-gray-300">
            <p className="text-xs text-gray-600 mb-1">Highest Risk Score</p>
            <p className="text-2xl font-bold text-gray-900">88/100</p>
            <p className="text-xs text-gray-600 mt-1">Grid Reliability</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
