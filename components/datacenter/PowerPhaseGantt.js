import Card from '@/components/ui/Card';
import { Zap, Battery, Network, Fuel, TrendingUp, Building2 } from 'lucide-react';

export default function PowerPhaseGantt({ selectedSize }) {
  // Power phases based on data center size
  const powerPhases = [
    {
      phase: 'Phase 1',
      name: 'Existing Distribution Substation',
      capacity: '50 MW',
      startYear: 0,
      endYear: 2,
      duration: 2,
      icon: Building2,
      color: 'bg-slate-500',
      description: 'Leverage existing grid infrastructure',
      lowMW: 30,
      highMW: 50
    },
    {
      phase: 'Phase 2',
      name: 'DERMS, BESS, NatGas/Hydrogen Distribution',
      capacity: '65-75 MW',
      startYear: 1,
      endYear: 3,
      duration: 2,
      icon: Battery,
      color: 'bg-slate-600',
      description: 'Battery energy storage + distributed energy resources',
      lowMW: 65,
      highMW: 75
    },
    {
      phase: 'Phase 3',
      name: 'New Transmission + Phase 1 and 2',
      capacity: 'Up to 300 MW',
      startYear: 3,
      endYear: 5,
      duration: 2,
      icon: Zap,
      color: 'bg-slate-700',
      description: 'Major transmission expansion for hyperscale capacity',
      lowMW: 200,
      highMW: 300
    }
  ];

  const totalYears = 8;
  const yearLabels = Array.from({ length: totalYears + 1 }, (_, i) => `Year ${i}`);

  return (
    <Card className="p-6 border border-gray-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Feasibility Studies: Phased Power Procurement Approach
        </h2>
        <p className="text-sm text-gray-700">
          Strategic phased build-out mitigates demand risks from technology improvements, market shifts, and power efficiency gains
        </p>
      </div>

      {/* Gantt Chart */}
      <div className="mb-8">
        <div className="relative">
          {/* Year Headers */}
          <div className="flex mb-4">
            <div className="w-64 flex-shrink-0"></div>
            <div className="flex-1 grid grid-cols-8 gap-1">
              {yearLabels.map((year, index) => (
                <div key={index} className="text-center text-xs font-medium text-gray-700 border-l border-gray-300 pl-1">
                  {year}
                </div>
              ))}
            </div>
          </div>

          {/* Phase Rows */}
          <div className="space-y-3">
            {powerPhases.map((phase, phaseIndex) => {
              const Icon = phase.icon;
              return (
                <div key={phaseIndex} className="flex items-center">
                  {/* Phase Label */}
                  <div className="w-64 flex-shrink-0 pr-4">
                    <div className="flex items-start gap-2">
                      <Icon size={18} className="text-gray-700 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{phase.phase}</p>
                        <p className="text-xs text-gray-700 leading-tight">{phase.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{phase.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="flex-1 relative" style={{ height: '60px' }}>
                    <div className="absolute inset-0 grid grid-cols-8 gap-1">
                      {yearLabels.map((_, index) => (
                        <div key={index} className="border-l border-gray-200"></div>
                      ))}
                    </div>

                    {/* Phase Bar */}
                    <div
                      className={`absolute top-2 h-10 ${phase.color} rounded shadow-md flex items-center justify-center text-white text-xs font-semibold px-2 transition-all hover:shadow-lg`}
                      style={{
                        left: `${(phase.startYear / totalYears) * 100}%`,
                        width: `${(phase.duration / totalYears) * 100}%`
                      }}
                    >
                      <div className="text-center">
                        <div className="font-bold">{phase.capacity}</div>
                        <div className="text-[10px] opacity-90">{phase.duration}yr</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Capacity Table */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Power Capacity Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-bold text-gray-900">Phase</th>
                <th className="text-left py-3 px-4 font-bold text-gray-900">Description</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900">Start Year</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900">End Year</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900">Duration</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900">Low (Min MW)</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900">High (Max MW)</th>
              </tr>
            </thead>
            <tbody>
              {powerPhases.map((phase, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-gray-900">{phase.phase}</td>
                  <td className="py-3 px-4 text-gray-700">{phase.name}</td>
                  <td className="py-3 px-4 text-center text-gray-800">{phase.startYear}</td>
                  <td className="py-3 px-4 text-center text-gray-800">{phase.endYear}</td>
                  <td className="py-3 px-4 text-center text-gray-800">{phase.duration} years</td>
                  <td className="py-3 px-4 text-center font-bold text-gray-900">{phase.lowMW} MW</td>
                  <td className="py-3 px-4 text-center font-bold text-gray-900">{phase.highMW} MW</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Mitigation Benefits */}
      <div className="mt-8 bg-gray-50 p-5 rounded border border-gray-200">
        <h3 className="text-md font-bold text-gray-900 mb-3">Benefits of Phased Approach</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-gray-600 mt-0.5">▸</span>
              <span><strong>Risk Mitigation:</strong> Aligns capacity with actual demand growth</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-600 mt-0.5">▸</span>
              <span><strong>Technology Hedging:</strong> Adapts to more efficient chip architectures</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-600 mt-0.5">▸</span>
              <span><strong>Capital Efficiency:</strong> Reduces upfront infrastructure investment</span>
            </li>
          </ul>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-gray-600 mt-0.5">▸</span>
              <span><strong>Market Flexibility:</strong> Responds to AI/compute demand fluctuations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-600 mt-0.5">▸</span>
              <span><strong>Utility Partnership:</strong> Staged grid upgrades reduce utility burden</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-600 mt-0.5">▸</span>
              <span><strong>Faster Time-to-Market:</strong> Phase 1 operational in 24 months</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
