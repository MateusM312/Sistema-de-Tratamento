import { useState } from 'react';
import { Search, Lightbulb } from 'lucide-react';
import { RecommendationEngine, RecommendationResult } from '../lib/recommendationEngine';
import RecommendationCard from './RecommendationCard';

export default function ConsultationPanel() {
  const [formData, setFormData] = useState({
    steelCode: '',
    inputHardness: '',
    desiredHardness: '',
    pieceDescription: '',
    clientName: '',
    userName: '',
  });
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const engine = new RecommendationEngine();
      const results = await engine.findRecommendations({
        steelCode: formData.steelCode,
        inputHardness: formData.inputHardness ? parseFloat(formData.inputHardness) : undefined,
        desiredHardness: formData.desiredHardness ? parseFloat(formData.desiredHardness) : undefined,
        pieceDescription: formData.pieceDescription,
      });

      setRecommendations(results);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar recomendações');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecommendation = async (result: RecommendationResult) => {
    if (!formData.userName) {
      alert('Por favor, informe seu nome para salvar a recomendação');
      return;
    }

    try {
      const engine = new RecommendationEngine();
      await engine.saveRecommendation(
        {
          steelCode: formData.steelCode,
          inputHardness: formData.inputHardness ? parseFloat(formData.inputHardness) : undefined,
          desiredHardness: formData.desiredHardness ? parseFloat(formData.desiredHardness) : undefined,
          pieceDescription: formData.pieceDescription,
        },
        result,
        formData.userName,
        formData.clientName
      );
      alert('Recomendação salva com sucesso!');
    } catch (err) {
      alert('Erro ao salvar recomendação');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="w-8 h-8 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">Consulta de Tratamento Térmico</h2>
          </div>
          <p className="text-gray-600">
            Informe os dados da peça e receba recomendações de tratamento térmico
          </p>
        </div>

        <form onSubmit={handleSearch} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código do Aço *
              </label>
              <input
                type="text"
                required
                value={formData.steelCode}
                onChange={(e) => setFormData({ ...formData, steelCode: e.target.value })}
                placeholder="Ex: AISI 4140"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00205B] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição da Peça
              </label>
              <input
                type="text"
                value={formData.pieceDescription}
                onChange={(e) => setFormData({ ...formData, pieceDescription: e.target.value })}
                placeholder="Ex: Eixo de transmissão"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00205B] focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dureza Inicial (HRC)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.inputHardness}
                onChange={(e) => setFormData({ ...formData, inputHardness: e.target.value })}
                placeholder="Ex: 20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00205B] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dureza Desejada (HRC)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.desiredHardness}
                onChange={(e) => setFormData({ ...formData, desiredHardness: e.target.value })}
                placeholder="Ex: 55"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00205B] focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seu Nome
              </label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                placeholder="Seu nome"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00205B] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Cliente
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Nome do cliente"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00205B] focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#DA291C] text-white rounded-lg hover:bg-[#B8232C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Buscando...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Buscar Recomendações
              </>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg mb-6">
          {error}
        </div>
      )}

      {searched && !loading && recommendations.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Nenhuma recomendação encontrada</p>
          <p className="text-sm text-gray-500 mt-2">
            Tente ajustar os parâmetros de busca ou verifique se há ITs cadastradas
          </p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">
            Recomendações Encontradas ({recommendations.length})
          </h3>
          {recommendations.map((result, idx) => (
            <RecommendationCard
              key={idx}
              result={result}
              rank={idx + 1}
              onSave={() => handleSaveRecommendation(result)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
