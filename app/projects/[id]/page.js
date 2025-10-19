'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/layout/Navigation';
import StatusBar from '@/components/layout/StatusBar';
import Card from '@/components/ui/Card';
import StageIndicator from '@/components/projects/StageIndicator';
import ProjectTimeline from '@/components/projects/ProjectTimeline';
import InitialSurveysSection from '@/components/projects/sections/InitialSurveysSection';
import ReportsSection from '@/components/projects/sections/ReportsSection';
import FinancialModelSection from '@/components/projects/sections/FinancialModelSection';
import ProcurementSection from '@/components/projects/sections/ProcurementSection';
import DocumentsSection from '@/components/projects/sections/DocumentsSection';
import TaxIncentivesSection from '@/components/projects/sections/TaxIncentivesSection';
import { getProjectById } from '@/lib/mockData/projects';
import { ArrowLeft, MapPin, Calendar, TrendingUp } from 'lucide-react';

export default function ProjectDetail({ params }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const project = getProjectById(params.id);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f2f1]">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f3f2f1]">
        <Navigation />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Project Not Found</h1>
              <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
              <button
                onClick={() => router.push('/projects')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded text-sm font-medium transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Projects
              </button>
            </div>
          </div>
        </main>
        <StatusBar />
      </div>
    );
  }

  const getStatusColor = (statusType) => {
    switch (statusType) {
      case 'progress':
        return 'bg-blue-50 text-blue-700';
      case 'planning':
        return 'bg-yellow-50 text-yellow-700';
      case 'hold':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f2f1]">
      <Navigation />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/projects')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </button>

          {/* Project Header */}
          <Card className="mb-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
                    <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${getStatusColor(project.statusType)}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      {project.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {project.phase}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Overall Progress</span>
                  <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#0078d4] h-3 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Target Capacity</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-lg font-semibold text-gray-900">{project.targetMW}</p>
                    <span className="text-sm text-gray-600">MW</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Area</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-lg font-semibold text-gray-900">{project.sqft.toLocaleString()}</p>
                    <span className="text-sm text-gray-600">sqft</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Start Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Est. Completion</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(project.estimatedCompletion).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Stage Indicator and Timeline */}
            <div className="lg:col-span-1 space-y-4">
              <StageIndicator currentStage={project.currentStage} />
              <ProjectTimeline project={project} />
            </div>

            {/* Main Content - Project Sections */}
            <div className="lg:col-span-3 space-y-4">
              <InitialSurveysSection data={project.initialSurveys} />
              <ReportsSection data={project.reports} />
              <FinancialModelSection data={project.financialModel} />
              <ProcurementSection data={project.procurement} />
              <DocumentsSection data={project.documents} />
              <TaxIncentivesSection data={project.taxIncentives} />
            </div>
          </div>
        </div>
      </main>

      <StatusBar />
    </div>
  );
}
