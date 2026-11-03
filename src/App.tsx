import React, { useState } from 'react';
import { TelemetryProvider, useTelemetry } from './context/TelemetryContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { DashboardView } from './components/dashboard/DashboardView';
import { SensorMonitoringView } from './components/sensors/SensorMonitoringView';
import { MLPredictionView } from './components/predictions/MLPredictionView';
import { MachineManagementView } from './components/machines/MachineManagementView';
import { AlertManagementView } from './components/alerts/AlertManagementView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SolutionPipelineView } from './components/pipeline/SolutionPipelineView';
import { LandingPageView } from './components/landing/LandingPageView';
import { AuthModal } from './components/modals/AuthModal';
import { GitHubExportModal } from './components/modals/GitHubExportModal';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, isGitHubModalOpen, setIsGitHubModalOpen } = useTelemetry();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'sensors':
        return <SensorMonitoringView />;
      case 'predictions':
        return <MLPredictionView />;
      case 'machines':
        return <MachineManagementView />;
      case 'alerts':
        return <AlertManagementView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'pipeline':
        return <SolutionPipelineView />;
      case 'landing':
        return <LandingPageView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        <TopHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Quiet Industrial Footer */}
        <footer className="no-print border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">PredictX</span>
              <span>·</span>
              <span>AI-Powered Predictive Maintenance for Industry</span>
              <span>·</span>
              <span className="text-slate-400">ISO 10816-3 Certified Architecture</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <button 
                onClick={() => setActiveTab('landing')} 
                className="hover:text-blue-600 transition-colors"
              >
                Project Overview
              </button>
              <button 
                onClick={() => setActiveTab('pipeline')} 
                className="hover:text-blue-600 transition-colors"
              >
                Solution Pipeline
              </button>
              <button 
                onClick={() => setIsGitHubModalOpen(true)} 
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors flex items-center gap-1"
              >
                <span>Export for GitHub (.ZIP)</span>
              </button>
              <span className="text-slate-400">Plant #4 Telemetry Gateway: Online</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <AuthModal />
      <GitHubExportModal 
        isOpen={isGitHubModalOpen} 
        onClose={() => setIsGitHubModalOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <TelemetryProvider>
      <AppContent />
    </TelemetryProvider>
  );
}
