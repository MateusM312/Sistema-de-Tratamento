import { useEffect, useState } from 'react';
import { supabase, SteelType } from '../lib/supabase';
import { Package, Trash2 } from 'lucide-react';

export default function SteelTypeList() {
  const [steelTypes, setSteelTypes] = useState<SteelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadSteelTypes();
  }, []);

  const loadSteelTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('steel_types')
        .select('*')
        .order('code', { ascending: true });

      if (error) throw error;
      setSteelTypes(data || []);
    } catch (err) {
      console.error('Erro ao carregar tipos de aço:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Tem certeza que deseja excluir o aço ${code}?`)) {
      return;
    }

    setDeleting(id);
    try {
      const { error } = await supabase
        .from('steel_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSteelTypes(steelTypes.filter(steel => steel.id !== id));
    } catch (err: any) {
      alert(`Erro ao excluir: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DA291C]"></div>
      </div>
    );
  }

  if (steelTypes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">Nenhum tipo de aço cadastrado</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {steelTypes.map((steel) => (
        <div
          key={steel.id}
          className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow relative group"
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-bold text-gray-900">{steel.code}</h4>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium bg-[#1B5672] bg-opacity-10 text-[#1B5672] rounded">
                {steel.category}
              </span>
              <button
                onClick={() => handleDelete(steel.id, steel.code)}
                disabled={deleting === steel.id}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600">{steel.name}</p>
        </div>
      ))}
    </div>
  );
}
