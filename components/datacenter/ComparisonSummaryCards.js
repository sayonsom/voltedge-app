import Card from '@/components/ui/Card';
import { TrendingUp, Clock, DollarSign, Target } from 'lucide-react';

export default function ComparisonSummaryCards({ comparison }) {
  const { traditional, voltedge } = comparison;

  const metrics = [
    {
      label: 'Development Time',
      icon: Clock,
      traditional: `${traditional.developmentTime} months`,
      voltedge: `${voltedge.developmentTime} months`,
      improvement: `${Math.round(((traditional.developmentTime - voltedge.developmentTime) / traditional.developmentTime) * 100)}% faster`,
      unit: ''
    },
    {
      label: 'Risk Score',
      icon: Target,
      traditional: `${traditional.riskScore}/100`,
      voltedge: `${voltedge.riskScore}/100`,
      improvement: `+${voltedge.riskScore - traditional.riskScore} points`,
      unit: ''
    },
    {
      label: 'IRR',
      icon: TrendingUp,
      traditional: `${traditional.irr}%`,
      voltedge: `${voltedge.irr}%`,
      improvement: `+${(voltedge.irr - traditional.irr).toFixed(1)}%`,
      unit: ''
    },
    {
      label: 'Time to Operation',
      icon: Clock,
      traditional: `${traditional.timeToOperation} months`,
      voltedge: `${voltedge.timeToOperation} months`,
      improvement: `${traditional.timeToOperation - voltedge.timeToOperation} months sooner`,
      unit: ''
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="p-5 border border-gray-300">
              <div className="flex items-center gap-2 mb-3">
                <Icon size={18} className="text-gray-700" />
                <h3 className="text-sm font-semibold text-gray-800">{metric.label}</h3>
              </div>

              <div className="space-y-3">
                {/* Traditional */}
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Traditional</p>
                  <p className="text-xl font-bold text-gray-800">{metric.traditional}</p>
                </div>

                {/* VoltEdge - Highlighted in Orange */}
                <div className="bg-orange-50 p-3 rounded border border-orange-200">
                  <p className="text-xs text-orange-800 font-medium mb-1">Our Approach</p>
                  <p className="text-xl font-bold text-orange-900">{metric.voltedge}</p>
                </div>

                {/* Improvement */}
                <div className="flex items-center justify-center gap-1 pt-2 border-t border-gray-200">
                  <TrendingUp size={14} className="text-orange-600" />
                  <span className="text-sm font-semibold text-orange-700">
                    {metric.improvement}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Cost Comparison */}
      <Card className="p-6 bg-gray-50 border border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign size={24} className="text-gray-700" />
            <div>
              <p className="text-sm text-gray-700 font-medium">Total Project Cost Optimization</p>
              <p className="text-xs text-gray-600 mt-1">Through streamlined processes and negotiated vendor lead times</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Traditional</p>
            <p className="text-2xl font-bold text-gray-700 line-through">
              ${(traditional.totalCost / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-orange-800 font-medium mt-2">Our Approach</p>
            <p className="text-3xl font-bold text-orange-900">
              ${(voltedge.totalCost / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-orange-700 font-medium mt-1">
              Save ${((traditional.totalCost - voltedge.totalCost) / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
