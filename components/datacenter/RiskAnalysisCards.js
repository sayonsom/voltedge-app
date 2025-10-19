import Card from '@/components/ui/Card';
import { AlertTriangle, Shield, Droplet, Truck, Mountain, Cloud } from 'lucide-react';

export default function RiskAnalysisCards({ risks }) {
  const riskCategories = [
    {
      key: 'politicalRisk',
      title: 'Political & Regulatory Risk',
      icon: Shield,
      color: 'blue',
      data: risks.politicalRisk
    },
    {
      key: 'seismicRisk',
      title: 'Seismic Risk',
      icon: Mountain,
      color: 'purple',
      data: risks.seismicRisk
    },
    {
      key: 'environmentalRisk',
      title: 'Environmental Risk',
      icon: Cloud,
      color: 'green',
      data: risks.environmentalRisk
    },
    {
      key: 'transportAccessScore',
      title: 'Transport Access',
      icon: Truck,
      color: 'orange',
      data: risks.transportAccessScore
    },
    {
      key: 'waterAvailability',
      title: 'Water Availability',
      icon: Droplet,
      color: 'cyan',
      data: risks.waterAvailability
    },
    {
      key: 'climateRisk',
      title: 'Climate Risk',
      icon: Cloud,
      color: 'indigo',
      data: risks.climateRisk
    }
  ];

  const getRatingColor = (score) => {
    if (score >= 85) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 70) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 60) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-900';
    if (score >= 70) return 'text-blue-900';
    if (score >= 60) return 'text-yellow-900';
    return 'text-red-900';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={24} className="text-[#0078d4]" />
        <h2 className="text-2xl font-bold text-gray-900">
          Comprehensive Risk Analysis
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {riskCategories.map((category) => {
          const Icon = category.icon;
          const { score, rating, details, factors } = category.data;

          return (
            <Card key={category.key} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon size={20} className="text-[#0078d4]" />
                  <h3 className="text-sm font-semibold text-gray-900">{category.title}</h3>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${getScoreColor(score)}`}>
                    {score}
                  </p>
                  <p className="text-xs text-gray-600">/100</p>
                </div>
              </div>

              <div className={`px-3 py-2 rounded border mb-4 ${getRatingColor(score)}`}>
                <p className="text-sm font-semibold text-center">{rating}</p>
              </div>

              {/* Factors breakdown */}
              {factors && (
                <div className="space-y-2 mb-4">
                  {Object.entries(factors).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {typeof value === 'number' && value > 100 ? `${value.toFixed(1)}` :
                           typeof value === 'number' ? `${value}/100` : value}
                        </span>
                      </div>
                      {typeof value === 'number' && value <= 100 && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-[#0078d4] h-1.5 rounded-full"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Details */}
              {details && (
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Key Points:</p>
                  <ul className="space-y-1">
                    {details.slice(0, 3).map((detail, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Water Availability Historical Chart */}
      {risks.waterAvailability?.historicalData && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Water Availability - Historical Trend
          </h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {risks.waterAvailability.historicalData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '192px' }}>
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-500"
                    style={{ height: `${data.availability}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2 font-semibold">{data.year}</p>
                <p className="text-xs text-gray-500">{data.availability}%</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-blue-50 p-3 rounded text-sm text-blue-900">
            <p className="font-semibold">Average Availability: 94.3%</p>
            <p className="text-xs text-blue-700 mt-1">
              Consistent high availability over 6-year period indicates reliable water resources
            </p>
          </div>
        </Card>
      )}

      {/* Overall Risk Summary */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-600">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Overall Site Risk Assessment
            </h3>
            <p className="text-sm text-gray-700">
              Based on comprehensive analysis of all risk factors
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {riskCategories.map((cat) => (
                <span
                  key={cat.key}
                  className="text-xs px-2 py-1 bg-white rounded border border-gray-200"
                >
                  {cat.title}: {cat.data.score}/100
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold text-green-900">
              {Math.round(
                riskCategories.reduce((sum, cat) => sum + cat.data.score, 0) /
                  riskCategories.length
              )}
            </p>
            <p className="text-sm text-green-700 font-semibold mt-1">
              Low Risk
            </p>
            <p className="text-xs text-gray-600 mt-1">Excellent for development</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
