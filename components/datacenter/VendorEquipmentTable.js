import Card from '@/components/ui/Card';
import { Package, TrendingDown, Clock } from 'lucide-react';

export default function VendorEquipmentTable({ equipment, selectedSize }) {
  const totalIndustryWeeks = equipment.reduce((sum, eq) => sum + eq.industryAvg, 0);
  const totalVoltedgeWeeks = equipment.reduce((sum, eq) => sum + eq.voltedge, 0);
  const timeSaved = totalIndustryWeeks - totalVoltedgeWeeks;
  const percentImprovement = ((timeSaved / totalIndustryWeeks) * 100).toFixed(0);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package size={24} className="text-[#0078d4]" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Equipment & Vendor Lead Times
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Critical equipment procurement timeline comparison
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-l-gray-400">
          <p className="text-xs text-gray-600 mb-1">Industry Average Timeline</p>
          <p className="text-3xl font-bold text-gray-700">{totalIndustryWeeks} weeks</p>
          <p className="text-xs text-gray-500 mt-1">Traditional procurement</p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-l-green-600">
          <p className="text-xs text-green-800 font-semibold mb-1">VoltEdge Negotiated Timeline</p>
          <p className="text-3xl font-bold text-green-900">{totalVoltedgeWeeks} weeks</p>
          <p className="text-xs text-green-700 mt-1 font-semibold">Pre-negotiated agreements</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-l-[#0078d4]">
          <p className="text-xs text-blue-800 font-semibold mb-1">Time Savings</p>
          <p className="text-3xl font-bold text-blue-900">{timeSaved} weeks</p>
          <p className="text-xs text-blue-700 mt-1 font-semibold">{percentImprovement}% faster</p>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Equipment Category</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Primary Vendors</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">
                Industry Avg<br/>
                <span className="text-xs font-normal text-gray-600">(weeks)</span>
              </th>
              <th className="text-center py-3 px-4 font-semibold text-green-900 bg-green-50">
                VoltEdge Time<br/>
                <span className="text-xs font-normal text-green-700">(weeks)</span>
              </th>
              <th className="text-center py-3 px-4 font-semibold text-blue-900">
                Savings<br/>
                <span className="text-xs font-normal text-blue-700">(weeks)</span>
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">
                Est. Cost<br/>
                <span className="text-xs font-normal text-gray-600">(per unit)</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item, index) => {
              const savings = item.industryAvg - item.voltedge;
              const savingsPercent = ((savings / item.industryAvg) * 100).toFixed(0);
              const cost = item.unitCost[selectedSize];

              return (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <p className="font-semibold text-gray-900">{item.category}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {item.vendors.map((vendor, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700"
                        >
                          {vendor}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-lg font-bold text-gray-700">{item.industryAvg}</span>
                  </td>
                  <td className="py-4 px-4 text-center bg-green-50">
                    <span className="text-lg font-bold text-green-900">{item.voltedge}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-blue-900">{savings}</span>
                      <span className="text-xs text-blue-700 font-semibold">
                        ({savingsPercent}%)
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-semibold text-gray-900">
                      ${(cost / 1000).toFixed(0)}k
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td colSpan="2" className="py-4 px-4 text-gray-900">
                TOTAL PROCUREMENT TIMELINE
              </td>
              <td className="py-4 px-4 text-center text-gray-700">
                {totalIndustryWeeks} weeks
              </td>
              <td className="py-4 px-4 text-center text-green-900 bg-green-100">
                {totalVoltedgeWeeks} weeks
              </td>
              <td className="py-4 px-4 text-center text-blue-900">
                {timeSaved} weeks
              </td>
              <td className="py-4 px-4 text-right text-gray-900">
                ${(equipment.reduce((sum, eq) => sum + eq.unitCost[selectedSize], 0) / 1000000).toFixed(2)}M
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Key Benefits */}
      <div className="mt-6 bg-blue-50 p-5 rounded-lg border-l-4 border-l-[#0078d4]">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingDown size={20} className="text-[#0078d4]" />
          VoltEdge Vendor Advantage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-gray-700">
                Pre-negotiated master service agreements with tier-1 vendors
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-gray-700">
                Priority allocation on production lines
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-gray-700">
                Volume purchasing power reduces unit costs
              </span>
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-gray-700">
                Streamlined technical specifications and approvals
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-gray-700">
                Expedited shipping and logistics coordination
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-gray-700">
                Reduced risk of supply chain disruptions
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
