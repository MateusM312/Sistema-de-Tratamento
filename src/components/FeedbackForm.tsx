import { useState } from 'react';
import { X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FeedbackFormProps {
  recommendationId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FeedbackForm({ recommendationId, onClose, onSuccess }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    wasSuccessful: true,
    actualHardness: '',
    comments: '',
    userName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase.from('feedback').insert({
        recommendation_id: recommendationId,
        was_successful: formData.wasSuccessful,
        actual_hardness: formData.actualHardness ? parseFloat(formData.actualHardness) : null,
        comments: formData.comments,
        user_name: formData.userName,
      });

      if (insertError) throw insertError;

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Adicionar Feedback</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              O tratamento foi bem-sucedido? *
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, wasSuccessful: true })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-colors ${
                  formData.wasSuccessful
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                Sim, sucesso
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, wasSuccessful: false })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-colors ${
                  !formData.wasSuccessful
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <ThumbsDown className="w-5 h-5" />
                Não, falhou
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dureza Real Obtida (HRC)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.actualHardness}
              onChange={(e) => setFormData({ ...formData, actualHardness: e.target.value })}
              placeholder="Ex: 54.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentários *
            </label>
            <textarea
              required
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              rows={4}
              placeholder="Descreva o resultado do tratamento, problemas encontrados, sugestões, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seu Nome *
            </label>
            <input
              type="text"
              required
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              placeholder="Seu nome"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#DA291C] text-white rounded-lg hover:bg-[#B8232C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : 'Salvar Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
