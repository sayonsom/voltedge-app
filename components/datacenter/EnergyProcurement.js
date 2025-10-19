import Card from '@/components/ui/Card';
import { Zap, Battery, Network, TrendingDown } from 'lucide-react';

export default function EnergyProcurement({ site }) {
  const innovations = [
    {
      title: 'Utility Battery Energy Storage (BESS)',
      icon: Battery,
      description: 'Deploy large-scale battery systems to store excess renewable energy and provide peak power support',
      benefits: [
        'Reduce peak demand charges by 30-40%',
        'Enable time-of-use arbitrage',
        'Improve grid stability and reliability',
        'Fast deployment (6-12 months)'
      ],
      capacity: '50-100 MWh',
      powerReduction: '15-25 MW peak shaving',
      cost: '$40-60M capital',
      timeline: '6-12 months'
    },
    {
      title: 'Substation Build-up & Expansion',
      icon: Zap,
      description: 'Upgrade existing distribution substations with modern equipment and increased capacity',
      benefits: [
        'Leverage existing grid infrastructure',
        'Lower cost vs new transmission lines',
        '30-50% faster than greenfield substations',
        'Modular expansion capability'
      ],
      capacity: '100-150 MVA additional',
      powerReduction: 'N/A (Capacity increase)',
      cost: '$20-35M capital',
      timeline: '12-18 months'
    },
    {
      title: 'DERMS Integration',
      icon: Network,
      description: 'Distributed Energy Resource Management System to optimize on-site generation and grid interaction',
      benefits: [
        'Coordinate solar, wind, batteries, generators',
        'Real-time load balancing and optimization',
        'Reduce grid dependency by 20-30%',
        'Enable demand response participation'
      ],
      capacity: 'Manages 50-200 MW',
      powerReduction: '10-20 MW grid demand',
      cost: '$5-8M software + controls',
      timeline: '3-6 months'
    }
  ];

  // Estimated power demand reduction scenario
  const demandScenario = {
    baseline: 300, // MW
    withBESS: 275,
    withDERMS: 255,
    withAll: 230
  };

  const reductionPercentage = ((demandScenario.baseline - demandScenario.withAll) / demandScenario.baseline * 100).toFixed(0);

  return (
    <Card className="p-6 border border-gray-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <TrendingDown size={24} className="text-gray-700" />
          Energy Procurement Innovations
        </h2>
        <p className="text-sm text-gray-700">
          Advanced strategies to reduce peak power demand and optimize energy costs
        </p>
      </div>

      {/* Power Demand Reduction Summary */}
      <div className="bg-gray-50 p-5 rounded border border-gray-200 mb-6">
        <h3 className="text-md font-bold text-gray-900 mb-4">Projected Power Demand Reduction</h3>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-3 rounded border border-gray-300">
            <p className="text-xs text-gray-600 mb-1">Baseline Demand</p>
            <p className="text-2xl font-bold text-gray-900">{demandScenario.baseline} MW</p>
          </div>
          <div className="bg-white p-3 rounded border border-gray-300">
            <p className="text-xs text-gray-600 mb-1">With BESS</p>
            <p className="text-2xl font-bold text-gray-900">{demandScenario.withBESS} MW</p>
            <p className="text-xs text-gray-600 mt-1">-{demandScenario.baseline - demandScenario.withBESS} MW</p>
          </div>
          <div className="bg-white p-3 rounded border border-gray-300">
            <p className="text-xs text-gray-600 mb-1">With DERMS</p>
            <p className="text-2xl font-bold text-gray-900">{demandScenario.withDERMS} MW</p>
            <p className="text-xs text-gray-600 mt-1">-{demandScenario.baseline - demandScenario.withDERMS} MW</p>
          </div>
          <div className="bg-orange-100 p-3 rounded border border-orange-300">
            <p className="text-xs text-orange-800 mb-1">Combined Impact</p>
            <p className="text-2xl font-bold text-orange-900">{demandScenario.withAll} MW</p>
            <p className="text-xs text-orange-800 mt-1">-{reductionPercentage}% reduction</p>
          </div>
        </div>
        <div className="relative h-8 bg-gray-200 rounded overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-orange-400 transition-all duration-500"
            style={{ width: `${(demandScenario.withAll / demandScenario.baseline) * 100}%` }}
          >
            <span className="text-xs text-white font-bold flex items-center justify-center h-full">
              {demandScenario.withAll} MW
            </span>
          </div>
          <div className="absolute right-2 top-0 h-full flex items-center">
            <span className="text-xs text-gray-600 font-bold">
              Baseline: {demandScenario.baseline} MW
            </span>
          </div>
        </div>
      </div>

      {/* Innovation Cards */}
      <div className="space-y-5">
        {innovations.map((innovation, index) => {
          const Icon = innovation.icon;
          return (
            <div key={index} className="bg-white border border-gray-300 rounded p-5">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded">
                  <Icon size={28} className="text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{innovation.title}</h3>
                  <p className="text-sm text-gray-700 mb-4">{innovation.description}</p>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-600 mb-1">Capacity</p>
                      <p className="text-sm font-bold text-gray-900">{innovation.capacity}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-600 mb-1">Power Impact</p>
                      <p className="text-sm font-bold text-gray-900">{innovation.powerReduction}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-600 mb-1">Capital Cost</p>
                      <p className="text-sm font-bold text-gray-900">{innovation.cost}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-600 mb-1">Timeline</p>
                      <p className="text-sm font-bold text-gray-900">{innovation.timeline}</p>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-2">Key Benefits:</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {innovation.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                          <span className="text-gray-600 mt-0.5">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Combined Benefits Summary */}
      <div className="mt-6 bg-gray-50 p-5 rounded border border-gray-200">
        <h3 className="text-md font-bold text-gray-900 mb-3">Combined Strategy Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-bold text-gray-900 mb-1">Cost Savings</p>
            <p className="text-xs">Reduce annual energy costs by $15-25M through demand reduction and time-of-use optimization</p>
          </div>
          <div>
            <p className="font-bold text-gray-900 mb-1">Grid Resilience</p>
            <p className="text-xs">Improve uptime to 99.995% with distributed energy resources and battery backup</p>
          </div>
          <div>
            <p className="font-bold text-gray-900 mb-1">Sustainability</p>
            <p className="text-xs">Enable 60-80% renewable energy integration with BESS and DERMS coordination</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
