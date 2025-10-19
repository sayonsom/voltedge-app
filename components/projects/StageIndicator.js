'use client';

import { CheckCircle2, Circle } from 'lucide-react';

export default function StageIndicator({ currentStage }) {
  const stages = [
    { id: 'initial-surveys', name: 'Initial Surveys', order: 1 },
    { id: 'reports', name: 'Reports', order: 2 },
    { id: 'financial-model', name: 'Financial Model', order: 3 },
    { id: 'procurement', name: 'Procurement', order: 4 },
    { id: 'documents', name: 'Documents', order: 5 },
    { id: 'tax-incentives', name: 'Tax Incentives', order: 6 },
  ];

  const currentOrder = stages.find(s => s.id === currentStage)?.order || 1;

  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Development Stages</h3>
      <div className="space-y-2">
        {stages.map((stage, index) => {
          const isCompleted = stage.order < currentOrder;
          const isCurrent = stage.id === currentStage;

          return (
            <div key={stage.id} className="flex items-center gap-3">
              {isCompleted ? (
                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
              ) : (
                <Circle
                  size={20}
                  className={`flex-shrink-0 ${isCurrent ? 'text-[#0078d4]' : 'text-gray-300'}`}
                  fill={isCurrent ? '#0078d4' : 'none'}
                />
              )}
              <span className={`text-sm ${
                isCurrent ? 'text-[#0078d4] font-medium' :
                isCompleted ? 'text-gray-600' :
                'text-gray-400'
              }`}>
                {stage.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
