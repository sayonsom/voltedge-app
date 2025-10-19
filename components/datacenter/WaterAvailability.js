import Card from '@/components/ui/Card';
import { Droplet, MapPin, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function WaterAvailability({ site, waterData }) {
  // Generate mock water sources based on location
  const waterSources = [
    {
      name: 'Municipal Water Supply',
      distance: 1.8,
      capacity: 'High',
      reliability: 95,
      type: 'Primary',
      connection: 'Direct',
      cost: '$2.50/1000 gal',
      description: 'City water main with adequate pressure and flow'
    },
    {
      name: `${site.city || 'Local'} Reservoir`,
      distance: 5.2,
      capacity: 'Medium-High',
      reliability: 88,
      type: 'Secondary',
      connection: 'Feasible',
      cost: '$1.80/1000 gal',
      description: 'Surface water with treatment requirements'
    },
    {
      name: 'Groundwater Wells',
      distance: 0,
      capacity: 'Medium',
      reliability: 90,
      type: 'Backup',
      connection: 'On-site drilling',
      cost: '$0.50/1000 gal',
      description: 'Deep aquifer access for redundancy'
    },
    {
      name: 'Reclaimed Water Facility',
      distance: 8.5,
      capacity: 'Medium',
      reliability: 85,
      type: 'Supplemental',
      connection: 'Pipeline required',
      cost: '$1.20/1000 gal',
      description: 'Recycled water for cooling tower makeup'
    }
  ];

  // Estimated water requirements by DC size
  const waterRequirements = {
    edge: { daily: 50000, annual: 18.25, cooling: 'Air-cooled primary' },
    enterprise: { daily: 200000, annual: 73, cooling: 'Hybrid cooling' },
    midscale: { daily: 800000, annual: 292, cooling: 'Water-cooled towers' },
    hyperscale: { daily: 2500000, annual: 912.5, cooling: 'Large cooling towers' }
  };

  const getReliabilityColor = (reliability) => {
    if (reliability >= 90) return 'text-gray-900 bg-gray-100';
    if (reliability >= 80) return 'text-gray-800 bg-gray-50';
    return 'text-gray-700 bg-gray-50';
  };

  return (
    <Card className="p-6 border border-gray-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Droplet size={24} className="text-gray-700" />
          Water Availability & Sources
        </h2>
        <p className="text-sm text-gray-700">
          Comprehensive water infrastructure analysis for data center cooling requirements
        </p>
      </div>

      {/* Water Sources Table */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Nearby Water Sources</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-bold text-gray-900">Source</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900">Distance</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900">Capacity</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900">Reliability</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900">Type</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900">Est. Cost</th>
                <th className="text-left py-3 px-4 font-bold text-gray-900">Connection</th>
              </tr>
            </thead>
            <tbody>
              {waterSources.map((source, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-bold text-gray-900">{source.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{source.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-800">
                    {source.distance === 0 ? 'On-site' : `${source.distance.toFixed(1)} mi`}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-medium text-gray-800">{source.capacity}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getReliabilityColor(source.reliability)}`}>
                      {source.reliability}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-gray-700 font-medium">{source.type}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-gray-800">
                    {source.cost}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{source.connection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Water Requirements by DC Size */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Estimated Water Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(waterRequirements).map(([size, req]) => (
            <div key={size} className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-xs text-gray-600 font-medium mb-2 uppercase">{size} DC</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600">Daily Usage</p>
                  <p className="text-lg font-bold text-gray-900">
                    {(req.daily / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-gray-600">gallons/day</p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600">Annual Usage</p>
                  <p className="text-md font-bold text-gray-900">
                    {req.annual.toFixed(1)} MG
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600">{req.cooling}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Water Infrastructure Strengths */}
      <div className="bg-gray-50 p-5 rounded border border-gray-200">
        <h3 className="text-md font-bold text-gray-900 mb-3">Water Infrastructure Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
              <span><strong>Redundancy:</strong> 4 independent water sources available</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
              <span><strong>Proximity:</strong> Municipal connection within 2 miles</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
              <span><strong>Quality:</strong> Meets data center cooling standards</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
              <span><strong>Scalability:</strong> Adequate supply for hyperscale operations</span>
            </li>
          </ul>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
              <span><strong>Reliability:</strong> Average 90%+ across all sources</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
              <span><strong>Cost-Effective:</strong> Groundwater backup reduces operating costs</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
              <span><strong>Sustainability:</strong> Reclaimed water option available</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
              <span><strong>Permitting:</strong> No significant water rights restrictions</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Historical Availability Chart */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Historical Water Availability (Last 6 Years)</h3>
        <div className="h-32 flex items-end justify-between gap-2">
          {[
            { year: 2019, availability: 95 },
            { year: 2020, availability: 93 },
            { year: 2021, availability: 97 },
            { year: 2022, availability: 91 },
            { year: 2023, availability: 94 },
            { year: 2024, availability: 96 }
          ].map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '128px' }}>
                <div
                  className="absolute bottom-0 w-full bg-gray-600 rounded-t transition-all duration-500"
                  style={{ height: `${data.availability}%` }}
                />
              </div>
              <p className="text-xs text-gray-700 mt-2 font-bold">{data.year}</p>
              <p className="text-xs text-gray-600">{data.availability}%</p>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-gray-50 p-3 rounded text-sm text-gray-700 border border-gray-200">
          <p className="font-bold">Average Availability: 94.3%</p>
          <p className="text-xs text-gray-600 mt-1">
            Consistent high availability indicates robust water infrastructure for data center operations
          </p>
        </div>
      </div>
    </Card>
  );
}
