import { useState } from 'react';
import RoutesTab from './components/RoutesTab';
import CompareTab from './components/CompareTab';
import BankingTab from './components/BankingTab';
import PoolingTab from './components/PoolingTab';
import { ApiClient } from './adapters/infrastructure/ApiClient';
import { RouteService } from './adapters/ui/services/RouteService';
import { ComplianceService } from './adapters/ui/services/ComplianceService';
import { BankingService } from './adapters/ui/services/BankingService';
import { PoolingService } from './adapters/ui/services/PoolingService';

const apiClient = new ApiClient();
const routeService = new RouteService(apiClient);
const complianceService = new ComplianceService(apiClient);
const bankingService = new BankingService(apiClient);
const poolingService = new PoolingService(apiClient);

function App() {
  const [activeTab, setActiveTab] = useState<'routes' | 'compare' | 'banking' | 'pooling'>('routes');

  const tabs = [
    { id: 'routes' as const, label: 'Routes' },
    { id: 'compare' as const, label: 'Compare' },
    { id: 'banking' as const, label: 'Banking' },
    { id: 'pooling' as const, label: 'Pooling' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Fuel EU Maritime Compliance Dashboard</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'routes' && <RoutesTab routeService={routeService} />}
          {activeTab === 'compare' && <CompareTab routeService={routeService} />}
          {activeTab === 'banking' && (
            <BankingTab
              bankingService={bankingService}
              complianceService={complianceService}
            />
          )}
          {activeTab === 'pooling' && (
            <PoolingTab
              poolingService={poolingService}
              complianceService={complianceService}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;



