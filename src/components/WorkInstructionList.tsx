import { useEffect, useState } from 'react';
import { supabase, WorkInstruction } from '../lib/supabase';
import { FileText, Thermometer, Clock, ShieldCheck } from 'lucide-react';

export default function WorkInstructionList() {
  const [instructions, setInstructions] = useState<WorkInstruction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInstructions();
  }, []);

  const loadInstructions = async () => {
    try {
      const { data, error } = await supabase
        .from('work_instructions')
        .select('*')
        .order('it_code', { ascending: true });

      if (error) throw error;
      setInstructions(data || []);
    } catch (err) {
      console.error('Erro ao carregar ITs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DA291C]"></div>
      </div>
    );
  }

  if (instructions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">Nenhuma IT cadastrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {instructions.map((instruction) => (
        <div
          key={instruction.id}
          className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-bold text-lg text-gray-900">{instruction.it_code}</h4>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                  {instruction.treatment_type}
                </span>
                {instruction.is_active ? (
                  <span className="px-2 py-1 text-xs font-medium bg-[#00205B] bg-opacity-10 text-[#00205B] rounded">
                    Ativa
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                    Inativa
                  </span>
                )}
              </div>
              <p className="text-gray-900 font-medium">{instruction.title}</p>
              {instruction.description && (
                <p className="text-sm text-gray-600 mt-1">{instruction.description}</p>
              )}
            </div>
            <span className="text-xs text-gray-500">v{instruction.version}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {(instruction.temperature_min !== null || instruction.temperature_max !== null) && (
              <div className="flex items-start gap-2">
                <Thermometer className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Temperatura</p>
                  <p className="text-sm text-gray-900">
                    {instruction.temperature_min}°C - {instruction.temperature_max}°C
                  </p>
                </div>
              </div>
            )}

            {(instruction.duration_min !== null || instruction.duration_max !== null) && (
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Duração</p>
                  <p className="text-sm text-gray-900">
                    {instruction.duration_min} - {instruction.duration_max} min
                  </p>
                </div>
              </div>
            )}

            {instruction.cooling_method && (
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Resfriamento</p>
                  <p className="text-sm text-gray-900">{instruction.cooling_method}</p>
                </div>
              </div>
            )}
          </div>

          {(instruction.hardness_input_min !== null ||
            instruction.hardness_output_min !== null) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              {instruction.hardness_input_min !== null && (
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Dureza de Entrada</p>
                  <p className="text-sm text-gray-900">
                    {instruction.hardness_input_min} - {instruction.hardness_input_max} HRC
                  </p>
                </div>
              )}
              {instruction.hardness_output_min !== null && (
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Dureza de Saída</p>
                  <p className="text-sm text-gray-900">
                    {instruction.hardness_output_min} - {instruction.hardness_output_max} HRC
                  </p>
                </div>
              )}
            </div>
          )}

          {instruction.applicable_steels && instruction.applicable_steels.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 font-medium mb-2">Aços Aplicáveis:</p>
              <div className="flex flex-wrap gap-2">
                {instruction.applicable_steels.map((steel, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {steel}
                  </span>
                ))}
              </div>
            </div>
          )}

          {instruction.special_notes && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs text-yellow-800">
                <span className="font-medium">Observações: </span>
                {instruction.special_notes}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
