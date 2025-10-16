import { RecommendationResult } from '../lib/recommendationEngine';
import { Thermometer, Clock, ShieldCheck, Award, CheckCircle, XCircle, Save } from 'lucide-react';

interface RecommendationCardProps {
  result: RecommendationResult;
  rank: number;
  onSave: () => void;
}

export default function RecommendationCard({ result, rank, onSave }: RecommendationCardProps) {
  const { workInstruction, reason, confidenceScore, matchDetails } = result;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  return (
    <div className={`p-6 bg-white border-2 rounded-lg ${getScoreColor(confidenceScore)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex items-center justify-center w-10 h-10 bg-[#00205B] text-white rounded-full font-bold">
            {rank}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h4 className="font-bold text-lg text-gray-900">{workInstruction.it_code}</h4>
              <span className="px-3 py-1 text-sm font-medium bg-[#00205B] bg-opacity-10 text-[#00205B] rounded">
                {workInstruction.treatment_type}
              </span>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span className={`px-3 py-1 text-sm font-bold rounded ${getScoreBadgeColor(confidenceScore)}`}>
                  {confidenceScore.toFixed(0)}% de confiança
                </span>
              </div>
            </div>
            <p className="text-gray-900 font-medium mb-2">{workInstruction.title}</p>
            {workInstruction.description && (
              <p className="text-sm text-gray-600">{workInstruction.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={onSave}
          className="ml-4 flex items-center gap-2 px-4 py-2 bg-[#DA291C] text-white rounded-lg hover:bg-[#B8232C] transition-colors"
        >
          <Save className="w-4 h-4" />
          Salvar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {matchDetails.temperatureRange && (
          <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
            <Thermometer className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Temperatura</p>
              <p className="text-sm text-gray-900 font-medium">{matchDetails.temperatureRange}</p>
            </div>
          </div>
        )}

        {matchDetails.durationRange && (
          <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Duração</p>
              <p className="text-sm text-gray-900 font-medium">{matchDetails.durationRange}</p>
            </div>
          </div>
        )}

        {workInstruction.cooling_method && (
          <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
            <ShieldCheck className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Resfriamento</p>
              <p className="text-sm text-gray-900 font-medium">{workInstruction.cooling_method}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 p-4 bg-white rounded-lg">
        <p className="text-xs text-gray-500 font-medium mb-2">Critérios de Compatibilidade:</p>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {matchDetails.steelMatch ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span className="text-sm text-gray-700">Tipo de Aço</span>
          </div>
          <div className="flex items-center gap-2">
            {matchDetails.hardnessInputMatch ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span className="text-sm text-gray-700">Dureza de Entrada</span>
          </div>
          <div className="flex items-center gap-2">
            {matchDetails.hardnessOutputMatch ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span className="text-sm text-gray-700">Dureza de Saída</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg">
        <p className="text-xs text-gray-500 font-medium mb-2">Justificativa:</p>
        <div className="text-sm text-gray-700 whitespace-pre-line">{reason}</div>
      </div>

      {workInstruction.special_notes && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-xs text-yellow-800">
            <span className="font-medium">Observações Importantes: </span>
            {workInstruction.special_notes}
          </p>
        </div>
      )}
    </div>
  );
}
