import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';
import { Upload, Search, UserPlus, Trash2, Edit, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Papa from 'papaparse';
import { Modal } from '../../components/ui/Modal';

type GuestRow = {
  id: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  type: string | null;
  confirmation_status: string;
  group_name: string;
};

const columnHelper = createColumnHelper<GuestRow>();

export const Guests = () => {
  const [data, setData] = useState<GuestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');

  const fetchGuests = async () => {
    setLoading(true);
    const { data: guests, error } = await supabase
      .from('guests')
      .select('*, group:groups(name)');
      
    if (error) {
      toast.error('Erro ao buscar convidados');
    } else {
      const formatted = guests.map(g => ({
        id: g.id,
        first_name: g.first_name,
        last_name: g.last_name,
        phone: g.phone,
        type: g.type,
        confirmation_status: g.confirmation_status,
        group_name: g.group?.name || 'Sem Família',
      }));
      setData(formatted);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const columns = useMemo(() => [
    columnHelper.accessor(row => `${row.first_name} ${row.last_name || ''}`, {
      id: 'name',
      header: 'Nome Completo',
      cell: info => <span className="font-medium text-text-main">{info.getValue()}</span>,
    }),
    columnHelper.accessor('group_name', {
      header: 'Família / Grupo',
      cell: info => <span className="text-sm text-text-muted">{info.getValue()}</span>,
    }),
    columnHelper.accessor('type', {
      header: 'Tipo',
      cell: info => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor('confirmation_status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        if (status === 'confirmed') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle size={14}/> Confirmado</span>;
        if (status === 'declined') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle size={14}/> Recusado</span>;
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700"><Clock size={14}/> Pendente</span>;
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Ações',
      cell: () => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Editar"><Edit size={16} /></button>
          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Excluir"><Trash2 size={16} /></button>
        </div>
      ),
    })
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        toast.success(`${results.data.length} registros lidos do CSV.`);
        console.log(results.data);
      }
    });
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newGuestName.trim().length < 2) return;
    setIsAdding(true);
    
    // 1. Create group
    const lastName = newGuestName.split(' ').length > 1 ? newGuestName.split(' ').pop() : newGuestName;
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .insert({ name: `Família ${lastName}`, type: 'Outros' })
      .select()
      .single();
      
    if (groupError || !groupData) {
      toast.error('Erro ao criar família.');
      setIsAdding(false);
      return;
    }
    
    // 2. Create guest
    const firstName = newGuestName.split(' ')[0];
    const restName = newGuestName.split(' ').slice(1).join(' ');
    
    const { error: guestError } = await supabase
      .from('guests')
      .insert({
        first_name: firstName,
        last_name: restName,
        group_id: groupData.id,
        type: 'Titular'
      });
      
    if (guestError) {
      toast.error('Erro ao cadastrar convidado.');
    } else {
      toast.success('Convidado adicionado!');
      setIsAddModalOpen(false);
      setNewGuestName('');
      fetchGuests();
    }
    setIsAdding(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text-main">Convidados</h1>
          <p className="text-text-muted mt-1">Gerencie a lista de convidados e confirmações de presença.</p>
        </div>
        
        <div className="flex gap-3">
          <label className="cursor-pointer bg-white border border-border-light text-text-main px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-bg-secondary transition-colors shadow-sm">
            <Upload size={16} />
            Importar CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-accent text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-accent/90 transition-colors shadow-sm"
          >
            <UserPlus size={16} />
            Novo Convidado
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border-light flex justify-between items-center bg-bg-secondary/30">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou família..." 
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-bg-secondary border-b border-border-light">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-text-muted">Carregando convidados...</td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-text-muted">Nenhum convidado encontrado.</td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-border-light hover:bg-bg-secondary/50 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="py-4 px-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border-light flex items-center justify-between bg-bg-secondary/30">
          <span className="text-sm text-text-muted">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount() || 1}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 border border-border-light rounded-md text-sm font-medium bg-white disabled:opacity-50 hover:bg-bg-secondary transition-colors"
            >
              Anterior
            </button>
            <button 
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 border border-border-light rounded-md text-sm font-medium bg-white disabled:opacity-50 hover:bg-bg-secondary transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h3 className="font-heading text-2xl text-accent mb-2">Novo Convidado</h3>
        <p className="text-text-muted text-sm mb-6">Cadastre um convidado para que ele possa realizar a busca inteligente no convite.</p>
        
        <form onSubmit={handleAddGuest} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Nome Completo</label>
            <input 
              type="text" 
              required
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              className="w-full px-4 py-3 bg-bg-secondary/50 border border-border-light rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Ex: João da Silva"
            />
          </div>
          <button 
            type="submit"
            disabled={isAdding}
            className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-accent/90 transition-colors mt-2"
          >
            {isAdding ? 'Cadastrando...' : 'Cadastrar Convidado'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
