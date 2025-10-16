import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { History, MessageSquare } from 'lucide-react';
import FeedbackForm from './FeedbackForm';

interface RecommendationWithDetails {
  id: string;
  steel_code: string | null;
  it_code: string;
  it_title: string;
  treatment_type: string;
  input_hardness: number | null;
  desired_hardness: number | null;
  piece_description: string;
  client_name: string;
  user_name: string;
  confidence_score: number;
  created_at: string;
  feedback_count: number;
}

export default function HistoryPanel() {
  const [recommendations, setRecommendations] = useState<RecommendationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data: recsData, error: recsError } = await supabase
        .from('recommendations')
        .select(`
          id,
          input_hardness,
          desired_hardness,
          piece_description,
          client_name,
          user_name,
          confidence_score,
          created_at,
          steel_types (code),
          work_instructions (it_code, title, treatment_type)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (recsError) throw recsError;

      const { data: feedbackData } = await supabase
        .from('feedback')
        .select('recommendation_id');

      const feedbackCounts = feedbackData?.reduce((acc, fb) => {
        acc[fb.recommendation_id] = (acc[fb.recommendation_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const formattedData: RecommendationWithDetails[] = (recsData || []).map((rec: any) => ({
        id: rec.id,
        steel_code: rec.steel_types?.code || null,
        it_code: rec.work_instructions?.it_code || '',
        it_title: rec.work_instructions?.title || '',
        treatment_type: rec.work_instructions?.treatment_type || '',
        input_hardness: rec.input_hardness,
        desired_hardness: rec.desired_hardness,
        piece_description: rec.piece_description,
        client_name: rec.client_name,
        user_name: rec.user_name,
        confidence_score: rec.confidence_score,
        created_at: rec.created_at,
        feedback_count: feedbackCounts[rec.id] || 0,
      }));

      setRecommendations(formattedData);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSuccess = () => {
    setSelectedRecommendation(null);
    loadHistory();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <History className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Histórico de Recomendações</h2>
              <p className="text-gray-600 text-sm mt-1">
                Visualize e adicione feedback às recomendações anteriores
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {recommendations.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Nenhuma recomendação registrada ainda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h4 className="font-bold text-gray-900">{rec.it_code}</h4>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {rec.treatment_type}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                          {rec.confidence_score.toFixed(0)}% confiança
                        </span>
                        {rec.feedback_count > 0 && (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                            {rec.feedback_count} feedback(s)
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900 font-medium mb-1">{rec.it_title}</p>
                      <div className="text-xs text-gray-600 space-y-1">
                        {rec.steel_code && (
                          <p>
                            <span className="font-medium">Aço:</span> {rec.steel_code}
                          </p>
                        )}
                        {rec.piece_description && (
                          <p>
                            <span className="font-medium">Peça:</span> {rec.piece_description}
                          </p>
                        )}
                        {(rec.input_hardness !== null || rec.desired_hardness !== null) && (
                          <p>
                            <span className="font-medium">Dureza:</span>{' '}
                            {rec.input_hardness !== null && `${rec.input_hardness} HRC`}
                            {rec.input_hardness !== null && rec.desired_hardness !== null && ' → '}
                            {rec.desired_hardness !== null && `${rec.desired_hardness} HRC`}
                          </p>
                        )}
                        <p>
                          <span className="font-medium">Cliente:</span> {rec.client_name || 'N/A'} |{' '}
                          <span className="font-medium">Atendido por:</span> {rec.user_name || 'N/A'}
                        </p>
                        <p>
                          <span className="font-medium">Data:</span>{' '}
                          {new Date(rec.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedRecommendation(rec.id)}
                      className="ml-4 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedRecommendation && (
        <FeedbackForm
          recommendationId={selectedRecommendation}
          onClose={() => setSelectedRecommendation(null)}
          onSuccess={handleFeedbackSuccess}
        />
      )}
    </div>
  );
}
