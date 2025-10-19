import Card from '@/components/ui/Card';
import { FileText, Building2, Users, Clock, CheckCircle2 } from 'lucide-react';

export default function PermittingRequirements({ permitting, costs }) {
  const { authorities, consultants } = permitting;

  // Calculate total permitting costs
  const totalPermittingCost = Object.values(costs.permitting).reduce((sum, cost) => sum + cost, 0);
  const totalConsultantCost = consultants.reduce(
    (sum, consultant) => {
      const avgCost = consultant.estimatedCost.split(' - ')[0].replace(/[$,]/g, '');
      return sum + parseInt(avgCost);
    },
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText size={24} className="text-[#0078d4]" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Permitting & Regulatory Requirements
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Required permits, authorities, and consultant partnerships
          </p>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-l-4 border-l-[#0078d4]">
          <p className="text-xs text-gray-600 mb-1">Total Permitting Fees</p>
          <p className="text-3xl font-bold text-gray-900">
            ${(totalPermittingCost / 1000).toFixed(0)}k
          </p>
        </Card>
        <Card className="p-5 border-l-4 border-l-purple-600">
          <p className="text-xs text-gray-600 mb-1">Consultant Services</p>
          <p className="text-3xl font-bold text-gray-900">
            ${(totalConsultantCost / 1000).toFixed(0)}k
          </p>
        </Card>
        <Card className="p-5 border-l-4 border-l-green-600">
          <p className="text-xs text-green-800 font-semibold mb-1">Time Saved with VoltEdge</p>
          <p className="text-3xl font-bold text-green-900">
            {Math.round(authorities.reduce((sum, auth) => {
              const tradTime = parseInt(auth.estimatedTime.split('-')[0]);
              const voltTime = parseInt(auth.voltedgeTime.split('-')[0]);
              return sum + (tradTime - voltTime);
            }, 0) * 0.8)} weeks
          </p>
        </Card>
      </div>

      {/* Permitting Authorities */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={20} className="text-[#0078d4]" />
          <h3 className="text-lg font-semibold text-gray-900">
            Permitting Authorities & Agencies
          </h3>
        </div>

        <div className="space-y-4">
          {authorities.map((authority, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-[#0078d4] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{authority.name}</h4>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Required:</span> {authority.requirement}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-gray-600 mb-1">Estimated Cost</p>
                  <p className="text-sm font-bold text-gray-900">{authority.cost}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Traditional Timeline</p>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">
                      {authority.estimatedTime}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-green-800 font-semibold mb-1">VoltEdge Timeline</p>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-green-600" />
                    <span className="text-sm font-bold text-green-900">
                      {authority.voltedgeTime}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Contact</p>
                  <span className="text-sm text-blue-700 font-medium">{authority.contact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-blue-50 p-4 rounded-lg border-l-4 border-l-[#0078d4]">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            VoltEdge Permitting Advantage
          </p>
          <ul className="space-y-1 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span>Pre-established relationships with all permitting authorities</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span>Streamlined application processes and priority review tracks</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span>Proactive coordination with parallel permitting workstreams</span>
            </li>
          </ul>
        </div>
      </Card>

      {/* Consultant Partners */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-[#0078d4]" />
          <h3 className="text-lg font-semibold text-gray-900">
            VoltEdge Consultant Network
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {consultants.map((consultant, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-5 hover:border-[#0078d4] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{consultant.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{consultant.specialty}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="text-sm font-bold text-gray-900">{consultant.rating}</span>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600 mb-1">Industry Average Timeline</p>
                  <p className="text-lg font-semibold text-gray-700">
                    {consultant.industryAvgTime}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded border-l-4 border-l-green-600">
                  <p className="text-xs text-green-800 font-semibold mb-1">
                    Our Negotiated Time
                  </p>
                  <p className="text-lg font-bold text-green-900">
                    {consultant.voltedgeNegotiatedTime}
                  </p>
                  <p className="text-xs text-green-700 mt-1 font-semibold">
                    {Math.round(
                      ((parseInt(consultant.industryAvgTime) - parseInt(consultant.voltedgeNegotiatedTime)) /
                        parseInt(consultant.industryAvgTime)) *
                        100
                    )}% faster
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Estimated Cost</span>
                  <span className="font-semibold text-gray-900">{consultant.estimatedCost}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Track Record</span>
                  <span className="font-semibold text-gray-900">{consultant.experience}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-l-purple-600">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Why Our Consultant Network Matters
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Pre-vetted firms with proven data center expertise</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Master service agreements ensure priority scheduling</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Volume pricing reduces overall project costs</span>
              </li>
            </ul>
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Coordinated workflows minimize handoff delays</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Standardized deliverables accelerate approvals</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Single point of accountability through VoltEdge</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Timeline Comparison */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-600">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Overall Permitting Timeline Comparison
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-700 font-medium mb-2">Traditional Approach</p>
            <div className="space-y-2">
              {authorities.map((auth, idx) => (
                <div key={idx} className="bg-white p-2 rounded text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">{auth.name.split(' ').slice(-2).join(' ')}</span>
                    <span className="font-semibold text-gray-900">{auth.estimatedTime}</span>
                  </div>
                </div>
              ))}
              <div className="bg-gray-700 p-3 rounded text-white font-bold">
                Total: ~{Math.round(
                  authorities.reduce((sum, auth) => {
                    const time = parseInt(auth.estimatedTime.split('-')[1] || auth.estimatedTime);
                    return sum + time;
                  }, 0)
                )} weeks
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-green-800 font-semibold mb-2">VoltEdge Approach</p>
            <div className="space-y-2">
              {authorities.map((auth, idx) => (
                <div key={idx} className="bg-white p-2 rounded text-sm border-l-2 border-l-green-600">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">{auth.name.split(' ').slice(-2).join(' ')}</span>
                    <span className="font-bold text-green-900">{auth.voltedgeTime}</span>
                  </div>
                </div>
              ))}
              <div className="bg-green-700 p-3 rounded text-white font-bold">
                Total: ~{Math.round(
                  authorities.reduce((sum, auth) => {
                    const time = parseInt(auth.voltedgeTime.split('-')[1] || auth.voltedgeTime);
                    return sum + time;
                  }, 0)
                )} weeks
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
