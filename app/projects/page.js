'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/layout/Navigation';
import StatusBar from '@/components/layout/StatusBar';
import Card from '@/components/ui/Card';
import { Clock, CheckCircle, AlertCircle, TrendingUp, ChevronRight } from 'lucide-react';
import { projectsMockData } from '@/lib/mockData/projects';

export default function Projects() {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  const projects = projectsMockData;

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

  const getStatusIcon = (statusType) => {
    switch (statusType) {
      case 'progress':
        return <Clock className="w-5 h-5" />;
      case 'planning':
        return <TrendingUp className="w-5 h-5" />;
      case 'hold':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f2f1]">
      <Navigation />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Development Status
            </h1>
            <p className="text-sm text-gray-600">
              Track your data center projects and their progress
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Total Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">In Progress</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {projects.filter(p => p.statusType === 'progress').length}
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Total Capacity</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {projects.reduce((sum, p) => sum + p.targetMW, 0)} MW
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Total Area</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {(projects.reduce((sum, p) => sum + p.sqft, 0) / 1000).toFixed(0)}K sqft
                </p>
              </div>
            </Card>
          </div>

          {/* Projects List */}
          <div className="space-y-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <div className="space-y-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {project.name}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.statusType)}`}>
                          {getStatusIcon(project.statusType)}
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{project.location}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{project.phase}</p>
                        <p className="text-xs text-gray-600">Current Phase</p>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Progress</span>
                      <span className="text-xs font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#0078d4] h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-600">Target Capacity</p>
                      <p className="text-sm font-medium text-gray-900">{project.targetMW} MW</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Area</p>
                      <p className="text-sm font-medium text-gray-900">{project.sqft.toLocaleString()} sqft</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Start Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(project.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Est. Completion</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(project.estimatedCompletion).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <StatusBar />
    </div>
  );
}
