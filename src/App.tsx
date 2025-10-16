import { useState } from 'react';
import { Settings, Search, History } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import ConsultationPanel from './components/ConsultationPanel';
import HistoryPanel from './components/HistoryPanel';

type View = 'consultation' | 'admin' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<View>('consultation');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-[#00205B] border-b border-[#00205B] shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/image-removebg-preview.png" alt="Normatic" className="h-12" />
              <div>
                <h1 className="text-2xl font-bold text-white">Sistema de Tratamento Térmico</h1>
                <p className="text-sm text-gray-200">Assistente Inteligente de Recomendações</p>
              </div>
            </div>
          </div>

          <nav className="flex gap-2 mt-4">
            <button
              onClick={() => setCurrentView('consultation')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'consultation'
                  ? 'bg-[#DA291C] text-white'
                  : 'text-white hover:bg-[#003879]'
              }`}
            >
              <Search className="w-5 h-5" />
              Consulta
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'admin'
                  ? 'bg-[#DA291C] text-white'
                  : 'text-white hover:bg-[#003879]'
              }`}
            >
              <Settings className="w-5 h-5" />
              Administração
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'history'
                  ? 'bg-[#DA291C] text-white'
                  : 'text-white hover:bg-[#003879]'
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

      <footer className="bg-[#00205B] border-t border-[#00205B] mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-sm text-gray-200">
            comercial@normatic.com.br | Normatic Tratamentos Térmicos | R. Anselmo Vaccari, 254 - Águas Belas, São José dos Pinhais - PR | 83.040-580
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
