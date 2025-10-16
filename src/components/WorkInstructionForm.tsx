import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase, SteelType } from '../lib/supabase';

interface WorkInstructionFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function WorkInstructionForm({ onClose, onSuccess }: WorkInstructionFormProps) {
  const [steelTypes, setSteelTypes] = useState<SteelType[]>([]);
  const [selectedSteels, setSelectedSteels] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    it_code: '',
    title: '',
    description: '',
    treatment_type: '',
    temperature_min: '',
    temperature_max: '',
    duration_min: '',
    duration_max: '',
    cooling_method: '',
    hardness_input_min: '',
    hardness_input_max: '',
    hardness_output_min: '',
    hardness_output_max: '',
    special_notes: '',
    version: '1.0',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSteelTypes();
  }, []);

  const loadSteelTypes = async () => {
    const { data } = await supabase
      .from('steel_types')
      .select('*')
      .order('code', { ascending: true });
    if (data) setSteelTypes(data);
  };

  const handleSteelToggle = (code: string) => {
    setSelectedSteels((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase.from('work_instructions').insert({
        it_code: formData.it_code,
        title: formData.title,
        description: formData.description,
        treatment_type: formData.treatment_type,
        temperature_min: formData.temperature_min ? parseFloat(formData.temperature_min) : null,
        temperature_max: formData.temperature_max ? parseFloat(formData.temperature_max) : null,
        duration_min: formData.duration_min ? parseFloat(formData.duration_min) : null,
        duration_max: formData.duration_max ? parseFloat(formData.duration_max) : null,
        cooling_method: formData.cooling_method,
        applicable_steels: selectedSteels,
        hardness_input_min: formData.hardness_input_min ? parseFloat(formData.hardness_input_min) : null,
        hardness_input_max: formData.hardness_input_max ? parseFloat(formData.hardness_input_max) : null,
        hardness_output_min: formData.hardness_output_min ? parseFloat(formData.hardness_output_min) : null,
        hardness_output_max: formData.hardness_output_max ? parseFloat(formData.hardness_output_max) : null,
        special_notes: formData.special_notes,
        version: formData.version,
        is_active: true,
      });

      if (insertError) throw insertError;

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar IT');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-gray-900">Adicionar Instrução de Trabalho</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código da IT *
              </label>
              <input
                type="text"
                required
                value={formData.it_code}
                onChange={(e) => setFormData({ ...formData, it_code: e.target.value })}
                placeholder="Ex: IT-001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Versão *
              </label>
              <input
                type="text"
                required
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="Ex: 1.0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Têmpera e Revenido para AISI 4140"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Descrição detalhada do processo"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Tratamento *
              </label>
              <select
                required
                value={formData.treatment_type}
                onChange={(e) => setFormData({ ...formData, treatment_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="Têmpera">Têmpera</option>
                <option value="Revenido">Revenido</option>
                <option value="Têmpera e Revenido">Têmpera e Revenido</option>
                <option value="Normalização">Normalização</option>
                <option value="Recozimento">Recozimento</option>
                <option value="Cementação">Cementação</option>
                <option value="Nitretação">Nitretação</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Resfriamento
              </label>
              <input
                type="text"
                value={formData.cooling_method}
                onChange={(e) => setFormData({ ...formData, cooling_method: e.target.value })}
                placeholder="Ex: Óleo, Água, Ar"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temp. Mín (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.temperature_min}
                onChange={(e) => setFormData({ ...formData, temperature_min: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temp. Máx (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.temperature_max}
                onChange={(e) => setFormData({ ...formData, temperature_max: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração Mín (min)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.duration_min}
                onChange={(e) => setFormData({ ...formData, duration_min: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração Máx (min)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.duration_max}
                onChange={(e) => setFormData({ ...formData, duration_max: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dureza Entrada Mín (HRC)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.hardness_input_min}
                onChange={(e) => setFormData({ ...formData, hardness_input_min: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dureza Entrada Máx (HRC)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.hardness_input_max}
                onChange={(e) => setFormData({ ...formData, hardness_input_max: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dureza Saída Mín (HRC)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.hardness_output_min}
                onChange={(e) => setFormData({ ...formData, hardness_output_min: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dureza Saída Máx (HRC)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.hardness_output_max}
                onChange={(e) => setFormData({ ...formData, hardness_output_max: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aços Aplicáveis
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
              {steelTypes.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum tipo de aço cadastrado</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {steelTypes.map((steel) => (
                    <label key={steel.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSteels.includes(steel.code)}
                        onChange={() => handleSteelToggle(steel.code)}
                        className="rounded border-gray-300 text-[#1B5672] focus:ring-[#1B5672]"
                      />
                      <span className="text-sm text-gray-700">{steel.code}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações Especiais
            </label>
            <textarea
              value={formData.special_notes}
              onChange={(e) => setFormData({ ...formData, special_notes: e.target.value })}
              rows={3}
              placeholder="Observações, cuidados especiais, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5672] focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 -mb-6 pb-6">
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
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
