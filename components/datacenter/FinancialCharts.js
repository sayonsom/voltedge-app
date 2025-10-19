'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, DollarSign, PieChart as PieChartIcon, Activity, FileSpreadsheet } from 'lucide-react';

export default function FinancialCharts({ financials }) {
  const { npvProjection, irrAnalysis, tcoAnalysis, returnsAnalysis, initialInvestment, annualRevenue } = financials;

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold text-gray-900">Year {label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ${(entry.value / 1000000).toFixed(2)}M
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PercentTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold text-gray-900">Year {label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toFixed(2)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleDownloadFinancialModel = () => {
    // In a real implementation, this would generate and download an XLSX file
    alert('XLSX financial model download coming soon!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={24} className="text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900">
            10-Year Financial Projections
          </h2>
        </div>
        <Button variant="secondary" onClick={handleDownloadFinancialModel} className="print:hidden">
          <FileSpreadsheet size={16} className="mr-2" />
          Download Full Financial Model (XLSX)
        </Button>
      </div>

      {/* NPV Projection */}
      <Card className="p-6 border border-gray-300">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-gray-700" />
            Net Present Value (NPV) Projection
          </h3>
          <p className="text-sm text-gray-700 mt-1">
            Cumulative NPV over 10 years at 8% discount rate
          </p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={npvProjection}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                label={{ value: 'NPV (Millions)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="npv"
                name="Cumulative NPV"
              >
                {npvProjection.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.npv >= 0 ? '#16a34a' : '#dc2626'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded border border-gray-300">
            <p className="text-xs text-gray-600">Initial Investment</p>
            <p className="text-xl font-bold text-gray-900">
              ${(initialInvestment / 1000000).toFixed(2)}M
            </p>
          </div>
          <div className="bg-orange-50 p-3 rounded border border-orange-200">
            <p className="text-xs text-orange-800 font-semibold">Year 10 NPV</p>
            <p className="text-xl font-bold text-orange-900">
              ${(npvProjection[npvProjection.length - 1].npv / 1000000).toFixed(2)}M
            </p>
          </div>
          <div className="bg-orange-50 p-3 rounded border border-orange-200">
            <p className="text-xs text-orange-800 font-semibold">Breakeven</p>
            <p className="text-xl font-bold text-orange-900">
              Year {npvProjection.findIndex(item => item.npv > 0) + 1}
            </p>
          </div>
        </div>
      </Card>

      {/* Annual Returns */}
      <Card className="p-6 border border-gray-300">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <DollarSign size={20} className="text-gray-700" />
            Annual Returns Analysis
          </h3>
          <p className="text-sm text-gray-700 mt-1">
            Revenue, operating expenses, and profit margins
          </p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={returnsAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                label={{ value: 'Amount (Millions)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              <Bar dataKey="opex" fill="#dc2626" name="Operating Expenses" />
              <Bar dataKey="profit" fill="#16a34a" name="Net Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-900 font-medium">Average Annual Profit</p>
              <p className="text-xs text-orange-700 mt-1">Years 1-10</p>
            </div>
            <p className="text-3xl font-bold text-orange-900">
              ${((returnsAnalysis.reduce((sum, item) => sum + item.profit, 0) / returnsAnalysis.length) / 1000000).toFixed(2)}M
            </p>
          </div>
        </div>
      </Card>

      {/* IRR Analysis */}
      <Card className="p-6 border border-gray-300">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <PieChartIcon size={20} className="text-gray-700" />
            Internal Rate of Return (IRR) Progression
          </h3>
          <p className="text-sm text-gray-700 mt-1">
            IRR progression showing return stabilization over time
          </p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={irrAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
              <YAxis
                label={{ value: 'IRR (%)', angle: -90, position: 'insideLeft' }}
                domain={[0, 'auto']}
              />
              <Tooltip content={<PercentTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="irr"
                stroke="#4b5563"
                strokeWidth={3}
                dot={{ fill: '#4b5563', r: 5 }}
                name="IRR"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded border border-gray-300">
            <p className="text-xs text-gray-600">Initial IRR (Year 1)</p>
            <p className="text-xl font-bold text-gray-900">{irrAnalysis[0].irr.toFixed(2)}%</p>
          </div>
          <div className="bg-gray-100 p-3 rounded border border-gray-300">
            <p className="text-xs text-gray-700 font-semibold">Final IRR (Year 10)</p>
            <p className="text-xl font-bold text-gray-900">
              {irrAnalysis[irrAnalysis.length - 1].irr.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-100 p-3 rounded border border-gray-300">
            <p className="text-xs text-gray-700 font-semibold">Average IRR</p>
            <p className="text-xl font-bold text-gray-900">
              {(irrAnalysis.reduce((sum, item) => sum + item.irr, 0) / irrAnalysis.length).toFixed(2)}%
            </p>
          </div>
        </div>
      </Card>

      {/* TCO Analysis */}
      <Card className="p-6 border border-gray-300">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity size={20} className="text-gray-700" />
            Total Cost of Ownership (TCO)
          </h3>
          <p className="text-sm text-gray-700 mt-1">
            Cumulative TCO including CAPEX and OPEX over 10 years
          </p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tcoAnalysis.years}>
              <defs>
                <linearGradient id="colorTCO" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6b7280" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6b7280" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                label={{ value: 'TCO (Millions)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="cumulativeTCO"
                stroke="#6b7280"
                fillOpacity={1}
                fill="url(#colorTCO)"
                name="Cumulative TCO"
              />
              <Line
                type="monotone"
                dataKey="annualOpex"
                stroke="#374151"
                strokeWidth={2}
                dot={false}
                name="Annual OPEX"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 bg-gray-100 p-4 rounded-lg border border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-900 font-medium">10-Year Total TCO</p>
              <p className="text-3xl font-bold text-gray-900">
                ${(tcoAnalysis.years[tcoAnalysis.years.length - 1].cumulativeTCO / 1000000).toFixed(2)}M
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-900 font-medium">Average Annual OPEX</p>
              <p className="text-3xl font-bold text-gray-900">
                ${(tcoAnalysis.years.reduce((sum, item) => sum + item.annualOpex, 0) / tcoAnalysis.years.length / 1000000).toFixed(2)}M
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Investment Summary */}
      <Card className="p-6 bg-gray-50 border border-gray-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Investment Summary & Key Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded border border-gray-300">
            <p className="text-xs text-gray-600 mb-1">Payback Period</p>
            <p className="text-2xl font-bold text-gray-900">
              {npvProjection.findIndex(item => item.npv > 0) + 1} years
            </p>
          </div>
          <div className="bg-white p-4 rounded border border-gray-300">
            <p className="text-xs text-gray-600 mb-1">10-Year ROI</p>
            <p className="text-2xl font-bold text-gray-900">
              {((npvProjection[npvProjection.length - 1].npv / initialInvestment) * 100).toFixed(0)}%
            </p>
          </div>
          <div className="bg-white p-4 rounded border border-gray-300">
            <p className="text-xs text-gray-600 mb-1">Final IRR</p>
            <p className="text-2xl font-bold text-gray-900">
              {irrAnalysis[irrAnalysis.length - 1].irr.toFixed(1)}%
            </p>
          </div>
          <div className="bg-white p-4 rounded border border-gray-300">
            <p className="text-xs text-gray-600 mb-1">Total Revenue (10yr)</p>
            <p className="text-2xl font-bold text-gray-900">
              ${(returnsAnalysis.reduce((sum, item) => sum + item.revenue, 0) / 1000000).toFixed(0)}M
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
