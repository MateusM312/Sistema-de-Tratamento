import { useState } from 'react';
import { Plus } from 'lucide-react';
import SteelTypeForm from './SteelTypeForm';
import WorkInstructionForm from './WorkInstructionForm';
import SteelTypeList from './SteelTypeList';
import WorkInstructionList from './WorkInstructionList';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'steels' | 'instructions'>('steels');
  const [showSteelForm, setShowSteelForm] = useState(false);
  const [showInstructionForm, setShowInstructionForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-900">Administração</h2>
          </div>

          <div className="flex space-x-1 px-6">
            <button
              onClick={() => setActiveTab('steels')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'steels'
                  ? 'border-[#DA291C] text-[#DA291C]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Tipos de Aço
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'instructions'
                  ? 'border-[#DA291C] text-[#DA291C]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Instruções de Trabalho
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'steels' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Gerencie os tipos de aço disponíveis no sistema
                </p>
                <button
                  onClick={() => setShowSteelForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#DA291C] text-white rounded-lg hover:bg-[#B8232C] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Aço
                </button>
              </div>

              {showSteelForm && (
                <SteelTypeForm
                  onClose={() => setShowSteelForm(false)}
                  onSuccess={() => {
                    setShowSteelForm(false);
                    handleRefresh();
                  }}
                />
              )}

              <SteelTypeList key={refreshKey} />
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Gerencie as Instruções de Trabalho (ITs) do sistema
                </p>
                <button
                  onClick={() => setShowInstructionForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#DA291C] text-white rounded-lg hover:bg-[#B8232C] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar IT
                </button>
              </div>

              {showInstructionForm && (
                <WorkInstructionForm
                  onClose={() => setShowInstructionForm(false)}
                  onSuccess={() => {
                    setShowInstructionForm(false);
                    handleRefresh();
                  }}
                />
              )}

              <WorkInstructionList key={refreshKey} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
