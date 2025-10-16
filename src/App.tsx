import { useState } from 'react';
import { Flame, Settings, Search, History } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import ConsultationPanel from './components/ConsultationPanel';
import HistoryPanel from './components/HistoryPanel';

type View = 'consultation' | 'admin' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<View>('consultation');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema de Tratamento Térmico - Desafio Normatic</h1>
                <p className="text-sm text-gray-600">Recomendações de tratamento.</p>
              </div>
            </div>
          </div>

          <nav className="flex gap-2 mt-4">
            <button
              onClick={() => setCurrentView('consultation')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'consultation'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Search className="w-5 h-5" />
              Consulta
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'admin'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              Administração
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <History className="w-5 h-5" />
              Histórico
            </button>
          </nav>
        </div>
      </header>

      <main className="py-8">
        {currentView === 'consultation' && <ConsultationPanel />}
        {currentView === 'admin' && <AdminPanel />}
        {currentView === 'history' && <HistoryPanel />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-sm text-gray-600">
            comercial@normatic.com.br Normatic Tratamentos Térmicos
R. Anselmo Vaccari, 254 - Àguas Belas, São José dos Pinhais - PR | 83.040-580 
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
